"use server";

import Stripe from "stripe";
import { env } from "~/env";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil",
});

export type PriceId = "small" | "medium" | "large";

const PRICE_IDS: Record<PriceId, string> = {
  small: env.STRIPE_SMALL_CREDIT_PACK,
  medium: env.STRIPE_MEDIUM_CREDIT_PACK,
  large: env.STRIPE_LARGE_CREDIT_PACK,
};

export type CheckoutResult = { url: string } | { error: string };

export async function createCheckoutSession(priceId: PriceId): Promise<CheckoutResult> {
  try {
    const serverSession = await auth();
    if (!serverSession?.user?.id) {
      return { error: "Please sign in to purchase credits." };
    }

    const user = await db.user.findUniqueOrThrow({
      where: {
        id: serverSession.user.id,
      },
      select: { stripeCustomerId: true, email: true },
    });

    let customerId = user.stripeCustomerId;
    if (!customerId && user.email) {
      const customer = await stripe.customers.create({
        email: user.email,
      });
      customerId = customer.id;
      await db.user.update({
        where: { id: serverSession.user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    if (!customerId) {
      return { error: "Your account has no email. Please add an email to purchase credits." };
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: PRICE_IDS[priceId], quantity: 1 }],
      customer: customerId,
      mode: "payment",
      success_url: `${env.BASE_URL}/dashboard?success=true`,
      cancel_url: `${env.BASE_URL}/dashboard/billing`,
    });

    if (!session.url) {
      return { error: "Failed to create checkout session. Please try again." };
    }

    return { url: session.url };
  } catch (err) {
    console.error("Stripe checkout error:", err);
    const message = err instanceof Error ? err.message : "Something went wrong";
    return { error: message };
  }
}

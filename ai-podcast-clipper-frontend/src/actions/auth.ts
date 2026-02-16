"use server";

import { hashPassword } from "~/lib/auth";
import { signupSchema, type SignupFormValues } from "~/schemas/auth";
import { db } from "~/server/db";
import Stripe from "stripe";
import { env } from "~/env";

type SignupResult = {
  success: boolean;
  error?: string;
};

export async function signUp(data: SignupFormValues): Promise<SignupResult> {
  const validationResult = signupSchema.safeParse(data);
  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { email, password } = validationResult.data;

  try {
    const existingUser = await db.user.findUnique({ where: { email } });

    if (existingUser) {
      return {
        success: false,
        error: "Email already in use",
      };
    }

    const hashedPassword = await hashPassword(password);

    let stripeCustomerId: string | null = null;
    const hasValidStripeKey =
      env.STRIPE_SECRET_KEY?.startsWith("sk_") ?? false;

    if (hasValidStripeKey) {
      try {
        const stripe = new Stripe(env.STRIPE_SECRET_KEY);
        const stripeCustomer = await stripe.customers.create({
          email: email.toLowerCase(),
        });
        stripeCustomerId = stripeCustomer.id;
      } catch (stripeError) {
        console.error("[signup] Stripe customer creation failed:", stripeError);
        return {
          success: false,
          error: "Payment setup failed. Please try again or contact support.",
        };
      }
    }

    await db.user.create({
      data: {
        email,
        password: hashedPassword,
        ...(stripeCustomerId && { stripeCustomerId }),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("[signup] Error:", error);
    return { success: false, error: "An error occurred during signup" };
  }
}

import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Stripe from "stripe";
import { env } from "~/env";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
const stripe =
  env.STRIPE_SECRET_KEY?.startsWith("sk_")
    ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2025-04-30.basil" })
    : null;

export const authConfig = {
  providers: [
    ...(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET
      ? [
          GoogleProvider({
            clientId: env.AUTH_GOOGLE_ID,
            clientSecret: env.AUTH_GOOGLE_SECRET,
          }),
        ]
      : []),
  ],
  session: { strategy: "jwt" },
  adapter: PrismaAdapter(db),
  callbacks: {
    signIn: async ({ user }) => {
      if (!user.email || !stripe) return true;

      const dbUser = await db.user.findUnique({
        where: { email: user.email },
        select: { stripeCustomerId: true },
      });

      if (dbUser?.stripeCustomerId) return true;

      try {
        const customer = await stripe.customers.create({
          email: user.email.toLowerCase(),
          name: user.name ?? undefined,
        });
        await db.user.update({
          where: { email: user.email },
          data: { stripeCustomerId: customer.id },
        });
      } catch (err) {
        console.error("[auth] Stripe customer creation failed:", err);
      }
      return true;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;

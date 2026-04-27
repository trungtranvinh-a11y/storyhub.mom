import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { authSecret } from "@/lib/env";
import { authenticateUser } from "@/services/auth-service";
import { loginSchema } from "@/validation/auth-schemas";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: authSecret,
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        return authenticateUser(parsed.data);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.name = token.name ?? session.user.name ?? "";
        session.user.email = token.email ?? session.user.email ?? "";
      }

      return session;
    },
  },
};

import type { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

interface customUser extends User {
  token: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    profile_photo: string | null;
    status: string;
    role: string;
    address_line_1: string;
    address_line_2: string | null;
    pincode: number;
    city: string;
    state: string;
    age: number | null;
    gender: string | null;
    coins: number;
  };
}

interface CustomToken extends JWT {
  accessToken?: string;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    profile_photo: string | null;
    status: string;
    role: string;
    address_line_1: string;
    address_line_2: string | null;
    pincode: number;
    city: string;
    state: string;
    age: number | null;
  };
}

interface CustomSession extends Session {
  accessToken?: string;
}
export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        isToken: { label: "Is Token", type: "text" },
        data: { label: "Data", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.isToken)
          try {
            return JSON.parse(credentials.data);
            // eslint-disable-next-line brace-style
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Failed to parse credentials data:", error);
          }

        return null;
      },
    }),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user)
        return {
          ...token,
          accessToken: (user as customUser).token,
          user: (user as customUser).user,
        };

      return token;
    },
    async session({ session, token }) {
      (session as CustomSession).accessToken = (
        token as CustomToken
      ).accessToken;
      (session as CustomSession).user = (token as CustomToken).user;
      return session;
    },
  },
};

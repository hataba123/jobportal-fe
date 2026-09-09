import {
  type NextAuthOptions,
  type Session,
  type User as NextAuthUser,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import axiosInstance from "@/lib/axiosInstance";
import type { SessionStrategy } from "next-auth";
import type { JWT } from "next-auth/jwt";

type BackendUser = {
  id: string;
  email: string;
  fullName: string;
  role: number;
};

type OAuthUser = NextAuthUser & {
  jwt?: string;
  backendUser?: BackendUser;
};

type OAuthToken = JWT & {
  jwt?: string;
  backendUser?: BackendUser;
};

type OAuthSession = Session & {
  jwt?: string;
  backendUser?: BackendUser;
};

type OAuthResponse = {
  token: string;
  user: BackendUser;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (!email || !password) return null;

        const backendUrl = process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
        if (!backendUrl) return null;

        const response = await fetch(`${backendUrl.replace(/\/$/, "")}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          cache: "no-store",
        });
        if (!response.ok) return null;

        const data = (await response.json()) as OAuthResponse;
        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.fullName,
          jwt: data.token,
          backendUser: data.user,
        } as OAuthUser;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account?.provider || !account.access_token) {
        return false;
      }

      try {
        const response = await axiosInstance.post<OAuthResponse>(
          "/auth/oauth-login",
          {
            provider: account.provider,
            accessToken: account.access_token,
            idToken: account.id_token,
          },
          {
            headers: {
              "x-oauth-exchange-secret": process.env.OAUTH_EXCHANGE_SECRET ?? "",
            },
          }
        );

        const oauthUser = user as OAuthUser;
        oauthUser.jwt = response.data.token;
        oauthUser.backendUser = response.data.user;
        return true;
      } catch (error: unknown) {
        console.error("OAuth login failed", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      const oauthToken = token as OAuthToken;
      const oauthUser = user as OAuthUser | undefined;
      if (oauthUser?.jwt) {
        oauthToken.jwt = oauthUser.jwt;
        oauthToken.backendUser = oauthUser.backendUser;
      }
      return oauthToken;
    },
    async session({ session, token }) {
      const oauthSession = session as OAuthSession;
      const oauthToken = token as OAuthToken;
      oauthSession.backendUser = oauthToken.backendUser;
      return oauthSession;
    },
    async redirect({ url, baseUrl }) {
      const match = url.match(/([\/](en|vi)[\/])/);
      const locale = match ? match[2] : "en";
      if (url.includes("/candidate/auth/login")) {
        return `${baseUrl}/${locale}/candidate/auth/login`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  pages: {
    signIn: "/candidate/auth/login",
  },
  debug: process.env.NODE_ENV === "development",
};

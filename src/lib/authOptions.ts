import {
  type NextAuthOptions,
  type Session,
  type User as NextAuthUser,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
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
      if (!account?.provider || !account.providerAccountId || !user.email) {
        return false;
      }

      try {
        const response = await axiosInstance.post<OAuthResponse>(
          "/auth/oauth-login",
          {
            email: user.email,
            name: user.name ?? user.email.split("@")[0],
            provider: account.provider,
            providerAccountId: account.providerAccountId,
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
      oauthSession.jwt = oauthToken.jwt;
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

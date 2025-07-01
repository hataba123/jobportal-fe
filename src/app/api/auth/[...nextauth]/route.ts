import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import axiosInstance from "@/lib/axiosInstance";
import type { SessionStrategy } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
  ],

  callbacks: {
    async signIn(params) {
      const { user, account } = params;

      // Add logging to debug OAuth issues
      console.log("OAuth signIn attempt:", {
        provider: account?.provider,
        email: user.email,
        name: user.name,
      });

      try {
        const res = await axiosInstance.post("/auth/oauth-login", {
          email: user.email,
          name: user.name,
          provider: account?.provider,
          providerAccountId: account?.providerAccountId,
        });
        console.log("✅ Backend responded:", res.data);

        (user as any).jwt = res.data.token;
        (user as any).backendUser = res.data.user;
        return true;
      } catch (error: any) {
        console.error(
          "❌ OAuth login failed:",
          error.response?.data || error.message
        );
        return false;
      }
    },
    async jwt(params) {
      const { token, user } = params;
      if (user && (user as any).jwt) {
        (token as any).jwt = (user as any).jwt;
        (token as any).backendUser = (user as any).backendUser;
      }
      return token;
    },
    async session(params) {
      const { session, token } = params;
      (session as any).jwt = (token as any).jwt;
      (session as any).backendUser = (token as any).backendUser;
      return session;
    },
    async redirect(params) {
      const { url, baseUrl } = params;
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

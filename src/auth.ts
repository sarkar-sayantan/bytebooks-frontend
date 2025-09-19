import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { userService } from "./services/user";
import { serverUserService } from "./services/serverUser";
export const {handlers, signIn, signOut, auth} = NextAuth({
  providers: [
    Google
  ],
  secret: process.env.SESSION_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user}) {
      console.log("JWT CALLBACK - Token:", token);
      if (user) {
        // First login
        const dbUser = await serverUserService.getUserByEmail(user.email!);
        if (dbUser) {
          token.id = dbUser.id;
          token.tenantId = dbUser.tenantId;
        }
      } else if (!token.tenantId && token.email) {
        // For subsequent requests, fallback if tenantId missing
        const dbUser = await serverUserService.getUserByEmail(token.email as string);
        console.log("JWT CALLBACK - Fetched DB User:", dbUser);
        if (dbUser) {
          token.id = dbUser.id;
          token.tenantId = dbUser.tenantId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      console.log("SESSION CALLBACK - Token:", token);
      if (token) {
        session.user.accessToken = token?.accessToken as string;
        session.user.id = token?.id as string;
        session.user.tenantId = token.tenantId as string | undefined;
      }
      return session;
    },
  },
});



import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const {handlers, signIn, signOut, auth} = NextAuth({
  providers: [
    Google
  ],
  secret: process.env.SESSION_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
});



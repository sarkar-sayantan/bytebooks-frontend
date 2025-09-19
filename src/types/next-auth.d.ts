import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      accessToken?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    tenantId?: string;
    accessToken?: string;
  }

  interface JWT {
    id?: string;
    tenantId?: string;
    accessToken?: string;
  }
}

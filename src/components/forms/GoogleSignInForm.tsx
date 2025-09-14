
"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button"
import { use } from "react";

export default function GoogleSignIn() {
  return (
    <form action={async () => {
        //"use server";
        await signIn("google");
      }}>
      <Button
        type="submit"
        variant="outline"
        size="lg"
        className="w-full flex items-center justify-center gap-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      >
        <svg width="20" height="20" viewBox="0 0 48 48" className="mr-2">
          <g>
            <path fill="#4285F4" d="M24 9.5c3.54 0 6.73 1.22 9.24 3.22l6.92-6.92C36.18 2.16 30.45 0 24 0 14.61 0 6.13 5.64 1.82 14.02l8.06 6.27C12.36 13.36 17.73 9.5 24 9.5z"/>
            <path fill="#34A853" d="M46.09 24.56c0-1.64-.15-3.22-.43-4.76H24v9.04h12.44c-.54 2.92-2.18 5.39-4.66 7.05l7.25 5.64C43.87 37.36 46.09 31.44 46.09 24.56z"/>
            <path fill="#FBBC05" d="M9.88 28.29c-.54-1.62-.85-3.34-.85-5.29s.31-3.67.85-5.29l-8.06-6.27C.31 15.33 0 19.56 0 24s.31 8.67 1.82 12.56l8.06-6.27z"/>
            <path fill="#EA4335" d="M24 48c6.45 0 12.18-2.16 16.16-5.92l-7.25-5.64c-2.01 1.35-4.59 2.16-8.91 2.16-6.27 0-11.64-3.86-13.98-9.29l-8.06 6.27C6.13 42.36 14.61 48 24 48z"/>
          </g>
        </svg>
        Sign in with Google
      </Button>
      </form>
  )
}
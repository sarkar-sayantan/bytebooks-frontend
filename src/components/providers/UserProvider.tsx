"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { userService } from "@/services/user";
import { useRouter } from "next/navigation";

export default function UserProvider() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function syncUser() {
      if (status === "authenticated" && session?.user?.email) {
        const user = await userService.getUserByEmail(session.user.email);
        if (user) return;

        const employee = await userService.getEmployeeByEmail(session.user.email);
        if (employee) {
          await userService.createUser({
            name: employee.name,
            email: employee.email,
            phone: employee.phone,
            tenantId: employee.tenantId,
            role: "EMPLOYEE",
          });
          return;
        }

        router.push("/onboarding"); // or your custom page
      }
    }
    syncUser();
  }, [session, status, router]);

  return null;
}
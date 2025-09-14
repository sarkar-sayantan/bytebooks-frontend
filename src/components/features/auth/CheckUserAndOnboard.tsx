"use client";
import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/services/apiClient"; // your axios/fetch wrapper
import OnboardingPage from "@/app/onboarding/page"; // your onboarding UI component (as in previous code)
import { userService } from "@/services/user";
import { Employee, User } from "@/types";
import { employeesService } from "@/services/employees";
import { Home } from "lucide-react";
import HomePage from "@/app/page";
import OnboardingForm from "@/components/forms/OnboardingForm";
import { setGlobalTenantId } from "@/components/providers/TenantProvider";

export default function CheckUserAndOnboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") {
      setChecking(false);
      router.push("/");
      return;
    }

    let mounted = true;

    (async () => {
      setChecking(true);
      setError(null);

      const email = session?.user?.email;
      if (!email) {
        setError("No email found on session.");
        setChecking(false);
        return;
      }

      try {
        const existingUser: User | null = await userService.getUserByEmail(email); // backend should resolve user by token/session
        if (existingUser && existingUser.role) {
          router.push("/dashboard");
          return;
        }
      } catch (err: any) {
        const statusCode =
          err?.response?.status ?? err?.status ?? (err?.message?.includes("404") ? 404 : null);
        if (statusCode && Number(statusCode) !== 404) {
          // not a 404 — a genuine error occurred
          console.error("Error checking user:", err);
          setError("Failed to check user. Please try again.");
          setChecking(false);
          return;
        }
      }

      try {
        // We expect an endpoint like: GET /employees/find-by-email?email=<email>
        // which returns 200 + employee JSON if found, or 404 if not found.
        const employee: Employee | null = await employeesService.getEmployeesByEmail(email);

        if (employee && employee.tenantId) {
          // 3) Employee exists — auto-create user with role EMPLOYEE
          try {
            setGlobalTenantId(employee.tenantId);
            const newUserPayload = {
              tenantId: employee.tenantId,
              name: session?.user?.name ?? undefined,
              email: email,
              image: session?.user?.image ?? undefined,
              role: "EMPLOYEE",
            };

            const createdUser: User = await userService.createUser(newUserPayload); 

            if (createdUser && createdUser.id) {
              // Created successfully — redirect to dashboard
              router.push("/dashboard");
              return;
            } else {
              console.error("User creation returned unexpected payload:", createdUser);
              setError("Failed to create user automatically. Please contact admin.");
              setChecking(false);
              return;
            }
          } catch (createErr) {
            console.error("Error creating user from employee record:", createErr);
            setError("Failed to create user account automatically. Please contact admin.");
            setChecking(false);
            return;
          }
        } else {
          // employee not found -> show onboarding form
          setShowOnboarding(true);
        }
      } catch (empErr: any) {
        // If endpoint returns 404 or not found, we fall through to onboarding
        const empStatus = empErr?.response?.status ?? empErr?.status ?? null;
        if (empStatus === 404 || empStatus === null) {
          // not an employee -> show onboarding
          setShowOnboarding(true);
        } else {
          console.error("Error checking employee:", empErr);
          setError("Failed to check employee status. Try again later.");
        }
      } finally {
        if (mounted) setChecking(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [status, router]);

  // UX states
  if (status === "loading" || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Checking account…</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <HomePage />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  // If we reach here, user is not yet a User and not an Employee → render onboarding form
  if (showOnboarding) {
    return <OnboardingForm />;
  }

  // Shouldn't reach here normally; fallback
  return null;
}

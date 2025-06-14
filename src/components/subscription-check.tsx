"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkUserSubscription } from "@/app/actions";
import { createClient } from "@/supabase/client";

interface SubscriptionCheckProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiredRole?: string | string[];
}

export function SubscriptionCheck({
  children,
  redirectTo = "/pricing",
  requiredRole,
}: SubscriptionCheckProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/sign-in");
          return;
        }

        // Get user data including role
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        const userRole = userData?.role;

        // Allow admin users to bypass subscription check and role requirements
        if (userRole === "Administrator") {
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }

        // Check if user has required role
        if (requiredRole) {
          const requiredRoles = Array.isArray(requiredRole)
            ? requiredRole
            : [requiredRole];
          if (!userRole || !requiredRoles.includes(userRole)) {
            router.push("/dashboard");
            return;
          }
        }

        const isSubscribed = await checkUserSubscription(user.id);

        // Allow access for users without subscription (free plan)
        // Only redirect to pricing if explicitly required by the component
        if (!isSubscribed && redirectTo !== "/dashboard") {
          // For free plan users, allow access to basic features
          // Only redirect if accessing premium features
          const isPremiumFeature =
            requiredRole &&
            !["Buyer", "owner", "Builder"].includes(
              Array.isArray(requiredRole) ? requiredRole[0] : requiredRole,
            );

          if (isPremiumFeature) {
            router.push(redirectTo);
            return;
          }
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Error checking subscription:", error);
        router.push("/sign-in");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole, redirectTo, router, supabase]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

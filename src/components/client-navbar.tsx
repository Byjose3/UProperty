"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import UserProfile from "./user-profile";
import { createClient } from "../supabase/client";

export default function ClientNavbar({
  isLoggedIn = false,
}: {
  isLoggedIn?: boolean;
}) {
  const [authStatus, setAuthStatus] = useState<boolean>(isLoggedIn);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        setAuthStatus(!!data.session);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setAuthStatus(false);
      } finally {
        setLoading(false);
      }
    };

    // Only check auth status if isLoggedIn prop wasn't explicitly provided
    if (isLoggedIn === false) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  return <></>;
}

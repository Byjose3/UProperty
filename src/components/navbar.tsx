import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { Home, UserCircle } from "lucide-react";
import UserProfile from "./user-profile";

export default async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user data including role if user is logged in
  let userRole = null;
  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    userRole = userData?.role || null;
  }

  // Determine dashboard link based on user role
  const getDashboardLink = () => {
    if (!userRole) return "/dashboard";

    switch (userRole) {
      case "Administrator":
        return "/dashboard/admin";
      case "owner":
      case "Buyer":
      case "Agency":
      case "Builder":
      case "Investor":
        return "/dashboard";
      default:
        return "/dashboard";
    }
  };

  return <></>;
}

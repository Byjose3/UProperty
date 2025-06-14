"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Home, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";

export default function ClientSideNavbar() {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient();

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Get user data including role
          const { data: userData } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single();

          setUserRole(userData?.role || null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Determine dashboard link based on user role
  const getDashboardLink = () => {
    if (!userRole) return "/dashboard";

    switch (userRole) {
      case "Administrator":
      case "administrador":
        return "/dashboard/admin";
      case "owner":
      case "proprietario(a)":
      case "Buyer":
      case "comprador(a)":
      case "Agency":
      case "Builder":
      case "Investor":
        return "/dashboard";
      default:
        return "/dashboard";
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold text-blue-600 mr-8">
          RealEstatePro
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-600 hover:text-blue-600">
            Home
          </Link>
          <Link
            href="/properties"
            className="text-gray-600 hover:text-blue-600"
          >
            Properties
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-blue-600">
            Pricing
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-blue-600">
            About
          </Link>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        {!loading && (
          <>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href={getDashboardLink()}>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <UserCircle className="h-6 w-6" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/sign-in">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Bell, Search, Building } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "../../../supabase/client";
import UserProfile from "../user-profile";

interface UnifiedTopbarProps {
  isSidebarCollapsed?: boolean;
  userRole?: string;
  userName?: string;
  searchQuery?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoggedIn?: boolean;
  showSearch?: boolean;
  showMarketButton?: boolean;
  showNotifications?: boolean;
  variant?: "dashboard" | "client";
}

export default function UnifiedTopbar({
  isSidebarCollapsed = false,
  userRole,
  userName,
  searchQuery = "",
  onSearchChange,
  isLoggedIn = true,
  showSearch = true,
  showMarketButton = true,
  showNotifications = true,
  variant = "dashboard",
}: UnifiedTopbarProps) {
  const [authStatus, setAuthStatus] = useState<boolean>(isLoggedIn);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
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
  }, [isLoggedIn, supabase]);

  // Dashboard variant topbar
  if (variant === "dashboard") {
    return (
      <div
        className={`flex items-center justify-between bg-white p-4 border-b fixed top-0 right-0 z-50 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? "w-[calc(100%-4rem)] ml-16" : "w-[calc(100%-16rem)] ml-64"}`}
      >
        {showSearch && (
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2"
              placeholder="Pesquisar..."
              value={searchQuery}
              onChange={onSearchChange}
            />
          </div>
        )}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 mr-2 gap-x-4">
            {showMarketButton && (
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <Building className="h-4 w-4 text-gray-600" />
                  <span>Market</span>
                </Button>
              </Link>
            )}
            {showNotifications && (
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  2
                </span>
              </Button>
            )}
          </div>
          <div className="bg-gray-100 h-8 w-px mx-2"></div>
          <UserProfile />
        </div>
      </div>
    );
  }

  // Client variant topbar (for public pages)
  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="text-xl font-bold text-blue-600">
          RealEstatePro
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          <Link
            href="/pricing"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Pricing
          </Link>
          <Link
            href="#features"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Features
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          {loading ? (
            <div className="h-9 w-20 bg-gray-200 animate-pulse rounded-md"></div>
          ) : authStatus ? (
            <>
              <Link href="/dashboard">
                <Button variant="default" size="default">
                  Dashboard
                </Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

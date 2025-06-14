"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import { useEffect, useState } from "react";
import {
  Home,
  Users,
  Building,
  MessageSquare,
  Settings,
  BarChart3,
  Calendar,
  LogOut,
  HelpCircle,
  HeadphonesIcon,
  CreditCard,
} from "lucide-react";

type UserRole =
  | "administrator"
  | "owner"
  | "buyer"
  | "agency"
  | "builder"
  | "investor"
  | null;

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

export default function Sidebar({ onToggle }: SidebarProps = {}) {
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);
  const supabase = createClient();
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const getUserRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Fetch user role from profile
        const { data } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        if (data) {
          setUserRole(data.role as UserRole);
        }
      }
    };

    getUserRole();
  }, []);

  // Handle sidebar toggle and dispatch custom event
  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    // Call the onToggle prop if provided
    if (onToggle) {
      onToggle(newState);
    }

    // Dispatch custom event for components that don't have direct prop access
    const event = new CustomEvent("sidebar-toggle", {
      detail: { collapsed: !newState },
    });
    window.dispatchEvent(event);
  };

  // Common navigation items for all users
  const commonNavItems = [
    {
      name: "Dashboard",
      href: userRole === "administrator" ? "/dashboard/admin" : "/dashboard",
      icon: Home,
    },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  // Role-specific navigation items
  const roleNavItems = {
    administrator: [
      { name: "Users", href: "/dashboard/admin/users", icon: Users },
      {
        name: "Analytics",
        href: "/dashboard/admin/analytics",
        icon: BarChart3,
      },
      {
        name: "System Settings",
        href: "/dashboard/admin/settings",
        icon: Settings,
      },
    ],
    owner: [
      {
        name: "My Listings",
        href: "/dashboard/owner/listings",
        icon: Building,
      },
      {
        name: "Inquiries",
        href: "/dashboard/owner/inquiries",
        icon: MessageSquare,
      },
      { name: "Schedule", href: "/dashboard/owner/schedule", icon: Calendar },
    ],
    buyer: [
      {
        name: "Browse Properties",
        href: "/dashboard/buyer/browse",
        icon: Building,
      },
      {
        name: "Saved Properties",
        href: "/dashboard/buyer/saved",
        icon: Building,
      },
      {
        name: "Visit Requests",
        href: "/dashboard/buyer/visits",
        icon: Calendar,
      },
    ],
    agency: [
      { name: "Agents", href: "/dashboard/agency/agents", icon: Users },
      {
        name: "Properties",
        href: "/dashboard/agency/properties",
        icon: Building,
      },
      {
        name: "Analytics",
        href: "/dashboard/agency/analytics",
        icon: BarChart3,
      },
    ],
    builder: [
      { name: "Projects", href: "/dashboard/builder/projects", icon: Building },
      {
        name: "Developments",
        href: "/dashboard/builder/developments",
        icon: Building,
      },
      {
        name: "Site Visits",
        href: "/dashboard/builder/visits",
        icon: Calendar,
      },
    ],
    investor: [
      {
        name: "Investment Properties",
        href: "/dashboard/investor/properties",
        icon: Building,
      },
      {
        name: "ROI Calculator",
        href: "/dashboard/investor/calculator",
        icon: BarChart3,
      },
      {
        name: "Portfolio",
        href: "/dashboard/investor/portfolio",
        icon: BarChart3,
      },
    ],
  };

  // Combine common items with role-specific items
  const navItems = [
    ...commonNavItems,
    ...(userRole && roleNavItems[userRole] ? roleNavItems[userRole] : []),
  ];

  // Show sidebar on all pages except auth pages
  if (
    pathname.includes("/sign-in") ||
    pathname.includes("/sign-up") ||
    pathname.includes("/forgot-password")
  ) {
    return null;
  }

  return (
    <div
      className={`${isOpen ? "w-64" : "w-20"} bg-white border-r border-gray-200 h-screen fixed transition-all duration-300 z-10`}
    >
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <div
          className={`${isOpen ? "block" : "hidden"} text-xl font-bold text-blue-600`}
        >
          UPropertyMarket
        </div>
        <button
          onClick={handleToggle}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          )}
        </button>
      </div>
      <nav className="p-4 flex flex-col h-[calc(100vh-70px)] justify-between">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-2 rounded-md ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <Icon className="h-5 w-5" />
                  {isOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto border-t border-gray-200 pt-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className={`flex items-center p-2 rounded-md ${pathname === "/" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <Home className="h-5 w-5" />
                {isOpen && <span className="ml-3">Home</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/pricing"
                className={`flex items-center p-2 rounded-md ${pathname === "/pricing" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <BarChart3 className="h-5 w-5" />
                {isOpen && <span className="ml-3">Pricing</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/help"
                className={`flex items-center p-2 rounded-md ${pathname === "/help" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <HelpCircle className="h-5 w-5" />
                {isOpen && <span className="ml-3">Help</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/support"
                className={`flex items-center p-2 rounded-md ${pathname === "/support" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <HeadphonesIcon className="h-5 w-5" />
                {isOpen && <span className="ml-3">Suporte</span>}
              </Link>
            </li>
            {isOpen && (
              <li className="mt-4">
                <div className="bg-blue-50 p-3 rounded-md">
                  <div className="flex items-center text-blue-600 mb-1">
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Plano Atual</span>
                  </div>
                  <div className="text-sm text-gray-700">Premium</div>
                </div>
              </li>
            )}
            <li className="mt-4">
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/sign-in";
                }}
                className="flex items-center p-2 rounded-md w-full text-left text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5" />
                {isOpen && <span className="ml-3">Sign Out</span>}
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import HelpCenter from "./HelpCenter";
import ReferralButton from "./ReferralButton";
import {
  Home,
  Search,
  MessageSquare,
  Calendar,
  Heart,
  Map,
  CalendarClock,
  CalendarDays,
} from "lucide-react";

interface BuyerSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  subscriptionType?: "monthly" | "annual";
}

export default function BuyerSidebar({
  activeTab = "dashboard",
  onTabChange = () => {},
  isCollapsed,
  onToggleCollapse,
  subscriptionType = "monthly", // Add subscription type prop with default value
}: BuyerSidebarProps & { subscriptionType?: "monthly" | "annual" }) {
  const navItems = [
    { name: "Painel", icon: Home, id: "dashboard", path: "/dashboard" },
    {
      name: "Mensagens",
      icon: MessageSquare,
      id: "messages",
      path: "/dashboard/buyer/messages",
    },
    {
      name: "Visitas Agendadas",
      icon: Calendar,
      id: "visits",
      path: "/dashboard/buyer/visits",
    },
    {
      name: "Favoritos",
      icon: () => (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ),
      id: "favorites",
      path: "/dashboard/buyer/favorites",
    },
    { name: "Mapa", icon: Map, id: "map", path: "/dashboard/buyer/map" },
  ];

  return (
    <DashboardSidebar
      activeTab={activeTab}
      onTabChange={onTabChange}
      isCollapsed={isCollapsed}
      onToggleCollapse={onToggleCollapse}
      userRole="Buyer"
      navItems={navItems}
      middleContent={
        <>
          <div className="border-t border-gray-200 my-4"></div>
          <ReferralButton isCollapsed={isCollapsed} className="py-0 px-0" />
          {!isCollapsed && (
            <>
              <div className="border-t border-gray-200 my-4"></div>
              <p className="text-sm text-gray-500 mb-2 ml-1">Plano Atual</p>
              <div className="flex items-center space-x-2 mb-4 text-sm font-medium">
                {subscriptionType === "monthly" ? (
                  <CalendarClock className="h-4 w-4 text-blue-500" />
                ) : (
                  <CalendarDays className="h-4 w-4 text-green-500" />
                )}
                <span className="font-medium">
                  Premium {subscriptionType === "monthly" ? "Mensal" : "Anual"}
                </span>
              </div>
            </>
          )}
        </>
      }
      footerContent={<HelpCenter isCollapsed={isCollapsed} />}
    />
  );
}

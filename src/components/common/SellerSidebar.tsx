"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import HelpCenter from "./HelpCenter";
import ReferralButton from "./ReferralButton";
import {
  Home,
  Building,
  MessageSquare,
  Calendar,
  CalendarClock,
  CalendarDays,
} from "lucide-react";

interface OwnerSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  subscriptionType?: "monthly" | "annual";
}

export default function OwnerSidebar({
  activeTab = "dashboard",
  onTabChange = () => {},
  isCollapsed,
  onToggleCollapse,
  subscriptionType = "monthly", // Add subscription type prop with default value
}: OwnerSidebarProps & { subscriptionType?: "monthly" | "annual" }) {
  const navItems = [
    { name: "Painel", icon: Home, id: "dashboard", path: "/dashboard" },
    {
      name: "Propriedades",
      icon: Building,
      id: "properties",
      path: "/dashboard/owner/propriedades",
    },
    {
      name: "Mensagens",
      icon: MessageSquare,
      id: "messages",
      path: "/dashboard/owner/mensagens",
    },
    {
      name: "Agenda de Visitas",
      icon: Calendar,
      id: "visits",
      path: "/dashboard/owner/visitas",
    },
    {
      name: "Guardados",
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
      path: "/dashboard/owner/guardados",
    },
  ];

  return (
    <DashboardSidebar
      activeTab={activeTab}
      onTabChange={onTabChange}
      isCollapsed={isCollapsed}
      onToggleCollapse={onToggleCollapse}
      userRole="Owner"
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

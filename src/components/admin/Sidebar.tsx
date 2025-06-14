"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Home,
  CreditCard,
  LifeBuoy,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  userRole?: string;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  isCollapsed: externalIsCollapsed,
  onToggleCollapse,
  userRole = "Admin",
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(externalIsCollapsed || false);

  // Sync with external state if provided
  useEffect(() => {
    if (externalIsCollapsed !== undefined) {
      setIsCollapsed(externalIsCollapsed);
    }
  }, [externalIsCollapsed]);

  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggleCollapse) {
      onToggleCollapse(newCollapsedState);
    }
  };

  const tabs = [
    {
      id: "overview",
      label: "Visão Geral",
      icon: (
        <LayoutDashboard size={20} className="text-blue-600 min-w-5 min-h-5" />
      ),
    },
    {
      id: "users",
      label: "Utilizadores",
      icon: <Users size={20} className="text-blue-600 min-w-5 min-h-5" />,
    },
    {
      id: "properties",
      label: "Propriedades",
      icon: <Home size={20} className="text-blue-600 min-w-5 min-h-5" />,
    },
    {
      id: "visits",
      label: "Agenda de Visitas",
      icon: <Calendar size={20} className="text-blue-600 min-w-5 min-h-5" />,
    },
    {
      id: "subscriptions",
      label: "Assinaturas",
      icon: <CreditCard size={20} className="text-blue-600 min-w-5 min-h-5" />,
    },
    {
      id: "support",
      label: "Suporte",
      icon: <LifeBuoy size={20} className="text-blue-600 min-w-5 min-h-5" />,
    },
  ];

  return (
    <div
      className={cn(
        "h-[100vh] bg-white border-r border-gray-200 fixed left-0 top-0 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div
        className={cn(
          "p-4 flex items-center",
          isCollapsed ? "justify-center" : "justify-between",
        )}
      >
        {!isCollapsed && (
          <div className="flex items-center">
            <img src="/logo.png" alt="Company Logo" className="h-8 w-auto" />
          </div>
        )}
        <Button
          onClick={handleToggleCollapse}
          variant="ghost"
          size="icon"
          className="text-gray-800 hover:bg-gray-200"
          aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-2 p-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              variant={activeTab === tab.id ? "secondary" : "ghost"}
              className={cn(
                "w-full flex items-center rounded-lg transition-colors",
                isCollapsed ? "justify-center p-2" : "justify-start px-4 py-2",
                activeTab === tab.id
                  ? "bg-blue-100 text-blue-600 hover:bg-blue-100"
                  : "text-gray-800 hover:bg-gray-200",
              )}
              title={isCollapsed ? tab.label : undefined}
            >
              <div
                className={cn(
                  "flex items-center justify-center",
                  activeTab === tab.id ? "text-blue-600" : "text-gray-500",
                  !isCollapsed && "mr-2",
                )}
              >
                {tab.icon}
              </div>
              {!isCollapsed && <span>{tab.label}</span>}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
}

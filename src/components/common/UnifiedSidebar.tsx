"use client";

import Link from "next/link";
import { createClient } from "@/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LifeBuoy,
  Heart,
  User,
  Map,
  Search,
  Filter,
  UserPlus,
} from "lucide-react";
import ReferralButton from "./ReferralButton";
import HelpCenter from "./HelpCenter";
import { useRouter } from "next/navigation";

type UserRole = "Administrador" | "proprietario(a)" | "Comprador(a)" | null;

interface UnifiedSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  userRole?: UserRole;
  variant?: "admin" | "client";
}

interface NavItem {
  name: string;
  icon: any;
  id: string;
  path?: string;
}

export default function UnifiedSidebar({
  activeTab = "dashboard",
  onTabChange = () => {},
  isCollapsed: externalIsCollapsed,
  onToggleCollapse,
  userRole = "Comprador(a)",
  variant = "client",
}: UnifiedSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(externalIsCollapsed || false);
  const [pathname, setPathname] = useState("");
  const [currentPlan, setCurrentPlan] = useState<string>("Premium Mensal");
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    setPathname(window.location.pathname);
    fetchUserSubscription();
  }, []);

  // Fetch user's current subscription plan
  const fetchUserSubscription = async () => {
    try {
      setIsLoadingPlan(true);

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Get user's subscription from the subscriptions table
      const { data: subscriptionData, error: subscriptionError } =
        await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single();

      if (subscriptionError) {
        console.error("Error fetching subscription:", subscriptionError);
        return;
      }

      if (subscriptionData) {
        // If we have price_id, we can get more details about the plan
        if (subscriptionData.price_id) {
          setCurrentPlan(subscriptionData.metadata?.name || "Plano Premium");
        } else if (subscriptionData.stripe_price_id) {
          // Try to get plan name from metadata
          setCurrentPlan(subscriptionData.metadata?.name || "Plano Premium");
        }
      } else {
        // Check if user has an active trial
        const { data: trialData, error: trialError } = await supabase
          .from("trial_periods")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single();

        if (!trialError && trialData) {
          setCurrentPlan("Período de Teste");
        } else {
          setCurrentPlan("Plano Gratuito");
        }
      }
    } catch (error) {
      console.error("Error in fetchUserSubscription:", error);
    } finally {
      setIsLoadingPlan(false);
    }
  };

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

    // Dispatch custom event for components that don't have direct prop access
    const event = new CustomEvent("sidebar-toggle", {
      detail: { collapsed: newCollapsedState },
    });
    window.dispatchEvent(event);
  };

  const handleNavigation = (item: NavItem) => {
    onTabChange(item.id);

    // Navigate to the specific page if path is provided
    if (item.path) {
      router.push(item.path);
    }
  };

  // Role-specific navigation items
  const getRoleNavItems = (): NavItem[] => {
    switch (userRole) {
      case "Administrador":
        return [
          {
            name: "Visão Geral",
            icon: LayoutDashboard,
            id: "overview",
            path: "/dashboard/admin",
          },
          {
            name: "Usuários",
            icon: Users,
            id: "users",
            path: "/dashboard/admin/users",
          },
          {
            name: "Propriedades",
            icon: Building,
            id: "properties",
            path: "/dashboard/admin/properties",
          },
          {
            name: "Mercado",
            icon: Search,
            id: "market",
            path: "/market",
          },
          {
            name: "Agenda de Visitas",
            icon: Calendar,
            id: "visits",
            path: "/dashboard/admin/visits",
          },
          {
            name: "Assinaturas",
            icon: CreditCard,
            id: "subscriptions",
            path: "/dashboard/admin/subscriptions",
          },
          {
            name: "Suporte",
            icon: LifeBuoy,
            id: "support",
            path: "/dashboard/admin/support",
          },
        ];
      case "Proprietário(a)":
        return [
          { name: "Painel", icon: Home, id: "dashboard", path: "/dashboard" },
          {
            name: "Propriedades",
            icon: Building,
            id: "properties",
            path: "/dashboard/owner/properties",
          },
          {
            name: "Mercado",
            icon: Search,
            id: "market",
            path: "/market",
          },
          {
            name: "Mensagens",
            icon: MessageSquare,
            id: "messages",
            path: "/dashboard/owner/messages",
          },
          {
            name: "Agenda de Visitas",
            icon: Calendar,
            id: "visits",
            path: "/dashboard/owner/visitas",
          },
          {
            name: "Favoritos",
            icon: Heart,
            id: "favorites",
            path: "/dashboard/owner/favorites",
          },
        ];
      case "Comprador(a)":
        return [
          { name: "Painel", icon: Home, id: "dashboard", path: "/dashboard" },
          {
            name: "Mercado",
            icon: Search,
            id: "market",
            path: "/market",
          },
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
            icon: Heart,
            id: "favorites",
            path: "/dashboard/buyer/favorites",
          },
          { name: "Mapa", icon: Map, id: "map", path: "/dashboard/buyer/map" },
        ];

      default:
        return [
          {
            name: "Dashboard",
            icon: Home,
            id: "dashboard",
            path: "/dashboard",
          },
          {
            name: "Mercado",
            icon: Search,
            id: "market",
            path: "/market",
          },
          {
            name: "Favoritos",
            icon: Heart,
            id: "favorites",
            path: "/dashboard/favorites",
          },
          {
            name: "Visitas",
            icon: Calendar,
            id: "visits",
            path: "/dashboard/visits",
          },
          {
            name: "Mensagens",
            icon: MessageSquare,
            id: "messages",
            path: "/dashboard/messages",
          },
          {
            name: "Agentes",
            icon: Users,
            id: "agents",
            path: "/dashboard/agents",
          },
        ];
    }
  };

  const navItems = getRoleNavItems();

  // Show sidebar on all pages except auth pages
  if (
    pathname.includes("/sign-in") ||
    pathname.includes("/sign-up") ||
    pathname.includes("/forgot-password")
  ) {
    return null;
  }

  // Admin variant sidebar
  if (variant === "admin") {
    return (
      <div
        className={`h-[100vh] bg-white border-r border-gray-200 fixed left-0 top-0 transition-all duration-300 ease-in-out ${isCollapsed ? "w-16" : "w-64"}`}
      >
        <div
          className={`p-4 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}
        >
          {!isCollapsed && (
            <div className="flex items-center">
              <div className="text-blue-600 font-bold text-xl">RealEstate</div>
            </div>
          )}
          <Button
            onClick={handleToggleCollapse}
            variant="ghost"
            size="icon"
            className="text-gray-800 hover:bg-gray-200"
            aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="space-y-2 p-2">
            {navItems.map((tab) => (
              <Link href={tab.path || "#"} key={tab.id} className="block">
                <Button
                  onClick={() => onTabChange(tab.id)}
                  variant={activeTab === tab.id ? "secondary" : "ghost"}
                  className={`w-full flex items-center justify-start rounded-lg transition-colors ${isCollapsed ? "p-2 px-3" : "px-4 py-2"} ${activeTab === tab.id ? "bg-blue-100 text-blue-600 hover:bg-blue-100" : "text-gray-800 hover:bg-gray-200"}`}
                  title={isCollapsed ? tab.name : undefined}
                >
                  <div
                    className={`flex items-center ${activeTab === tab.id ? "text-[#ff6900]" : "text-gray-500"} ${!isCollapsed ? "mr-2" : ""}`}
                  >
                    <tab.icon className="h-5 w-5 min-w-5" />
                  </div>
                  {!isCollapsed && (
                    <span
                      className={activeTab === tab.id ? "text-[#ff6900]" : ""}
                    >
                      {tab.name}
                    </span>
                  )}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    );
  }

  // Client variant sidebar
  return (
    <div
      className={`${isCollapsed ? "w-16" : "w-64"} bg-white border-r border-gray-200 h-screen fixed transition-all duration-300 z-10`}
    >
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <div
          className={`${isCollapsed ? "hidden" : "block"} text-xl font-bold text-blue-600`}
        >
          RealEstatePro
        </div>
        <button
          onClick={handleToggleCollapse}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
      <nav className="p-4 flex flex-col h-[calc(100vh-70px)] justify-between">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <li key={item.id}>
                <Link href={item.path || "#"} className="block">
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full flex justify-start ${isCollapsed ? "px-3" : ""} ${isActive ? "bg-blue-50" : "text-gray-700 hover:bg-gray-100"}`}
                    onClick={() => onTabChange(item.id)}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon
                      className={`h-5 w-5 min-w-5 ${isActive ? "text-[#ff6900]" : ""}`}
                    />
                    {!isCollapsed && (
                      <span
                        className={`ml-3 ${isActive ? "text-[#ff6900]" : ""}`}
                      >
                        {item.name}
                      </span>
                    )}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto border-t border-gray-200 pt-4">
          {/* Referral Button - Always visible */}
          <div className="mb-4">
            <ReferralButton isCollapsed={isCollapsed} />
          </div>

          {/* Help Center - Always visible */}
          <HelpCenter isCollapsed={isCollapsed} />

          {!isCollapsed && (
            <div className="mt-4 mx-4">
              <Link href="/pricing">
                <div className="bg-blue-50 p-3 rounded-md hover:bg-blue-100 transition-colors cursor-pointer">
                  <div className="flex items-center text-blue-600 mb-1">
                    <CreditCard className="h-4 w-4 min-w-4 mr-2" />
                    <span className="text-sm font-medium">Plano Atual</span>
                  </div>
                  <div className="text-sm text-gray-700">
                    {isLoadingPlan ? (
                      <span className="inline-block w-20 h-4 bg-gray-200 animate-pulse rounded"></span>
                    ) : (
                      currentPlan
                    )}
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

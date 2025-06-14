"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";
import OwnerStats from "./dashboards/OwnerStats";
import BuyerStats from "./dashboards/BuyerStats";
import BuilderStats from "./dashboards/BuilderStats";
import InvestorStats from "./dashboards/InvestorStats";
import { Card, CardContent } from "./ui/card";
import {
  UserCircle,
  Home,
  Building,
  User,
  Users,
  Briefcase,
  LineChart,
  Calendar,
} from "lucide-react";

interface UserRoleDashboardProps {
  defaultRole?: string;
  userId?: string;
}

// Helper function to normalize role names
const normalizeRole = (role?: string): string => {
  if (!role) return "Buyer";

  // Handle both old and new role formats
  switch (role.toLowerCase()) {
    case "administrator":
    case "administrador":
      return "Administrator";
    case "owner":
    case "proprietario(a)":
    case "proprietário(a)":
      return "Owner";
    case "buyer":
    case "comprador(a)":
      return "Buyer";
    case "builder":
      return "Builder";
    case "investor":
      return "Investor";
    default:
      return "Buyer"; // Default fallback
  }
};

export default function UserRoleDashboard({
  defaultRole,
  userId,
}: UserRoleDashboardProps) {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the defaultRole prop if provided (for storyboard testing)
  const userRole = normalizeRole(userData?.role || defaultRole);
  const currentUserId = userId || user?.id;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (user) {
          setUser(user);

          // Get user data including role with error handling
          try {
            const { data: userData, error: profileError } = await supabase
              .from("users")
              .select("*")
              .eq("id", user.id)
              .single();

            if (profileError) {
              console.warn("Error fetching user profile:", profileError);
              // If there's a schema cache error, use fallback data
              if (profileError.code === "PGRST204") {
                console.log("Schema cache error detected, using fallback role");
                setUserData({
                  id: user.id,
                  email: user.email,
                  role: defaultRole || "comprador(a)",
                });
              } else {
                throw profileError;
              }
            } else {
              setUserData(userData);
            }
          } catch (profileErr: any) {
            console.error("Profile fetch error:", profileErr);
            // Use fallback data if profile fetch fails
            setUserData({
              id: user.id,
              email: user.email,
              role: defaultRole || "comprador(a)",
            });
          }
        } else if (!defaultRole) {
          // Only set error if no defaultRole is provided
          setError("User not authenticated");
        }
      } catch (err: any) {
        console.error("Error fetching user data:", err);
        // If there's an error but we have a defaultRole, use it
        if (defaultRole) {
          setUserData({ role: defaultRole });
        } else {
          setError(err.message || "Failed to load user data");
        }
      } finally {
        setLoading(false);
      }
    };

    // Only fetch user data if no defaultRole is provided or we're in a real environment
    if (!defaultRole || process.env.NODE_ENV !== "development") {
      fetchUserData();
    } else {
      // If defaultRole is provided and we're in development, skip fetching
      setLoading(false);
    }
  }, [defaultRole]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !defaultRole) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
        <p className="font-medium">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  // Render the appropriate stats component based on user role
  const renderRoleStats = () => {
    switch (userRole) {
      case "Owner":
        return <OwnerStats userId={currentUserId} />;
      case "Buyer":
        return <BuyerStats />;
      case "Builder":
        return <BuilderStats />;
      case "Investor":
        return <InvestorStats />;
      case "Administrator":
        return <BuyerStats />; // Admin uses buyer stats as fallback
      default:
        return <BuyerStats />; // Default to buyer stats
    }
  };

  // Role-specific action cards
  const renderRoleActions = () => {
    const roleActions = {
      Owner: [
        {
          title: "Adicionar Propriedade",
          description: "Adicionar uma nova propriedade aos seus anúncios",
          icon: <Home size={24} className="text-blue-700" />,
          bgColor: "bg-blue-100",
        },
        {
          title: "Gerir propriedades",
          description: "Ver e editar as suas propriedades",
          icon: <Building size={24} className="text-green-700" />,
          bgColor: "bg-green-100",
        },
        {
          title: "Agenda de Visitas",
          description: "Gerir a sua agenda de visitas às propriedades",
          icon: <Calendar size={24} className="text-amber-700" />,
          bgColor: "bg-amber-100",
        },
        {
          title: "Pedidos de Informações",
          description: "Ver e responder a pedidos de informação",
          icon: <User size={24} className="text-purple-700" />,
          bgColor: "bg-purple-100",
        },
      ],
      Buyer: [
        {
          title: "Procurar propriedades",
          description: "Encontre a sua propriedade de sonho",
          icon: <Home size={24} className="text-blue-700" />,
          bgColor: "bg-blue-100",
        },
        {
          title: "Propriedades guardadas",
          description: "Ver os seus anúncios guardados",
          icon: <Home size={24} className="text-amber-700" />,
          bgColor: "bg-amber-100",
        },
        {
          title: "Os meus pedidos",
          description: "Acompanhe os pedidos de visita às suas propriedades",
          icon: <User size={24} className="text-green-700" />,
          bgColor: "bg-green-100",
        },
      ],
      Builder: [
        {
          title: "Projects",
          description: "Manage your construction projects",
          icon: <Building size={24} className="text-blue-700" />,
          bgColor: "bg-blue-100",
        },
        {
          title: "Developments",
          description: "Track your property developments",
          icon: <Building size={24} className="text-green-700" />,
          bgColor: "bg-green-100",
        },
        {
          title: "Site Visits",
          description: "Schedule and manage site visits",
          icon: <LineChart size={24} className="text-purple-700" />,
          bgColor: "bg-purple-100",
        },
      ],
      Investor: [
        {
          title: "Investment Properties",
          description: "Browse properties for investment",
          icon: <Building size={24} className="text-blue-700" />,
          bgColor: "bg-blue-100",
        },
        {
          title: "ROI Calculator",
          description: "Calculate return on investment",
          icon: <LineChart size={24} className="text-green-700" />,
          bgColor: "bg-green-100",
        },
        {
          title: "Portfolio",
          description: "Manage your investment portfolio",
          icon: <Briefcase size={24} className="text-purple-700" />,
          bgColor: "bg-purple-100",
        },
      ],
      Administrator: [
        {
          title: "Gestão de Utilizadores",
          description: "Gerir utilizadores da plataforma",
          icon: <Users size={24} className="text-blue-700" />,
          bgColor: "bg-blue-100",
        },
        {
          title: "Gestão de Propriedades",
          description: "Supervisionar todas as propriedades",
          icon: <Building size={24} className="text-green-700" />,
          bgColor: "bg-green-100",
        },
        {
          title: "Relatórios",
          description: "Ver relatórios e análises da plataforma",
          icon: <LineChart size={24} className="text-purple-700" />,
          bgColor: "bg-purple-100",
        },
      ],
    };

    const actions =
      roleActions[userRole as keyof typeof roleActions] || roleActions.Buyer;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {actions.map((action, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 ${action.bgColor} rounded-lg`}>
                {action.icon}
              </div>
              <h2 className="font-semibold text-lg">{action.title}</h2>
            </div>
            <p className="text-gray-600">{action.description}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto flex flex-col gap-8 p-0">
        {/* Header Section */}

        {/* Stats Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">As suas estatísticas</h2>
          {renderRoleStats()}
        </section>
        {/* Actions Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Acesso rápido</h2>
          {renderRoleActions()}
        </section>
      </div>
    </div>
  );
}

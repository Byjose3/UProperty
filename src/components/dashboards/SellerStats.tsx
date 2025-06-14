"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  Home,
  Eye,
  MessageSquare,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Building,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  percentageChange: number;
  description: string;
  bgColor?: string;
  iconBgColor?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  percentageChange,
  description,
  bgColor = "bg-white",
  iconBgColor = "bg-gray-100",
}: StatCardProps) => {
  const isPositive = percentageChange >= 0;

  // Extract color class from icon to create a matching background with opacity
  const iconElement = icon as React.ReactElement;
  const iconColorClass =
    iconElement?.props?.className
      ?.split(" ")
      .find((cls: string) => cls.includes("text-")) || "text-gray-600";

  // Convert text-color-600 to bg-color-100 for solid light background
  const dynamicBgClass = iconColorClass
    .replace("text-", "bg-")
    .replace("-600", "-100");

  return (
    <Card
      className={
        `${bgColor} shadow-sm hover:shadow-md transition-all ` +
        " border-solid bg-gray-50"
      }
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        <div className={`p-2 ${dynamicBgClass} rounded-full flex`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          <span
            className={`flex items-center text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
          >
            {isPositive ? (
              <ArrowUp className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 mr-1" />
            )}
            {Math.abs(percentageChange)}%
          </span>
          <span className="text-xs text-gray-500 ml-2">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default function OwnerStats({ userId }: { userId?: string }) {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    totalViews: 0,
    totalInquiries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!userId) return;

      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );

        const { data, error } = await supabase.rpc("get_user_property_stats", {
          user_id: userId,
        });

        if (error) {
          console.error("Error fetching stats:", error);
        } else if (data && data.length > 0) {
          const statsData = data[0];
          setStats({
            totalProperties: Number(statsData.total_properties) || 0,
            activeProperties: Number(statsData.active_properties) || 0,
            totalViews: Number(statsData.total_views) || 0,
            totalInquiries: Number(statsData.total_inquiries) || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching property stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  const statsData = [
    {
      title: "Propriedades Ativas",
      value: loading ? "..." : stats.activeProperties.toString(),
      icon: <Home className="h-4 w-4 text-blue-600" />,
      percentageChange: 8.3,
      description: "vs. mês anterior",
      bgColor: "bg-blue-50",
      iconBgColor: "bg-blue-100",
    },
    {
      title: "Total de Propriedades",
      value: loading ? "..." : stats.totalProperties.toString(),
      icon: <Building className="h-4 w-4 text-green-600" />,
      percentageChange: 12.5,
      description: "vs. mês anterior",
      bgColor: "bg-green-50",
      iconBgColor: "bg-green-100",
    },
    {
      title: "Visualizações Totais",
      value: loading ? "..." : stats.totalViews.toLocaleString(),
      icon: <Eye className="h-4 w-4 text-amber-600" />,
      percentageChange: -2.4,
      description: "vs. mês anterior",
      bgColor: "bg-amber-50",
      iconBgColor: "bg-amber-100",
    },
    {
      title: "Contatos Recebidos",
      value: loading ? "..." : stats.totalInquiries.toString(),
      icon: <MessageSquare className="h-4 w-4 text-purple-600" />,
      percentageChange: 5.7,
      description: "vs. mês anterior",
      bgColor: "bg-purple-50",
      iconBgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} className="bg-white" />
      ))}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  Users,
  Camera,
  Home,
  BarChart,
} from "lucide-react";
import { createClient } from "../../../supabase/client";

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  percentageChange: number;
  description: string;
}

const KPICard = ({
  title,
  value,
  icon,
  percentageChange,
  description,
}: KPICardProps) => {
  const isPositive = percentageChange >= 0;

  return (
    <Card className="shadow-sm hover:shadow-md transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
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

export default function KPIs() {
  // Listen for export event
  useEffect(() => {
    const handleExportKPIs = () => {
      exportKPIData();
    };

    document.addEventListener("export-kpis", handleExportKPIs);
    return () => {
      document.removeEventListener("export-kpis", handleExportKPIs);
    };
  }, []);

  // Function to export KPI data to CSV
  const exportKPIData = () => {
    // Create CSV content
    const headers = ["Title", "Value", "Percentage Change", "Description"];
    const rows = kpiData.map((kpi) => [
      kpi.title,
      kpi.value,
      `${kpi.percentageChange}%`,
      kpi.description,
    ]);

    // Add metadata
    const metadata = [
      `"KPI Data Export"`,
      `"Generated: ${new Date().toLocaleString()}"`,
      `"Total Records: ${kpiData.length}"`,
      "",
    ];

    const csv = [
      ...metadata,
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    // Create download link
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute(
      "download",
      `kpi-data-${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const [kpiData, setKpiData] = useState([
    {
      title: "Total Revenue",
      value: "€24,532",
      icon: <DollarSign className="h-4 w-4 text-blue-600" />,
      percentageChange: 12.5,
      description: "vs. last month",
    },
    {
      title: "Active Subscriptions",
      value: "1,245",
      icon: <Users className="h-4 w-4 text-green-600" />,
      percentageChange: 8.2,
      description: "vs. last month",
    },
    {
      title: "Photo/Video Sessions",
      value: "342",
      icon: <Camera className="h-4 w-4 text-amber-600" />,
      percentageChange: -2.4,
      description: "vs. last month",
    },
    {
      title: "Properties Published",
      value: "156",
      icon: <Home className="h-4 w-4 text-purple-600" />,
      percentageChange: 5.7,
      description: "vs. last month",
    },
    {
      title: "User Growth",
      value: "+432",
      icon: <BarChart className="h-4 w-4 text-indigo-600" />,
      percentageChange: 15.3,
      description: "vs. last month",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        setLoading(true);

        // Fetch total revenue
        const { data: revenueData } = await supabase
          .from("payments")
          .select("amount, created_at")
          .gte(
            "created_at",
            new Date(
              new Date().setMonth(new Date().getMonth() - 1),
            ).toISOString(),
          )
          .order("created_at", { ascending: false });

        // Fetch active subscriptions
        const { data: subscriptionsData } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("status", "active");

        // Fetch photo/video sessions
        const { data: sessionsData } = await supabase
          .from("services")
          .select("*")
          .eq("type", "photo_video")
          .gte(
            "created_at",
            new Date(
              new Date().setMonth(new Date().getMonth() - 1),
            ).toISOString(),
          );

        // Fetch properties published this month
        const { data: propertiesData } = await supabase
          .from("properties")
          .select("*")
          .gte(
            "created_at",
            new Date(
              new Date().setMonth(new Date().getMonth() - 1),
            ).toISOString(),
          );

        // Fetch user growth
        const { data: usersData } = await supabase
          .from("users")
          .select("*")
          .gte(
            "created_at",
            new Date(
              new Date().setMonth(new Date().getMonth() - 1),
            ).toISOString(),
          );

        // If we have data, update the KPIs
        // Note: In a real implementation, you would calculate month-over-month changes
        // This is a simplified version that just shows the data
        if (
          revenueData ||
          subscriptionsData ||
          sessionsData ||
          propertiesData ||
          usersData
        ) {
          const updatedKPIData = [...kpiData];

          // Update with real data if available
          if (revenueData && revenueData.length > 0) {
            const totalRevenue = revenueData.reduce(
              (sum, item) => sum + (item.amount || 0),
              0,
            );
            updatedKPIData[0].value = `€${totalRevenue.toFixed(2)}`;
          }

          if (subscriptionsData) {
            updatedKPIData[1].value = subscriptionsData.length.toString();
          }

          if (sessionsData) {
            updatedKPIData[2].value = sessionsData.length.toString();
          }

          if (propertiesData) {
            updatedKPIData[3].value = propertiesData.length.toString();
          }

          if (usersData) {
            updatedKPIData[4].value = `+${usersData.length}`;
          }

          setKpiData(updatedKPIData);
        }
      } catch (error) {
        console.error("Error fetching KPI data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {loading ? (
        <div className="col-span-5 flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        </div>
      ) : (
        kpiData.map((kpi, index) => <KPICard key={index} {...kpi} />)
      )}
    </div>
  );
}

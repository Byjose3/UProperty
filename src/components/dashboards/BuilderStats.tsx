"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  Building,
  Users,
  Calendar,
  LineChart,
  Briefcase,
  Clock,
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

export default function BuilderStats() {
  // In a real implementation, this data would come from an API call to Supabase
  const statsData = [
    {
      title: "Active Projects",
      value: "8",
      icon: <Building className="h-4 w-4 text-blue-600" />,
      percentageChange: 12.5,
      description: "vs. last month",
      bgColor: "bg-blue-50",
      iconBgColor: "bg-blue-100",
    },
    {
      title: "Development Units",
      value: "42",
      icon: <Building className="h-4 w-4 text-green-600" />,
      percentageChange: 8.3,
      description: "vs. last month",
      bgColor: "bg-green-50",
      iconBgColor: "bg-green-100",
    },
    {
      title: "Site Visits",
      value: "15",
      icon: <Calendar className="h-4 w-4 text-amber-600" />,
      percentageChange: -2.4,
      description: "vs. last month",
      bgColor: "bg-amber-50",
      iconBgColor: "bg-amber-100",
    },
    {
      title: "Team Members",
      value: "24",
      icon: <Users className="h-4 w-4 text-purple-600" />,
      percentageChange: 5.7,
      description: "vs. last month",
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

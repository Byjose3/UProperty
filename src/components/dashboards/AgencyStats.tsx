"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  Users,
  Home,
  MessageSquare,
  BarChart,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  percentageChange: number;
  description: string;
}

const StatCard = ({
  title,
  value,
  icon,
  percentageChange,
  description,
}: StatCardProps) => {
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

export default function AgencyStats() {
  // In a real implementation, this data would come from an API call to Supabase
  const statsData = [
    {
      title: "Active Agents",
      value: "18",
      icon: <Users className="h-4 w-4 text-blue-600" />,
      percentageChange: 12.5,
      description: "vs. last month",
    },
    {
      title: "Listed Properties",
      value: "124",
      icon: <Home className="h-4 w-4 text-green-600" />,
      percentageChange: 8.2,
      description: "vs. last month",
    },
    {
      title: "Client Inquiries",
      value: "87",
      icon: <MessageSquare className="h-4 w-4 text-amber-600" />,
      percentageChange: 15.3,
      description: "vs. last month",
    },
    {
      title: "Revenue Growth",
      value: "€12,450",
      icon: <BarChart className="h-4 w-4 text-purple-600" />,
      percentageChange: 7.8,
      description: "vs. last month",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

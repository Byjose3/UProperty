"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  Bookmark,
  Eye,
  Calendar,
  Clock,
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

export default function BuyerStats() {
  // In a real implementation, this data would come from an API call to Supabase
  const statsData = [
    {
      title: "Saved Properties",
      value: "24",
      icon: <Bookmark className="h-4 w-4 text-blue-600" />,
      percentageChange: 15.8,
      description: "vs. last month",
    },
    {
      title: "Properties Viewed",
      value: "87",
      icon: <Eye className="h-4 w-4 text-blue-600" />,
      percentageChange: 9.2,
      description: "vs. last month",
    },
    {
      title: "Scheduled Visits",
      value: "5",
      icon: <Calendar className="h-4 w-4 text-green-600" />,
      percentageChange: -3.1,
      description: "vs. last month",
    },
    {
      title: "Time Spent Browsing",
      value: "14h 32m",
      icon: <Clock className="h-4 w-4 text-purple-600" />,
      percentageChange: 7.5,
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

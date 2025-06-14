"use client";

import { Button } from "@/components/ui/button";
import { Bell, Search, Building } from "lucide-react";
import UserProfileDropdown from "./UserProfileDropdown";

interface TopbarProps {
  isSidebarCollapsed?: boolean;
  userRole?: string;
  userName?: string;
  searchQuery?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Topbar({
  isSidebarCollapsed = false,
  userRole,
  userName,
  searchQuery = "",
  onSearchChange = () => {},
}: TopbarProps) {
  return (
    <div
      className={`flex items-center justify-between bg-white p-4 border-b fixed top-0 right-0 z-50 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? "w-[calc(100%-4rem)] ml-16" : "w-[calc(100%-16rem)] ml-64"}`}
    >
      <div className="relative w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2"
          placeholder="Pesquisar..."
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 mr-2 gap-x-4">
          <Button variant="outline" className="flex items-center space-x-1">
            <Building className="h-4 w-4 text-gray-600" />
            <span>Market</span>
          </Button>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </Button>
        </div>
        <div className="bg-gray-100 h-8 w-px mx-2"></div>
        <UserProfileDropdown userRole={userRole} userName={userName} />
      </div>
    </div>
  );
}

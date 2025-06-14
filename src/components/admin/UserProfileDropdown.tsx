"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

interface UserProfileDropdownProps {
  userRole?: string;
  userName?: string;
}

export default function UserProfileDropdown({
  userRole = "Admin",
  userName,
}: UserProfileDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    console.log("Profile clicked");
    // Add navigation or modal logic here
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    console.log("Logout clicked");
    // Add logout logic here
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 border border-blue-300 hover:bg-blue-200 transition-colors"
          aria-label="User menu"
        >
          <User className="h-5 w-5 text-blue-600" />
        </button>
        <div className="flex flex-col">
          {userName && (
            <span className="text-sm font-medium text-gray-800">
              {userName}
            </span>
          )}
          {userRole && (
            <span className="text-xs text-gray-600 font-normal">
              {userRole === "Admin"
                ? "Administrador"
                : userRole === "Owner" || userRole === "owner"
                  ? "Proprietário(a)"
                  : userRole === "Buyer"
                    ? "Comprador(a)"
                    : userRole === "Builder"
                      ? "Construtor(a)"
                      : userRole}
            </span>
          )}
        </div>
      </div>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
          <button
            onClick={handleProfileClick}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User className="h-4 w-4 mr-2" />
            Perfil
          </button>
          <button
            onClick={handleLogoutClick}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

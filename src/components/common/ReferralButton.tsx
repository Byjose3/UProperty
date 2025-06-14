import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface ReferralButtonProps {
  isCollapsed?: boolean;
  className?: string;
}

export default function ReferralButton({
  isCollapsed = false,
  className = "",
}: ReferralButtonProps) {
  return (
    <div className={`p-0 ${className}`}>
      {!isCollapsed && (
        <p className="text-sm text-gray-500 mb-2 ml-1">Referenciar</p>
      )}
      <Button
        className={`w-full flex items-center justify-start rounded-lg transition-colors ${isCollapsed ? "p-2" : "px-4 py-2"} text-gray-800 hover:bg-gray-200`}
        variant="ghost"
        title={isCollapsed ? "Indique a um Amigo" : undefined}
      >
        <div className="flex items-center text-gray-500 mr-2">
          <UserPlus className="h-5 w-5 min-w-5" />
        </div>
        {!isCollapsed && <span>Indique a um Amigo</span>}
      </Button>
    </div>
  );
}

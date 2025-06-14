"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type UserRole = "Administrator" | "owner" | "Buyer" | null;

interface NavItem {
  name: string;
  icon: any;
  id: string;
  path?: string;
}

interface DashboardSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  userRole: UserRole;
  navItems: NavItem[];
  middleContent?: React.ReactNode;
  footerContent?: React.ReactNode;
}

export default function DashboardSidebar({
  activeTab = "dashboard",
  onTabChange = () => {},
  isCollapsed: externalIsCollapsed,
  onToggleCollapse,
  userRole,
  navItems,
  middleContent,
  footerContent,
}: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(externalIsCollapsed || false);

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

  return (
    <div
      className={`h-[100vh] bg-white border-r border-gray-200 fixed left-0 top-0 transition-all duration-300 ease-in-out flex flex-col ${isCollapsed ? "w-16" : "w-64"}`}
    >
      <div
        className={`p-4 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}
      >
        {!isCollapsed && (
          <div className="flex items-center w-[90]">
            <svg
              id="Camada_2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 239.79 87.36"
              className="h-10 w-auto"
            >
              <defs>
                <style>{`.cls-1{fill:#f06a13;}.cls-2{fill:#130b16;}`}</style>
              </defs>
              <g id="Camada_1-2">
                <g>
                  <path
                    className="cls-2"
                    d="M38.42,39.33V3.69h15.65c7.48,0,11.65,5.13,11.65,11.17s-4.22,11.17-11.65,11.17h-9.4v13.3h-6.25ZM59.31,14.86c0-3.42-2.57-5.66-6.09-5.66h-8.55v11.33h8.55c3.52,0,6.09-2.24,6.09-5.66Z"
                  />
                  <path
                    className="cls-2"
                    d="M70.75,39.33V13.52h5.61v3.79c1.92-2.46,5.02-4.38,8.39-4.38v5.56c-.48-.11-1.07-.16-1.76-.16-2.35,0-5.5,1.6-6.63,3.42v17.58h-5.61Z"
                  />
                  <path
                    className="cls-2"
                    d="M87.68,26.4c0-7.37,5.08-13.52,13.25-13.52s13.3,6.14,13.3,13.52-5.02,13.57-13.3,13.57-13.25-6.14-13.25-13.57Zm20.73,0c0-4.54-2.67-8.55-7.48-8.55s-7.43,4.01-7.43,8.55,2.67,8.6,7.43,8.6,7.48-4.01,7.48-8.6Z"
                  />
                  <path
                    className="cls-2"
                    d="M125.51,35.75v13.41h-5.61V13.52h5.61v3.53c1.92-2.56,4.92-4.17,8.28-4.17,6.68,0,11.43,5.02,11.43,13.52s-4.75,13.57-11.43,13.57c-3.26,0-6.2-1.44-8.28-4.22Zm13.89-9.35c0-4.97-2.83-8.55-7.26-8.55-2.62,0-5.4,1.55-6.63,3.47v10.2c1.23,1.87,4.01,3.47,6.63,3.47,4.43,0,7.26-3.58,7.26-8.6Z"
                  />
                  <path
                    className="cls-2"
                    d="M149.18,26.4c0-7.48,5.45-13.52,13.09-13.52s12.72,5.93,12.72,14.05v1.34h-19.93c.43,3.9,3.37,7.11,8.23,7.11,2.51,0,5.5-1.02,7.32-2.83l2.57,3.69c-2.57,2.46-6.36,3.74-10.47,3.74-7.75,0-13.52-5.4-13.52-13.57Zm13.09-8.92c-4.81,0-7,3.69-7.27,6.84h14.53c-.11-3.05-2.19-6.84-7.27-6.84Z"
                  />
                  <path
                    className="cls-2"
                    d="M180.26,39.33V13.52h5.61v3.79c1.92-2.46,5.02-4.38,8.39-4.38v5.56c-.48-.11-1.07-.16-1.76-.16-2.35,0-5.5,1.6-6.63,3.42v17.58h-5.61Z"
                  />
                  <path
                    className="cls-2"
                    d="M200.5,33.34v-14.91h-4.27v-4.92h4.27V6.47h5.61v7.05h5.23v4.92h-5.23v13.52c0,1.76,.85,3.05,2.46,3.05,1.07,0,2.08-.43,2.51-.91l1.34,4.22c-1.02,.96-2.67,1.66-5.29,1.66-4.33,0-6.63-2.35-6.63-6.62Z"
                  />
                  <path
                    className="cls-2"
                    d="M216.15,44.4c.59,.27,1.5,.43,2.14,.43,1.76,0,2.94-.54,3.69-2.24l1.28-2.94-10.58-26.13h5.98l7.53,19.34,7.53-19.34h6.04l-12.45,30.45c-1.76,4.38-4.86,5.77-8.87,5.82-.8,0-2.35-.16-3.15-.37l.85-5.02Z"
                  />
                </g>
                <g>
                  <path
                    className="cls-2"
                    d="M30.77,86.72v-26.45l-10.95,26.45h-2.67L6.25,60.28v26.45H0V51.09H8.81l9.67,23.45,9.72-23.45h8.82v35.64h-6.25Z"
                  />
                  <path
                    className="cls-2"
                    d="M60.22,86.72v-2.78c-1.92,2.19-4.91,3.42-8.33,3.42-4.22,0-8.98-2.83-8.98-8.55s4.75-8.39,8.98-8.39c3.47,0,6.46,1.12,8.33,3.31v-3.85c0-2.99-2.46-4.81-6.04-4.81-2.89,0-5.4,1.07-7.64,3.26l-2.3-3.9c2.99-2.83,6.73-4.17,10.84-4.17,5.72,0,10.74,2.4,10.74,9.35v17.1h-5.61Zm0-5.88v-3.9c-1.28-1.76-3.69-2.67-6.14-2.67-3.15,0-5.5,1.82-5.5,4.65s2.35,4.59,5.5,4.59c2.46,0,4.86-.91,6.14-2.67Z"
                  />
                  <path
                    className="cls-2"
                    d="M73.1,86.72v-25.81h5.61v3.79c1.92-2.46,5.02-4.38,8.39-4.38v5.56c-.48-.11-1.07-.16-1.76-.16-2.35,0-5.5,1.6-6.63,3.42v17.58h-5.61Z"
                  />
                  <path
                    className="cls-2"
                    d="M108.73,86.72l-7.91-10.63-3.58,3.69v6.95h-5.61V51.09h5.61v22.28l11.38-12.45h6.94l-10.74,11.7,10.95,14.1h-7.05Z"
                  />
                  <path
                    className="cls-2"
                    d="M117.87,73.79c0-7.48,5.45-13.52,13.09-13.52s12.72,5.93,12.72,14.05v1.34h-19.93c.43,3.9,3.37,7.11,8.23,7.11,2.51,0,5.5-1.02,7.32-2.83l2.57,3.69c-2.57,2.46-6.36,3.74-10.47,3.74-7.75,0-13.52-5.4-13.52-13.57Zm13.09-8.92c-4.81,0-7,3.69-7.27,6.84h14.53c-.11-3.05-2.19-6.84-7.27-6.84Z"
                  />
                  <path
                    className="cls-2"
                    d="M150.36,80.74v-14.91h-4.27v-4.92h4.27v-7.05h5.61v7.05h5.23v4.92h-5.23v13.52c0,1.76,.85,3.05,2.46,3.05,1.07,0,2.08-.43,2.51-.91l1.34,4.22c-1.02,.96-2.67,1.66-5.29,1.66-4.33,0-6.63-2.35-6.63-6.62Z"
                  />
                </g>
                <path
                  className="cls-1"
                  d="M24,3.69c0-2.04,1.7-3.69,3.69-3.69s3.69,1.65,3.69,3.69-1.65,3.69-3.69,3.69-3.69-1.65-3.69-3.69Z"
                />
                <path
                  className="cls-2"
                  d="M0,25.28V3.69H6.3V25.06c0,5.66,3.15,9.35,9.14,9.35s9.08-3.69,9.08-9.35V11.07h6.3v14.15c0,8.87-5.08,14.75-15.39,14.75S0,34.04,0,25.28Z"
                />
                <g>
                  <path
                    className="cls-1"
                    d="M177.94,70.61v-3.06l-2.86-4.18h1.05l2.25,3.37,2.25-3.37h1.05l-2.85,4.18v3.06h-.9Z"
                  />
                  <path
                    className="cls-1"
                    d="M180.92,67.99c0-1.52,1-2.75,2.6-2.75s2.6,1.23,2.6,2.75-1,2.76-2.6,2.76-2.6-1.24-2.6-2.76Zm4.33,0c0-1.06-.62-2.02-1.74-2.02s-1.75,.96-1.75,2.02,.63,2.03,1.75,2.03,1.74-.96,1.74-2.03Z"
                  />
                  <path
                    className="cls-1"
                    d="M190.99,70.61v-.74c-.4,.46-1.09,.87-1.87,.87-1.1,0-1.67-.53-1.67-1.67v-3.7h.82v3.45c0,.92,.47,1.2,1.17,1.2,.64,0,1.25-.37,1.55-.79v-3.86h.82v5.25h-.82Z"
                  />
                  <path
                    className="cls-1"
                    d="M193.43,70.61v-5.25h.82v.85c.42-.55,1.03-.96,1.75-.96v.84c-.1-.02-.2-.03-.33-.03-.5,0-1.18,.41-1.42,.84v3.72h-.82Z"
                  />
                  <path
                    className="cls-1"
                    d="M200.64,69.82v2.79h-.82v-7.25h.82v.78c.38-.53,1.03-.91,1.77-.91,1.38,0,2.34,1.04,2.34,2.75s-.96,2.76-2.34,2.76c-.72,0-1.35-.34-1.77-.92Zm3.25-1.84c0-1.16-.63-2.02-1.68-2.02-.64,0-1.28,.38-1.56,.84v2.37c.28,.46,.92,.85,1.56,.85,1.05,0,1.68-.87,1.68-2.03Z"
                  />
                  <path
                    className="cls-1"
                    d="M206.04,70.61v-5.25h.82v.85c.42-.55,1.03-.96,1.75-.96v.84c-.1-.02-.2-.03-.33-.03-.5,0-1.18,.41-1.42,.84v3.72h-.82Z"
                  />
                  <path
                    className="cls-1"
                    d="M209.33,67.99c0-1.52,1-2.75,2.6-2.75s2.6,1.23,2.6,2.75-1,2.76-2.6,2.76-2.6-1.24-2.6-2.76Zm4.33,0c0-1.06-.62-2.02-1.74-2.02s-1.75,.96-1.75,2.02,.63,2.03,1.75,2.03,1.74-.96,1.74-2.03Z"
                  />
                  <path
                    className="cls-1"
                    d="M216.66,69.82v2.79h-.82v-7.25h.82v.78c.38-.53,1.03-.91,1.77-.91,1.38,0,2.34,1.04,2.34,2.75s-.96,2.76-2.34,2.76c-.72,0-1.35-.34-1.77-.92Zm3.25-1.84c0-1.16-.63-2.02-1.68-2.02-.64,0-1.28,.38-1.56,.84v2.37c.28,.46,.92,.85,1.56,.85,1.05,0,1.68-.87,1.68-2.03Z"
                  />
                  <path
                    className="cls-1"
                    d="M221.76,67.99c0-1.52,1.09-2.75,2.59-2.75,1.59,0,2.52,1.24,2.52,2.81v.21h-4.25c.06,.99,.76,1.81,1.89,1.81,.6,0,1.21-.24,1.62-.66l.39,.53c-.52,.52-1.23,.8-2.09,.8-1.55,0-2.67-1.12-2.67-2.76Zm2.58-2.08c-1.12,0-1.67,.95-1.72,1.75h3.44c-.01-.78-.53-1.75-1.73-1.75Z"
                  />
                  <path
                    className="cls-1"
                    d="M228.19,70.61v-5.25h.82v.85c.42-.55,1.03-.96,1.75-.96v.84c-.1-.02-.2-.03-.33-.03-.5,0-1.18,.41-1.42,.84v3.72h-.82Z"
                  />
                  <path
                    className="cls-1"
                    d="M232.11,69.52v-3.43h-.87v-.72h.87v-1.43h.82v1.43h1.06v.72h-1.06v3.26c0,.39,.17,.67,.53,.67,.23,0,.45-.1,.55-.22l.24,.61c-.21,.2-.5,.34-.98,.34-.77,0-1.16-.45-1.16-1.23Z"
                  />
                  <path
                    className="cls-1"
                    d="M235.15,71.93c.12,.05,.31,.09,.45,.09,.36,0,.6-.12,.78-.55l.35-.79-2.2-5.3h.88l1.75,4.3,1.74-4.3h.89l-2.63,6.31c-.32,.76-.85,1.05-1.54,1.06-.17,0-.45-.03-.6-.08l.13-.74Z"
                  />
                  <path
                    className="cls-1"
                    d="M177.94,83.66v-3.06l-2.86-4.18h1.05l2.25,3.37,2.25-3.37h1.05l-2.85,4.18v3.06h-.9Z"
                  />
                  <path
                    className="cls-1"
                    d="M180.92,81.03c0-1.52,1-2.75,2.6-2.75s2.6,1.23,2.6,2.75-1,2.76-2.6,2.76-2.6-1.24-2.6-2.76Zm4.33,0c0-1.07-.62-2.02-1.74-2.02s-1.75,.96-1.75,2.02,.63,2.03,1.75,2.03,1.74-.96,1.74-2.03Z"
                  />
                  <path
                    className="cls-1"
                    d="M190.99,83.66v-.74c-.4,.46-1.09,.87-1.87,.87-1.1,0-1.67-.53-1.67-1.67v-3.7h.82v3.45c0,.92,.47,1.2,1.17,1.2,.64,0,1.25-.37,1.55-.79v-3.86h.82v5.25h-.82Z"
                  />
                  <path
                    className="cls-1"
                    d="M193.43,83.66v-5.25h.82v.85c.42-.55,1.03-.96,1.75-.96v.84c-.1-.02-.2-.03-.33-.03-.5,0-1.18,.41-1.42,.84v3.72h-.82Z"
                  />
                  <path
                    className="cls-1"
                    d="M199.52,81.03c0-1.55,1.05-2.75,2.62-2.75,.96,0,1.52,.39,1.92,.91l-.54,.5c-.35-.48-.79-.68-1.34-.68-1.12,0-1.81,.86-1.81,2.02s.7,2.03,1.81,2.03c.54,0,.99-.22,1.34-.68l.54,.5c-.4,.52-.97,.91-1.92,.91-1.56,0-2.62-1.19-2.62-2.76Z"
                  />
                  <path
                    className="cls-1"
                    d="M208.76,83.66v-3.46c0-.92-.48-1.19-1.18-1.19-.63,0-1.24,.39-1.55,.81v3.83h-.82v-7.25h.82v2.76c.37-.43,1.09-.89,1.88-.89,1.1,0,1.67,.53,1.67,1.67v3.71h-.82Z"
                  />
                  <path
                    className="cls-1"
                    d="M210.9,81.03c0-1.52,1-2.75,2.6-2.75s2.6,1.23,2.6,2.75-1,2.76-2.6,2.76-2.6-1.24-2.6-2.76Zm4.33,0c0-1.07-.62-2.02-1.74-2.02s-1.75,.96-1.75,2.02,.63,2.03,1.75,2.03,1.74-.96,1.74-2.03Z"
                  />
                  <path
                    className="cls-1"
                    d="M217.28,77.12c0-.3,.25-.55,.54-.55s.55,.25,.55,.55-.25,.54-.55,.54-.54-.24-.54-.54Zm.14,6.54v-5.25h.82v5.25h-.82Z"
                  />
                  <path
                    className="cls-1"
                    d="M219.57,81.03c0-1.55,1.05-2.75,2.62-2.75,.96,0,1.52,.39,1.92,.91l-.54,.5c-.35-.48-.79-.68-1.34-.68-1.12,0-1.81,.86-1.81,2.02s.7,2.03,1.81,2.03c.54,0,.99-.22,1.34-.68l.54,.5c-.4,.52-.97,.91-1.92,.91-1.56,0-2.62-1.19-2.62-2.76Z"
                  />
                  <path
                    className="cls-1"
                    d="M224.95,81.03c0-1.52,1.09-2.75,2.59-2.75,1.59,0,2.52,1.24,2.52,2.81v.21h-4.25c.07,.99,.76,1.81,1.89,1.81,.6,0,1.21-.24,1.62-.66l.39,.53c-.52,.52-1.23,.8-2.09,.8-1.55,0-2.67-1.12-2.67-2.76Zm2.57-2.08c-1.12,0-1.67,.95-1.72,1.75h3.44c-.01-.78-.53-1.75-1.73-1.75Z"
                  />
                </g>
              </g>
            </svg>
          </div>
        )}
        <Button
          onClick={handleToggleCollapse}
          variant="ghost"
          size="icon"
          className="text-gray-800 hover:bg-gray-200"
          aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      {/* Main content area with flex-grow to push footer to bottom */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Navigation menu with scrollable area */}
        <div className="overflow-y-auto">
          <nav className="space-y-2 p-2">
            {navItems.map((tab) => (
              <Link href={tab.path || "#"} key={tab.id} className="block">
                <Button
                  onClick={() => onTabChange(tab.id)}
                  variant={activeTab === tab.id ? "secondary" : "ghost"}
                  className={`w-full flex items-center justify-start rounded-lg transition-colors ${isCollapsed ? "p-2 px-3" : "px-4 py-2"} ${activeTab === tab.id ? "bg-orange-50 hover:bg-orange-50" : "hover:bg-gray-200 text-brand-primary text-gray-800"}`}
                  title={isCollapsed ? tab.name : undefined}
                >
                  <div
                    className={
                      `flex items-center ${activeTab === tab.id ? "text-[#ff6900]" : "text-gray-500"} ${!isCollapsed ? "mr-2" : ""}` +
                      " text-sm"
                    }
                  >
                    <tab.icon className="h-5 w-5 min-w-5" />
                  </div>
                  {!isCollapsed && (
                    <span
                      className={activeTab === tab.id ? "text-[#ff6900]" : ""}
                    >
                      {tab.name === "Painel" ? "Painel Principal" : tab.name}
                    </span>
                  )}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Middle content if provided */}
          {middleContent && <div className="px-4">{middleContent}</div>}
        </div>
      </div>
      {/* Footer always at the bottom */}
      <div className="mt-auto border-t border-gray-200 border-0 border-none px-1 py-0">
        {footerContent}
      </div>
    </div>
  );
}

"use client";

// This component has been removed as Builder role is not part of the project requirements.
// Keeping the file as a placeholder to prevent import errors.

import { ReactNode } from "react";

interface BuilderSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

export default function BuilderSidebar(props: BuilderSidebarProps) {
  return null;
}

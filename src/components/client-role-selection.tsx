"use client";

import { RoleSelectionForm, UserRole } from "@/components/role-selection-form";

interface ClientRoleSelectionProps {
  onRoleSelect: (role: UserRole) => void;
  selectedRole?: UserRole;
}

export function ClientRoleSelection({
  onRoleSelect,
  selectedRole,
}: ClientRoleSelectionProps) {
  return (
    <RoleSelectionForm
      onRoleSelect={onRoleSelect}
      selectedRole={selectedRole}
    />
  );
}

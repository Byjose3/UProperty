"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type UserRole = "administrador" | "comprador(a)";

interface RoleSelectionFormProps {
  onRoleSelect: (role: UserRole) => void;
  selectedRole?: UserRole;
}

const roleDescriptions: Record<UserRole, string> = {
  administrador:
    "Gerir utilizadores, visualizar análises e controlar configurações do sistema",
  "comprador(a)":
    "Navegar por propriedades, salvar favoritos, solicitar visitas e gerir propriedades",
};

// Roles that are selectable in the form
const selectableRoles: UserRole[] = ["comprador(a)"];

export function RoleSelectionForm({
  onRoleSelect,
  selectedRole,
}: RoleSelectionFormProps) {
  const [role, setRole] = useState<UserRole | undefined>(selectedRole);

  const handleRoleChange = (value: string) => {
    const selectedRole = value as UserRole;
    setRole(selectedRole);
    onRoleSelect(selectedRole);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Select Your Role</CardTitle>
        <CardDescription>
          Choose the role that best describes how you'll use our platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={role}
          onValueChange={handleRoleChange}
          className="space-y-3"
        >
          {selectableRoles.map((role) => (
            <div
              key={role}
              className="flex items-start space-x-2 rounded-md border p-3 hover:bg-muted/50 transition-colors"
            >
              <RadioGroupItem value={role} id={role} className="mt-1" />
              <div className="flex-1">
                <Label
                  htmlFor={role}
                  className="text-base font-medium capitalize cursor-pointer"
                >
                  {role}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {roleDescriptions[role]}
                </p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

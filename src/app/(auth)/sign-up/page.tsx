"use client";

import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { signUpAction } from "@/app/actions";
import ClientNavbar from "@/components/client-navbar";
import { UserRole } from "@/components/role-selection-form";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Signup() {
  const [searchParams, setSearchParams] = useState<Message>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>("buyer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  useEffect(() => {
    // Get search params from URL
    const params = new URLSearchParams(window.location.search);
    const message = params.get("message");
    const error = params.get("error");

    if (message) {
      setSearchParams({ message });
    } else if (error) {
      setSearchParams({ error });
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4">
        Loading...
      </div>
    );
  }

  if ("message" in searchParams && searchParams.message) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Check if passwords match
    const password = (document.getElementById("password") as HTMLInputElement)
      ?.value;
    const confirmPassword = (
      document.getElementById("confirmPassword") as HTMLInputElement
    )?.value;

    if (password !== confirmPassword) {
      e.preventDefault();
      setPasswordsMatch(false);
      return;
    }

    setPasswordsMatch(true);

    // Ensure the role input is present before form submission
    if (!document.querySelector('input[name="role"]')) {
      const roleInput = document.createElement("input");
      roleInput.type = "hidden";
      roleInput.name = "role";
      roleInput.value = selectedRole;

      e.currentTarget.appendChild(roleInput);
      console.log("Added role input on submit:", selectedRole);
    }
  };

  return (
    <>
      <ClientNavbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
          <form
            className="flex flex-col space-y-6"
            action={signUpAction}
            onSubmit={handleSubmit}
          >
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Criar Conta</h1>
              <p className="text-muted-foreground">
                Preencha os dados para se registar
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome Completo</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  placeholder="Seu nome completo"
                  required
                  onChange={(e) => {
                    const names = e.target.value.trim().split(/\s+/);
                    if (names.length < 2) {
                      e.target.setCustomValidity(
                        "Por favor, insira pelo menos nome e sobrenome",
                      );
                    } else {
                      e.target.setCustomValidity("");
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contacto</Label>
                <Input
                  id="contact"
                  name="contact"
                  type="tel"
                  placeholder="Seu número de telefone"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                    onChange={() => setPasswordsMatch(true)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className={`pr-10 ${!passwordsMatch ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    onChange={() => setPasswordsMatch(true)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                {!passwordsMatch && (
                  <p className="text-xs text-red-500">
                    As passwords não coincidem
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="role_selection"
                    className="text-sm font-medium"
                  >
                    Quero
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      const role =
                        value === "proprietario"
                          ? "proprietario(a)"
                          : "comprador(a)";
                      setSelectedRole(role);

                      // Create hidden input for the role
                      const roleInput = document.createElement("input");
                      roleInput.type = "hidden";
                      roleInput.name = "role";
                      roleInput.value = role;

                      // Remove any existing role input to avoid duplicates
                      const existingInput =
                        document.querySelector('input[name="role"]');
                      if (existingInput) {
                        existingInput.remove();
                      }

                      const formElement = document.querySelector("form");
                      if (formElement) {
                        formElement.appendChild(roleInput);
                        console.log("Role input added to form:", role);
                      } else {
                        console.error("Form element not found");
                      }
                    }}
                    defaultValue="comprar"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="proprietario">
                        Sou Proprietário
                      </SelectItem>
                      <SelectItem value="comprar">Quero Comprar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <SubmitButton pendingText="A criar conta..." className="w-full">
                Criar Conta
              </SubmitButton>

              <div className="text-center text-sm">
                Já tem conta?{" "}
                <Link href="/sign-in" className="underline text-primary">
                  Entrar
                </Link>
              </div>

              <FormMessage message={searchParams} />
            </div>
          </form>
        </div>
        <SmtpMessage />
      </div>
    </>
  );
}

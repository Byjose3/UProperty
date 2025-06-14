import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SubscriptionCheck } from "@/components/subscription-check";
import UnifiedSidebar from "@/components/common/UnifiedSidebar";
import UnifiedTopbar from "@/components/common/UnifiedTopbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  RefreshCw,
  Plus,
  MapPin,
  Building,
  Filter,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserProperties } from "@/services/propertyService";
import PropertiesClient from "./PropertiesClient";

export default async function OwnerPropertiesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user data including role
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // Redirect admin to admin dashboard
  if (userData?.role === "Administrator") {
    return redirect("/dashboard/admin");
  }

  // Fetch user's properties from database
  const properties = (await getUserProperties(supabase, user.id)) || [];

  return (
    <SubscriptionCheck>
      <div className="flex">
        <UnifiedSidebar userRole={userData?.role || "Owner"} />
        <div className="flex-1 transition-all duration-300">
          <UnifiedTopbar
            variant="dashboard"
            userRole={userData?.role || "Owner"}
            userName={user.email}
          />
          <main className="w-full bg-gray-50 min-h-screen pl-0 md:pl-64 pt-16">
            <div className="container mx-auto px-4 py-8">
              {/* Header */}
              <div className="border-b border-gray-200 pb-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                      Minhas Propriedades
                    </h1>
                    <p className="text-gray-500 mt-1">
                      Gerencie seus imóveis listados
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Exportar
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Atualizar
                    </Button>
                    <Link href="/dashboard/owner/properties/new">
                      <Button variant="default" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Nova Propriedade
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Status
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Todos</DropdownMenuItem>
                    <DropdownMenuItem>Ativo</DropdownMenuItem>
                    <DropdownMenuItem>Pendente</DropdownMenuItem>
                    <DropdownMenuItem>Inativo</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      Ordenar
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Mais recentes</DropdownMenuItem>
                    <DropdownMenuItem>Preço (maior-menor)</DropdownMenuItem>
                    <DropdownMenuItem>Preço (menor-maior)</DropdownMenuItem>
                    <DropdownMenuItem>Mais visualizações</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Properties Client Component */}
              <PropertiesClient
                initialProperties={properties}
                userId={user.id}
              />
            </div>
          </main>
        </div>
      </div>
    </SubscriptionCheck>
  );
}

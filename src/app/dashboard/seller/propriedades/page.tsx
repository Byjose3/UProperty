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

export default async function ownerPropertiesPage() {
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

  // Mock properties data
  const properties = [
    {
      id: 1,
      title: "Apartamento T3 em Cascais",
      address: "Rua das Palmeiras, 123, Cascais",
      price: "€450,000",
      status: "Ativo",
      views: 245,
      inquiries: 12,
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    },
    {
      id: 2,
      title: "Moradia V4 com Piscina",
      address: "Avenida dos Pinheiros, 45, Sintra",
      price: "€750,000",
      status: "Ativo",
      views: 187,
      inquiries: 8,
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    },
    {
      id: 3,
      title: "Loft Moderno no Centro",
      address: "Rua Augusta, 78, Baixa, Lisboa",
      price: "€320,000",
      status: "Pendente",
      views: 156,
      inquiries: 5,
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    },
  ];

  return (
    <SubscriptionCheck>
      <div className="flex">
        <UnifiedSidebar userRole={userData?.role || "owner"} />
        <div className="flex-1 transition-all duration-300">
          <UnifiedTopbar
            variant="dashboard"
            userRole={userData?.role || "owner"}
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
                    <Link href="/dashboard/owner/propriedades/new">
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

              {/* Properties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <Card
                    key={property.id}
                    className="overflow-hidden shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="relative">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute bottom-3 left-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${property.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                        >
                          {property.status}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-1 truncate">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{property.address}</span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-lg font-bold text-blue-600">
                          {property.price}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-gray-50 p-2 rounded-md">
                          <div className="text-gray-500">Visualizações</div>
                          <div className="font-medium">{property.views}</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-md">
                          <div className="text-gray-500">Contatos</div>
                          <div className="font-medium">
                            {property.inquiries}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button variant="default" className="w-full">
                          Gerenciar Propriedade
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SubscriptionCheck>
  );
}

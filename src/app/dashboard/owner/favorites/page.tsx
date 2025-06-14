import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import UnifiedSidebar from "@/components/common/UnifiedSidebar";
import UnifiedTopbar from "@/components/common/UnifiedTopbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  MapPin,
  Bed,
  Bath,
  Square,
  Share2,
  Calendar,
  Trash2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function OwnerFavoritesPage() {
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

  // Mock data for favorited properties
  const favoriteProperties = [
    {
      id: 1,
      title: "Apartamento T3 em Cascais",
      address: "Rua das Palmeiras, 123, Cascais",
      price: "€450,000",
      description:
        "Apartamento espaçoso com vista para o mar, totalmente renovado e pronto a habitar.",
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      status: "À Venda",
      statusColor: "bg-green-100 text-green-800",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      savedDate: "2023-12-15",
    },
    {
      id: 2,
      title: "Moradia V4 com Piscina",
      address: "Avenida dos Pinheiros, 45, Sintra",
      price: "€750,000",
      description:
        "Moradia de luxo com piscina privativa, jardim amplo e garagem para 3 carros.",
      bedrooms: 4,
      bathrooms: 3,
      area: 250,
      status: "À Venda",
      statusColor: "bg-green-100 text-green-800",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      savedDate: "2023-12-10",
    },
    {
      id: 3,
      title: "Loft Moderno no Centro",
      address: "Rua Augusta, 78, Baixa, Lisboa",
      price: "€320,000",
      description:
        "Loft moderno e luminoso no coração de Lisboa, ideal para jovens profissionais.",
      bedrooms: 1,
      bathrooms: 1,
      area: 85,
      status: "À Venda",
      statusColor: "bg-green-100 text-green-800",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      savedDate: "2023-12-05",
    },
  ];

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
                      Imóveis Favoritos
                    </h1>
                    <p className="text-gray-500 mt-1">
                      Gerencie os imóveis que você salvou
                    </p>
                  </div>
                  <div className="flex gap-2">
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
                        <DropdownMenuItem>Área</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="shadow-sm hover:shadow-md transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Total de Favoritos
                    </CardTitle>
                    <div className="p-2 bg-red-100 rounded-full">
                      <Heart className="h-4 w-4 text-red-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {favoriteProperties.length}
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500">
                        Imóveis salvos
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Preço Médio
                    </CardTitle>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-600"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                        <path d="M12 18V6" />
                      </svg>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">€506,667</div>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500">
                        Valor médio dos imóveis
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Área Média
                    </CardTitle>
                    <div className="p-2 bg-green-100 rounded-full">
                      <Square className="h-4 w-4 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">152 m²</div>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500">
                        Área média dos imóveis
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="all" className="mb-6">
                <TabsList>
                  <TabsTrigger value="all">
                    Todos ({favoriteProperties.length})
                  </TabsTrigger>
                  <TabsTrigger value="apartments">Apartamentos (2)</TabsTrigger>
                  <TabsTrigger value="houses">Moradias (1)</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Properties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProperties.map((property) => (
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
                      <div className="absolute top-3 right-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-white/80 hover:bg-white rounded-full"
                        >
                          <Heart className="h-4 w-4 text-red-600 fill-red-600" />
                        </Button>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${property.statusColor}`}
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
                        <div className="flex space-x-3 text-gray-600 text-sm">
                          <div className="flex items-center">
                            <Bed className="h-3 w-3 mr-1" />
                            <span>{property.bedrooms}</span>
                          </div>
                          <div className="flex items-center">
                            <Bath className="h-3 w-3 mr-1" />
                            <span>{property.bathrooms}</span>
                          </div>
                          <div className="flex items-center">
                            <Square className="h-3 w-3 mr-1" />
                            <span>{property.area}m²</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Agendar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                        >
                          <Share2 className="h-3 w-3 mr-1" />
                          Partilhar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remover
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

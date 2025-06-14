import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import UnifiedSidebar from "@/components/common/UnifiedSidebar";
import UnifiedTopbar from "@/components/common/UnifiedTopbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Filter,
  Plus,
  List,
} from "lucide-react";

export default async function OwnerVisitsPage() {
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

  // Mock visits data
  const visits = [
    {
      id: 1,
      property: "Apartamento T3 em Cascais",
      address: "Rua das Palmeiras, 123, Cascais",
      client: "Ana Silva",
      date: "2023-06-15",
      time: "10:00",
      status: "scheduled",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=80",
    },
    {
      id: 2,
      property: "Moradia V4 com Piscina",
      address: "Avenida dos Pinheiros, 45, Sintra",
      client: "Carlos Mendes",
      date: "2023-06-16",
      time: "14:30",
      status: "scheduled",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80",
    },
    {
      id: 3,
      property: "Loft Moderno no Centro",
      address: "Rua Augusta, 78, Baixa, Lisboa",
      client: "Maria Oliveira",
      date: "2023-06-14",
      time: "09:15",
      status: "completed",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=80",
    },
    {
      id: 4,
      property: "Apartamento T2 com Terraço",
      address: "Rua das Flores, 32, Parque das Nações, Lisboa",
      client: "Ricardo Almeida",
      date: "2023-06-17",
      time: "16:00",
      status: "cancelled",
      image:
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500&q=80",
    },
    {
      id: 5,
      property: "Moradia Rústica com Terreno",
      address: "Estrada Nacional 10, Km 15, Palmela",
      client: "Sofia Martins",
      date: "2023-06-15",
      time: "11:30",
      status: "scheduled",
      image:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&q=80",
    },
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Agendada";
      case "completed":
        return "Concluída";
      case "cancelled":
        return "Cancelada";
      default:
        return status;
    }
  };

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
                      Agenda de Visitas
                    </h1>
                    <p className="text-gray-500 mt-1">
                      Gerencie as visitas agendadas para seus imóveis
                    </p>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Nova Visita
                  </Button>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex justify-end mb-4">
                <div className="bg-white border rounded-md inline-flex p-1 shadow-sm">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <List className="h-4 w-4" />
                    Lista
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Calendar className="h-4 w-4" />
                    Calendário
                  </Button>
                </div>
              </div>

              {/* Visits List */}
              <div className="space-y-4">
                {visits.map((visit) => (
                  <div
                    key={visit.id}
                    className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">
                          {visit.property}
                        </h3>
                        <div className="flex items-center text-gray-500 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{visit.address}</span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(visit.status)}`}
                      >
                        {getStatusText(visit.status)}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm">{visit.client}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm">
                          {new Date(visit.date).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm">{visit.time}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        Detalhes
                      </Button>
                      {visit.status === "scheduled" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SubscriptionCheck>
  );
}

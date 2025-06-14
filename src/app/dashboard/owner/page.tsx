"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  RefreshCw,
  Plus,
  ChevronRight,
  MessageSquare,
  Heart,
  MapPin,
} from "lucide-react";
import UserRoleDashboard from "@/components/UserRoleDashboard";
import UnifiedSidebar from "@/components/common/UnifiedSidebar";
import UnifiedTopbar from "@/components/common/UnifiedTopbar";
import { SubscriptionCheck } from "@/components/subscription-check";

export default function OwnerDashboardPage() {
  const [userName, setUserName] = useState("Utilizador");
  const [userRole, setUserRole] = useState("Owner");
  const [userEmail, setUserEmail] = useState("email@example.com");

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email);
        setUserName(user.user_metadata?.full_name || user.email);
        // Opcionalmente buscar role da tabela "users"
        const { data, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        if (data?.role) setUserRole(data.role);
      }
    };

    fetchUser();
  }, []);

  const recentMessages = [
    {
      name: "Ana Silva",
      message: "Olá, tenho interesse na sua propriedade...",
      time: "Há 2 horas",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
      property: "Apartamento T3 em Cascais",
    },
    {
      name: "Carlos Mendes",
      message: "Quando posso visitar o imóvel?",
      time: "Há 5 horas",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      property: "Moradia V4 com Piscina",
    },
    {
      name: "Maria Oliveira",
      message: "Gostaria de saber se o preço é negociável",
      time: "Ontem",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      property: "Loft Moderno no Centro",
    },
  ];

  const favoriteProperties = [
    {
      title: "Apartamento T3 em Cascais",
      location: "Cascais, Lisboa",
      price: "€450,000",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=80",
    },
    {
      title: "Moradia V4 com Piscina",
      location: "Sintra, Lisboa",
      price: "€750,000",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80",
    },
    {
      title: "Loft Moderno no Centro",
      location: "Baixa, Lisboa",
      price: "€320,000",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=80",
    },
  ];

  return (
    <SubscriptionCheck>
      <div className="flex">
        <UnifiedSidebar userRole={userRole} />
        <div className="flex-1 transition-all duration-300">
          <UnifiedTopbar
            variant="dashboard"
            userRole={userRole}
            userName={userName}
          />
          <main className="w-full bg-gray-50 min-h-screen pl-0 md:pl-64 pt-16">
            <div className="container mx-auto px-4 py-8">
              <div className="border-b border-gray-200 px-0 py-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                      Bem-Vindo {userName}
                    </h1>
                    <p className="text-gray-500 mt-1">
                      Aqui está um resumo da sua atividade
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

              <UserRoleDashboard defaultRole={userRole} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Recent Messages */}
                <Card className="shadow-sm hover:shadow-md transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">
                      Mensagens Recentes
                    </CardTitle>
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <img
                            src={msg.avatar}
                            alt={msg.name}
                            className="h-10 w-10 rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-gray-900">
                                {msg.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {msg.time}
                              </p>
                            </div>
                            <p className="text-xs font-medium text-blue-600 mb-1">
                              {msg.property}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {msg.message}
                            </p>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="default"
                        className="w-full hover:bg-blue-700 mt-2"
                      >
                        Ver todas as mensagens
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Favorites */}
                <Card className="shadow-sm hover:shadow-md transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">
                      Favoritos Recentes
                    </CardTitle>
                    <Heart className="h-5 w-5 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {favoriteProperties.map((prop, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <img
                            src={prop.image}
                            alt={prop.title}
                            className="h-14 w-20 object-cover rounded-md"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {prop.title}
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <MapPin className="h-3 w-3 mr-1" />
                              {prop.location}
                            </div>
                            <div className="text-xs text-gray-500">
                              <span className="mr-2">{prop.location}</span>
                              <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                {prop.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="default"
                        className="w-full hover:bg-blue-700 mt-2"
                      >
                        Ver todos os favoritos
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SubscriptionCheck>
  );
}

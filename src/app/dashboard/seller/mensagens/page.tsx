import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import UnifiedSidebar from "@/components/common/UnifiedSidebar";
import UnifiedTopbar from "@/components/common/UnifiedTopbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageSquare,
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function ownerMessagesPage() {
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

  // Mock messages data
  const messages = [
    {
      id: 1,
      sender: {
        name: "Ana Silva",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
      },
      property: "Apartamento T3 em Cascais",
      message:
        "Olá, tenho interesse na sua propriedade. Gostaria de agendar uma visita para o próximo fim de semana.",
      time: "Há 2 horas",
      unread: true,
    },
    {
      id: 2,
      sender: {
        name: "Carlos Mendes",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      },
      property: "Moradia V4 com Piscina",
      message:
        "Quando posso visitar o imóvel? Estou disponível durante a semana.",
      time: "Há 5 horas",
      unread: true,
    },
    {
      id: 3,
      sender: {
        name: "Maria Oliveira",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      },
      property: "Loft Moderno no Centro",
      message:
        "Gostaria de saber se o preço é negociável. Estou muito interessado no imóvel.",
      time: "Ontem",
      unread: false,
    },
    {
      id: 4,
      sender: {
        name: "Ricardo Almeida",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ricardo",
      },
      property: "Apartamento T3 em Cascais",
      message:
        "O imóvel tem estacionamento? E quanto às despesas de condomínio?",
      time: "Há 2 dias",
      unread: false,
    },
    {
      id: 5,
      sender: {
        name: "Sofia Martins",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
      },
      property: "Moradia V4 com Piscina",
      message:
        "Olá, o imóvel ainda está disponível? Gostaria de mais informações.",
      time: "Há 3 dias",
      unread: false,
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
                      Mensagens
                    </h1>
                    <p className="text-gray-500 mt-1">
                      Gerencie suas conversas com potenciais compradores
                    </p>
                  </div>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="relative flex-grow max-w-md">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    placeholder="Pesquisar mensagens..."
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
              </div>

              {/* Messages List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conversas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start space-x-3 p-4 rounded-lg cursor-pointer ${message.unread ? "bg-blue-50" : "hover:bg-gray-50"}`}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={message.sender.avatar}
                            alt={message.sender.name}
                          />
                          <AvatarFallback>
                            {message.sender.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <p
                              className={`text-sm font-medium ${message.unread ? "text-blue-600" : "text-gray-900"}`}
                            >
                              {message.sender.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {message.time}
                            </p>
                          </div>
                          <p className="text-xs font-medium text-blue-600 mb-1">
                            {message.property}
                          </p>
                          <p
                            className={`text-sm ${message.unread ? "text-gray-800" : "text-gray-600"} truncate`}
                          >
                            {message.message}
                          </p>
                          {message.unread && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                              Nova mensagem
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SubscriptionCheck>
  );
}

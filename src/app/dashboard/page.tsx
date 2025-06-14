import { createClient } from "../../../supabase/server";
import {
  InfoIcon,
  UserCircle,
  Home,
  Building,
  User,
  Users,
  Briefcase,
  LineChart,
  MessageSquare,
} from "lucide-react";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import UnifiedSidebar from "@/components/common/UnifiedSidebar";
import UnifiedTopbar from "@/components/common/UnifiedTopbar";
import UserRoleDashboard from "@/components/UserRoleDashboard";

export default async function Dashboard() {
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

  if (userData?.role === "proprietario(a)") {
    return redirect("/dashboard/owner");
  }

  // Redirect admin to admin dashboard
  if (userData?.role === "Administrator") {
    return redirect("/dashboard/admin");
  }

  // Default to Buyer if no role is set
  const userRole = userData?.role || "Buyer";

  return (
    <SubscriptionCheck>
      <div className="flex">
        <UnifiedSidebar userRole={userRole} />
        <div className="flex-1 transition-all duration-300">
          <UnifiedTopbar
            variant="dashboard"
            userRole={userRole}
            userName={user.email}
          />
          <main className="w-full bg-gray-50 min-h-screen pl-0 md:pl-64 pt-16">
            <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
              {/* Header Section */}
              <header className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-blue-700">
                  {userRole} Dashboard
                </h1>
                <div className="bg-blue-50 text-sm p-3 px-4 rounded-lg text-blue-700 flex gap-2 items-center border border-blue-200">
                  <InfoIcon size="14" />
                  <span>
                    Welcome to your {userRole} dashboard. Access features
                    specific to your role.
                  </span>
                </div>
              </header>

              {/* Role-specific Content */}
              {userRole === "owner" && (
                <div className="space-y-6">
                  {/* Welcome Section */}
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h1 className="text-2xl font-semibold text-gray-800">
                          Bem-Vindo{" "}
                          {user.email?.split("@")[0] || "Proprietário"}
                        </h1>
                        <p className="text-gray-500 mt-1">
                          Aqui está um resumo da sua atividade
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                          <svg
                            className="h-4 w-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Exportar
                        </button>
                        <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                          <svg
                            className="h-4 w-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Atualizar
                        </button>
                        <button className="flex items-center px-3 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                          <svg
                            className="h-4 w-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Nova Propriedade
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Content */}
                  <UserRoleDashboard defaultRole="owner" />

                  {/* Recent Messages and Favorites */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recent Messages */}
                    <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-all">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium">
                            Mensagens Recentes
                          </h3>
                          <MessageSquare className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="space-y-4">
                          {[
                            {
                              name: "Ana Silva",
                              message:
                                "Olá, tenho interesse na sua propriedade...",
                              time: "Há 2 horas",
                              avatar:
                                "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
                              property: "Apartamento T3 em Cascais",
                            },
                            {
                              name: "Carlos Mendes",
                              message: "Quando posso visitar o imóvel?",
                              time: "Há 5 horas",
                              avatar:
                                "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
                              property: "Moradia V4 com Piscina",
                            },
                            {
                              name: "Maria Oliveira",
                              message:
                                "Gostaria de saber se o preço é negociável",
                              time: "Ontem",
                              avatar:
                                "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
                              property: "Loft Moderno no Centro",
                            },
                          ].map((message, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                              <div className="flex-shrink-0">
                                <img
                                  src={message.avatar}
                                  alt={message.name}
                                  className="h-10 w-10 rounded-full"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between">
                                  <p className="text-sm font-medium text-gray-900">
                                    {message.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {message.time}
                                  </p>
                                </div>
                                <p className="text-xs font-medium text-blue-600 mb-1">
                                  {message.property}
                                </p>
                                <p className="text-sm text-gray-600 truncate">
                                  {message.message}
                                </p>
                              </div>
                            </div>
                          ))}
                          <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center">
                            Ver todas as mensagens
                            <svg
                              className="ml-1 h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Recent Favorites */}
                    <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-all">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium">
                            Guardados Recentemente
                          </h3>
                          <svg
                            className="h-5 w-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                          </svg>
                        </div>
                        <div className="space-y-4">
                          {[
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
                          ].map((property, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                              <div className="flex-shrink-0">
                                <img
                                  src={property.image}
                                  alt={property.title}
                                  className="h-14 w-20 object-cover rounded-md"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {property.title}
                                </p>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                  <svg
                                    className="h-3 w-3 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                  {property.location}
                                </div>
                                <div className="mt-1">
                                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-600">
                                    {property.price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                          <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center">
                            Ver todos os favoritos
                            <svg
                              className="ml-1 h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {userRole === "Buyer" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Home size={24} className="text-blue-700" />
                      </div>
                      <h2 className="font-semibold text-lg">
                        Browse Properties
                      </h2>
                    </div>
                    <p className="text-gray-600">Find your dream property</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-amber-100 rounded-lg">
                        <Home size={24} className="text-amber-700" />
                      </div>
                      <h2 className="font-semibold text-lg">
                        Saved Properties
                      </h2>
                    </div>
                    <p className="text-gray-600">View your favorite listings</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <User size={24} className="text-green-700" />
                      </div>
                      <h2 className="font-semibold text-lg">My Requests</h2>
                    </div>
                    <p className="text-gray-600">
                      Track your property visit requests
                    </p>
                  </div>
                </div>
              )}

              {/* Builder role content */}
              {userRole === "Builder" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Building size={24} className="text-blue-700" />
                      </div>
                      <h2 className="font-semibold text-lg">Projects</h2>
                    </div>
                    <p className="text-gray-600">
                      Manage your construction projects
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Building size={24} className="text-green-700" />
                      </div>
                      <h2 className="font-semibold text-lg">Developments</h2>
                    </div>
                    <p className="text-gray-600">
                      Track your property developments
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <LineChart size={24} className="text-purple-700" />
                      </div>
                      <h2 className="font-semibold text-lg">Site Visits</h2>
                    </div>
                    <p className="text-gray-600">
                      Schedule and manage site visits
                    </p>
                  </div>
                </div>
              )}

              {/* User Profile Section */}
              <section className="bg-white rounded-xl p-6 border shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <UserCircle size={48} className="text-blue-600" />
                  <div>
                    <h2 className="font-semibold text-xl">User Profile</h2>
                    <p className="text-sm text-gray-600">
                      {user.email} • {userRole}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 overflow-hidden">
                  <pre className="text-xs font-mono max-h-48 overflow-auto">
                    {JSON.stringify(userData || user, null, 2)}
                  </pre>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </SubscriptionCheck>
  );
}

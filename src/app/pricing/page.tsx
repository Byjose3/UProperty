"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ownerPricingCard from "@/components/pricing/ownerPricingCard";
import { Button } from "@/components/ui/button";
import { Search, Bell, Building } from "lucide-react";
import ownerSidebar from "@/components/common/ownerSidebar";
import UserProfileDropdown from "@/components/admin/UserProfileDropdown";
import Link from "next/link";
import { createClient } from "@/supabase/client";

export default function Pricing() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("João Silva");
  const [subscriptionType, setSubscriptionType] = useState("monthly");
  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // If we have user data from auth, use it
        setUserName(
          user.user_metadata?.full_name || user.email || "João Silva",
        );
      }
    };

    fetchUserData();
  }, [supabase]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const plans = [
    {
      name: "Essencial",
      description: "Para vendedores com um único imóvel",
      popular: false,
      features: ["1 imóvel", "Visitas ilimitadas", "Suporte básico"],
      monthlyOption: {
        id: "price_essencial_monthly",
        amount: 0,
        interval: "month",
        isFree: true,
      },
      annualOption: {
        id: "price_essencial_annual",
        amount: 0,
        interval: "year",
        isFree: true,
      },
    },
    {
      name: "Smart",
      description: "Para vendedores com dois ou mais imóveis",
      popular: true,
      features: [
        "Até 5 imóveis",
        "Visitas ilimitadas",
        "Suporte prioritário",
        "Estatísticas avançadas",
      ],
      monthlyOption: {
        id: "price_smart_monthly_trial",
        amount: 499,
        interval: "month",
        trialDays: 7,
      },
      annualOption: {
        id: "price_smart_annual_trial",
        amount: 4990,
        interval: "year",
        trialDays: 7,
      },
    },
    {
      name: "Premium",
      description: "Para vendedores profissionais e agências",
      popular: false,
      features: [
        "Imóveis ilimitados",
        "Visitas ilimitadas",
        "Suporte VIP 24/7",
        "Estatísticas avançadas",
        "Ferramentas de marketing",
        "Integração com CRM",
      ],
      monthlyOption: {
        id: "price_premium_monthly_trial",
        amount: 999,
        interval: "month",
        trialDays: 7,
      },
      annualOption: {
        id: "price_premium_annual_trial",
        amount: 9990,
        interval: "year",
        trialDays: 7,
      },
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar do favoritepage.js */}
      <ownerSidebar
        activeTab="dashboard"
        onTabChange={setActiveTab}
        isCollapsed={isCollapsed}
        onToggleCollapse={(collapsed) => setIsCollapsed(collapsed)}
        subscriptionType={subscriptionType}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Custom Topbar do favoritepage.js */}
        <div
          className={`flex items-center justify-between bg-white p-4 border-b fixed top-0 right-0 z-50 transition-all duration-300 ease-in-out ${isCollapsed ? "w-[calc(100%-4rem)] ml-16" : "w-[calc(100%-16rem)] ml-64"}`}
        >
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2"
              placeholder="Pesquisar..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 mr-2 gap-x-4">
              <Link href="/market">
                <Button
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <Building className="h-4 w-4 text-gray-600" />
                  <span>Market</span>
                </Button>
              </Link>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  2
                </span>
              </Button>
            </div>
            <div className="bg-gray-100 h-8 w-px mx-2"></div>
            <UserProfileDropdown userRole="owner" userName={userName} />
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-64"} pt-16 flex-1 overflow-auto`}
        >
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Planos de Assinatura</h1>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="mb-8 text-center">
                <p className="text-gray-500 mb-6">
                  Escolha o período de cobrança
                </p>
                <Tabs defaultValue="monthly" className="w-full">
                  <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-gray-100 rounded-full overflow-hidden p-1">
                    <TabsTrigger
                      value="monthly"
                      className="rounded-full data-[state=active]:bg-white data-[state=active]:text-black"
                    >
                      Mensal
                    </TabsTrigger>
                    <TabsTrigger
                      value="annual"
                      className="rounded-full data-[state=active]:bg-white data-[state=active]:text-black"
                    >
                      Anual{" "}
                      <span className="text-xs text-green-600 ml-1">
                        (Economize 20%)
                      </span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="monthly" className="mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                      {plans.map((plan, index) => (
                        <ownerPricingCard
                          key={index}
                          plan={plan}
                          user={null}
                          activeOption="monthly"
                        />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="annual" className="mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                      {plans.map((plan, index) => (
                        <ownerPricingCard
                          key={index}
                          plan={plan}
                          user={null}
                          activeOption="annual"
                        />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

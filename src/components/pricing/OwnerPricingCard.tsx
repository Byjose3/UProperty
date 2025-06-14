"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Clock } from "lucide-react";
import { supabase } from "../../../supabase/supabase";

export interface PlanOption {
  id: string;
  amount: number;
  interval: string;
  trialDays?: number;
  isFree?: boolean;
}

export interface PricingPlan {
  name: string;
  description?: string;
  popular?: boolean;
  features?: string[];
  order?: number;
  monthlyOption: PlanOption;
  annualOption: PlanOption;
}

export default function OwnerPricingCard({
  plan,
  user,
  activeOption = "monthly",
}: {
  plan: PricingPlan;
  user: User | null;
  activeOption?: "monthly" | "annual";
}) {
  // Handle checkout process
  const handleCheckout = async (priceId: string) => {
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = "/login?redirect=pricing";
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-create-checkout",
        {
          body: {
            price_id: priceId,
            user_id: user.id,
            return_url: `${window.location.origin}/pricing`,
          },
          headers: {
            "X-Customer-Email": user.email || "",
          },
        },
      );

      if (error) {
        throw error;
      }

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "essencial":
        return "bg-orange-500";
      case "smart":
        return "bg-blue-500";
      case "premium":
        return "bg-purple-500";
      default:
        return "bg-orange-500";
    }
  };

  const getPlanDescription = (plan: PricingPlan) => {
    if (plan.name.toLowerCase() === "essencial") {
      return "Para proprietários com um único imóvel";
    } else if (plan.name.toLowerCase() === "smart") {
      return "Para proprietários com dois ou mais imóveis";
    } else if (plan.name.toLowerCase() === "premium") {
      return "Para proprietários com mais de dois imóveis";
    }
    return plan.description || "";
  };

  const renderPriceDisplay = (option?: PlanOption) => {
    if (!option) {
      return (
        <div className="flex flex-col items-start w-full">
          <span className="text-4xl font-bold text-black">--</span>
        </div>
      );
    }

    if (option.isFree) {
      return (
        <div className="flex flex-col items-start w-full">
          <span className="text-5xl font-bold text-black">Gratuito</span>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-start w-full">
        <div className="flex items-baseline">
          <span className="text-xl font-medium text-black"></span>
          <span className="text-5xl font-bold text-black ml-1">
            {(option.amount / 100).toFixed(2).replace(".", ",")}€
          </span>
          <span className="text-gray-600 ml-1">
            / {option.interval === "month" ? "Mês" : "Ano"}
          </span>
        </div>
      </div>
    );
  };

  const renderTrialBadge = (option?: PlanOption) => {
    if (!option) return null;

    if (option.trialDays && !option.isFree) {
      return <></>;
    }
    return null;
  };

  return (
    <Card className="w-full relative overflow-hidden bg-gray-50 border-0 rounded-md shadow-sm transition-all hover:shadow-md">
      {/* Popular badge removed */}
      <div className="p-4">
        <div
          className={`${getPlanColor(plan.name)} text-white font-medium text-sm px-4 py-1 rounded-md w-fit mb-4`}
        >
          {plan.name}
        </div>

        <div className="mt-6">
          {activeOption === "monthly"
            ? renderPriceDisplay(plan.monthlyOption)
            : renderPriceDisplay(plan.annualOption)}
        </div>

        {activeOption === "monthly"
          ? renderTrialBadge(plan.monthlyOption)
          : renderTrialBadge(plan.annualOption)}

        <div className="mt-6 text-gray-600 text-sm min-h-[60px]">
          {getPlanDescription(plan)}
        </div>

        <div className="mt-6">
          <Button
            onClick={() => {
              const option =
                activeOption === "monthly"
                  ? plan.monthlyOption
                  : plan.annualOption;
              option && handleCheckout(option.id);
            }}
            className="w-full py-2 text-base font-medium bg-gray-300 hover:bg-gray-400 text-gray-700"
            variant="secondary"
          >
            {(
              activeOption === "monthly"
                ? plan.monthlyOption?.isFree
                : plan.annualOption?.isFree
            )
              ? "Começar Grátis"
              : "Atualizar"}
          </Button>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6 min-h-[150px]">
          {plan.features &&
            plan.features.length > 0 &&
            plan.features.map((feature, index) => (
              <div key={index} className="flex items-center mb-2">
                <svg
                  className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-600 text-sm">{feature}</span>
              </div>
            ))}
        </div>
      </div>
    </Card>
  );
}

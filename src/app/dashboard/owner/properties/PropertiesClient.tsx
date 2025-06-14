"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { getUserProperties } from "@/services/propertyService";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  features: string[];
  images: string[];
  status: string;
  views: number;
  inquiries: number;
  created_at: string;
  updated_at: string;
}

interface PropertiesClientProps {
  initialProperties: Property[];
  userId: string;
}

export default function PropertiesClient({
  initialProperties,
  userId,
}: PropertiesClientProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [loading, setLoading] = useState(false);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("properties-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "properties",
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          console.log("Real-time update:", payload);
          // Refresh properties when changes occur
          await refreshProperties();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const refreshProperties = async () => {
    setLoading(true);
    try {
      const updatedProperties = await getUserProperties(supabase, userId);
      if (updatedProperties) {
        setProperties(updatedProperties);
      }
    } catch (error) {
      console.error("Error refreshing properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      active: "Ativo",
      draft: "Rascunho",
      inactive: "Inativo",
      sold: "Vendido",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      active: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      inactive: "bg-red-100 text-red-800",
      sold: "bg-blue-100 text-blue-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <MapPin className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma propriedade encontrada
        </h3>
        <p className="text-gray-500 mb-6">
          Você ainda não criou nenhuma propriedade. Comece criando sua primeira
          propriedade.
        </p>
        <Button asChild>
          <a href="/dashboard/owner/properties/new">
            Criar Primeira Propriedade
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Card
          key={property.id}
          className="overflow-hidden shadow-sm hover:shadow-md transition-all"
        >
          <div className="relative">
            <img
              src={
                property.images[0] ||
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
              }
              alt={property.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-3 left-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  property.status,
                )}`}
              >
                {getStatusLabel(property.status)}
              </span>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-1 truncate">
              {property.title}
            </h3>
            <div className="flex items-center text-gray-500 text-sm mb-2">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">
                {property.address}, {property.city}
              </span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <p className="text-lg font-bold text-blue-600">
                {formatPrice(property.price)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div className="bg-gray-50 p-2 rounded-md">
                <div className="text-gray-500">Área</div>
                <div className="font-medium">{property.area}m²</div>
              </div>
              <div className="bg-gray-50 p-2 rounded-md">
                <div className="text-gray-500">Tipo</div>
                <div className="font-medium capitalize">
                  {property.property_type === "apartment"
                    ? "Apartamento"
                    : property.property_type === "house"
                      ? "Casa"
                      : property.property_type === "villa"
                        ? "Moradia"
                        : property.property_type === "land"
                          ? "Terreno"
                          : property.property_type === "commercial"
                            ? "Comercial"
                            : property.property_type}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 p-2 rounded-md">
                <div className="text-gray-500">Visualizações</div>
                <div className="font-medium">{property.views}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded-md">
                <div className="text-gray-500">Contatos</div>
                <div className="font-medium">{property.inquiries}</div>
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
  );
}

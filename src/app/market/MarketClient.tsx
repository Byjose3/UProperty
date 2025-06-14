"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  Search,
  Filter,
  Eye,
  MessageSquare,
} from "lucide-react";

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
  user_id: string;
  users?: {
    full_name: string;
    email: string;
  };
}

interface MarketClientProps {
  initialProperties: Property[];
  currentUserId: string;
}

export default function MarketClient({
  initialProperties,
  currentUserId,
}: MarketClientProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [filteredProperties, setFilteredProperties] =
    useState<Property[]>(initialProperties);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");

  // Set up real-time subscription for all properties
  useEffect(() => {
    const channel = supabase
      .channel("market-properties-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "properties",
          filter: "status=eq.active",
        },
        async (payload) => {
          console.log("Market real-time update:", payload);
          await refreshProperties();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Apply filters whenever search term or filters change
  useEffect(() => {
    let filtered = properties;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.address.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Property type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(
        (property) => property.property_type === selectedType,
      );
    }

    // Price range filter
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((property) => {
        if (max) {
          return property.price >= min && property.price <= max;
        } else {
          return property.price >= min;
        }
      });
    }

    // City filter
    if (selectedCity !== "all") {
      filtered = filtered.filter(
        (property) =>
          property.city.toLowerCase() === selectedCity.toLowerCase(),
      );
    }

    setFilteredProperties(filtered);
  }, [properties, searchTerm, selectedType, priceRange, selectedCity]);

  const refreshProperties = async () => {
    setLoading(true);
    try {
      const { data: updatedProperties, error } = await supabase
        .from("properties")
        .select(
          `
          *,
          users!properties_user_id_fkey(
            full_name,
            email
          )
        `,
        )
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error refreshing properties:", error);
      } else if (updatedProperties) {
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

  const getPropertyTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      apartment: "Apartamento",
      house: "Casa",
      villa: "Moradia",
      land: "Terreno",
      commercial: "Comercial",
    };
    return typeMap[type] || type;
  };

  const handleViewProperty = async (propertyId: string) => {
    // Increment view count
    try {
      await supabase.rpc("increment_property_views", {
        property_id: propertyId,
      });
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const handleContactowner = async (propertyId: string) => {
    // Increment inquiry count
    try {
      await supabase.rpc("increment_property_inquiries", {
        property_id: propertyId,
      });
    } catch (error) {
      console.error("Error incrementing inquiries:", error);
    }
  };

  // Get unique cities for filter
  const uniqueCities = Array.from(
    new Set(properties.map((property) => property.city)),
  ).sort();

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <MapPin className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma propriedade disponível
        </h3>
        <p className="text-gray-500 mb-6">
          Não há propriedades ativas no mercado no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar propriedades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Property Type Filter */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="apartment">Apartamento</SelectItem>
              <SelectItem value="house">Casa</SelectItem>
              <SelectItem value="villa">Moradia</SelectItem>
              <SelectItem value="land">Terreno</SelectItem>
              <SelectItem value="commercial">Comercial</SelectItem>
            </SelectContent>
          </Select>

          {/* Price Range Filter */}
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger>
              <SelectValue placeholder="Preço" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os preços</SelectItem>
              <SelectItem value="0-200000">Até €200.000</SelectItem>
              <SelectItem value="200000-400000">€200.000 - €400.000</SelectItem>
              <SelectItem value="400000-600000">€400.000 - €600.000</SelectItem>
              <SelectItem value="600000-1000000">
                €600.000 - €1.000.000
              </SelectItem>
              <SelectItem value="1000000">Acima de €1.000.000</SelectItem>
            </SelectContent>
          </Select>

          {/* City Filter */}
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger>
              <SelectValue placeholder="Cidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as cidades</SelectItem>
              {uniqueCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          {filteredProperties.length} propriedade(s) encontrada(s)
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card
            key={property.id}
            className="overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => handleViewProperty(property.id)}
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
              <div className="absolute top-3 right-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/80 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle favorite toggle
                  }}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {getPropertyTypeLabel(property.property_type)}
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

              {/* Property details */}
              <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                <div className="bg-gray-50 p-2 rounded-md text-center">
                  <Square className="h-4 w-4 mx-auto mb-1 text-gray-500" />
                  <div className="font-medium">{property.area}m²</div>
                </div>
                {property.bedrooms && (
                  <div className="bg-gray-50 p-2 rounded-md text-center">
                    <Bed className="h-4 w-4 mx-auto mb-1 text-gray-500" />
                    <div className="font-medium">{property.bedrooms}</div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="bg-gray-50 p-2 rounded-md text-center">
                    <Bath className="h-4 w-4 mx-auto mb-1 text-gray-500" />
                    <div className="font-medium">{property.bathrooms}</div>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                <div className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  <span>{property.views} visualizações</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  <span>{property.inquiries} contatos</span>
                </div>
              </div>

              {/* owner info */}
              {property.users && (
                <div className="text-xs text-gray-500 mb-3">
                  Anunciado por:{" "}
                  {property.users.full_name || property.users.email}
                </div>
              )}

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProperty(property.id);
                  }}
                >
                  Ver Detalhes
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContactowner(property.id);
                  }}
                >
                  Contactar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProperties.length === 0 && properties.length > 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Filter className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma propriedade encontrada
          </h3>
          <p className="text-gray-500 mb-6">
            Tente ajustar os filtros para encontrar mais propriedades.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setSelectedType("all");
              setPriceRange("all");
              setSelectedCity("all");
            }}
          >
            Limpar Filtros
          </Button>
        </div>
      )}
    </div>
  );
}

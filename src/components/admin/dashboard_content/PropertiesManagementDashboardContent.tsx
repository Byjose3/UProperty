"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RefreshCw, Filter } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

interface PropertiesManagementDashboardContentProps {
  searchQuery: string;
  onExportCSV: (dataType: string) => void;
}

export default function PropertiesManagementDashboardContent({
  searchQuery,
  onExportCSV,
}: PropertiesManagementDashboardContentProps) {
  const [propertiesData, setPropertiesData] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");
  const [propertyStatusFilter, setPropertyStatusFilter] = useState("all");

  // Function to fetch properties data
  const fetchPropertiesData = async () => {
    try {
      setPropertiesLoading(true);

      // Fetch properties data from Supabase
      const { data, error } = await supabase
        .from("properties")
        .select("*, users(name, email)")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // If no data yet, use mock data
      if (!data || data.length === 0) {
        setPropertiesData([
          {
            id: 1,
            title: "Apartamento Moderno",
            address: "Rua das Flores, 123",
            price: 450000,
            type: "Apartamento",
            status: "Ativo",
            created_at: "2023-04-15T10:30:00",
            users: { name: "Pedro Costa", email: "pedro@exemplo.com" },
          },
          {
            id: 2,
            title: "Casa com Jardim",
            address: "Av. Principal, 456",
            price: 750000,
            type: "Casa",
            status: "Pendente",
            created_at: "2023-04-10T14:45:00",
            users: { name: "Ana Santos", email: "ana@exemplo.com" },
          },
          {
            id: 3,
            title: "Cobertura Duplex",
            address: "Rua do Sol, 789",
            price: 1200000,
            type: "Cobertura",
            status: "Vendido",
            created_at: "2023-04-05T09:15:00",
            users: { name: "Luísa Ferreira", email: "luisa@exemplo.com" },
          },
          {
            id: 4,
            title: "Terreno para Construção",
            address: "Estrada Nova, 321",
            price: 350000,
            type: "Terreno",
            status: "Ativo",
            created_at: "2023-04-02T16:20:00",
            users: { name: "Ricardo Almeida", email: "ricardo@exemplo.com" },
          },
          {
            id: 5,
            title: "Sala Comercial",
            address: "Centro Empresarial, 555",
            price: 280000,
            type: "Comercial",
            status: "Inativo",
            created_at: "2023-03-28T11:10:00",
            users: { name: "Sofia Martins", email: "sofia@exemplo.com" },
          },
        ]);
      } else {
        setPropertiesData(data);
      }
    } catch (error) {
      console.error("Error fetching properties data:", error);
    } finally {
      setPropertiesLoading(false);
    }
  };

  // Function to handle property type filter change
  const handlePropertyTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPropertyTypeFilter(e.target.value);
  };

  // Function to handle property status filter change
  const handlePropertyStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPropertyStatusFilter(e.target.value);
  };

  // Filter properties based on search query and filters
  const filteredProperties = propertiesData.filter((property) => {
    // Search filter
    const matchesSearch =
      !searchQuery ||
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.users?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    // Type filter
    const matchesType =
      propertyTypeFilter === "all" || property.type === propertyTypeFilter;

    // Status filter
    const matchesStatus =
      propertyStatusFilter === "all" ||
      property.status === propertyStatusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Fetch properties data on component mount
  useEffect(() => {
    fetchPropertiesData();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gerenciamento de Propriedades</CardTitle>
        <div className="flex space-x-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Tipo:</span>
            <select
              className="text-sm border border-gray-300 rounded-md p-1"
              value={propertyTypeFilter}
              onChange={handlePropertyTypeChange}
            >
              <option value="all">Todos</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Casa">Casa</option>
              <option value="Cobertura">Cobertura</option>
              <option value="Terreno">Terreno</option>
              <option value="Comercial">Comercial</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Status:</span>
            <select
              className="text-sm border border-gray-300 rounded-md p-1"
              value={propertyStatusFilter}
              onChange={handlePropertyStatusChange}
            >
              <option value="all">Todos</option>
              <option value="Ativo">Ativo</option>
              <option value="Pendente">Pendente</option>
              <option value="Vendido">Vendido</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPropertyTypeFilter("all");
              setPropertyStatusFilter("all");
            }}
          >
            <Filter className="h-4 w-4" />
            Limpar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {propertiesLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="grid grid-cols-7 bg-gray-50 p-4 font-medium text-sm">
              <div>Título</div>
              <div>Endereço</div>
              <div>Preço</div>
              <div>Tipo</div>
              <div>Status</div>
              <div>Proprietário</div>
              <div>Ações</div>
            </div>
            <div className="divide-y">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <div
                    key={property.id}
                    className="grid grid-cols-7 p-4 text-sm"
                  >
                    <div className="font-medium">{property.title}</div>
                    <div>{property.address}</div>
                    <div>€{property.price?.toLocaleString() || 0}</div>
                    <div>{property.type}</div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          property.status === "Ativo"
                            ? "bg-green-100 text-green-800"
                            : property.status === "Pendente"
                              ? "bg-amber-100 text-amber-800"
                              : property.status === "Vendido"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {property.status}
                      </span>
                    </div>
                    <div>{property.users?.name || "N/A"}</div>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-2 py-1 h-7"
                      >
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-2 py-1 h-7"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-2 py-1 h-7 bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  Nenhuma propriedade encontrada.
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

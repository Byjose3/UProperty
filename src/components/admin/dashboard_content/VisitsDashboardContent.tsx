"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Filter,
  Plus,
  Phone,
  Mail,
  Home,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Visit {
  id: number;
  property: string;
  address: string;
  client: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
}

export default function VisitsDashboardContent() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [filteredVisits, setFilteredVisits] = useState<Visit[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  useEffect(() => {
    // Simulate API call to fetch visits
    setTimeout(() => {
      const mockVisits: Visit[] = [
        {
          id: 1,
          property: "Apartamento Moderno",
          address: "Rua das Flores, 123",
          client: "João Silva",
          date: "2023-06-15",
          time: "10:00",
          status: "scheduled",
        },
        {
          id: 2,
          property: "Casa com Jardim",
          address: "Av. Principal, 456",
          client: "Maria Oliveira",
          date: "2023-06-16",
          time: "14:30",
          status: "scheduled",
        },
        {
          id: 3,
          property: "Cobertura Duplex",
          address: "Rua do Sol, 789",
          client: "Carlos Santos",
          date: "2023-06-14",
          time: "09:15",
          status: "completed",
        },
        {
          id: 4,
          property: "Terreno para Construção",
          address: "Estrada Nova, 321",
          client: "Ana Pereira",
          date: "2023-06-17",
          time: "16:00",
          status: "cancelled",
        },
        {
          id: 5,
          property: "Sala Comercial",
          address: "Centro Empresarial, 555",
          client: "Roberto Alves",
          date: "2023-06-15",
          time: "11:30",
          status: "scheduled",
        },
      ];
      setVisits(mockVisits);
      setFilteredVisits(mockVisits);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...visits];

    if (statusFilter !== "all") {
      result = result.filter((visit) => visit.status === statusFilter);
    }

    if (dateFilter !== "all") {
      const today = new Date().toISOString().split("T")[0];
      const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split("T")[0];

      if (dateFilter === "today") {
        result = result.filter((visit) => visit.date === today);
      } else if (dateFilter === "tomorrow") {
        result = result.filter((visit) => visit.date === tomorrow);
      } else if (dateFilter === "upcoming") {
        result = result.filter((visit) => visit.date > today);
      }
    }

    setFilteredVisits(result);
  }, [statusFilter, dateFilter, visits]);

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
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Agenda de Visitas</CardTitle>
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Nova Visita
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 bg-white p-2 rounded-md border">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                className="bg-transparent border-none text-sm focus:outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos os status</option>
                <option value="scheduled">Agendadas</option>
                <option value="completed">Concluídas</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>
            <div className="flex items-center gap-2 bg-white p-2 rounded-md border">
              <Calendar className="h-4 w-4 text-gray-500" />
              <select
                className="bg-transparent border-none text-sm focus:outline-none"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">Todas as datas</option>
                <option value="today">Hoje</option>
                <option value="tomorrow">Amanhã</option>
                <option value="upcoming">Próximas</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-500">Carregando visitas...</p>
            </div>
          ) : filteredVisits.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma visita encontrada com os filtros selecionados.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{visit.property}</h3>
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedVisit(visit)}
                        >
                          Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle className="text-xl">
                            {visit.property}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                              <h3 className="font-medium">
                                Informações da Visita
                              </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-3 ml-7">
                              <div>
                                <p className="text-sm text-gray-500">Data</p>
                                <p className="font-medium">
                                  {new Date(visit.date).toLocaleDateString(
                                    "pt-BR",
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Horário</p>
                                <p className="font-medium">{visit.time}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-sm text-gray-500">Status</p>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(visit.status)}`}
                                >
                                  {getStatusText(visit.status)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Home className="h-5 w-5 text-gray-600 mr-2" />
                              <h3 className="font-medium">
                                Informações do Imóvel
                              </h3>
                            </div>
                            <div className="ml-7 space-y-2">
                              <div>
                                <p className="text-sm text-gray-500">
                                  Endereço
                                </p>
                                <p className="font-medium">{visit.address}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Tipo</p>
                                <p className="font-medium">Residencial</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <User className="h-5 w-5 text-gray-600 mr-2" />
                              <h3 className="font-medium">
                                Informações do Cliente
                              </h3>
                            </div>
                            <div className="ml-7 space-y-2">
                              <div>
                                <p className="text-sm text-gray-500">Nome</p>
                                <p className="font-medium">{visit.client}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Contato</p>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center">
                                    <Phone className="h-4 w-4 text-gray-500 mr-1" />
                                    <span className="text-sm">
                                      (11) 99999-9999
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Mail className="h-4 w-4 text-gray-500 mr-1" />
                                    <span className="text-sm">
                                      {visit.client
                                        .toLowerCase()
                                        .replace(" ", ".")}
                                      @email.com
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Info className="h-5 w-5 text-gray-600 mr-2" />
                              <h3 className="font-medium">Observações</h3>
                            </div>
                            <div className="ml-7">
                              <p className="text-sm text-gray-600">
                                Cliente interessado em conhecer todos os
                                detalhes do imóvel, especialmente a área de
                                lazer e as condições de financiamento.
                              </p>
                            </div>
                          </div>
                        </div>
                        <DialogFooter className="gap-2">
                          {visit.status === "scheduled" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Cancelar Visita
                            </Button>
                          )}
                          <Button>Confirmar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";

export interface Visit {
  id: number;
  property: string;
  address: string;
  client: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
}

export function useVisitsData() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [filteredVisits, setFilteredVisits] = useState<Visit[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

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

  return {
    visits,
    filteredVisits,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    loading,
  };
}

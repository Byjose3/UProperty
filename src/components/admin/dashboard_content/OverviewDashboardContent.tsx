"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RefreshCw, Users } from "lucide-react";
import KPIs from "@/components/admin/KPIs";
import DataVisualizations from "@/components/admin/DataVisualizations";

interface OverviewDashboardContentProps {
  onExportKPIs: () => void;
  onRefreshData: () => void;
  loading: boolean;
}

export default function OverviewDashboardContent({
  onExportKPIs,
  onRefreshData,
  loading,
}: OverviewDashboardContentProps) {
  return (
    <div className="space-y-6">
      <KPIs />

      <DataVisualizations />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Alertas de Suporte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start p-3 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex-1">
                  <h4 className="font-medium text-amber-800">
                    Novo ticket de suporte
                  </h4>
                  <p className="text-sm text-amber-700">
                    João Silva reportou um problema com pagamentos
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    Há 2 horas atrás
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-amber-800 border-amber-300 hover:bg-amber-100"
                >
                  Ver
                </Button>
              </div>

              <div className="flex items-start p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex-1">
                  <h4 className="font-medium text-red-800">Ticket urgente</h4>
                  <p className="text-sm text-red-700">
                    Maria Oliveira não consegue acessar sua conta
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Há 30 minutos atrás
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-800 border-red-300 hover:bg-red-100"
                >
                  Ver
                </Button>
              </div>

              <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex-1">
                  <h4 className="font-medium text-blue-800">
                    Feedback do usuário
                  </h4>
                  <p className="text-sm text-blue-700">
                    Carlos Mendes enviou sugestões para melhorias
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Há 1 dia atrás</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-800 border-blue-300 hover:bg-blue-100"
                >
                  Ver
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <Users className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    Novo usuário <span className="font-medium">Ana Santos</span>{" "}
                    registrou-se como{" "}
                    <span className="text-blue-600">Comprador</span>
                  </p>
                  <p className="text-xs text-gray-500">Hoje, 10:45</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <Users className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    Usuário <span className="font-medium">Pedro Costa</span>{" "}
                    atualizou seu perfil
                  </p>
                  <p className="text-xs text-gray-500">Hoje, 09:30</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <Users className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    Usuário <span className="font-medium">Luísa Ferreira</span>{" "}
                    alterou sua assinatura para{" "}
                    <span className="text-green-600">Premium</span>
                  </p>
                  <p className="text-xs text-gray-500">Ontem, 15:20</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <Users className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    Novo usuário{" "}
                    <span className="font-medium">Ricardo Almeida</span>{" "}
                    registrou-se como{" "}
                    <span className="text-purple-600">Agência</span>
                  </p>
                  <p className="text-xs text-gray-500">Ontem, 11:15</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

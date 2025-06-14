"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "online" | "offline" | "busy";
}

const Agents = () => {
  // Mock data - in a real implementation, this would come from an API call to Supabase
  const agents: Agent[] = [
    {
      id: "1",
      name: "Ana Costa",
      role: "Arquiteta Chefe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
      status: "online",
    },
    {
      id: "2",
      name: "Pedro Santos",
      role: "Engenheiro Civil",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
      status: "busy",
    },
    {
      id: "3",
      name: "Luísa Ferreira",
      role: "Gerente de Projetos",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luisa",
      status: "offline",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "busy":
        return "bg-amber-500";
      case "offline":
      default:
        return "bg-gray-400";
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-all bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Agentes</CardTitle>
        <div className="p-2 bg-purple-100 rounded-full">
          <Users className="h-4 w-4 text-purple-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-all"
            >
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={agent.avatar} alt={agent.name} />
                  <AvatarFallback>{agent.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(agent.status)}`}
                  title={agent.status}
                />
              </div>
              <div className="ml-3">
                <div className="font-medium">{agent.name}</div>
                <div className="text-xs text-gray-500">{agent.role}</div>
              </div>
            </div>
          ))}
          <div className="flex justify-center mt-2">
            <button className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1 font-medium">
              Ver todos os agentes
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Agents;

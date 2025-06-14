"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ArrowRight } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  date: string;
  unread: boolean;
}

const RecentMessages = () => {
  // Mock data - in a real implementation, this would come from an API call to Supabase
  const messages: Message[] = [
    {
      id: "1",
      sender: "João Silva",
      subject: "Projeto Residencial Vista Mar",
      preview:
        "Precisamos discutir as alterações no cronograma de construção...",
      date: "Hoje, 14:30",
      unread: true,
    },
    {
      id: "2",
      sender: "Maria Oliveira",
      subject: "Orçamento Atualizado",
      preview: "Segue em anexo o orçamento revisado para o projeto...",
      date: "Ontem, 09:15",
      unread: false,
    },
    {
      id: "3",
      sender: "Carlos Mendes",
      subject: "Visita ao Local da Obra",
      preview: "Podemos agendar uma visita ao local da obra para...",
      date: "22/04, 16:45",
      unread: false,
    },
  ];

  return (
    <Card className="shadow-sm hover:shadow-md transition-all bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          Mensagens Recentes
        </CardTitle>
        <div className="p-2 bg-blue-100 rounded-full">
          <MessageSquare className="h-4 w-4 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg border ${message.unread ? "border-blue-200 bg-blue-50" : "border-gray-200"} hover:bg-gray-50 cursor-pointer transition-all`}
            >
              <div className="flex justify-between items-start">
                <span className="font-medium">{message.sender}</span>
                <span className="text-xs text-gray-500">{message.date}</span>
              </div>
              <div className="text-sm font-medium mt-1">{message.subject}</div>
              <div className="text-xs text-gray-600 mt-1 line-clamp-1">
                {message.preview}
              </div>
            </div>
          ))}
          <div className="flex justify-center mt-2">
            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium">
              Ver todas as mensagens
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentMessages;

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2 } from "lucide-react";

export default function ReferralSection() {
  return (
    <Card className="mx-4 mb-4 overflow-hidden border border-gray-200 rounded-lg">
      <CardContent className="p-4 flex flex-col items-center text-center">
        <div className="bg-blue-600 rounded-full p-2 mb-2">
          <Share2 className="h-5 w-5 text-white" />
        </div>
        <h3 className="font-medium text-base mb-1">Indique um Amigo</h3>
        <p className="text-sm text-gray-500 mb-3">
          Indique um amigo e ganhe descontos na sua assinatura
        </p>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          variant="default"
        >
          Indicar Agora
        </Button>
      </CardContent>
    </Card>
  );
}

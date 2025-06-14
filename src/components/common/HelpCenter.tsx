import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, HeadphonesIcon } from "lucide-react";

interface HelpCenterProps {
  isCollapsed?: boolean;
}

export default function HelpCenter({ isCollapsed = false }: HelpCenterProps) {
  if (isCollapsed) {
    return (
      <div className="flex justify-center mb-8">
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full"
          variant="default"
          size="icon"
          title="Contacte-nos"
        >
          <HeadphonesIcon className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden border border-gray-200 rounded-lg mb-12 mx-4">
      <CardContent className="p-4 flex flex-col items-center text-center">
        <div className="bg-gray-900 rounded-full p-2 mb-2">
          <HelpCircle className="h-5 w-5 text-white" />
        </div>
        <h3 className="font-medium text-base mb-1">Help Center</h3>
        <p className="text-sm text-gray-500 mb-3">
          Para qualquer dúvida ou problema, por favor, contacte-nos
        </p>
        <Button
          className="w-full bg-orange-500 hover:bg-primary text-white"
          variant="default"
        >
          Contacte-nos
        </Button>
      </CardContent>
    </Card>
  );
}

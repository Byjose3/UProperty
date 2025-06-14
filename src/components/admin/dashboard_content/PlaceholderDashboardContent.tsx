"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlaceholderDashboardContentProps {
  title: string;
}

export default function PlaceholderDashboardContent({
  title,
}: PlaceholderDashboardContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center py-8 text-gray-500">
          Conteúdo do {title.toLowerCase()} será implementado em breve.
        </p>
      </CardContent>
    </Card>
  );
}

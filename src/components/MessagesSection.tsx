"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: number;
  sender: {
    name: string;
    avatar: string;
    isOwner: boolean;
  };
  content: string;
  timestamp: string;
}

interface MessagesSectionProps {
  propertyId: number;
  initialMessages?: Message[];
}

const MessagesSection = ({
  propertyId,
  initialMessages = [],
}: MessagesSectionProps) => {
  const [messages] = useState<Message[]>(initialMessages);

  // Group messages by sender
  const messagesBySender = messages.reduce(
    (acc, message) => {
      const senderId = message.sender.name;
      if (!acc[senderId]) {
        acc[senderId] = [];
      }
      acc[senderId].push(message);
      return acc;
    },
    {} as Record<string, Message[]>,
  );

  return <></>;
};

export default MessagesSection;

"use client";

import { Message } from "@/types";
import { cn, formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ChatMessageProps {
  message: Message;
  isSequential: boolean;
}

export function ChatMessage({ message, isSequential }: ChatMessageProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Animate in messages
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const isUser = message.role === 'user';
  
  return (
    <div 
      className={cn(
        "flex",
        isUser ? "justify-end" : "justify-start",
        isVisible ? "opacity-100" : "opacity-0",
        "transition-opacity duration-300"
      )}
    >
      <div 
        className={cn(
          "max-w-[80%] rounded-lg p-3",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
          !isSequential && "mt-4"
        )}
      >
        <div className="text-sm">
          {message.content}
        </div>
        <div className="text-xs opacity-70 mt-1 text-right">
          {formatDate(message.timestamp)}
        </div>
      </div>
    </div>
  );
}
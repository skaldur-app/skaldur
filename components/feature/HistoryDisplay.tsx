"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types";
import { ChatMessage } from "./ChatMessage";

interface HistoryDisplayProps {
  messages: Message[];
}

export function HistoryDisplay({ messages }: HistoryDisplayProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <h2 className="text-2xl font-bold mb-2">Welcome to Prompt Improver</h2>
          <p className="text-muted-foreground mb-4">
            Enter a prompt below, select an improvement type and style, then watch 
            as the AI helps refine it for your target LLM.
          </p>
          <p className="text-sm text-muted-foreground">
            All sessions are saved locally in your browser.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          message={message}
          isSequential={
            index > 0 && messages[index - 1].role === message.role
          }
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
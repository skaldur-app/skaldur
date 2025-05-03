"use client";

import { useEffect, useRef } from "react";
import { useSessionStore } from "@/store/sessionStore";
import { HistoryDisplay } from "./HistoryDisplay";
import { PromptInputArea } from "./PromptInputArea";
import { ImprovePromptRequest, ImprovePromptResponse, NameSessionRequest, NameSessionResponse } from "@/types/api";
import { fetchWithErrorHandling } from "@/lib/utils";

export function MainChatArea() {
  const { 
    sessions, 
    activeSessionUUID,
    addMessageToActiveSession,
    updateSessionName,
    setError
  } = useSessionStore();
  
  const hasNamedSession = useRef<Record<string, boolean>>({});
  
  const activeSession = activeSessionUUID ? sessions[activeSessionUUID] : null;
  const messages = activeSession?.messages || [];
  
  const handleSubmitPrompt = async (
    userInput: string,
    improvementTypeId: string,
    improvementStyle: string
  ) => {
    if (!activeSessionUUID) return;
    
    try {
      // Add user message to session
      addMessageToActiveSession({
        role: 'user',
        content: userInput
      });
      
      // Mock API for now - in production would call the real API
      // const response = await fetchWithErrorHandling<ImprovePromptResponse>(
      //   '/api/improve',
      //   {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({
      //       sessionUUID: activeSessionUUID,
      //       userInput,
      //       improvementTypeId,
      //       improvementStyle
      //     } as ImprovePromptRequest)
      //   }
      // );
      
      // Mock response - simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let improvedPrompt = "";
      
      // Simple mock improvement logic
      if (improvementTypeId === "enhance-basic") {
        improvedPrompt = `${userInput} ${improvementStyle === "Concisely" ? "Keep your response brief and to the point." : 
          improvementStyle === "Explanatory" ? "Please provide a detailed explanation with examples." :
          improvementStyle === "Formally" ? "Use formal language and professional tone." :
          improvementStyle === "Like I'm 5" ? "Explain this in simple terms that a child could understand." :
          ""}`;
      } else if (improvementTypeId === "summarize") {
        improvedPrompt = `Summarize the following text: ${userInput} ${improvementStyle !== "No Style" ? `Style: ${improvementStyle}` : ""}`;
      } else if (improvementTypeId === "clarify") {
        improvedPrompt = `I need clear instructions for the following task: ${userInput} ${improvementStyle !== "No Style" ? `Make the instructions ${improvementStyle.toLowerCase()}.` : ""}`;
      } else if (improvementTypeId === "creative") {
        improvedPrompt = `Write creatively about: ${userInput} ${improvementStyle !== "No Style" ? `In a ${improvementStyle.toLowerCase()} style.` : ""}`;
      }
      
      // Add assistant message to session
      addMessageToActiveSession({
        role: 'assistant',
        content: improvedPrompt
      });
      
      // Auto-name session after first interaction (if not already named)
      const shouldNameSession = 
        !hasNamedSession.current[activeSessionUUID] && 
        activeSession?.name.startsWith('Session ');
      
      if (shouldNameSession) {
        hasNamedSession.current[activeSessionUUID] = true;
        
        // Mock session naming
        setTimeout(() => {
          if (!activeSessionUUID) return;
          
          let sessionName = "";
          if (userInput.length < 30) {
            sessionName = userInput;
          } else {
            sessionName = userInput.substring(0, 30) + "...";
          }
          
          updateSessionName(activeSessionUUID, sessionName);
        }, 500);
        
        // In production, would call actual API
        // const nameResponse = await fetchWithErrorHandling<NameSessionResponse>(
        //   '/api/name-session',
        //   {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //       sessionUUID: activeSessionUUID,
        //       initialPrompt: userInput,
        //       firstResponse: improvedPrompt
        //     } as NameSessionRequest)
        //   }
        // );
        // 
        // updateSessionName(activeSessionUUID, nameResponse.sessionName);
      }
      
      return improvedPrompt;
    } catch (error) {
      console.error('Error improving prompt:', error);
      setError({ 
        message: error instanceof Error 
          ? error.message 
          : "Failed to improve prompt. Please try again." 
      });
      return null;
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <HistoryDisplay messages={messages} />
      <PromptInputArea onSubmit={handleSubmitPrompt} isConfigured={messages.length > 0 || false} />
    </div>
  );
}
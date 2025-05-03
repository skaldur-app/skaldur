"use client";

import { useEffect, useRef } from "react";
import { useSessionStore } from "@/store/sessionStore";
import { HistoryDisplay } from "./HistoryDisplay";
import { PromptInputArea } from "./PromptInputArea";
import { LlmToolbar } from "./LlmToolbar";
import { fetchWithErrorHandling } from "@/lib/utils";
import { LlmSettings } from "@/types";
import { toast } from "sonner";

// Define the expected shape of the API response
interface GenerateApiResponse {
  completion?: string;
  error?: string;
}

export function MainChatArea() {
  const {
    sessions,
    activeSessionUUID,
    addMessageToActiveSession,
    updateSessionName,
    setError,
    setLoading,
    currentError
  } = useSessionStore();

  const hasNamedSession = useRef<Record<string, boolean>>({});

  const activeSession = activeSessionUUID ? sessions[activeSessionUUID] : null;
  const messages = activeSession?.messages || [];
  const interactionLlmSettings = activeSession?.lockedSettings.interactionLlm;

  useEffect(() => {
    if (currentError) {
      toast.error("Error", {
          description: currentError.message,
          onDismiss: () => setError(null),
          onAutoClose: () => setError(null),
      });
    }
  }, [currentError, setError]);

  const handleSubmitPrompt = async (
    userInput: string,
    improvementTypeId: string,
    improvementStyle: string
  ): Promise<string | null> => {
    if (!activeSessionUUID || !interactionLlmSettings) {
      setError({ message: "Cannot generate completion: No active session or interaction LLM settings found." });
      return null;
    }

    setLoading(true);

    try {
      addMessageToActiveSession({
        role: 'user',
        content: userInput
      });

      // --- Call Backend API for Generation ---
      console.log(`Calling /api/generate with settings:`, interactionLlmSettings);
      console.log(`User Prompt:`, userInput);
      // systemPromptOverride could be added here based on improvement logic if needed
      const systemPromptForApi = interactionLlmSettings.systemPrompt;

      const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              settings: interactionLlmSettings,
              prompt: userInput,
              systemPromptOverride: systemPromptForApi // Pass system prompt
          }),
      });

      const result: GenerateApiResponse = await response.json();

      if (!response.ok || result.error) {
          throw new Error(result.error || `API request failed with status ${response.status}`);
      }

      if (!result.completion) {
          throw new Error("API response did not contain a completion.");
      }

      // Add assistant message from API response
      addMessageToActiveSession({
        role: 'assistant',
        content: result.completion
      });

      // --- Auto-name session logic (Keep as is) ---
      const shouldNameSession =
        activeSession &&
        !hasNamedSession.current[activeSessionUUID] &&
        activeSession.name.startsWith('Session ');

      if (shouldNameSession) {
        hasNamedSession.current[activeSessionUUID] = true;
        setTimeout(() => {
          if (!activeSessionUUID) return;
          let sessionName = userInput.length < 30 ? userInput : userInput.substring(0, 30) + "...";
          updateSessionName(activeSessionUUID, sessionName);
        }, 500);
      }
      // --- End Auto-name ---

      return null; // Input area doesn't need updating

    } catch (error: any) {
      console.error('Error calling /api/generate:', error);
      setError({
        message: error instanceof Error
          ? error.message
          : "An unexpected error occurred during LLM generation."
      });
      return null;
    } finally {
        setLoading(false);
    }
  };

  const isInteractionLlmConfigured = !!activeSession?.messages.length && activeSession.messages.length > 0;

  return (
    <div className="flex flex-col h-full relative">
      <div className="absolute top-0 left-0 right-0 z-10 p-2 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <LlmToolbar />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pt-[140px]">
        <HistoryDisplay messages={messages} />
      </div>
      <PromptInputArea onSubmit={handleSubmitPrompt} isConfigured={isInteractionLlmConfigured} />
    </div>
  );
}
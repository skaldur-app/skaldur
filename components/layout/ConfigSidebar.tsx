"use client";

import { Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/store/sessionStore";
import { LlmConfiguration } from "@/components/feature/LlmConfiguration";
import { useEffect, useState } from "react";
import { LlmSettings } from "@/types";

export function ConfigSidebar() {
  const { 
    sessions, 
    activeSessionUUID, 
    isConfigSidebarOpen,
    toggleConfigSidebar,
    updateInteractionLlm,
    updateDestinationLlm,
    forkSession
  } = useSessionStore();

  const [interactionLlm, setInteractionLlm] = useState<LlmSettings | null>(null);
  const [destinationLlm, setDestinationLlm] = useState<LlmSettings | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  const activeSession = activeSessionUUID ? sessions[activeSessionUUID] : null;
  
  // Initialize from session settings
  useEffect(() => {
    if (!activeSession) return;
    
    const hasMessages = activeSession.messages.length > 0;
    
    setInteractionLlm(activeSession.lockedSettings.interactionLlm);
    setDestinationLlm(activeSession.lockedSettings.destinationLlm);
    setIsConfigured(hasMessages);
  }, [activeSession]);

  const handleForkSession = () => {
    if (!activeSessionUUID) return;
    forkSession(activeSessionUUID);
  };

  const handleSaveConfig = () => {
    if (!activeSessionUUID || !interactionLlm || !destinationLlm) return;
    
    updateInteractionLlm(activeSessionUUID, interactionLlm);
    updateDestinationLlm(activeSessionUUID, destinationLlm);
    setIsConfigured(true);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Configuration</h2>
      </div>
      
      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        {!activeSession ? (
          <div className="text-muted-foreground">
            No active session.
          </div>
        ) : isConfigured ? (
          <>
            <div>
              <h3 className="font-medium mb-2">Interaction LLM (Locked)</h3>
              <div className="bg-muted p-3 rounded text-sm">
                <div><span className="font-medium">Provider:</span> {interactionLlm?.provider}</div>
                <div><span className="font-medium">Model:</span> {interactionLlm?.model}</div>
                <div><span className="font-medium">Temperature:</span> {interactionLlm?.temperature}</div>
                <div><span className="font-medium">Max Tokens:</span> {interactionLlm?.maxTokens}</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Destination LLM (Locked)</h3>
              <div className="bg-muted p-3 rounded text-sm">
                <div><span className="font-medium">Provider:</span> {destinationLlm?.provider}</div>
                <div><span className="font-medium">Model:</span> {destinationLlm?.model}</div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button onClick={handleForkSession} className="w-full">
                Fork Session
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Create a new session with the same history but different LLM settings.
              </p>
            </div>
          </>
        ) : (
          <>
            <div>
              <h3 className="font-medium mb-2">Interaction LLM</h3>
              <p className="text-sm text-muted-foreground mb-3">
                This LLM will process your prompts during this session.
              </p>
              {interactionLlm && (
                <LlmConfiguration
                  settings={interactionLlm}
                  onChange={setInteractionLlm}
                  showAdvanced={true}
                />
              )}
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Destination LLM</h3>
              <p className="text-sm text-muted-foreground mb-3">
                This is the LLM your improved prompts will target.
              </p>
              {destinationLlm && (
                <LlmConfiguration
                  settings={destinationLlm}
                  onChange={setDestinationLlm}
                  showAdvanced={false}
                />
              )}
            </div>
            
            <Button 
              onClick={handleSaveConfig} 
              className="w-full mt-6"
              disabled={!interactionLlm || !destinationLlm}
            >
              Save Configuration
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Settings will be locked for this session after saving.
            </p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile trigger */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-10 w-10 md:hidden"
        onClick={toggleConfigSidebar}
      >
        <Settings className="h-5 w-5" />
        <span className="sr-only">Toggle config sidebar</span>
      </Button>

      {/* Mobile sidebar */}
      <Sheet open={isConfigSidebarOpen} onOpenChange={toggleConfigSidebar}>
        <SheetContent side="right" className="w-80 p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:block w-72 border-l border-border h-screen">
        {sidebarContent}
      </div>
    </>
  );
}
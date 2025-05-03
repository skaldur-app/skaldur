"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImprovementSelectors } from "./ImprovementSelectors";
import { Send } from "lucide-react";

interface PromptInputAreaProps {
  onSubmit: (prompt: string, type: string, style: string) => Promise<string | null>;
  isConfigured: boolean;
}

export function PromptInputArea({ onSubmit, isConfigured }: PromptInputAreaProps) {
  const [prompt, setPrompt] = useState("");
  const [improvementTypeId, setImprovementTypeId] = useState("enhance-basic");
  const [improvementStyle, setImprovementStyle] = useState("No Style");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim() || isSubmitting || !isConfigured) return;
    
    try {
      setIsSubmitting(true);
      const improvedPrompt = await onSubmit(prompt, improvementTypeId, improvementStyle);
      
      if (improvedPrompt) {
        setPrompt(improvedPrompt);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 border-t border-border">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          ref={textareaRef}
          placeholder={isConfigured 
            ? "Enter your prompt here..." 
            : "Configure LLM settings before starting..."
          }
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[80px] max-h-[200px] resize-none text-base"
          disabled={!isConfigured || isSubmitting}
        />
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex-grow">
            <ImprovementSelectors
              selectedTypeId={improvementTypeId}
              selectedStyle={improvementStyle}
              onTypeChange={setImprovementTypeId}
              onStyleChange={setImprovementStyle}
              disabled={!isConfigured || isSubmitting}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={!prompt.trim() || isSubmitting || !isConfigured}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Improving..." : "Improve"}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
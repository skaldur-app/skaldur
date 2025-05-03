"use client";

import { useEffect, useState } from "react";
import { ImprovementOptions } from "@/types";
import { fetchWithErrorHandling } from "@/lib/utils";
import { useSessionStore } from "@/store/sessionStore";

export function useImprovementOptions() {
  const [loading, setLoading] = useState(false);
  const { improvementOptions, setImprovementOptions, setError } = useSessionStore();

  useEffect(() => {
    async function fetchOptions() {
      if (improvementOptions) return;
      
      try {
        setLoading(true);
        // For now, we'll use mock data instead of actual API call
        // const data = await fetchWithErrorHandling<ImprovementOptions>('/api/config/improvement-options');
        
        // Mock data
        const mockData: ImprovementOptions = {
          types: [
            { 
              id: "enhance-basic", 
              name: "Enhance Prompt", 
              icon: "✨", 
              description: "General prompt enhancement for improved clarity and effectiveness." 
            },
            { 
              id: "summarize", 
              name: "Summarize Text", 
              icon: "📄", 
              description: "Create a prompt that efficiently summarizes content." 
            },
            { 
              id: "clarify", 
              name: "Clarify Instructions", 
              icon: "🔍", 
              description: "Make instructions clearer and more precise." 
            },
            { 
              id: "creative", 
              name: "Creative Writing", 
              icon: "🎨", 
              description: "Enhance prompts for storytelling and creative content." 
            }
          ],
          styles: ["No Style", "Concisely", "Explanatory", "Formally", "Like I'm 5"]
        };
        
        setImprovementOptions(mockData);
      } catch (error) {
        setError({ message: error instanceof Error ? error.message : "Failed to fetch improvement options" });
      } finally {
        setLoading(false);
      }
    }
    
    fetchOptions();
  }, [improvementOptions, setImprovementOptions, setError]);

  return { 
    options: improvementOptions, 
    loading 
  };
}
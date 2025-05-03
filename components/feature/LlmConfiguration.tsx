"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { LlmSettings } from "@/types";
import { llmProviders } from "@/lib/llmProviders";
import { useEffect, useState } from "react";

interface LlmConfigurationProps {
  settings: LlmSettings;
  onChange: (settings: LlmSettings) => void;
  showAdvanced: boolean;
}

export function LlmConfiguration({
  settings,
  onChange,
  showAdvanced
}: LlmConfigurationProps) {
  const [availableModels, setAvailableModels] = useState<{id: string, name: string}[]>([]);
  
  // Update models when provider changes
  useEffect(() => {
    const provider = llmProviders.find(p => p.id === settings.provider || p.name === settings.provider);
    if (provider) {
      setAvailableModels(provider.models.map(m => ({ id: m.id, name: m.name })));
      
      // If current model is not available for new provider, select first model
      const modelExists = provider.models.some(m => m.id === settings.model);
      if (!modelExists && provider.models.length > 0) {
        onChange({
          ...settings,
          model: provider.models[0].id
        });
      }
    }
  }, [settings.provider, onChange, settings]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="provider">Provider</Label>
        <Select
          value={settings.provider}
          onValueChange={(value) => onChange({ ...settings, provider: value })}
        >
          <SelectTrigger id="provider">
            <SelectValue placeholder="Select Provider" />
          </SelectTrigger>
          <SelectContent>
            {llmProviders.map(provider => (
              <SelectItem key={provider.id} value={provider.id}>
                {provider.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Select
          value={settings.model}
          onValueChange={(value) => onChange({ ...settings, model: value })}
        >
          <SelectTrigger id="model">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            {availableModels.map(model => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showAdvanced && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="advanced-settings">
            <AccordionTrigger>Advanced Settings</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="temperature">Temperature: {settings.temperature?.toFixed(1)}</Label>
                  </div>
                  <Slider
                    id="temperature"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[settings.temperature || 0.7]}
                    onValueChange={(values) => onChange({ ...settings, temperature: values[0] })}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Precise</span>
                    <span>Creative</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="maxTokens">Max Tokens: {settings.maxTokens}</Label>
                  </div>
                  <Slider
                    id="maxTokens"
                    min={256}
                    max={4096}
                    step={256}
                    value={[settings.maxTokens || 1024]}
                    onValueChange={(values) => onChange({ ...settings, maxTokens: values[0] })}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Short</span>
                    <span>Long</span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
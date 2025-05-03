"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/store/sessionStore";
import { LlmSettings } from "@/types";
import { llmProviderDetails, getProviderById, LlmModelDetails, LlmProviderId, isLlmProviderId } from "@/lib/model_details";
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { ErrorModal } from "@/components/ui/ErrorModal";
import { Input } from "@/components/ui/input";
import { ValidationResult } from "@/lib/llm_providers/types";

// Define providers allowed in the toolbar
const ALLOWED_TOOLBAR_PROVIDERS: LlmProviderId[] = ['openai', 'anthropic', 'google'];

export function LlmToolbar() {
  const {
    sessions,
    activeSessionUUID,
    updateDestinationLlm,
    markDestinationProviderValidated
  } = useSessionStore();

  const [destinationLlm, setDestinationLlm] = useState<LlmSettings | null>(null);
  const [availableModels, setAvailableModels] = useState<LlmModelDetails[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isToolbarExpanded, setIsToolbarExpanded] = useState(true);
  const [azureDeploymentName, setAzureDeploymentName] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<{ title: string; description: string } | null>(null);
  const [azureEndpoint, setAzureEndpoint] = useState<string>("");
  const [awsRegion, setAwsRegion] = useState<string>("");

  const activeSession = activeSessionUUID ? sessions[activeSessionUUID] : null;
  const isConfigured = activeSession?.messages.length ? activeSession.messages.length > 0 : false;
  const validatedProviders = activeSession?.validatedDestinationProviders || [];

  // Filtered provider list for the toolbar
  const toolbarProviderDetails = llmProviderDetails.filter(p => ALLOWED_TOOLBAR_PROVIDERS.includes(p.id));

  // Initialize from session settings
  useEffect(() => {
    if (!activeSession) return;
     let initialSettings = activeSession.lockedSettings.destinationLlm;
     // If the stored provider isn't allowed in the toolbar, reset to default
    if (!ALLOWED_TOOLBAR_PROVIDERS.includes(initialSettings.provider as LlmProviderId)) {
        console.warn(`Toolbar: Provider ${initialSettings.provider} not allowed, resetting to default.`);
        const defaultProvider = toolbarProviderDetails[0] || llmProviderDetails[0]; // Fallback just in case
        const defaultModel = defaultProvider?.models[0];
        initialSettings = {
            provider: defaultProvider?.id || 'google', // Absolute fallback
            model: defaultModel?.id || 'gemini-1.5-flash-latest', // Absolute fallback
            temperature: defaultModel?.defaultTemperature,
            maxTokens: defaultModel?.defaultMaxOutputTokens,
        };
        // Persist this reset? For now, just set local state.
        // updateDestinationLlm(activeSessionUUID, initialSettings); // Careful: might trigger loops
    }
    setDestinationLlm(initialSettings);
  }, [activeSession]); // Removed updateDestinationLlm dependency

  // Update models when provider changes (ensure provider is allowed)
  useEffect(() => {
    const providerIdString = destinationLlm?.provider;
    if (!providerIdString || !isLlmProviderId(providerIdString) || !ALLOWED_TOOLBAR_PROVIDERS.includes(providerIdString)) {
        setAvailableModels([]);
         // If the current provider becomes invalid (shouldn't happen with filtering), reset model
        if (destinationLlm && destinationLlm.model !== '') {
             setDestinationLlm(current => current ? {...current, model: ''} : null);
        }
        return;
    }

    const provider = getProviderById(providerIdString);
    if (provider) {
      setAvailableModels(provider.models);
      // Functional update logic remains largely the same
      setDestinationLlm(currentLlm => {
         if (!currentLlm || currentLlm.provider !== providerIdString) { return currentLlm; }
         const modelExists = provider.models.some(m => m.id === currentLlm.model);
         if (!modelExists && provider.models.length > 0) {
            return { ...currentLlm, model: provider.models[0].id };
         }
         return currentLlm;
      });
    } else {
      setAvailableModels([]);
       setDestinationLlm(currentLlm => currentLlm ? { ...currentLlm, model: '' } : null);
    }
  }, [destinationLlm?.provider]);

  // Update Azure deployment name state when destinationLlm changes (if Azure)
  useEffect(() => {
    if (destinationLlm?.provider === 'azure') {
      // Assuming the model ID stored IS the deployment name for Azure
      setAzureDeploymentName(destinationLlm.model);
    } else {
        setAzureDeploymentName(""); // Clear if not Azure
    }
  }, [destinationLlm]);

  // Initialize endpoint/region states if they are configured/displayed here
  useEffect(() => {
    // If endpoint/region are only configured in Sidebar, this might not be needed
    // If they ARE configurable here, add inputs and initialize:
    setAzureEndpoint(process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT || "");
    setAwsRegion(process.env.NEXT_PUBLIC_AWS_REGION || process.env.AWS_REGION || "");
  }, []);

  const handleSaveConfig = async () => {
    if (!activeSessionUUID || !destinationLlm || isSaving) return;
    setIsSaving(true);
    setValidationError(null);

    const providerId = destinationLlm.provider as LlmProviderId;

    // --- Construct Body for Validation API ---
    const validationBody: any = { providerId };
    try {
        // Include necessary non-sensitive fields based on provider
        // Assuming BaseURL is not configured in this simpler toolbar
         if (providerId === 'azure') {
             // If endpoint is not configured here, this check needs rethinking
             // For now, assume endpoint might come from env, but deployment is required
            if (!azureDeploymentName) {
                setValidationError({ title: "Validation Error", description: "Azure Deployment Name is required." });
                setIsSaving(false);
                return;
            }
            // Include endpoint if it *is* configurable here, otherwise API needs to get it from server env
            // validationBody.endpoint = azureEndpoint;
             validationBody.deploymentName = azureDeploymentName;
             // Update the stored model ID to be the deployment name before saving locally
             destinationLlm.model = azureDeploymentName;
         }
         if (providerId === 'anthropic-bedrock') {
             // If region is not configured here, this check needs rethinking
             // For now, assume region might come from env
             // if (!awsRegion) { ... }
             // Include region if it *is* configurable here, otherwise API needs to get it from server env
            // validationBody.awsRegion = awsRegion;
             // Note: If region/endpoint ARE NOT sent, the API *must* retrieve them server-side
         }

        // --- Call Validation API ---
        console.log("Calling /api/validate-config from Toolbar with body:", validationBody);
        const response = await fetch('/api/validate-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validationBody),
        });

        const result: ValidationResult = await response.json();

        if (!response.ok || !result.success) {
            setValidationError({
            title: "LLM Provider Validation Failed",
            description: result.error || `API request failed with status ${response.status}`
            });
            setIsSaving(false);
            return; // Prevent saving
        }

      // --- Validation Successful: Save configuration ---
      updateDestinationLlm(activeSessionUUID, destinationLlm);
      markDestinationProviderValidated(activeSessionUUID, providerId);
      setIsEditing(false);

    } catch (error: any) {
        console.error("Error calling /api/validate-config from Toolbar:", error);
        setValidationError({
            title: "Error Validating Configuration",
            description: error.message || "An unexpected error occurred contacting the validation API."
        });
    } finally {
        setIsSaving(false);
    }
  };

  if (!destinationLlm) return null;

  // Function to handle provider change
  const handleProviderChange = (value: string) => {
    if (!destinationLlm) return;
    setDestinationLlm({ ...destinationLlm, provider: value });
  };

  // Function to handle model change
  const handleModelChange = (value: string) => {
    if (!destinationLlm) return;
    setDestinationLlm({ ...destinationLlm, model: value });
  };

  const readOnlyDisplay = (
    <div className="flex items-center gap-4 w-full">
      <div className="w-48">
        <Label className="text-xs text-muted-foreground">Provider</Label>
        <div className="flex items-center gap-1">
          <div className="font-medium truncate">
            {isLlmProviderId(destinationLlm.provider)
              ? getProviderById(destinationLlm.provider)?.name || destinationLlm.provider
              : destinationLlm.provider}
          </div>
          {(() => {
            console.log('[Toolbar] validatedProviders:', validatedProviders, 'checking:', destinationLlm.provider);
            return validatedProviders.includes(destinationLlm.provider as LlmProviderId);
          })() && (
            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
          )}
        </div>
      </div>
      <div className="w-48">
        <Label className="text-xs text-muted-foreground">Model</Label>
        <div className="font-medium truncate">
          {availableModels.find(m => m.id === destinationLlm.model)?.name || destinationLlm.model}
        </div>
      </div>
      {isConfigured ? (
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 ml-auto"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </Button>
      ) : null}
    </div>
  );

  const editableDisplay = (
    <div className="flex items-center gap-4 w-full pb-2 px-2">
      <div className="w-48">
        <Label htmlFor="dest_provider" className="text-xs">Provider</Label>
        <Select
          value={destinationLlm.provider}
          onValueChange={(value) => {
                const providerId = value as LlmProviderId;
                 // Get default model from the *filtered* provider list
                const defaultModelId = toolbarProviderDetails.find(p => p.id === providerId)?.models[0]?.id || '';
                setDestinationLlm({
                    ...(destinationLlm! || {}),
                    provider: providerId,
                    model: defaultModelId
                });
                 // Reset Azure-specific state if it was set
                 if (azureDeploymentName) setAzureDeploymentName('');
          }}
          disabled={isSaving}
        >
          <SelectTrigger id="dest_provider" className="h-8">
            <SelectValue placeholder="Select Provider" />
          </SelectTrigger>
          <SelectContent>
             {/* Map over the filtered list */}
            {toolbarProviderDetails.map(provider => (
              <SelectItem key={provider.id} value={provider.id}>
                {provider.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Model Select (No Azure/Bedrock specific inputs needed here now) */}
        <div className="w-48">
            <Label htmlFor="dest_model" className="text-xs">Model</Label>
            <Select
            value={destinationLlm.model}
            onValueChange={(value) => setDestinationLlm({ ...destinationLlm, model: value })}
            disabled={availableModels.length === 0 || isSaving}
            >
            <SelectTrigger id="dest_model" className="h-8">
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

      <Button
        size="sm"
        className="h-8 mt-4 px-2 ml-auto"
        onClick={handleSaveConfig}
        disabled={isSaving || !destinationLlm.model } // Simplified check
      >
        {isSaving ? "Validating..." : "Save"}
      </Button>
    </div>
  );

  return (
    <Card className={`p-4 shadow-md w-auto max-w-xl bg-background overflow-hidden transition-all duration-300 ease-in-out`}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium">Destination LLM Settings</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsToolbarExpanded(!isToolbarExpanded)}
          aria-label={isToolbarExpanded ? "Collapse Toolbar" : "Expand Toolbar"}
        >
          {isToolbarExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isToolbarExpanded ? 'max-h-96 opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'}`}
      >
        <div className="mt-2">
          {isEditing || !isConfigured ? editableDisplay : readOnlyDisplay}
        </div>
      </div>
      <ErrorModal
         isOpen={!!validationError}
         onClose={() => setValidationError(null)}
         title={validationError?.title || "Error"}
         description={validationError?.description || "An unknown error occurred."}
       />
    </Card>
  );
}
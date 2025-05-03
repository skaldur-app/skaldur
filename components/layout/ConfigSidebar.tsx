"use client";

import { Settings, CheckCircle2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/store/sessionStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useEffect, useState, useRef } from "react";
import { LlmSettings } from "@/types";
import { llmProviderDetails, getProviderById, getModelById, LlmModelDetails, LlmProviderId, isLlmProviderId } from "@/lib/model_details";
import { ErrorModal } from "@/components/ui/ErrorModal";
import { Input } from "@/components/ui/input";
import { ValidationResult } from "@/lib/llm_providers/types";
import { AZURE_API_VERSION as DEFAULT_AZURE_API_VERSION } from "@/lib/llm_providers/azure_openai";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

export function ConfigSidebar() {
  const {
    sessions,
    activeSessionUUID,
    isConfigSidebarOpen,
    toggleConfigSidebar,
    updateInteractionLlm,
    forkSession,
    markInteractionProviderValidated
  } = useSessionStore();

  const [interactionLlm, setInteractionLlm] = useState<LlmSettings | null>(null);
  const [availableModels, setAvailableModels] = useState<LlmModelDetails[]>([]);
  const [isConfigured, setIsConfigured] = useState(false);
  const [modelDetails, setModelDetails] = useState<LlmModelDetails | null>(null);
  const [azureDeploymentName, setAzureDeploymentName] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<{ title: string; description: string } | null>(null);
  const [azureEndpoint, setAzureEndpoint] = useState<string>("");
  const [awsRegion, setAwsRegion] = useState<string>("");
  const triggerRef = useRef<HTMLButtonElement>(null);

  const activeSession = activeSessionUUID ? sessions[activeSessionUUID] : null;
  const validatedProviders = activeSession?.validatedInteractionProviders || [];

  // Initialize from session settings
  useEffect(() => {
    if (!activeSession) return;
    const hasMessages = activeSession.messages.length > 0;
    setInteractionLlm(activeSession.lockedSettings.interactionLlm);
    setIsConfigured(hasMessages);
  }, [activeSession]);

  // Update models and details when provider/model changes
  useEffect(() => {
    // Read provider/model from state, but use functional updates for setters
    const providerId = interactionLlm?.provider;
    const modelId = interactionLlm?.model;

    if (!providerId || !modelId) return;

    if (isLlmProviderId(providerId)) {
      const provider = getProviderById(providerId);
      if (provider) {
        setAvailableModels(provider.models);
        const currentModelDetails = getModelById(modelId);
        setModelDetails(currentModelDetails || null);

        const modelExists = provider.models.some(m => m.id === modelId);

        // Use functional update for interactionLlm state changes
        setInteractionLlm(currentLlm => {
            if (!currentLlm || currentLlm.provider !== providerId || currentLlm.model !== modelId) {
                // State changed during effect execution, bail out
                return currentLlm;
            }

            let updateNeeded = false;
            let newSettings = { ...currentLlm };

            // If selected model doesn't exist for the provider, reset to default
            if (!modelExists && provider.models.length > 0) {
                newSettings = {
                    ...currentLlm,
                    model: provider.models[0].id,
                    temperature: provider.models[0].defaultTemperature,
                    maxTokens: provider.models[0].defaultMaxOutputTokens,
                };
                updateNeeded = true;
            }
            // Ensure temperature is undefined if not supported by current model
            else if (currentModelDetails && !currentModelDetails.supportsTemperature && currentLlm.temperature !== undefined) {
                newSettings = { ...currentLlm, temperature: undefined };
                updateNeeded = true;
            }
            // Optional: Adjust maxTokens if current value exceeds model max (or keep it?)
            // else if (currentModelDetails && currentLlm.maxTokens !== undefined && currentModelDetails.maxOutputTokens < (currentLlm.maxTokens || 0)) {
            //     newSettings = { ...currentLlm, maxTokens: currentModelDetails.maxOutputTokens }; // Example: Cap at max
            //     updateNeeded = true;
            // }

            return updateNeeded ? newSettings : currentLlm; // Only return new object if changed
        });
      }
    } else {
       // Handle invalid provider ID
       setAvailableModels([]);
       setModelDetails(null);
       console.warn(`Invalid provider ID found in interactionLlm state: ${providerId}`);
    }
     // Dependencies are the provider and model strings
  }, [interactionLlm?.provider, interactionLlm?.model]);

  // Update Azure deployment name state when interactionLlm changes (if Azure)
  useEffect(() => {
     // This effect ONLY depends on interactionLlm
    if (interactionLlm?.provider === 'azure') {
      setAzureDeploymentName(interactionLlm.model);
    } else {
        setAzureDeploymentName("");
    }
     // Keep interactionLlm as dependency, it's read directly
  }, [interactionLlm]);

  // Initialize endpoint/region/baseUrl states if they were previously stored/configured
  useEffect(() => {
    if (interactionLlm) {
        setAzureEndpoint(interactionLlm.provider === 'azure' ? (interactionLlm.baseUrl || process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT || "") : "");
        setAwsRegion(interactionLlm.provider === 'anthropic-bedrock' ? (interactionLlm.baseUrl || process.env.NEXT_PUBLIC_AWS_REGION || process.env.AWS_REGION || "") : "");
        // Note: Storing endpoint/region in baseUrl is a temporary workaround. Ideally, LlmSettings would have dedicated fields.
        // For now, we store them in baseUrl in the settings object for persistence.
        // A better approach would be to extend LlmSettings properly.

        // Initialize azureDeploymentName if provider is azure
        if (interactionLlm.provider === 'azure') {
            setAzureDeploymentName(interactionLlm.model);
        } else {
             setAzureDeploymentName("");
        }
    }
  }, [interactionLlm]);

  const handleForkSession = () => {
    if (!activeSessionUUID) return;
    forkSession(activeSessionUUID);
  };

  // Helper function to update LlmSettings state
  const updateSetting = (key: keyof LlmSettings, value: any) => {
     setInteractionLlm(current => current ? { ...current, [key]: value } : null);
  };

  const handleSaveConfig = async () => {
    if (!activeSessionUUID || !interactionLlm || isSaving) return;
    setIsSaving(true);
    setValidationError(null);

    const providerId = interactionLlm.provider as LlmProviderId;

    // --- Construct Body for Validation API ---
    const validationBody: any = { providerId };
    try {
      if (providerId === 'openai' || providerId === 'anthropic') {
         validationBody.baseUrl = interactionLlm.baseUrl; // Get from state
      }
      if (providerId === 'azure') {
         if (!azureEndpoint || !azureDeploymentName) {
            setValidationError({ title: "Configuration Error", description: "Azure Endpoint and Deployment Name are required." });
            setIsSaving(false);
            return;
         }
         validationBody.endpoint = azureEndpoint;
         validationBody.deploymentName = azureDeploymentName;
         validationBody.apiVersion = interactionLlm.azureApiVersion; // Get from state
         // Update the stored settings object before saving
         interactionLlm.model = azureDeploymentName; // Model IS deployment name
         interactionLlm.baseUrl = azureEndpoint; // Store endpoint in baseUrl field for now
      }
      if (providerId === 'anthropic-bedrock') {
          if (!awsRegion) {
             setValidationError({ title: "Configuration Error", description: "AWS Region is required for Bedrock." });
             setIsSaving(false);
             return;
          }
         validationBody.awsRegion = awsRegion;
         // Store region in baseUrl field for now
         interactionLlm.baseUrl = awsRegion;
      }

      // --- Call Validation API ---
      console.log("Calling /api/validate-config with body:", validationBody);
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
        return; // Prevent saving if validation fails
      }

      // --- Validation Successful: Save configuration ---
      updateInteractionLlm(activeSessionUUID, interactionLlm);
      markInteractionProviderValidated(activeSessionUUID, providerId);
      setIsConfigured(true); // Lock config after successful save

    } catch (error: any) {
      console.error("Error calling /api/validate-config:", error);
      setValidationError({
          title: "Error Validating Configuration",
          description: error.message || "An unexpected error occurred contacting the validation API."
      });
    } finally {
        setIsSaving(false);
    }
  };

  // Modified toggle function to handle focus return
  const handleOpenChange = (open: boolean) => {
    toggleConfigSidebar(); // Call the store action
    if (!open && triggerRef.current) {
      // Delay focus slightly to ensure sheet animation completes
      setTimeout(() => triggerRef.current?.focus(), 50);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Configuration</h2>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        {!activeSession || !interactionLlm ? (
          <div className="text-muted-foreground">
            No active session.
          </div>
        ) : isConfigured ? (
          // Read-only view
          <>
            <div>
              <h3 className="font-medium mb-2">Interaction LLM (Locked)</h3>
              <div className="bg-muted p-3 rounded text-sm space-y-1">
                <div className="flex items-center gap-1">
                  <span className="font-medium">Provider:</span>
                  {isLlmProviderId(interactionLlm.provider)
                      ? getProviderById(interactionLlm.provider)?.name || interactionLlm.provider
                      : interactionLlm.provider}
                  {(() => {
                    console.log('[Sidebar] validatedProviders:', validatedProviders, 'checking:', interactionLlm.provider);
                    return validatedProviders.includes(interactionLlm.provider as LlmProviderId);
                  })() && (
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  )}
                </div>
                <div><span className="font-medium">Model:</span> {getModelById(interactionLlm.model)?.name || interactionLlm.model}</div>
                {modelDetails?.supportsTemperature && <div><span className="font-medium">Temperature:</span> {interactionLlm.temperature?.toFixed(1)}</div>}
                <div><span className="font-medium">Max Tokens:</span> {interactionLlm.maxTokens}</div>
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
          // Editable view
          <>
            <div>
              <h3 className="font-medium mb-2">Interaction LLM</h3>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="interaction_provider">Provider</Label>
                    <Select
                      value={interactionLlm.provider}
                      onValueChange={(value) => {
                        const providerId = value as LlmProviderId;
                        const defaultModelId = getProviderById(providerId)?.models[0]?.id || '';
                        setInteractionLlm({
                          ...(interactionLlm! || {}),
                          provider: providerId,
                          model: defaultModelId
                        });
                      }}
                    >
                      <SelectTrigger id="interaction_provider">
                        <SelectValue placeholder="Select Provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {llmProviderDetails.map(provider => (
                          <SelectItem key={provider.id} value={provider.id}>
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Base URL (OpenAI, Anthropic) */}
                  {(interactionLlm.provider === 'openai' || interactionLlm.provider === 'anthropic') && (
                     <div className="space-y-2">
                        <Label htmlFor="interaction_baseUrl">Base URL (Optional)</Label>
                        <Input
                            id="interaction_baseUrl"
                            placeholder={interactionLlm.provider === 'openai' ? "e.g., https://your-openai-proxy/v1" : "e.g., https://your-anthropic-proxy"}
                            value={interactionLlm.baseUrl || ''}
                            onChange={(e) => updateSetting('baseUrl', e.target.value || undefined)}
                            disabled={isSaving}
                        />
                         <p className="text-xs text-muted-foreground">Use for proxies or alternative endpoints.</p>
                     </div>
                  )}

                  {/* Azure Inputs */}
                  {interactionLlm.provider === 'azure' && (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="interaction_azureEndpoint">Azure Endpoint <span className="text-red-500">*</span></Label>
                            <Input
                                id="interaction_azureEndpoint"
                                placeholder="https://YOUR_RESOURCE.openai.azure.com/"
                                value={azureEndpoint}
                                onChange={(e) => setAzureEndpoint(e.target.value)}
                                disabled={isSaving}
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="interaction_azureDeployment">Azure Deployment Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="interaction_azureDeployment"
                                placeholder="Enter your deployment name"
                                value={azureDeploymentName}
                                onChange={(e) => setAzureDeploymentName(e.target.value)}
                                disabled={isSaving}
                            />
                            <p className="text-xs text-muted-foreground">The specific name you gave your model deployment in Azure OpenAI Studio.</p>
                         </div>
                         <div className="space-y-2">
                            <Label htmlFor="interaction_azureApiVersion">API Version (Optional)</Label>
                            <Input
                                id="interaction_azureApiVersion"
                                placeholder={`e.g., ${DEFAULT_AZURE_API_VERSION}`}
                                value={interactionLlm.azureApiVersion || ''}
                                onChange={(e) => updateSetting('azureApiVersion', e.target.value || undefined)}
                                disabled={isSaving}
                            />
                             <p className="text-xs text-muted-foreground">Defaults to a recent stable version if left blank.</p>
                         </div>
                     </>
                  )}

                   {/* Bedrock Input */}
                  {interactionLlm.provider === 'anthropic-bedrock' && (
                     <div className="space-y-2">
                        <Label htmlFor="interaction_awsRegion">AWS Region <span className="text-red-500">*</span></Label>
                        <Input
                            id="interaction_awsRegion"
                            placeholder="e.g., us-east-1"
                            value={awsRegion}
                            onChange={(e) => setAwsRegion(e.target.value)}
                            disabled={isSaving}
                        />
                         <p className="text-xs text-muted-foreground">The AWS region where your Bedrock models are available.</p>
                     </div>
                  )}

                  {/* Model Select (Hide for Azure) */}
                  {interactionLlm.provider !== 'azure' && (
                      <div className="space-y-2">
                        <Label htmlFor="interaction_model">Model</Label>
                        <Select
                          value={interactionLlm.model}
                          onValueChange={(value) => {
                              const newModel = getModelById(value);
                              setInteractionLlm({
                                  ...interactionLlm,
                                  model: value,
                                  temperature: newModel?.defaultTemperature,
                                  maxTokens: newModel?.defaultMaxOutputTokens,
                              });
                          }}
                          disabled={availableModels.length === 0 || isSaving}
                        >
                          <SelectTrigger id="interaction_model">
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
                  )}

                  {modelDetails?.supportsTemperature && (
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label htmlFor="interaction_temperature">Temperature: {interactionLlm.temperature?.toFixed(1)}</Label>
                        </div>
                        <Slider
                            id="interaction_temperature"
                            min={0}
                            max={1}
                            step={0.1}
                            value={[interactionLlm.temperature ?? modelDetails.defaultTemperature ?? 0.7]}
                            onValueChange={(values) => setInteractionLlm({ ...interactionLlm, temperature: values[0] })}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Precise</span>
                            <span>Creative</span>
                        </div>
                    </div>
                  )}

                 <div className="space-y-2">
                      <div className="flex justify-between">
                          <Label htmlFor="interaction_maxTokens">Max Tokens: {interactionLlm.maxTokens}</Label>
                      </div>
                      <Slider
                          id="interaction_maxTokens"
                          min={256} // Consider making this dynamic based on model if needed
                          max={modelDetails?.maxOutputTokens || 4096} // Use model max
                          step={256}
                          value={[interactionLlm.maxTokens ?? modelDetails?.defaultMaxOutputTokens ?? 1024]}
                          onValueChange={(values) => setInteractionLlm({ ...interactionLlm, maxTokens: values[0] })}
                      />
                       <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Short</span>
                            <span>Long (Max: {modelDetails?.maxOutputTokens || 'N/A'})</span>
                      </div>
                  </div>
              </div>
            </div>

            <Button
              onClick={handleSaveConfig}
              className="w-full mt-6"
              disabled={!interactionLlm || isSaving ||
                  (interactionLlm.provider === 'azure' && (!azureDeploymentName || !azureEndpoint)) ||
                  (interactionLlm.provider === 'anthropic-bedrock' && !awsRegion)
              }
            >
              {isSaving ? "Validating & Saving..." : "Save Configuration"}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Settings will be locked for this session after saving.
            </p>
          </>
        )}
      </div>
      <ErrorModal
         isOpen={!!validationError}
         onClose={() => setValidationError(null)}
         title={validationError?.title || "Error"}
         description={validationError?.description || "An unknown error occurred."}
        />
    </div>
  );

  return (
    <>
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        className="h-10 w-10"
        onClick={toggleConfigSidebar}
      >
        <Settings className="h-5 w-5" />
        <span className="sr-only">Toggle config sidebar</span>
      </Button>

      <Sheet open={isConfigSidebarOpen} onOpenChange={handleOpenChange}>
        <SheetContent side="right" className="w-80 p-0">
          <VisuallyHidden.Root>
            <SheetTitle>Configuration Settings</SheetTitle>
            <SheetDescription>
              Configure Interaction LLM provider, model, and parameters.
            </SheetDescription>
          </VisuallyHidden.Root>
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  );
}
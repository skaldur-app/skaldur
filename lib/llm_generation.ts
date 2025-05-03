import {
    ProviderConfig,
    GenerationParams,
    ILlmProviderAdapter,
    OpenAIConfig,
    AzureOpenAIConfig,
    AnthropicSDKConfig,
    AnthropicBedrockConfig,
    GoogleGeminiConfig,
} from './llm_providers/types';
import { LlmSettings } from "@/types";
import { LlmProviderId } from './model_details'; // Import LlmProviderId

// Import all adapter classes
import { OpenaiAdapter } from './llm_providers/openai';
import { AzureOpenaiAdapter } from './llm_providers/azure_openai';
import { AnthropicSdkAdapter } from './llm_providers/anthropic_sdk';
import { AnthropicBedrockSdkAdapter } from './llm_providers/anthropic_bedrock';
import { GoogleGeminiAdapter } from './llm_providers/google_gemini';

// Map provider IDs to their adapter classes (same as validation)
const adapterMap: {
    [key in LlmProviderId]: new () => ILlmProviderAdapter;
} = {
    openai: OpenaiAdapter,
    azure: AzureOpenaiAdapter,
    anthropic: AnthropicSdkAdapter,
    'anthropic-bedrock': AnthropicBedrockSdkAdapter,
    google: GoogleGeminiAdapter,
};

/**
 * Generates a completion using the appropriate LLM provider based on settings.
 *
 * DEPRECATED: This function contains insecure client-side credential handling.
 * The generation logic has been moved to the `/api/generate` endpoint.
 * This function should no longer be used directly for generation.
 *
 * @param settings - The LLM settings containing provider ID, model, temp, tokens.
 * @param prompt - The user prompt string.
 * @returns A promise resolving to the generated completion string.
 * @throws Error if configuration is invalid, credentials fail, or generation fails.
 */
export async function generateLlmCompletion(
    settings: LlmSettings,
    prompt: string,
    systemPrompt?: string // Allow optional system prompt override
): Promise<string> {
    console.warn("DEPRECATED: generateLlmCompletion called directly on client-side. Use /api/generate endpoint instead.");

    const providerId = settings.provider as LlmProviderId;
    const AdapterClass = adapterMap[providerId];

    if (!AdapterClass) {
        throw new Error(`Unsupported provider ID for generation: ${providerId}`);
    }

    // --- Construct ProviderConfig for Generation ---
    // WARNING: Insecure credential handling below. DO NOT USE IN PRODUCTION.
    let providerConfig: ProviderConfig | null = null;
    /*  // COMMENTING OUT INSECURE CLIENT-SIDE CREDENTIAL HANDLING
    try {
         switch (providerId) {
            case 'openai':
                providerConfig = {
                    providerId: 'openai',
                    apiKey: "", // process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
                    baseUrl: undefined, // process.env.NEXT_PUBLIC_OPENAI_BASE_URL || undefined,
                };
                break;
            case 'azure':
                // Model ID from settings IS the deployment name for Azure
                 providerConfig = {
                    providerId: 'azure',
                    apiKey: "", // process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY || "",
                    endpoint: "", // process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT || "",
                    deploymentName: settings.model,
                };
                break;
            case 'anthropic':
                providerConfig = {
                    providerId: 'anthropic',
                    apiKey: "", // process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || "",
                    baseUrl: undefined, // process.env.NEXT_PUBLIC_ANTHROPIC_BASE_URL || undefined,
                };
                break;
            case 'anthropic-bedrock':
                 providerConfig = {
                    providerId: 'anthropic-bedrock',
                    // Region must be available, either from env var or potentially stored in settings later
                    awsRegion: "", // process.env.NEXT_PUBLIC_AWS_REGION || process.env.AWS_REGION || "",
                    awsAccessKeyId: undefined, // process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || undefined,
                    awsSecretAccessKey: undefined, // process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || undefined,
                    awsSessionToken: undefined, // process.env.NEXT_PUBLIC_AWS_SESSION_TOKEN || undefined,
                };
                 if (!providerConfig.awsRegion) throw new Error("AWS Region is required for Bedrock but not found.");
                break;
            case 'google':
                providerConfig = {
                    providerId: 'google',
                    apiKey: "", // process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
                };
                break;
            default:
                 // Should be caught by AdapterClass check, but belts and suspenders
                throw new Error(`Unsupported provider configuration: ${providerId}`);
        }

        // Simple validation of required fields before calling adapter
         if (!providerConfig || (providerConfig.providerId !== 'anthropic-bedrock' && !('apiKey' in providerConfig && providerConfig.apiKey))) {
            if (providerId !== 'anthropic-bedrock') { // Bedrock relies on env vars primarily
                throw new Error(`API Key configuration missing for provider: ${providerId}`);
            }
        }
        if (providerConfig.providerId === 'azure' && (!providerConfig.endpoint || !providerConfig.deploymentName)) {
             throw new Error(`Azure Endpoint or Deployment Name configuration missing.`);
        }
         // Region checked within Bedrock case

    } catch (configError: any) {
         console.error("Error constructing provider config for generation:", configError);
         throw new Error(`Configuration error for ${providerId}: ${configError.message}`);
    }
    */ // END COMMENTING OUT

    // Throw error because this function should not be used anymore
    throw new Error("generateLlmCompletion called directly on client-side. Use /api/generate endpoint instead.");

    // --- Construct GenerationParams ---
    // --- Logic below is now unreachable ---
    /*
    const generationParams: GenerationParams = {
        model: settings.model, // Model ID (or deployment name for Azure)
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        systemPrompt: systemPrompt || settings.systemPrompt, // Use override or setting
    };

    // --- Call Adapter ---
    try {
        const adapter = new AdapterClass();
        console.log(`Generating completion via provider: ${providerId}, model: ${settings.model}`);
        const completion = await adapter.generateCompletion(
            providerConfig,
            generationParams,
            prompt
        );
        console.log(`Generation successful for ${providerId}.`);
        return completion;
    } catch (error: any) {
        console.error(
            `Error during generation via provider ${providerId}:`, error
        );
        // Re-throw the error to be handled by the calling UI
        throw new Error(`LLM Generation Error (${providerId}): ${error.message || error}`);
    }
    */
}
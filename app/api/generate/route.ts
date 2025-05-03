import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
    ProviderConfig,
    GenerationParams,
    ILlmProviderAdapter,
    // Import specific config types
    OpenAIConfig,
    AzureOpenAIConfig,
    AnthropicSDKConfig,
    AnthropicBedrockConfig,
    GoogleGeminiConfig,
} from '@/lib/llm_providers/types';
import { LlmSettings } from "@/types";
import { LlmProviderId } from '@/lib/model_details';

// Import all adapter classes
import { OpenaiAdapter } from '@/lib/llm_providers/openai';
import { AzureOpenaiAdapter } from '@/lib/llm_providers/azure_openai';
import { AnthropicSdkAdapter } from '@/lib/llm_providers/anthropic_sdk';
import { AnthropicBedrockSdkAdapter } from '@/lib/llm_providers/anthropic_bedrock';
import { GoogleGeminiAdapter } from '@/lib/llm_providers/google_gemini';

// Map provider IDs to their adapter classes
const adapterMap: {
    [key in LlmProviderId]: new () => ILlmProviderAdapter;
} = {
    openai: OpenaiAdapter,
    azure: AzureOpenaiAdapter,
    anthropic: AnthropicSdkAdapter,
    'anthropic-bedrock': AnthropicBedrockSdkAdapter,
    google: GoogleGeminiAdapter,
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { settings, prompt, systemPromptOverride } = body;

        if (!settings || !prompt) {
            return NextResponse.json({ error: 'Missing settings or prompt in request body' }, { status: 400 });
        }

        const validatedSettings = settings as LlmSettings; // Add more validation if needed
        const providerId = validatedSettings.provider as LlmProviderId;
        const AdapterClass = adapterMap[providerId];

        if (!AdapterClass) {
             return NextResponse.json({ error: `Unsupported provider ID: ${providerId}` }, { status: 400 });
        }

        // --- Construct ProviderConfig Securely on Backend ---
        let providerConfig: ProviderConfig;
        try {
            switch (providerId) {
                case 'openai':
                    providerConfig = {
                        providerId: 'openai',
                        apiKey: process.env.OPENAI_API_KEY || "",
                        baseUrl: validatedSettings.baseUrl || process.env.OPENAI_BASE_URL || undefined,
                    };
                    break;
                case 'azure':
                    const azureConfig: AzureOpenAIConfig = {
                        providerId: 'azure',
                        apiKey: process.env.AZURE_OPENAI_API_KEY || "",
                        endpoint: validatedSettings.baseUrl || process.env.AZURE_OPENAI_ENDPOINT || "",
                        deploymentName: validatedSettings.model,
                        apiVersion: validatedSettings.azureApiVersion
                    };
                     if (!azureConfig.endpoint || !azureConfig.deploymentName) {
                        throw new Error("Azure Endpoint or Deployment Name configuration missing on server.");
                    }
                    providerConfig = azureConfig; // Assign the narrowed type
                    break;
                case 'anthropic':
                    providerConfig = {
                        providerId: 'anthropic',
                        apiKey: process.env.ANTHROPIC_API_KEY || "",
                        baseUrl: validatedSettings.baseUrl || process.env.ANTHROPIC_BASE_URL || undefined,
                    };
                    break;
                case 'anthropic-bedrock':
                    providerConfig = {
                        providerId: 'anthropic-bedrock',
                        awsRegion: validatedSettings.baseUrl || process.env.AWS_REGION || "",
                        awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || undefined,
                        awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || undefined,
                        awsSessionToken: process.env.AWS_SESSION_TOKEN || undefined,
                    };
                    if (!providerConfig.awsRegion) throw new Error("AWS Region is required for Bedrock but not configured on server (AWS_REGION env var).");
                    break;
                case 'google':
                    providerConfig = {
                        providerId: 'google',
                        apiKey: process.env.GOOGLE_API_KEY || "",
                    };
                    break;
                default:
                    throw new Error(`Unsupported provider configuration: ${providerId}`);
            }

            // Check for missing API keys (except Bedrock which might use IAM roles)
            if (providerId !== 'anthropic-bedrock' && !('apiKey' in providerConfig && providerConfig.apiKey)) {
                throw new Error(`API Key for ${providerId} is not configured on the server.`);
            }

        } catch (configError: any) {
            console.error(`Configuration error on server for ${providerId}:`, configError);
             return NextResponse.json({ error: `Server configuration error for ${providerId}: ${configError.message}` }, { status: 500 });
        }

        // --- Construct GenerationParams ---
        const generationParams: GenerationParams = {
            model: validatedSettings.model,
            temperature: validatedSettings.temperature,
            maxTokens: validatedSettings.maxTokens,
            systemPrompt: systemPromptOverride || validatedSettings.systemPrompt,
        };

        // --- Call Adapter ---
        const adapter = new AdapterClass();
        const completion = await adapter.generateCompletion(
            providerConfig,
            generationParams,
            prompt
        );

        return NextResponse.json({ completion });

    } catch (error: any) {
        console.error('[API_GENERATE_ERROR]', error);
        // Determine status code based on error type if possible
        let statusCode = 500;
        if (error.message?.includes("Authentication failed") || error.message?.includes("Invalid API Key")) {
             statusCode = 401; // Unauthorized
        } else if (error.message?.includes("quota") || error.message?.includes("Rate limit")) {
             statusCode = 429; // Too Many Requests
        } else if (error.message?.includes("not found")) {
            statusCode = 404; // Not Found (e.g., model, deployment)
        }

        return NextResponse.json({ error: `LLM generation failed: ${error.message}` }, { status: statusCode });
    }
}
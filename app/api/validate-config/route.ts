export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
    ProviderConfig,
    ValidationResult,
    ILlmProviderAdapter,
    OpenAIConfig,
    AzureOpenAIConfig,
    AnthropicSDKConfig,
    AnthropicBedrockConfig,
    GoogleGeminiConfig,
} from '@/lib/llm_providers/types';
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

// Define expected shape of the request body (excluding secrets)
interface ValidationRequestBody {
    providerId: LlmProviderId;
    baseUrl?: string;
    endpoint?: string;
    deploymentName?: string;
    awsRegion?: string;
    apiVersion?: string;
    // Add other non-sensitive fields if needed
}

export async function POST(request: NextRequest) {
    try {
        const body: ValidationRequestBody = await request.json();
        const { providerId } = body;

        if (!providerId) {
            return NextResponse.json({ success: false, error: 'Missing providerId in request body' }, { status: 400 });
        }

        const AdapterClass = adapterMap[providerId];
        if (!AdapterClass) {
            return NextResponse.json({ success: false, error: `Unsupported provider ID: ${providerId}` }, { status: 400 });
        }

        // --- Construct ProviderConfig Securely on Backend ---
        let providerConfig: ProviderConfig;
        try {
            switch (providerId) {
                case 'openai':
                    providerConfig = {
                        providerId: 'openai',
                        apiKey: process.env.OPENAI_API_KEY || "",
                        baseUrl: body.baseUrl, // Use baseUrl from request if provided
                    };
                    break;
                case 'azure':
                    if (!body.endpoint || !body.deploymentName) {
                         throw new Error("Missing endpoint or deploymentName in request for Azure validation.");
                    }
                    providerConfig = {
                        providerId: 'azure',
                        apiKey: process.env.AZURE_OPENAI_API_KEY || "",
                        endpoint: body.endpoint,
                        deploymentName: body.deploymentName,
                        apiVersion: body.apiVersion
                    };
                    break;
                case 'anthropic':
                    providerConfig = {
                        providerId: 'anthropic',
                        apiKey: process.env.ANTHROPIC_API_KEY || "",
                        baseUrl: body.baseUrl,
                    };
                    break;
                case 'anthropic-bedrock':
                     const region = body.awsRegion || process.env.AWS_REGION || "";
                     if (!region) {
                        throw new Error("AWS Region is required for Bedrock validation but not found in request or server environment (AWS_REGION).");
                     }
                    providerConfig = {
                        providerId: 'anthropic-bedrock',
                        awsRegion: region,
                        awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || undefined,
                        awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || undefined,
                        awsSessionToken: process.env.AWS_SESSION_TOKEN || undefined,
                    };
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

             // Check for missing API keys (except Bedrock)
            if (providerId !== 'anthropic-bedrock' && !('apiKey' in providerConfig && providerConfig.apiKey)) {
                throw new Error(`API Key for ${providerId} is not configured on the server.`);
            }

        } catch (configError: any) {
             console.error(`Configuration error during validation on server for ${providerId}:`, configError);
             // Return validation result format for config errors
             return NextResponse.json<ValidationResult>({ success: false, error: `Server configuration error: ${configError.message}` }, { status: 500 });
        }

        // --- Call Adapter Validation ---
        const adapter = new AdapterClass();
        const result = await adapter.validateCredentials(providerConfig);

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('[API_VALIDATE_ERROR]', error);
        // Return validation result format for unexpected errors
        return NextResponse.json<ValidationResult>({ success: false, error: `Validation failed: ${error.message}` }, { status: 500 });
    }
}
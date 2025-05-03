import Anthropic from '@anthropic-ai/sdk';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import {
    ILlmProviderAdapter,
    AnthropicBedrockConfig,
    ProviderConfig,
    ValidationResult,
    GenerationParams,
} from './types';

// Use a simple prompt and low token count for validation
const VALIDATION_PROMPT = "Test connection";
const VALIDATION_MAX_TOKENS = 5;
// Use a known, generally available Anthropic model ID on Bedrock
// Note: Actual available model IDs might vary by region and account access.
const VALIDATION_MODEL_ID = 'anthropic.claude-3-haiku-20240307-v1:0';

export class AnthropicBedrockSdkAdapter implements ILlmProviderAdapter {
    async validateCredentials(config: ProviderConfig): Promise<ValidationResult> {
        if (config.providerId !== 'anthropic-bedrock') {
            throw new Error('Invalid configuration type provided to AnthropicBedrockSdkAdapter');
        }
        const bedrockConfig = config as AnthropicBedrockConfig;

        // Region is necessary, ensure it's set in the environment or config
        if (!bedrockConfig.awsRegion && !process.env.AWS_REGION) {
            return { success: false, error: 'AWS Region is missing. Set via config or AWS_REGION env var.' };
        }

        try {
            // Standard Anthropic client automatically detects Bedrock environment
            // and uses default AWS credential chain (env vars, profile, role).
            // Region might be picked from AWS_REGION env var if not explicitly set.
            // Explicit credential passing in constructor is NOT standard for Bedrock via this SDK.
            const client = new Anthropic({
                // No explicit AWS creds or region here - relies on environment
            });

            // Use invokeModel for validation as messages.create might require model access
            // setup that hasn't happened yet. Listing models or a simpler call might be better,
            // but invokeModel is a direct way to test basic connectivity and auth.
            // We need BedrockRuntimeClient for this specific validation call.
            const bedrockClient = new BedrockRuntimeClient({
                region: bedrockConfig.awsRegion || process.env.AWS_REGION,
                // Credentials are auto-discovered by the SDK
            });

            const command = new InvokeModelCommand({
                modelId: VALIDATION_MODEL_ID,
                contentType: "application/json",
                accept: "application/json",
                // Minimal body for validation
                body: JSON.stringify({
                    anthropic_version: "bedrock-2023-05-31",
                    max_tokens: VALIDATION_MAX_TOKENS,
                    messages: [{ role: "user", content: VALIDATION_PROMPT }],
                 }),
            });

            await bedrockClient.send(command);

            return { success: true };

        } catch (error: any) {
            console.error("Anthropic Bedrock validation error:", error);
            let errorMessage = `Failed to validate Anthropic Bedrock credentials: ${error.message}`;
            if (error.name === 'AccessDeniedException') {
                 errorMessage = `AWS Bedrock Access Denied: ${error.message}. Check IAM permissions and model access in Bedrock console.`;
            } else if (error.name === 'ResourceNotFoundException') {
                 errorMessage = `AWS Bedrock Resource Not Found: ${error.message}. Verify model ID (${VALIDATION_MODEL_ID}) and AWS region.`;
            }
            return { success: false, error: errorMessage };
        }
    }

    // --- Generate Completion ---
    async generateCompletion(
        config: ProviderConfig,
        params: GenerationParams,
        prompt: string
    ): Promise<string> {
        if (config.providerId !== 'anthropic-bedrock') {
            throw new Error('Invalid configuration type provided to AnthropicBedrockSdkAdapter');
        }
        // Config provides region etc. but isn't directly used by constructor here
        const bedrockConfig = config as AnthropicBedrockConfig;

        if (!bedrockConfig.awsRegion && !process.env.AWS_REGION) {
            throw new Error('AWS region is missing for Anthropic Bedrock generation.');
        }

        try {
            // Standard Anthropic client detects Bedrock env and uses default creds/region
            const client = new Anthropic({
                 // No explicit AWS creds or region here - relies on environment
            });

            const response = await client.messages.create({
                model: params.model, // Bedrock model ID from params (e.g., 'anthropic.claude-3-...')
                messages: [{ role: 'user', content: prompt }],
                system: params.systemPrompt,
                temperature: params.temperature,
                max_tokens: params.maxTokens || 1024,
            });

            const completion = response.content
                .filter(block => block.type === 'text')
                .map(block => block.text)
                .join('\n');

            if (!completion) {
                throw new Error('Anthropic Bedrock response did not contain a text completion.');
            }
            return completion.trim();

        } catch (error: any) {
            console.error("Anthropic Bedrock generation error:", error);
            // Use standard Anthropic SDK error type
             if (error instanceof Anthropic.APIError) {
                 throw new Error(`Anthropic Bedrock API Error (${error.status}): ${error.message}`);
            // Check for specific AWS errors if Anthropic.APIError doesn't catch them
            } else if (error.name === 'AccessDeniedException') {
                 throw new Error(`AWS Bedrock Access Denied: ${error.message}. Check IAM permissions.`);
            } else if (error.name === 'ValidationException') {
                 throw new Error(`AWS Bedrock Validation Error: ${error.message}. Check model ID and parameters.`);
            } else {
                 throw new Error(`Failed to generate completion from Anthropic Bedrock: ${error.message}`);
            }
        }
    }
}
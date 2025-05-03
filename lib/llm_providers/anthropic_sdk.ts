import Anthropic from '@anthropic-ai/sdk';
import {
    ILlmProviderAdapter,
    AnthropicSDKConfig,
    ProviderConfig,
    ValidationResult,
    GenerationParams,
} from './types';

// Use a simple prompt and low token count for validation
const VALIDATION_PROMPT = "Test connection";
const VALIDATION_MAX_TOKENS = 5;
const VALIDATION_MODEL = 'claude-3-haiku-20240307'; // Use a known, generally available small model

export class AnthropicSdkAdapter implements ILlmProviderAdapter {
    async validateCredentials(config: ProviderConfig): Promise<ValidationResult> {
        if (config.providerId !== 'anthropic') {
            throw new Error('Invalid configuration type provided to AnthropicSdkAdapter');
        }
        const anthropicConfig = config as AnthropicSDKConfig;

        if (!anthropicConfig.apiKey) {
            return { success: false, error: 'API key is missing.' };
        }

        try {
            const anthropic = new Anthropic({
                apiKey: anthropicConfig.apiKey,
                baseURL: anthropicConfig.baseUrl, // Optional
            });

            // Perform a simple message creation request to validate
            await anthropic.messages.create({
                model: VALIDATION_MODEL,
                messages: [{ role: 'user', content: VALIDATION_PROMPT }],
                max_tokens: VALIDATION_MAX_TOKENS,
            });

            return { success: true };
        } catch (error: any) {
            let errorMessage = 'Failed to connect to Anthropic.';
            if (error instanceof Anthropic.APIError) {
                errorMessage = `Anthropic API Error (${error.status}): ${error.message}`;
                if (error.status === 401) {
                    errorMessage = 'Authentication failed. Check your Anthropic API key.';
                } else if (error.status === 403) {
                    errorMessage = 'Permission denied. Check API key permissions or project settings.';
                } else if (error.status === 404) {
                    errorMessage = `Resource not found (404). Check base URL or model ID (${VALIDATION_MODEL}).`;
                } else if (error.status === 429) {
                    errorMessage = 'Rate limit exceeded. Please check your Anthropic plan.';
                }
            } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
                 errorMessage = `Network error: Could not reach Anthropic${anthropicConfig.baseUrl ? ' at ' + anthropicConfig.baseUrl : ''}. Check network or base URL.`;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            console.error('Anthropic SDK validation failed:', error);
            return { success: false, error: errorMessage };
        }
    }

    // --- Generate Completion ---
    async generateCompletion(
        config: ProviderConfig,
        params: GenerationParams,
        prompt: string
    ): Promise<string> {
        if (config.providerId !== 'anthropic') {
            throw new Error('Invalid configuration type provided to AnthropicSdkAdapter');
        }
        const anthropicConfig = config as AnthropicSDKConfig;

        if (!anthropicConfig.apiKey) {
            throw new Error('API key is missing in Anthropic configuration.');
        }

        try {
            const anthropic = new Anthropic({
                apiKey: anthropicConfig.apiKey,
                baseURL: anthropicConfig.baseUrl, // Optional
            });

            const response = await anthropic.messages.create({
                model: params.model, // Use model from params
                messages: [{ role: 'user', content: prompt }],
                system: params.systemPrompt, // Use system prompt from params
                temperature: params.temperature, // Use temperature from params
                max_tokens: params.maxTokens || 1024, // Use maxTokens, provide a default if missing
            });

            // Anthropic returns content in a list, usually with one text block
            const completion = response.content
                .filter(block => block.type === 'text')
                .map(block => block.text)
                .join('\n');

            if (!completion) {
                throw new Error('Anthropic response did not contain a text completion.');
            }
            return completion.trim();

        } catch (error: any) {
            console.error("Anthropic SDK generation error:", error);
             if (error instanceof Anthropic.APIError) {
                throw new Error(`Anthropic API Error (${error.status}): ${error.message}`);
            } else {
                throw new Error(`Failed to generate completion from Anthropic: ${error.message}`);
            }
        }
    }
}
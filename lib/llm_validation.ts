import {
    ProviderConfig,
    ValidationResult,
    ILlmProviderAdapter,
} from './llm_providers/types';
import { OpenaiAdapter } from './llm_providers/openai';
import { AzureOpenaiAdapter } from './llm_providers/azure_openai';
import { AnthropicSdkAdapter } from './llm_providers/anthropic_sdk';
import { AnthropicBedrockSdkAdapter } from './llm_providers/anthropic_bedrock';
import { GoogleGeminiAdapter } from './llm_providers/google_gemini';

// Map provider IDs to their adapter classes
const adapterMap: {
    [key in ProviderConfig['providerId']]: new () => ILlmProviderAdapter;
} = {
    openai: OpenaiAdapter,
    azure: AzureOpenaiAdapter,
    anthropic: AnthropicSdkAdapter,
    'anthropic-bedrock': AnthropicBedrockSdkAdapter,
    google: GoogleGeminiAdapter,
};

/**
 * Validates the credentials for a given LLM provider configuration.
 *
 * This function selects the appropriate provider adapter based on the config.providerId
 * and calls its validateCredentials method.
 *
 * @param config - The provider configuration containing credentials and other necessary info.
 * @returns A promise resolving to a ValidationResult indicating success or failure with an error message.
 */
export async function validateLlmConfig(
    config: ProviderConfig
): Promise<ValidationResult> {
    const AdapterClass = adapterMap[config.providerId];

    if (!AdapterClass) {
        console.error(`No adapter found for provider ID: ${config.providerId}`);
        return {
            success: false,
            error: `Unsupported provider ID: ${config.providerId}`,
        };
    }

    try {
        const adapter = new AdapterClass();
        console.log(`Validating credentials for provider: ${config.providerId}...`);
        const result = await adapter.validateCredentials(config);
        console.log(`Validation result for ${config.providerId}:`, result);
        return result;
    } catch (error: any) {
        console.error(
            `Unexpected error during validation for provider ${config.providerId}:`,
            error
        );
        return {
            success: false,
            error: `An unexpected error occurred during validation: ${error.message || error}`,
        };
    }
}
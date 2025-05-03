import OpenAI from 'openai';
import {
    ILlmProviderAdapter,
    AzureOpenAIConfig,
    ProviderConfig,
    ValidationResult,
    GenerationParams,
} from './types';

// Use a simple prompt for validation
const VALIDATION_PROMPT = "Test connection";
const VALIDATION_MAX_TOKENS = 5;
// Default API version - can be overridden by config
export const AZURE_API_VERSION = "2024-02-01";

export class AzureOpenaiAdapter implements ILlmProviderAdapter {
    async validateCredentials(config: ProviderConfig): Promise<ValidationResult> {
        if (config.providerId !== 'azure') {
            throw new Error('Invalid configuration type provided to AzureOpenaiAdapter');
        }
        const azureConfig = config as AzureOpenAIConfig;
        const apiVersion = azureConfig.apiVersion || AZURE_API_VERSION; // Use config or default

        if (!azureConfig.apiKey) {
            return { success: false, error: 'API key is missing.' };
        }
        if (!azureConfig.endpoint) {
            return { success: false, error: 'Azure endpoint URL is missing.' };
        }
        // Deployment name isn't directly used in client construction for v4,
        // but it's needed for the API calls, so we still validate it.
        if (!azureConfig.deploymentName) {
            return { success: false, error: 'Azure deployment name is missing.' };
        }

        try {
            // Configure the OpenAI client for Azure
            const client = new OpenAI({
                apiKey: azureConfig.apiKey,
                baseURL: `${azureConfig.endpoint}${azureConfig.endpoint.endsWith('/') ? '' : '/'}openai/deployments/${azureConfig.deploymentName}`,
                defaultQuery: { 'api-version': apiVersion },
                defaultHeaders: { 'api-key': azureConfig.apiKey },
            });

            // Perform a simple completion request to validate
            // Note: The model parameter here is the deployment name for Azure
            await client.chat.completions.create({
                model: azureConfig.deploymentName, // Use deployment name as model for Azure
                messages: [{ role: "user", content: VALIDATION_PROMPT }],
                max_tokens: VALIDATION_MAX_TOKENS,
            });

            return { success: true };
        } catch (error: any) {
            let errorMessage = 'Failed to connect to Azure OpenAI.';
             if (error instanceof OpenAI.APIError) {
                errorMessage = `Azure OpenAI API Error (${error.status}): ${error.message}`;
                if (error.status === 401) {
                    errorMessage = 'Authentication failed. Check Azure API key or endpoint.';
                } else if (error.status === 404) {
                    // This could be endpoint OR deployment name incorrect
                    errorMessage = `Resource not found (404). Check Azure endpoint and deployment name (${azureConfig.deploymentName}).`;
                } else if (error.status === 429) {
                    errorMessage = 'Rate limit exceeded or quota issue. Check your Azure OpenAI plan/quota.';
                }
            } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
                errorMessage = `Network error: Could not reach Azure endpoint ${azureConfig.endpoint}. Check network connection or endpoint URL.`;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            console.error('Azure OpenAI validation failed:', error);
            return { success: false, error: errorMessage };
        }
    }

    // --- Generate Completion ---
    async generateCompletion(
        config: ProviderConfig,
        params: GenerationParams,
        prompt: string
      ): Promise<string> {
        if (config.providerId !== 'azure') {
          throw new Error('Invalid configuration type provided to AzureOpenaiAdapter');
        }
        const azureConfig = config as AzureOpenAIConfig;
        const apiVersion = azureConfig.apiVersion || AZURE_API_VERSION; // Use config or default

        if (!azureConfig.apiKey || !azureConfig.endpoint || !azureConfig.deploymentName) {
          throw new Error('API key, endpoint, or deployment name is missing in Azure configuration.');
        }

        try {
          // Initialize OpenAI client configured for Azure
          const openai = new OpenAI({
            apiKey: azureConfig.apiKey,
            baseURL: `${azureConfig.endpoint}/openai/deployments/${azureConfig.deploymentName}`,
            defaultQuery: { 'api-version': apiVersion },
            defaultHeaders: { 'api-key': azureConfig.apiKey },
          });

          const response = await openai.chat.completions.create({
            // Model is implicitly the deploymentName via baseURL for Azure
            model: azureConfig.deploymentName, // Although redundant with baseURL, pass it for clarity/potential SDK use
            messages: [
              ...(params.systemPrompt ? [{ role: "system" as const, content: params.systemPrompt }] : []),
              { role: "user", content: prompt },
            ],
            temperature: params.temperature,
            max_tokens: params.maxTokens,
          });

          const completion = response.choices[0]?.message?.content;
          if (!completion) {
            throw new Error('Azure OpenAI response did not contain a completion.');
          }
          return completion.trim();

        } catch (error: any) {
          console.error("Azure OpenAI generation error:", error);
          if (error instanceof OpenAI.APIError) {
            throw new Error(`Azure OpenAI API Error (${error.status}): ${error.message}`);
          } else {
            throw new Error(`Failed to generate completion from Azure OpenAI: ${error.message}`);
          }
        }
      }
}
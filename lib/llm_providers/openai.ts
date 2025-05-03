import OpenAI from 'openai';
import {
  ILlmProviderAdapter,
  OpenAIConfig,
  ProviderConfig,
  ValidationResult,
  GenerationParams,
} from './types';

// Use a simple, low-cost model for validation if possible, like listing models.
const VALIDATION_PROMPT = 'Test';
const VALIDATION_MAX_TOKENS = 5;

export class OpenaiAdapter implements ILlmProviderAdapter {
  async validateCredentials(config: ProviderConfig): Promise<ValidationResult> {
    if (config.providerId !== 'openai') {
      throw new Error('Invalid configuration type provided to OpenaiAdapter');
    }
    const openAIConfig = config as OpenAIConfig;

    if (!openAIConfig.apiKey) {
        return { success: false, error: 'API key is missing.' };
    }

    try {
      const openai = new OpenAI({
        apiKey: openAIConfig.apiKey,
        baseURL: openAIConfig.baseUrl, // Will be undefined if not provided, which is fine
      });

      // Attempt to list models as a simple validation call
      // This usually requires fewer permissions and is less resource-intensive
      // than creating a completion.
      await openai.models.list();

      // Optional: uncomment to perform a completion test
      /*
      await openai.chat.completions.create({
          model: 'gpt-3.5-turbo', // Use a common, available model for testing
          messages: [{ role: 'user', content: VALIDATION_PROMPT }],
          max_tokens: VALIDATION_MAX_TOKENS,
      });
      */

      return { success: true };
    } catch (error: any) {
      let errorMessage = 'Failed to connect to OpenAI.';
      if (error instanceof OpenAI.APIError) {
        errorMessage = `OpenAI API Error (${error.status}): ${error.message}`;
        // Specific handling for authentication errors
        if (error.status === 401) {
            errorMessage = 'Authentication failed. Please check your OpenAI API key.';
        } else if (error.status === 429) {
            errorMessage = 'Rate limit exceeded or quota issue. Please check your OpenAI plan.';
        }
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        errorMessage = `Network error: Could not reach OpenAI${openAIConfig.baseUrl ? ' at ' + openAIConfig.baseUrl : ''}. Check network or base URL.`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('OpenAI validation failed:', error);
      return { success: false, error: errorMessage };
    }
  }

  // --- Generate Completion ---
  async generateCompletion(
    config: ProviderConfig,
    params: GenerationParams,
    prompt: string
  ): Promise<string> {
    if (config.providerId !== 'openai') {
      throw new Error('Invalid configuration type provided to OpenaiAdapter');
    }
    const openAIConfig = config as OpenAIConfig;

    if (!openAIConfig.apiKey) {
      throw new Error('API key is missing in OpenAI configuration.');
    }

    try {
      const openai = new OpenAI({
        apiKey: openAIConfig.apiKey,
        baseURL: openAIConfig.baseUrl, // Optional
      });

      const response = await openai.chat.completions.create({
        model: params.model, // Use model from params
        messages: [
          // Add system prompt if provided in params
          ...(params.systemPrompt ? [{ role: "system" as const, content: params.systemPrompt }] : []),
          { role: "user", content: prompt },
        ],
        temperature: params.temperature, // Use temperature from params
        max_tokens: params.maxTokens, // Use maxTokens from params
      });

      const completion = response.choices[0]?.message?.content;
      if (!completion) {
        throw new Error('OpenAI response did not contain a completion.');
      }
      return completion.trim();

    } catch (error: any) {
        console.error("OpenAI generation error:", error);
        // Re-throw a more specific error or handle different error types
        if (error instanceof OpenAI.APIError) {
             throw new Error(`OpenAI API Error (${error.status}): ${error.message}`);
        } else {
             throw new Error(`Failed to generate completion from OpenAI: ${error.message}`);
        }
    }
  }
}
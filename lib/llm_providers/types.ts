/**
 * Represents the result of a credential validation attempt.
 */
export interface ValidationResult {
  success: boolean;
  /** Error message if validation failed. */
  error?: string;
}

/**
 * Common generation parameters.
 */
export interface GenerationParams {
  model: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string; // Optional system prompt
}

/**
 * Base configuration required for any provider.
 */
export interface BaseProviderConfig {
  providerId: 'openai' | 'azure' | 'anthropic' | 'anthropic-bedrock' | 'google';
}

/**
 * Configuration specific to OpenAI.
 */
export interface OpenAIConfig extends BaseProviderConfig {
  providerId: 'openai';
  apiKey: string;
  baseUrl?: string; // Optional for self-hosted or proxies
}

/**
 * Configuration specific to Azure OpenAI.
 */
export interface AzureOpenAIConfig extends BaseProviderConfig {
  providerId: 'azure';
  apiKey: string;
  endpoint: string;
  deploymentName: string; // Model is deployed under a specific name
  apiVersion?: string; // Optional API Version
}

/**
 * Configuration specific to Anthropic SDK.
 */
export interface AnthropicSDKConfig extends BaseProviderConfig {
  providerId: 'anthropic';
  apiKey: string;
  baseUrl?: string; // Optional base URL
}

/**
 * Configuration specific to Anthropic via AWS Bedrock.
 * AWS Credentials should be configured via standard AWS SDK methods
 * (e.g., environment variables, IAM roles, credentials file).
 */
export interface AnthropicBedrockConfig extends BaseProviderConfig {
  providerId: 'anthropic-bedrock';
  awsRegion: string;
  awsAccessKeyId?: string; // Optional: If not using env vars or roles
  awsSecretAccessKey?: string; // Optional: If not using env vars or roles
  awsSessionToken?: string; // Optional: For temporary credentials
}

/**
 * Configuration specific to Google Gemini.
 */
export interface GoogleGeminiConfig extends BaseProviderConfig {
  providerId: 'google';
  apiKey: string;
}

/**
 * Union type for all possible provider configurations.
 */
export type ProviderConfig =
  | OpenAIConfig
  | AzureOpenAIConfig
  | AnthropicSDKConfig
  | AnthropicBedrockConfig
  | GoogleGeminiConfig;

/**
 * Unified interface for LLM provider adapters.
 */
export interface ILlmProviderAdapter {
  /**
   * Validates the provided credentials by making a simple API call.
   *
   * @param config - The configuration object specific to the provider.
   * @returns A promise resolving to a ValidationResult.
   */
  validateCredentials(config: ProviderConfig): Promise<ValidationResult>;

  /**
   * Generates a text completion based on the provided prompt and parameters.
   *
   * @param config - The configuration object specific to the provider.
   * @param params - Common generation parameters (model, temperature, etc.).
   * @param prompt - The user's input prompt.
   * @returns A promise resolving to the generated text completion as a string.
   * @throws Error if generation fails.
   */
  generateCompletion(
    config: ProviderConfig,
    params: GenerationParams,
    prompt: string
  ): Promise<string>;
}
import { LlmSettings } from "@/types";

export interface LlmModelDetails {
  id: string;
  name: string;
  providerId: LlmProviderId;
  maxContextTokens: number;
  maxOutputTokens: number;
  supportsTemperature: boolean;
  supportsSystemPrompt: boolean;
  defaultTemperature?: number;
  defaultMaxOutputTokens?: number;
}

export type LlmProviderId = 'openai' | 'azure' | 'anthropic' | 'anthropic-bedrock' | 'google';

// Define the list of valid provider IDs for the type guard
const validProviderIds: LlmProviderId[] = ['openai', 'azure', 'anthropic', 'anthropic-bedrock', 'google'];

/**
 * Type guard to check if a string is a valid LlmProviderId.
 * @param value The string to check.
 * @returns True if the value is a valid LlmProviderId, false otherwise.
 */
export function isLlmProviderId(value: string): value is LlmProviderId {
  return validProviderIds.includes(value as LlmProviderId);
}

export interface LlmProviderDetails {
  id: LlmProviderId;
  name: string;
  models: LlmModelDetails[];
}

export const llmProviderDetails: LlmProviderDetails[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        providerId: 'openai',
        maxContextTokens: 128000,
        maxOutputTokens: 16384,
        supportsTemperature: true,
        supportsSystemPrompt: true,
        defaultTemperature: 0.7,
        defaultMaxOutputTokens: 2048,
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        providerId: 'openai',
        maxContextTokens: 128000,
        maxOutputTokens: 16384,
        supportsTemperature: true,
        supportsSystemPrompt: true,
        defaultTemperature: 0.7,
        defaultMaxOutputTokens: 2048,
      },
      {
        id: 'gpt-4.1',
        name: 'GPT-4.1',
        providerId: 'openai',
        maxContextTokens: 1000000,
        maxOutputTokens: 64000,
        supportsTemperature: true,
        supportsSystemPrompt: true,
        defaultTemperature: 0.7,
        defaultMaxOutputTokens: 2048,
      },
      {
        id: 'gpt-4.1-mini',
        name: 'GPT-4.1 Mini',
        providerId: 'openai',
        maxContextTokens: 1000000,
        maxOutputTokens: 64000,
        supportsTemperature: true,
        supportsSystemPrompt: true,
        defaultTemperature: 0.7,
        defaultMaxOutputTokens: 2048,
      },
      {
        id: 'gpt-4.1-nano',
        name: 'GPT-4.1 Nano',
        providerId: 'openai',
        maxContextTokens: 1000000,
        maxOutputTokens: 64000,
        supportsTemperature: true,
        supportsSystemPrompt: true,
        defaultTemperature: 0.7,
        defaultMaxOutputTokens: 2048,
      },
      {
        id: 'gpt-4.5-preview',
        name: 'GPT-4.5 Preview',
        providerId: 'openai',
        maxContextTokens: 128000,
        maxOutputTokens: 16384,
        supportsTemperature: true,
        supportsSystemPrompt: true,
        defaultTemperature: 0.7,
        defaultMaxOutputTokens: 2048,
      },
      {
        id: 'o4-mini',
        name: 'o4 Mini',
        providerId: 'openai',
        maxContextTokens: 1000000,
        maxOutputTokens: 64000,
        supportsTemperature: true,
        supportsSystemPrompt: true,
        defaultTemperature: 0.7,
        defaultMaxOutputTokens: 2048,
      },
      {
        id: 'o3-mini',
        name: 'o3 Mini',
        providerId: 'openai',
        maxContextTokens: 1000000,
        maxOutputTokens: 64000,
        supportsTemperature: true,
        supportsSystemPrompt: true,
        defaultTemperature: 0.7,
        defaultMaxOutputTokens: 2048,
      },
      {
        id: 'o3',
        name: 'o3',
        providerId: 'openai',
        maxContextTokens: 1000000,
        maxOutputTokens: 64000,
        supportsTemperature: true,
        supportsSystemPrompt: true,
        defaultTemperature: 0.7,
        defaultMaxOutputTokens: 2048,
      },
    ],
  },
  {
    id: 'azure',
    name: 'Azure OpenAI',
    models: [
      {
        id: 'azure-gpt-4o',
        name: 'GPT-4o (Azure - Deployment Name)',
        providerId: 'azure',
        maxContextTokens: 128000,
        maxOutputTokens: 16384,
        supportsTemperature: true,
        supportsSystemPrompt: true,
        defaultTemperature: 0.7,
        defaultMaxOutputTokens: 2048,
      },
      {
        id: 'azure-gpt-4o-mini',
        name: 'GPT-4o Mini (Azure - Deployment Name)',
        providerId: 'azure',
        maxContextTokens: 128000,
        maxOutputTokens: 16384,
        supportsTemperature: true,
        supportsSystemPrompt: true,
        defaultTemperature: 0.7,
        defaultMaxOutputTokens: 2048,
      },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic (SDK)',
    models: [
      {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        providerId: 'anthropic',
        maxContextTokens: 200000,
        maxOutputTokens: 4096,
        supportsTemperature: true,
        supportsSystemPrompt: true,
        defaultTemperature: 0.7,
        defaultMaxOutputTokens: 2048,
      },
      {
        id: 'claude-3-sonnet-20240229',
        name: 'Claude 3 Sonnet',
        providerId: 'anthropic',
        maxContextTokens: 200000,
        maxOutputTokens: 4096,
        supportsTemperature: true,
        supportsSystemPrompt: true,
        defaultTemperature: 0.7,
        defaultMaxOutputTokens: 2048,
      },
      {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        providerId: 'anthropic',
        maxContextTokens: 200000,
        maxOutputTokens: 4096,
        supportsTemperature: true,
        supportsSystemPrompt: true,
        defaultTemperature: 0.7,
        defaultMaxOutputTokens: 2048,
      },
    ],
  },
  {
    id: 'anthropic-bedrock',
    name: 'Anthropic (AWS Bedrock)',
    models: [
      {
        id: 'anthropic.claude-3-sonnet-20240229-v1:0',
        name: 'Claude 3 Sonnet (Bedrock)',
        providerId: 'anthropic-bedrock',
        maxContextTokens: 200000,
        maxOutputTokens: 4096,
        supportsTemperature: true,
        supportsSystemPrompt: true,
        defaultTemperature: 0.7,
        defaultMaxOutputTokens: 2048,
      },
      {
        id: 'anthropic.claude-3-haiku-20240307-v1:0',
        name: 'Claude 3 Haiku (Bedrock)',
        providerId: 'anthropic-bedrock',
        maxContextTokens: 200000,
        maxOutputTokens: 4096,
        supportsTemperature: true,
        supportsSystemPrompt: true,
        defaultTemperature: 0.7,
        defaultMaxOutputTokens: 2048,
      },
      {
        id: 'anthropic.claude-v2:1',
        name: 'Claude 2.1 (Bedrock)',
        providerId: 'anthropic-bedrock',
        maxContextTokens: 200000,
        maxOutputTokens: 4096,
        supportsTemperature: true,
        supportsSystemPrompt: true,
        defaultTemperature: 0.7,
        defaultMaxOutputTokens: 2048,
      },
    ],
  },
  {
    id: 'google',
    name: 'Google Gemini',
    models: [
      {
        id: 'gemini-1.5-pro-latest',
        name: 'Gemini 1.5 Pro',
        providerId: 'google',
        maxContextTokens: 1048576,
        maxOutputTokens: 8192,
        supportsTemperature: true,
        supportsSystemPrompt: true,
        defaultTemperature: 0.7,
        defaultMaxOutputTokens: 2048,
      },
      {
        id: 'gemini-1.5-flash-latest',
        name: 'Gemini 1.5 Flash',
        providerId: 'google',
        maxContextTokens: 1048576,
        maxOutputTokens: 8192,
        supportsTemperature: true,
        supportsSystemPrompt: true,
        defaultTemperature: 0.7,
        defaultMaxOutputTokens: 2048,
      },
      {
        id: 'gemini-1.0-pro',
        name: 'Gemini 1.0 Pro',
        providerId: 'google',
        maxContextTokens: 30720,
        maxOutputTokens: 2048,
        supportsTemperature: true,
        supportsSystemPrompt: true,
        defaultTemperature: 0.7,
        defaultMaxOutputTokens: 2048,
      },
    ],
  },
];

export function getProviderById(id: LlmProviderId): LlmProviderDetails | undefined {
  return llmProviderDetails.find(p => p.id === id);
}

export function getModelById(modelId: string): LlmModelDetails | undefined {
  for (const provider of llmProviderDetails) {
    const model = provider.models.find(m => m.id === modelId);
    if (model) return model;
  }
  return undefined;
}

export function getDefaultModelForProvider(providerId: LlmProviderId): LlmModelDetails | undefined {
  const provider = getProviderById(providerId);
  return provider?.models[0];
}

export function getDefaultProvider(): LlmProviderDetails {
    const google = getProviderById('google');
    if (google) return google;
    const openai = getProviderById('openai');
    if (openai) return openai;
    if (llmProviderDetails.length > 0) {
         return llmProviderDetails[0];
    } else {
        throw new Error("No LLM providers defined.");
    }
}

export function getDefaultSettings(): LlmSettings {
    let provider: LlmProviderDetails | undefined;
    let model: LlmModelDetails | undefined;

    try {
         provider = getDefaultProvider();
         model = getDefaultModelForProvider(provider.id);
    } catch (error) {
        console.error("Error getting default provider/model:", error);
        return {
            provider: 'openai',
            model: 'gpt-4o-mini',
            temperature: 0.7,
            maxTokens: 2048,
        }
    }

    if (!model) {
        console.error(`Default provider '${provider?.id}' has no default model or models list is empty. Falling back.`);
        for (const p of llmProviderDetails) {
            if (p.models.length > 0) {
                provider = p;
                model = p.models[0];
                break;
            }
        }
    }

    if (!provider || !model) {
         console.error("Could not find any model in any provider. Using absolute fallback.");
         return {
            provider: 'openai',
            model: 'gpt-4o-mini',
            temperature: 0.7,
            maxTokens: 2048,
        }
    }

    return {
        provider: provider.id,
        model: model.id,
        temperature: model.defaultTemperature ?? 0.7,
        maxTokens: model.defaultMaxOutputTokens ?? 2048,
    }
}
// Definition of supported LLM providers and models

export interface LlmProvider {
  id: string;
  name: string;
  models: LlmModel[];
}

export interface LlmModel {
  id: string;
  name: string;
  maxTokens: number;
  supportsTemperature: boolean;
}

export const llmProviders: LlmProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: [
      {
        id: 'gpt-4',
        name: 'GPT-4',
        maxTokens: 8192,
        supportsTemperature: true
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        maxTokens: 128000,
        supportsTemperature: true
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        maxTokens: 4096,
        supportsTemperature: true
      }
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: [
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        maxTokens: 200000,
        supportsTemperature: true
      },
      {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        maxTokens: 200000,
        supportsTemperature: true
      },
      {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        maxTokens: 200000,
        supportsTemperature: true
      }
    ]
  }
];

export function getProviderById(id: string): LlmProvider | undefined {
  return llmProviders.find(provider => provider.id === id);
}

export function getModelById(providerId: string, modelId: string): LlmModel | undefined {
  const provider = getProviderById(providerId);
  if (!provider) return undefined;
  return provider.models.find(model => model.id === modelId);
}
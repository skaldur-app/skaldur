// Common types used across the application

export interface SessionData {
  uuid: string;
  name: string;
  createdAt: number;
  messages: Message[];
  lockedSettings: LockedSettings;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface LockedSettings {
  interactionLlm: LlmSettings;
  destinationLlm: LlmSettings;
}

export interface LlmSettings {
  provider: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  baseUrl?: string;
  azureApiVersion?: string;
}

export interface ImprovementType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface ImprovementOptions {
  types: ImprovementType[];
  styles: string[];
}
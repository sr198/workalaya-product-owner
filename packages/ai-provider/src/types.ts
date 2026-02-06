export type AIRole = 'system' | 'user' | 'assistant';

export interface AIMessage {
  role: AIRole;
  content: string;
}

export interface AIRequestOptions {
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
}

export interface AIResponse {
  content: string;
  usage?: { promptTokens: number; completionTokens: number; totalTokens: number };
  finishReason: 'stop' | 'length' | 'error';
}

export type AIStreamEvent =
  | { type: 'text_delta'; content: string }
  | { type: 'usage'; usage: AIResponse['usage'] }
  | { type: 'done'; finishReason: AIResponse['finishReason'] }
  | { type: 'error'; error: string };

export interface AIProvider {
  chat(messages: AIMessage[], options?: AIRequestOptions): Promise<AIResponse>;
  stream(messages: AIMessage[], options?: AIRequestOptions): AsyncIterable<AIStreamEvent>;
}

export interface AIProviderConfig {
  provider: 'claude' | 'openai' | 'ollama';
  apiKey?: string;
  baseUrl?: string;
  model: string;
  defaultOptions?: AIRequestOptions;
}

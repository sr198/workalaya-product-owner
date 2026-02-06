import type { AIProvider, AIProviderConfig } from './types.js';

export function createAIProvider(config: AIProviderConfig): AIProvider {
  throw new Error(`AI provider "${config.provider}" not yet implemented. Coming in Phase 2.`);
}

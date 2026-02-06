# F7: AI Provider Shell

## Overview

Set up the `@workalaya/ai-provider` package with the core `AIProvider` interface, streaming event types, provider factory function, and package exports. No actual provider implementations yet — this establishes the abstraction layer that Phase 2 will build on.

## Dependencies

- **Requires:** F1 (Monorepo Setup), F2 (Shared Package)
- **Packages:** None (pure TypeScript interfaces and types)

## Acceptance Criteria

- [ ] `AIProvider` interface is defined with methods for chat completion and streaming
- [ ] `AIStreamEvent` types define the streaming event protocol
- [ ] `AIMessage` types define the message format (role, content)
- [ ] `createAIProvider()` factory function exists (throws "not implemented" for now)
- [ ] `AIProviderConfig` type defines provider configuration shape
- [ ] Prompt template pattern is established with a sample template function
- [ ] Package builds and typechecks cleanly
- [ ] Other packages can import all types from `@workalaya/ai-provider`

## Files to Create

| File                                         | Purpose                                                                      |
| -------------------------------------------- | ---------------------------------------------------------------------------- |
| `packages/ai-provider/src/types.ts`          | Core types: AIProvider interface, AIMessage, AIStreamEvent, AIProviderConfig |
| `packages/ai-provider/src/factory.ts`        | `createAIProvider()` factory function (stub)                                 |
| `packages/ai-provider/src/prompts/system.ts` | System prompt template for the PO role (example prompt template)             |
| `packages/ai-provider/src/prompts/index.ts`  | Barrel export for prompts                                                    |
| `packages/ai-provider/src/index.ts`          | Root barrel export                                                           |

## Files to Modify

| File                                | Change                                                    |
| ----------------------------------- | --------------------------------------------------------- |
| `packages/ai-provider/package.json` | Configure exports, ensure no external dependencies needed |

## Implementation Notes

### AIProvider Interface

```typescript
interface AIProvider {
  chat(messages: AIMessage[], options?: AIRequestOptions): Promise<AIResponse>;
  stream(messages: AIMessage[], options?: AIRequestOptions): AsyncIterable<AIStreamEvent>;
}
```

### Core Types

```typescript
type AIRole = 'system' | 'user' | 'assistant';

interface AIMessage {
  role: AIRole;
  content: string;
}

interface AIRequestOptions {
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
}

interface AIResponse {
  content: string;
  usage?: { promptTokens: number; completionTokens: number; totalTokens: number };
  finishReason: 'stop' | 'length' | 'error';
}

// Streaming events
type AIStreamEvent =
  | { type: 'text_delta'; content: string }
  | { type: 'usage'; usage: AIResponse['usage'] }
  | { type: 'done'; finishReason: AIResponse['finishReason'] }
  | { type: 'error'; error: string };
```

### AIProviderConfig

```typescript
interface AIProviderConfig {
  provider: 'claude' | 'openai' | 'ollama';
  apiKey?: string;
  baseUrl?: string;
  model: string;
  defaultOptions?: AIRequestOptions;
}
```

### Factory Function

```typescript
function createAIProvider(config: AIProviderConfig): AIProvider {
  // Phase 1: stub only — throws on use
  throw new Error(`AI provider "${config.provider}" not yet implemented. Coming in Phase 2.`);
}
```

### Prompt Template Pattern

- Each prompt is a function: `(input: StructuredInput) => AIMessage[]`
- The system prompt establishes the AI's Product Owner role and behavior
- Example: `buildSystemPrompt()` returns the system message for the PO persona
- Prompts live in `packages/ai-provider/src/prompts/` and are versioned alongside code

## Verification

1. `pnpm --filter @workalaya/ai-provider build` compiles without errors
2. `pnpm --filter @workalaya/ai-provider typecheck` passes
3. Import `{ AIProvider, AIMessage, createAIProvider }` from `@workalaya/ai-provider` — resolves correctly
4. `createAIProvider({ provider: 'claude', model: 'test' })` throws expected error
5. Type-check: a value typed as `AIProvider` requires both `chat` and `stream` methods

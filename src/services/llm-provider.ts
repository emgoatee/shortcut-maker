/**
 * LLM Provider abstraction layer
 * Supports multiple providers (Anthropic, OpenAI, etc.)
 */

export interface LLMMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface LLMRequest {
  messages: LLMMessage[];
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface LLMResponse {
  content: string;
  tokensUsed?: number;
  model?: string;
}

export interface LLMProvider {
  generate(request: LLMRequest): Promise<LLMResponse>;
}

/**
 * Anthropic Claude provider
 */
export class AnthropicProvider implements LLMProvider {
  private apiKey: string;
  private defaultModel: string;

  constructor(apiKey?: string, defaultModel = "claude-sonnet-4-20250514") {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || "";
    this.defaultModel = defaultModel;
  }

  async generate(request: LLMRequest): Promise<LLMResponse> {
    if (!this.apiKey) {
      throw new Error("Anthropic API key not configured");
    }

    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey: this.apiKey });

    // Convert system messages to system parameter
    const systemMessages = request.messages
      .filter((m) => m.role === "system")
      .map((m) => m.content)
      .join("\n\n");

    const nonSystemMessages = request.messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const response = await client.messages.create({
      model: request.model || this.defaultModel,
      max_tokens: request.maxTokens || 4096,
      temperature: request.temperature ?? 0.7,
      system: systemMessages || undefined,
      messages: nonSystemMessages,
    });

    const content = response.content[0];
    const textContent = content.type === "text" ? content.text : "";

    return {
      content: textContent,
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
      model: response.model,
    };
  }
}

/**
 * Mock provider for testing
 */
export class MockLLMProvider implements LLMProvider {
  async generate(_request: LLMRequest): Promise<LLMResponse> {
    return {
      content: JSON.stringify({
        title: "Test Shortcut",
        summary: "A test shortcut for development",
        steps: [
          {
            id: "test-action",
            name: "Test Action",
            searchHints: ["test"],
            parameters: [],
          },
        ],
      }),
      tokensUsed: 100,
      model: "mock",
    };
  }
}

/**
 * Factory function to get the appropriate provider
 */
export function getLLMProvider(): LLMProvider {
  const provider = process.env.LLM_PROVIDER || "anthropic";

  switch (provider) {
    case "anthropic":
      return new AnthropicProvider();
    case "mock":
      return new MockLLMProvider();
    default:
      throw new Error(`Unknown LLM provider: ${provider}`);
  }
}

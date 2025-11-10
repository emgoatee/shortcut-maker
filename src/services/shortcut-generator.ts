/**
 * Main service for generating Apple Shortcuts recipes
 * Implements a three-stage pipeline: Planner → Validator → Formatter
 */

import { ShortcutRecipe } from "@/types/shortcut";
import { getLLMProvider, LLMProvider } from "./llm-provider";
import { generatePipelinePrompts } from "./prompt-templates";

export interface GeneratorOptions {
  temperature?: number;
  skipValidation?: boolean;
  provider?: LLMProvider;
}

export interface GeneratorResult {
  recipe: ShortcutRecipe;
  metadata: {
    tokensUsed: number;
    generationTimeMs: number;
    stages: {
      planner: { tokensUsed: number; timeMs: number };
      validator?: { tokensUsed: number; timeMs: number };
      formatter: { tokensUsed: number; timeMs: number };
    };
  };
}

export class ShortcutGenerator {
  private provider: LLMProvider;
  private temperature: number;

  constructor(options: GeneratorOptions = {}) {
    this.provider = options.provider || getLLMProvider();
    this.temperature = options.temperature ?? 0.7;
  }

  /**
   * Generate a complete ShortcutRecipe from a user prompt
   */
  async generate(userPrompt: string, options: GeneratorOptions = {}): Promise<GeneratorResult> {
    const startTime = Date.now();
    const prompts = generatePipelinePrompts(userPrompt);
    const skipValidation = options.skipValidation ?? false;

    let totalTokens = 0;
    const stages: GeneratorResult["metadata"]["stages"] = {
      planner: { tokensUsed: 0, timeMs: 0 },
      formatter: { tokensUsed: 0, timeMs: 0 },
    };

    // Stage 1: Planner
    console.log("🔍 Stage 1: Planning...");
    const plannerStart = Date.now();
    const planResponse = await this.provider.generate({
      messages: [
        { role: "system", content: prompts.system },
        { role: "user", content: prompts.planner },
      ],
      temperature: this.temperature,
    });
    stages.planner.timeMs = Date.now() - plannerStart;
    stages.planner.tokensUsed = planResponse.tokensUsed || 0;
    totalTokens += stages.planner.tokensUsed;

    let planJson = this.extractJSON(planResponse.content);
    console.log("✅ Plan created");

    // Stage 2: Validator (optional)
    if (!skipValidation) {
      console.log("🔍 Stage 2: Validating...");
      const validatorStart = Date.now();
      const validationResponse = await this.provider.generate({
        messages: [
          { role: "system", content: prompts.system },
          { role: "user", content: prompts.validator(planJson) },
        ],
        temperature: 0.3, // Lower temperature for validation
      });
      const validatorTimeMs = Date.now() - validatorStart;
      const validatorTokens = validationResponse.tokensUsed || 0;
      totalTokens += validatorTokens;
      stages.validator = { tokensUsed: validatorTokens, timeMs: validatorTimeMs };

      const validation = JSON.parse(this.extractJSON(validationResponse.content));
      if (!validation.isValid && validation.revisedPlan) {
        planJson = JSON.stringify(validation.revisedPlan);
        console.log("⚠️  Plan revised based on validation");
      } else {
        console.log("✅ Plan validated");
      }
    }

    // Stage 3: Formatter
    console.log("🔍 Stage 3: Formatting...");
    const formatterStart = Date.now();
    const formatterResponse = await this.provider.generate({
      messages: [
        { role: "system", content: prompts.system },
        { role: "user", content: prompts.formatter(planJson) },
      ],
      temperature: 0.2, // Very low temperature for structured output
    });
    stages.formatter.timeMs = Date.now() - formatterStart;
    stages.formatter.tokensUsed = formatterResponse.tokensUsed || 0;
    totalTokens += stages.formatter.tokensUsed;

    const recipeJson = this.extractJSON(formatterResponse.content);
    const recipe: ShortcutRecipe = JSON.parse(recipeJson);
    console.log("✅ Recipe generated");

    const totalTime = Date.now() - startTime;

    return {
      recipe,
      metadata: {
        tokensUsed: totalTokens,
        generationTimeMs: totalTime,
        stages,
      },
    };
  }

  /**
   * Extract JSON from LLM response (handles markdown code blocks)
   */
  private extractJSON(response: string): string {
    // Remove markdown code blocks if present
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      return jsonMatch[1].trim();
    }

    // If no code block, try to find JSON object
    const objectMatch = response.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return objectMatch[0].trim();
    }

    return response.trim();
  }
}

/**
 * Convenience function for one-off generation
 */
export async function generateShortcutRecipe(
  userPrompt: string,
  options: GeneratorOptions = {}
): Promise<GeneratorResult> {
  const generator = new ShortcutGenerator(options);
  return generator.generate(userPrompt, options);
}

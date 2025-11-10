import { NextRequest, NextResponse } from "next/server";
import { generateShortcutRecipe } from "@/services/shortcut-generator";
import { GenerateRequest, GenerateResponse } from "@/types/shortcut";

/**
 * POST /api/generate
 * Generate a ShortcutRecipe from a user prompt
 */
export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();

    if (!body.userPrompt || body.userPrompt.trim().length === 0) {
      return NextResponse.json(
        { error: "userPrompt is required and cannot be empty" },
        { status: 400 }
      );
    }

    if (body.userPrompt.length > 2000) {
      return NextResponse.json(
        { error: "userPrompt must be less than 2000 characters" },
        { status: 400 }
      );
    }

    console.log(`🚀 Generating recipe for: "${body.userPrompt.substring(0, 50)}..."`);

    const result = await generateShortcutRecipe(body.userPrompt, {
      temperature: body.temperature,
    });

    const response: GenerateResponse = {
      recipe: result.recipe,
      metadata: {
        tokensUsed: result.metadata.tokensUsed,
        generationTime: result.metadata.generationTimeMs,
      },
    };

    console.log(`✅ Recipe generated in ${result.metadata.generationTimeMs}ms`);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error generating recipe:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    // Check for specific error types
    if (errorMessage.includes("API key")) {
      return NextResponse.json(
        { error: "LLM provider not configured. Please set ANTHROPIC_API_KEY environment variable." },
        { status: 503 }
      );
    }

    if (errorMessage.includes("rate limit")) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate recipe", details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * GET /api/generate
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "shortcut-generator",
    version: "1.0.0",
  });
}

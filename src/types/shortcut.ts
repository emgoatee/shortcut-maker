/**
 * Core data model for Apple Shortcuts recipes
 */

export type ParameterType =
  | "string"
  | "number"
  | "boolean"
  | "enum"
  | "list"
  | "dict"
  | "date"
  | "time";

export type ShortcutParameter = {
  key: string; // e.g., "Count", "Destination", "AskEachTime"
  type: ParameterType;
  value: string | number | boolean | string[] | Record<string, unknown>; // normalized value
  notes?: string; // hints like "tap 'Ask Each Time'"
};

export type ShortcutAction = {
  id: string; // stable slug, e.g., "photos-get-latest"
  name: string; // UI label, e.g., "Get Latest Photos"
  searchHints: string[]; // keywords to find the action in Shortcuts
  parameters: ShortcutParameter[];
  platformConstraints?: string[]; // e.g., ["iOS", "macOS"]
  warnings?: string[]; // known pitfalls
};

export type ShortcutRecipe = {
  title: string;
  summary: string;
  prerequisites?: string[]; // e.g., "Allow Photos access"
  steps: ShortcutAction[]; // ordered actions
  postSetupTests?: string[]; // sanity checks user can run
};

export type GenerateRequest = {
  userPrompt: string;
  temperature?: number;
};

export type GenerateResponse = {
  recipe: ShortcutRecipe;
  metadata?: {
    tokensUsed?: number;
    generationTime?: number;
  };
};

export type ExamplePrompt = {
  id: string;
  title: string;
  prompt: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
};

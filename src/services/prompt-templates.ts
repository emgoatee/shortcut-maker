/**
 * Prompt templates for the three-stage pipeline:
 * 1. Planner - Analyzes intent and plans the shortcut structure
 * 2. Validator - Validates the plan against Apple Shortcuts constraints
 * 3. Formatter - Formats into the final ShortcutRecipe JSON
 */

export const SYSTEM_PROMPT = `You are an expert in Apple Shortcuts for iOS, iPadOS, and macOS. You help users build Shortcuts by providing clear, step-by-step instructions based on their natural language requests.

Your knowledge includes:
- All standard Shortcuts actions and their parameters
- Platform-specific constraints (iOS vs macOS)
- Privacy/permissions requirements
- Best practices and common pitfalls
- How to search for actions in the Shortcuts app UI

You ONLY provide guidance for manually building shortcuts in the Shortcuts app. You do NOT create .shortcut files or iCloud links.`;

export const PLANNER_PROMPT = `Analyze the user's request and create a structured plan for building an Apple Shortcut.

User Request: {{USER_PROMPT}}

Output a JSON object with this structure:
{
  "intent": "What the user wants to accomplish",
  "features": ["List of key features/capabilities needed"],
  "dataFlow": "Description of how data flows through the shortcut",
  "requiredActions": [
    {
      "actionName": "Human-readable action name",
      "purpose": "Why this action is needed",
      "searchTerms": ["keywords to find it in Shortcuts"],
      "platform": "iOS, macOS, or both"
    }
  ],
  "permissions": ["Required permissions like Photos, Contacts, etc."],
  "edgeCases": ["Potential issues or limitations"]
}

Be specific and comprehensive. Only suggest actions that exist in Apple Shortcuts.`;

export const VALIDATOR_PROMPT = `Review the following Shortcut plan and validate it against Apple Shortcuts constraints.

Plan: {{PLAN}}

Check for:
1. Do all mentioned actions actually exist in Apple Shortcuts?
2. Are the action names accurate as they appear in the UI?
3. Are platform constraints correct? (some actions only work on iOS or macOS)
4. Are there any missing permissions or prerequisites?
5. Is the sequence logical and will it work?
6. Are there better or simpler ways to achieve the goal?

Output a JSON object:
{
  "isValid": true/false,
  "issues": ["List of problems found, if any"],
  "suggestions": ["Improvements or alternatives"],
  "revisedPlan": "If changes needed, provide corrected plan JSON, else null"
}`;

export const FORMATTER_PROMPT = `Convert the validated plan into a detailed ShortcutRecipe JSON that provides step-by-step build instructions.

Validated Plan: {{VALIDATED_PLAN}}

Output a JSON object matching this TypeScript interface:

{
  "title": "Descriptive title for the Shortcut",
  "summary": "1-2 sentence explanation of what it does",
  "prerequisites": ["Steps to prepare, like enabling permissions"],
  "steps": [
    {
      "id": "unique-slug-id",
      "name": "Exact action name as it appears in Shortcuts",
      "searchHints": ["Keywords to search for this action"],
      "parameters": [
        {
          "key": "Parameter name (e.g., Count, Destination)",
          "type": "string|number|boolean|enum|list|dict|date|time",
          "value": "The value to set",
          "notes": "How to set it, e.g., 'Tap Count field, enter 10'"
        }
      ],
      "platformConstraints": ["iOS", "macOS"] or just one,
      "warnings": ["Optional: known issues or gotchas"]
    }
  ],
  "postSetupTests": ["How to test the Shortcut works"]
}

Be extremely detailed in the parameters and notes. Users should be able to follow this without any prior Shortcuts knowledge.

IMPORTANT: Output ONLY valid JSON, no markdown code blocks or extra text.`;

/**
 * Replace template variables with actual values
 */
export function fillTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
  }
  return result;
}

/**
 * Generate prompts for the three-stage pipeline
 */
export function generatePipelinePrompts(userPrompt: string) {
  return {
    system: SYSTEM_PROMPT,
    planner: fillTemplate(PLANNER_PROMPT, { USER_PROMPT: userPrompt }),
    validator: (planJson: string) =>
      fillTemplate(VALIDATOR_PROMPT, { PLAN: planJson }),
    formatter: (validatedPlanJson: string) =>
      fillTemplate(FORMATTER_PROMPT, { VALIDATED_PLAN: validatedPlanJson }),
  };
}

import { ExamplePrompt } from "@/types/shortcut";

/**
 * Curated example prompts for users to try
 */
export const EXAMPLE_PROMPTS: ExamplePrompt[] = [
  {
    id: "photos-dropbox-backup",
    title: "Photo Backup to Dropbox",
    prompt: "Save the latest 10 photos from my camera roll to Dropbox in a folder called 'iPhone Backup' every day at 7pm",
    category: "Automation",
    difficulty: "intermediate",
  },
  {
    id: "water-intake-logger",
    title: "Water Intake Logger",
    prompt: "Log water intake to Health app by asking me how many ounces I drank, then record it",
    category: "Health",
    difficulty: "beginner",
  },
  {
    id: "clipboard-to-notes",
    title: "Clipboard to Notes",
    prompt: "Append whatever is in my clipboard to a note called 'Quick Captures' with a timestamp",
    category: "Productivity",
    difficulty: "beginner",
  },
  {
    id: "morning-briefing",
    title: "Morning Briefing",
    prompt: "Give me a morning briefing with today's weather, calendar events, and latest news headlines, then speak it aloud",
    category: "Information",
    difficulty: "advanced",
  },
  {
    id: "wifi-qr-code",
    title: "WiFi QR Code Generator",
    prompt: "Create a QR code for my home WiFi network so guests can easily connect",
    category: "Utilities",
    difficulty: "beginner",
  },
  {
    id: "expense-tracker",
    title: "Quick Expense Tracker",
    prompt: "Ask me for an expense amount and category, then add it to a Numbers spreadsheet called 'Expenses 2024'",
    category: "Finance",
    difficulty: "intermediate",
  },
  {
    id: "image-resizer",
    title: "Batch Image Resizer",
    prompt: "Resize multiple photos to 1920x1080 and save them to Files app in a folder called 'Resized'",
    category: "Media",
    difficulty: "intermediate",
  },
  {
    id: "work-mode-toggle",
    title: "Work Mode Toggle",
    prompt: "Toggle work mode: enable Do Not Disturb, set volume to 50%, open Slack and Calendar apps",
    category: "Focus",
    difficulty: "advanced",
  },
];

/**
 * Get example prompts by category
 */
export function getPromptsByCategory(category: string): ExamplePrompt[] {
  return EXAMPLE_PROMPTS.filter((prompt) => prompt.category === category);
}

/**
 * Get example prompts by difficulty
 */
export function getPromptsByDifficulty(
  difficulty: "beginner" | "intermediate" | "advanced"
): ExamplePrompt[] {
  return EXAMPLE_PROMPTS.filter((prompt) => prompt.difficulty === difficulty);
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  return Array.from(new Set(EXAMPLE_PROMPTS.map((prompt) => prompt.category)));
}

/**
 * Get a random example prompt
 */
export function getRandomPrompt(): ExamplePrompt {
  return EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)];
}

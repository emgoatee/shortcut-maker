# Shortcut Maker 🔧

An AI-powered web application that generates step-by-step instructions for building Apple Shortcuts manually in the Shortcuts app (iOS/iPadOS/macOS).

## Features

- 🤖 **AI-Powered Generation**: Uses Claude AI to analyze your request and generate detailed instructions
- 📝 **Step-by-Step Guides**: Clear, numbered instructions with action names, search terms, and parameters
- 🔍 **Search Hints**: Learn exactly what to search for when adding each action
- ⚡ **Best Practices**: Includes warnings about permissions, platform limitations, and common pitfalls
- 📋 **Copy & Download**: One-click copy steps, copy JSON recipe, or download as Markdown
- 🎨 **Example Library**: Browse curated examples across multiple categories
- 🌙 **Dark Mode**: Automatic dark mode support
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: Anthropic Claude (via SDK)
- **State**: React Server Components + Client Components
- **Testing**: Vitest (unit), Playwright (e2e)
- **Tooling**: ESLint, Prettier, Husky (pre-commit hooks)

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- An API key from either:
  - OpenAI ([get one here](https://platform.openai.com/api-keys)) - Recommended
  - Anthropic ([get one here](https://console.anthropic.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shortcut-maker.git
   cd shortcut-maker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your API key:

   **For OpenAI (Recommended):**
   ```
   LLM_PROVIDER=openai
   OPENAI_API_KEY=your-api-key-here
   ```

   **Or for Anthropic:**
   ```
   LLM_PROVIDER=anthropic
   ANTHROPIC_API_KEY=your-api-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Enter a prompt**: Describe what you want your Shortcut to do in natural language
2. **Generate**: Click "Generate Build Instructions" or press Cmd/Ctrl+Enter
3. **Follow the guide**: Use the step-by-step instructions to build your Shortcut manually
4. **Copy or download**: Save the instructions or JSON recipe for later

### Example Prompts

- "Save the latest 10 photos to Dropbox in a folder called 'iPhone Backup'"
- "Log water intake to Health app by asking me how many ounces I drank"
- "Append clipboard to Notes with timestamp"
- "Give me a morning briefing with weather, calendar, and news"

## Project Structure

```
shortcut-maker/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── api/generate/    # API route for recipe generation
│   │   ├── about/           # About page
│   │   ├── examples/        # Examples page
│   │   ├── results/         # Results page
│   │   ├── page.tsx         # Home page
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   ├── lib/                 # Utility functions
│   ├── services/            # Business logic
│   │   ├── llm-provider.ts       # LLM abstraction layer
│   │   ├── prompt-templates.ts   # Prompt templates
│   │   └── shortcut-generator.ts # Main generation logic
│   └── types/               # TypeScript types
├── tests/
│   ├── e2e/                 # Playwright tests
│   └── unit/                # Vitest tests
├── public/                  # Static assets
└── [config files]
```

## Architecture

### Three-Stage Generation Pipeline

1. **Planner**: Analyzes user intent and plans the shortcut structure
2. **Validator**: Validates the plan against Apple Shortcuts constraints
3. **Formatter**: Formats the validated plan into a ShortcutRecipe JSON

### Data Model

The core data structure is the `ShortcutRecipe`:

```typescript
type ShortcutRecipe = {
  title: string;
  summary: string;
  prerequisites?: string[];
  steps: ShortcutAction[];
  postSetupTests?: string[];
};
```

Each `ShortcutAction` includes:
- Action name (as it appears in Shortcuts)
- Search hints (keywords to find it)
- Parameters with values and setup notes
- Platform constraints
- Warnings

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run Vitest unit tests
- `npm run test:e2e` - Run Playwright e2e tests

### Adding New Examples

Edit `src/lib/example-prompts.ts`:

```typescript
{
  id: "unique-id",
  title: "Example Title",
  prompt: "Description of what the shortcut should do",
  category: "Category",
  difficulty: "beginner" | "intermediate" | "advanced",
}
```

### Customizing Prompts

Modify the prompt templates in `src/services/prompt-templates.ts` to adjust how the AI generates recipes.

## Testing

### Unit Tests

```bash
npm test
```

Run unit tests for utility functions and services.

### E2E Tests

```bash
npm run test:e2e
```

Run end-to-end tests with Playwright. The dev server starts automatically.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `LLM_PROVIDER=openai` (or `anthropic`)
   - `OPENAI_API_KEY=your-key` (or `ANTHROPIC_API_KEY`)
4. Deploy

### Docker

```bash
docker build -t shortcut-maker .
# For OpenAI:
docker run -p 3000:3000 -e LLM_PROVIDER=openai -e OPENAI_API_KEY=your-key shortcut-maker
# For Anthropic:
docker run -p 3000:3000 -e LLM_PROVIDER=anthropic -e ANTHROPIC_API_KEY=your-key shortcut-maker
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `LLM_PROVIDER` | No | `anthropic` | LLM provider: `openai`, `anthropic`, or `mock` |
| `OPENAI_API_KEY` | Yes* | - | OpenAI API key (required if using OpenAI) |
| `OPENAI_MODEL` | No | `gpt-4o` | OpenAI model: `gpt-4o`, `gpt-4-turbo`, `gpt-3.5-turbo` |
| `ANTHROPIC_API_KEY` | Yes* | - | Anthropic API key (required if using Anthropic) |
| `ANTHROPIC_MODEL` | No | `claude-sonnet-4-20250514` | Claude model to use |

\* API key required based on chosen provider. Not needed if using `LLM_PROVIDER=mock` for testing

## Limitations

- **Manual Building Only**: Generates instructions for manual building, not .shortcut files
- **AI Accuracy**: AI-generated guides may occasionally contain errors
- **Platform Differences**: Some actions work only on iOS or macOS
- **Third-Party Apps**: Shortcuts for third-party apps require those apps to be installed

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [Anthropic Claude](https://www.anthropic.com/)
- Inspired by the Apple Shortcuts community

## Support

- 📖 [Documentation](https://github.com/yourusername/shortcut-maker/wiki)
- 🐛 [Report Issues](https://github.com/yourusername/shortcut-maker/issues)
- 💬 [Discussions](https://github.com/yourusername/shortcut-maker/discussions)

---

Made with ❤️ for the Apple Shortcuts community

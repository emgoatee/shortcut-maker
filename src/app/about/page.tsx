import Navigation from "@/components/Navigation";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow dark:bg-gray-800">
          <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
            About Shortcut Maker
          </h1>

          <div className="prose prose-gray max-w-none dark:prose-invert">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                What is Shortcut Maker?
              </h2>
              <p className="mt-3 text-gray-700 dark:text-gray-300">
                Shortcut Maker is an AI-powered tool that helps you build Apple Shortcuts by
                providing detailed, step-by-step instructions. Simply describe what you want your
                Shortcut to do in plain English, and we&apos;ll generate a comprehensive guide
                including action names, search terms, parameters, and best practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                How It Works
              </h2>
              <ol className="mt-3 list-decimal space-y-2 pl-6 text-gray-700 dark:text-gray-300">
                <li>
                  <strong>Describe Your Need:</strong> Tell us what you want your Shortcut to
                  accomplish in natural language
                </li>
                <li>
                  <strong>AI Analysis:</strong> Our AI analyzes your request and identifies the
                  necessary Shortcuts actions
                </li>
                <li>
                  <strong>Step-by-Step Guide:</strong> We generate detailed instructions with action
                  names, parameters, and configuration tips
                </li>
                <li>
                  <strong>Build Manually:</strong> Follow the guide to build your Shortcut in the
                  Shortcuts app
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Apple Shortcuts Basics
              </h2>
              <p className="mt-3 text-gray-700 dark:text-gray-300">
                Apple Shortcuts is a powerful automation tool available on iOS, iPadOS, and macOS.
                It allows you to create custom workflows by combining actions - small tasks like
                getting photos, sending messages, or controlling smart home devices.
              </p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Key Concepts:
                </h3>
                <ul className="mt-2 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
                  <li>
                    <strong>Actions:</strong> Building blocks that perform specific tasks
                  </li>
                  <li>
                    <strong>Parameters:</strong> Settings that configure how an action works
                  </li>
                  <li>
                    <strong>Variables:</strong> Data that flows between actions
                  </li>
                  <li>
                    <strong>Triggers:</strong> Ways to run shortcuts (button tap, time, location,
                    etc.)
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Limitations</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
                <li>
                  <strong>Manual Building Only:</strong> We provide instructions for manually
                  building shortcuts. We don&apos;t create .shortcut files or iCloud links.
                </li>
                <li>
                  <strong>Platform Differences:</strong> Some actions work only on iOS or only on
                  macOS. We indicate these constraints in our guides.
                </li>
                <li>
                  <strong>Permissions:</strong> Many shortcuts require permissions (Photos, Contacts,
                  Location, etc.). You&apos;ll need to grant these when prompted.
                </li>
                <li>
                  <strong>Third-Party Apps:</strong> Shortcuts that interact with third-party apps
                  require those apps to be installed and may have limitations.
                </li>
                <li>
                  <strong>AI Accuracy:</strong> While we strive for accuracy, AI-generated guides may
                  occasionally contain errors. Always test your shortcuts thoroughly.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Privacy & Data
              </h2>
              <p className="mt-3 text-gray-700 dark:text-gray-300">
                Your privacy is important to us:
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
                <li>We don&apos;t store your prompts or generated recipes</li>
                <li>All processing is ephemeral (session-based only)</li>
                <li>We don&apos;t collect personal information</li>
                <li>No tracking or analytics beyond basic server logs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Tips for Best Results
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
                <li>Be specific about what you want your Shortcut to do</li>
                <li>Mention any apps you want to integrate with</li>
                <li>Specify timing (e.g., &quot;daily at 7pm&quot;) if relevant</li>
                <li>Indicate your platform (iOS, iPadOS, or macOS) if it matters</li>
                <li>Start simple and add complexity as you learn</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Technology Stack
              </h2>
              <p className="mt-3 text-gray-700 dark:text-gray-300">
                Shortcut Maker is built with:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300">
                <li>Next.js 14 (App Router)</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Anthropic Claude AI</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Resources</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
                <li>
                  <a
                    href="https://support.apple.com/guide/shortcuts/welcome/ios"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Apple Shortcuts User Guide
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/shortcuts/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    r/shortcuts Community
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.macstories.net/tag/shortcuts/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    MacStories Shortcuts Coverage
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navigation from "@/components/Navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { EXAMPLE_PROMPTS } from "@/lib/example-prompts";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load prompt from URL query parameter
  useEffect(() => {
    const urlPrompt = searchParams.get("prompt");
    if (urlPrompt) {
      setPrompt(decodeURIComponent(urlPrompt));
    }
  }, [searchParams]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a description of the shortcut you want to build");
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate recipe");
      }

      const data = await response.json();

      // Store recipe in sessionStorage and navigate to results
      sessionStorage.setItem("currentRecipe", JSON.stringify(data));
      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsGenerating(false);
    }
  };

  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Build Apple Shortcuts
            <br />
            <span className="text-blue-600 dark:text-blue-400">Step by Step</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Describe what you want your Shortcut to do, and get detailed instructions for building
            it manually in the Shortcuts app. Complete with action names, parameters, and tips.
          </p>
        </div>

        {/* Input Section */}
        <div className="mt-12">
          <div className="rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <label
              htmlFor="prompt"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Describe your Shortcut
            </label>
            <textarea
              id="prompt"
              rows={4}
              className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 sm:text-sm"
              placeholder="Example: Save the latest 10 photos to Dropbox in a folder called 'iPhone Backup'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Press Cmd+Enter (Mac) or Ctrl+Enter (Windows) to generate
            </p>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Generating Recipe...</span>
                  </span>
                ) : (
                  "Generate Build Instructions"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Example Prompts */}
        <div className="mt-12">
          <h2 className="text-center text-xl font-semibold text-gray-900 dark:text-white">
            Try an Example
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {EXAMPLE_PROMPTS.slice(0, 6).map((example) => (
              <button
                key={example.id}
                onClick={() => handleExampleClick(example.prompt)}
                disabled={isGenerating}
                className="rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-blue-500 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-400"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{example.title}</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {example.prompt}
                    </p>
                  </div>
                  <span className="ml-2 rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {example.difficulty}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-6 text-center">
            <a
              href="/examples"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View all examples →
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-3xl">📝</div>
            <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
              Step-by-Step Guide
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Get detailed instructions with action names, search terms, and parameters
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl">🔍</div>
            <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">Search Hints</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Learn exactly what to search for when adding each action
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl">⚡</div>
            <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">Best Practices</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Includes warnings about permissions, platform limitations, and common pitfalls
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><LoadingSpinner /></div>}>
      <HomeContent />
    </Suspense>
  );
}

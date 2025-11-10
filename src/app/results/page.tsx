"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import { ShortcutRecipe } from "@/types/shortcut";
import { copyToClipboard, downloadAsFile, formatNumber, formatTimestamp } from "@/lib/utils";
import { formatRecipeAsMarkdown, formatRecipeAsText } from "@/lib/recipe-formatter";

interface RecipeMetadata {
  tokensUsed?: number;
  generationTime?: number;
}

export default function ResultsPage() {
  const router = useRouter();
  const [recipe, setRecipe] = useState<ShortcutRecipe | null>(null);
  const [metadata, setMetadata] = useState<RecipeMetadata | null>(null);
  const [showJSON, setShowJSON] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("currentRecipe");
    if (!data) {
      router.push("/");
      return;
    }

    const parsed = JSON.parse(data);
    setRecipe(parsed.recipe);
    setMetadata(parsed.metadata);
  }, [router]);

  const handleCopy = async (content: string, type: string) => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!recipe) return;
    const markdown = formatRecipeAsMarkdown(recipe);
    const filename = `${recipe.title.toLowerCase().replace(/\s+/g, "-")}.md`;
    downloadAsFile(markdown, filename, "text/markdown");
  };

  const handleDownloadJSON = () => {
    if (!recipe) return;
    const json = JSON.stringify(recipe, null, 2);
    const filename = `${recipe.title.toLowerCase().replace(/\s+/g, "-")}.json`;
    downloadAsFile(json, filename, "application/json");
  };

  if (!recipe) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-2xl">Loading...</div>
        </div>
      </div>
    );
  }

  const recipeJSON = JSON.stringify(recipe, null, 2);
  const recipeText = formatRecipeAsText(recipe);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/")}
            className="mb-4 text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{recipe.title}</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">{recipe.summary}</p>

          {metadata && (
            <div className="mt-4 flex space-x-6 text-sm text-gray-500 dark:text-gray-400">
              {metadata.generationTime && <span>⏱️ {formatTimestamp(metadata.generationTime)}</span>}
              {metadata.tokensUsed && <span>🎯 {formatNumber(metadata.tokensUsed)} tokens</span>}
              <span>📝 {recipe.steps.length} actions</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => handleCopy(recipeText, "steps")}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500"
          >
            {copied === "steps" ? "✓ Copied!" : "📋 Copy Steps"}
          </button>
          <button
            onClick={() => handleCopy(recipeJSON, "json")}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-500"
          >
            {copied === "json" ? "✓ Copied!" : "📄 Copy JSON"}
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 dark:bg-purple-500"
          >
            ⬇️ Download Markdown
          </button>
          <button
            onClick={handleDownloadJSON}
            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-500"
          >
            ⬇️ Download JSON
          </button>
        </div>

        {/* Prerequisites */}
        {recipe.prerequisites && recipe.prerequisites.length > 0 && (
          <div className="mb-8 rounded-lg bg-yellow-50 p-6 dark:bg-yellow-900/20">
            <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
              ⚠️ Prerequisites
            </h2>
            <ul className="list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
              {recipe.prerequisites.map((prereq, index) => (
                <li key={index}>{prereq}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Step-by-Step Instructions */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            📝 Step-by-Step Build Instructions
          </h2>

          <div className="mb-6 rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Getting Started:</strong>
            </p>
            <ol className="mt-2 list-decimal space-y-1 pl-6 text-sm text-blue-700 dark:text-blue-300">
              <li>Open the <strong>Shortcuts</strong> app on your device</li>
              <li>Tap <strong>+</strong> (or click <strong>New Shortcut</strong> on Mac)</li>
              <li>Follow the steps below to add each action</li>
            </ol>
          </div>

          <div className="space-y-6">
            {recipe.steps.map((step, index) => (
              <div
                key={step.id}
                className="border-l-4 border-blue-500 bg-gray-50 p-4 dark:bg-gray-700"
              >
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Step {index + 1}: {step.name}
                </h3>

                {/* Search Hints */}
                {step.searchHints.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      🔍 How to find it:
                    </span>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      Search for &quot;{step.searchHints.join('&quot; or &quot;')}&quot;
                    </span>
                  </div>
                )}

                {/* Platform Constraints */}
                {step.platformConstraints && step.platformConstraints.length > 0 && (
                  <div className="mb-3">
                    <span className="rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-600 dark:text-gray-200">
                      {step.platformConstraints.join(", ")}
                    </span>
                  </div>
                )}

                {/* Parameters */}
                {step.parameters.length > 0 && (
                  <div className="mb-3">
                    <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      ⚙️ Parameters to configure:
                    </p>
                    <ul className="space-y-2 pl-4">
                      {step.parameters.map((param, pIndex) => (
                        <li key={pIndex} className="text-sm text-gray-600 dark:text-gray-400">
                          <strong className="text-gray-900 dark:text-white">{param.key}:</strong>{" "}
                          <code className="rounded bg-gray-200 px-1 py-0.5 dark:bg-gray-600">
                            {String(param.value)}
                          </code>
                          {param.notes && (
                            <p className="mt-1 italic text-gray-500 dark:text-gray-400">
                              {param.notes}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {step.warnings && step.warnings.length > 0 && (
                  <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      ⚠️ Warnings:
                    </p>
                    <ul className="mt-1 list-disc space-y-1 pl-6 text-sm text-red-700 dark:text-red-300">
                      {step.warnings.map((warning, wIndex) => (
                        <li key={wIndex}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Post-Setup Tests */}
        {recipe.postSetupTests && recipe.postSetupTests.length > 0 && (
          <div className="mb-8 rounded-lg bg-green-50 p-6 dark:bg-green-900/20">
            <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
              ✅ Testing Your Shortcut
            </h2>
            <ol className="list-decimal space-y-2 pl-6 text-gray-700 dark:text-gray-300">
              {recipe.postSetupTests.map((test, index) => (
                <li key={index}>{test}</li>
              ))}
            </ol>
          </div>
        )}

        {/* JSON Recipe */}
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              📦 Recipe JSON
            </h2>
            <button
              onClick={() => setShowJSON(!showJSON)}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {showJSON ? "Hide" : "Show"}
            </button>
          </div>

          {showJSON && (
            <pre className="overflow-x-auto rounded-md bg-gray-900 p-4 text-sm text-gray-100">
              <code>{recipeJSON}</code>
            </pre>
          )}
        </div>
      </main>
    </div>
  );
}

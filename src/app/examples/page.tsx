"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import { EXAMPLE_PROMPTS, getAllCategories } from "@/lib/example-prompts";

export default function ExamplesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const categories = ["All", ...getAllCategories()];

  const filteredExamples =
    selectedCategory === "All"
      ? EXAMPLE_PROMPTS
      : EXAMPLE_PROMPTS.filter((e) => e.category === selectedCategory);

  const handleTryExample = (prompt: string) => {
    // Navigate to home with the prompt
    router.push(`/?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Example Shortcuts</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Browse curated examples to get inspired. Click any example to try it.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white dark:bg-blue-500"
                  : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Examples Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExamples.map((example) => (
            <div
              key={example.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-3 flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {example.title}
                </h3>
                <span
                  className={`ml-2 rounded px-2 py-1 text-xs font-medium ${
                    example.difficulty === "beginner"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : example.difficulty === "intermediate"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  }`}
                >
                  {example.difficulty}
                </span>
              </div>

              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{example.prompt}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {example.category}
                </span>
                <button
                  onClick={() => handleTryExample(example.prompt)}
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Try This
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredExamples.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No examples found in this category.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

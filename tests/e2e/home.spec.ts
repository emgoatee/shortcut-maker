import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should load the home page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Shortcut Maker/);
    await expect(page.getByText("Build Apple Shortcuts")).toBeVisible();
  });

  test("should show example prompts", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Try an Example")).toBeVisible();
  });

  test("should allow typing in the prompt textarea", async ({ page }) => {
    await page.goto("/");
    const textarea = page.locator('textarea[id="prompt"]');
    await textarea.fill("Test prompt");
    await expect(textarea).toHaveValue("Test prompt");
  });

  test("should show error when generating without prompt", async ({ page }) => {
    await page.goto("/");
    const generateButton = page.getByRole("button", { name: /Generate Build Instructions/i });
    await generateButton.click();
    await expect(page.getByText(/Please enter a description/i)).toBeVisible();
  });

  test("should load prompt from URL query parameter", async ({ page }) => {
    await page.goto("/?prompt=Test%20from%20URL");
    const textarea = page.locator('textarea[id="prompt"]');
    await expect(textarea).toHaveValue("Test from URL");
  });
});

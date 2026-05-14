import { test, expect } from "@playwright/test";

test.describe("Alt+B bar jump keyboard shortcut", () => {
  test("Alt+B focuses the bar input", async ({ page }) => {
    await page.goto("/");

    const barInput = page.locator("#bar-field");

    await page.keyboard.press("Alt+b");

    await expect(barInput).toBeFocused();
  });

  test("typing bar number and Enter changes bar and returns focus", async ({
    page,
  }) => {
    await page.goto("/");

    const controls = page.locator("music-controls");
    const barInput = page.locator("#bar-field");

    await page.keyboard.press("Alt+b");
    await expect(barInput).toBeFocused();

    await barInput.fill("50");
    await barInput.press("Enter");

    await expect(controls).toHaveAttribute("bar", "50");
    await expect(barInput).not.toBeFocused();
  });

  test("focus returns to the previously focused element after Enter", async ({
    page,
  }) => {
    await page.goto("/");

    const playButton = page.locator("#playpausebutton");
    const barInput = page.locator("#bar-field");

    await playButton.focus();
    await expect(playButton).toBeFocused();

    await page.keyboard.press("Alt+b");
    await expect(barInput).toBeFocused();

    await barInput.fill("25");
    await barInput.press("Enter");

    await expect(playButton).toBeFocused();
    await expect(barInput).not.toBeFocused();
  });

  test("Alt+B works when a control input is focused", async ({ page }) => {
    await page.goto("/");

    const choirSelect = page.locator("#choir-select");
    const barInput = page.locator("#bar-field");

    await choirSelect.focus();
    await expect(choirSelect).toBeFocused();

    await page.keyboard.press("Alt+b");

    await expect(barInput).toBeFocused();
  });
});

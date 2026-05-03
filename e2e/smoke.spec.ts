import { test, expect } from "@playwright/test";

test.describe("Spem Player smoke tests", () => {
  test("page loads with all custom elements", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("music-score")).toBeVisible();
    await expect(page.locator("music-canvas")).toBeVisible();
    await expect(page.locator("music-controls")).toBeVisible();
    await expect(page.locator("music-canvas-watcher")).toBeAttached();
  });

  test("dark mode toggle switches theme", async ({ page }) => {
    await page.goto("/");

    const body = page.locator("body");
    const darkSwitch = page.locator("#darkswitch");

    await expect(body).not.toHaveClass(/light-theme/);

    await darkSwitch.click();

    await expect(body).toHaveClass(/light-theme/);

    await darkSwitch.click();

    await expect(body).not.toHaveClass(/light-theme/);
  });

  test("help panel opens and closes", async ({ page }) => {
    await page.goto("/");

    const help = page.locator("#help");
    const backdrop = page.locator("#backdrop");

    await expect(help).toBeHidden();
    await expect(backdrop).toBeHidden();

    await page.locator("#info").click();

    await expect(help).toBeVisible();
    await expect(backdrop).toBeVisible();

    await backdrop.click();

    await expect(help).toBeHidden();
    await expect(backdrop).toBeHidden();
  });

  test("URL parameters initialise state", async ({ page }) => {
    await page.goto("/?choir=3&part=2&bar=10");

    const controls = page.locator("music-controls");

    await expect(controls).toHaveAttribute("choir", "3");
    await expect(controls).toHaveAttribute("part", "2");
    await expect(controls).toHaveAttribute("bar", "10");
  });

  test("keyboard digits select choir", async ({ page }) => {
    await page.goto("/");

    const controls = page.locator("music-controls");
    await expect(controls).toHaveAttribute("choir", "0");

    await page.keyboard.press("4");

    await expect(controls).toHaveAttribute("choir", "3");
  });
});

import { expect, test } from "@playwright/test";

test("fresh visits ask to continue; refresh preserves the current detail and saves", async ({ page, context }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Try the S$45 demo" }).click();
  await page.getByRole("button", { name: "What moves you" }).click();
  await page.getByRole("button", { name: "Reveal my CultureLoop" }).click();
  await expect(page.locator(".event-card")).toHaveCount(0);
  await expect(page.locator(".event-node")).toHaveCount(3);
  await page.getByRole("button", { name: "Explore this", exact: true }).click();
  const title = await page.locator(".experience-title h1").innerText();
  await page.getByRole("button", { name: "Save to My Loop", exact: true }).click();
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
  await expect(page.getByRole("button", { name: "Saved to My Loop", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Play interpretation", exact: true })).toBeVisible();
  const fresh = await context.newPage();
  await fresh.goto("/");
  await expect(fresh.getByRole("heading", { level: 1 })).toContainText("Your next");
  await expect(fresh.getByRole("button", { name: "Continue my journey" })).toBeVisible();
  await fresh.getByRole("button", { name: "Continue my journey" }).click();
  await expect(fresh.locator(".credits-pill")).toContainText("S$45");
  await fresh.getByRole("button", { name: /My Loop/ }).first().click();
  await expect(fresh.locator(".saved-row")).toHaveCount(1);
  await fresh.getByRole("button", { name: "CultureLoop home" }).click();
  await fresh.getByRole("button", { name: "Start a new exploration" }).click();
  await expect(fresh.getByLabel("Your remaining Culture Pass credits")).toHaveValue("45");
  await fresh.getByRole("button", { name: "What moves you" }).click();
  await expect(fresh.locator(".taste-tile[aria-pressed=true]")).toHaveCount(0);
  await fresh.getByRole("button", { name: /My Loop/ }).first().click();
  await expect(fresh.locator(".saved-row")).toHaveCount(1);
  await fresh.close();
});

test("views are exclusive, selection is retained, and list mode survives refresh", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Try the S$45 demo" }).click();
  await page.getByRole("button", { name: "What moves you" }).click();
  await page.getByRole("button", { name: "Reveal my CultureLoop" }).click();
  await page.locator(".event-node").nth(1).click();
  const title = await page.locator(".connection-explanation h2").innerText();
  await page.getByRole("button", { name: "List view", exact: true }).click();
  await expect(page.locator(".event-card")).toHaveCount(3);
  await expect(page.locator(".constellation")).toHaveCount(0);
  await page.reload();
  await expect(page.locator(".event-card")).toHaveCount(3);
  await expect(page.getByRole("button", { name: "List view", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Constellation", exact: true }).click();
  await expect(page.locator(".event-card")).toHaveCount(0);
  // Reload may return to the first selection; switching views alone preserves it.
  await page.locator(".event-node").nth(1).click();
  await page.getByRole("button", { name: "List view", exact: true }).click();
  await page.getByRole("button", { name: "Constellation", exact: true }).click();
  await expect(page.locator(".connection-explanation h2")).toHaveText(title);
});

test("legacy persisted screens and moods preserve the profile without automatically resuming", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("cultureloop:ui:v1", JSON.stringify({ screen: "discover", profile: {
    balanceSGD: 46, interests: ["jazz"], mood: "energetic", savedEventIds: [], previousHighlights: [], selfReportedAttendance: [], nextOccasion: "solo"
  }})));
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Continue my journey" })).toBeVisible();
  await page.getByRole("button", { name: "Continue my journey" }).click();
  await expect(page.locator(".atmosphere-caption")).toContainText("Jazz");
  await expect(page.getByText("Set the feeling", { exact: false })).toHaveCount(0);
});

for (const width of [360, 1440]) test(`readable constellation labels and unclipped preview controls at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Try the S$45 demo" }).click();
  await page.getByRole("button", { name: "What moves you" }).click();
  await page.getByRole("button", { name: "Reveal my CultureLoop" }).click();
  await expect(page.locator(".cosmos-node-label strong").first()).toHaveCSS("font-size", width === 360 ? "13px" : "14px");
  await expect(page.locator(".connection-explanation p")).toHaveCSS("font-size", width === 360 ? "16px" : "17px");
  const panel = await page.locator(".connection-explanation").boundingBox();
  const button = await page.getByRole("button", { name: "Explore this", exact: true }).boundingBox();
  expect(button!.x).toBeGreaterThanOrEqual(panel!.x);
  expect(button!.x + button!.width).toBeLessThanOrEqual(panel!.x + panel!.width);
  await page.getByRole("button", { name: "List view", exact: true }).click();
  await expect(page.locator(".event-meta").first()).toHaveCSS("font-size", "14px");
  await expect(page.locator(".match-reason").first()).toHaveCSS("font-size", width === 360 ? "16px" : "17px");
});

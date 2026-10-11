import { test, expect } from "@playwright/test";
import { events } from "../src/data/events";
test("credit filter ranks the whole catalogue, not just prior top three", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Find my next chapter" }).click();
  await page.getByLabel("Your remaining Culture Pass credits").fill("18");
  await page.getByRole("button", { name: "What moves you" }).click();
  await page.locator(".taste-tile").filter({ hasText: "Gaming" }).click();
  await page.locator(".taste-tile").filter({ hasText: "Orchestral" }).click();
  await page.getByRole("button", { name: "Reveal my CultureLoop" }).click();
  await page.getByRole("button", { name: "List view", exact: true }).click();
  await page.getByRole("button", { name: "Within my credits" }).click();
  await expect(page.locator(".event-card").first()).toBeVisible();
  expect(await page.locator(".event-card").count()).toBeLessThanOrEqual(3);
  for (const card of await page.locator(".event-card").all()) {
    const title = await card.locator(".event-title").innerText();
    const item = events.find(event => event.title === title);
    expect(item?.startingPriceSGD).not.toBeNull();
    expect(item?.startingPriceSGD).toBeLessThanOrEqual(18);
  }
});
test("reset dialog confines keyboard focus and supports Escape", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Clear all data", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Keep my Loop" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("dialog").getByRole("button", { name: "Clear all data" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Keep my Loop" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("an untouched reload keeps first-time onboarding available", async ({
  page,
}) => {
  await page.goto("/");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Find my next chapter" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Find my next chapter" }).click();
  await expect(
    page.getByRole("heading", { name: "Start with what stayed." }),
  ).toBeVisible();
});

test("skip navigation retains the current route and transitions focus the new heading", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Try the S$45 demo" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await page.getByRole("button", { name: "What moves you" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await page.getByRole("button", { name: "Reveal my CultureLoop" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await page.getByRole("link", { name: "Skip to content" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  expect(new URL(page.url()).hash).toBe("#discover");
  await expect(page.locator(".event-node")).toHaveCount(3);
});

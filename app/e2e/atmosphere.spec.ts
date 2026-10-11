import { expect, test } from "@playwright/test";

test("atmosphere starts by gesture, survives preview navigation and shares safe mixer controls", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const NativeAudio = window.AudioContext;
    const contexts: AudioContext[] = [];
    window.AudioContext = class extends NativeAudio {
      constructor() {
        super();
        contexts.push(this);
      }
    };
    Object.defineProperty(window, "__cultureAudioStates", {
      get: () => contexts.map((context) => context.state),
    });
    const original = AnalyserNode.prototype.getFloatTimeDomainData;
    let peak = 0;
    AnalyserNode.prototype.getFloatTimeDomainData = function (values) {
      original.call(this, values);
      peak = Math.max(peak, ...values.map((sample) => Math.abs(sample)));
    };
    Object.defineProperty(window, "__cultureAudioPeak", { get: () => peak });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Try the S$45 demo" }).click();
  await page.getByRole("button", { name: "What moves you" }).click();
  await page.locator(".taste-tile").filter({ hasText: "Electronic" }).click();
  await page.getByRole("button", { name: "Reveal my CultureLoop" }).click();
  await expect(page.locator(".atmosphere-caption")).toContainText(
    "Electronic",
  );
  await expect(page.locator(".mood-picker")).toHaveCount(0);
  await expect(page.getByLabel("Atmosphere volume")).toHaveValue("75");
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { __cultureAudioStates: string[] })
          .__cultureAudioStates,
    ),
  ).toEqual([]);
  await page
    .getByRole("button", { name: "Play atmosphere", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Pause atmosphere", exact: true }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { __cultureAudioPeak: number })
            .__cultureAudioPeak,
      ),
    )
    .toBeGreaterThan(0.025);
  expect(await page.evaluate(() => (window as unknown as { __cultureAudioPeak: number }).__cultureAudioPeak)).toBeLessThan(0.85);
  await page.getByRole("button", { name: "Remix my tastes" }).click();
  await page.locator(".taste-tile").filter({ hasText: "Jazz" }).click();
  await expect(page.locator(".atmosphere-caption")).toContainText("Jazz");
  await page.getByRole("button", { name: "Reveal my CultureLoop" }).click();
  await expect(
    page.getByRole("button", { name: "Pause atmosphere", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "List view", exact: true }).click();
  await page
    .locator(".event-card")
    .first()
    .getByRole("button", { name: /Preview/ })
    .click();
  await expect(
    page.getByRole("button", { name: "Pause interpretation", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Interpretation volume").fill("0");
  await expect(page.getByLabel("Interpretation volume")).toHaveValue("0");
  await page
    .getByRole("button", { name: "Mute interpretation", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Unmute interpretation", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "A new sound", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Pause interpretation", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { __cultureAudioStates: string[] })
          .__cultureAudioStates,
    ),
  ).toEqual(["running"]);
  await page.getByRole("button", { name: "Back to your connections" }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Play atmosphere", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { __cultureAudioStates: string[] })
          .__cultureAudioStates,
    ),
  ).toEqual([]);
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("cultureloop:ui:v1") || "{}").profile
          .interests.includes("jazz"),
    ),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Play atmosphere", exact: true })
    .click();
  await page
    .getByRole("button", { name: /My Loop/ })
    .first()
    .click();
  await expect(
    page
      .locator(".journey-player")
      .getByRole("button", { name: "Pause atmosphere" }),
  ).toBeVisible();
  await page
    .locator(".journey-player")
    .getByRole("button", { name: "Mute atmosphere" })
    .click();
  await expect(
    page
      .locator(".journey-player")
      .getByRole("button", { name: "Unmute atmosphere" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "CultureLoop home", exact: true })
    .click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { __cultureAudioStates: string[] })
            .__cultureAudioStates,
      ),
    )
    .toEqual(["closed"]);
  await expect(page.locator(".journey-player")).toHaveCount(0);
});

test("audio-reactive meter respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Try the S$45 demo" }).click();
  await page.getByRole("button", { name: "What moves you" }).click();
  await page.getByRole("button", { name: "Reveal my CultureLoop" }).click();
  await page
    .getByRole("button", { name: "Play atmosphere", exact: true })
    .click();
  await expect(page.locator(".sound-meter.is-live")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Pause atmosphere", exact: true })
    .click();
});

test("nonmusic tastes use an honest neutral mix and retain readable mobile controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Find my next chapter" }).click();
  await page.getByRole("button", { name: "What moves you" }).click();
  await page.locator(".taste-tile").filter({ hasText: "Visual arts" }).click();
  await page.getByRole("button", { name: "Reveal my CultureLoop" }).click();
  const shell = page.locator(".app-shell");
  await expect(page.locator(".atmosphere-caption")).toContainText("CultureLoop ambient");
  await expect(page.locator(".atmosphere-caption strong")).toHaveCSS("font-size", "16px");
  await expect(shell).toHaveCSS("color", "rgb(244, 245, 237)");
  await expect(shell).toHaveCSS("transform", "none");
  await expect(shell).toHaveCSS("border-radius", "0px");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

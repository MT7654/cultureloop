import { test, expect } from "@playwright/test";
async function demo(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Try the S$45 demo" }).click();
  await page.getByRole("button", { name: "What moves you" }).click();
  await page.getByRole("button", { name: "Reveal my CultureLoop" }).click();
  await expect(page.locator(".event-node")).toHaveCount(3);
}
test("complete demo, actual relationship, safe official link, audio and save survives reload", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await demo(page);
  const second = page.locator(".event-node").nth(1);
  await second.click();
  const reason = await page.locator(".connection-explanation p").innerText();
  expect(reason.length).toBeGreaterThan(40);
  await page.getByRole("button", { name: "Explore this", exact: true }).click();
  await expect(page.locator(".your-bridge p")).toHaveText(reason);
  await expect(
    page.getByText(
      "Creative interpretation — not actual event audio or imagery.",
    ),
  ).toBeVisible();
  const official = page.getByRole("link", {
    name: "See official event listing",
  });
  await expect(official).toHaveAttribute("target", "_blank");
  await expect(official).toHaveAttribute("rel", "noopener noreferrer");
  expect(await official.getAttribute("href")).toMatch(/^https:\/\//);
  await page
    .getByRole("button", { name: "Play interpretation", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Pause interpretation", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Mute interpretation" }).click();
  await expect(
    page.getByRole("button", { name: "Unmute interpretation" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Pause interpretation", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Save to My Loop", exact: true })
    .click();
  await page.getByRole("button", { name: "See my Loop" }).click();
  await expect(page.locator(".saved-row")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".saved-row")).toHaveCount(1);
  await expect(
    page.getByText("Your manually entered balance is still"),
  ).toContainText("S$45");
  await page
    .locator(".saved-row")
    .getByRole("button", { name: /Remove/ })
    .click();
  await expect(
    page.getByText("Your next chapter is still unwritten."),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("blank interests offers surprise; maximum selection; back preserves story", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Find my next chapter" }).click();
  await page.getByLabel("Your remaining Culture Pass credits").fill("23");
  await page.getByRole("button", { name: "I haven't used it yet" }).click();
  await page.getByRole("button", { name: "What moves you" }).click();
  await expect(
    page.getByRole("button", { name: "Reveal my CultureLoop" }),
  ).toBeDisabled();
  for (const name of [
    "Indie & alternative",
    "Jazz",
    "Electronic",
    "Visual arts",
    "Literature",
  ])
    await page.locator(".taste-tile").filter({ hasText: name }).click();
  await page.locator(".taste-tile").filter({ hasText: "Gaming" }).click();
  await expect(page.locator(".taste-tile[aria-pressed=true]")).toHaveCount(5);
  await expect(page.getByRole("status")).toContainText("Five");
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(
    page.getByLabel("Your remaining Culture Pass credits"),
  ).toHaveValue("23");
  await page.getByRole("button", { name: "What moves you" }).click();
  await page.getByRole("button", { name: "Surprise me" }).click();
  await expect(page.locator(".event-node")).toHaveCount(3);
});
test("zero balance produces top-up, affordable empty recovery and list alternative", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Try the S$45 demo" }).click();
  await page.getByLabel("Your remaining Culture Pass credits").fill("0");
  await page.getByRole("button", { name: "What moves you" }).click();
  await page.getByRole("button", { name: "Reveal my CultureLoop" }).click();
  await page.getByRole("button", { name: "List view", exact: true }).click();
  await expect(page.locator(".card-price").first()).toContainText(
    "Estimated top-up",
  );
  await page.getByRole("button", { name: "Within my credits" }).click();
  await expect(page.getByText("A little beyond this balance.")).toBeVisible();
  await page
    .getByRole("button", { name: "Show connections with top-up estimates" })
    .click();
  await expect(page.locator(".event-card")).toHaveCount(3);
  await page.getByRole("button", { name: "Constellation", exact: true }).click();
  await expect(page.locator(".event-card")).toHaveCount(0);
  await expect(page.locator(".event-node")).toHaveCount(3);
  await page.getByRole("button", { name: "List view" }).click();
  await expect(page.locator(".constellation")).toHaveCount(0);
  await expect(page.locator(".event-card")).toHaveCount(3);
});
test("browser back restores screens and selections; reset cancellation preserves saved content", async ({
  page,
}) => {
  await demo(page);
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "What moves you?" }),
  ).toBeVisible();
  await expect(page.locator(".taste-tile[aria-pressed=true]")).toHaveCount(3);
  await page.getByRole("button", { name: "Clear all data", exact: true }).click();
  await page.getByRole("button", { name: "Keep my Loop" }).click();
  await expect(page.locator(".taste-tile[aria-pressed=true]")).toHaveCount(3);
  await page.getByRole("button", { name: "Clear all data", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Clear all data", exact: true })
    .click();
  await expect(page.getByRole("heading", { name: /Your next/ })).toBeVisible();
});
test("storage denied and audio unsupported have useful fallbacks", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Unavailable");
      },
    });
    Object.defineProperty(window, "AudioContext", { value: undefined });
    Object.defineProperty(window, "webkitAudioContext", { value: undefined });
  });
  await demo(page);
  await expect(page.getByText("Browser storage is unavailable.")).toBeVisible();
  await page.getByRole("button", { name: "List view", exact: true }).click();
  await page
    .locator(".event-card")
    .first()
    .getByRole("button", { name: /Preview/ })
    .click();
  await page
    .getByRole("button", { name: "Play interpretation", exact: true })
    .click();
  await expect(page.getByText("Sound is unavailable here.")).toBeVisible();
  await page
    .getByRole("button", { name: "Save to My Loop", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Saved to My Loop" }),
  ).toBeVisible();
});
test("expired catalogue and hostile stored profile recover honestly", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2029-01-01T12:00:00+08:00") });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Discover", exact: false })
    .first()
    .click();
  await expect(
    page.getByText("The catalogue is between chapters."),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Browse official Culture Pass" }),
  ).toBeVisible();
  await page.evaluate(() =>
    localStorage.setItem(
      "cultureloop:ui:v1",
      JSON.stringify({
        profile: {
          balanceSGD: -10,
          interests: ["<bad>"],
          savedEventIds: [3],
          previousTitle: "<script>alert(1)</script>",
          previousHighlights: 9,
        },
        screen: "dna",
      }),
    ),
  );
  await page.reload();
  await page.getByRole("button", { name: "Remix my tastes" }).click();
  await expect(page.locator(".selected-counter")).toContainText("0");
  await expect(
    page.getByRole("button", { name: "Reveal my CultureLoop" }),
  ).toBeDisabled();
});
for (const width of [360, 390, 768, 1280])
  test(`all key screens fit ${width}px with reduced motion`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.getByRole("button", { name: "Try the S$45 demo" }).click();
    await expect(
      page.getByLabel("Your remaining Culture Pass credits"),
    ).toHaveValue("45");
    await page.getByRole("button", { name: "What moves you" }).click();
    await expect(page.locator(".taste-tile")).toHaveCount(12);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("button", { name: "Reveal my CultureLoop" }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("button", { name: "List view", exact: true }).click();
    await page
      .locator(".event-card")
      .first()
      .getByRole("button", { name: /Preview/ })
      .click();
    await page
      .getByRole("button", { name: "Play interpretation", exact: true })
      .focus();
    await expect(
      page.getByRole("button", { name: "Play interpretation", exact: true }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("button", { name: "Pause interpretation", exact: true }),
    ).toBeVisible();
    expect(
      await page
        .locator(".art-orbit")
        .first()
        .evaluate((el) => getComputedStyle(el).animationName),
    ).toBe("none");
    await page
      .getByRole("button", { name: "Pause interpretation", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Save to My Loop", exact: true })
      .click();
    await page.getByRole("button", { name: "See my Loop" }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });

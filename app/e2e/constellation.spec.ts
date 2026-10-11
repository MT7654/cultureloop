import { test, expect, type Page } from "@playwright/test";
import { events } from "../src/data/events";
import { demoProfile } from "../src/domain/profile";
import { recommend } from "../src/domain/recommend";
async function discover(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Try the S$45 demo" }).click();
  await page.getByRole("button", { name: "What moves you" }).click();
  await page.getByRole("button", { name: "Reveal my CultureLoop" }).click();
  await expect(page.locator(".event-node")).toHaveCount(3);
}
test("true WebGL scene rotates, focuses, resets and explains the same recommendations", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await discover(page);
  const scene = page.getByTestId("culture-constellation");
  await expect(scene).toHaveAttribute("data-renderer", "webgl");
  const canvas = scene.locator("canvas");
  await expect(canvas).toHaveAttribute("data-camera-position", /.+/);
  await page.waitForTimeout(1000);
  const rest = await canvas.getAttribute("data-camera-position");
  await page.locator(".event-node").nth(1).focus();
  await page.keyboard.press("Enter");
  await expect
    .poll(() => canvas.getAttribute("data-camera-position"))
    .not.toBe(rest);
  await expect(page.locator(".event-node").nth(1)).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  const reason = await page.locator(".connection-explanation p").innerText();
  await canvas.scrollIntoViewIfNeeded();
  const bounds = await canvas.boundingBox();
  expect(bounds).toBeTruthy();
  await page.waitForTimeout(1200);
  const focused = await canvas.getAttribute("data-camera-position");
  await page.mouse.move(
    bounds!.x + bounds!.width * 0.2,
    bounds!.y + bounds!.height * 0.25,
  );
  await page.mouse.down();
  await page.mouse.move(
    bounds!.x + bounds!.width * 0.4,
    bounds!.y + bounds!.height * 0.32,
    { steps: 10 },
  );
  await page.mouse.up();
  await expect
    .poll(() => canvas.getAttribute("data-camera-position"))
    .not.toBe(focused);
  await page.getByRole("button", { name: "Reset constellation view" }).click();
  await expect
    .poll(async () =>
      Number(
        (await canvas.getAttribute("data-camera-position"))?.split(",")[0],
      ),
    )
    .toBeLessThan(0.03);
  await page.getByText("Read your connections", { exact: false }).click();
  await expect(page.locator(".cosmos-relations")).toContainText(
    "A musical on a date",
  );
  await page
    .locator(".cosmos-taste-controls")
    .getByRole("button", { name: "Indie & alternative", exact: true })
    .click();
  const connected = recommend(demoProfile,events,"2026-10-11").filter(item=>item.matchedTags.includes("indie"));
  expect(connected.length).toBeGreaterThan(0);
  await expect(page.locator(".cosmos-relations")).toContainText(connected[0].event.title);
  await page.getByRole("button", { name: "Explore this", exact: true }).click();
  await expect(page.locator(".your-bridge p")).toHaveText(reason);
  expect(errors).toEqual([]);
});
test("unsupported WebGL and a lost context preserve functional event access", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      kind: string,
      ...args: unknown[]
    ) {
      if (
        kind === "webgl" ||
        kind === "webgl2" ||
        kind === "experimental-webgl"
      )
        return null;
      return Reflect.apply(getContext, this, [kind, ...args]);
    } as typeof getContext;
  });
  await discover(page);
  await expect(page.getByTestId("culture-constellation")).toHaveAttribute(
    "data-renderer",
    "fallback",
  );
  await expect(page.getByText("Spatial view unavailable")).toBeVisible();
  await page.locator(".event-node").nth(2).click();
  const title = await page.locator(".connection-explanation h2").innerText();
  await page.getByRole("button", { name: "Explore this", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
});
test("context loss switches to fallback and reduced-motion camera settles without idle movement", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await discover(page);
  const scene = page.getByTestId("culture-constellation");
  await expect(scene).toHaveAttribute("data-renderer", "webgl");
  const canvas = scene.locator("canvas");
  await page.waitForTimeout(600);
  const initial = await canvas.getAttribute("data-camera-position");
  await page.waitForTimeout(400);
  expect(await canvas.getAttribute("data-camera-position")).toBe(initial);
  await page.locator(".event-node").nth(1).click();
  await expect
    .poll(() => canvas.getAttribute("data-camera-position"))
    .not.toBe(initial);
  await canvas.evaluate((el) =>
    el.dispatchEvent(new Event("webglcontextlost", { cancelable: true })),
  );
  await expect(scene).toHaveAttribute("data-renderer", "fallback");
  await page.locator(".event-node").nth(2).click();
  await expect(page.locator(".event-node").nth(2)).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

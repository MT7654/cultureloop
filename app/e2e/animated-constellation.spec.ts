import { test, expect, type Page } from "@playwright/test";

async function discover(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Try the S$45 demo" }).click();
  await page.getByRole("button", { name: "What moves you" }).click();
  await page.getByRole("button", { name: "Reveal my CultureLoop" }).click();
  await expect(page.locator(".event-node")).toHaveCount(3);
  await page.getByTestId("culture-constellation").scrollIntoViewIfNeeded();
}

test("silent movement, pause/resume and manual guided connections work", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await discover(page);
  const scene = page.getByTestId("culture-constellation");
  const canvas = scene.locator("canvas");
  await expect(scene).toHaveAttribute("data-motion", "running");
  await page.waitForTimeout(2200);
  const first = await canvas.getAttribute("data-node-positions");
  await expect
    .poll(() => canvas.getAttribute("data-node-positions"))
    .not.toBe(first);
  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  await page.waitForTimeout(150);
  const paused = await canvas.getAttribute("data-node-positions");
  await page.waitForTimeout(500);
  expect(await canvas.getAttribute("data-node-positions")).toBe(paused);
  await page
    .getByRole("button", { name: "Resume motion", exact: true })
    .click();
  await expect
    .poll(() => canvas.getAttribute("data-node-positions"))
    .not.toBe(paused);
  await page
    .getByRole("button", { name: "Follow a connection", exact: false })
    .click();
  await expect(page.locator(".cosmos-tour h3")).toHaveText(
    "Start with your story.",
  );
  await page
    .getByRole("button", { name: "Next connection", exact: false })
    .click();
  await expect(page.locator(".cosmos-tour h3")).toContainText("Follow");
  await page
    .getByRole("button", { name: "Next connection", exact: false })
    .click();
  await expect(page.locator(".cosmos-tour h3")).toHaveText(
    "Meet your next chapter.",
  );
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page.locator(".cosmos-tour h3")).toContainText("Follow");
  await page.getByRole("button", { name: "Exit guide", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Follow a connection", exact: false }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("a stationary pointer cannot freeze an event midway through formation", async ({ page }) => {
  await discover(page);
  await page.getByRole("button", { name: "List view", exact: true }).click();
  await page.getByRole("button", { name: "Constellation", exact: true }).click();
  const canvas = page.getByTestId("culture-constellation").locator("canvas");
  await canvas.scrollIntoViewIfNeeded();
  await page.locator(".cosmos-node-label").first().dispatchEvent("mouseover");
  await expect.poll(() => canvas.getAttribute("data-formation-complete")).toBe("true");
  const position = (await canvas.getAttribute("data-node-positions"))!.split("|")[0].split(",").map(Number);
  expect(Math.abs(position[0])).toBeGreaterThan(2.5);
});

test("reduced motion holds nodes while deliberate camera navigation still works", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await discover(page);
  const scene = page.getByTestId("culture-constellation");
  const canvas = scene.locator("canvas");
  await expect(scene).toHaveAttribute("data-motion", "reduced");
  await expect(
    page.getByRole("button", { name: "Reduced motion", exact: true }),
  ).toBeDisabled();
  const positions = await canvas.getAttribute("data-node-positions");
  const camera = await canvas.getAttribute("data-camera-position");
  await page.locator(".event-node").nth(1).click();
  await expect
    .poll(() => canvas.getAttribute("data-camera-position"))
    .not.toBe(camera);
  expect(await canvas.getAttribute("data-node-positions")).toBe(positions);
});

test("clear-background dragging and guided preview opening remain usable", async ({
  page,
}) => {
  await discover(page);
  const canvas = page.getByTestId("culture-constellation").locator("canvas");
  await page.waitForTimeout(2200);
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  expect(box).toBeTruthy();
  const before = await canvas.getAttribute("data-camera-position");
  await page.mouse.move(box!.x + box!.width * 0.17, box!.y + box!.height * 0.2);
  await page.mouse.down();
  await page.mouse.move(
    box!.x + box!.width * 0.32,
    box!.y + box!.height * 0.3,
    { steps: 12 },
  );
  await page.mouse.up();
  await expect
    .poll(() => canvas.getAttribute("data-camera-position"))
    .not.toBe(before);
  await page
    .getByRole("button", { name: "Follow a connection", exact: false })
    .click();
  await page
    .getByRole("button", { name: "Next connection", exact: false })
    .click();
  await page
    .getByRole("button", { name: "Next connection", exact: false })
    .click();
  const title = await page.locator(".connection-explanation h2").innerText();
  await page
    .getByRole("button", { name: "Explore this experience", exact: false })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
});

test.describe("touch constellation", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });
  test("a touch drag rotates the scene without losing event access", async ({
    page,
  }) => {
    await discover(page);
    const canvas = page.getByTestId("culture-constellation").locator("canvas");
    await page.waitForTimeout(2100);
    await canvas.scrollIntoViewIfNeeded();
    const box = await canvas.boundingBox();
    expect(box).toBeTruthy();
    const previous = await canvas.getAttribute("data-camera-position");
    const client = await page.context().newCDPSession(page);
    const start = {
      x: box!.x + box!.width * 0.14,
      y: box!.y + box!.height * 0.3,
    };
    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [start],
    });
    for (let i = 1; i <= 8; i++) {
      await client.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: start.x + i * 8, y: start.y + i * 2 }],
      });
    }
    await client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect
      .poll(() => canvas.getAttribute("data-camera-position"))
      .not.toBe(previous);
    await page.locator(".event-node").nth(1).tap();
    await expect(page.locator(".event-node").nth(1)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    const other = page.locator(".event-node").nth(2);
    await other.scrollIntoViewIfNeeded();
    const otherBox = await other.boundingBox();
    const point = {
      x: otherBox!.x + otherBox!.width / 2,
      y: otherBox!.y + otherBox!.height / 2,
    };
    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [point],
    });
    for (let i = 1; i <= 5; i++)
      await client.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: point.x, y: point.y - i * 12 }],
      });
    await client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect(page.locator(".event-node").nth(1)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(other).toHaveAttribute("aria-pressed", "false");
    await client.detach();
  });
});

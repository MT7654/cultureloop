import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const out = path.resolve("../docs/visual-qa/spatial-motion");
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
for (const [width, height] of [
  [1440, 900],
  [1280, 800],
  [390, 844],
  [360, 800],
]) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:5173/");
  await page.getByRole("button", { name: "Try the S$45 demo" }).click();
  await page.getByRole("button", { name: "What moves you" }).click();
  await page.getByRole("button", { name: "Reveal my CultureLoop" }).click();
  const scene = page.getByTestId("culture-constellation");
  await scene.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);
  const canvas = scene.locator("canvas");
  const sample = () =>
    canvas.evaluate((el) => ({
      frames: Number(el.dataset.sceneFrames),
      time: performance.now(),
      positions: el.dataset.nodePositions,
    }));
  const start = await sample();
  await page.waitForTimeout(5000);
  const end = await sample();
  await scene.screenshot({ path: path.join(out, `${width}-animated.png`) });
  await page
    .getByRole("button", { name: "Follow a connection", exact: false })
    .click();
  await page
    .getByRole("button", { name: "Next connection", exact: false })
    .click();
  await page.waitForTimeout(700);
  await scene.screenshot({ path: path.join(out, `${width}-guided.png`) });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  );
  const startPaused = await sample();
  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  await page.waitForTimeout(300);
  const pause = await sample();
  await page.waitForTimeout(1000);
  const settled = await sample();
  results.push({
    width,
    height,
    errors,
    overflow,
    silentNodesMove: start.positions !== end.positions,
    observedRenderCallbacksPerSecond: Number(
      (((end.frames - start.frames) * 1000) / (end.time - start.time)).toFixed(
        1,
      ),
    ),
    sampleMs: Math.round(end.time - start.time),
    pausedNodesStable: pause.positions === settled.positions,
    pausedAdditionalFrames: settled.frames - pause.frames,
    note: "Headless Chrome on this host; render callbacks are measured, not physical-device GPU presentation. Concurrent browser activity can affect results.",
  });
  await context.close();
}
await browser.close();
await writeFile(
  path.join(out, "measurements.json"),
  JSON.stringify(results, null, 2),
);
console.log(JSON.stringify(results, null, 2));

import { chromium } from "playwright";
import fs from "node:fs";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const dir = "../docs/visual-qa";
fs.mkdirSync(dir, { recursive: true });
const page = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:5173");
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(
  () =>
    Number(getComputedStyle(document.querySelector("main > div")).opacity) ===
    1,
);
await page.screenshot({
  path: `${dir}/desktop-hero-final.png`,
  fullPage: true,
});
await page.getByRole("button", { name: "Try the S$45 demo" }).click();
await page.waitForFunction(
  () =>
    Number(getComputedStyle(document.querySelector("main > div")).opacity) ===
    1,
);
await page.screenshot({
  path: `${dir}/desktop-story-final.png`,
  fullPage: true,
});
await page.getByRole("button", { name: "What moves you" }).click();
await page.waitForFunction(
  () =>
    Number(getComputedStyle(document.querySelector("main > div")).opacity) ===
    1,
);
await page.screenshot({ path: `${dir}/desktop-dna-final.png`, fullPage: true });
await page.getByRole("button", { name: "Reveal my CultureLoop" }).click();
await page.waitForTimeout(600);
await page.waitForFunction(
  () =>
    Number(getComputedStyle(document.querySelector("main > div")).opacity) ===
    1,
);
await page.screenshot({
  path: `${dir}/desktop-constellation-final.png`,
  fullPage: true,
});
await page
  .locator(".event-card")
  .nth(1)
  .getByRole("button", { name: /Preview/ })
  .click();
await page.waitForTimeout(300);
await page.waitForFunction(
  () =>
    Number(getComputedStyle(document.querySelector("main > div")).opacity) ===
    1,
);
await page.screenshot({
  path: `${dir}/desktop-preview-final.png`,
  fullPage: true,
});
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
});
await mobile.goto("http://127.0.0.1:5173");
await mobile.evaluate(() => document.fonts.ready);
await mobile.waitForFunction(
  () =>
    Number(getComputedStyle(document.querySelector("main > div")).opacity) ===
    1,
);
await mobile.screenshot({
  path: `${dir}/mobile-hero-final.png`,
  fullPage: true,
});
await mobile.getByRole("button", { name: "Try the S$45 demo" }).click();
await mobile.waitForTimeout(300);
await mobile.waitForFunction(
  () =>
    Number(getComputedStyle(document.querySelector("main > div")).opacity) ===
    1,
);
await mobile.screenshot({
  path: `${dir}/mobile-story-final.png`,
  fullPage: true,
});
await mobile.getByRole("button", { name: "What moves you" }).click();
await mobile.waitForTimeout(300);
await mobile.waitForFunction(
  () =>
    Number(getComputedStyle(document.querySelector("main > div")).opacity) ===
    1,
);
await mobile.screenshot({
  path: `${dir}/mobile-dna-final.png`,
  fullPage: true,
});
await mobile.getByRole("button", { name: "Reveal my CultureLoop" }).click();
await mobile.waitForTimeout(600);
await mobile.waitForFunction(
  () =>
    Number(getComputedStyle(document.querySelector("main > div")).opacity) ===
    1,
);
await mobile.screenshot({
  path: `${dir}/mobile-constellation-final.png`,
  fullPage: true,
});
await mobile
  .locator(".event-card")
  .nth(1)
  .getByRole("button", { name: /Preview/ })
  .click();
await mobile.waitForTimeout(300);
await mobile.waitForFunction(
  () =>
    Number(getComputedStyle(document.querySelector("main > div")).opacity) ===
    1,
);
await mobile.screenshot({
  path: `${dir}/mobile-preview-final.png`,
  fullPage: true,
});
await mobile
  .getByRole("button", { name: "Save to My Loop", exact: true })
  .click();
await mobile.getByRole("button", { name: "See my Loop" }).click();
await mobile.waitForTimeout(300);
await mobile.waitForFunction(
  () =>
    Number(getComputedStyle(document.querySelector("main > div")).opacity) ===
    1,
);
await mobile.screenshot({
  path: `${dir}/mobile-loop-final.png`,
  fullPage: true,
});
console.log(
  JSON.stringify({
    errors,
    saved: await mobile.locator(".saved-row").count(),
    overflow: await mobile.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  }),
);
await browser.close();

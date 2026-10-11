import { chromium } from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';

const pass = process.argv[2] || 'pass-1';
const dir = `../docs/visual-qa/culture-pass-landing/${pass}`;
fs.mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = { errors: [], screens: [] };
for (const [name, width, height] of [['desktop', 1440, 900], ['laptop', 1280, 800], ['mobile', 390, 844], ['small-mobile', 360, 800]]) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  page.on('pageerror', e => report.errors.push(e.message));
  const shot = async (state) => {
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2000);
    const data = await page.evaluate(() => {
      const bounds = selector => { const b = document.querySelector(selector).getBoundingClientRect(); return { top: b.top, bottom: b.bottom, left: b.left, right: b.right }; };
      return { overflow: document.documentElement.scrollWidth > innerWidth, eyebrow: bounds('.hero-copy > .eyebrow'), action: bounds('.hero-actions .primary'), credit: bounds('.credit-story'), scene: bounds('.hero-art'), footerFont: getComputedStyle(document.querySelector('.site-footer p')).fontSize };
    });
    assert.equal(data.overflow, false, `${name}/${state} overflow`);
    assert.ok(data.eyebrow.bottom < height, `${name}/${state} pass context below fold`);
    assert.ok(data.action.bottom < height, `${name}/${state} primary below fold`);
    if (width < 900) assert.ok(data.credit.top < data.scene.top);
    await page.screenshot({ path: `${dir}/${name}-${state}-viewport.png` });
    await page.screenshot({ path: `${dir}/${name}-${state}.png`, fullPage: true });
    report.screens.push({ name, state, width, height, ...data });
  };
  await page.goto('http://127.0.0.1:5173/');
  await shot('fresh');
  await page.getByRole('button', { name: 'Find my next chapter', exact: true }).click();
  await page.getByLabel('Your remaining Culture Pass credits').waitFor();
  assert.equal(await page.getByLabel('Your remaining Culture Pass credits').count(), 1);
  await page.getByRole('button', { name: 'CultureLoop home' }).click();
  await page.getByRole('button', { name: 'Try the S$45 demo' }).click();
  await page.getByLabel('Your remaining Culture Pass credits').waitFor();
  assert.equal(await page.getByLabel('Your remaining Culture Pass credits').inputValue(), '45');
  await page.getByRole('button', { name: 'What moves you' }).click();
  await page.getByRole('button', { name: 'Reveal my CultureLoop' }).click();
  const fresh = await context.newPage();
  await fresh.goto('http://127.0.0.1:5173/');
  await fresh.getByRole('button', { name: 'Continue my journey' }).waitFor();
  await page.close();
  // Capture the same document with its restored profile, preserving a fresh tab visit.
  await fresh.evaluate(() => document.fonts.ready);
  await fresh.waitForTimeout(1800);
  await fresh.screenshot({ path: `${dir}/${name}-returning.png`, fullPage: true });
  await fresh.screenshot({ path: `${dir}/${name}-returning-viewport.png` });
  const returning = await fresh.evaluate(() => { const b = document.querySelector('.hero-actions .primary').getBoundingClientRect(); return { overflow: document.documentElement.scrollWidth > innerWidth, actionBottom: b.bottom }; });
  assert.equal(returning.overflow, false);
  assert.ok(returning.actionBottom < height);
  report.screens.push({ name, state: 'returning', ...returning });
  await fresh.getByRole('button', { name: 'Continue my journey' }).click();
  await fresh.locator('.event-node').first().waitFor();
  assert.equal(await fresh.locator('.event-node').count(), 3);
  await context.close();
  console.log(name, 'fresh/returning captures and routes passed');
}
assert.deepEqual(report.errors, []);
fs.writeFileSync(`${dir}/checks.json`, JSON.stringify(report, null, 2));
await browser.close();

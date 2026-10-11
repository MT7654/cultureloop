import { expect, test } from '@playwright/test';
import { demoProfile } from '../src/domain/profile';

const memory = 'I loved the live jazz and intimate setting, but the crowded venue put me off.';
const suggestion = { summary: 'You enjoyed live jazz in an intimate setting.', interests: [{ value:'jazz', evidence:'live jazz' }], highlights: [{ value:'atmosphere', evidence:'intimate setting' }] };

test('AI runs only explicitly and suggestions are removable and accepted without overwriting choices', async ({ page }) => {
  let calls = 0;
  await page.route('**/api/interpret-memory', async route => { calls++; expect(route.request().postDataJSON()).toEqual({memory}); expect(route.request().headers().authorization).toBeUndefined(); await route.fulfill({json:suggestion}); });
  await page.goto('/'); await page.getByRole('button',{name:'Try the S$45 demo'}).click();
  expect(calls).toBe(0);
  await page.getByLabel('Tell us what stayed with you').fill(memory);
  expect(calls).toBe(0);
  await page.getByRole('button',{name:'Find my connections',exact:true}).click();
  await expect(page.getByText('AI suggestions · review before applying')).toBeVisible();
  const before = await page.evaluate(()=>JSON.parse(localStorage.getItem('cultureloop:ui:v1')!).profile);
  expect(before.interests).not.toContain('jazz');
  await page.getByRole('button',{name:'Remove suggested The atmosphere'}).click();
  await page.getByRole('button',{name:'Use these connections'}).click();
  await expect(page.getByText('Your accepted memory:',{exact:false})).toBeVisible();
  const after = await page.evaluate(()=>JSON.parse(localStorage.getItem('cultureloop:ui:v1')!).profile);
  expect(after.interests).toEqual(expect.arrayContaining([...before.interests,'jazz']));
  expect(after.previousHighlights).toEqual(before.previousHighlights);
  await page.getByRole('button',{name:'What moves you'}).click();
  await expect(page.locator('.taste-tile').filter({hasText:'Jazz'})).toHaveAttribute('aria-pressed','true');
  expect(calls).toBe(1);
});

test('provider failure and dismissal preserve manual onboarding', async ({ page }) => {
  await page.route('**/api/interpret-memory', route=>route.fulfill({status:503,json:{error:'Unavailable'}}));
  await page.goto('/'); await page.getByRole('button',{name:'Try the S$45 demo'}).click();
  await page.getByLabel('Tell us what stayed with you').fill(memory);
  await page.getByRole('button',{name:'Find my connections',exact:true}).click();
  await expect(page.getByText('AI interpretation is unavailable here. Continue with your own choices.')).toBeVisible();
  await page.getByRole('button',{name:'What moves you'}).click();
  await page.getByRole('button',{name:'Reveal my CultureLoop'}).click();
  await expect(page.locator('.event-node')).toHaveCount(3);
});

test('editing memory invalidates pending suggestions rather than applying stale text', async ({ page }) => {
  await page.route('**/api/interpret-memory', async route=>{ await new Promise(resolve=>setTimeout(resolve,600)); await route.fulfill({json:suggestion}).catch(()=>{}); });
  await page.goto('/'); await page.getByRole('button',{name:'Try the S$45 demo'}).click();
  await page.getByLabel('Tell us what stayed with you').fill(memory);
  await page.getByRole('button',{name:'Find my connections',exact:true}).click();
  await page.getByLabel('Tell us what stayed with you').fill('I enjoyed making a ceramic bowl.');
  await page.waitForTimeout(800);
  await expect(page.getByText('AI suggestions · review before applying')).toHaveCount(0);
  const profile = await page.evaluate(()=>JSON.parse(localStorage.getItem('cultureloop:ui:v1')!).profile);
  expect(profile.acceptedMemorySummary).toBeUndefined();
});

test('invented evidence is rejected and manual choices remain available', async ({ page }) => {
  await page.route('**/api/interpret-memory', route=>route.fulfill({json:{...suggestion,interests:[{value:'jazz',evidence:'invented love of jazz'}]}}));
  await page.goto('/'); await page.getByRole('button',{name:'Try the S$45 demo'}).click();
  await page.getByLabel('Tell us what stayed with you').fill(memory);
  await page.getByRole('button',{name:'Find my connections',exact:true}).click();
  await expect(page.getByText('The suggestion was not supported by your words. Continue with your own choices.')).toBeVisible();
  await expect(page.getByRole('button',{name:'What moves you'})).toBeEnabled();
});

test('personal bridge narration is explicit, session-cached and does not change event facts', async ({ page }) => {
  let calls = 0;
  await page.addInitScript(profile => localStorage.setItem('cultureloop:ui:v1',JSON.stringify({profile})), {...demoProfile,acceptedMemorySummary:'I enjoyed music and storytelling.'});
  await page.route('**/api/narrate-connection', async route => {
    calls++;
    const body = route.request().postDataJSON();
    expect(body.summary).toBe('I enjoyed music and storytelling.');
    expect(body.matchedTags.length).toBeGreaterThan(0);
    await route.fulfill({json:{eventId:body.eventId,text:'Your memory connects to this approved programme note.'}});
  });
  await page.goto('/#discover');
  await page.locator('.event-node').first().click();
  const title = await page.locator('.connection-explanation h2').innerText();
  await page.getByRole('button',{name:'Explore this',exact:true}).click();
  await expect(page.getByRole('heading',{level:1})).toHaveText(title);
  const practical = await page.locator('.event-facts').innerText();
  expect(calls).toBe(0);
  await page.getByRole('button',{name:'Connect this to my story',exact:true}).click();
  await expect(page.locator('.connection-narration')).toContainText('Your memory connects');
  await expect(page.getByRole('heading',{level:1})).toHaveText(title);
  expect(await page.locator('.event-facts').innerText()).toBe(practical);
  await page.getByRole('button',{name:'Back to your connections'}).click();
  await page.getByRole('button',{name:'Explore this',exact:true}).click();
  await expect(page.locator('.connection-narration')).toContainText('Your memory connects');
  expect(calls).toBe(1);
  await page.reload();
  await expect(page.getByRole('button',{name:'Connect this to my story',exact:true})).toBeVisible();
});

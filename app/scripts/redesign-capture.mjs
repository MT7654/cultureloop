import { chromium } from 'playwright';
import fs from 'node:fs';
const pass = process.argv[2] || 'before';
const dir = `../docs/visual-qa/redesign/${pass}`;
fs.mkdirSync(dir, {recursive:true});
const browser = await chromium.launch({channel:'chrome',headless:true});
const errors=[];
for (const [name,width,height] of [['desktop',1440,900],['laptop',1280,800],['mobile',390,844],['small-mobile',360,800]]) {
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
 page.on('pageerror',e=>errors.push(`${name}: ${e.message}`));
 await page.goto('http://127.0.0.1:5173');
 const shot=async(screen)=>{await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1000);await page.screenshot({path:`${dir}/${name}-${screen}.png`,fullPage:true});};
 await shot('welcome');
 await page.getByRole('button',{name:'Try the S$45 demo'}).click();await shot('story');
 await page.getByRole('button',{name:'What moves you'}).click();await shot('dna');
 await page.getByRole('button',{name:'Reveal my CultureLoop'}).click();await shot('discover');
 await page.locator('.event-card').nth(1).getByRole('button',{name:/Preview/}).click();await shot('experience');
 await page.getByRole('button',{name:'Save to My Loop',exact:true}).click();
 await page.getByRole('button',{name:/My Loop/}).first().click();await shot('loop');
 console.log(name, 'overflow',await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
 await page.close();
}
console.log(JSON.stringify({errors}));await browser.close();

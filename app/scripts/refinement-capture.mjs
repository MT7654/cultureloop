import { chromium } from 'playwright';
import fs from 'node:fs';
const pass=process.argv[2]||'pass-1';
const dir=`../docs/visual-qa/usability/${pass}`;
fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const errors=[], reports=[];
for(const [device,width,height] of [['desktop',1440,900],['laptop',1280,800],['mobile',390,844],['small-mobile',360,800]]) {
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
 page.on('pageerror',e=>errors.push(`${device}: ${e.message}`));
 const names=[];
 const shot=async(name)=>{
  await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(2200);
  const atlas = page.locator('.culture-cosmos:not(.culture-cosmos-compact)');
  if(await atlas.count()) { await atlas.scrollIntoViewIfNeeded(); await page.waitForTimeout(1800); }
  await page.screenshot({path:`${dir}/${device}-${name}.png`,fullPage:true}); names.push(name);
  const data=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,
   fonts:Object.fromEntries(['.match-reason','.event-meta','.connection-explanation p','.cosmos-node-label strong','.cosmos-interest-label','.taste-tile b','.atmosphere-caption strong'].map(s=>[s,document.querySelector(s)?getComputedStyle(document.querySelector(s)).fontSize:null])),
   previewBounds:Object.fromEntries(['.constellation-layout','.connection-explanation','.connection-explanation .text-button'].map(s=>{const e=document.querySelector(s);if(!e)return[s,null];const b=e.getBoundingClientRect(),c=getComputedStyle(e);return[s,{x:b.x,width:b.width,right:b.right,columns:c.gridTemplateColumns,column:c.gridColumn,padding:c.padding}]}))}));
  reports.push({device,screen:name,...data});
 };
 await page.goto('http://127.0.0.1:5173'); await shot('welcome');
 await page.getByRole('button',{name:'Try the S$45 demo'}).click(); await shot('story');
 await page.getByRole('button',{name:'What moves you'}).click(); await shot('dna');
 await page.getByRole('button',{name:'Reveal my CultureLoop'}).click(); await shot('discover');
 await page.getByRole('button',{name:'List view',exact:true}).click(); await shot('list');
 await page.locator('.event-card').nth(1).getByRole('button',{name:/Preview/}).click(); await shot('experience');
 await page.getByRole('button',{name:'Save to My Loop',exact:true}).click();
 await page.getByRole('button',{name:/My Loop/}).first().click(); await shot('loop');
 await page.goto('http://127.0.0.1:5173'); await shot('returning');
 const tileWidth=width<600?280:440, tileHeight=Math.round(height*tileWidth/width);
 const board=await browser.newPage({viewport:{width:tileWidth*4+70,height:(tileHeight+42)*2+60}});
 await board.setContent(`<body style="margin:0;padding:20px;background:#202830;color:white;font:14px Arial;display:grid;grid-template-columns:repeat(4,${tileWidth}px);gap:10px">${names.map(name=>`<section><p style="margin:7px 0">${device} / ${name}</p><div style="height:${tileHeight}px;overflow:hidden"><img style="width:${tileWidth}px;display:block" src="data:image/png;base64,${fs.readFileSync(`${dir}/${device}-${name}.png`).toString('base64')}"></div></section>`).join('')}</body>`);
 await board.screenshot({path:`${dir}/${device}-overview.png`,fullPage:true});
 await board.close(); await page.close(); console.log(device,'captured');
}
fs.writeFileSync(`${dir}/checks.json`,JSON.stringify({errors,reports},null,2));
console.log(JSON.stringify({errors,overflow:reports.filter(r=>r.overflow)}));
await browser.close();

import {chromium} from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const base=path.resolve('../docs/visual-qa/redesign');
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
const dataURL=p=>'data:image/png;base64,'+fs.readFileSync(p).toString('base64');
// Review first viewports of all six experiences together, alongside full-size captures.
for(const pass of ['before','pass-1','pass-2','final'])for(const [device,width,height] of [['desktop',1440,900],['laptop',1280,800],['mobile',390,844],['small-mobile',360,800]]){
 const names=['welcome','story','dna','discover','experience','loop'];
 const tileWidth=width<600?300:480;const tileHeight=Math.round(height*tileWidth/width);
 await page.setViewportSize({width:tileWidth*3+64,height:(tileHeight+50)*2+60});
 await page.setContent(`<body style="margin:0;padding:20px;background:#202830;color:#fff;font:14px Arial;display:grid;grid-template-columns:repeat(3,${tileWidth}px);gap:12px">${names.map(name=>`<section><p style="margin:8px 0">${pass} / ${device} / ${name}</p><div style="height:${tileHeight}px;overflow:hidden"><img style="width:${tileWidth}px;display:block" src="${dataURL(path.join(base,pass,device+'-'+name+'.png'))}"></div></section>`).join('')}</body>`);
 await page.screenshot({path:path.join(base,`${pass}-${device}-overview.png`),fullPage:true});
}
const template=fs.readFileSync('../.agents/skills/redesign-screen/assets/board.html','utf8');
const boardPage=await browser.newPage({viewport:{width:1280,height:900},deviceScaleFactor:2});
for(const screen of ['welcome','discover','dna','experience']){
 const data={theme:'dark',title:`CultureLoop ${screen}: before and after`,meta:`CultureLoop / ${screen} / desktop / live captures`,panes:{before:`before/desktop-${screen}.png`,after:`final/desktop-${screen}.png`},moves:[]};
 // No guessed element outlines: baseline geometry was not recorded before the edits.
 const html=template.replace(/(<script type="application\/json" id="board-data">)[\s\S]*?(<\/script>)/,(_,a,b)=>a+JSON.stringify(data)+b);
 const file=path.join(base,`${screen}-comparison.html`);fs.writeFileSync(file,html);
 await boardPage.goto(pathToFileURL(file).href);await boardPage.evaluate(()=>document.fonts.ready);
 await boardPage.waitForFunction(()=>Array.from(document.querySelectorAll('.pane img')).every(i=>i.complete&&i.naturalWidth));
 await boardPage.locator('.board').screenshot({path:path.join(base,`${screen}-comparison.png`)});
}
await browser.close();
console.log('Four comparison boards and sixteen viewport overview boards generated.');

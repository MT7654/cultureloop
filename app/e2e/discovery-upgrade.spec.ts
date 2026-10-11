import { test, expect, type Page } from "@playwright/test";
import { events } from "../src/data/events";
import { defaultProfile } from "../src/domain/profile";

async function demo(page: Page) {
  await page.goto("/"); await page.getByRole("button",{name:"Try the S$45 demo"}).click();
  await page.getByRole("button",{name:"What moves you"}).click();
  await page.getByRole("button",{name:"Reveal my CultureLoop"}).click();
  await expect(page.locator(".event-node")).toHaveCount(3);
}
test("controlled replacement changes one chapter and keeps constellation/list consistent", async ({page}) => {
  await demo(page);
  const before=await page.locator(".event-node strong").allTextContents();
  await page.getByRole("button",{name:"Try another connection",exact:true}).click();
  const after=await page.locator(".event-node strong").allTextContents();
  expect(after).toHaveLength(3);
  expect(after.filter(title=>!before.includes(title))).toHaveLength(1);
  expect(after.filter(title=>before.includes(title))).toHaveLength(2);
  await page.getByRole("button",{name:"List view",exact:true}).click();
  expect(await page.locator(".event-card .event-title").allTextContents()).toEqual(after);
  await expect(page.locator(".culture-cosmos")).toHaveCount(0);
  await page.getByRole("button",{name:"Constellation",exact:true}).click();
  expect(await page.locator(".event-node strong").allTextContents()).toEqual(after);
});
test("saved intent survives reload and a new exploration without spending credits", async ({page}) => {
  await demo(page); await page.getByRole("button",{name:"Explore this",exact:true}).click();
  await page.getByRole("button",{name:"Save to My Loop",exact:true}).click();
  const savedId = await page.evaluate(()=>JSON.parse(localStorage.getItem("cultureloop:ui:v1")!).profile.savedEventIds[0] as string);
  await page.locator(".journey-intent summary").click();
  await page.getByRole("button",{name:"Something new",exact:true}).click();
  await page.getByLabel("Your note optional").fill("I want to notice a different kind of storytelling.");
  await page.getByRole("button",{name:"See my Loop"}).click();
  await page.reload();
  await expect(page.locator(".saved-intent-label")).toHaveText("Something new");
  await page.getByRole("button",{name:"CultureLoop home"}).click();
  await page.getByRole("button",{name:"Start a new exploration"}).click();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem("cultureloop:ui:v1")!).profile);
  expect(saved.balanceSGD).toBe(45); expect(saved.savedEventIds).toContain(savedId);
  expect(saved.journeyNotes[savedId]).toEqual({reason:"Something new",note:"I want to notice a different kind of storytelling."});
});
test("contrasting profiles produce different event maps and soundtrack labels", async ({browser}) => {
  const maps: string[][]=[];
  for(const interests of [["jazz","orchestral"],["heritage","workshop"]]) {
    const page = await browser.newPage();
    await page.addInitScript(profile=>{localStorage.setItem("cultureloop:ui:v1",JSON.stringify({profile}));sessionStorage.clear();},{...defaultProfile,interests,balanceSGD:100});
    await page.goto("http://127.0.0.1:5173/#discover"); await expect(page.locator(".event-node")).toHaveCount(3);
    maps.push(await page.locator(".event-node strong").allTextContents());
    if (interests.includes("heritage")) await expect(page.locator(".atmosphere-caption")).toContainText("ambient");
    await page.close();
  }
  expect(maps[0]).not.toEqual(maps[1]);
});

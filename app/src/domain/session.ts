export type Screen = "welcome" | "story" | "dna" | "discover" | "experience" | "loop";
export const screens: Screen[] = ["welcome", "story", "dna", "discover", "experience", "loop"];
export const TAB_KEY = "cultureloop:tab:v1";
export interface TabState {
  screen: Screen;
  selectedEvent: string;
  listMode: boolean;
  affordable: boolean;
}
const fresh: TabState = { screen: "welcome", selectedEvent: "", listMode: false, affordable: false };

/** Durable preferences never choose the entry screen of a fresh visit. */
export function initialNavigation(hash: string, navigationType: string, storedTab: unknown): TabState {
  const route = hash.replace(/^#/, "") as Screen;
  const tab = storedTab && typeof storedTab === "object" ? storedTab as Partial<TabState> : {};
  if (navigationType === "reload" && screens.includes(tab.screen as Screen)) {
    const selectedEvent = typeof tab.selectedEvent === "string" ? tab.selectedEvent : "";
    const screen = screens.includes(route) ? route : tab.screen!;
    return { screen: screen === "experience" && !selectedEvent ? "discover" : screen,
      selectedEvent, listMode: tab.listMode === true, affordable: tab.affordable === true };
  }
  // Explicit routes still work; event details require a selected event in this tab.
  return { ...fresh, screen: screens.includes(route) ? route === "experience" ? "discover" : route : "welcome" };
}

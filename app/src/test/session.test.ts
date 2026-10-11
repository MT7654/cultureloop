import { describe, expect, it } from "vitest";
import { initialNavigation } from "../domain/session";

describe("navigation lifetime", () => {
  const tab = { screen: "experience", selectedEvent: "saved-event", listMode: true, affordable: true };
  it("starts fresh visits at welcome even when a tab previously had a screen", () => {
    expect(initialNavigation("", "navigate", tab).screen).toBe("welcome");
    expect(initialNavigation("", "navigate", tab).selectedEvent).toBe("");
  });
  it("restores an event and view settings on reload in the same tab", () => {
    expect(initialNavigation("#experience", "reload", tab)).toEqual(tab);
  });
  it("honours explicit links and safely recovers incomplete event links", () => {
    expect(initialNavigation("#loop", "navigate", tab).screen).toBe("loop");
    expect(initialNavigation("#experience", "navigate", tab).screen).toBe("discover");
    expect(initialNavigation("#experience", "reload", { screen: "experience" }).screen).toBe("discover");
  });
  it("ignores damaged navigation state", () => {
    expect(initialNavigation("#bogus", "reload", { screen: "bogus" }).screen).toBe("welcome");
    expect(initialNavigation("", "reload", null).screen).toBe("welcome");
  });
});

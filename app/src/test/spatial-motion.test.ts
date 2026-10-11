import { describe, expect, it } from "vitest";
import {
  animatedPosition,
  formationProgress,
} from "../components/spatial-motion";

describe("bounded semantic constellation motion", () => {
  it("keeps nodes near their anchors while moving consistently without sound", () => {
    const anchor: [number, number, number] = [-3, 1.2, -0.85];
    const first = animatedPosition(anchor, "real-event", 0, "event");
    const later = animatedPosition(anchor, "real-event", 10, "event");
    expect(later).not.toEqual(first);
    expect(animatedPosition(anchor, "real-event", 10, "event")).toEqual(later);
    for (let t = 0; t < 200; t += 2) {
      const position = animatedPosition(anchor, "real-event", t, "event");
      expect(
        position.every((value, axis) => Math.abs(value - anchor[axis]) < 0.25),
      ).toBe(true);
      expect(position[2]).toBeLessThan(0); // A discovery bridge cannot drift into a familiar foreground cluster.
    }
  });
  it("forms the memory before the tastes and event connections", () => {
    expect(formationProgress(0.1, 0)).toBeGreaterThan(
      formationProgress(0.1, 1),
    );
    expect(formationProgress(0.5, 2)).toBeGreaterThan(
      formationProgress(0.5, 6),
    );
    expect(formationProgress(2, 8)).toBe(1);
  });
});

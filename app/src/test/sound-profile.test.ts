import { describe, expect, it } from "vitest";
import { deriveSoundProfile } from "../domain/sound-profile";

describe("taste-derived original soundtrack", () => {
  it("derives distinct musical rhythms, harmonies and timbres from each music taste", () => {
    const jazz = deriveSoundProfile(["jazz"]);
    const electronic = deriveSoundProfile(["electronic"]);
    const orchestral = deriveSoundProfile(["orchestral"]);
    expect(jazz.layers[0].beats).toEqual([0, 3, 6]);
    expect(electronic.layers[0].pulse).toBe(true);
    expect(electronic.layers[0].melodyWave).toBe("triangle");
    expect(orchestral.layers[0].tone).toBeLessThan(electronic.layers[0].tone);
    expect(jazz.layers[0].chord).not.toEqual(electronic.layers[0].chord);
  });

  it("actually blends each selected music layer instead of replacing only its caption", () => {
    const blend = deriveSoundProfile(["jazz", "electronic"]);
    expect(blend.layers).toHaveLength(2);
    expect(blend.layers.map((layer) => layer.weight)).toEqual([0.5, 0.5]);
    expect(blend.layers[0].beats).not.toEqual(blend.layers[1].beats);
    expect(blend.tone).toBe(2400);
    expect(blend.description).toBe("Jazz + Electronic");
  });

  it("produces the same blend for reordered, repeated and nonmusical selections", () => {
    expect(deriveSoundProfile(["electronic", "jazz", "jazz", "art"])).toEqual(
      deriveSoundProfile(["jazz", "electronic"]),
    );
  });

  it("uses an honestly labelled neutral ambient fallback without assuming a genre", () => {
    const fallback = deriveSoundProfile(["art", "theatre", "heritage"]);
    expect(fallback).toEqual(deriveSoundProfile([]));
    expect(fallback.title).toBe("CultureLoop ambient");
    expect(fallback.musicInterests).toEqual([]);
    expect(fallback.layers[0].id).toBe("ambient");
  });

  it("normalizes a large blend to the same total gain as a single taste", () => {
    const blend = deriveSoundProfile([
      "jazz",
      "electronic",
      "pop",
      "indie",
      "orchestral",
    ]);
    expect(
      blend.layers.reduce((sum, layer) => sum + layer.weight, 0),
    ).toBeCloseTo(1);
    expect(new Set(blend.layers.map((layer) => layer.id)).size).toBe(5);
  });
});

export type SpatialPosition = [number, number, number];

/** Stable phases keep the map repeatable; animation never changes its relationships. */
export function spatialPhase(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return (hash % 628) / 100;
}

export function animatedPosition(
  anchor: SpatialPosition,
  id: string,
  elapsed: number,
  kind: "taste" | "event",
): SpatialPosition {
  const phase = spatialPhase(id);
  const amplitude = kind === "event" ? 0.22 : 0.1;
  return [
    anchor[0] + Math.sin(elapsed * 0.24 + phase) * amplitude,
    anchor[1] + Math.sin(elapsed * 0.31 + phase * 1.3) * amplitude * 0.72,
    anchor[2] + Math.cos(elapsed * 0.21 + phase) * amplitude * 1.1,
  ];
}

export function formationProgress(elapsed: number, order: number) {
  const progress = Math.min(1, Math.max(0, (elapsed - order * 0.12) / 0.8));
  return 1 - Math.pow(1 - progress, 3);
}

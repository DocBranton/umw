import type { Feature, HoleFeature, ModelData, PartAnalysis } from "./types";

export interface DrawingEnvelope {
  width: number;
  depth: number;
  height: number;
}

export interface DrawingCallout {
  featureName: string;
  text: string;
  patternCount: number | null;
}

export interface DrawingAnnotations {
  envelope: DrawingEnvelope;
  dimensions: string[];
  callouts: DrawingCallout[];
}

function fixed(value: number): string {
  return value.toFixed(3);
}

export function modelEnvelope(analyses: readonly PartAnalysis[]): DrawingEnvelope {
  if (!analyses.length) return { width: 0, depth: 0, height: 0 };
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;
  for (const analysis of analyses) {
    minX = Math.min(minX, analysis.box.min.x);
    minY = Math.min(minY, analysis.box.min.y);
    minZ = Math.min(minZ, analysis.box.min.z);
    maxX = Math.max(maxX, analysis.box.max.x);
    maxY = Math.max(maxY, analysis.box.max.y);
    maxZ = Math.max(maxZ, analysis.box.max.z);
  }
  return { width: maxX - minX, depth: maxY - minY, height: maxZ - minZ };
}

function sameHoleSpec(a: HoleFeature, b: HoleFeature): boolean {
  const eps = 1e-3;
  return (
    Math.abs(a.radius - b.radius) < eps &&
    a.thru === b.thru &&
    Math.abs((a.depth ?? 0) - (b.depth ?? 0)) < eps &&
    (a.cbore === null) === (b.cbore === null) &&
    (!a.cbore || !b.cbore || (Math.abs(a.cbore.radius - b.cbore.radius) < eps && Math.abs(a.cbore.depth - b.cbore.depth) < eps))
  );
}

export function holeCallout(hole: HoleFeature): string {
  const count = hole.patternCount && hole.patternCount > 1 ? `${hole.patternCount}X ` : "";
  const primary = `Ø${fixed(hole.radius * 2)} ${hole.thru ? "THRU" : `DEPTH ${fixed(hole.depth ?? hole.length)}`}`;
  const counterbore = hole.cbore ? ` ⌴ Ø${fixed(hole.cbore.radius * 2)} ↧ ${fixed(hole.cbore.depth)}` : "";
  return `${count}${primary}${counterbore}`;
}

function holes(features: readonly Feature[]): HoleFeature[] {
  return features.filter((feature): feature is HoleFeature => feature.kind === "hole");
}

export function drawingAnnotations(model: ModelData, analyses: readonly PartAnalysis[]): DrawingAnnotations {
  const envelope = modelEnvelope(analyses);
  const dimensions = [fixed(envelope.width), fixed(envelope.depth), fixed(envelope.height)];
  const allHoles = analyses.flatMap((analysis) => holes(analysis.features));
  const unique: HoleFeature[] = [];
  for (const hole of allHoles) {
    if (!unique.some((candidate) => sameHoleSpec(candidate, hole))) unique.push(hole);
  }
  const callouts = unique.map((hole) => ({
    featureName: hole.name,
    text: holeCallout(hole),
    patternCount: hole.patternCount ?? null,
  }));
  // The drawing renderer consumes model geometry separately. Keeping annotations
  // pure makes dimensions/callouts deterministic and independently testable.
  void model;
  return { envelope, dimensions, callouts };
}

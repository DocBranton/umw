// Links between recognized CAD features and requirements, plus the per-model review
// session. Pure data, no three.js, so the Engineering view can use it without
// loading the CAD chunk.
//
// Linking records traceability only. It never changes a feature's review status or a
// requirement's status; engineers set those explicitly.
import type { ReviewStatus } from "./engine/types";

/** "<part name>#<feature name>", e.g. "Upright (Part001)#Hole001". */
export type FeatureKey = string;
export type LinkMap = Readonly<Record<FeatureKey, readonly string[]>>;

export interface CadSession {
  reviews: Readonly<Record<FeatureKey, ReviewStatus>>;
  links: LinkMap;
}

export const emptySession = (): CadSession => ({ reviews: {}, links: {} });

export const featureKey = (partName: string, featureName: string): FeatureKey => `${partName}#${featureName}`;

export function splitKey(key: FeatureKey): { part: string; feature: string } {
  const i = key.lastIndexOf("#");
  return i < 0 ? { part: key, feature: "" } : { part: key.slice(0, i), feature: key.slice(i + 1) };
}

/** Identifies one loaded model; links and reviews are kept per model. */
export function modelKey(fileName: string, partCount: number, triangles: number): string {
  return `${fileName}|${partCount}|${triangles}`;
}

export function addLink(links: LinkMap, key: FeatureKey, reqId: string): LinkMap {
  const cur = links[key] ?? [];
  if (cur.includes(reqId)) return links;
  return { ...links, [key]: [...cur, reqId].sort() };
}

export function removeLink(links: LinkMap, key: FeatureKey, reqId: string): LinkMap {
  const cur = links[key];
  if (!cur?.includes(reqId)) return links;
  const next = { ...links };
  const rest = cur.filter((r) => r !== reqId);
  if (rest.length) next[key] = rest;
  else delete next[key];
  return next;
}

/** Features linked to a requirement, in stable order. */
export function featuresFor(links: LinkMap, reqId: string): FeatureKey[] {
  return Object.keys(links)
    .filter((k) => links[k].includes(reqId))
    .sort();
}

/**
 * Drop links to features that don't exist in the loaded model, and to requirements
 * that no longer exist. Returns what was dropped so the UI can say so.
 */
export function pruneLinks(
  links: LinkMap,
  features: ReadonlySet<FeatureKey>,
  reqIds?: ReadonlySet<string>,
): { links: LinkMap; droppedFeatures: FeatureKey[]; droppedLinks: number } {
  const next: Record<FeatureKey, string[]> = {};
  const droppedFeatures: FeatureKey[] = [];
  let droppedLinks = 0;
  for (const [k, reqs] of Object.entries(links)) {
    if (!features.has(k)) {
      droppedFeatures.push(k);
      droppedLinks += reqs.length;
      continue;
    }
    const kept = reqIds ? reqs.filter((r) => reqIds.has(r)) : [...reqs];
    droppedLinks += reqs.length - kept.length;
    if (kept.length) next[k] = kept;
  }
  return { links: next, droppedFeatures: droppedFeatures.sort(), droppedLinks };
}

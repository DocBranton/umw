// Where CAD review sessions are kept between visits.
// BrowserSessionStore saves to this browser's localStorage: per user, per machine,
// not shared. A server-backed store (Lakebase or Delta via AppKit) can implement the
// same interface later without UI changes.
import type { ReviewStatus } from "./engine/types";
import { HISTORY_LIMIT, emptySession, type CadSession, type HistoryEntry } from "./links";

export interface SessionStore {
  /** Saved session for a project's model, or null. */
  load(project: string, modelKey: string): CadSession | null;
  /** Returns false if the session could not be saved (storage full or blocked). */
  save(project: string, modelKey: string, session: CadSession): boolean;
  /** Plain-language description for the UI, e.g. "Saved in this browser". */
  readonly label: string;
}

type KV = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const VERSION = 1;
const STATUSES: ReadonlySet<string> = new Set<ReviewStatus>(["Inferred", "Validated", "Rejected"]);

function browserStorage(): KV | null {
  try {
    const s = globalThis.localStorage;
    const probe = "umw:cad:probe";
    s.setItem(probe, "1");
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null && !Array.isArray(x);
const isStr = (x: unknown): x is string => typeof x === "string";

/** Keep only well-formed data; anything else is dropped rather than trusted. */
export function parseSession(raw: unknown): CadSession | null {
  if (!isObj(raw) || raw.v !== VERSION || !isObj(raw.session)) return null;
  const src = raw.session;
  const out = emptySession();
  const reviews: Record<string, ReviewStatus> = {};
  if (isObj(src.reviews)) {
    for (const [k, v] of Object.entries(src.reviews)) if (isStr(v) && STATUSES.has(v)) reviews[k] = v as ReviewStatus;
  }
  const links: Record<string, string[]> = {};
  if (isObj(src.links)) {
    for (const [k, v] of Object.entries(src.links)) {
      const ids = Array.isArray(v) ? [...new Set(v.filter(isStr))].sort() : [];
      if (ids.length) links[k] = ids;
    }
  }
  const history: HistoryEntry[] = [];
  if (Array.isArray(src.history)) {
    for (const e of src.history) {
      if (!isObj(e) || !isStr(e.at) || !isStr(e.feature)) continue;
      const by = isStr(e.by) ? { by: e.by } : {};
      if (e.kind === "review" && isStr(e.from) && isStr(e.to) && STATUSES.has(e.from) && STATUSES.has(e.to)) {
        history.push({ at: e.at, feature: e.feature, kind: "review", from: e.from as ReviewStatus, to: e.to as ReviewStatus, ...by });
      } else if ((e.kind === "link" || e.kind === "unlink") && isStr(e.requirement)) {
        history.push({ at: e.at, feature: e.feature, kind: e.kind, requirement: e.requirement, ...by });
      }
    }
  }
  return { ...out, reviews, links, history: history.slice(-HISTORY_LIMIT) };
}

export class BrowserSessionStore implements SessionStore {
  readonly label = "Saved in this browser only";
  constructor(private readonly kv: KV | null = browserStorage()) {}

  static key(project: string, modelKey: string): string {
    return `umw:cad:v${VERSION}:${project}:${modelKey}`;
  }

  load(project: string, modelKey: string): CadSession | null {
    if (!this.kv) return null;
    try {
      const text = this.kv.getItem(BrowserSessionStore.key(project, modelKey));
      return text ? parseSession(JSON.parse(text)) : null;
    } catch {
      return null;
    }
  }

  save(project: string, modelKey: string, session: CadSession): boolean {
    if (!this.kv) return false;
    try {
      this.kv.setItem(BrowserSessionStore.key(project, modelKey), JSON.stringify({ v: VERSION, savedAt: new Date().toISOString(), session }));
      return true;
    } catch {
      return false;
    }
  }
}

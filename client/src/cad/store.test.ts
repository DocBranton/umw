import { test } from "node:test";
import assert from "node:assert/strict";
import { BrowserSessionStore, parseSession } from "./store";
import { HISTORY_LIMIT, emptySession, featureKey, geometryHash, historyFor, modelKey, recordLink, recordReview } from "./links";

const hole = featureKey("Upright (Part001)", "Hole001");
const T = "2026-10-04T23:55:00.000Z";

function memoryKV() {
  const m = new Map<string, string>();
  return {
    map: m,
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
  };
}

test("reviews and links append to the history", () => {
  let s = emptySession();
  s = recordReview(s, hole, "Validated", T);
  s = recordReview(s, hole, "Validated", T); // no-op
  s = recordLink(s, hole, "REQ-002", true, T);
  s = recordLink(s, hole, "REQ-002", true, T); // no-op
  s = recordLink(s, hole, "REQ-002", false, T);
  s = recordReview(s, hole, "Inferred", T);
  assert.deepEqual(
    historyFor(s, hole).map((e) => (e.kind === "review" ? `${e.from}>${e.to}` : `${e.kind} ${e.requirement}`)),
    ["Inferred>Validated", "link REQ-002", "unlink REQ-002", "Validated>Inferred"],
  );
  // Returning to Inferred clears the stored status; the history keeps it.
  assert.equal(hole in s.reviews, false);
  assert.deepEqual(s.links, {});
});

test("history is capped", () => {
  let s = emptySession();
  for (let i = 0; i < HISTORY_LIMIT + 20; i++) s = recordReview(s, hole, i % 2 ? "Inferred" : "Validated", T);
  assert.equal(s.history.length, HISTORY_LIMIT);
});

test("sessions round-trip through the store, per project and model", () => {
  const kv = memoryKV();
  const store = new BrowserSessionStore(kv);
  let s = recordReview(emptySession(), hole, "Validated", T);
  s = recordLink(s, hole, "REQ-002", true, T);
  assert.equal(store.save("opp-c17-hinge", "m1", s), true);
  assert.deepEqual(store.load("opp-c17-hinge", "m1"), s);
  assert.equal(store.load("opp-c17-hinge", "m2"), null);
  assert.equal(store.load("opp-other", "m1"), null);
});

test("malformed or foreign data is dropped, not trusted", () => {
  assert.equal(parseSession(null), null);
  assert.equal(parseSession({ v: 99, session: {} }), null);
  const s = parseSession({
    v: 1,
    session: {
      reviews: { [hole]: "Validated", x: "Approved", y: 3 },
      links: { [hole]: ["REQ-002", "REQ-002", 7], z: [] },
      history: [{ at: T, feature: hole, kind: "review", from: "Inferred", to: "Validated" }, { kind: "delete-all" }, "junk"],
    },
  });
  assert.ok(s);
  assert.deepEqual(s.reviews, { [hole]: "Validated" });
  assert.deepEqual(s.links, { [hole]: ["REQ-002"] });
  assert.equal(s.history.length, 1);
});

test("a full or blocked store reports failure instead of throwing", () => {
  const store = new BrowserSessionStore({
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("QuotaExceededError");
    },
    removeItem: () => {},
  });
  assert.equal(store.save("p", "m", emptySession()), false);
  assert.equal(store.load("p", "m"), null);
  assert.equal(new BrowserSessionStore(null).save("p", "m", emptySession()), false);
});

test("model key includes a geometry hash that changes with the geometry", () => {
  const a = new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]);
  const b = new Float32Array([0, 0, 0, 1, 0, 0, 0, 1.0001, 0]);
  const ha = geometryHash([a]), hb = geometryHash([b]);
  assert.match(ha, /^[0-9a-f]{8}$/);
  assert.notEqual(ha, hb);
  assert.equal(geometryHash([a]), ha);
  assert.equal(modelKey("part.stp", 1, 1, ha), `part.stp|1|1|${ha}`);
});

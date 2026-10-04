import { test } from "node:test";
import assert from "node:assert/strict";
import { analyzePart, newCounters } from "./analysis";
import { drawingAnnotations } from "./drawing";
import { buildSampleBracket } from "./sample";

const sample = buildSampleBracket();
const structural = sample.meshes.slice(0, 4);
const analyses = structural.map((mesh) => analyzePart(mesh, newCounters()));

test("sample drawing reports the required overall envelope", () => {
  const drawing = drawingAnnotations(sample, analyses);
  assert.equal(drawing.dimensions[0], "3.750");
  // The upright extends the assembly depth slightly beyond the nominal 2.000 base.
  assert.equal(drawing.dimensions[1], "2.025");
  assert.equal(drawing.dimensions[2], "2.750");
});

test("sample drawing produces counterbored through-hole callout", () => {
  const drawing = drawingAnnotations(sample, analyses);
  assert.ok(drawing.callouts.some((callout) => callout.text.includes("Ø0.375 THRU ⌴ Ø0.625 ↧ 0.125")));
});

test("sample base plate callout carries the four-hole pattern count", () => {
  const drawing = drawingAnnotations(sample, analyses);
  const pattern = drawing.callouts.find((callout) => callout.patternCount === 4 && callout.text.includes("Ø0.375 THRU"));
  assert.ok(pattern);
  assert.match(pattern.text, /^4X /);
});

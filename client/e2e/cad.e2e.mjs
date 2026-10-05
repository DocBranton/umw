// Browser test for the CAD workspace, run by CAD CI against the production Vite build.
//   BASE_URL   where the built client is served (default http://localhost:4173/)
//   FIXTURES   folder holding io1-cm-214.stp and as1-tu-203.stp (CAx-IF test models)
//   ARTIFACTS  folder for screenshots (default e2e-artifacts)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE_URL ?? "http://localhost:4173/";
const FIX = process.env.FIXTURES ?? "e2e-fixtures";
const OUT = process.env.ARTIFACTS ?? "e2e-artifacts";
mkdirSync(OUT, { recursive: true });

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "ok  " : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
};

const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const errors = [];
const scripts = [];
let wasmType = null;
page.on("console", (m) => {
  // Web fonts are best-effort in CI; everything else counts.
  if (m.type() === "error" && !/fonts\.(googleapis|gstatic)/.test(m.text())) errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(`page error: ${e.message}`));
page.on("request", (r) => r.url().endsWith(".js") && scripts.push(r.url()));
page.on("response", (r) => {
  if (r.url().endsWith(".wasm")) wasmType = r.headers()["content-type"] ?? "";
});
const status = (sel = ".cadws:not(.compact) .cad-status") => page.locator(sel).textContent({ timeout: 5000 }).catch(() => "");
const waitStatus = (re, sel = ".cadws:not(.compact) .cad-status") =>
  page.waitForFunction(([s, src]) => new RegExp(src).test(document.querySelector(s)?.textContent ?? ""), [sel, re.source], { timeout: 120000 });
const featureCount = async () => Number((await status()).match(/(\d+) features recognized/)?.[1] ?? -1);

try {
  await page.goto(BASE);
  await page.locator('button:has-text("Engineering")').first().waitFor({ timeout: 30000 });
  check("CAD code is not loaded on the home view", !scripts.some((u) => /CadWorkspace/.test(u)), `${scripts.length} scripts`);

  // Overview › 3D Model preview
  await page.locator('button:has-text("Engineering")').first().click();
  await page.locator(".ec-seg button", { hasText: "3D Model" }).click();
  await page.waitForFunction(() => /drag to orbit/.test(document.querySelector(".cad-compact-bar")?.textContent ?? ""), null, { timeout: 60000 });
  check("3D Model tab loads the preview", true);
  check("CAD code loads lazily when the 3D view opens", scripts.some((u) => /CadWorkspace/.test(u)));
  await page.screenshot({ path: join(OUT, "1-overview-3d.png") });

  // Verified CAD with the sample
  await page.getByRole("button", { name: "Open in Verified CAD" }).click();
  await waitStatus(/features recognized/);
  check("Verified CAD analyzes the sample", (await featureCount()) === 17, await status());

  // Parts start collapsed; find the feature the way a user would, through the tree search.
  await page.locator(".cad-search").fill("Hole001");
  await page.locator(".cad-row", { hasText: "Hole001" }).first().click();
  await page.locator(".cad-search").fill("");
  const details = (await page.locator(".cad-details").textContent()) ?? "";
  check("Hole001 is the counterbored Ø0.375 hole", /Counterbore/.test(details) && /Ø0\.375 in/.test(details) && /THRU ALL/.test(details));
  await page.getByRole("button", { name: "Validate" }).click();
  check("Validate marks the feature validated", /Validated/.test((await page.locator(".cad-title").textContent()) ?? ""));
  // The toast re-renders the page; the review must survive it.
  await page.waitForTimeout(1500);
  check("Validation survives a page re-render", /Validated/.test((await page.locator(".cad-title").textContent().catch(() => "")) ?? ""));
  await page.screenshot({ path: join(OUT, "2-verified-cad.png") });

  // Requirement links (present once traceability ships)
  const linkSelect = page.getByLabel("Link to requirement");
  if (await linkSelect.count()) {
    await linkSelect.selectOption("REQ-002");
    await page.getByLabel("Link to requirement").selectOption("REQ-003");
    const reqList = (await page.locator(".cad-reqlist").textContent()) ?? "";
    check("Feature links to two requirements", /REQ-002/.test(reqList) && /REQ-003/.test(reqList));
    check("Linking leaves the feature's review unchanged", /Validated/.test((await page.locator(".cad-title").textContent()) ?? ""));
    check("Tree marks the linked feature", (await page.locator(".cad-row", { hasText: "Hole001" }).locator(".cad-linked").count()) === 1);

    await page.locator(".phase", { hasText: "Requirements" }).click();
    const row = (id) => page.locator("table.req-table tr", { hasText: id });
    check("Requirement rows list the linked feature", /Hole001/.test((await row("REQ-002").textContent()) ?? "") && /Hole001/.test((await row("REQ-003").textContent()) ?? ""));
    check("Linking leaves requirement status unchanged", /In Review/.test((await row("REQ-003").locator("button.state").textContent()) ?? ""));
    await page.screenshot({ path: join(OUT, "2b-requirements-links.png") });

    // Jump from the requirement to the feature in Verified CAD; links and review survive the phase switch.
    await row("REQ-002").getByRole("button", { name: "Hole001" }).click();
    await waitStatus(/features recognized/);
    await page.waitForFunction(() => /Hole001/.test(document.querySelector(".cad-title")?.textContent ?? ""), null, { timeout: 30000 });
    const title = (await page.locator(".cad-title").textContent()) ?? "";
    check("Requirement link opens the feature in Verified CAD", /Hole001/.test(title));
    check("Review and links survive the phase switch", /Validated/.test(title) && /REQ-003/.test((await page.locator(".cad-reqlist").textContent()) ?? ""));

    // Saved reviews (present once persistence ships): reload the page and come back.
    if (/History/.test((await page.locator(".cad-details").textContent()) ?? "")) {
      await page.reload();
      await page.locator('button:has-text("Engineering")').first().click();
      await page.locator("button", { hasText: "Technical Data" }).first().click();
      await page.locator(".phase", { hasText: "Verified CAD" }).click();
      await waitStatus(/features recognized/);
      check("Details say where reviews are saved", /Saved in this browser only/.test((await page.locator(".cad-details").textContent()) ?? ""));
      await page.locator(".cad-search").fill("Hole001");
      await page.locator(".cad-row", { hasText: "Hole001" }).first().click();
      await page.locator(".cad-search").fill("");
      const after = (await page.locator(".cad-details").textContent()) ?? "";
      check("Review and links survive a page reload", /Validated/.test((await page.locator(".cad-title").textContent()) ?? "") && /REQ-002/.test(after) && /REQ-003/.test(after));
      check("History records the engineer's actions", /History/.test(after) && /Linked REQ-003/.test(after) && /Validated/.test(after));
      await page.screenshot({ path: join(OUT, "2c-after-reload.png") });
    }
  }

  // Generated drawing (present once the drawing view ships)
  const drawingToggle = page.getByRole("radio", { name: "Drawing" });
  if (await drawingToggle.count()) {
    await drawingToggle.click();
    await page.locator(".cad-sheet-img").waitFor({ timeout: 60000 });
    const src = (await page.locator(".cad-sheet-img").getAttribute("src")) ?? "";
    check("Drawing view generates a sheet", src.startsWith("data:image/png") && src.length > 20000, `${Math.round(src.length / 1024)} KB`);
    await page.screenshot({ path: join(OUT, "3-drawing.png") });
    await page.getByRole("radio", { name: "3D" }).click();
  }

  // STEP through the workspace's Open button (OpenCascade worker + WebAssembly)
  await page.locator(".cadws input[type=file]").setInputFiles(join(FIX, "io1-cm-214.stp"));
  await waitStatus(/io1-cm-214\.stp.*features recognized/);
  check("STEP file opens and is analyzed", (await featureCount()) === 12, await status());
  await page.waitForTimeout(1500);
  check("Opened file stays open after the toast", /io1-cm-214\.stp/.test(await status()), await status());
  check("WebAssembly is served as application/wasm", /application\/wasm/.test(wasmType ?? ""), wasmType ?? "no .wasm response");

  // STEP added to the evidence package opens in Verified CAD
  await page.locator("button", { hasText: "Technical Data" }).first().click();
  await page.locator(".req-band input[type=file]").setInputFiles(join(FIX, "as1-tu-203.stp"));
  await page.locator(".phase", { hasText: "Verified CAD" }).click();
  await waitStatus(/as1-tu-203\.stp.*features recognized/);
  check("Evidence STEP upload opens in Verified CAD", (await featureCount()) === 38, await status());
  await page.screenshot({ path: join(OUT, "4-evidence-step.png") });
} catch (e) {
  check("browser run completed", false, e instanceof Error ? e.message.split("\n")[0] : String(e));
  await page.screenshot({ path: join(OUT, "failure.png") }).catch(() => {});
}

check("no console errors", errors.length === 0, errors.slice(0, 3).join(" | "));
await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);

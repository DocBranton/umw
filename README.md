# Unified Mission Workbench

One Databricks app. AppKit is the runtime. The Global Mission Workbench design is the client.

Air Force, Army, and Navy are skins of this app, selected in the header. Data on the first commit is the design mock. Warehouse queries belong in `config/queries/` when a slice moves off the mock.

`gmw-console` is the prototype. This repo does not import it.

## Run

Requires the Databricks CLI, authenticated to the workspace in `databricks.yml`.

```bash
npm install
npm run dev
```

Deploy with the Databricks CLI from this directory. The app name is `umw`.

## CAD

Engineering › Verified Engineering CAD opens STEP, IGES, BREP, STL, OBJ and glTF files in the browser. Files are not uploaded. A CAD file added to the evidence package opens there; without one, a built-in sample bracket loads. The Overview 3D Model tab shows a preview.

- `client/src/cad/engine/` is the geometry engine, ported from `c-engineering-workbench`: loaders, mass properties, face classification, feature recognition, viewer.
- `client/public/cad/occt-worker.js` runs OpenCascade (`client/public/vendor/occt/`, LGPL-2.1, unmodified) in a Web Worker for STEP, IGES and BREP.
- Recognized holes, counterbores, fillets, bosses and hole patterns are proposals. Each carries a confidence from its fit residual and the evidence it rests on. An engineer validates or rejects it.
- The Drawing view generates a third-angle sheet (front, top, right, isometric) from the visible geometry, with overall dimensions, hole callouts and a title block, and downloads it as PNG. It follows hidden parts, explode, section, units and material, and is marked as generated, not released.
- three.js and the worker load only when the CAD view opens; the drawing renderer loads the first time the Drawing view opens.

```bash
npm run test:cad
```

### Review trail

Every validate, reject, return-to-inferred, link and unlink on a recognized feature is recorded with who did it and when, and shown in the feature's History.

- **With Lakebase** (the app has a `postgres` resource): actions are appended to `umw.cad_events` and shared with everyone on the project. The server takes the engineer from the Databricks Apps sign-in (`X-Forwarded-User`, `X-Forwarded-Email`), never from the browser, and refuses changes without a signed-in user. The table rejects UPDATE, DELETE and TRUNCATE, and current status is replayed from the events, so the trail and the state can't disagree. Concurrent changes to one model are serialized.
- **Without Lakebase**: reviews stay in each browser (localStorage) and are not attributed. The details panel says which applies.

To turn on Lakebase:

1. Create a Lakebase Postgres project (Compute › Lakebase), or reuse one. Note its branch and database resource names: `databricks postgres list-branches projects/<project>` and `databricks postgres list-databases <branch>`.
2. Uncomment the `variables` and `resources` blocks in `databricks.yml` and the `env` block in `app.yaml`, and fill in the branch and database under `targets.default.variables`.
3. `databricks bundle deploy`, then start the app. On first start the app's service principal creates `umw.cad_events` and owns it. Deploy before running `npm run dev` against the same database, so your own user doesn't end up owning the table.

Local development without Databricks headers records changes as `local-dev` (set `CAD_DEV_USER` to change the name). This applies only when `NODE_ENV=development`.

```bash
CAD_TEST_DATABASE_URL=postgres://postgres@localhost:5432/postgres npm run test:server   # needs a scratch Postgres
```

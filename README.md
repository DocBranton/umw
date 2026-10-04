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

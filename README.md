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

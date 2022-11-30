---
title: "docs"
id: "cmd-docs"
---

`dbt docs` has two supported subcommands: `generate` and `serve`.

### dbt docs generate

The command is responsible for generating your project's documentation website by

1. copying the website `index.html` file into the `target/` directory 
2. compiling the project to `target/manifest.json`
3. producing the `target/catalog.json` file, which contains metadata about the tables and <Term id="view">views</Term> produced by the models in your project.

**Example**:
```
dbt docs generate
```

Use the `--no-compile` argument to skip re-compilation. When this flag is provided, `dbt docs generate` will only execute steps (1) and (3), as described above.

**Example**:
```
dbt docs generate --no-compile
```

### dbt docs serve
This command starts a webserver on port 8000 to serve your documentation locally and opens the documentation site in your default browser. The webserver is rooted in your `target/` directory. Be sure to run `dbt docs generate` before `dbt docs serve` because the  `generate` command produces a [catalog metadata artifact](/reference/artifacts/catalog-json) that the `serve` command depends upon. You will see an error message if the catalog is missing.  

**Usage:**
```
dbt docs serve [--profiles-dir PROFILES_DIR]
               [--profile PROFILE] [--target TARGET]
               [--port PORT]
               [--no-browser]
```

You may specify a different port using the `--port` flag.

**Example**:
```
dbt docs serve --port 8001
```

---
title: "About dbt docs commands"
sidebar_label: "docs"
id: "cmd-docs"
---

`dbt docs` has two supported subcommands: `generate` and `serve`.

### dbt docs generate

The command is responsible for generating your project's documentation website by

1. Copying the website `index.html` file into the `target/` directory 
2. Compiling the resources in your project, so that their `compiled_code` will be included in [`manifest.json`](/reference/artifacts/manifest-json)
3. Running queries against database metadata to produce the [`catalog.json`](/reference/artifacts/catalog-json) file, which contains metadata about the tables and <Term id="view">views</Term> produced by the models in your project.

**Example**:
```
dbt docs generate
```

<VersionBlock firstVersion="1.7">

Use the `--select` argument to limit the nodes included within `catalog.json`. When this flag is provided, step (3) will be restricted to the selected nodes. All other nodes will be excluded. Step (2) is unaffected.

**Example**:
```dbt docs generate --select +orders
```

</VersionBlock>


Use the `--no-compile` argument to skip re-compilation. When this flag is provided, `dbt docs generate` will skip step (2) described above.

**Example**:
```
dbt docs generate --no-compile
```

<VersionBlock firstVersion="1.6">

Use the `--empty-catalog` argument to skip running the database queries to populate `catalog.json`. When this flag is provided, `dbt docs generate` will skip step (3) described above.

This is not recommended for production environments, as it means that your documentation will be missing information gleaned from database metadata (the full set of columns in each table, and statistics about those tables). It can speed up `docs generate` in development, when you just want to visualize lineage and other information defined within your project.

**Example**:
```
dbt docs generate --empty-catalog
```

</VersionBlock>

### dbt docs serve
This command starts a webserver on port 8080 to serve your documentation locally and opens the documentation site in your default browser. The webserver is rooted in your `target/` directory. Be sure to run `dbt docs generate` before `dbt docs serve` because the  `generate` command produces a [catalog metadata artifact](/reference/artifacts/catalog-json) that the `serve` command depends upon. You will see an error message if the catalog is missing.  

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

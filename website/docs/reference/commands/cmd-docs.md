---
title: "About dbt docs commands"
sidebar_label: "docs"
id: "cmd-docs"
---

`dbt docs` has two supported subcommands: `generate` and `serve`.

### dbt docs generate

The command is responsible for generating your project's documentation website by

1. Copying the website `index.html` file into the `target/` directory.
2. Compiling the resources in your project, so that their `compiled_code` will be included in [`manifest.json`](/reference/artifacts/manifest-json).
3. Running queries against database metadata to produce the [`catalog.json`](/reference/artifacts/catalog-json) file, which contains metadata about the tables and <Term id="view">views</Term> produced by the models in your project.

**Example**:

```
dbt docs generate
```

Use the `--select` argument to limit the nodes included within `catalog.json`. When this flag is provided, step (3) will be restricted to the selected nodes. All other nodes will be excluded. Step (2) is unaffected.

**Example**:

```shell
dbt docs generate --select +orders
```

Use the `--no-compile` argument to skip re-compilation. When this flag is provided, `dbt docs generate` will skip step (2) described above.

**Example**:

```
dbt docs generate --no-compile
```

Use the `--empty-catalog` argument to skip running the database queries to populate `catalog.json`. When this flag is provided, `dbt docs generate` will skip step (3) described above.

This is not recommended for production environments, as it means that your documentation will be missing information gleaned from database metadata (the full set of columns in each table, and statistics about those tables). It can speed up `docs generate` in development, when you just want to visualize lineage and other information defined within your project. To learn how to build your documentation in dbt Cloud, refer to [build your docs in dbt Cloud](/docs/collaborate/build-and-view-your-docs).

**Example**:

```
dbt docs generate --empty-catalog
```

### dbt docs serve

This command starts a webserver on port 8080 to serve your documentation locally and opens the documentation site in your default browser. The webserver is rooted in your `target/` directory. Be sure to run `dbt docs generate` before `dbt docs serve` because the `generate` command produces a [catalog metadata artifact](/reference/artifacts/catalog-json) that the `serve` command depends upon. You will see an error message if the catalog is missing.

Use the `dbt docs serve` command if you're developing locally with the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) or [dbt Core](/docs/core/installation-overview). The [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) doesn't support this command.

**Usage:**

<VersionBlock lastVersion="1.8.1">
```
dbt docs serve [--profiles-dir PROFILES_DIR]
               [--profile PROFILE] [--target TARGET]
               [--port PORT]
               [--no-browser]
```
</VersionBlock>
<VersionBlock firstVersion="1.8.2">
```
dbt docs serve [--profiles-dir PROFILES_DIR]
               [--profile PROFILE] [--target TARGET]
               [--host HOST]
               [--port PORT]
               [--no-browser]
```
</VersionBlock>

You may specify a different port using the `--port` flag.

**Example**:

```
dbt docs serve --port 8001
```

<VersionBlock firstVersion="1.8.2">

You may specify a different host using the `--host` flag.

**Example**:

```shell
dbt docs serve --host ""
```

As of 1.8.1, the default host is `127.0.0.1`. For versions 1.8.0 and prior, the default host was `""`.
</VersionBlock>

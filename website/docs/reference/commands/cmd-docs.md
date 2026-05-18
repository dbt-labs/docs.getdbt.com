---
title: "About dbt docs commands"
description: "Generate and serve the docs for your dbt project."
sidebar_label: "docs"
id: "cmd-docs"
---

<VersionBlock lastVersion="1.99">

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

:::info Catalog query behavior for large projects

When you select fewer than 100 nodes, dbt filters the catalog query at the database level using a `WHERE` clause on specific relation names, which is more performant. When you select 100 or more nodes, dbt queries all relations in the relevant schemas and then filters the results in memory.

In both cases, the `catalog.json` output is post-filtered to include only the selected nodes (models, sources, and other resources).

:::

Use the `--no-compile` argument to skip re-compilation. When this flag is provided, `dbt docs generate` will skip step (2) described above. Note that dbt still runs certain special macros (like `generate_schema_name`) [during parsing](/reference/global-configs/parsing), even when compilation is skipped.

**Example**:

```
dbt docs generate --no-compile
```

Use the `--empty-catalog` argument to skip running the database queries to populate `catalog.json`. When this flag is provided, `dbt docs generate` will skip step (3) described above.

This is not recommended for production environments, as it means that your documentation will be missing information gleaned from database metadata (the full set of columns in each table, and statistics about those tables). It can speed up `docs generate` in development, when you just want to visualize lineage and other information defined within your project. To learn how to build your documentation in <Constant name="dbt" />, refer to [build your docs in <Constant name="dbt" />](/docs/explore/build-and-view-your-docs).

**Example**:

```
dbt docs generate --empty-catalog
```

**Example**:

Use the `--static` flag to generate the docs as a static page for hosting on a cloud storage provider. The `catalog.json` and `manifest.json` files will be inserted into the `index.html` file, creating a single page easily shared via email or file-sharing apps. 

```
dbt docs generate --static
```

### dbt docs serve

This command starts a webserver on port 8080 to serve your documentation locally and opens the documentation site in your default browser. The webserver is rooted in your `target/` directory. Be sure to run `dbt docs generate` before `dbt docs serve` because the `generate` command produces a [catalog metadata artifact](/reference/artifacts/catalog-json) that the `serve` command depends upon. You will see an error message if the catalog is missing.

Use the `dbt docs serve` command if you're developing locally with the [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation) or [<Constant name="core" />](/docs/local/install-dbt). The [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) doesn't support this command.

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

:::info Note
The `--host` flag is only available in the [<Constant name="core"/>](/docs/local/install-dbt). It's not supported in the [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation).
:::

**Example**:

```shell
dbt docs serve --host ""
```

As of 1.8.1, the default host is `127.0.0.1`. For versions 1.8.0 and prior, the default host was `""`.
</VersionBlock>

</VersionBlock>

<VersionBlock firstVersion="2.0">

The <Constant name="fusion_engine" /> uses the `--write-catalog` flag instead of the `dbt docs generate` command for generating your [`catalog.json`](/reference/artifacts/catalog-json) file and hydrating metadata. This flag is fully Fusion native and significantly more performant.

## --write-catalog flag

The `--write-catalog` flag generates the [`catalog.json`](/reference/artifacts/catalog-json) artifact, which contains metadata about the tables and <Term id="view">views</Term> produced by the models in your project. You can use this flag with the following commands:

- `dbt build`
- `dbt run`
- `dbt parse`
- `dbt compile`

**Examples**:

```shell
dbt build --write-catalog
```

### Platform behavior

In <Constant name="dbt_platform" /> jobs running on <Constant name="fusion" />, you don't need to change anything. When `dbt docs generate` is called (either as a job step or separate command), the platform automatically uses `--write-catalog` instead.

### Local usage

When running <Constant name="fusion" /> locally, add the `--write-catalog` flag to your command to generate the catalog:

```shell
dbt build --write-catalog
```

### What's different from docs generate

The `--write-catalog` flag focuses solely on metadata hydration, generating the `catalog.json` file that powers [Catalog](/docs/explore/build-and-view-your-docs) and metadata APIs. It does not generate the static documentation website files (`index.html`).

For the open-source documentation site experience, use `dbt docs generate` with <Constant name="core" />.

</VersionBlock>

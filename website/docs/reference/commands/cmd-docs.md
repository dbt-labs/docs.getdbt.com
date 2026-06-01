---
title: "About dbt docs commands"
description: "Generate and serve the docs for your dbt project."
sidebar_label: "docs"
id: "cmd-docs"
---

<VersionBlock lastVersion="1.99">

`dbt docs` has two supported subcommands: `generate` and `serve`.

### dbt docs generate

`dbt docs generate` generates your project's documentation website by:

1. Copying the website `index.html` file into the `target/` directory.
2. Compiling the resources in your project, so their `compiled_code` is included in [`manifest.json`](/reference/artifacts/manifest-json).
3. Running queries against database metadata to produce the [`catalog.json`](/reference/artifacts/catalog-json) file, which contains metadata about the tables and <Term id="view">views</Term> produced by the models in your project.

**Example**:

```shell
dbt docs generate
```

When you provide `--select`, dbt limits the nodes in `catalog.json` to your selection. dbt restricts step (3) to the selected nodes and excludes all other nodes. Step (2) is unaffected.

**Example**:

```shell
dbt docs generate --select +orders
```

:::info Catalog query behavior for large projects

When you select fewer than 100 nodes, dbt filters the catalog query at the database level using a `WHERE` clause on specific relation names, which is more performant. When you select 100 or more nodes, dbt queries all relations in the relevant schemas and then filters the results in memory.

In both cases, the `catalog.json` output is post-filtered to include only the selected nodes (models, sources, and other resources).

:::

When you provide `--no-compile`, `dbt docs generate` skips step (2) described above. Note that dbt still runs certain special macros (like `generate_schema_name`) [during parsing](/reference/global-configs/parsing), even when compilation is skipped.

**Example**:

```shell
dbt docs generate --no-compile
```

When you provide `--empty-catalog`, `dbt docs generate` skips step (3) described above.

This is not recommended for production environments: your documentation won't include warehouse metadata, such as the full set of columns in each table and statistics about those tables. It can speed up `docs generate` in development when you only want to visualize lineage and other information defined in your project. To build documentation in <Constant name="dbt" />, see [Build and view your docs in dbt](/docs/explore/build-and-view-your-docs).

**Example**:

```shell
dbt docs generate --empty-catalog
```

Use the `--static` flag to generate the docs as a static page for hosting on a cloud storage provider. dbt inserts `catalog.json` and `manifest.json` into `index.html`, creating a single page you can share via email or file-sharing apps.

```shell
dbt docs generate --static
```

### dbt docs serve

`dbt docs serve` starts a webserver on port 8080 to serve your documentation locally and opens the documentation site in your default browser. The webserver is rooted in your `target/` directory. Run `dbt docs generate` before `dbt docs serve` because the `generate` command produces a [catalog metadata artifact](/reference/artifacts/catalog-json) that the `serve` command depends on. You will see an error message if the catalog is missing.

Use `dbt docs serve` if you're developing locally with the [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation) or [<Constant name="core" />](/docs/local/install-dbt). The [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) doesn't support this command.

**Usage:**

<VersionBlock lastVersion="1.8.1">
```shell
dbt docs serve [--profiles-dir PROFILES_DIR]
               [--profile PROFILE] [--target TARGET]
               [--port PORT]
               [--no-browser]
```
</VersionBlock>
<VersionBlock firstVersion="1.8.2">
```shell
dbt docs serve [--profiles-dir PROFILES_DIR]
               [--profile PROFILE] [--target TARGET]
               [--host HOST]
               [--port PORT]
               [--no-browser]
```
</VersionBlock>

You may specify a different port using the `--port` flag.

**Example**:

```shell
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

The <Constant name="fusion_engine" /> uses the `--write-catalog` flag instead of the `dbt docs generate` command for generating your [`catalog.json`](/reference/artifacts/catalog-json) file and hydrating metadata. This flag is built for the Fusion engine and is significantly more performant.

## --write-catalog flag

The `--write-catalog` flag generates the [`catalog.json`](/reference/artifacts/catalog-json) artifact, which contains metadata about the tables and <Term id="view">views</Term> produced by the models in your project. <Constant name="fusion" /> jobs running in <Constant name="dbt_platform" />, dbt automatically runs `write-catalog`, `build`, and `run`, and hydrates your Catalog, so you don't need to manually include it. You can use this flag with the following commands:

- `dbt build`
- `dbt run`
- `dbt parse`
- `dbt compile`

**Examples**:

```shell
dbt build --write-catalog
```


### Platform behavior

In <Constant name="dbt_platform" /> jobs running on <Constant name="fusion" />, you don't need to change anything. When `dbt docs generate` is called (either as a job step or separate command), the platform automatically uses `--write-catalog` instead. Additionally, for <Constant name="fusion" /> jobs running in the platform, dbt will run `write-catalog` automatically with `build` or `run`, so you don't need to run a separate command to hydrate your metadata. In the platform, you can optionally choose to include it when running `dbt parse` or `dbt compile`.

Note:

### Local usage

When running <Constant name="fusion" /> locally, add the `--write-catalog` flag to your command to generate the catalog:

```shell
dbt build --write-catalog
```

### What's different from docs generate

The `--write-catalog` flag focuses solely on metadata hydration, generating the `catalog.json` file that powers [Catalog](/docs/explore/build-and-view-your-docs) and metadata APIs. It does not generate the static documentation website files (`index.html`).

## dbt Docs v2 <Lifecycle status="alpha"/>

The <Constant name="fusion_engine" /> and <Constant name="core_v2" /> deliver a new version of `dbt docs serve` that powers [dbt Docs v2](/docs/build/view-documentation#dbt-docs-v2).

Instead of loading a static `manifest.json` in the browser, v2 builds a compact binary index of your project and serves it through a local HTTP server with a REST API. This makes the experience fast even for large projects, and makes metadata queryable by AI agents and external tooling.

### Generate the index

Before serving, build your project with the `--write-index` flag. You can add this flag to dbt `build`, `run`, `parse`, or `compile` commands. It writes index files to the `target/index/` directory which is what `dbt docs serve` reads from:

```shell
dbt compile --write-index
```

```shell
dbt build --write-index
```

Add [`--static-analysis strict`](/docs/fusion/new-concepts) to for column lineage and richer column metadata from your warehouse:

```shell
dbt build --write-index --static-analysis strict
```

```shell
dbt build --write-index --static-analysis strict
```

### Serve dbt Docs v2

:::note Login for full capabilities
When using <Constant name="fusion" />, run `dbt login` before serving to unlock all capabilities. Some features, such as column lineage, require authentication to display.
:::

Once the index is built, start the local documentation server:

```shell
dbt docs serve
```

You can pass the `--target-path` flag to change the path where dbt pulls artifacts from:

```shell
dbt docs serve --target-path ~/Developer/internal-analytics/target
```

The server starts on port `8580` by default and opens in your browser. Use `--port` to change the port:

```shell
dbt docs serve --port 8081
```

### REST API

dbt Docs v2 exposes a REST API at `/api/v1/` that AI agents, MCP servers, and external tooling can query directly, all without a browser. Key endpoints include:

| Endpoint | Description |
|---|---|
| `GET /api/v1/health` | Server status |
| `GET /api/v1/capabilities` | Feature flags (for example, `has_column_lineage`) |
| `GET /api/v1/models` | Paginated model list with filters |
| `GET /api/v1/models/:id` | Model detail including catalog metadata |
| `GET /api/v1/sources/:id` | Source detail |
| `GET /api/v1/nodes/counts` | Resource type counts (models, sources, tests, etc.) |
| `GET /api/v1/nodes/:id/lineage` | Model-level lineage graph |
| `GET /api/v1/nodes/:id/column-lineage` | Column-level lineage (Fusion-only capability) |

See the [dbt Docs v2 API contracts](https://github.com/dbt-labs/fs/blob/main/fs/sa/crates/dbt-docs-server/API-CONTRACTS.md#get-apiv1sources) for the full list of available endpoints.

This makes dbt Docs v2 a natural context source for MCP servers. If you're using a coding agent like Claude Code, you can point it at a running dbt Docs v2 instance to give it rich, structured metadata about your dbt project without installing dbt locally.

</VersionBlock>

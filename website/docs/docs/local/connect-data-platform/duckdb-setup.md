---
title: "DuckDB setup"
sidebar_label: "DuckDB"
description: "Read this guide to learn about the DuckDB warehouse setup in dbt."
meta:
  maintained_by: Community
  authors: 'Josh Wills (https://github.com/jwills)'
  github_repo: 'duckdb/dbt-duckdb'
  pypi_package: 'dbt-duckdb'
  min_core_version: 'v1.0.1'
  cloud_support: Not Supported
  min_supported_version: 'DuckDB 0.3.2'
  slack_channel_name: '#db-duckdb'
  slack_channel_link: 'https://getdbt.slack.com/archives/C039D1J1LA2'
  platform_name: 'Duck DB'
  config_page: '/reference/resource-configs/duckdb-configs'
---

<VersionBlock firstVersion="2.0">

# Connect DuckDB to Fusion <Lifecycle status="beta" />

DuckDB with <Constant name="fusion_engine" /> is the easiest way to get a dbt project running locally &mdash; no warehouse account or credentials required. [DuckDB](https://duckdb.org) is an embedded database that runs entirely in-process, so dbt connects directly to a local `.duckdb` file with no additional setup.

DuckDB does not require authentication &mdash; it runs locally on your machine.

### Installing dbt-duckdb

The DuckDB adapter is built into the <Constant name="fusion" /> CLI. To get started, [install dbt Fusion](/docs/local/install-dbt). We recommend using the [VS Code Extension](/docs/local/install-dbt?version=2#get-started) as the development interface.

#### DuckDB driver and extensions {#driver-and-extensions}

<Constant name="fusion" /> ships with a built-in DuckDB driver. However, this bundled driver does _not_ support loading DuckDB extensions (for example, `httpfs`, `parquet`, or `spatial`).

To use [DuckDB extensions](https://duckdb.org/docs/current/extensions/overview) with <Constant name="fusion" />, install the DuckDB driver with [`dbc`](https://docs.columnar.tech/dbc/#__tabbed_2_4). <Constant name="fusion" /> checks for a system-installed DuckDB driver first and falls back to the bundled driver if none is found.

For connection examples and shared profile settings, refer to [Connecting to DuckDB](#connecting-to-duckdb).

### Limitations

The DuckDB adapter for <Constant name="fusion" /> is in beta. Some features available in the `dbt-duckdb` adapter for <Constant name="core" /> are not yet supported.

- Current adapter feature parity work is tracked in [dbt-fusion#1593](https://github.com/dbt-labs/dbt-fusion/issues/1593).
- Current SQL analysis gaps are tracked in [dbt-fusion#1464](https://github.com/dbt-labs/dbt-fusion/issues/1464).

#### Static analysis and local flat files

<Constant name="fusion_engine" /> performs static analysis on your SQL models to determine column types and lineage without executing queries. If your models reference local flat files (CSV, Parquet, or JSON) through DuckDB's `read_csv()`, `read_parquet()`, or `read_json()` functions, <Constant name="fusion" /> may not be able to infer the schema of those files at analysis time. As a result, you may see type-resolution warnings or compilation errors even when the query would succeed at runtime. To learn more, refer to [New concepts](/docs/fusion/new-concepts).

</VersionBlock>

<VersionBlock lastVersion="1.99">

# Connect DuckDB to dbt Core

<ProductCard text="Fusion compatible" url="/docs/local/connect-data-platform/duckdb-setup?version=2" /> connection also available.

:::info Community plugin

Some functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

</VersionBlock>

## Connecting to DuckDB

[DuckDB](https://duckdb.org) is an embedded database, similar to SQLite, but designed for OLAP-style analytics instead of OLTP. There are several ways to connect dbt to DuckDB depending on where you want your data to live. Configure your `profiles.yml` using the examples in the following sections:

- [In-memory](#in-memory)
- [Local file](#local-file)
- [MotherDuck](#motherduck)
- [Attaching additional databases](#attaching-additional-databases)

Refer to the following table for the fields to use in your `profiles.yml`. `type: duckdb` is _always_ required. Use `path` for local files or MotherDuck connection strings, and use `:memory:` or omit `path` for an in-memory database.

| Profile field | Description | Example |
| --- | --- | --- |
| `type` | The adapter type. | `duckdb` |
| `path` | Path to a DuckDB database file, a MotherDuck `md:` connection string, or `:memory:` for an in-memory database. | `./jaffle_shop.duckdb` |
| `schema` | The schema name where dbt creates objects. | `main` |
| `threads` | Number of threads dbt uses when building models concurrently. | `4` |
| `extensions` | List of [DuckDB extensions](https://duckdb.org/docs/extensions/overview) to load at startup. | `httpfs`, `parquet` |
| `settings` | Map of [DuckDB configuration options](https://duckdb.org/docs/sql/configuration) to set at startup. | `s3_region: us-east-1` |

If you're using <Constant name="fusion" />, loading extensions requires you to install the DuckDB driver with [`dbc`](https://docs.columnar.tech/dbc/#__tabbed_2_4). Refer to [DuckDB driver and extensions](#driver-and-extensions) for details.

### In-memory

The simplest configuration requires only `type: duckdb` in your profile. This runs an in-memory database &mdash; all data is lost after the run completes. This is useful for testing pipelines and for workflows that operate purely on external CSV, Parquet, or JSON files.

<File name='profiles.yml'>

```yaml
default:
  outputs:
    dev:
      type: duckdb
  target: dev
```

</File>

### Local file

To persist data between runs, set `path` to a `.duckdb` file on your local filesystem. DuckDB creates the file automatically if it doesn't exist.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: duckdb
      path: './my_project.duckdb'
      schema: main   # optional; defaults to main
      threads: 4     # optional
```

</File>

You can use a relative path (resolved relative to your `profiles.yml` file) or an absolute path. `dbt-duckdb` automatically sets the `database` property to the basename of the file with the suffix removed (for example, `/tmp/a/dbfile.duckdb` sets `database` to `dbfile`).

### MotherDuck

In `dbt-duckdb 1.5.2` and later, you can connect to a DuckDB instance running on [MotherDuck](https://motherduck.com) by setting `path` to an `md:` connection string:

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: duckdb
      path: "md:my_db?motherduck_token={{ env_var('MOTHERDUCK_TOKEN') }}"
      threads: 4
```

</File>

MotherDuck databases generally work the same way as local DuckDB databases, with a few differences described in [MotherDuck's documentation](https://motherduck.com/docs/architecture-and-capabilities#considerations-and-limitations). MotherDuck preloads common DuckDB extensions but does not support loading custom extensions or user-defined functions.

### Attaching additional databases

DuckDB supports [attaching additional databases](https://duckdb.org/docs/sql/statements/attach.html) so you can read and write from multiple databases. Configure additional databases using the `attach` argument in your profile:

<File name='profiles.yml'>

```yaml
default:
  outputs:
    dev:
      type: duckdb
      path: /tmp/dbt.duckdb
      attach:
        - path: /tmp/other.duckdb
        - path: ./yet/another.duckdb
          alias: yet_another
        - path: s3://yep/even/this/works.duckdb
          read_only: true
        - path: sqlite.db
          type: sqlite
        - path: postgresql://username@hostname/dbname
          type: postgres
  target: dev
```

</File>

You can refer to attached databases by the basename of the file (without its suffix) or by an `alias` you specify. The `type` argument supports `duckdb`, `sqlite`, and `postgres`. You can also pass arbitrary options using the `options` dictionary &mdash; refer to [Arbitrary ATTACH options](/reference/resource-configs/duckdb-configs#arbitrary-attach-options) for details.

For DuckLake, use `ducklake:` for local databases. For MotherDuck-managed DuckLake, use `md:` with `is_ducklake: true`. Refer to the [DuckLake configuration](/reference/resource-configs/duckdb-configs#ducklake) section for details.

## Extensions

You can load any supported [DuckDB extensions](https://duckdb.org/docs/extensions/overview) by listing them in the `extensions` field in your profile. You can also set any additional [DuckDB configuration options](https://duckdb.org/docs/sql/configuration) in the `settings` field.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: duckdb
      path: 'file_path/database_name.duckdb'
      extensions:
        - httpfs
        - parquet
      settings:
        s3_region: my-aws-region
        s3_access_key_id: "{{ env_var('S3_ACCESS_KEY_ID') }}"
        s3_secret_access_key: "{{ env_var('S3_SECRET_ACCESS_KEY') }}"
```

</File>

You can also configure extensions from outside the core extension repository (such as a community extension) by specifying a `name`/`repo` pair:

```yml
extensions:
  - httpfs
  - parquet
  - name: h3
    repo: community
  - name: uc_catalog
    repo: core_nightly
```

For configuring cloud storage access using DuckDB's Secrets Manager or fsspec filesystems, refer to the [DuckDB configurations](/reference/resource-configs/duckdb-configs) page.

## More information

Find DuckDB-specific configuration information in the [DuckDB adapter reference guide](/reference/resource-configs/duckdb-configs).

For adapter source code, refer to the [`dbt-duckdb` repository](https://github.com/duckdb/dbt-duckdb). For adapter release notes, refer to the [`dbt-duckdb` releases page](https://github.com/duckdb/dbt-duckdb/releases).

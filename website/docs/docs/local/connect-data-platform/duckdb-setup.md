---
title: "Connect DuckDB to dbt Core"
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
  config_page: '/reference/resource-configs/no-configs'
---

<VersionBlock firstVersion="2.0">

# Connect DuckDB to Fusion <Lifecycle status="beta" />

DuckDB with <Constant name="fusion_engine" /> is the easiest way to get a dbt project running locally &mdash; no warehouse account or credentials required. [DuckDB](http://duckdb.org) is an embedded database that runs entirely in-process, so dbt connects directly to a local `.duckdb` file with no additional setup.

The `dbt-duckdb` adapter is available in the <Constant name="fusion" /> CLI. To access the adapter, [install dbt Fusion](/docs/local/install-dbt). We recommend using the [VS Code Extension](/docs/local/install-dbt?version=2#get-started) as the development interface. <Constant name="dbt_platform" /> support coming soon. 

## Authentication

<!--need more info-->

## Configure Fusion

To connect dbt to DuckDB, set up your `profiles.yml`. Refer to the following configuration:

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: duckdb
      path: /path/to/database_name.duckdb
      schema: main   # optional; defaults to main
      threads: 4     # optional
```

</File>

You can load [DuckDB extensions](https://duckdb.org/docs/extensions/overview) and set additional [DuckDB configuration options](https://duckdb.org/docs/sql/configuration) in `extensions` and `settings`. For example, to connect to S3 and read/write Parquet files:

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: duckdb
      path: /path/to/database_name.duckdb
      extensions:
        - httpfs
        - parquet
      settings:
        s3_region: my-aws-region
        s3_access_key_id: "{{ env_var('S3_ACCESS_KEY_ID') }}"
        s3_secret_access_key: "{{ env_var('S3_SECRET_ACCESS_KEY') }}"
```

</File>

You can also connect <Constant name="fusion" /> to a MotherDuck-hosted database by setting path to a MotherDuck connection string. For example:

<File name='~/.dbt/profiles.yml'>

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

| Profile field | Required | Description | Example |
| --- | --- | --- | --- |
| `type` | Yes | The adapter type. | `duckdb` |
| `path` | Yes | Path to the DuckDB database file on your local file system. Created automatically if it does not exist. By default, the path is relative to your `profiles.yml` file location. | `./jaffle_shop.duckdb` |
| `schema` | No | The schema name where dbt creates objects. | Default: `main` |
| `threads` | No | Number of threads dbt uses when building models concurrently. | Default: `1` |
| `extensions` | No | List of [DuckDB extensions](https://duckdb.org/docs/extensions/overview) to load at startup. | `httpfs`, `parquet` |
| `settings` | No | Map of [DuckDB configuration options](https://duckdb.org/docs/sql/configuration) to set at startup, including options from loaded extensions. | `s3_region: us-east-1` |

## Limitations

The following features are not yet fully supported in the DuckDB adapter for <Constant name="fusion" />:

- **Nested types:** `LIST`, `MAP`, and `STRUCT` types are not yet supported.
- **PIVOT and UNPIVOT:** Binder implementation is minimal.
- **ASOF and POSITIONAL joins:** These join types are bound as cross joins, which is sufficient for lineage and type resolution.
- **Custom types and enums:** `CREATE TYPE` and `ENUM` type definitions are not yet supported.

</VersionBlock>

<VersionBlock lastVersion="1.99">

:::info Community plugin

Some functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


## Connecting to DuckDB with dbt-duckdb

[DuckDB](http://duckdb.org) is an embedded database, similar to SQLite, but designed for OLAP-style analytics instead of OLTP. The only configuration parameter that is required in your profile (in addition to `type: duckdb`) is the `path` field, which should refer to a path on your local filesystem where you would like the DuckDB database file (and it's associated write-ahead log) to be written. You can also specify the `schema` parameter if you would like to use a schema besides the default (which is called `main`).

There is also a `database` field defined in the `DuckDBCredentials` class for consistency with the parent `Credentials` class, but it defaults to `main` and setting it to be something else will likely cause strange things to happen that cannot be fully predicted, so please avoid changing it.

As of version 1.2.3, you can load any supported [DuckDB extensions](https://duckdb.org/docs/extensions/overview) by listing them in the `extensions` field in your profile. You can also set any additional [DuckDB configuration options](https://duckdb.org/docs/sql/configuration) via the `settings` field, including options that are supported in any loaded extensions. 

For example, to be able to connect to `s3` and read/write `parquet` files using an AWS access key and secret, your profile would look something like this:

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

### Local storage

When using dbt with DuckDB, the `path` field in your [`profiles.yml`](/docs/local/profiles.yml) determines where the DuckDB database file is stored on your local filesystem. You can provide an absolute path or a relative path (which will be resolved relative to your dbt project root).

If you provide a filesystem path ending in `.duckdb`, DuckDB will:

- Create the file automatically if it does not exist
- Write tables and views into that file when you execute [`dbt run`](/reference/commands/run)
- Persist data between runs

The following is an example of a profile configured to create and connect to a local DuckDB database using a relative path:

<File name='profiles.yml'>
```yaml
duckdb_local_storage_test:
  target: dev
  outputs:
    dev:
      type: duckdb
      path: "./local.duckdb"
      threads: 4
```
</File>

This configuration tells DuckDB to create (or reuse) a file named `local.duckdb` in the directory where you run dbt.

From your project directory, run these commands:

```shell
dbt debug
dbt run
ls -lah local.duckdb
```

After executing `dbt run`, you should see a file named `local.duckdb` in your project directory. This file contains the tables and views built by dbt.

If you delete the file:

```shell
rm local.duckdb
```

Running `dbt run` again will recreate it.

:::note
If you use a relative path (for example, `./local.duckdb`), the database file is created relative to the directory where you execute dbt. You can also use an absolute path (for example, `/Users/yourname/project/local.duckdb`) to ensure the database file is always written to a specific location.
:::

</VersionBlock>
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
  config_page: '/reference/resource-configs/duckdb-configs'
---

:::info Community plugin

Some functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


## Connecting to DuckDB

[DuckDB](https://duckdb.org) is an embedded database, similar to SQLite, but designed for OLAP-style analytics instead of OLTP. There are several ways to connect dbt to DuckDB depending on where you want your data to live.

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

To persist data between runs, set `path` to a `.duckdb` file on your local filesystem. DuckDB will create the file automatically if it doesn't exist.

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

You can use a relative path (resolved from where you run dbt) or an absolute path. `dbt-duckdb` automatically sets the `database` property to the basename of the file with the suffix removed (for example, `/tmp/a/dbfile.duckdb` sets `database` to `dbfile`).

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

DuckDB supports [attaching additional databases](https://duckdb.org/docs/sql/statements/attach.html) so you can read and write from multiple databases. Configure additional databases via the `attach` argument in your profile:

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

Attached databases can be referred to by the basename of the file (minus its suffix) or by an `alias` you specify. The `type` argument supports `duckdb`, `sqlite`, and `postgres`. You can also pass arbitrary options via the `options` dictionary &mdash; refer to [Arbitrary ATTACH options](/reference/resource-configs/duckdb-configs#arbitrary-attach-options) for details.

For DuckLake, use `ducklake:` for local databases; for MotherDuck-managed DuckLake, use `md:` with `is_ducklake: true`. Refer to the [DuckLake configuration](/reference/resource-configs/duckdb-configs#ducklake) section for details.

## Extensions

You can load any supported [DuckDB extensions](https://duckdb.org/docs/extensions/overview) by listing them in the `extensions` field in your profile. You can also set any additional [DuckDB configuration options](https://duckdb.org/docs/sql/configuration) via the `settings` field.

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

---
title: "Connect Firebird to dbt v1"
sidebar_label: "Firebird"
description: "Read this guide to learn about the Firebird warehouse setup in dbt."
id: "firebird-setup"
meta:
  maintained_by: Community
  authors: 'Fernando Lozer (https://github.com/flozer)'
  github_repo: 'flozer/dbt-firebird'
  pypi_package: 'dbt-firebird'
  min_core_version: 'v1.8.0'
  cloud_support: Not Supported
  min_supported_version: 'Firebird 3.0'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'Firebird'
  config_page: '/reference/resource-configs/no-configs'
availability: local_free
---


:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>


The <a href="https://pypi.org/project/dbt-firebird/">dbt-firebird</a> adapter connects <Constant name="core" /> to <a href="https://firebirdsql.org/">Firebird</a> databases (3.0, 4.0, and 5.0) through the official <a href="https://pypi.org/project/firebird-driver/">firebird-driver</a> package. It supports table, view, incremental, seed, and snapshot (SCD2) materializations, data tests, generated documentation, and an interactive `dbt init` experience.

The adapter is validated against the official <Constant name="core" /> test suites and a CI matrix covering Firebird 3/4/5 on Python 3.9 to 3.12.

## Installing dbt-firebird

```shell
pip install dbt-firebird dbt-core
```

## Connecting to Firebird with dbt-firebird

Firebird databases are single files. The `path` field is the database file path **as seen by the server**. If dbt runs on the same machine as the server, this is a normal local path; for a remote server, it is a server-side path (for example, `/data/prod.fdb` on Linux).

### Local (server on the same machine)

<File name='~/.dbt/profiles.yml'>

```yaml
lakehouse:
  target: dev
  outputs:
    dev:
      type: firebird
      path: C:/data/mydb.fdb
      user: SYSDBA
      password: masterkey
      threads: 1
```

</File>

### Remote server

<File name='~/.dbt/profiles.yml'>

```yaml
lakehouse:
  target: dev
  outputs:
    dev:
      type: firebird
      host: 192.168.0.10
      port: 3050
      path: /data/prod.fdb
      user: SYSDBA
      password: masterkey
      charset: WIN1252
      threads: 1
```

</File>

#### Description of Firebird Profile Fields

| Field | Description | Required? | Example |
|-------|-------------|-----------|---------|
| type | The specific adapter to use | Required | `firebird` |
| path | Database file path as seen by the **server**. Use forward slashes | Required | `C:/data/mydb.fdb` |
| host | Server hostname or IP. Omit it to connect to a local file directly | Optional | `192.168.0.10` |
| port | Server TCP port | Optional (default `3050`) | `3050` |
| user | Database user | Required | `SYSDBA` |
| password | Password | Required | `masterkey` |
| charset | Connection character set. See [Character sets](#character-sets) | Optional (default `UTF8`) | `WIN1252` |
| role | Firebird role, if you use them | Optional | `RDB$ADMIN` |
| lock_timeout | Seconds a statement waits for a lock held by another transaction before failing. `0` = do not wait, `-1` = wait indefinitely | Optional (default `10`) | `30` |
| threads | Parallel model executions. `1` is recommended | Optional (default `1`) | `1` |
| database | Logical label used internally by dbt. Never rendered in SQL. Defaults to the file base name | Optional | `mydb` |
| schema | Logical label used internally by dbt. Firebird has no schemas, so this is never rendered in SQL. Defaults to `main` | Optional | `main` |

`dbt init` also works: it lists `firebird`, asks for every field above, writes the profile, and runs `dbt debug` at the end.

## Character sets

| Situation | `charset` |
|-----------|-----------|
| Database created with `UTF8`, or plain ASCII data | `UTF8` (default) |
| Legacy/restored databases with character set `NONE` and accented data (for example, WIN1252) | `WIN1252` |

If reads fail with `UnicodeDecodeError: 'utf-8' codec can't decode byte ...`, set `charset: WIN1252` — this is the most common case for legacy Brazilian Firebird databases.

## Object naming and case sensitivity

Unquoted identifiers in Firebird SQL are stored as UPPERCASE. The dbt adapter creates its objects with quoted, lowercase names (the same convention as the Postgres adapter), so a model named `clientes` becomes the table `"clientes"`:

```sql
select * from "clientes";  -- correct (quoted)
select * from clientes;    -- looks for CLIENTES, which does not exist
```

To expose objects in the unquoted/uppercase style, set a model or seed alias in uppercase:

```yaml
seeds:
  my_project:
    store:
      +alias: STORE
```

## Supported features

- Materializations: `table` (atomic swap), `view` (`CREATE OR ALTER`), `incremental` (strategies `append`, `delete+insert`, `merge`), `seed` (atomic data replacement), and `snapshot` (strategies `check` and `timestamp`)
- `on_schema_change` handling (`ignore`, `fail`, `append`, `sync_all`)
- Data tests, generic and singular
- `dbt docs generate` and `persist_docs` (writes `COMMENT ON` statements)
- Automatic retries for lock conflicts and a configurable `lock_timeout`

### Limitations

- The `ephemeral` materialization is not supported: dbt generates inline CTEs with names starting with an underscore, which are invalid as unquoted Firebird identifiers
- Firebird has no schemas: the `database` and `schema` profile fields are logical labels only
- Model and seed names should be at most 22 characters on Firebird 3 (dbt appends suffixes like `__dbt_tmp` to the 31-byte identifier limit; Firebird 4+ allows 63)
- Model contracts (`contract: enforced`) are best effort: declare Firebird-native data types in your YAML
- Models without a `FROM` clause are invalid in Firebird SQL (for example, use `select 1 as id from rdb$database`)
- `threads: 1` is recommended; the adapter is resilient to write conflicts, but Firebird applies table-level coordination across parallel writers in the same namespace

## Database privileges

The profile user needs read and write access to the objects dbt manages, plus permission to create and alter tables and views:

| Privilege |
|-----------|
| SELECT |
| INSERT |
| UPDATE |
| DELETE |
| CREATE (tables and views) |
| ALTER |
| DROP |

For SYSDBA or the database owner, no extra grants are needed.

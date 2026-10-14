---
title: "Sail setup"
sidebar_label: "Sail"
description: "Read this guide to learn about the Sail setup in dbt."
id: "sail-setup"
meta:
  maintained_by: LakeSail
  authors: 'LakeSail'
  github_repo: 'lakehq/dbt-sail'
  pypi_package: 'dbt-sail'
  min_core_version: 'v1.8.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: 'LakeSail Community Slack'
  slack_channel_link: 'https://www.launchpass.com/lakesail-community/free'
  platform_name: 'Sail'
  config_page: '/reference/resource-configs/spark-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Connecting to Sail with **dbt-sail**

[Sail](https://github.com/lakehq/sail) is a drop-in replacement for Apache Spark, built and maintained by [LakeSail](https://lakesail.com/). Sail implements the Spark Connect protocol, so `dbt-sail` is a thin wrapper around `dbt-spark` that connects to Sail instead of JVM Spark. `dbt-sail` supports the same feature set as `dbt-spark`.

`dbt-sail` supports two connection modes:

- `embedded` - starts a Sail server in-process via [`pysail`](https://pypi.org/project/pysail/). No external server required.
- `remote` - connects to an already-running Sail server via Spark Connect.

## Profile configuration

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sail
      mode: embedded   # or 'remote'
      host: 127.0.0.1  # required for 'remote'; defaults to 127.0.0.1 for 'embedded'
      port: 50051      # used by 'remote'; ignored by 'embedded'
      schema: SCHEMA_NAME
      threads: 1
```

</File>

| Field | Description | Required? | Default |
| ----- | ----------- | --------- | ------- |
| `type` | Must be `sail`. | Required | - |
| `mode` | Connection mode. Either `embedded` or `remote`. | Required | - |
| `host` | Hostname of the Sail server. Required for `remote` mode. | Required for `remote` | `127.0.0.1` (embedded) |
| `port` | Spark Connect port on the Sail server. Used by `remote` mode. | Optional | `50051` |
| `schema` | Default schema where dbt builds objects. | Required | - |
| `threads` | Number of threads for dbt to use. | Optional | `1` |
| `server_side_parameters` | Map of parameters passed through to the underlying Spark session. | Optional | `{}` |

Because `dbt-sail` extends `dbt-spark`, additional `dbt-spark` profile fields are also accepted. See the [Apache Spark setup](/docs/local/connect-data-platform/spark-setup) page for the full list.

### Example: embedded mode

<File name='~/.dbt/profiles.yml'>

```yaml
my_sail_project:
  target: dev
  outputs:
    dev:
      type: sail
      mode: embedded
      schema: analytics
      threads: 4
```

</File>

### Example: remote mode

<File name='~/.dbt/profiles.yml'>

```yaml
my_sail_project:
  target: dev
  outputs:
    dev:
      type: sail
      mode: remote
      host: sail.internal
      port: 50051
      schema: analytics
      threads: 4
```

</File>

## Resource configuration

`dbt-sail` accepts the same resource configurations as `dbt-spark`. See the [Apache Spark configurations](/reference/resource-configs/spark-configs) page for materialization options, incremental strategies, and other model-level configs.

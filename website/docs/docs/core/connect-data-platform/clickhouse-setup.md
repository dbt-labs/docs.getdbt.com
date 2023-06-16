---
title: "ClickHouse setup"
description: "Read this guide to learn about the ClickHouse warehouse setup in dbt."
meta:
  maintained_by: Community
  authors: 'Geoff Genz'
  github_repo: 'ClickHouse/dbt-clickhouse'
  pypi_package: 'dbt-clickhouse'
  min_core_version: 'v0.19.0'
  cloud_support: Not Supported
  min_supported_version: '?'
  slack_channel_name: '#db-clickhouse'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01DRQ178LQ'
  platform_name: 'Clickhouse'
  config_page: '/reference/resource-configs/clickhouse-configs'
---

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Connecting to ClickHouse with **dbt-clickhouse**

To connect to ClickHouse from dbt, you'll need to add a [profile](https://docs.getdbt.com/docs/core/connection-profiles) to your `profiles.yml` file. A ClickHouse profile conforms to the following syntax:

<File name='profiles.yml'>

```yaml
<profile-name>:
  target: <target-name>
  outputs:
    <target-name>:
      type: clickhouse
      schema: <database-name>
      user: <username>
      password: <password>
      #optional fields
      driver: http|native
      port: <port>
      host: <hostname>
      retries: 1
      verify: False
      secure: True
      connect_timeout: 10
      send_receive_timeout: 300
      sync_request_timeout: 5
      compression: False
      compress_block_size: 1048576
      database_engine: <db_engine>
      check_exchange: True
      use_lw_deletes: False
      custom_settings: <empty>
      
```

</File>

#### Description of ClickHouse Profile Fields


| Field                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `type`                 | This must be included either in `profiles.yml` or in the `dbt_project.yml` file. Must be set to `clickhouse`.                                                                                                                                                                                                                                                                                                                                                                |
| `schema`               | Required. A ClickHouse's database name. The dbt model database.schema.table is not compatible with ClickHouse because ClickHouse does not support a schema. So we use a simple model schema.table, where schema is the ClickHouse's database. We don't recommend using the `default` database.                                                                                                                                                                               |
| `user`                 | Required. A ClickHouse username with adequate permissions to access the specified `schema`.                                                                                                                                                                                                                                                                                                                                                                                  |
| `password`             | Required. The password associated with the specified `user`.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `driver`               | Optional. The ClickHouse client interface, `http` or `native`.  Defaults to `http` unless the `port` is set to 9440 or 9400, in which case the `native` driver is assumed.                                                                                                                                                                                                                                                                                                   |
| `port`                 | Optional. ClickHouse server port number.  Defaults to 8123/8443 (secure) if the driver is `http`, and to 9000/9440(secure) if the driver is `native`.                                                                                                                                                                                                                                                                                                                        |
| `host`                 | Optional. The host name of the connection. Default is `localhost`.                                                                                                                                                                                                                                                                                                                                                                                                           |
| `retries`              | Optional. Number of times to retry the initial connection attempt if the error appears to be recoverable.                                                                                                                                                                                                                                                                                                                                                                    |
| `verify`               | Optional. For (`secure=True`) connections, validate the ClickHouse server TLS certificate, including matching hostname, expiration, and signed by a trusted Certificate Authority. Defaults to True.                                                                                                                                                                                                                                                                         |
| `secure`               | Optional. Whether the connection (either http or native) is secured by TLS.  This converts an http driver connection to https, and a native driver connection to the native ClickHouse protocol over TLS.  the Defaults to False.                                                                                                                                                                                                                                            |
| `cluster_mode`         | Optional. Add connection settings to improve compatibility with clusters using the Replicated Database Engine. Default False.                                                                                                                                                                                                                                                                                                                                                |
| `connect_timeout`      | Optional. Connection timeout in seconds. Defaults is 10 seconds.                                                                                                                                                                                                                                                                                                                                                                                                             |
| `send_receive_timeout` | Optional. Timeout for receiving data from or sending data to ClickHouse.  Defaults to 5 minutes (300 seconds)                                                                                                                                                                                                                                                                                                                                                                |
| `sync_request_timeout` | Optional. Timeout for connection ping request (native connection only).  Defaults to 5 seconds.                                                                                                                                                                                                                                                                                                                                                                              |
| `compression`          | Optional. Use compression in the connection.  Defaults to `False`.  If set to `True` for HTTP, this enables gzip compression.  If set to `True` for the native protocol, this enabled lz4 compression.  Other valid values are `lz4hc` and `zstd` for the native driver only.                                                                                                                                                                                                |
| `compress_block_size`  | Optional. Compression block size (in bytes) when using compression with the native driver.  Defaults to 1MB                                                                                                                                                                                                                                                                                                                                                                  |
| `database_engine`      | Optional. Database engine to use when creating new ClickHouse schemas (databases).  If not set (the default), new databases will use the default ClickHouse database engine (usually Atomic).                                                                                                                                                                                                                                                                                |
| `check_exchange`       | Optional. On connecting to the ClickHouse, if this is parameter is `True` DBT will validate that the ClickHouse server supports atomic exchange of tables.  Using atomic exchange (when available) improves reliability and parallelism.  This check is unnecessary for ClickHouse running on recent Linux operating system, and in those circumstances can be disabled by setting `check_exchange` to `False` to avoid additional overhead on startup.  Defaults to `True`. |
| `use_lw_deletes`       | Optional. If ClickHouse experimental lightweight deletes are available, use the `delete+insert` strategy as the default strategy for incremental materializations.  Defaults to `False` (use legacy strategy).                                                                                                                                                                                                                                                               |
| `custom_settings`      | Optional. A mapping of ClickHouse specific user settings to use with the connection.  See the ClickHouse documentation for supported settings.                                                                                                                                                                                                                                                                                                                               |

#### Troubleshooting Connections

If you encounter issues connecting to ClickHouse from dbt, make sure the following criteria are met:
- The engine must be one of the [supported engines](/reference/resource-configs/clickhouse-configs#supported-table-engines).
- You must have adequate permissions to access the database.
- If you're not using the default table engine for the database, you must specify a table engine in your model configuration.

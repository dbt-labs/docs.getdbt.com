---
title: "ClickHouse setup"
description: "Read this guide to learn about the ClickHouse warehouse setup in dbt."
meta:
  maintained_by: Community
  authors: 'Geoff Genz & Bentsi Leviav'
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

Some core functionality may be limited. If you're interested in contributing, check out the source code for each
repository listed below.

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Connecting to ClickHouse with **dbt-clickhouse**

To connect to ClickHouse from dbt, you'll need to add a [profile](https://docs.getdbt.com/docs/core/connection-profiles)
to your `profiles.yml` file. A ClickHouse profile conforms to the following syntax:

<File name='profiles.yml'>

```yaml
<profile-name>:
  target: <target-name>
  outputs:
    <target-name>:
      type: clickhouse
      schema: [ default ] # ClickHouse database for dbt models

      # optional
      driver: [ http ] # http or native.  If not configured, this will be auto-determined based on the port setting
      host: [ localhost ]
      port: [ 8123 ]  # Defaults to 8123, 8443, 9000, 9440 depending on the secure and driver settings 
      user: [ default ] # User for all database operations
      password: [ <empty string> ] # Password for the user
      cluster: [ <empty string> ] # If configured, certain DDL/table operations will be executed with the `ON CLUSTER` clause using this cluster. Distributed materializations require this setting to work. See the following ClickHouse Cluster section for more details.
      verify: [ True ] # Validate TLS certificate if using TLS/SSL
      secure: [ False ] # Use TLS (native protocol) or HTTPS (http protocol)
      retries: [ 1 ] # Number of times to retry a "retriable" database exception (such as a 503 'Service Unavailable' error)
      compression: [ <empty string> ] # Use gzip compression if truthy (http), or compression type for a native connection
      connect_timeout: [ 10 ] # Timeout in seconds to establish a connection to ClickHouse
      send_receive_timeout: [ 300 ] # Timeout in seconds to receive data from the ClickHouse server
      cluster_mode: [ False ] # Use specific settings designed to improve operation on Replicated databases (recommended for ClickHouse Cloud)
      use_lw_deletes: [ False ] # Use the strategy `delete+insert` as the default incremental strategy.
      check_exchange: [ True ] # Validate that clickhouse support the atomic EXCHANGE TABLES command.  (Not needed for most ClickHouse versions)
      local_suffix: [ _local ] # Table suffix of local tables on shards for distributed materializations.
      local_db_prefix: [ <empty string> ] # Database prefix of local tables on shards for distributed materializations. If empty, it uses the same database as the distributed table.
      allow_automatic_deduplication: [ False ] # Enable ClickHouse automatic deduplication for Replicated tables
      tcp_keepalive: [ False ] # Native client only, specify TCP keepalive configuration. Specify custom keepalive settings as [idle_time_sec, interval_sec, probes].
      custom_settings: [ { } ] # A dictionary/mapping of custom ClickHouse settings for the connection - default is empty.

      # Native (clickhouse-driver) connection settings
      sync_request_timeout: [ 5 ] # Timeout for server ping
      compress_block_size: [ 1048576 ] # Compression block size if compression is enabled


```

</File>

### Description of ClickHouse Profile Fields

| Field                           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|---------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `type`                          | This must be included either in `profiles.yml` or in the `dbt_project.yml` file. Must be set to `clickhouse`.                                                                                                                                                                                                                                                                                                                                                                |
| `schema`                        | Required. A ClickHouse's database name. The dbt model database.schema.table is not compatible with ClickHouse because ClickHouse does not support a schema. So we use a simple model schema.table, where schema is the ClickHouse's database. We don't recommend using the `default` database.                                                                                                                                                                               |
| `driver`                        | Optional. The ClickHouse client interface, `http` or `native`.  Defaults to `http` unless the `port` is set to 9440 or 9400, in which case the `native` driver is assumed.                                                                                                                                                                                                                                                                                                   |
| `host`                          | Optional. The host name of the connection. Default is `localhost`.                                                                                                                                                                                                                                                                                                                                                                                                           |
| `port`                          | Optional. ClickHouse server port number.  Defaults to 8123/8443 (secure) if the driver is `http`, and to 9000/9440(secure) if the driver is `native`.                                                                                                                                                                                                                                                                                                                        |
| `user`                          | Required. A ClickHouse username with adequate permissions to access the specified `schema`.                                                                                                                                                                                                                                                                                                                                                                                  |
| `password`                      | Required. The password associated with the specified `user`.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `cluster`                       | Optional. If set, certain DDL/table operations will be executed with the `ON CLUSTER` clause using this cluster. Distributed materializations require this setting to work. See the following ClickHouse Cluster section for more details.                                                                                                                                                                                                                                   |
| `verify`                        | Optional. For (`secure=True`) connections, validate the ClickHouse server TLS certificate, including matching hostname, expiration, and signed by a trusted Certificate Authority. Defaults to True.                                                                                                                                                                                                                                                                         |
| `secure`                        | Optional. Whether the connection (either http or native) is secured by TLS.  This converts an http driver connection to https, and a native driver connection to the native ClickHouse protocol over TLS.  the Defaults to False.                                                                                                                                                                                                                                            |
| `retries`                       | Optional. Number of times to retry the initial connection attempt if the error appears to be recoverable.                                                                                                                                                                                                                                                                                                                                                                    |
| `compression`                   | Optional. Use compression in the connection.  Defaults to `False`.  If set to `True` for HTTP, this enables gzip compression.  If set to `True` for the native protocol, this enabled lz4 compression.  Other valid values are `lz4hc` and `zstd` for the native driver only.                                                                                                                                                                                                |
| `connect_timeout`               | Optional. Connection timeout in seconds. Defaults is 10 seconds.                                                                                                                                                                                                                                                                                                                                                                                                             |
| `send_receive_timeout`          | Optional. Timeout for receiving data from or sending data to ClickHouse.  Defaults to 5 minutes (300 seconds)                                                                                                                                                                                                                                                                                                                                                                |
| `cluster_mode`                  | Optional. Add connection settings to improve compatibility with clusters using the Replicated Database Engine. Default False.                                                                                                                                                                                                                                                                                                                                                |
| `use_lw_deletes`                | Optional. If ClickHouse experimental lightweight deletes are available, use the `delete+insert` strategy as the default strategy for incremental materializations.  Defaults to `False` (use legacy strategy).                                                                                                                                                                                                                                                               |
| `check_exchange`                | Optional. On connecting to the ClickHouse, if this is parameter is `True` DBT will validate that the ClickHouse server supports atomic exchange of tables.  Using atomic exchange (when available) improves reliability and parallelism.  This check is unnecessary for ClickHouse running on recent Linux operating system, and in those circumstances can be disabled by setting `check_exchange` to `False` to avoid additional overhead on startup.  Defaults to `True`. |
| `local_suffix`                  | Optional. Table suffix of local tables on shards for distributed materializations. Defaults to '_local'.                                                                                                                                                                                                                                                                                                                                                                     |
| `local_db_prefix`               | Optional. Database prefix of local tables on shards for distributed materializations. If empty, it uses the same database as the distributed table. Defaults to empty string.                                                                                                                                                                                                                                                                                                |
| `allow_automatic_deduplication` | Optional. Enable ClickHouse automatic deduplication for Replicated tables. Defaults to False.                                                                                                                                                                                                                                                                                                                                                                                |
| `tcp_keepalive`                 | Optional. Native client only, specify TCP keepalive configuration. Specify custom keepalive settings as `idle_time_sec`, `interval_sec`, `probes`. Defaults to False.                                                                                                                                                                                                                                                                                                        |
| `sync_request_timeout`          | Optional. Timeout for connection ping request (native connection only).  Defaults to 5 seconds.                                                                                                                                                                                                                                                                                                                                                                              |
| `compress_block_size`           | Optional. Compression block size (in bytes) when using compression with the native driver.  Defaults to 1MB                                                                                                                                                                                                                                                                                                                                                                  |
| `database_engine`               | Optional. Database engine to use when creating new ClickHouse schemas (databases).  If not set (the default), new databases will use the default ClickHouse database engine (usually Atomic).                                                                                                                                                                                                                                                                                |
| `custom_settings`               | Optional. A mapping of ClickHouse specific user settings to use with the connection.  See the ClickHouse documentation for supported settings.                                                                                                                                                                                                                                                                                                                               |

## Troubleshooting Connections

If you encounter issues connecting to ClickHouse from dbt, make sure the following criteria are met:

- The engine must be one of the [supported engines](/reference/resource-configs/clickhouse-configs#supported-table-engines).
- You must have adequate permissions to access the database.
- If you're not using the default table engine for the database, you must specify a table engine in your model
  configuration.

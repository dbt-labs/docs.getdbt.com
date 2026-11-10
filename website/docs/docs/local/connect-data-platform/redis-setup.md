---
title: "Connect Redis to dbt v1"
sidebar_label: "Redis"
description: "Read this guide to learn about the Redis setup in dbt."
id: "redis-setup"
meta:
  maintained_by: Community
  authors: 'Albert T. Wong'
  github_repo: 'redis/redis-dbt-adapter'
  pypi_package: 'dbt-redis-adbc'
  min_core_version: 'v1.10.0'
  cloud_support: Not Supported
  min_supported_version: 'Redis 8.x'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'Redis'
  config_page: '/reference/resource-configs/redis-configs'
availability:
  surface: local
  engine: v1
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

The [`dbt-redis-adbc` adapter](https://github.com/redis/redis-dbt-adapter) connects <Constant name="core" /> to Redis through the [Redis Arrow Database Connectivity (ADBC) driver](https://github.com/redis/redis-adbc-driver). It supports Python-based dbt v1. It does not support v2 or the <Constant name="dbt_platform" />.

This page describes `dbt-redis-adbc` 0.2.0, which is tested with Redis ADBC driver 0.0.18 and Python 3.13.

## Prerequisites

- Python 3.13 or later
- `dbt-core>=1.10,<2` and `dbt-adapters>=1.16,<2`
- Redis 8.x with the Query Engine (Search) enabled; the adapter's integration tests run against a Redis Enterprise cluster with TLS and username and password authentication
- A Redis ADBC shared library for your operating system and architecture
- A Redis user with the [driver's required access control list permissions](https://github.com/redis/redis-adbc-driver/blob/main/docs/driver-reference.md#acl-users)

The driver requires Redis Search commands, including `FT._LIST` and `FT.CREATE`. Refer to the driver's [server requirements](https://github.com/redis/redis-adbc-driver/blob/main/docs/driver-reference.md#server-requirements) for deployment compatibility. Valkey and Redis 7.2 derivatives, including Amazon ElastiCache and Google Cloud Memorystore, are not supported because they lack commands and functions that the driver requires. Redis Flex databases are also not supported.

## Install the driver

The `pip` command above installs the adapter. It does not install the Redis ADBC shared library.

Run `dbt --version` to confirm the installation. The output lists `redis_adbc` under plugins.

Download and extract the shared-library archive for your platform from the [Redis ADBC driver releases](https://github.com/redis/redis-adbc-driver/releases). Adapter version 0.2.0 is tested with driver release [v0.0.18](https://github.com/redis/redis-adbc-driver/releases/tag/v0.0.18). Each archive has a matching `.sha256` file that you can use to verify the download. Prebuilt libraries are available for macOS Apple Silicon, Linux x86-64, and Linux arm64. Other platforms require a [source build](https://github.com/redis/redis-adbc-driver#quick-start).

## Configure your connection

Export the driver location and your connection settings in the shell where you run dbt. `REDIS_ADBC_DRIVER` is the extracted library's absolute path; the file ends in `.dylib` on macOS and `.so` on Linux. Use a `rediss://` URI for a TLS connection, or a `redis://` URI for a server without TLS:

```shell
export REDIS_ADBC_DRIVER=/ABSOLUTE/PATH/TO/libadbc_driver_redis.dylib
export REDIS_URI=rediss://YOUR_REDIS_HOST:YOUR_REDIS_PORT/0
export REDIS_USERNAME=YOUR_REDIS_USERNAME
export REDIS_PASSWORD=YOUR_REDIS_PASSWORD
```

If a private certificate authority (CA) signed the server's certificate, also export the path to its PEM bundle. Leave it unset for a certificate that your system already trusts. The CA bundle requires a `rediss://` URI.

```shell
export REDIS_TLS_CA_FILE=/ABSOLUTE/PATH/TO/redis-ca.pem
```

Add this profile to `~/.dbt/profiles.yml`. The profile reads the variables you exported. dbt fails to read the profile if `REDIS_ADBC_DRIVER` or `REDIS_URI` is unset:

<File name="~/.dbt/profiles.yml">

```yaml
redis_project:
  target: dev
  outputs:
    dev:
      type: redis_adbc
      driver: "{{ env_var('REDIS_ADBC_DRIVER') }}"
      uri: "{{ env_var('REDIS_URI') }}"
      username: "{{ env_var('REDIS_USERNAME', '') }}"
      password: "{{ env_var('REDIS_PASSWORD', '') }}"
      driver_options:
        adbc.redis.tls_ca_file: "{{ env_var('REDIS_TLS_CA_FILE', '') }}"
      database: redis
      schema: analytics
      threads: 4
```

</File>

Then set your project's `profile` to `redis_project`:

<File name="dbt_project.yml">

```yaml
profile: redis_project
```

</File>

Use separate `username` and `password` fields instead of embedding credentials in the URI.

| Field | Required | Description |
| --- | --- | --- |
| `type` | Yes | Must be `redis_adbc`. |
| `driver` | Unless `REDIS_ADBC_DRIVER` is set | Path to the Redis ADBC shared library. If you omit the extension, the adapter adds `.dylib` on macOS, `.so` on Linux, or `.dll` on Windows. |
| `uri` | No | Redis connection URI: `rediss://` for TLS, or `redis://` without TLS. Defaults to `redis://localhost:6379/0`. Use database 0 for Redis Cluster. |
| `username` | No | Redis ACL username. |
| `password` | No | Redis password. |
| `database` | No | The driver's single catalog, `redis`; defaults to `redis`. |
| `schema` | Yes | Default SQL schema for dbt relations. |
| `threads` | No | Number of concurrent dbt threads; the example uses `4`. |
| `aggregate_pushdown` | No | Driver aggregate pushdown mode: `exact`, `all`, or `none`. Unset values use the driver's default. |
| `rename_rekey` | No | Boolean that moves a renamed table's rows to keys matching its new name. This copies every row again during a dbt table build. |
| `time_zone` | No | Session time zone, such as `America/New_York`. The driver defaults to UTC. |
| `read_timeout` | No | Time to wait for each reply: a duration such as `30s` or `10m`, a number of seconds, or `0` for no timeout. The driver defaults to five minutes. |
| `write_timeout` | No | Time to send each command, using the same format and default as `read_timeout`. |
| `driver_options` | No | Mapping of additional [driver options](https://github.com/redis/redis-adbc-driver/blob/main/docs/driver-reference.md#options), such as `adbc.redis.tls_ca_file`, to string, numeric, or Boolean values. Options with their own profile field must use that field instead. |

Run `dbt debug` from your project directory to verify the connection. For materializations and limitations, refer to [Redis configurations](/reference/resource-configs/redis-configs).

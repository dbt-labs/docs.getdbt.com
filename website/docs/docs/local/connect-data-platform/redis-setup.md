---
title: "Connect Redis to dbt v1"
sidebar_label: "Redis"
description: "Install dbt-redis-adbc and configure a Redis connection for dbt v1."
id: "redis-setup"
availability:
  surface: local
  engine: v1
---

The community-maintained [`dbt-redis-adbc` adapter](https://github.com/alberttwong/redis-dbt-adapter-with-project) connects <Constant name="core" /> to Redis through the [Redis Arrow Database Connectivity (ADBC) driver](https://github.com/alberttwong/redis-adbc-driver). Albert T. Wong maintains the adapter. It supports Python-based dbt v1; it does not support v2 or the dbt platform.

## Prerequisites

- Python 3.10 or later
- `dbt-core>=1.10,<2` and `dbt-adapters>=1.16,<2`
- Redis 8.x with the Query Engine (Search) enabled; the adapter's continuous integration tests use Redis 8.6.2
- A Redis ADBC shared library for your operating system and architecture
- A Redis user with the [driver's required access control list permissions](https://github.com/alberttwong/redis-adbc-driver#acl-users)

The driver requires Redis Search commands, including `FT._LIST` and `FT.CREATE`. Refer to the driver's [server requirements](https://github.com/alberttwong/redis-adbc-driver#server-requirements) for deployment compatibility. Valkey and Redis 7.2 derivatives are not supported.

## Install the adapter and driver

Install the adapter from its public GitHub repository. The adapter package is in the `adapter` subdirectory:

```shell
python -m pip install "dbt-redis-adbc @ git+https://github.com/alberttwong/redis-dbt-adapter-with-project.git#subdirectory=adapter"
```

Download and extract the shared-library archive for your platform from the [Redis ADBC driver releases](https://github.com/alberttwong/redis-adbc-driver/releases). The example project's pinned driver release is [v0.0.14](https://github.com/alberttwong/redis-adbc-driver/releases/tag/v0.0.14). Prebuilt libraries are available for macOS Apple Silicon, Linux x86-64, and Linux arm64. Other platforms require a [source build](https://github.com/alberttwong/redis-adbc-driver#quick-start).

Set `REDIS_ADBC_DRIVER` to the extracted library's absolute path, or provide the path in your profile's `driver` field. Installing the adapter installs its Python dependencies, but does not install the shared library.

## Configure your profile

Set your dbt project's `profile` to `redis_project`, then add this target to `~/.dbt/profiles.yml`:

<File name="~/.dbt/profiles.yml">

```yaml
redis_project:
  target: dev
  outputs:
    dev:
      type: redis_adbc
      driver: "{{ env_var('REDIS_ADBC_DRIVER') }}"
      uri: "{{ env_var('REDIS_URI', 'redis://localhost:6379/0') }}"
      username: "{{ env_var('REDIS_USERNAME', '') }}"
      password: "{{ env_var('REDIS_PASSWORD', '') }}"
      database: redis
      schema: analytics
      threads: 4
```

</File>

Use separate `username` and `password` fields instead of embedding credentials in the URI. For a TLS connection, use a `rediss://` URI.

| Field | Required | Description |
| --- | --- | --- |
| `type` | Yes | Must be `redis_adbc`. |
| `driver` | Unless `REDIS_ADBC_DRIVER` is set | Path to the Redis ADBC shared library. If you omit the extension, the adapter adds `.dylib` on macOS, `.so` on Linux, or `.dll` on Windows. |
| `uri` | No | Redis connection URI. Defaults to `redis://localhost:6379/0`. Use database 0 for Redis Cluster. |
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
| `driver_options` | No | Mapping of additional [driver options](https://github.com/alberttwong/redis-adbc-driver#options) to string, numeric, or Boolean values. Options with their own profile field must use that field instead. |

Run `dbt debug --profile redis_project` from your project to verify the connection. For materializations and limitations, refer to [Redis configurations](/reference/resource-configs/redis-configs).

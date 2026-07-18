---
title: "Connect IBM Db2 to dbt Core"
sidebar_label: "IBM Db2"
description: "Read this guide to learn about the IBM Db2 setup in dbt."
id: "ibm-db2-setup"
meta:
  maintained_by: IBM
  authors: Shubham Kapoor, Amit Kumar
  github_repo: 'IBM/db2-dbt'
  pypi_package: 'ibm-dbt-db2'
  min_core_version: v1.11.0
  cloud_support: 'Not Supported'
  min_supported_version: 'IBM Db2 LUW 9.7+, z/OS 11+, iSeries'
  slack_channel_name: 
  slack_channel_link: 
  platform_name: IBM Db2
  config_page: /reference/resource-configs/ibm-db2-config
---


The `ibm-dbt-db2` adapter allows you to use dbt to transform and manage data on IBM Db2, leveraging its robust SQL capabilities across LUW (Linux, Unix, Windows), z/OS, and iSeries platforms. Before proceeding, ensure you have the following:
- An active IBM Db2 database instance (LUW, z/OS, or iSeries) with connection details (host, port, database, schema, etc).
- Authentication credentials: Username and password.
- Python 3.10, 3.11, or 3.12 (Python 3.9 not supported due to dbt-core 1.11+ requirements).

Note: This adapter is not compatible with dbt Core v2.

Refer to [Configuring ibm-dbt-db2](https://github.com/IBM/db2-dbt) to learn more about obtaining and organizing these details.


import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>


## Connecting to IBM Db2

To connect dbt with IBM Db2, you need to configure a profile in your `profiles.yml` file located in the `.dbt/` directory of your home folder. The following is an example configuration for connecting to IBM Db2 instances:

<File name='~/.dbt/profiles.yml'>

```yaml
my_db2_project:
  outputs:
    dev:
      type: db2
      host: [hostname]
      port: 50000
      database: [database name]
      schema: [schema name]
      username: [username]
      password: [password]
      threads: [1 or more]

  target: dev

```

</File>


### Connection with SSL/TLS

For secure connections, you can configure SSL/TLS parameters:

<File name='~/.dbt/profiles.yml'>

```yaml
my_db2_project:
  outputs:
    prod:
      type: db2
      host: [hostname]
      port: 50001
      database: [database name]
      schema: [schema name]
      username: [username]
      password: [password]
      threads: [1 or more]
      # SSL/TLS settings
      security: SSL
      ssl_server_certificate: /path/to/server-ca.crt
      ssl_client_hostname_validation: true
      retries: 3

  target: prod

```

</File>


### Connection using DSN

Alternatively, you can use a Data Source Name (DSN) configured in your Db2 client:

<File name='~/.dbt/profiles.yml'>

```yaml
my_db2_project:
  outputs:
    dev:
      type: db2
      dsn: MY_DB2_DSN
      schema: [schema name]
      threads: [1 or more]

  target: dev

```

</File>


## Host parameters

Use the following required and optional profile fields to configure IBM Db2 connections.

| Option    | Required/Optional | Description | Example  |
| --------- | ------- | ------- | ----------- |
|   `type`  | Required | The adapter type. Must be `db2`. | `db2` |
|   `host`  | Required* | Hostname for connecting to Db2. | `localhost` |
|   `port`  | Optional | The port for connecting to Db2. | `50000` |
| `database`| Required | The database name in your Db2 instance. | `SAMPLE` |
|  `schema` | Required | The schema name within your Db2 instance database. | `ADMIN`  |
| `username`| Required | Username for authentication. | `db2user` |
| `password`| Required | Password for authentication. | `password` |
| `threads` | Optional | Number of threads for parallel execution. | `8` |
|   `dsn`   | Optional | Data Source Name (alternative to host/port/database). | `MY_DB2_DSN` |

*Not required if using `dsn`

### Optional SSL/TLS Parameters

| Option    | Required/Optional | Description | Example  |
| --------- | ------- | ------- | ----------- |
| `security` | Optional | Security protocol. Use `SSL` to enable SSL/TLS. | `SSL` |
| `ssl_server_certificate` | Optional | Path to server CA certificate file for SSL verification. | `/path/to/server-ca.crt` |
| `ssl_client_keystore` | Optional | Path to client keystore database (.kdb file) for mutual TLS. | `/path/to/client.kdb` |
| `ssl_client_keystash` | Optional | Path to client keystash file (.sth file). | `/path/to/client.sth` |
| `ssl_client_hostname_validation` | Optional | Enable hostname verification (true/false). | `true` |
| `retries` | Optional | Number of connection retry attempts. | `3` |


## Schemas and databases
When selecting the database and the schema, make sure you have read and write access to both. This selection does not limit your ability to query the database. Instead, they serve as the default location for where tables and views are materialized.


## Supported features

| Feature | Supported | Notes |
|---------|-----------|-------|
| Table materialization | ✅ Yes | |
| View materialization | ✅ Yes | |
| Incremental materialization | ✅ Yes | Supports `merge` and `delete+insert` strategies |
| Ephemeral materialization | ✅ Yes | |
| Seeds | ✅ Yes | Requires explicit data type configuration |
| Snapshots | ✅ Yes | |
| Tests | ✅ Yes | |
| Documentation | ✅ Yes | |
| Sources | ✅ Yes | |
| Custom schemas | ✅ Yes | |
| Grants | ✅ Yes | |
| Constraints | ⚠️ Partial | NOT NULL enforced, others not enforced |


## Data types

The adapter maps dbt data types to Db2 types:

| dbt Type | Db2 Type |
|----------|----------|
| string | VARCHAR |
| text | VARCHAR(max_length) |
| integer | INTEGER |
| bigint | BIGINT |
| float | FLOAT |
| numeric | DECIMAL |
| boolean | BOOLEAN |
| timestamp | TIMESTAMP |
| date | DATE |
| time | TIME |


## Incremental models

The `ibm-dbt-db2` adapter supports two incremental strategies:

1. **merge** (default) - Uses Db2's MERGE statement for efficient upserts
2. **delete+insert** - Deletes matching records then inserts new ones

Example incremental model:

```sql
{{
  config(
    materialized='incremental',
    unique_key='id',
    incremental_strategy='merge'
  )
}}

SELECT * FROM source_table
{% if is_incremental() %}
WHERE updated_at > (SELECT MAX(updated_at) FROM {{ this }})
{% endif %}
```


## Case sensitivity

Db2 uppercases unquoted identifiers by default. The adapter handles this automatically, but be aware:

- Unquoted table/column names will be uppercased
- Use quotes in your SQL to preserve case: `"MyTable"` vs `MYTABLE`


## Notes

- The `ibm-dbt-db2` adapter is built on the `ibm_db` Python driver (version 3.2.8) which is automatically installed with the adapter.
- **Python Version Requirements**: Requires Python 3.10, 3.11, or 3.12. Python 3.9 is not supported due to <Constant name="core" /> v1.11+ dependency requirements. Python 3.13+ has not been tested yet.
- **Constraints**: CHECK, UNIQUE, PRIMARY KEY, and FOREIGN KEY constraints are defined but not enforced by Db2 in the dbt context. Only NOT NULL constraints are enforced.
- **LISTAGG Limitation**: Db2's LISTAGG function does not support limiting the number of aggregated values.

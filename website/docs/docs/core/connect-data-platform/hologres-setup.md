---
title: "Hologres setup"
description: "Read this guide to learn about the Alibaba Cloud Hologres setup in dbt."
meta:
  maintained_by: Alibaba Cloud Hologres Team
  authors: "Alibaba Cloud Hologres Team"
  github_repo: "aliyun/dbt-hologres"
  pypi_package: "dbt-alibaba-cloud-hologres"
  min_core_version: "v1.8.0"
  cloud_support: Not Supported
  platform_name: "Hologres"
  config_page: "/reference/resource-configs/no-configs"
---

import SetUpPages from '/snippets/\_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Connecting to Hologres with **dbt-hologres**

`dbt-hologres` enables dbt to work with Alibaba Cloud Hologres, a real-time data warehouse compatible with PostgreSQL.

Check out the dbt profile configuration below for details.

<File name='~/.dbt/profiles.yml'>

```yaml
dbt-hologres: # this needs to match the profile in your dbt_project.yml file
  target: dev
  outputs:
    dev:
      type: hologres
      host: HOST_NAME
      port: 80
      user: USER_NAME
      password: PASSWORD
      database: DATABASE_NAME
      schema: SCHEMA_NAME
      threads: 4
```

</File>

### Connection Parameters

Currently it supports the following parameters:

| **Field**          | **Description**                                                                                    | Required? | **Default**                | **Example**                                     |
| ------------------ | -------------------------------------------------------------------------------------------------- | --------- | -------------------------- | ----------------------------------------------- |
| `type`             | Specifies the type of database connection; must be set to "hologres" for Hologres connections.     | Required  | -                          | `hologres`                                      |
| `host`             | The endpoint hostname for connecting to Hologres instance.                                         | Required  | -                          | `hgxxx-xxx.hologres.aliyuncs.com`            |
| `port`             | Port number for Hologres connection.                                                               | Optional  | `80`                       | `80`                                            |
| `user`             | The username for authentication with Hologres (case-sensitive).                                    | Required  | -                          | `AccessKey ID`                           |
| `password`         | The password for authentication with Hologres (case-sensitive).                                    | Required  | -                          | `AccessKey Secret`                                 |
| `database`         | The name of your Hologres database.                                                                | Required  | -                          | `my_database`                                   |
| `schema`           | The default schema that the models will use in Hologres (use empty string "" if not needed).       | Required  | -                          | `public`                                        |
| `threads`          | Number of threads for parallel execution.                                                          | Optional  | `1`                        | `4`                                             |
| `connect_timeout`  | Connection timeout in seconds.                                                                     | Optional  | `10`                       | `10`                                            |
| `sslmode`          | SSL mode for the connection.                                                                       | Optional  | `disable`                  | `disable`                                       |
| `application_name` | Application identifier for connection tracking.                                                    | Optional  | `dbt_hologres_{version}`   | `my_dbt_app`                                    |
| `retries`          | Number of connection retries.                                                                      | Optional  | `1`                        | `3`                                             |

## Authentication Configuration

`dbt-hologres` uses the standard PostgreSQL-compatible authentication mechanism with username and password (Access Key). Hologres supports using Alibaba Cloud AccessKey or RAM user credentials for authentication.

### Access Key

You can authenticate using your Alibaba Cloud account credentials. For security reasons, it is recommended to create a RAM sub-account with appropriate permissions rather than using the primary account AccessKey.

```yaml
jaffle_shop: # this needs to match the profile in your dbt_project.yml file
  target: dev
  outputs:
    dev:
      type: hologres
      host: hgxxx-cn-shanghai.hologres.aliyuncs.com  # Replace with your Hologres endpoint
      port: 80
      user: your_access_key_id  # Replace with your AccessKeyId
      password: your_access_key_secret  # Replace with your AccessKeySecret
      database: my_database  # Replace with your database name
      schema: public  # Replace with your schema name
      threads: 4
      connect_timeout: 10
      sslmode: disable
```

### Important Notes

1. **Case Sensitivity**: Hologres usernames and passwords are case-sensitive. Make sure to enter them exactly as configured.

2. **Default Port**: The default port for Hologres is `80`, which is different from the standard PostgreSQL port `5432`.

3. **SSL Mode**: SSL is disabled by default for Hologres connections. You can enable it by setting `sslmode` to an appropriate value if required.

## Testing Your Connection

After configuring your `profiles.yml`, you can verify your connection by running:

```bash
dbt debug
```

This command will test the connection to your Hologres instance and report any configuration issues.

## Hologres-Specific Features

### Dynamic Tables

Dynamic Tables are Hologres's implementation of materialized views with automatic refresh. You can configure them in your dbt models:

```yaml
models:
  my_model:
    materialized: dynamic_table
    freshness: "30 minutes"
    auto_refresh_mode: auto
    computing_resource: serverless
```

Supported configurations for Dynamic Tables:

| **Configuration**     | **Description**                                                    | **Example Values**                    |
| --------------------- | ------------------------------------------------------------------ | ------------------------------------- |
| `freshness`           | Data freshness requirement.                                        | `"30 minutes"`, `"1 hours"`           |
| `auto_refresh_mode`   | Refresh mode for the dynamic table.                                | `auto`, `incremental`, `full`         |
| `computing_resource`  | Computing resource to use for refreshing.                          | `serverless`, `local`, warehouse name |

### Incremental Models

`dbt-hologres` supports multiple incremental strategies:

- `append`: Simply append new records
- `delete+insert`: Delete matching records and insert new ones
- `merge`: Use MERGE statement for upsert operations
- `microbatch`: Process data in small batches

### Constraints

Full support for database constraints including:

- Primary keys
- Foreign keys
- Unique constraints
- Not null constraints

## References

- [dbt-alibaba-cloud-hologres GitHub Repository](https://github.com/aliyun/dbt-hologres)
- [Hologres Documentation](https://www.alibabacloud.com/help/en/hologres/)
- [Hologres Dynamic Table Guide](https://www.alibabacloud.com/help/en/hologres/user-guide/introduction-to-dynamic-table)

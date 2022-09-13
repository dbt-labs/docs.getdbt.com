---
title: "ClickHouse Profile"
---

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.


## Overview of dbt-clickhouse
**Maintained by:** ClickHouse      
**Author:** Guy Kohen    
**Source:** https://github.com/ClickHouse/dbt-clickhouse    
**Core version:** v0.19.0 and newer    
**dbt Cloud:** Not Supported    

![dbt-clickhouse stars](https://img.shields.io/github/stars/ClickHouse/dbt-clickhouse?style=for-the-badge)

The package can be installed from PyPI with:

```
pip install dbt-clickhouse
```

For further info, see the [GitHub README](https://github.com/ClickHouse/dbt-clickhouse#readme)

## Connecting to ClickHouse with **dbt-clickhouse**

To connect to ClickHouse from dbt, you'll need to add a [profile](https://docs.getdbt.com/dbt-cli/configure-your-profile) to your `profiles.yml` file. A ClickHouse profile conforms to the following syntax:

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
      port: <port>
      host: <hostname>
      verify: False
      secure: True
      connect_timeout: 10
```

</File>

#### Description of ClickHouse Profile Fields


| Field                   | Description                                                                                                                                                                                                                                                                       |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `type`                  | This must be included either in `profiles.yml` or in the `dbt_project.yml` file. Must be set to `clickhouse`.                                                                                                                                                                     |
| `schema`                | Required. A ClickHouse's database name. The dbt model database.schema.table is not compatible with ClickHouse because ClickHouse does not support a schema. So we use a simple model schema.table, where schema is the ClickHouse's database. Please, don't use default database! |
| `user`                  | Required. A ClickHouse username with adequate permissions to access the specified `schema`.                                                                                                                                                                                       |
| `password`              | Required. The password associated with the specified `user`.                                                                                                                                                                                                                      |
| `port`                  | Optional. ClickHouse server port number. Defaults to 8123 or 8443 (if the interface is https).                                                                                                                                                                                    |
| `host`                  | Optional. The host name of the connection. Default is `localhost`.                                                                                                                                                                                                                |
| `verify`                | Optional. For HTTPS (`secure=True`) connections, validate the ClickHouse server TLS certificate, including matching hostname, expiration, and signed by a trusted Certificate Authority. Defaults to True.                                                                        |
| `secure`                | Optional. Whether the connection is secured (https or http). Defaults to False (http).                                                                                                                                                                                            |
| `connect_timeout`       | Optional. HTTP connection timeout in seconds. Defaults is 10 seconds.                                                                                                                                                                                                             |

#### Troubleshooting Connections

If you encounter issues connecting to ClickHouse from dbt, make sure the following criteria are met:
- The engine must be one of the [supported engines](clickhouse-configs#supported-table-engines).
- You must have adequate permissions to access the database.
- If you're not using the default engine for the database, you must specify an engine name.
---
title: "MySQL Profile"
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

## Overview of dbt-mysql

**Maintained by:** Community  
**Author:** [Doug Beatty](https://github.com/dbeatty10)   
**Source:** [GitHub](https://github.com/dbeatty10/dbt-mysql)  
**Core version:** v1.0.8   
**dbt Cloud:** Not Supported     

![dbt-mysql stars](https://img.shields.io/github/stars/dbeatty10/dbt-mysql?style=for-the-badge)
![latest version on PyPI](https://img.shields.io/pypi/v/dbt-mysql?style=for-the-badge)

The package can be installed from PyPI with:

```python
pip install dbt-mysql
```

This is an experimental plugin:
- It has not been tested extensively.
- Storage engines other than the default of InnoDB are untested.
- Only tested with [dbt-adapter-tests](https://github.com/dbt-labs/dbt-adapter-tests) with the following versions:
  - MySQL 5.7
  - MySQL 8.0
  - MariaDB 10.5
- Compatibility with other [dbt packages](https://hub.getdbt.com/) (like [dbt_utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/)) are also untested.

Please read these docs carefully and use at your own risk. [Issues](https://github.com/dbeatty10/dbt-mysql/issues/new) and [PRs](https://github.com/dbeatty10/dbt-mysql/blob/main/CONTRIBUTING.rst#contributing) welcome!


## Connecting to MySQL with dbt-mysql

MySQL targets should be set up using the following configuration in your `profiles.yml` file.

Example:

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: mysql
      server: localhost
      port: 3306
      schema: analytics
      username: your_mysql_username
      password: your_mysql_password
      ssl_disabled: True
```

</File>

#### Description of MySQL Profile Fields

| Option          | Description                                                                         | Required?                                                          | Example                                        |
| --------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------- |
| type            | The specific adapter to use                                                         | Required                                                           | `mysql`, `mysql5` or `mariadb`                            |
| server          | The server (hostname) to connect to                                                 | Required                                                           | `yourorg.mysqlhost.com`                        |
| port            | The port to use                                                                     | Optional                                                           | `3306`                                         |
| schema          | Specify the schema (database) to build models into                                  | Required                                                           | `analytics`                                    |
| username        | The username to use to connect to the server                                        | Required                                                           | `dbt_admin`                                    |
| password        | The password to use for authenticating to the server                                | Required                                                           | `correct-horse-battery-staple`                 |
| ssl_disabled    | Set to enable or disable TLS connectivity to mysql5.x                               | Optional                                                           | `True` or `False`                              |

## Supported features

| MariaDB 10.5 | MySQL 5.7 | MySQL 8.0 | Feature                     |
|:---------:|:---------:|:---:|-----------------------------|
|     ✅     |     ✅     |  ✅  | Table materialization       |
|     ✅     |     ✅     |  ✅  | View materialization        |
|     ✅     |     ✅     |  ✅  | Incremental materialization |
|     ✅     |     ❌     |  ✅  | Ephemeral materialization   |
|     ✅     |     ✅     |  ✅  | Seeds                       |
|     ✅     |     ✅     |  ✅  | Sources                     |
|     ✅     |     ✅     |  ✅  | Custom data tests           |
|     ✅     |     ✅     |  ✅  | Docs generate               |
|     🤷     |     🤷     |  ✅  | Snapshots                   |

## Notes 
- Ephemeral materializations rely upon [Common Table Expressions](https://en.wikipedia.org/wiki/Hierarchical_and_recursive_queries_in_SQL) (CTEs), which are not supported until MySQL 8.0.
- MySQL 5.7 has some configuration gotchas that might affect dbt snapshots to not work properly due to [automatic initialization and updating for `TIMESTAMP`](https://dev.mysql.com/doc/refman/5.7/en/timestamp-initialization.html).
  - If the output of `SHOW VARIABLES LIKE 'sql_mode'` includes `NO_ZERO_DATE`. A solution is to include the following in a `*.cnf` file:
  ```
  [mysqld]
  explicit_defaults_for_timestamp = true
  sql_mode = "ALLOW_INVALID_DATES,{other_sql_modes}"
  ```
  - Where `{other_sql_modes}` is the rest of the modes from the `SHOW VARIABLES LIKE 'sql_mode'` output.

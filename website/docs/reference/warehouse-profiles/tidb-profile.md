---
title: "TiDB Profile"
---

:::info Vendor-supported plugin

Some [core functionality](https://github.com/pingcap/dbt-tidb/blob/main/README.md#supported-features) may be limited. 
If you're interested in contributing, check out the source code repository listed below.

:::

## Overview of dbt-tidb

**Maintained by:** PingCAP      
**Author:** Xiang Zhang, Qiang Wu, Yuhang Shi
**dbt Slack Channel**: [#db-tidb](https://getdbt.slack.com/archives/C03CC86R1NY)
**Source:** https://github.com/pingcap/dbt-tidb   
**Core version:** v1.0.0 and newer   
**dbt Cloud:** Not Supported

The easiest way to install it is to use pip:

```
pip install dbt-tidb
```

### Connecting to TiDB with **dbt-tidb**

#### User / Password Authentication

Configure your dbt profile for using TiDB:

##### TiDB connection profile
<File name='profiles.yml'>

```yaml
dbt-tidb:
  target: dev
  outputs:
    dev:
      type: tidb
      server: 127.0.0.1
      port: 4000
      schema: database_name
      username: tidb_username
      password: tidb_password

      # optional
      retries: 3 # default 1
```

</File>

##### Description of Profile Fields

| Option   | Description                                          | Required? | Example             |
|----------|------------------------------------------------------|-----------|---------------------|
| type     | The specific adapter to use                          | Required  | `tidb`              |
| server   | The server (hostname) to connect to                  | Required  | `yourorg.tidb.com`  |
| port     | The port to use                                      | Required  | `4000`              |
| schema   | Specify the schema (database) to build models into   | Required  | `analytics`         |
| username | The username to use to connect to the server         | Required  | `dbt_admin`         |
| password | The password to use for authenticating to the server | Required  | `awesome_password`  |
| retries  | The retry times after an unsuccessful connection     | Optional  | `default 1`         |

#### Database User Privileges

Your database user would be able to have some abilities to read or write, such as `SELECT`, `CREATE`, and so on.
You can find some help [here](https://docs.pingcap.com/tidb/v4.0/privilege-management) with TiDB privileges management.

| Required Privilege     |
|------------------------|
| SELECT                 |
| CREATE                 |
| CREATE TEMPORARY TABLE |
| CREATE VIEW            |
| INSERT                 |
| DROP                   |
| SHOW DATABASE          |
| SHOW VIEW              |
| SUPER                  |

### Supported features

| TiDB 4.X | TiDB 5.0 ~ 5.2 | TiDB >= 5.3 |           Feature           |
|:--------:|:--------------:|:-----------:|:---------------------------:|
|    ✅     |       ✅        |      ✅      |    Table materialization    |
|    ✅     |       ✅        |      ✅      |    View materialization     |
|    ❌     |       ❌        |      ✅      | Incremental materialization |
|    ❌     |       ✅        |      ✅      |  Ephemeral materialization  |
|    ✅     |       ✅        |      ✅      |            Seeds            |
|    ✅     |       ✅        |      ✅      |           Sources           |
|    ✅     |       ✅        |      ✅      |      Custom data tests      |
|    ✅     |       ✅        |      ✅      |        Docs generate        |
|    ❌     |       ❌        |      ✅      |          Snapshots          |
|    ✅     |       ✅        |      ✅      |            Grant            |
|    ✅     |       ✅        |      ✅      |      Connection retry       |

**Note:**

* TiDB 4.0 ~ 5.0 does not support [CTE](https://docs.pingcap.com/tidb/dev/sql-statement-with),
  you should avoid using `WITH` in your SQL code.
* TiDB 4.0 ~ 5.2 does not support creating a [temporary table or view](https://docs.pingcap.com/tidb/v5.2/sql-statement-create-table#:~:text=sec\)-,MySQL%20compatibility,-TiDB%20does%20not).
* TiDB 4.X does not support using SQL func in `CREATE VIEW`, avoid it in your SQL code.
  You can find more detail [here](https://github.com/pingcap/tidb/pull/27252).

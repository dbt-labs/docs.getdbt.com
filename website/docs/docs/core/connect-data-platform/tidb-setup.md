---
title: "TiDB setup"
description: "Read this guide to learn about the TiDB warehouse setup in dbt."
id: "tidb-setup"
meta:
  maintained_by: PingCAP
  authors: Xiang Zhang, Qiang Wu, Yuhang Shi
  github_repo: 'pingcap/dbt-tidb'
  pypi_package: 'dbt-tidb'
  min_core_version: 'v1.0.0'
  core_version: 'v1.0.0 and newer'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-tidb'
  slack_channel_link: 'https://getdbt.slack.com/archives/C03CC86R1NY'
  platform_name: 'TiDB'
  config_page: '/reference/resource-configs/no-configs'
---

:::info Vendor-supported plugin

Some [core functionality](https://github.com/pingcap/dbt-tidb/blob/main/README.md#supported-features) may be limited. 
If you're interested in contributing, check out the source code repository listed below.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>

## Connecting to TiDB with **dbt-tidb**

### User / Password Authentication

Configure your dbt profile for using TiDB:

#### TiDB connection profile
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

#### Description of Profile Fields

| Option   | Description                                          | Required? | Example             |
|----------|------------------------------------------------------|-----------|---------------------|
| type     | The specific adapter to use                          | Required  | `tidb`              |
| server   | The server (hostname) to connect to                  | Required  | `yourorg.tidb.com`  |
| port     | The port to use                                      | Required  | `4000`              |
| schema   | Specify the schema (database) to build models into   | Required  | `analytics`         |
| username | The username to use to connect to the server         | Required  | `dbt_admin`         |
| password | The password to use for authenticating to the server | Required  | `awesome_password`  |
| retries  | The retry times after an unsuccessful connection     | Optional  | `default 1`         |

## Database User Privileges

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

## Supported features

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

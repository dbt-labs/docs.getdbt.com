---
title: "TiDB setup"
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
  config_page: 'no-configs'
---

:::info Vendor-supported plugin

Some [core functionality](https://github.com/pingcap/dbt-tidb/blob/main/README.md#supported-features) may be limited. 
If you're interested in contributing, check out the source code repository listed below.

:::

<h2> Overview of {frontMatter.meta.pypi_package} </h2>

<ul>
    <li><strong>Maintained by</strong>: {frontMatter.meta.maintained_by}</li>
    <li><strong>Authors</strong>: {frontMatter.meta.authors}</li>
    <li><strong>GitHub repo</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a><a href={`https://github.com/${frontMatter.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${frontMatter.meta.github_repo}?style=for-the-badge`}/></a></li>
    <li><strong>PyPI package</strong>: <code>{frontMatter.meta.pypi_package}</code> <a href={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}`}><img src={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}.svg`}/></a></li>
    <li><strong>Slack channel</strong>: <a href={frontMatter.meta.slack_channel_link}>{frontMatter.meta.slack_channel_name}</a></li>
    <li><strong>Supported dbt Core version</strong>: {frontMatter.meta.min_core_version} and newer</li>
    <li><strong>dbt Cloud support</strong>: {frontMatter.meta.cloud_support}</li>
    <li><strong>Minimum data platform version</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>


<h2> Installing {frontMatter.meta.pypi_package} </h2>

pip is the easiest way to install the adapter:

<code>pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>


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

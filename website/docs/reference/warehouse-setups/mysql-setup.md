---
title: "MySQL setup"
id: "mysql-setup"
meta:
  maintained_by: Community
  authors: 'Doug Beatty (https://github.com/dbeatty10)'
  github_repo: 'dbeatty10/dbt-mysql'
  pypi_package: 'dbt-mysql'
  min_core_version: 'v0.18.0'
  cloud_support: Not Supported
  min_supported_version: 'MySQL 5.7 and 8.0'
  slack_channel_name: '#db-mysql-family'
  slack_channel_link: 'https://getdbt.slack.com/archives/C03BK0SHC64'
  platform_name: 'MySQL'
  config_page: 'no-configs'
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

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

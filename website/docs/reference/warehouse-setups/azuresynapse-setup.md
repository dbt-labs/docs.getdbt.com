---
title: "Microsoft Azure Synapse DWH setup"
meta:
  maintained_by: Community
  authors: 'dbt-msft community (https://github.com/dbt-msft)'
  github_repo: 'dbt-msft/dbt-synapse'
  pypi_package: 'dbt-synapse'
  min_core_version: 'v0.18.0'
  cloud_support: Not Supported
  min_supported_version: 'Azure Synapse 10'
  slack_channel_name: '#db-synapse'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01DRQ178LQ'
  platform_name: 'Synapse'
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

:::info Dedicated SQL only

Azure Synapse offers both Dedicated SQL Pools and Serverless SQL Pools.
**Only Dedicated SQL Pools are supported by this adapter. If you really insist on using serverless pools, check out the neglected, experimental project: [dbt-synapse-serverless](https://github.com/dbt-msft/dbt-synapse-serverless)**

:::

### Prerequisites

On Debian/Ubuntu make sure you have the ODBC header files before installing

```bash
sudo apt install unixodbc-dev
```

Download and install the [Microsoft ODBC Driver 18 for SQL Server](https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server?view=sql-server-ver15).
If you already have ODBC Driver 17 installed, then that one will work as well.

:::tip Default settings change in dbt-synapse v1.2 / ODBC Driver 18
Microsoft made several changes related to connection encryption. Read more about the changes [here](/reference/warehouse-setups/mssql-setup).
:::

### Authentication methods

This adapter is based on the adapter for Microsoft SQL Server.
Therefor, the same authentication methods are supported.

The configuration is the same except for 1 major difference:
instead of specifying `type: sqlserver`, you specify `type: synapse`.

Example:

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: synapse
      driver: 'ODBC Driver 17 for SQL Server' # (The ODBC Driver installed on your system)
      server: workspacename.sql.azuresynapse.net # (Dedicated SQL endpoint of your workspace here)
      port: 1433
      database: exampledb
      schema: schema_name
      user: username
      password: password
```

</File>

You can find all the available options and the documentation and how to configure them on [the documentation page for the dbt-sqlserver adapter](/reference/warehouse-setups/mssql-setup).

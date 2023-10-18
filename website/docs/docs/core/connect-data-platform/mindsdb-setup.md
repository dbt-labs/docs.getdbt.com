---
title: "MindsDB setup"
id: "mindsdb-setup"
meta:
  maintained_by: MindsDB
  authors: 'MindsDB team'
  github_repo: 'mindsdb/dbt-mindsdb'
  pypi_package: 'dbt-mindsdb'
  min_core_version: 'v1.0.1'
  cloud_support: Not Supported
  min_supported_version: '?'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'MindsDB'
  config_page: '/reference/resource-configs/mindsdb-configs'
---

:::info Vendor-supported plugin

The dbt-mindsdb package allows dbt to connect to [MindsDB](https://github.com/mindsdb/mindsdb).

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

## Installation


<h2> Installing {frontMatter.meta.pypi_package} </h2>

pip is the easiest way to install the adapter:

<code>pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>

## Configurations

Basic `profile.yml` for connecting to MindsDB:

```yml
mindsdb:
  outputs:
    dev:
      database: 'mindsdb'
      host: '127.0.0.1'
      password: ''
      port: 47335
      schema: 'mindsdb'
      type: mindsdb
      username: 'mindsdb'
  target: dev

```
| Key      | Required | Description                                          | Example                        |
| -------- | -------- | ---------------------------------------------------- | ------------------------------ |
| type     |    ✔️   | The specific adapter to use                          | `mindsdb`                      |
| host     |    ✔️   | The MindsDB (hostname) to connect to                 | `cloud.mindsdb.com`            |
| port     |    ✔️   | The port to use                                      | `3306`  or `47335`             |
| schema   |    ✔️   | Specify the schema (database) to build models into   | The MindsDB datasource         |
| username |    ✔️   | The username to use to connect to the server         | `mindsdb` or mindsdb cloud user|
| password |    ✔️   | The password to use for authenticating to the server | `pass                          |



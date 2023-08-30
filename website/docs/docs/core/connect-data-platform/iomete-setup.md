---
title: "iomete setup"
description: "Read this guide to learn about the iomete warehouse setup in dbt."
id: "iomete-setup"
meta:
  maintained_by: iomete
  authors: 'Namig Aliyev'
  github_repo: 'iomete/dbt-iomete'
  pypi_package: 'dbt-iomete'
  min_core_version: 'v0.18.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: '##db-iomete'
  slack_channel_link: 'https://getdbt.slack.com/archives/C03JFG22EP9'
  platform_name: 'iomete'
  config_page: '/reference/resource-configs/no-configs'
---

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

## Installation and Distribution


<h2> Installing {frontMatter.meta.pypi_package} </h2>

pip is the easiest way to install the adapter:

<code>pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>


Set up a iomete Target

iomete targets should be set up using the following configuration in your profiles.yml file.

<File name='profiles.yml'>

```yaml
iomete:
  target: dev
  outputs:
    dev:
      type: iomete
      cluster: cluster_name
      host: <region_name>.iomete.com
      port: 443
      schema: database_name
      account_number: iomete_account_number
      user: iomete_user_name
      password: iomete_user_password
```

</File>

##### Description of Profile Fields

| Field    | Description                                                                                                                             | Required | Example                |
|----------|-----------------------------------------------------------------------------------------------------------------------------------------|----------|------------------------|
| type     | The specific adapter to use                                                                                                             | Required | `iomete`               |
| cluster  | The cluster to connect                                                                                                                  | Required | `reporting`            |
| host     | The host name of the connection. It is a combination of <br/>`account_number` with the prefix `dwh-` <br/>and the suffix `.iomete.com`. | Required | `dwh-12345.iomete.com` |
| port     | The port to use.                                                                                                                        | Required | `443`                  |
| schema   | Specify the schema (database) to build models into.                                                                                     | Required | `dbt_finance`          |
| account_number | The iomete account number with single quotes.                                                                                           | Required | `'1234566789123'`        |
| username | The iomete username to use to connect to the server.                                                                                    | Required | `dbt_user`             |
| password | The iomete user password to use to connect to the server.                                                                               | Required | `strong_password`      |

## Supported Functionality

Most dbt Core functionality is supported. 

Iceberg specific improvements.
1. Joining the results of `show tables` and `show views`.

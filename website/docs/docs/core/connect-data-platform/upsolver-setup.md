---
title: "Upsolver setup"
description: "Read this guide to learn how to configure Upsolver with dbt."
id: "upsolver-setup"
meta:
  maintained_by: Upsolver Team
  authors: Upsolver Team
  github_repo: 'Upsolver/dbt-upsolver'
  pypi_package: 'dbt-upsolver'
  min_core_version: 'v1.5.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: 'Upsolver Comunity'
  slack_channel_link: 'https://join.slack.com/t/upsolvercommunity/shared_invite/zt-1zo1dbyys-hj28WfaZvMh4Z4Id3OkkhA'
  platform_name: 'Upsolver'
  config_page: '/reference/resource-configs/upsolver-configs'
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
<h2> Installing {frontMatter.meta.pypi_package} </h2>

pip is the easiest way to install the adapter:

<code>pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>

## Authentication Methods

### User / Token authentication

Upsolver can be configured using basic user/token authentication as shown below.

<File name='~/.dbt/profiles.yml'>

```yaml
my-upsolver-db:
  target: dev
  outputs:
    dev:
      type: upsolver
      api_url: https://mt-api-prod.upsolver.com

      user: [username]
      token: [token]

      database: [database name]
      schema: [schema name]
      threads: [1 or more]

  ```

</File>

## Configurations

The configs for Upsolver targets are shown below.

### All configurations

| Config | Required? | Description |
| ------ | --------- | ----------- |
| token | Yes | The token to connect Upsolver [Upsolver's documentation](https://docs.upsolver.com/sqlake/api-integration) |
| user | Yes | The user to log in as |
| database | Yes | The database that dbt should create models in |
| schema | Yes | The schema to build models into by default |
| api_url | Yes | The API url to connect. Common value ```https://mt-api-prod.upsolver.com``` |

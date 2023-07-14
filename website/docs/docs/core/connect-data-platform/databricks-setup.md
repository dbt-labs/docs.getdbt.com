---
title: "Databricks setup"
description: "Read this guide to learn about the Databricks warehouse setup in dbt."
id: "databricks-setup"
meta:
  maintained_by: Databricks
  authors: 'some dbt loving Bricksters'
  github_repo: 'databricks/dbt-databricks'
  pypi_package: 'dbt-databricks'
  min_core_version: 'v0.18.0'
  cloud_support: Supported
  min_supported_version: 'Databricks SQL or DBR 12+'
  slack_channel_name: '#db-databricks-and-spark'
  slack_channel_link: 'https://getdbt.slack.com/archives/CNGCW8HKL'
  platform_name: 'Databricks'
  config_page: '/reference/resource-configs/databricks-configs'
--- 

<Snippet path="warehouse-setups-cloud-callout" />

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

`dbt-databricks` is the recommend adapter for Databricks

`dbt-databricks` includes features not available in `dbt-spark`:
- Unity Catalog support
- No need to install additional drivers or dependencies for use on the CLI
- Use of Delta Lake for all models out of the box
- SQL macros that are optimized to run with [Photon](https://docs.databricks.com/runtime/photon.html)

### Set up a Databricks Target

dbt-databricks can connect to the Databricks SQL Warehouses and all-purpose clusters. Databricks SQL Warehouses is the recommended way to get started with Databricks.

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: databricks
      catalog: [optional catalog name if you are using Unity Catalog]
      schema: [schema name]
      host: [yourorg.databrickshost.com]
      http_path: [/sql/your/http/path]
      token: [dapiXXXXXXXXXXXXXXXXXXXXXXX] # Personal Access Token (PAT)
      threads: [1 or more]  # optional, default 1
```

</File>

See the [Databricks documentation](https://docs.databricks.com/dev-tools/dbt.html#) on how
to obtain the credentials for configuring your profile.



## Supported Functionality

### Delta Lake

Most dbt Core functionality is supported, but some features are only available
on Delta Lake.

Delta-only features:
1. Incremental model updates by `unique_key` instead of `partition_by` (see [`merge` strategy](/reference/resource-configs/databricks-configs#the-merge-strategy))
2. [Snapshots](/docs/build/snapshots)


### Unity Catalog

The adapter `dbt-databricks>=1.1.1` supports the 3-level namespace of Unity Catalog (catalog / schema / relations) so you can organize and secure your data the way you like.

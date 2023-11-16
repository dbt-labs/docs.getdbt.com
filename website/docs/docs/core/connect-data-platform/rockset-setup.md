---
title: "Rockset setup"
description: "Read this guide to learn about the Rockset warehouse setup in dbt."
id: "rockset-setup"
meta:
  maintained_by: Rockset, Inc.
  authors: 'Rockset, Inc.'
  github_repo: 'rockset/dbt-rockset'
  pypi_package: 'dbt-rockset'
  min_core_version: 'v0.19.2'
  cloud_support: Not Supported
  min_supported_version: '?'
  slack_channel_name: '#dbt-rockset'
  slack_channel_link: 'https://getdbt.slack.com/archives/C02J7AZUAMN'
  platform_name: 'Rockset'
  config_page: '/reference/resource-configs/no-configs'
---

:::info Vendor-supported plugin

Certain core functionality may vary. If you would like to report a bug, request a feature, or contribute, you can check out the linked repository and open an issue.

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

<code>python -m pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>

## Connecting to Rockset with **dbt-rockset**

The dbt profile for Rockset is very simple and contains the following fields:

<File name='profiles.yml'>

```yaml
rockset:
  target: dev
  outputs:
    dev:
      type: rockset
      workspace: [schema]
      api_key: [api_key]
      api_server: [api_server] # (Default is api.rs2.usw2.rockset.com)
```

</File>

### Materializations

Type | Supported? | Details
-----|------------|----------------
view | YES | Creates a [view](https://rockset.com/docs/views/#gatsby-focus-wrapper).
table | YES | Creates a [collection](https://rockset.com/docs/collections/#gatsby-focus-wrapper).
ephemeral | YES | Executes queries using CTEs.
incremental | YES | Creates a [collection](https://rockset.com/docs/collections/#gatsby-focus-wrapper) if it doesn't exist, and then writes results to it.

## Caveats
1. `unique_key` is not supported with incremental, unless it is set to [_id](https://rockset.com/docs/special-fields/#the-_id-field), which acts as a natural `unique_key` in Rockset anyway.
2. The `table` <Term id="materialization" /> is slower in Rockset than most due to Rockset's architecture as a low-latency, real-time database. Creating new collections requires provisioning hot storage to index and serve fresh data, which takes about a minute.
3. Rockset queries have a two-minute timeout. Any model which runs a query that takes longer to execute than two minutes will fail.

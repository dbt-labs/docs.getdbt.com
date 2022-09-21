---
title: "Rockset Profile"
meta:
  maintained_by: Rockset, Inc.
  authors: 'Rockset, Inc.'
  github_repo: 'rockset/dbt-rockset'
  min_core_version: 'v0.19.2'
  cloud_support: Not Supported
  min_supported_version: '?'
  slack_channel_name: '#dbt-rockset'
  slack_channel_link: 'https://getdbt.slack.com/archives/C02J7AZUAMN'
---

:::info Vendor-supported plugin

Certain core functionality may vary. If you would like to report a bug, request a feature, or contribute, you can check out the linked repository and open an issue.

:::

## Overview of dbt-rockset

<ul>
    <li><strong>Maintained by</strong>: {frontMatter.meta.maintained_by}</li>
    <li><strong>Authors</strong>: {frontMatter.meta.authors}</li>
    <li><strong>GitHub repo</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a><a href={`https://github.com/${frontMatter.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${frontMatter.meta.github_repo}?style=for-the-badge`}/></a></li>
    <li><strong>Slack channel</strong>: <a href={frontMatter.meta.slack_channel_link}>{frontMatter.meta.slack_channel_name}</a></li>
    <li><strong>Supported dbt Core version</strong>: {frontMatter.meta.min_core_version} and newer</li>
    <li><strong>dbt Cloud support</strong>: {frontMatter.meta.cloud_support}</li>
    <li><strong>Minimum data platform version</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>

The easiest way to install is to use pip:

    pip install dbt-rockset

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

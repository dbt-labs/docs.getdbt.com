---
title: "fal setup (Python models)"
description: "Read this guide to learn about the fal warehouse setup in dbt."
meta:
  maintained_by: fal.ai
  authors: 'Features & Labels (https://github.com/fal-ai)'
  github_repo: 'fal-ai/fal'
  pypi_package: 'dbt-fal'
  min_core_version: 'v1.3.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#tools-fal'
  slack_channel_link: 'https://getdbt.slack.com/archives/C02V8QW3Q4Q'
  platform_name: 'fal'
  config_page: '/reference/resource-configs/fal-configs'
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

<code>pip install {frontMatter.meta.pypi_package}[&lt;sql-adapter&gt;]</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<p>You must install the adapter for SQL transformations and data storage independently from dbt-fal.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>


## Setting up fal with other adapter

[fal](http://github.com/fal-ai/fal) offers a Python runtime independent from what database you are using and integrates seamlessly with dbt. It works by downloading the data as a Pandas DataFrame, transforming it in a local Python runtime and uploading it to the database. The only configuration change you need to do is adding it to the `profiles.yml` and setting the `db_profile` property as the database profile you are already using.

It will run all the SQL dbt models with the main adapter you specified in your `profiles.yml` and all the Python models are executed by the fal adapter.

Example:

<File name='profiles.yml'>

```yaml
jaffle_shop:
  target: dev_with_fal
  outputs:
    dev_with_fal:
      type: fal
      db_profile: dev_pg # This points to your main adapter
    dev_pg:
      type: postgres
      ...
```

</File>

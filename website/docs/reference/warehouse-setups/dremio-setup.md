---
title: "Dremio setup"
meta:
  maintained_by: Community
  authors: 'Fabrice Etanchaud (Maif-vie)'
  github_repo: 'fabrice-etanchaud/dbt-dremio'
  pypi_package: 'dbt-dremio'
  min_core_version: 'v0.18.0'
  cloud_support: Not Supported
  min_supported_version: 'Dremio 4.7'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'Dremio'
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
 dbt-dremio

Follow the repository's link for os dependencies.

## Connecting to Dremio with **dbt-dremio**

### Connecting with ZooKeeper

I have no means to test [connection with ZooKeeper](https://docs.dremio.com/drivers/dremio-connector.html#connecting-to-zookeeper). 
If you do need this, contact me and I will provide you with a branch you can test.

### Direct connection to a coordinator

```yaml
my_profile:
  outputs:
    my_target:
      type: dremio
      threads: 2
# please replace driver below with the one you gave to your dremio odbc driver installation      
      driver: Dremio ODBC Driver 64-bit
      host: [coordinator host]
      port: 31010
      schema: [schema]
      user: [user]
      password: [password]
  target: my_target

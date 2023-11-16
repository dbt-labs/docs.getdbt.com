---
title: "Databend Cloud setup"
description: "Read this guide to learn about the Databend warehouse setup in dbt."
id: "databend-setup"
meta:
  maintained_by: Databend Cloud
  authors: Shanjie Han
  github_repo: 'databendcloud/dbt-databend'
  pypi_package: 'dbt-databend-cloud'
  min_core_version: 'v1.0.0'
  core_version: 'v1.0.0 and newer'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  platform_name: 'Databend Cloud'
  config_page: '/reference/resource-configs/no-configs'
---

:::info Vendor-supported plugin

Some [core functionality](https://github.com/databendcloud/dbt-databend#supported-features) may be limited. 
If you're interested in contributing, check out the source code repository listed below.

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


## Connecting to Databend Cloud with **dbt-databend-cloud**

### User / Password Authentication

Configure your dbt profile for using Databend Cloud:

#### Databend Cloud connection profile
<File name='profiles.yml'>

```yaml
dbt-databend-cloud:
  target: dev
  outputs:
    dev:
      type: databend
      host: databend-cloud-host
      port: 443
      schema: database_name
      user: username
      pass: password
```

</File>

#### Description of Profile Fields

| Option   | Description                                          | Required? | Example             |
|----------|------------------------------------------------------|-----------|---------------------|
| type     | The specific adapter to use                          | Required  | `databend`              |
| host   | The host (hostname) to connect to                  | Required  | `yourorg.datafusecloud.com`  |
| port     | The port to use                                      | Required  | `443`              |
| schema   | Specify the schema (database) to build models into   | Required  | `default`         |
| user | The username to use to connect to the host         | Required  | `dbt_admin`         |
| pass | The password to use for authenticating to the host | Required  | `awesome_password`  |

## Database User Privileges

Your database user would be able to have some abilities to read or write, such as `SELECT`, `CREATE`, and so on.
You can find some help [here](https://docs.databend.com/using-databend-cloud/warehouses/connecting-a-warehouse) with Databend Cloud privileges management.

| Required Privilege     |
|------------------------|
| SELECT                 |
| CREATE                 |
| CREATE TEMPORARY TABLE |
| CREATE VIEW            |
| INSERT                 |
| DROP                   |
| SHOW DATABASE          |
| SHOW VIEW              |
| SUPER                  |

## Supported features

 | ok |           Feature           |
|:--:|:---------------------------:|
|  ✅ |    Table materialization    |
|  ✅ |    View materialization     |
|  ✅ | Incremental materialization |
|  ❌  |  Ephemeral materialization  |
|  ✅ |            Seeds            |
|  ✅ |           Sources           |
|  ✅ |      Custom data tests      |
|  ✅ |        Docs generate        |
|  ❌ |          Snapshots          |
|  ✅ |      Connection retry       |

**Note:**

* Databend does not support `Ephemeral` and `SnapShot`. You can find more detail [here](https://github.com/datafuselabs/databend/issues/8685)

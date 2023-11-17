---
title: "Starrocks setup"
description: "Read this guide to learn about the Starrocks warehouse setup in dbt."
id: "starrocks-setup"
meta:
  maintained_by: Starrocks
  authors: Astralidea
  github_repo: 'StarRocks/starrocks/tree/main/contrib/dbt-connector'
  pypi_package: 'dbt-starrocks'
  min_core_version: 'v1.6.2'
  min_supported_version: 'Starrocks 2.5'
  cloud_support: Not Supported
  slack_channel_name: '#db-starrocks'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'Starrocks'
  config_page: '/reference/resource-configs/starrocks-configs'
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

### User / Password Authentication

Starrocks can be configured using basic user/password authentication as shown below.

<File name='~/.dbt/profiles.yml'>

```yaml
my-starrocks-db:
  target: dev
  outputs:
    dev:
      type: starrocks
      host: localhost
      port: 9030
      schema: analytics
      
      # User/password auth
      username: your_starrocks_username
      password: your_starrocks_password
```

</File>

#### Description of Profile Fields
| Option   | Description                                            | Required? | Example                        |
|----------|--------------------------------------------------------|-----------|--------------------------------|
| type     | The specific adapter to use                            | Required  | `starrocks`                    |
| host     | The hostname to connect to                             | Required  | `192.168.100.28`               |
| port     | The port to use                                        | Required  | `9030`                         |
| schema   | Specify the schema (database) to build models into     | Required  | `analytics`                    |
| username | The username to use to connect to the server           | Required  | `dbt_admin`                    |
| password | The password to use for authenticating to the server   | Required  | `correct-horse-battery-staple` |
| version  | Let Plugin try to go to a compatible starrocks version | Optional  | `3.1.0`                        |

## Supported features

| Starrocks <= 2.5 | Starrocks 2.5 ~ 3.1  | Starrocks >= 3.1  |              Feature              |
|:----------------:|:--------------------:|:-----------------:|:---------------------------------:|
|        ✅         |          ✅           |         ✅         |       Table materialization       |
|        ✅         |          ✅           |         ✅         |       View materialization        |
|        ❌         |          ❌           |         ✅         | Materialized View materialization |
|        ❌         |          ✅           |         ✅         |    Incremental materialization    |
|        ❌         |          ✅           |         ✅         |         Primary Key Model         |
|        ✅         |          ✅           |         ✅         |              Sources              |
|        ✅         |          ✅           |         ✅         |         Custom data tests         |
|        ✅         |          ✅           |         ✅         |           Docs generate           |
|        ❌         |          ❌           |         ❌         |               Kafka               |

### Notice
1. When StarRocks Version < 2.5, `Create table as` can only set engine='OLAP' and table_type='DUPLICATE'
2. When StarRocks Version >= 2.5, `Create table as` supports table_type='PRIMARY'
3. When StarRocks Version < 3.1 distributed_by is required

It is recommended to use the latest starrocks version and dbt-starrocks version for the best experience.
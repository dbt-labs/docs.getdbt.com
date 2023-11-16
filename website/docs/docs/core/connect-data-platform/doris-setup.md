---
title: "Doris setup"
description: "Read this guide to learn about the Doris warehouse setup in dbt."
id: "doris-setup"
meta:
  maintained_by: SelectDB
  authors: long2ice,catpineapple
  github_repo: 'selectdb/dbt-selectdb'
  pypi_package: 'dbt-doris'
  min_core_version: 'v1.3.0'
  cloud_support: Not Supported
  slack_channel_name: '#db-doris'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'Apache Doris / SelectDB'
  config_page: '/reference/resource-configs/doris-configs'
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

<code>python -m pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>


## Connecting to Doris/SelectDB with **dbt-doris**

### User / Password Authentication

Configure your dbt profile for using Doris:

#### Doris connection profile
<File name='profiles.yml'>

```yaml
dbt-doris:
  target: dev
  outputs:
    dev:
      type: doris
      host: 127.0.0.1
      port: 9030
      schema: database_name
      username: username
      password: password

```

</File>

#### Description of Profile Fields

| Option   | Description                                                                                                                      | Required? | Example     |
|----------|----------------------------------------------------------------------------------------------------------------------------------|-----------|-------------|
| type     | The specific adapter to use                                                                                                      | Required  | `doris`     |
| host     | The hostname to connect to                                                                                                       | Required  | `127.0.0.1` |
| port     | The port to use                                                                                                                  | Required  | `9030`      |
| schema   | Specify the schema (database) to build models into, doris have not schema to make a collection of table or view' like PostgreSql | Required  | `dbt`       |
| username | The username to use to connect to the doris                                                                                      | Required  | `root`      |
| password | The password to use for authenticating to the doris                                                                              | Required  | `password`  |

## Database User Privileges

Your Doris/SelectDB database user would be able to have some abilities to read or write.
You can find some help [here](https://doris.apache.org/docs/admin-manual/privilege-ldap/user-privilege) with Doris privileges management.

| Required Privilege |
|--------------------|
| Select_priv        |
| Load_priv          |
| Alter_priv         |
| Create_priv        |
| Drop_priv          |

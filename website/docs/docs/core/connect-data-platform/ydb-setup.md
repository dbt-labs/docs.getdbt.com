---
title: "YDB setup"
description: "Read this guide to learn how to configure YDB with dbt."
id: "ydb-setup"
meta:
  maintained_by: YDB Team
  authors: YDB Team
  github_repo: 'ydb-platform/dbt-ydb'
  pypi_package: 'dbt-ydb'
  min_core_version: 'v1.8.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: 'n/a'
  slack_channel_link:
  platform_name: 'YDB'
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
    <li><strong><Constant name="cloud" /> support</strong>: {frontMatter.meta.cloud_support}</li>
    <li><strong>Minimum data platform version</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>
<h2> Installing {frontMatter.meta.pypi_package} </h2>

pip is the easiest way to install the adapter:

<code>python -m pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>

## Connecting to YDB

To connect to YDB from dbt, you'll need to add a [profile](/docs/core/connect-data-platform/connection-profiles) to your `profiles.yml` file. A YDB profile conforms to the following syntax:

<File name='profiles.yml'>

```yaml
profile-name:
  target: dev
  outputs:
    dev:
      type: ydb
      host: localhost
      port: 2136
      database: /local
      schema: empty_string
      secure: False
      root_certificates_path: empty_string

      # Static credentials
      username: empty_string
      password: empty_string

      # Access token credentials
      token: empty_string

      # Service account credentials
      service_account_credentials_file: empty_string

  ```

</File>

### All configurations

| Config | Required? | Default | Description |
| ------ | --------- | ------- | ----------- |
| host | Yes | | YDB host |
| port | Yes | | YDB port |
| database | Yes | | YDB database |
| schema | No | `empty_string` | Optional subfolder for dbt models. Use empty string or `/` to use root folder |
| secure | No | False | If enabled, `grpcs` protocol will be used |
| root_certificates_path | No | `empty_string`| Optional path to root certificates file |
| username | No | `empty_string` | YDB username to use static Ccredentials |
| password | No | `empty_string` | YDB password to use static credentials |
| token | No | `empty_string` | YDB token to use Access Token credentials |
| service_account_credentials_file | No | `empty_string` | Path to service account credentials file to use service account credentials |

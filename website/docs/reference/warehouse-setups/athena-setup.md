---
title: "Athena setup"
description: "Read this guide to learn about the Athena warehouse setup in dbt."
meta:
  maintained_by: Community
  authors: Community
  github_repo: 'dbt-athena/dbt-athena'
  pypi_package: 'dbt-athena-community'
  min_core_version: 'v1.3.0'
  cloud_support: Not Supported
  min_supported_version: 'engine version 2 and 3'
  slack_channel_name: '#db-athena'
  slack_channel_link: 'https://getdbt.slack.com/archives/C013MLFR7BQ'
  platform_name: 'Athena'
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

## Connecting to Athena with dbt-athena

This plugin does not accept any credentials directly. Instead, [credentials are determined automatically](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html) based on AWS CLI/boto3 conventions and stored login info. You can configure the AWS profile name to use via aws_profile_name. Check out the dbt profile configuration below for details.

<File name='~/.dbt/profiles.yml'>

```yaml
default:
  outputs:
    dev:
      type: athena
      s3_staging_dir: [s3_staging_dir]
      region_name: [region_name]
      database: [database name]
      schema: [dev_schema]
      aws_profile_name:
        [optional, profile to use from your AWS shared credentials file.]

  target: dev
```

</File>

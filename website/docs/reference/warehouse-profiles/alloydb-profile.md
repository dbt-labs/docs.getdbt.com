---
title: "AlloyDB Profile"
meta:
  maintained_by: Community?
  authors: 'dbt-labs'
  github_repo: 'dbt-labs/dbt-postgres'
  min_core_version: 'v1.0.0'
  cloud_support: Not Supported
  min_supported_version: '?'
  slack_channel_name: '#db-postgres'
  slack_channel_link: 'https://getdbt.slack.com/archives/C0172G2E273'
---

## Overview of AlloyDB support

<ul>
    <li><strong>Maintained by</strong>: {frontMatter.meta.maintained_by}</li>
    <li><strong>Authors</strong>: {frontMatter.meta.authors}</li>
    <li><strong>GitHub repo</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a><a href={`https://github.com/${frontMatter.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${frontMatter.meta.github_repo}?style=for-the-badge`}/></a></li>
    <li><strong>Slack channel</strong>: <a href={frontMatter.meta.slack_channel_link}>{frontMatter.meta.slack_channel_name}</a></li>
    <li><strong>Supported dbt Core version</strong>: {frontMatter.meta.min_core_version} and newer</li>
    <li><strong>dbt Cloud support</strong>: {frontMatter.meta.cloud_support}</li>
    <li><strong>Minimum data platform version</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>

## Profile Configuration

AlloyDB targets are configured exactly the same as [Postgres targets](postgres-profile.md#profile-configuration).

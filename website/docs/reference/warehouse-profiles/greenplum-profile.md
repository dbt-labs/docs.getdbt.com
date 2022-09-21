---
title: "Greenplum Profile"
meta:
  maintained_by: Community
  authors: 'Mark Poroshin, Dmitry Bevz'
  github_repo: 'markporoshin/dbt-greenplum'
  min_core_version: 'v1.0.0'
  cloud_support: Not Supported
  min_supported_version: 'Greenplum 6.0'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community'
---

## Overview of dbt-greenplum

<ul>
    <li><strong>Maintained by</strong>: {frontMatter.meta.maintained_by}</li>
    <li><strong>Authors</strong>: {frontMatter.meta.authors}</li>
    <li><strong>GitHub repo</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a><a href={`https://github.com/${frontMatter.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${frontMatter.meta.github_repo}?style=for-the-badge`}/></a></li>
    <li><strong>Slack channel</strong>: <a href={frontMatter.meta.slack_channel_link}>{frontMatter.meta.slack_channel_name}</a></li>
    <li><strong>Supported dbt Core version</strong>: {frontMatter.meta.min_core_version} and newer</li>
    <li><strong>dbt Cloud support</strong>: {frontMatter.meta.cloud_support}</li>
    <li><strong>Minimum data platform version</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>

The package can be installed from PyPI with:

```bash
$ pip install dbt-greenplum
```
For further (and more likely up-to-date) info, see the [README](https://github.com/markporoshin/dbt-greenplum#README.md)


## Profile Configuration

Greenplum targets should be set up using the following configuration in your `profiles.yml` file.

<File name='~/.dbt/profiles.yml'>

```yaml
company-name:
  target: dev
  outputs:
    dev:
      type: greenplum
      host: [hostname]
      user: [username]
      password: [password]
      port: [port]
      dbname: [database name]
      schema: [dbt schema]
      threads: [1 or more]
      keepalives_idle: 0 # default 0, indicating the system default. See below
      connect_timeout: 10 # default 10 seconds
      search_path: [optional, override the default postgres search_path]
      role: [optional, set the role dbt assumes when executing queries]
      sslmode: [optional, set the sslmode used to connect to the database]

```

</File>

### Notes

This adapter strongly depends on dbt-postgres, so you can read more about configurations here [Profile Setup](postgres-profile)
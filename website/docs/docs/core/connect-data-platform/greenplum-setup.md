---
title: "Greenplum setup"
description: "Read this guide to learn about the Greenplum warehouse setup in dbt."
id: "greenplum-setup"
meta:
  maintained_by: Community
  authors: 'Mark Poroshin, Dmitry Bevz'
  github_repo: 'markporoshin/dbt-greenplum'
  pypi_package: 'dbt-greenplum'
  min_core_version: 'v1.0.0'
  cloud_support: Not Supported
  min_supported_version: 'Greenplum 6.0'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'Greenplum'
  config_page: '/reference/resource-configs/greenplum-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


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

This adapter strongly depends on dbt-postgres, so you can read more about configurations here [Profile Setup](postgres-setup)

---
title: "Yellowbrick setup"
description: "Read this guide to learn about the Yellowbrick warehouse setup in dbt."
id: "yellowbrick-setup"
meta:
  maintained_by: Community
  authors: 'David Antelmi'
  github_repo: 'InfoCapital-AU/dbt-yellowbrick'
  pypi_package: 'dbt-yellowbrick'
  min_core_version: 'v1.5.0'
  cloud_support: Not Supported
  min_supported_version: 'Yellowbrick 5.2'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'Yellowbrick Data'
  config_page: '/reference/resource-configs/yellowbrick-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


For further (and more likely up-to-date) info, see the [README](https://github.com/infocapital/dbt-yellowbrick#README.md)


## Profile Configuration

Yellowbrick targets should be set up using the following configuration in your `profiles.yml` file.

<File name='~/.dbt/profiles.yml'>

```yaml
company-name:
  target: dev
  outputs:
    dev:
      type: yellowbrick
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

---
title: "Yellowbrick setup"
description: "Read this guide to learn about the Yellowbrick warehouse setup in dbt."
id: "yellowbrick-setup"
meta:
  maintained_by: Community
  authors: 'InfoCapital team'
  github_repo: 'InfoCapital-AU/dbt-yellowbrick'
  pypi_package: 'dbt-yellowbrick'
  min_core_version: 'v1.7.0'
  cloud_support: Not Supported
  min_supported_version: 'Yellowbrick 5.2'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'Yellowbrick Data'
  config_page: '/reference/resource-configs/yellowbrick-configs'
---

:::info Community plugin

Some core functionality may be limited. 

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>

## Profile configuration

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
      [role](#role): [optional, set the role dbt assumes when executing queries]
      [sslmode](#sslmode): [optional, set the sslmode used to connect to the database]
      [sslrootcert](#sslrootcert): [optional, set the sslrootcert config value to a new file path to customize the file location that contains root certificates]
  
```

</File>

### Configuration notes

This adapter is based on the dbt-postgres adapter documented here [Postgres profile setup](/docs/core/connect-data-platform/postgres-setup)

#### role

The `role` config controls the user role that dbt assumes when opening new connections to the database.

#### sslmode / sslrootcert

The ssl config parameters control how dbt connects to Yellowbrick using SSL. Refer to the [Yellowbrick documentation](https://docs.yellowbrick.com/5.2.27/client_tools/config_ssl_for_clients_intro.html) for
details.


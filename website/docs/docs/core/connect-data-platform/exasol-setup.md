---
title: "Exasol setup"
description: "Read this guide to learn about the Exasol warehouse setup in dbt."
meta:
  maintained_by: Community
  authors: 'Torsten Glunde, Ilija Kutle'
  github_repo: 'tglunde/dbt-exasol'
  pypi_package: 'dbt-exasol'
  min_core_version: 'v0.14.0'
  cloud_support: Not Supported
  min_supported_version: 'Exasol 6.x'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'Exasol'
  config_page: '/reference/resource-configs/no-configs'
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

### Connecting to Exasol with **dbt-exasol**

#### User / password authentication

Configure your dbt profile for using Exasol:

##### Exasol connection information

<File name='profiles.yml'>

```yaml
dbt-exasol:
  target: dev
  outputs:
    dev:
      type: exasol
      threads: 1
      dsn: HOST:PORT
      user: USERNAME
      password: PASSWORD
      dbname: db
      schema: SCHEMA
```
</File>

#### Optional parameters

- **`connection_timeout`** &mdash; defaults to pyexasol default
- **`socket_timeout`** &mdash; defaults to pyexasol default
- **`query_timeout`** &mdash; defaults to pyexasol default
- **`compression`** &mdash; default: False
- **`encryption`** &mdash; default: False
- **`protocol_version`** &mdash; default: v3
- **`row_separator`** &mdash; default: CRLF for windows - LF otherwise
- **`timestamp_format`** &mdash; default: `YYYY-MM-DDTHH:MI:SS.FF6`

  
  


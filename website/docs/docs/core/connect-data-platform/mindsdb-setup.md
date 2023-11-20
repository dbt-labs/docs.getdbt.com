---
title: "MindsDB setup"
id: "mindsdb-setup"
meta:
  maintained_by: MindsDB
  authors: 'MindsDB team'
  github_repo: 'mindsdb/dbt-mindsdb'
  pypi_package: 'dbt-mindsdb'
  min_core_version: 'v1.0.1'
  cloud_support: Not Supported
  min_supported_version: '?'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'MindsDB'
  config_page: '/reference/resource-configs/mindsdb-configs'
---

:::info Vendor-supported plugin

The dbt-mindsdb package allows dbt to connect to [MindsDB](https://github.com/mindsdb/mindsdb).

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Configurations

Basic `profile.yml` for connecting to MindsDB:

```yml
mindsdb:
  outputs:
    dev:
      database: 'mindsdb'
      host: '127.0.0.1'
      password: ''
      port: 47335
      schema: 'mindsdb'
      type: mindsdb
      username: 'mindsdb'
  target: dev

```
| Key      | Required | Description                                          | Example                        |
| -------- | -------- | ---------------------------------------------------- | ------------------------------ |
| type     |    ✔️   | The specific adapter to use                          | `mindsdb`                      |
| host     |    ✔️   | The MindsDB (hostname) to connect to                 | `cloud.mindsdb.com`            |
| port     |    ✔️   | The port to use                                      | `3306`  or `47335`             |
| schema   |    ✔️   | Specify the schema (database) to build models into   | The MindsDB datasource         |
| username |    ✔️   | The username to use to connect to the server         | `mindsdb` or mindsdb cloud user|
| password |    ✔️   | The password to use for authenticating to the server | `pass                          |



---
title: "iomete setup"
description: "Read this guide to learn about the iomete warehouse setup in dbt."
id: "iomete-setup"
meta:
  maintained_by: iomete
  authors: 'Namig Aliyev'
  github_repo: 'iomete/dbt-iomete'
  pypi_package: 'dbt-iomete'
  min_core_version: 'v0.18.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: '##db-iomete'
  slack_channel_link: 'https://getdbt.slack.com/archives/C03JFG22EP9'
  platform_name: 'iomete'
  config_page: '/reference/resource-configs/no-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />



Set up a iomete Target

iomete targets should be set up using the following configuration in your profiles.yml file.

<File name='profiles.yml'>

```yaml
iomete:
  target: dev
  outputs:
    dev:
      type: iomete
      cluster: cluster_name
      host: <region_name>.iomete.com
      port: 443
      schema: database_name
      account_number: iomete_account_number
      user: iomete_user_name
      password: iomete_user_password
```

</File>

##### Description of Profile Fields

| Field    | Description                                                                                                                             | Required | Example                |
|----------|-----------------------------------------------------------------------------------------------------------------------------------------|----------|------------------------|
| type     | The specific adapter to use                                                                                                             | Required | `iomete`               |
| cluster  | The cluster to connect                                                                                                                  | Required | `reporting`            |
| host     | The host name of the connection. It is a combination of <br/>`account_number` with the prefix `dwh-` <br/>and the suffix `.iomete.com`. | Required | `dwh-12345.iomete.com` |
| port     | The port to use.                                                                                                                        | Required | `443`                  |
| schema   | Specify the schema (database) to build models into.                                                                                     | Required | `dbt_finance`          |
| account_number | The iomete account number with single quotes.                                                                                           | Required | `'1234566789123'`        |
| username | The iomete username to use to connect to the server.                                                                                    | Required | `dbt_user`             |
| password | The iomete user password to use to connect to the server.                                                                               | Required | `strong_password`      |

## Supported Functionality

Most dbt Core functionality is supported. 

Iceberg specific improvements.
1. Joining the results of `show tables` and `show views`.

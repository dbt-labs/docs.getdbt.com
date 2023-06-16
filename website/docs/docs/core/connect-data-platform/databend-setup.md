---
title: "Databend Cloud setup"
description: "Read this guide to learn about the Databend warehouse setup in dbt."
id: "databend-setup"
meta:
  maintained_by: Databend Cloud
  authors: Shanjie Han
  github_repo: 'databendcloud/dbt-databend'
  pypi_package: 'dbt-databend-cloud'
  min_core_version: 'v1.0.0'
  core_version: 'v1.0.0 and newer'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  platform_name: 'Databend Cloud'
  config_page: '/reference/resource-configs/no-configs'
---

:::info Vendor-supported plugin

Some [core functionality](https://github.com/databendcloud/dbt-databend#supported-features) may be limited. 
If you're interested in contributing, check out the source code repository listed below.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Connecting to Databend Cloud with **dbt-databend-cloud**

### User / Password Authentication

Configure your dbt profile for using Databend Cloud:

#### Databend Cloud connection profile
<File name='profiles.yml'>

```yaml
dbt-databend-cloud:
  target: dev
  outputs:
    dev:
      type: databend
      host: databend-cloud-host
      port: 443
      schema: database_name
      user: username
      pass: password
```

</File>

#### Description of Profile Fields

| Option   | Description                                          | Required? | Example             |
|----------|------------------------------------------------------|-----------|---------------------|
| type     | The specific adapter to use                          | Required  | `databend`              |
| host   | The host (hostname) to connect to                  | Required  | `yourorg.datafusecloud.com`  |
| port     | The port to use                                      | Required  | `443`              |
| schema   | Specify the schema (database) to build models into   | Required  | `default`         |
| user | The username to use to connect to the host         | Required  | `dbt_admin`         |
| pass | The password to use for authenticating to the host | Required  | `awesome_password`  |

## Database User Privileges

Your database user would be able to have some abilities to read or write, such as `SELECT`, `CREATE`, and so on.
You can find some help [here](https://docs.databend.com/using-databend-cloud/warehouses/connecting-a-warehouse) with Databend Cloud privileges management.

| Required Privilege     |
|------------------------|
| SELECT                 |
| CREATE                 |
| CREATE TEMPORARY TABLE |
| CREATE VIEW            |
| INSERT                 |
| DROP                   |
| SHOW DATABASE          |
| SHOW VIEW              |
| SUPER                  |

## Supported features

 | ok |           Feature           |
|:--:|:---------------------------:|
|  ✅ |    Table materialization    |
|  ✅ |    View materialization     |
|  ✅ | Incremental materialization |
|  ❌  |  Ephemeral materialization  |
|  ✅ |            Seeds            |
|  ✅ |           Sources           |
|  ✅ |      Custom data tests      |
|  ✅ |        Docs generate        |
|  ❌ |          Snapshots          |
|  ✅ |      Connection retry       |

**Note:**

* Databend does not support `Ephemeral` and `SnapShot`. You can find more detail [here](https://github.com/datafuselabs/databend/issues/8685)

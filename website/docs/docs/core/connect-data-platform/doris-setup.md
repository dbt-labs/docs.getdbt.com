---
title: "Doris setup"
description: "Read this guide to learn about the Doris warehouse setup in dbt."
id: "doris-setup"
meta:
  maintained_by: SelectDB
  authors: long2ice,catpineapple
  github_repo: 'selectdb/dbt-doris'
  pypi_package: 'dbt-doris'
  min_core_version: 'v1.3.0'
  cloud_support: Not Supported
  slack_channel_name: '#db-doris'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'Apache Doris / SelectDB'
  config_page: '/reference/resource-configs/doris-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


## Connecting to Doris/SelectDB with **dbt-doris**

### User / Password Authentication

Configure your dbt profile for using Doris:

#### Doris connection profile
<File name='profiles.yml'>

```yaml
dbt-doris:
  target: dev
  outputs:
    dev:
      type: doris
      host: 127.0.0.1
      port: 9030
      schema: database_name
      username: username
      password: password

```

</File>

#### Description of Profile Fields

| Option   | Description                                                                                                                      | Required? | Example     |
|----------|----------------------------------------------------------------------------------------------------------------------------------|-----------|-------------|
| type     | The specific adapter to use                                                                                                      | Required  | `doris`     |
| host     | The hostname to connect to                                                                                                       | Required  | `127.0.0.1` |
| port     | The port to use                                                                                                                  | Required  | `9030`      |
| schema   | Specify the schema (database) to build models into, doris have not schema to make a collection of table or view' like PostgreSql | Required  | `dbt`       |
| username | The username to use to connect to the doris                                                                                      | Required  | `root`      |
| password | The password to use for authenticating to the doris                                                                              | Required  | `password`  |

## Database User Privileges

Your Doris/SelectDB database user would be able to have some abilities to read or write.
You can find some help [here](https://doris.apache.org/docs/admin-manual/privilege-ldap/user-privilege) with Doris privileges management.

| Required Privilege |
|--------------------|
| Select_priv        |
| Load_priv          |
| Alter_priv         |
| Create_priv        |
| Drop_priv          |

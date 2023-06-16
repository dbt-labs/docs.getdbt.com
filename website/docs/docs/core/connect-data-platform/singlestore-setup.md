---
title: "SingleStore setup"
description: "Read this guide to learn about the SingleStore warehouse setup in dbt."
id: "singlestore-setup"
meta:
  maintained_by: SingleStore, Inc.
  authors: 'SingleStore, Inc.'
  github_repo: 'memsql/dbt-singlestore'
  pypi_package: 'dbt-singlestore'
  min_core_version: 'v1.0.0'
  cloud_support: Not supported
  min_supported_version: 'v7.5'
  slack_channel_name: 'db-singlestore'
  slack_channel_link: 'https://getdbt.slack.com/archives/C02V2QHFF7U'
  platform_name: 'SingleStore'
  config_page: '/reference/resource-configs/no-configs'
---

:::info Vendor-supported plugin

Certain core functionality may vary. If you would like to report a bug, request a feature, or contribute, you can check out the linked repository and open an issue.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


### Set up a SingleStore Target

SingleStore targets should be set up using the following configuration in your `profiles.yml` file. If you are using SingleStore Managed Service, required connection details can be found on your Cluster Page under "Connect" -> "SQL IDE" tab.

<File name='~/.dbt/profiles.yml'>

```yaml
singlestore:
  target: dev
  outputs:
    dev:
      type: singlestore
      host: [hostname]  # optional, default localhost
      port: [port number]  # optional, default 3306
      user: [user]  # optional, default root
      password: [password]  # optional, default empty
      database: [database name]  # required
      schema: [prefix for tables that dbt will generate]  # required
      threads: [1 or more]  # optional, default 1
```

</File>
It is recommended to set optional parameters as well.

### Description of SingleStore Profile Fields

| Field                    | Required | Description |
|--------------------------|----------|--------------------------------------------------------------------------------------------------------|
| `type`                   | Yes | Must be set to `singlestore`. This must be included either in `profiles.yml` or in the `dbt_project.yml` file. |
| `host`                   | No | The host name of the SingleStore server to connect to. |
| `user`                   | No | Your SingleStore database username. |
| `password`               | No | Your SingleStore database password. |
| `database`               | Yes | The name of your database. If you are using custom database names in your models config, they must be created prior to running those models. |
| `schema`                 | Yes | The string to prefix the names of generated tables if `generate_alias_name` macro is added (see below). If you are using a custom schema name in your model config, it will be concatenated with the one specified in profile using `_`. |
| `threads`                | No | The number of threads available to dbt. |

## Schema and Concurrent Development

SingleStore doesn't have a concept of `schema` that corresponds to one used in `dbt` (namespace within a database). `schema` in your profile is required for `dbt` to work correctly with your project metadata. For example, you will see it on "dbt docs" page, even though it's not present in the database.

In order to support concurrent development, `schema` can be used to prefix <Term id="table" /> names that `dbt` is building within your database. In order to enable this, add the following macro to your project. This macro will take the `schema` field of your `profiles.yml` file and use it as a table name prefix.

```sql
-- macros/generate_alias_name.sql
{% macro generate_alias_name(custom_alias_name=none, node=none) -%}
    {%- if custom_alias_name is none -%}
        {{ node.schema }}__{{ node.name }}
    {%- else -%}
        {{ node.schema }}__{{ custom_alias_name | trim }}
    {%- endif -%}
{%- endmacro %}
```

Therefore, if you set `schema=dev` in your `.dbt/profiles.yml` file and run the `customers` model with the corresponding profile, `dbt` will create a table named `dev__customers` in your database.

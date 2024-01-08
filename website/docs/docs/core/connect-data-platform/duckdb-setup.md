---
title: "DuckDB setup"
description: "Read this guide to learn about the DuckDB warehouse setup in dbt."
meta:
  maintained_by: Community
  authors: 'Josh Wills (https://github.com/jwills)'
  github_repo: 'duckdb/dbt-duckdb'
  pypi_package: 'dbt-duckdb'
  min_core_version: 'v1.0.1'
  cloud_support: Not Supported
  min_supported_version: 'DuckDB 0.3.2'
  slack_channel_name: '#db-duckdb'
  slack_channel_link: 'https://getdbt.slack.com/archives/C039D1J1LA2'
  platform_name: 'Duck DB'
  config_page: '/reference/resource-configs/no-configs'
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


## Connecting to DuckDB with dbt-duckdb

[DuckDB](http://duckdb.org) is an embedded database, similar to SQLite, but designed for OLAP-style analytics instead of OLTP. The only configuration parameter that is required in your profile (in addition to `type: duckdb`) is the `path` field, which should refer to a path on your local filesystem where you would like the DuckDB database file (and it's associated write-ahead log) to be written. You can also specify the `schema` parameter if you would like to use a schema besides the default (which is called `main`).

There is also a `database` field defined in the `DuckDBCredentials` class for consistency with the parent `Credentials` class, but it defaults to `main` and setting it to be something else will likely cause strange things to happen that cannot be fully predicted, so please avoid changing it.

As of version 1.2.3, you can load any supported [DuckDB extensions](https://duckdb.org/docs/extensions/overview) by listing them in the `extensions` field in your profile. You can also set any additional [DuckDB configuration options](https://duckdb.org/docs/sql/configuration) via the `settings` field, including options that are supported in any loaded extensions. 

For example, to be able to connect to `s3` and read/write `parquet` files using an AWS access key and secret, your profile would look something like this:

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: duckdb
      path: 'file_path/database_name.duckdb'
      extensions:
        - httpfs
        - parquet
      settings:
        s3_region: my-aws-region
        s3_access_key_id: "{{ env_var('S3_ACCESS_KEY_ID') }}"
        s3_secret_access_key: "{{ env_var('S3_SECRET_ACCESS_KEY') }}"
```

</File>



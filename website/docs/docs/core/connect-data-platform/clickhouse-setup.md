---
title: "ClickHouse setup"
description: "Read this guide to learn about the ClickHouse warehouse setup in dbt."
meta:
  maintained_by: Community
  authors: 'Geoff Genz & Bentsi Leviav'
  github_repo: 'ClickHouse/dbt-clickhouse'
  pypi_package: 'dbt-clickhouse'
  min_core_version: 'v0.19.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-clickhouse'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01DRQ178LQ'
  platform_name: 'Clickhouse'
  config_page: '/reference/resource-configs/clickhouse-configs'
---

Some core functionality may be limited. If you're interested in contributing, check out the source code for each
repository listed below.

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Connecting to ClickHouse

To connect to ClickHouse from dbt, you'll need to add a [profile](/docs/core/connect-data-platform/connection-profiles)
to your `profiles.yml` configuration file. Follow the reference configuration below to set up a ClickHouse profile:

<File name='profiles.yml'>
```yaml
clickhouse-service:
  target: dev
  outputs:
    dev:
      type: clickhouse
      schema: [ default ]  # ClickHouse database for dbt models

      # optional
      host: [ <your-clickhouse-host> ]  # Your clickhouse cluster url for example, abc123.clickhouse.cloud. Defaults to `localhost`.
      port: [ 8123 ]  # Defaults to 8123, 8443, 9000, 9440 depending on the secure and driver settings 
      user: [ default ]  # User for all database operations
      password: [ <empty string> ]  # Password for the user
      secure: [ False ]  # Use TLS (native protocol) or HTTPS (http protocol)

```

For a complete list of configuration options, see the [ClickHouse documentation](https://clickhouse.com/docs/integrations/dbt).
</File>

### Create a dbt project
You can now use this profile in one of your existing projects or create a new one using:

```sh
dbt init project_name
```

Navigate to the `project_name` directory and update your `dbt_project.yml` file to use the profile you configured to connect to ClickHouse.

```yaml
profile: 'clickhouse-service'
```

### Test connection

Execute `dbt debug` with the CLI tool to confirm whether dbt is able to connect to ClickHouse. Confirm the response includes `Connection test: [OK connection ok]`, indicating a successful connection.

## Supported features

### dbt features

Type | Supported? | Details
-----|------------|----------------
Contracts | YES | 
Docs generate | YES |
Most dbt-utils macros | YES | (now included in dbt-core) 
Seeds | YES | 
Sources | YES | 
Snapshots | YES | 
Tests | YES | 

### Materializations

Type | Supported? | Details
-----|------------|----------------
Table | YES | Creates a [table](https://clickhouse.com/docs/en/operations/system-tables/tables/). See below for the list of supported engines.
View | YES | Creates a [view](https://clickhouse.com/docs/en/sql-reference/table-functions/view/).
Incremental | YES | Creates a table if it doesn't exist, and then writes only updates to it.
Microbatch incremental | YES | 
Ephemeral materialization | YES | Creates a ephemeral/CTE materialization. This model is internal to dbt and does not create any database objects.
Materialized View | YES, Experimental | Creates a [materialized view](https://clickhouse.com/docs/en/materialized-view).
Distributed table materialization | YES, Experimental | Creates a [distributed table](https://clickhouse.com/docs/en/engines/table-engines/special/distributed).
Distributed incremental materialization | YES, Experimental | Incremental model based on the same idea as distributed table. Note that not all strategies are supported, visit [this](https://github.com/ClickHouse/dbt-clickhouse?tab=readme-ov-file#distributed-incremental-materialization) for more info.
Dictionary materialization | YES, Experimental | Creates a [dictionary](https://clickhouse.com/docs/en/engines/table-engines/special/dictionary).

**Note**: Community-developed features are labeled as experimental. Despite this designation, many of these features, like materialized views, are widely adopted and successfully used in production environments.

## Documentation

See the [ClickHouse documentation](https://clickhouse.com/docs/integrations/dbt) for more details on using the `dbt-clickhouse` adapter to manage your data model.

## Contributing

We welcome contributions from the community to help improve the `dbt-ClickHouse` adapter. Whether you're fixing a bug,
adding a new feature, or enhancing the documentation, your efforts are greatly appreciated!

Please take a moment to read our [Contribution Guide](https://github.com/ClickHouse/dbt-clickhouse/blob/main/CONTRIBUTING.md) to get started. The guide provides detailed instructions on setting up your environment, running tests, and submitting pull requests.

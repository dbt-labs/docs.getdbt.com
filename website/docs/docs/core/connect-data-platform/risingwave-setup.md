---
title: "RisingWave setup"
id: "risingwave-setup"
description: "Read this guide to learn about how to set up RisingWave in dbt."
meta:
  maintained_by: RisingWave
  pypi_package: 'dbt-risingwave'
  authors: 'Dylan Chen'
  github_repo: 'risingwavelabs/dbt-risingwave'
  min_core_version: 'v1.6.1'
  min_supported_version: ''
  cloud_support: Not Supported
  slack_channel_name: 'N/A'
  slack_channel_link: 'https://www.risingwave.com/slack'
  platform_name: 'RisingWave'
  config_page: '/reference/resource-configs/no-configs'
---

:::info Vendor-supported plugin

Certain core functionality may vary. If you would like to report a bug, request a feature, or contribute, you can check out the linked repository and open an issue.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Connecting to RisingWave with dbt-risingwave

Before connecting to RisingWave, ensure that RisingWave is installed and running. For more information about how to get RisingWave up and running, see the [RisingWave quick start guide](https://docs.risingwave.com/get-started/quickstart).

To connect to RisingWave with dbt, you need to add a RisingWave profile to your dbt profile file (`~/.dbt/profiles.yml`). Below is an example RisingWave profile. Revise the field values when necessary.

<File name='~/.dbt/profiles.yml'>

```yaml
default:
  outputs:
    dev:
      type: risingwave
      host: [host name] 
      user: [user name]
      pass: [password]
      dbname: [database name]
      port: [port]
      schema: [dbt schema]
  target: dev
```

</File>

|Field|Description|
|---|---|
|`host`| The host name or IP address of the RisingWave instance|
|`user`|The RisingWave database user you want to use|
|`pass`| The password of the database user|
|`dbname` | The RisingWave database name|
|`port` | The port number that RisingWave listens on|
|`schema`| The schema of the RisingWave database|

To test the connection to RisingWave, run:

```bash
dbt debug
```

## Materializations

The dbt models for managing data transformations in RisingWave are similar to typical dbt SQL models. In the `dbt-risingwave` adapter, we have customized some of the materializations to align with the streaming data processing model of RisingWave.

|Materializations| Supported|Notes|
|----|----|----|
|`table` |Yes |Creates a [table](https://docs.risingwave.com/sql/commands/sql-create-table). To use this materialization, add `{{ config(materialized='table') }}` to your model SQL files. |
|`view`|Yes | Creates a [view](https://docs.risingwave.com/sql/commands/sql-create-view). To use this materialization, add `{{ config(materialized='view') }}` to your model SQL files. |
|`ephemeral`|Yes| This materialization uses [common table expressions](https://docs.risingwave.com/sql/query-syntax/with-clause) in RisingWave under the hood. To use this materialization, add `{{ config(materialized='ephemeral') }}` to your model SQL files.|
|`materializedview`| To be deprecated. |It is available only for backward compatibility purposes (for v1.5.1 of the dbt-risingwave adapter plugin). If you are using v1.6.0 and later versions of the dbt-risingwave adapter plugin, use `materialized_view` instead.|
|`materialized_view`| Yes| Creates a [materialized view](https://docs.risingwave.com/sql/commands/sql-create-mv). This materialization corresponds the `incremental` one in dbt. To use this materialization, add `{{ config(materialized='materialized_view') }}` to your model SQL files.|
| `incremental`|No|Please use `materialized_view` instead. Since RisingWave is designed to use materialized view to manage data transformation in an incremental way, you can just use the `materialized_view` materialization.|
|`source`| Yes| Creates a [source](https://docs.risingwave.com/sql/commands/sql-create-source). To use this materialization, add \{\{ config(materialized='source') \}\} to your model SQL files. You need to provide your create source statement as a whole in this model. See [Example model files](https://docs.risingwave.com/integrations/other/dbt#example-model-files) for details.|
|`table_with_connector`| Yes| Creates a table with connector settings. In RisingWave, a table with connector settings is similar to a source. The difference is that a table object with connector settings persists raw streaming data in the source, while a source object does not. To use this materialization, add `{{ config(materialized='table_with_connector') }}` to your model SQL files. You need to provide your create table with connector statement as a whole in this model (see [Example model files](https://docs.risingwave.com/integrations/other/dbt#example-model-files) for details). Because dbt tables have their own semantics, RisingWave use `table_with_connector` to distinguish itself from a dbt table.|
|`sink`| Yes| Creates a [sink](https://docs.risingwave.com/sql/commands/sql-create-sink). To use this materialization, add `{{ config(materialized='sink') }}` to your SQL files. You need to provide your create sink statement as a whole in this model. See [Example model files](https://docs.risingwave.com/integrations/other/dbt#example-model-files) for details.|

## Resources

- [RisingWave's guide about using dbt for data transformations](https://docs.risingwave.com/integrations/other/dbt)
- [A demo project using dbt to manage Nexmark benchmark queries in RisingWave](https://github.com/risingwavelabs/dbt_rw_nexmark)

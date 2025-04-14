---
title: Model configurations
description: "Reference guide for the model configs available in dbt."
meta:
  resource_type: Models
---

import ConfigResource from '/snippets/_config-description-resource.md';
import ConfigGeneral from '/snippets/_config-description-general.md';

## Related documentation
* [Models](/docs/build/models)
* [`run` command](/reference/commands/run)

## Available configurations
### Model-specific configurations

<ConfigResource meta={frontMatter.meta}/>

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project file', value: 'project-yaml', },
    { label: 'Property file', value: 'property-yaml', },
    { label: 'Config block', value: 'config', },
  ]
}>
<TabItem value="project-yaml">

<File name='dbt_project.yml'>

<VersionBlock lastVersion="1.8">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): <materialization_name>
    [+](/reference/resource-configs/plus-prefix)[sql_header](/reference/resource-configs/sql_header): <string>
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail # Only for materialized views on supported adapters
    [+](/reference/resource-configs/plus-prefix)[unique_key](/reference/resource-configs/unique_key): <column_name_or_expression>
```

</VersionBlock>

<VersionBlock firstVersion="1.9">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): <materialization_name>
    [+](/reference/resource-configs/plus-prefix)[sql_header](/reference/resource-configs/sql_header): <string>
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail # Only for materialized views on supported adapters
    [+](/reference/resource-configs/plus-prefix)[unique_key](/reference/resource-configs/unique_key): <column_name_or_expression>
    [+](/reference/resource-configs/plus-prefix)[batch_size](/reference/resource-configs/batch-size): day | hour | month | year
    [+](/reference/resource-configs/plus-prefix)[begin](/reference/resource-configs/begin): "<ISO formatted date or datetime (like, "2024-01-15T12:00:00Z")>"
    [+](/reference/resource-configs/plus-prefix)[lookback](/reference/resource-configs/lookback): <integer>
    [+](/reference/resource-configs/plus-prefix)[concurrent_batches](/reference/resource-properties/concurrent_batches): true | false
```

</VersionBlock>
</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

<VersionBlock lastVersion="1.8">

```yaml
version: 2

models:
  - name: [<model-name>] #  Must match the filename of a model -- including case sensitivity.
    config:
      [materialized](/reference/resource-configs/materialized): <materialization_name>
      [sql_header](/reference/resource-configs/sql_header): <string>
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail # Only for materialized views on supported adapters
      [unique_key](/reference/resource-configs/unique_key): <column_name_or_expression>

```
</VersionBlock>

<VersionBlock firstVersion="1.9">

```yaml
version: 2

models:
  - name: [<model-name>] #  Must match the filename of a model -- including case sensitivity.
    config:
      [materialized](/reference/resource-configs/materialized): <materialization_name>
      [sql_header](/reference/resource-configs/sql_header): <string>
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail # Only for materialized views on supported adapters
      [unique_key](/reference/resource-configs/unique_key): <column_name_or_expression>
      [batch_size](/reference/resource-configs/batch-size): day | hour | month | year
      [begin](/reference/resource-configs/begin): "<ISO formatted date or datetime (like, "2024-01-15T12:00:00Z")>"
      [lookback](/reference/resource-configs/lookback): <integer>
      [concurrent_batches](/reference/resource-properties/concurrent_batches): true | false

```
</VersionBlock>
</File>

</TabItem>

<TabItem value="config">

<File name='models/<model_name>.sql'>

<VersionBlock lastVersion="1.8">

```sql

{{ config(
    [materialized](/reference/resource-configs/materialized)="<materialization_name>",
    [sql_header](/reference/resource-configs/sql_header)="<string>"
    [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail #only for materialized views for supported adapters
    [unique_key](/reference/resource-configs/unique_key)='column_name_or_expression'
) }}

```
</VersionBlock>

<VersionBlock firstVersion="1.9">

```sql

{{ config(
    [materialized](/reference/resource-configs/materialized)="<materialization_name>",
    [sql_header](/reference/resource-configs/sql_header)="<string>"
    [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail # Only for materialized views for supported adapters
    [unique_key](/reference/resource-configs/unique_key)='column_name_or_expression'
    [batch_size](/reference/resource-configs/batch-size)='day' | 'hour' | 'month' | 'year'
    [begin](/reference/resource-configs/begin)="<ISO formatted date or datetime (like, "2024-01-15T12:00:00Z")>"
    [lookback](/reference/resource-configs/lookback)= <integer>
    [concurrent_batches](/reference/resource-properties/concurrent_batches)= true | false
) }}

```

</VersionBlock>

</File>

</TabItem>

</Tabs>


### General configurations

<ConfigGeneral />

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project file', value: 'project-yaml', },
    { label: 'Property file', value: 'property-yaml', },
    { label: 'Config block', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

<VersionBlock lastVersion="1.8">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[enabled](/reference/resource-configs/enabled): true | false
    [+](/reference/resource-configs/plus-prefix)[tags](/reference/resource-configs/tags): <string> | [<string>]
    [+](/reference/resource-configs/plus-prefix)[pre-hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
    [+](/reference/resource-configs/plus-prefix)[post-hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
    [+](/reference/resource-configs/plus-prefix)[database](/reference/resource-configs/database): <string>
    [+](/reference/resource-configs/plus-prefix)[schema](/reference/resource-properties/schema): <string>
    [+](/reference/resource-configs/plus-prefix)[alias](/reference/resource-configs/alias): <string>
    [+](/reference/resource-configs/plus-prefix)[persist_docs](/reference/resource-configs/persist_docs): <dict>
    [+](/reference/resource-configs/plus-prefix)[full_refresh](/reference/resource-configs/full_refresh): <boolean>
    [+](/reference/resource-configs/plus-prefix)[meta](/reference/resource-configs/meta): {<dictionary>}
    [+](/reference/resource-configs/plus-prefix)[grants](/reference/resource-configs/grants): {<dictionary>}
    [+](/reference/resource-configs/plus-prefix)[contract](/reference/resource-configs/contract): {<dictionary>}

```
</VersionBlock>

<VersionBlock firstVersion="1.9">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[enabled](/reference/resource-configs/enabled): true | false
    [+](/reference/resource-configs/plus-prefix)[tags](/reference/resource-configs/tags): <string> | [<string>]
    [+](/reference/resource-configs/plus-prefix)[pre-hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
    [+](/reference/resource-configs/plus-prefix)[post-hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
    [+](/reference/resource-configs/plus-prefix)[database](/reference/resource-configs/database): <string>
    [+](/reference/resource-configs/plus-prefix)[schema](/reference/resource-properties/schema): <string>
    [+](/reference/resource-configs/plus-prefix)[alias](/reference/resource-configs/alias): <string>
    [+](/reference/resource-configs/plus-prefix)[persist_docs](/reference/resource-configs/persist_docs): <dict>
    [+](/reference/resource-configs/plus-prefix)[full_refresh](/reference/resource-configs/full_refresh): <boolean>
    [+](/reference/resource-configs/plus-prefix)[meta](/reference/resource-configs/meta): {<dictionary>}
    [+](/reference/resource-configs/plus-prefix)[grants](/reference/resource-configs/grants): {<dictionary>}
    [+](/reference/resource-configs/plus-prefix)[contract](/reference/resource-configs/contract): {<dictionary>}
    [+](/reference/resource-configs/plus-prefix)[event_time](/reference/resource-configs/event-time): my_time_field

```
</VersionBlock>
</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

<VersionBlock lastVersion="1.8">

```yaml
version: 2

models:
  - name: [<model-name>] # Must match the filename of a model -- including case sensitivity.
    config:
      [enabled](/reference/resource-configs/enabled): true | false
      [tags](/reference/resource-configs/tags): <string> | [<string>]
      [pre_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [post_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [database](/reference/resource-configs/database): <string>
      [schema](/reference/resource-properties/schema): <string>
      [alias](/reference/resource-configs/alias): <string>
      [persist_docs](/reference/resource-configs/persist_docs): <dict>
      [full_refresh](/reference/resource-configs/full_refresh): <boolean>
      [meta](/reference/resource-configs/meta): {<dictionary>}
      [grants](/reference/resource-configs/grants): {<dictionary>}
      [contract](/reference/resource-configs/contract): {<dictionary>}
```
</VersionBlock>

<VersionBlock firstVersion="1.9">

```yaml
version: 2

models:
  - name: [<model-name>] #  Must match the filename of a model -- including case sensitivity.
    config:
      [enabled](/reference/resource-configs/enabled): true | false
      [tags](/reference/resource-configs/tags): <string> | [<string>]
      [pre_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [post_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [database](/reference/resource-configs/database): <string>
      [schema](/reference/resource-properties/schema): <string>
      [alias](/reference/resource-configs/alias): <string>
      [persist_docs](/reference/resource-configs/persist_docs): <dict>
      [full_refresh](/reference/resource-configs/full_refresh): <boolean>
      [meta](/reference/resource-configs/meta): {<dictionary>}
      [grants](/reference/resource-configs/grants): {<dictionary>}
      [contract](/reference/resource-configs/contract): {<dictionary>}
      [event_time](/reference/resource-configs/event-time): my_time_field
```

</VersionBlock>
</File>

</TabItem>

<TabItem value="config">

<File name='models/<model_name>.sql'>

<VersionBlock lastVersion="1.8">

```sql

{{ config(
    [enabled](/reference/resource-configs/enabled)=true | false,
    [tags](/reference/resource-configs/tags)="<string>" | ["<string>"],
    [pre_hook](/reference/resource-configs/pre-hook-post-hook)="<sql-statement>" | ["<sql-statement>"],
    [post_hook](/reference/resource-configs/pre-hook-post-hook)="<sql-statement>" | ["<sql-statement>"],
    [database](/reference/resource-configs/database)="<string>",
    [schema](/reference/resource-properties/schema)="<string>",
    [alias](/reference/resource-configs/alias)="<string>",
    [persist_docs](/reference/resource-configs/persist_docs)={<dict>},
    [meta](/reference/resource-configs/meta)={<dict>},
    [grants](/reference/resource-configs/grants)={<dict>},
    [contract](/reference/resource-configs/contract)={<dictionary>}
) }}

```
</VersionBlock>

<VersionBlock firstVersion="1.9">

```sql

{{ config(
    [enabled](/reference/resource-configs/enabled)=true | false,
    [tags](/reference/resource-configs/tags)="<string>" | ["<string>"],
    [pre_hook](/reference/resource-configs/pre-hook-post-hook)="<sql-statement>" | ["<sql-statement>"],
    [post_hook](/reference/resource-configs/pre-hook-post-hook)="<sql-statement>" | ["<sql-statement>"],
    [database](/reference/resource-configs/database)="<string>",
    [schema](/reference/resource-properties/schema)="<string>",
    [alias](/reference/resource-configs/alias)="<string>",
    [persist_docs](/reference/resource-configs/persist_docs)={<dict>},
    [meta](/reference/resource-configs/meta)={<dict>},
    [grants](/reference/resource-configs/grants)={<dict>},
    [contract](/reference/resource-configs/contract)={<dictionary>},
    [event_time](/reference/resource-configs/event-time)='my_time_field',

) }}

```
</VersionBlock>

</File>

</TabItem>

</Tabs>

### Warehouse-specific configurations
* [BigQuery configurations](/reference/resource-configs/bigquery-configs)
* [Redshift configurations](/reference/resource-configs/redshift-configs)
* [Snowflake configurations](/reference/resource-configs/snowflake-configs)
* [Databricks configurations](/reference/resource-configs/databricks-configs)
* [Spark configurations](/reference/resource-configs/spark-configs)

## Configuring models 

Model configurations are applied hierarchically. You can configure models from within an installed package and also from within your <Constant name="dbt" /> project in the following ways, listed in order of precedence: 

1. Using a `config()` Jinja macro within a model.
2. Using a `config` [resource property](/reference/model-properties) in a `.yml` file.
3. From the `dbt_project.yml` project file, under the `models:` key. In this case, the model that's nested the deepest will have the highest priority. 
  - Note, the model name configuration must match the _filename_ of a model &mdash; including case sensitivity. Any mismatched casing can prevent <Constant name="dbt" /> from applying configurations correctly and may affect metadata in [<Constant name="explorer" />](/docs/collaborate/explore-projects).

The most specific configuration always takes precedence. In the project file, for example, configurations applied to a `marketing` subdirectory will take precedence over configurations applied to the entire `jaffle_shop` project. To apply a configuration to a model or directory of models, define the [resource path](/reference/resource-configs/resource-path) as nested dictionary keys.

Model configurations in your root <Constant name="dbt" /> project have _higher_ precedence than configurations in installed packages. This enables you to override the configurations of installed packages, providing more control over your <Constant name="dbt" /> runs. 

## Example

### Configuring directories of models in `dbt_project.yml`

To configure models in your `dbt_project.yml` file, use the `models:` configuration option. Be sure to namespace your configurations to your project (shown below):

<File name='dbt_project.yml'>

```yml


name: dbt_labs

models:
  # Be sure to namespace your model configs to your project name
  dbt_labs:

    # This configures models found in models/events/
    events:
      +enabled: true
      +materialized: view

      # This configures models found in models/events/base
      # These models will be ephemeral, as the config above is overridden
      base:
        +materialized: ephemeral

      ...


```

</File>

### Apply configurations to one model only

Some types of configurations are specific to a particular model. In these cases, placing configurations in the `dbt_project.yml` file can be unwieldy. Instead, you can specify these configurations at the top of a model `.sql` file, or in its individual YAML properties.

<File name='models/events/base/base_events.sql'>

```sql
{{
  config(
    materialized = "table",
    sort = 'event_time',
    dist = 'event_id'
  )
}}


select * from ...
```

</File>

<File name='models/events/base/properties.yml'>

```yaml
version: 2

models:
  - name: base_events
    config:
      materialized: table
      sort: event_time
      dist: event_id
```

</File>

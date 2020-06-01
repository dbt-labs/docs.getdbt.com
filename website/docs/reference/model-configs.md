---
title: Model configurations
---

## Related documentation
* [Models](docs/building-a-dbt-project/building-models)
* [`run` command](command-line-interface/run)

## Available configurations
### Model-specific configurations

<Tabs
  groupId="config-languages"
  defaultValue="yaml"
  values={[
    { label: 'YAML', value: 'yaml', },
    { label: 'Config block', value: 'config', },
  ]
}>
<TabItem value="yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](resource-path):
    +[materialized](materialized): <materialization_name>
    +[sql_header](sql_header): <string>

```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja

{{ config(
    [materialized](materialized)="<materialization_name>",
    [sql_header](sql_header)="<string>"
) }}

```

</File>

</TabItem>

</Tabs>


### General configurations

<Tabs
  groupId="config-languages"
  defaultValue="yaml"
  values={[
    { label: 'YAML', value: 'yaml', },
    { label: 'Config block', value: 'config', },
  ]
}>

<TabItem value="yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](resource-path):
    +[enabled](enabled): true | false
    +[tags](tags): <string> | [<string>]
    +[pre-hook](pre-hook-post-hook): <sql-statement> | [<sql-statement>]
    +[post-hook](post-hook-post-hook): <sql-statement> | [<sql-statement>]
    +[database](resource-configs/database): <string>
    +[schema](resource-configs/schema): <string>
    +[alias](resource-configs/alias): <string>

```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja

{{ config(
    [enabled](enabled)=true | false,
    [tags](tags)="<string>" | ["<string>"],
    [pre_hook](pre-hook-post-hook)="<sql-statement>" | ["<sql-statement>"],
    [post_hook](pre-hook-post-hook)="<sql-statement>" | ["<sql-statement>"],
    [database](resource-configs/database): <string>,
    [schema](resource-configs/schema): <string>,
    [alias](resource-configs/alias): <string>
) }}

```

</File>

</TabItem>

</Tabs>

### Warehouse-specific configurations
* [BigQuery configurations](bigquery-configs)
* [Redshift configurations](redshift-configs)
* [Snowflake configurations](snowflake-configs)
* [Spark configurations](spark-configs)

## Configuring models
Models can be configured in one of two ways:

1. Using a `config` block within a model, or
2. From the `dbt_project.yml` file, under the `models:` key. To apply a configuration to a snapshot, or directory of snapshots, define the resource path as nested dictionary keys.

Model configurations are applied hierarchically — configurations applied to a `marketing` subdirectory will take precedence over configurations applied to the entire `jaffle_shop` project.

## Example

### Configuring directories of models in `dbt_project.yml`

To configure models in your `dbt_project.yml` file, use the `models:` configuration option. Be sure to use namespace your configurations to your project (shown below):

<File name='dbt_project.yml'>

```yml


name: fishtown_analytics

models:
  # Be sure to namespace your model configs to your project name
  fishtown_analytics:

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

Some types of configurations are specific to a particular model. In these cases, placing configurations in the `dbt_project.yml` file can be unwieldy. Instead, you can specify these configurations at the top of a model .sql file.

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

---
title: Model configurations
---

<Changelog>
    - **v0.21.0** introduced the `config` property, thereby allowing you to configure models in all `.yml` files
</Changelog>

## Related documentation
* [Models](/docs/build/models)
* [`run` command](run)

## Available configurations
### Model-specific configurations

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

```yaml
models:
  [<resource-path>](resource-path):
    [+](plus-prefix)[materialized](materialized): <materialization_name>
    [+](plus-prefix)[sql_header](sql_header): <string>

```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml
version: 2

models:
  - name: [<model-name>]
    config:
      [materialized](materialized): <materialization_name>
      [sql_header](sql_header): <string>

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
  defaultValue="project-yaml"
  values={[
    { label: 'Project file', value: 'project-yaml', },
    { label: 'Property file', value: 'property-yaml', },
    { label: 'Config block', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](resource-path):
    [+](plus-prefix)[enabled](enabled): true | false
    [+](plus-prefix)[tags](resource-configs/tags): <string> | [<string>]
    [+](plus-prefix)[pre-hook](pre-hook-post-hook): <sql-statement> | [<sql-statement>]
    [+](plus-prefix)[post-hook](pre-hook-post-hook): <sql-statement> | [<sql-statement>]
    [+](plus-prefix)[database](resource-configs/database): <string>
    [+](plus-prefix)[schema](resource-configs/schema): <string>
    [+](plus-prefix)[alias](resource-configs/alias): <string>
    [+](plus-prefix)[persist_docs](persist_docs): <dict>
    [+](plus-prefix)[full_refresh](full_refresh): <boolean>
    [+](plus-prefix)[meta](meta): {<dictionary>}
    [+](plus-prefix)[grants](grants): {<dictionary>}

```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml
version: 2

models:
  - name: [<model-name>]
    config:
      [enabled](enabled): true | false
      [tags](resource-configs/tags): <string> | [<string>]
      [pre-hook](pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [post-hook](pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [database](resource-configs/database): <string>
      [schema](resource-configs/schema): <string>
      [alias](resource-configs/alias): <string>
      [persist_docs](persist_docs): <dict>
      [full_refresh](full_refresh): <boolean>
      [meta](meta): {<dictionary>}
      [grants](grants): {<dictionary>}
```

</File>

</TabItem>



<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja

{{ config(
    [enabled](enabled)=true | false,
    [tags](resource-configs/tags)="<string>" | ["<string>"],
    [pre_hook](pre-hook-post-hook)="<sql-statement>" | ["<sql-statement>"],
    [post_hook](pre-hook-post-hook)="<sql-statement>" | ["<sql-statement>"],
    [database](resource-configs/database)="<string>",
    [schema](resource-configs/schema)="<string>",
    [alias](resource-configs/alias)="<string>",
    [persist_docs](persist_docs)={<dict>},
    [meta](meta)={<dict>}
    [grants](grants)={<dict>}
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
Models can be configured in one of three ways:

1. Using a `config()` Jinja macro within a model
2. Using a `config` [resource property](model-properties) in a `.yml` file
3. From the `dbt_project.yml` file, under the `models:` key.

Model configurations are applied hierarchically. The most-specific config always "wins": In the project file, configurations applied to a `marketing` subdirectory will take precedence over configurations applied to the entire `jaffle_shop` project. To apply a configuration to a model, or directory of models, define the resource path as nested dictionary keys.

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

Some types of configurations are specific to a particular model. In these cases, placing configurations in the `dbt_project.yml` file can be unwieldy. Instead, you can specify these configurations at the top of a model `.sql` file, or in its individual yaml properties.

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

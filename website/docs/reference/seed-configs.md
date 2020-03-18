---
title: Seed configurations
---

## Available configurations

* [quote_columns](resource-configs/quote_columns.md): true | false
* [enabled](resource-configs/enabled.md): true | false
* [schema](resource-configs/schema.md): string
* [database](resource-configs/database.md): string
* [alias](resource-configs/alias.md): string
* [pre-hook](resource-configs/pre-hook.md): sql-statement | [sql-statement]
* [post-hook](resource-configs/post-hook.md): sql-statement | [sql-statement]
* [column_types](resource-configs/column_types.md): {column_name: datatype}
* [tags](resource-configs/tags.md): string | [string]

## Configuring seeds
Seeds can only be configured from the `dbt_project.yml` file, under the `seeds:` key. To apply a configuration to a seed, or directory of seeds, define the resource path as nested dictionary keys.

Seed configurations, like model configurations, are applied hierarchically — configurations applied to a `marketing` subdirectory will take precedence over configurations applied to the entire `jaffle_shop` project.

### Examples
#### Apply the `schema` configuration to all seeds
To apply a configuration to all seeds, nest it directly under the `seeds` key:

<File name='dbt_project.yml'>

```yml

seeds:
  schema: seed_data
```

</File>


#### Apply the `schema` configuration to all seeds in your project
To apply a configuration to all seeds in a project, provide the project name as part of the resource path.
<!-- To-do: hyperlink project name -->

For a project named `jaffle_shop`:

<File name='dbt_project.yml'>

```yml

seeds:
  jaffle_shop:
    schema: seed_data
```

</File>

#### Apply the `schema` configuration to one seed only
To apply a configuration to one seed only, provide the full resource path (including the project name, and subdirectories).

For a project named `jaffle_shop`, with a seed file at `data/marketing/utm_parameters.csv`:

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop:
    marketing:
      utm_parameters:
        schema: seed_data
```

</File>


## Example seed configuration
The following is a valid seed configuration for a project with:
* `name: jaffle_shop`
* A seed file at `data/country_codes.csv`, and
* A seed file at `data/marketing/utm_parameters.csv`


<File name='dbt_project.yml'>

```yml
name: jaffle_shop
...
seeds:
  jaffle_shop:
    enabled: true
    schema: seed_data
    # This configures data/country_codes.csv
    country_codes:
      # Override column types
      column_types:
        country_code: varchar(2)
        country_name: varchar(32)
    marketing:
      schema: marketing # this will take precedence
```

</File>

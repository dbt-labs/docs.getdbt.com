---
title: Seed configurations
---

<Changelog>
    - **v0.21.0** introduced the `config` property, thereby allowing you to configure seeds in all `.yml` files
</Changelog>


## Available configurations
### Seed-specific configurations

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project file', value: 'project-yaml', },
    { label: 'Property file', value: 'property-yaml', },
  ]
}>
<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yml
seeds:
  [<resource-path>](resource-path):
    [+](plus-prefix)[quote_columns](resource-configs/quote_columns): true | false
    [+](plus-prefix)[column_types](resource-configs/column_types): {column_name: datatype}

```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='seeds/properties.yml'>

```yaml
version: 2

seeds:
  - name: [<seed-name>]
    config:
      [quote_columns](resource-configs/quote_columns): true | false
      [column_types](resource-configs/column_types): {column_name: datatype}

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
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
seeds:
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

seeds:
  - name: [<seed-name>]
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

</Tabs>

## Configuring seeds
Seeds can only be configured from yaml files, either in `dbt_project.yml` or within an individual seed's yaml properties. It is not possible to configure a seed from within its CSV file.

Seed configurations, like model configurations, are applied hierarchically — configurations applied to a `marketing` subdirectory will take precedence over configurations applied to the entire `jaffle_shop` project, and configurations defined in a specific seed's properties will override configurations defined in `dbt_project.yml`.

### Examples
#### Apply the `schema` configuration to all seeds
To apply a configuration to all seeds, including those in any installed [packages](/docs/build/packages), nest the configuration directly under the `seeds` key:

<File name='dbt_project.yml'>

```yml

seeds:
  +schema: seed_data
```

</File>


#### Apply the `schema` configuration to all seeds in your project
To apply a configuration to all seeds in your project only (i.e. _excluding_ any seeds in installed packages), provide your [project name](project-configs/name.md) as part of the resource path.

For a project named `jaffle_shop`:

<File name='dbt_project.yml'>

```yml

seeds:
  jaffle_shop:
    +schema: seed_data
```

</File>

Similarly, you can use the name of an installed package to configure seeds in that package.

#### Apply the `schema` configuration to one seed only
To apply a configuration to one seed only, provide the full resource path (including the project name, and subdirectories).

<File name='seeds/marketing/properties.yml'>

```yml
version: 2

seeds:
  - name: utm_parameters
    config:
      schema: seed_data
```

</File>

In older versions of dbt, you must define configurations in `dbt_project.yml` and include the full resource path (including the project name, and subdirectories). For a project named `jaffle_shop`, with a seed file at `seeds/marketing/utm_parameters.csv`, this would look like:

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop:
    marketing:
      utm_parameters:
        +schema: seed_data
```

</File>


## Example seed configuration
The following is a valid seed configuration for a project with:
* `name: jaffle_shop`
* A seed file at `seeds/country_codes.csv`, and
* A seed file at `seeds/marketing/utm_parameters.csv`


<File name='dbt_project.yml'>

```yml
name: jaffle_shop
...
seeds:
  jaffle_shop:
    +enabled: true
    +schema: seed_data
    # This configures seeds/country_codes.csv
    country_codes:
      # Override column types
      +column_types:
        country_code: varchar(2)
        country_name: varchar(32)
    marketing:
      +schema: marketing # this will take precedence
```

</File>

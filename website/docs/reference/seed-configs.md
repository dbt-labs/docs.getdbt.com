---
title: Seed configurations
description: "Read this guide to learn about using seed configurations in dbt."
meta:
  resource_type: Seeds
---

import ConfigResource from '/snippets/_config-description-resource.md';
import ConfigGeneral from '/snippets/_config-description-general.md';


## Available configurations
### Seed-specific configurations

<ConfigResource meta={frontMatter.meta} />

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
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[quote_columns](/reference/resource-configs/quote_columns): true | false
    [+](/reference/resource-configs/plus-prefix)[column_types](/reference/resource-configs/column_types): {column_name: datatype}
    [+](/reference/resource-configs/plus-prefix)[delimiter](/reference/resource-configs/delimiter): <string>

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
      [quote_columns](/reference/resource-configs/quote_columns): true | false
      [column_types](/reference/resource-configs/column_types): {column_name: datatype}
      [delimiter](/reference/resource-configs/grants): <string>

```

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
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
seeds:
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
      [enabled](/reference/resource-configs/enabled): true | false
      [tags](/reference/resource-configs/tags): <string> | [<string>]
      [pre-hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [post-hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [database](/reference/resource-configs/database): <string>
      [schema](/reference/resource-properties/schema): <string>
      [alias](/reference/resource-configs/alias): <string>
      [persist_docs](/reference/resource-configs/persist_docs): <dict>
      [full_refresh](/reference/resource-configs/full_refresh): <boolean>
      [meta](/reference/resource-configs/meta): {<dictionary>}
      [grants](/reference/resource-configs/grants): {<dictionary>}

```

</File>

</TabItem>

</Tabs>

## Configuring seeds
Seeds can only be configured from YAML files, either in `dbt_project.yml` or within an individual seed's YAML properties. It is not possible to configure a seed from within its CSV file.

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
To apply a configuration to all seeds in your project only (i.e. _excluding_ any seeds in installed packages), provide your [project name](/reference/project-configs/name.md) as part of the resource path.

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

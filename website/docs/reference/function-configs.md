---
title: Function configurations
description: "Read this guide to learn about using function configurations in dbt."
meta:
  resource_type: Functions
---

import ConfigResource from '/snippets/_config-description-resource.md';
import ConfigGeneral from '/snippets/_config-description-general.md';

<VersionCallout version="1.11" /> 

## Available configurations
### Function-specific configurations

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
functions:
  [<resource-path>](/reference/resource-configs/resource-path):
    # Function-specific configs are defined in the property file
    # See functions/schema.yml examples below

```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='functions/schema.yml'>

```yaml

functions:
  - name: [<function-name>]
    config:
      # Standard configs that apply to functions
      [database](/reference/resource-configs/database): <string>
      [schema](/reference/resource-properties/schema): <string>
      [alias](/reference/resource-configs/alias): <string>
      [tags](/reference/resource-configs/tags): <string> | [<string>]
      [meta](/reference/resource-configs/meta): {<dictionary>}

```

</File>

</TabItem>

</Tabs>

### General configurations

<ConfigGeneral />

:::note Database, schema, and alias configuration
Functions support `database`, `schema`, and `alias` configurations just like models. These determine where the function is created in your warehouse. The function will use the standard dbt configuration precedence (specific config > project config > target profile defaults).
:::

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
functions:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[enabled](/reference/resource-configs/enabled): true | false
    [+](/reference/resource-configs/plus-prefix)[tags](/reference/resource-configs/tags): <string> | [<string>]
    [+](/reference/resource-configs/plus-prefix)[database](/reference/resource-configs/database): <string>
    [+](/reference/resource-configs/plus-prefix)[schema](/reference/resource-properties/schema): <string>
    [+](/reference/resource-configs/plus-prefix)[alias](/reference/resource-configs/alias): <string>
    [+](/reference/resource-configs/plus-prefix)[meta](/reference/resource-configs/meta): {<dictionary>}

```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='functions/schema.yml'>

```yaml

functions:
  - name: [<function-name>]
    config:
      [enabled](/reference/resource-configs/enabled): true | false
      [tags](/reference/resource-configs/tags): <string> | [<string>]
      [database](/reference/resource-configs/database): <string>
      [schema](/reference/resource-properties/schema): <string>
      [alias](/reference/resource-configs/alias): <string>
      [meta](/reference/resource-configs/meta): {<dictionary>}

```

</File>

</TabItem>
</Tabs>

## Configuring functions
Functions are configured in YAML files, either in `dbt_project.yml` or within an individual function's YAML properties file. The function body is defined in a SQL file in the `functions/` directory.

Function configurations, like model configurations, are applied hierarchically. For more info, refer to [config inheritance](/reference/define-configs#config-inheritance). 

Functions respect the same name-generation macros as models: [`generate_database_name`](/docs/build/custom-databases), [`generate_schema_name`](/docs/build/custom-schemas#how-does-dbt-generate-a-models-schema-name), and [`generate_alias_name`](/docs/build/custom-aliases).

### Examples
#### Apply the `schema` configuration to all functions
To apply a configuration to all functions, including those in any installed [packages](/docs/build/packages), nest the configuration directly under the `functions` key:

<File name='dbt_project.yml'>

```yml

functions:
  +schema: udf_schema
```

</File>


#### Apply the `schema` configuration to all functions in your project
To apply a configuration to all functions in your project only (i.e. _excluding_ any functions in installed packages), provide your [project name](/reference/project-configs/name.md) as part of the resource path.

For a project named `jaffle_shop`:

<File name='dbt_project.yml'>

```yml

functions:
  jaffle_shop:
    +schema: udf_schema
```

</File>

Similarly, you can use the name of an installed package to configure functions in that package.

#### Apply the `schema` configuration to one function only

To apply a configuration to one function only in a properties file, specify the configuration in the function's `config` block:

<File name='functions/schema.yml'>

```yml

functions:
  - name: is_positive_int
    config:
      schema: udf_schema
```

</File>

To apply a configuration to one function only in `dbt_project.yml`, provide the full resource path (including the project name and subdirectories). For a project named `jaffle_shop`, with a function file at `functions/is_positive_int.sql`:

<File name='dbt_project.yml'>

```yml
functions:
  jaffle_shop:
    is_positive_int:
      +schema: udf_schema
```

</File>


## Example function configuration

The following example shows how to configure functions in a project named `jaffle_shop` that has two function files:
- `functions/is_positive_int.sql`
- `functions/marketing/clean_url.sql`


<File name='dbt_project.yml'>

```yml
name: jaffle_shop
...
functions:
  jaffle_shop:
    +enabled: true
    +schema: udf_schema
    # This configures functions/is_positive_int.sql
    is_positive_int:
      +tags: ['validation']
    marketing:
      +schema: marketing_udfs # this will take precedence
```

</File>

<File name='functions/schema.yml'>

```yml

functions:
  - name: is_positive_int
    description: Determines if a string represents a positive integer
    config:
      database: analytics
      schema: udf_schema
    arguments:
      - name: a_string
        data_type: string
        description: The string to check
    returns:
      data_type: boolean
      description: Returns true if the string represents a positive integer
```

</File>

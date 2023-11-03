---
title: Source configurations
description: "Learn how to use source configurations in dbt."
id: source-configs
---

## Available configurations

Sources only support one configuration, [`enabled`](/reference/resource-configs/enabled).

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
sources:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[enabled](/reference/resource-configs/enabled): true | false

```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml
version: 2

sources:
  - name: [<source-name>]
    [config](/reference/resource-properties/config):
      [enabled](/reference/resource-configs/enabled): true | false
    tables:
      - name: [<source-table-name>]
        [config](/reference/resource-properties/config):
          [enabled](/reference/resource-configs/enabled): true | false

```

</File>

</TabItem>

</Tabs>

## Configuring sources

Sources can be configured via a `config:` block within their `.yml` definitions, or from the `dbt_project.yml` file under the `sources:` key. This configuration is most useful for configuring sources imported from [a package](/docs/build/packages). 

You can disable sources imported from a package to prevent them from rendering in the documentation, or to prevent [source freshness checks](/docs/build/sources#snapshotting-source-data-freshness) from running on source tables imported from packages. 

- **Note**: To disable a source nested in a YAML file in a subfolder, you will need to supply the path to that YAML file plus the source name in the dbt_project.yml file. For example:

  <File name='dbt_project.yml'>

  ```yml
  sources:
    your_project_name:
      subdirectory_name:
        source_yaml_file_name:
          source_name:
            +enabled: false # This will apply to sources nested in subfolders.
  ```
  </File>



### Examples
#### Disable all sources imported from a package
To apply a configuration to all sources included from a [package](/docs/build/packages),
state your configuration under the [project name](/reference/project-configs/name.md) in the
`sources:` config as a part of the resource path.


<File name='dbt_project.yml'>

```yml
sources:
  events:
    +enabled: false
```

</File>


#### Conditionally enable a single source

When defining a source, you can disable the entire source, or specific source tables, using the inline `config` property:

<File name='models/sources.yml'>

```yml
version: 2

sources:
  - name: my_source
    config:
      enabled: true
    tables:
      - name: my_source_table  # enabled
      - name: ignore_this_one  # not enabled
        config:
          enabled: false
```

</File>

You can configure specific source tables, and use [variables](/reference/dbt-jinja-functions/var) as the input to that configuration:
 
<File name='models/sources.yml'>

```yml
version: 2

sources:
  - name: my_source
    tables:
      - name: my_source_table
        config:
          enabled: "{{ var('my_source_table_enabled', false) }}"
```

</File>

#### Disable a single source from a package

To disable a specific source from another package, qualify the resource path for your configuration with both a package name and a source name. In this case, we're disabling the `clickstream` source from the `events` package.

<File name='dbt_project.yml'>

```yml
sources:
  events:
    clickstream:
      +enabled: false
```

</File>

Similarly, you can disable a specific table from a source by qualifying the resource path with a package name, source name, and table name:

<File name='dbt_project.yml'>

```yml
sources:
  events:
    clickstream:
      pageviews:
        +enabled: false
```

</File>


## Example source configuration
The following is a valid source configuration for a project with:
* `name: jaffle_shop`
* A package called `events` containing multiple source tables


<File name='dbt_project.yml'>

```yml
name: jaffle_shop
config-version: 2
...
sources:
  # project names
  jaffle_shop:
    +enabled: true

  events:
    # source names
    clickstream:
      # table names
      pageviews:
        +enabled: false
      link_clicks:
        +enabled: true
```

</File>

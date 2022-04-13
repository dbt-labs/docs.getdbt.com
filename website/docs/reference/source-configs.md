---
title: Source configurations
id: source-configs
---

## Available configurations
### Source-specific configurations
* None

### General configurations
* [enabled](resource-configs/enabled.md): true | false

## Configuring sources
Sources can be configured via a `config:` block within their `.yml` definitions, or from the `dbt_project.yml` file under the `sources:` key. This configuration is most useful for configuring sources imported from [a package](package-management). You can disable sources imported from a package to prevent them from rendering in the documentation, or to prevent [source freshness checks](using-sources#snapshotting-source-data-freshness) from running on source tables imported from packages.

### Examples
#### Disable all sources imported from a package
To apply a configuration to all sources included from a [package](package-management),
state your configuration under the [project name](project-configs/name.md) in the
`sources:` config as a part of the resource path.


<File name='dbt_project.yml'>

```yml
sources:
  events:
    +enabled: false
```

</File>


#### Conditionally enable a single source

<VersionBlock firstVersion="1.1">

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

You can configure specific source tables, and use [variables](dbt-jinja-functions/var) as the input to that configuration:
 
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

</VersionBlock>

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

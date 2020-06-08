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
Sources can be configured from the `dbt_project.yml` file under the `sources:`
key. This configuration is most useful for configuring sources imported from
[a package](package-management). You can disable sources imported from a package
to prevent them from rendering in the documentation, or to prevent
[source freshness checks](using-sources#snapshotting-source-data-freshness)
from running on source tables imported from packages.

Unlike models, source configurations are _not_ applied hierarchically based on
folder paths. Instead, source configurations are applied based on:
 - The package which contains the source
 - The source name
 - The table name


### Examples
#### Disable all sources imported from a package
To apply a configuration to all sources included from a [package](package-management),
state your configuration under the [project name](project-configs/name.md) in the
`sources:` config as a part of the resource path.


<File name='dbt_project.yml'>

```yml

sources:
  events:
    enabled: false
```

</File>


#### Disable a specific source

To disable a specific source, qualify the resource path for your configuration
with both a package name and a source name.


<File name='dbt_project.yml'>

```yml

sources:
  events:
    clickstream:
      enabled: false
```

</File>

Similarly, you can disable a specific table from a source by qualifying the
resource path with a package name, source name, and table name:

<File name='dbt_project.yml'>

```yml
sources:
  events:
    clickstream:
      pageviews:
        enabled: false
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
    enabled: true

  events:
    # source names
    clickstream:
      # table names
      pageviews:
        enabled: false
      link_clicks:
        enabled: true
```

</File>

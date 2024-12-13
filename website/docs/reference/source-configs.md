---
title: Source configurations
description: "Learn how to use source configurations in dbt."
id: source-configs
---

import ConfigGeneral from '/snippets/_config-description-general.md';

## Available configurations

<VersionBlock lastVersion="1.8">

Sources supports [`enabled`](/reference/resource-configs/enabled) and [`meta`](/reference/resource-configs/meta).

</VersionBlock>

<VersionBlock firstVersion="1.9">

Sources configurations support [`enabled`](/reference/resource-configs/enabled), [`event_time`](/reference/resource-configs/event-time), and [`meta`](/reference/resource-configs/meta)

</VersionBlock>

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

<VersionBlock firstVersion="1.9">

```yaml
sources:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[enabled](/reference/resource-configs/enabled): true | false
    [+](/reference/resource-configs/plus-prefix)[event_time](/reference/resource-configs/event-time): my_time_field
    [+](/reference/resource-configs/plus-prefix)[meta](/reference/resource-configs/meta):
      key: value

```
</VersionBlock>

<VersionBlock lastVersion="1.8">

```yaml
sources:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[enabled](/reference/resource-configs/enabled): true | false
    [+](/reference/resource-configs/plus-prefix)[meta](/reference/resource-configs/meta):
      key: value
```
</VersionBlock>

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

<VersionBlock firstVersion="1.9">

```yaml
version: 2

sources:
  - name: [<source-name>]
    [config](/reference/resource-properties/config):
      [enabled](/reference/resource-configs/enabled): true | false
      [event_time](/reference/resource-configs/event-time): my_time_field
      [meta](/reference/resource-configs/meta): {<dictionary>}

    tables:
      - name: [<source-table-name>]
        [config](/reference/resource-properties/config):
          [enabled](/reference/resource-configs/enabled): true | false
          [event_time](/reference/resource-configs/event-time): my_time_field
          [meta](/reference/resource-configs/meta): {<dictionary>}

```
</VersionBlock>

<VersionBlock lastVersion="1.8">

```yaml
version: 2

sources:
  - name: [<source-name>]
    [config](/reference/resource-properties/config):
      [enabled](/reference/resource-configs/enabled): true | false
      [meta](/reference/resource-configs/meta): {<dictionary>}
    tables:
      - name: [<source-table-name>]
        [config](/reference/resource-properties/config):
          [enabled](/reference/resource-configs/enabled): true | false
          [meta](/reference/resource-configs/meta): {<dictionary>}

```
</VersionBlock>

</File>

</TabItem>

</Tabs>

## Configuring sources

Sources can be configured via a `config:` block within their `.yml` definitions, or from the `dbt_project.yml` file under the `sources:` key. This configuration is most useful for configuring sources imported from [a package](/docs/build/packages). 

You can disable sources imported from a package to prevent them from rendering in the documentation, or to prevent [source freshness checks](/docs/build/sources#source-data-freshness) from running on source tables imported from packages. 

- **Note**: To disable a source table nested in a YAML file in a subfolder, you will need to supply the subfolder(s) within the path to that YAML file, as well as the source name and the table name in the `dbt_project.yml` file.<br /><br /> 
  The following example shows how to disable a source table nested in a YAML file in a subfolder: 

  <File name='dbt_project.yml'>

  <VersionBlock firstVersion="1.9">

  ```yaml
  sources:
    your_project_name:
      subdirectory_name:
        source_name:
          source_table_name:
            +enabled: false
            +event_time: my_time_field
  ```

  </VersionBlock>

  <VersionBlock lastVersion="1.8">
    ```yaml
  sources:
    your_project_name:
      subdirectory_name:
        source_name:
          source_table_name:
            +enabled: false
  ```
  </VersionBlock>
  </File>


### Examples

The following examples show how to configure sources in your dbt project.

&mdash; [Disable all sources imported from a package](#disable-all-sources-imported-from-a-package) <br />
&mdash; [Conditionally enable a single source](#conditionally-enable-a-single-source) <br />
&mdash; [Disable a single source from a package](#disable-a-single-source-from-a-package) <br />
&mdash; [Configure a source with an `event_time`](#configure-a-source-with-an-event_time) <br />
&mdash; [Configure meta to a source](#configure-meta-to-a-source) <br />

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


#### Configure a source with an `event_time`

<VersionBlock lastVersion="1.8">

Configuring an [`event_time`](/reference/resource-configs/event-time) for a source is only available in [the dbt Cloud "Latest" release track](/docs/dbt-versions/cloud-release-tracks) or dbt Core versions 1.9 and later.

</VersionBlock>

<VersionBlock firstVersion="1.9">

To configure a source with an `event_time`, specify the `event_time` field in the source configuration. This field is used to represent the actual timestamp of the event, rather than something like a loading date.

For example, if you had a source table called `clickstream` in the `events` source, you can use the timestamp for each event in the `event_timestamp` column as follows:

<File name='dbt_project.yml'>

```yaml
sources:
  events:
    clickstream:
      +event_time: event_timestamp
```
</File>

In this example, the `event_time` is set to `event_timestamp`, which has the exact time each clickstream event happened.
Not only is this required for the [incremental microbatching strategy](/docs/build/incremental-microbatch), but when you compare data across [CI and production](/docs/deploy/advanced-ci#speeding-up-comparisons) environments, dbt will use `event_timestamp` to filter and match data by this event-based timeframe, ensuring that only overlapping timeframes are compared.

</VersionBlock>

#### Configure meta to a source

Use the `meta` field to assign metadata information to sources. This is useful for tracking additional context, documentation, logging, and more. 

For example, you can add `meta` information to a `clickstream` source to include information about the data source system:

<File name='dbt_project.yml'>

```yaml
sources:
  events:
    clickstream:
      +meta:
        source_system: "Google analytics"
        data_owner: "marketing_team"
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

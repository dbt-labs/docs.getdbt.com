---
title: "event_time"
id: "event-time"
sidebar_label: "event_time"
resource_types: [models, seeds, source]
description: "dbt uses event_time to understand when an event occurred. When defined, event_time enables microbatch incremental models and more refined comparison of datasets during Advanced CI."
datatype: string
---

<VersionCallout version="1.9" />

<Tabs>
<TabItem value="model" label="Models">

<File name='dbt_project.yml'>

```yml
models:
  [resource-path:](/reference/resource-configs/resource-path)
    +event_time: my_time_field
```
</File>

<File name='models/properties.yml'>

```yml
models:
  - name: model_name
    [config](/reference/resource-properties/config):
      event_time: my_time_field
```
</File>

<File name="models/modelname.sql">

```sql
{{ config(
    event_time='my_time_field'
) }}
```

</File>

</TabItem>

<TabItem value="seeds" label="Seeds">

<File name='dbt_project.yml'>

```yml
seeds:
  [resource-path:](/reference/resource-configs/resource-path)
    +event_time: my_time_field
```
</File>

<File name='seeds/properties.yml'>

```yml
seeds:
  - name: seed_name
    [config](/reference/resource-properties/config):
      event_time: my_time_field
```

</File>
</TabItem>

<TabItem value="snapshot" label="Snapshots">

<File name='dbt_project.yml'>

```yml
snapshots:
  [resource-path:](/reference/resource-configs/resource-path)
    +event_time: my_time_field
```
</File>

<VersionBlock firstVersion="1.9">
<File name='snapshots/properties.yml'>

```yml
snapshots:
  - name: snapshot_name
    [config](/reference/resource-properties/config):
      event_time: my_time_field
```
</File>
</VersionBlock>

<VersionBlock lastVersion="1.8">

<File name="models/modlename.sql">

```sql

{{ config(
    event_time: 'my_time_field'
) }}
```

</File>


import SnapshotYaml from '/snippets/_snapshot-yaml-spec.md';

<SnapshotYaml/>
</VersionBlock>



</TabItem>

<TabItem value="sources" label="Sources">

<File name='dbt_project.yml'>

```yml
sources:
  [resource-path:](/reference/resource-configs/resource-path)
    +event_time: my_time_field
```
</File>

<File name='models/properties.yml'>

```yml
sources:
  - name: source_name
    [config](/reference/resource-properties/config):
      event_time: my_time_field
```

</File>
</TabItem>
</Tabs>

## Definition

You can configure `event_time` for a [model](/docs/build/models), [seed](/docs/build/seeds), or [source](/docs/build/sources) in your `dbt_project.yml` file, property YAML file, or config block.

`event_time` is required for the [incremental microbatch](/docs/build/incremental-microbatch) strategy and highly recommended for [Advanced CI's compare changes](/docs/deploy/advanced-ci#optimizing-comparisons) in CI/CD workflows, where it ensures the same time-slice of data is correctly compared between your CI and production environments.

### Best practices

Set the `event_time` to the name of the field that represents the actual timestamp of the event (like `account_created_at`). The timestamp of the event should represent "at what time did the row occur" rather than an event ingestion date. Marking a column as the `event_time` when it isn't, diverges from the semantic meaning of the column which may result in user confusion when other tools make use of the metadata.

However, if an ingestion date (like `loaded_at`, `ingested_at`, or `last_updated_at`) are the only timestamps you use, you can set `event_time` to these fields. Here are some considerations to keep in mind if you do this:

- Using `last_updated_at` or `loaded_at` &mdash; May result in duplicate entries in the resulting table in the data warehouse over multiple runs. Setting an appropriate [lookback](/reference/resource-configs/lookback) value can reduce duplicates but it can't fully eliminate them since some updates outside the lookback window won't be processed.
- Using `ingested_at` &mdash; Since this column is created by your ingestion/EL tool instead of coming from the original source, it will change if/when you need to resync your connector for some reason. This means that data will be reprocessed and loaded into your warehouse for a second time against a second date. As long as this never happens (or you run a full refresh when it does), microbatches will be processed correctly when using `ingested_at`. 

Here are some examples of recommended and not recommended `event_time` columns:


| <div style={{width:'200px'}}>Status</div>      | Column name     | Description    |
|--------------------|---------------------|----------------------|
| ✅ Recommended | `account_created_at` | Represents the specific time when an account was created, making it a fixed event in time.                       |
| ✅ Recommended | `session_began_at`    | Captures the exact timestamp when a user session started, which won’t change and directly ties to the event.     |
| ❌ Not recommended | `_fivetran_synced`    | This represents the time the event was ingested, not when it happened.                                           |
| ❌ Not recommended | `last_updated_at`    | Changes over time and isn't tied to the event itself. If used, note the considerations mentioned earlier in [best practices](#best-practices).    |

## Examples

<Tabs> 

<TabItem value="model" label="Models">

Here's an example in the `dbt_project.yml` file:

<File name='dbt_project.yml'>

```yml
models:
  my_project:
    user_sessions:
      +event_time: session_start_time
```
</File>

Example in a properties YAML file:

<File name='models/properties.yml'>

```yml
models:
  - name: user_sessions
    config:
      event_time: session_start_time
```

</File>

Example in sql model config block:

<File name="models/user_sessions.sql">

```sql
{{ config(
    event_time='session_start_time'
) }}
```

</File> 

This setup sets `session_start_time` as the `event_time` for the `user_sessions` model.
</TabItem> 

<TabItem value="seeds" label="Seeds">

Here's an example in the `dbt_project.yml` file:

<File name='dbt_project.yml'>

```yml
seeds:
  my_project:
    my_seed:
      +event_time: record_timestamp
```

</File>

Example in a seed properties YAML:

<File name='seeds/properties.yml'>

```yml
seeds:
  - name: my_seed
    config:
      event_time: record_timestamp
```
</File>

This setup sets `record_timestamp` as the `event_time` for `my_seed`. 

</TabItem> 

<TabItem value="snapshot" label="Snapshots">

Here's an example in the `dbt_project.yml` file:

<File name='dbt_project.yml'>

```yml
snapshots:
  my_project:
    my_snapshot:
      +event_time: record_timestamp
```

</File>

Example in a snapshot properties YAML:

<File name='my_project/properties.yml'>

```yml
snapshots:
  - name: my_snapshot
    config:
      event_time: record_timestamp
```
</File>

This setup sets `record_timestamp` as the `event_time` for `my_snapshot`. 

</TabItem> 

<TabItem value="sources" label="Sources">

Here's an example of source properties YAML file:

<File name='models/properties.yml'>

```yml
sources:
  - name: source_name
    tables:
      - name: table_name
        config:
          event_time: event_timestamp
```
</File>

This setup sets `event_timestamp` as the `event_time` for the specified source table.

</TabItem> 
</Tabs>

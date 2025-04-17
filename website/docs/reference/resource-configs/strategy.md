---
resource_types: [snapshots]
description: "Strategy - Read this in-depth guide to learn about configurations in dbt."
datatype: timestamp | check
---

<VersionBlock lastVersion="1.8">

import SnapshotYaml from '/snippets/_snapshot-yaml-spec.md';

<SnapshotYaml/>
</VersionBlock>

<Tabs
  defaultValue="timestamp"
  values={[
    { label: 'timestamp', value: 'timestamp', },
    { label: 'check', value: 'check', }
  ]
}>
<TabItem value="timestamp">

<VersionBlock firstVersion="1.9">

<File name='snapshots/<filename>.yml'>
  
  ```yaml
  snapshots:
  - [name: snapshot_name](/reference/resource-configs/snapshot_name):
    relation: source('my_source', 'my_table')
    config:
      strategy: timestamp
      updated_at: column_name
  ```
</File>
</VersionBlock>

<VersionBlock lastVersion="1.8">

<File name='snapshots/<filename>.sql'>

```jinja2
{% snapshot [snapshot_name](snapshot_name) %}

{{ config(
  strategy="timestamp",
  updated_at="column_name"
) }}

select ...

{% endsnapshot %}

```

</File>
</VersionBlock>

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +strategy: timestamp
    +updated_at: column_name

```

</File>

</TabItem>

<TabItem value="check">

<VersionBlock firstVersion="1.9">

<File name='snapshots/<filename>.yml'>
  
  ```yaml
  snapshots:
  - [name: snapshot_name](/reference/resource-configs/snapshot_name):
    relation: source('my_source', 'my_table')
    config:
      strategy: check
      check_cols: [column_name] | "all"
  ```
</File>
</VersionBlock>

<VersionBlock lastVersion="1.8">
<File name='snapshots/<filename>.sql'>

```jinja2
{% snapshot [snapshot_name](snapshot_name) %}

{{ config(
  strategy="check",
  check_cols=[column_name] | "all"
) }}

{% endsnapshot %}

```

</File>
</VersionBlock>

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +strategy: check
    +check_cols: [column_name] | all

```

</File>

</TabItem>

</Tabs>

## Description
The snapshot strategy dbt should use to detect record changes. Read the guide to [snapshots](/docs/build/snapshots#detecting-row-changes) to understand the differences between the two.

## Default
This is a **required configuration**. There is no default value.

## Examples
### Use the timestamp strategy

<VersionBlock firstVersion="1.9">
<File name='snapshots/timestamp_example.yml'>

```yaml
snapshots:
  - name: orders_snapshot_timestamp
    relation: source('jaffle_shop', 'orders')
    config:
      schema: snapshots
      strategy: timestamp
      unique_key: id
      updated_at: updated_at

```

</File>
</VersionBlock>

<VersionBlock lastVersion="1.8">
<File name='snapshots/timestamp_example.sql'>

```sql
{% snapshot orders_snapshot_timestamp %}

    {{
        config(
          target_schema='snapshots',
          strategy='timestamp',
          unique_key='id',
          updated_at='updated_at',
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>
</VersionBlock>


### Use the check strategy

<VersionBlock firstVersion="1.9">
<File name='snapshots/check_example.yml'>

```yaml
snapshots:
  - name: orders_snapshot_check
    relation: source('jaffle_shop', 'orders')
    config:
      schema: snapshots
      unique_key: id
      strategy: check
      check_cols:
        - status
        - is_cancelled

```
</File>
</VersionBlock>

<VersionBlock lastVersion="1.8">

```sql
{% snapshot orders_snapshot_check %}

    {{
        config(
          target_schema='snapshots',
          strategy='check',
          unique_key='id',
          check_cols=['status', 'is_cancelled'],
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```
</VersionBlock>

### Advanced: define and use custom snapshot strategy
Behind the scenes, snapshot strategies are implemented as macros, named `snapshot_<strategy>_strategy`
* [Source code](https://github.com/dbt-labs/dbt-adapters/blob/60005a0a2bd33b61cb65a591bc1604b1b3fd25d5/dbt/include/global_project/macros/materializations/snapshots/strategies.sql#L52) for the timestamp strategy
* [Source code](https://github.com/dbt-labs/dbt-adapters/blob/60005a0a2bd33b61cb65a591bc1604b1b3fd25d5/dbt/include/global_project/macros/materializations/snapshots/strategies.sql#L136) for the check strategy

It's possible to implement your own snapshot strategy by adding a macro with the same naming pattern to your project. For example, you might choose to create a strategy which records hard deletes, named `timestamp_with_deletes`.

1. Create a macro named `snapshot_timestamp_with_deletes_strategy`. Use the existing code as a guide and adjust as needed.
2. Use this strategy via the `strategy` configuration:

<VersionBlock firstVersion="1.9">
<File name='snapshots/<filename>.yml'>

```yaml
snapshots:
  - name: my_custom_snapshot
    relation: source('my_source', 'my_table')
    config:
      strategy: timestamp_with_deletes
      updated_at: updated_at_column
      unique_key: id
```
</File>
</VersionBlock>


<VersionBlock lastVersion="1.8">
<File name='snapshots/<filename>.sql'>

```jinja2
{% snapshot [snapshot_name](snapshot_name) %}

{{ config(
  strategy="timestamp_with_deletes",
  updated_at="column_name"
) }}

{% endsnapshot %}

```

</File>
</VersionBlock>

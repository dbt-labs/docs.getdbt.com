---
resource_types: [snapshots]
description: "Invalidate_hard_deletes - Read this in-depth guide to learn about configurations in dbt."
datatype: column_name
---


<VersionBlock firstVersion="1.9">

<File name='snapshots/<filename>.yml'>

```yaml
snapshots:
  - name: snapshot
    relation: source('my_source', 'my_table')
    [config](/reference/snapshot-configs):
      strategy: timestamp
      invalidate_hard_deletes: true | false
```

</File>


</VersionBlock>

<VersionBlock lastVersion="1.8">

import SnapshotYaml from '/snippets/_snapshot-yaml-spec.md';

<SnapshotYaml/>

<File name='snapshots/<filename>.sql'>

```jinja2
{{
  config(
    strategy="timestamp",
    invalidate_hard_deletes=True
  )
}}

```

</File>
</VersionBlock>

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +strategy: timestamp
    +invalidate_hard_deletes: true

```

</File>

## Description
Opt-in feature to enable invalidating hard deleted records while snapshotting the query.


## Default
By default the feature is disabled.

## Example

<VersionBlock firstVersion="1.9">
<File name='snapshots/orders.yml'>

```yaml
snapshots:
  - name: orders_snapshot
    relation: source('jaffle_shop', 'orders')
    config:
      schema: snapshots
      database: analytics
      unique_key: id
      strategy: timestamp
      updated_at: updated_at
      invalidate_hard_deletes: true
  ```
</File>

</VersionBlock>

<VersionBlock lastVersion="1.8">
<File name='snapshots/orders.sql'>

```sql
{% snapshot orders_snapshot %}

    {{
        config(
          target_schema='snapshots',
          strategy='timestamp',
          unique_key='id',
          updated_at='updated_at',
          invalidate_hard_deletes=True,
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>
</VersionBlock>

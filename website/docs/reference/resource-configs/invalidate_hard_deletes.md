---
resource_types: [snapshots]
description: "Invalidate_hard_deletes - Read this in-depth guide to learn about configurations in dbt."
datatype: column_name
---

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

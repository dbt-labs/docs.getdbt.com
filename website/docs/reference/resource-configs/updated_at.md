---
resource_types: [snapshots]
description: "Updated_at - Read this in-depth guide to learn about configurations in dbt."
datatype: column_name
---
<File name='snapshots/<filename>.sql'>

```jinja2
{{ config(
  strategy="timestamp",
  updated_at="column_name"
) }}

```

</File>

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +strategy: timestamp
    +updated_at: column_name

```

</File>

## Description
A column within the results of your snapshot query that represents when the record row was last updated.

This parameter is **required if using the `timestamp` [strategy](/reference/resource-configs/strategy)**.


## Default
No default is provided.

## Examples
### Use a column name `updated_at`

<File name='snapshots/orders.sql'>

```sql
{% snapshot orders_snapshot %}

{{
    config(
      target_schema='snapshots',
      unique_key='id',

      strategy='timestamp',
      updated_at='updated_at'
    )
}}

select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}

```

</File>

### Coalesce two columns to create a reliable `updated_at` column
Consider a data source that only has an `updated_at` column filled in when a record is updated (so a `null` value indicates that the record hasn't been updated after it was created).

Since the `updated_at` configuration only takes a column name, rather than an expression, you should update your snapshot query to include the coalesced column.

<File name='snapshots/orders.sql'>

```sql
{% snapshot orders_snapshot %}

{{
    config(
      target_schema='snapshots',
      unique_key='id',

      strategy='timestamp',
      updated_at='updated_at_for_snapshot'
    )
}}

select
    *,
    coalesce(updated_at, created_at) as updated_at_for_snapshot

from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}

```

</File>

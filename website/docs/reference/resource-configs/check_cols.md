---
resource_types: [snapshots]
description: "Read this guide to understand the check_cols configuration in dbt."
datatype: "[column_name] | all"
---
<File name='snapshots/<filename>.sql'>

```jinja2
{{ config(
  strategy="check",
  updated_at=["column_name"]
) }}

```

</File>


<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +strategy: check
    +check_cols: [column_name] | all

```

</File>

## Description
A list of columns within the results of your snapshot query to check for changes.

Alternatively, use all columns using the `all` value (however this may be less performant).

This parameter is **required if using the `check` [strategy](/reference/resource-configs/strategy)**.

## Default
No default is provided.

## Examples

### Check a list of columns for changes

```sql
{% snapshot orders_snapshot_check %}

    {{
        config(
          strategy='check',
          unique_key='id',
          check_cols=['status', 'is_cancelled'],
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

### Check all columns for changes

```sql
{% snapshot orders_snapshot_check %}

    {{
        config(
          strategy='check',
          unique_key='id',
          check_cols='all',
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

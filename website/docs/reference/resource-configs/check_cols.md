---
resource_types: [snapshots]
description: "Read this guide to understand the check_cols configuration in dbt."
datatype: "[column_name] | all"
---

<VersionBlock firstVersion="1.9">
<File name="snapshots/<filename>.yml">
  
  ```yml
  snapshots:
  - name: snapshot_name
    relation: source('jaffle_shop', 'orders')
    config:
      schema: string
      unique_key: column_name_or_expression
      strategy: check
      check_cols:
        - column_name
  ```
  
</File>
</VersionBlock>

<VersionBlock lastVersion="1.8">

:::info Use the latest snapshot syntax

In Versionless and dbt v1.9 and later, snapshots are defined in an updated syntax using a YAML file within your `snapshots/` directory (as defined by the [`snapshot-paths` config](/reference/project-configs/snapshot-paths)). For faster and more efficient management, consider the updated snapshot YAML syntax, [available in Versionless](/docs/dbt-versions/versionless-cloud) or [dbt Core v1.9 and later](/docs/dbt-versions/core).
:::

<File name='snapshots/<filename>.sql'>

```jinja2
{{ config(
  strategy="check",
  check_cols=["column_name"]
) }}

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

## Description
A list of columns within the results of your snapshot query to check for changes.

Alternatively, use all columns using the `all` value (however this may be less performant).

This parameter is **required if using the `check` [strategy](/reference/resource-configs/strategy)**.

## Default
No default is provided.

## Examples

### Check a list of columns for changes

<VersionBlock firstVersion="1.9">

<File name="snapshots/orders_snapshot_check.yml">

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

To select from this snapshot in a downstream model: `select * from {{ source('jaffle_shop', 'orders') }}`
</VersionBlock>

<VersionBlock lastVersion="1.8">

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

</VersionBlock>

### Check all columns for changes

<VersionBlock firstVersion="1.9">

<File name="orders_snapshot_check.yml">

```yaml
snapshots:
  - name: orders_snapshot_check
    relation: source('jaffle_shop', 'orders')
    config:
      schema: snapshots
      unique_key: id
      strategy: check
      check_cols:
        - all
  ```
</File>

To select from this snapshot in a downstream model: `select * from {{ source('jaffle_shop', 'orders') }}`
</VersionBlock>

<VersionBlock lastVersion="1.8">

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
</VersionBlock>

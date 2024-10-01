---
description: "Snapshot-name - Read this in-depth guide to learn about configurations in dbt."
---

<VersionBlock firstVersion="1.9">
<File name='snapshots/<filename>.yml'>

```yaml
snapshots:
  - name: snapshot_name
    relation: source('my_source', 'my_table')
    config:
      schema: string
      database: string
      unique_key: column_name_or_expression
      strategy: timestamp | check
      updated_at: column_name  # Required if strategy is 'timestamp'

```

</File>
</VersionBlock>

<VersionBlock lastVersion="1.8">

<File name='snapshots/<filename>.sql'>

```jinja2
{% snapshot snapshot_name %}

{% endsnapshot %}

```

</File>

:::info Use the latest snapshot syntax

In Versionless and dbt v1.9 and later, snapshots are defined in an updated syntax using a YAML file within your `snapshots/` directory (as defined by the [`snapshot-paths` config](/reference/project-configs/snapshot-paths)). For faster and more efficient management, consider the updated snapshot YAML syntax, [available in Versionless](/docs/dbt-versions/versionless-cloud) or [dbt Core v1.9 and later](/docs/dbt-versions/core).
:::

</VersionBlock>

## Description

The name of a snapshot, which is used when selecting from a snapshot using the [`ref` function](/reference/dbt-jinja-functions/ref)

This name must not conflict with the name of any other "refable" resource (models, seeds, other snapshots) defined in this project or package.

The name does not need to match the file name. As a result, snapshot filenames do not need to be unique.

## Examples
### Name a snapshot `order_snapshot`

<VersionBlock firstVersion="1.9">
<File name='snapshots/order_snapshot.yml'>


```yaml
snapshots:
  - name: order_snapshot
    relation: source('my_source', 'my_table')
    config:
      schema: string
      database: string
      unique_key: column_name_or_expression
      strategy: timestamp | check
      updated_at: column_name  # Required if strategy is 'timestamp'
```
</File>

</VersionBlock>

<VersionBlock lastVersion="1.8">
<File name='snapshots/orders.sql'>

```jinja2
{% snapshot orders_snapshot %}
...
{% endsnapshot %}

```

</File>

</VersionBlock>

To select from this snapshot in a downstream model:

```sql
select * from {{ ref('orders_snapshot') }}
```

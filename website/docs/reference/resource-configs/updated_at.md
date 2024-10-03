---
resource_types: [snapshots]
description: "Updated_at - Read this in-depth guide to learn about configurations in dbt."
datatype: column_name
---


<VersionBlock firstVersion="1.9">

<File name="snapshots/snapshots.yml">

```yaml
snapshots:
  - name: snapshot
    relation: source('my_source', 'my_table')
    [config](/reference/snapshot-configs):
      strategy: timestamp
      updated_at: column_name
```
</File>
</VersionBlock>

<VersionBlock lastVersion="1.8">

import SnapshotYaml from '/snippets/_snapshot-yaml-spec.md';

<SnapshotYaml/>

<File name='snapshots/<filename>.sql'>

```jinja2
{{ config(
  strategy="timestamp",
  updated_at="column_name"
) }}

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

<VersionBlock firstVersion="1.9">

:::caution

You will get a warning if the data type of the `updated_at` column does not match the adapter-configured default.

:::

</VersionBlock>

## Description
A column within the results of your snapshot query that represents when the record row was last updated.

This parameter is **required if using the `timestamp` [strategy](/reference/resource-configs/strategy)**.


## Default
No default is provided.

## Examples
### Use a column name `updated_at`

<VersionBlock firstVersion="1.9">

<File name="snapshots/orders_snapshot.yml">

```yaml
snapshots:
  - name: orders_snapshot
    relation: source('jaffle_shop', 'orders')
    config:
      schema: snapshots
      unique_key: id
      strategy: timestamp
      updated_at: updated_at

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
      unique_key='id',

      strategy='timestamp',
      updated_at='updated_at'
    )
}}

select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}

```

</File>
</VersionBlock>

### Coalesce two columns to create a reliable `updated_at` column
Consider a data source that only has an `updated_at` column filled in when a record is updated (so a `null` value indicates that the record hasn't been updated after it was created).

Since the `updated_at` configuration only takes a column name, rather than an expression, you should update your snapshot query to include the coalesced column.


<VersionBlock firstVersion="1.9">

1. Create an staging model to perform the transformation.
   In your `models/` directory, create a SQL file that configures an staging model to coalesce the `updated_at` and `created_at` columns into a new column `updated_at_for_snapshot`.

    <File name='models/staging_orders.sql'>

    ```sql
    select  * coalesce (updated_at, created_at) as updated_at_for_snapshot
    from {{ source('jaffle_shop', 'orders') }}

    ```
    </File>

2. Define the snapshot configuration in a YAML file. 
   In your `snapshots/` directory, create a YAML file that defines your snapshot and references the `updated_at_for_snapshot` staging model you just created.

    <File name="snapshots/orders_snapshot.yml">

    ```yaml
    snapshots:
      - name: orders_snapshot
        relation: ref('staging_orders')
        config:
          schema: snapshots
          unique_key: id
          strategy: timestamp
          updated_at: updated_at_for_snapshot

    ```
    </File>

3. Run `dbt snapshot` to execute the snapshot.

Alternatively, you can also create an ephemeral model to performs the required transformations. Then, you reference this model in your snapshot's `relation` key.

</VersionBlock>


<VersionBlock lastVersion="1.8">

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
</VersionBlock>

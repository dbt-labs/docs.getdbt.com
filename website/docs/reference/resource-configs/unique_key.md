---
resource_types: [snapshots, models]
description: "Learn more about unique_key configurations in dbt."
datatype: column_name_or_expression
intro_text: "unique_key identifies records for incremental models or snapshots, ensuring changes are captured or updated correctly."
---


<Tabs>

<TabItem value="models" label="Models">

Configure the `unique_key` in the `config` block of your [incremental model's](/docs/build/incremental-models) SQL file, in your `models/properties.yml` file, or in your `dbt_project.yml` file.

<File name='models/my_incremental_model.sql'>

```sql
{{
    config(
        materialized='incremental',
        unique_key='id'
    )
}}

```

</File>

<File name='models/properties.yml'>

```yaml
models:
  - name: my_incremental_model
    description: "An incremental model example with a unique key."
    config:
      materialized: incremental
      unique_key: id

```

</File>

<File name='dbt_project.yml'>

```yaml
name: jaffle_shop

models:
  jaffle_shop:
    staging:
      +unique_key: id
```

</File>

</TabItem>

<TabItem value="snapshots" label="Snapshots">

<VersionBlock firstVersion="1.9">

For [snapshots](/docs/build/snapshots), configure the `unique_key` in the your `snapshot/filename.yml` file or in your `dbt_project.yml` file.

<File name='snapshots/<filename>.yml'>

```yaml
snapshots:
  - name: orders_snapshot
    relation: source('my_source', 'my_table')
    [config](/reference/snapshot-configs):
      unique_key: order_id

```

</File>
</VersionBlock>


<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +unique_key: column_name_or_expression

```

</File>

</TabItem>
</Tabs>

## Description
A column name or expression that uniquely identifies each record in the inputs of a snapshot or incremental model. dbt uses this key to match incoming records to existing records in the target table (either a snapshot or an incremental model) so that changes can be captured or updated correctly:
* In an incremental model, dbt replaces the old row (like a merge key or upsert).
* In a snapshot, dbt keeps history, storing multiple rows for that same `unique_key` as it evolves over time.

In <Constant name="cloud" /> "Latest" release track and from dbt v1.9, [snapshots](/docs/build/snapshots) are defined and configured in YAML files within your `snapshots/` directory. You can specify one or multiple `unique_key` values within your snapshot YAML file's `config` key.

:::caution 

Providing a non-unique key will result in unexpected snapshot results. dbt **will not** test the uniqueness of this key, consider [testing](/blog/primary-key-testing#how-to-test-primary-keys-with-dbt) the source data to ensure that this key is indeed unique.

:::

## Default

This parameter is optional. If you don't provide a `unique_key`, your adapter will default to using `incremental_strategy: append`.

If you leave out the `unique_key` parameter and use strategies like `merge`, `insert_overwrite`, `delete+insert`, or `microbatch`, the adapter will fall back to using `incremental_strategy: append`.

This is different for BigQuery:
- For `incremental_strategy = merge`, you must provide a `unique_key`; leaving it out leads to ambiguous or failing behavior.
- For `insert_overwrite` or `microbatch`, `unique_key` is not required because they work by partition replacement rather than row-level upserts.

## Examples
### Use an `id` column as a unique key

<Tabs>

<TabItem value="models" label="Models">

In this example, the `id` column is the unique key for an incremental model.

<File name='models/my_incremental_model.sql'>

```sql
{{
    config(
        materialized='incremental',
        unique_key='id'
    )
}}

select * from ..
```

</File>
</TabItem>

<TabItem value="snapshots" label="Snapshots">

In this example, the `id` column is used as a unique key for a snapshot.

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

You can also specify configurations in your `dbt_project.yml` file if multiple snapshots share the same `unique_key`:
<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +unique_key: id

```

</File>

</TabItem>
</Tabs>

<VersionBlock firstVersion="1.9">

### Use multiple unique keys

<Tabs>
<TabItem value="models" label="Models">

Configure multiple unique keys for an incremental model as a string representing a single column or a list of single-quoted column names that can be used together, for example, `['col1', 'col2', …]`. 

Columns must not contain null values, otherwise the incremental model will fail to match rows and generate duplicate rows. Refer to [Defining a unique key](/docs/build/incremental-models#defining-a-unique-key-optional) for more information.

<File name='models/my_incremental_model.sql'>

```sql
{{ config(
    materialized='incremental',
    unique_key=['order_id', 'location_id']
) }}

with...

```

</File>

</TabItem>

<TabItem value="snapshots" label="Snapshots">

You can configure snapshots to use multiple unique keys for `primary_key` columns.

<File name='snapshots/transaction_items_snapshot.yml'>

```yaml
snapshots:
  - name: orders_snapshot
    relation: source('jaffle_shop', 'orders')
    config:
      schema: snapshots
      unique_key: 
        - order_id
        - product_id
      strategy: timestamp
      updated_at: updated_at
      
```

</File>
</TabItem>
</Tabs>
</VersionBlock>


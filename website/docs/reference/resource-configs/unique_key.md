---
resource_types: [snapshots, models]
description: "Learn more about unique_key configurations in dbt."
datatype: column_name_or_expression
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

<VersionBlock lastVersion="1.8">

Configure the `unique_key` in the `config` block of your snapshot SQL file or in your `dbt_project.yml` file.

import SnapshotYaml from '/snippets/_snapshot-yaml-spec.md';

<SnapshotYaml/>

<File name='snapshots/<filename>.sql'>

```jinja2
{{ config(
  unique_key="column_name"
) }}

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
A column name or expression that is unique for the inputs of a snapshot or incremental model. dbt uses this to match records between a result set and an existing snapshot or incremental model, so that changes can be captured correctly.

In dbt Cloud "Latest" release track and from dbt v1.9, [snapshots](/docs/build/snapshots) are defined and configured in YAML files within your `snapshots/` directory. You can specify one or multiple `unique_key` values within your snapshot YAML file's `config` key.

:::caution 

Providing a non-unique key will result in unexpected snapshot results. dbt **will not** test the uniqueness of this key, consider [testing](/blog/primary-key-testing#how-to-test-primary-keys-with-dbt) the source data to ensure that this key is indeed unique.

:::

## Default
This is a **required parameter**. No default is provided.


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

<VersionBlock lastVersion="1.8">
<File name='snapshots/<filename>.sql'>

```jinja2
{{
    config(
      unique_key="id"
    )
}}

```

</File>

You can also write this in yaml. This might be a good idea if multiple snapshots share the same `unique_key` (though we prefer to apply this configuration in a config block, as above).
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

<VersionBlock lastVersion="1.8">

### Use a combination of two columns as a unique key

<Tabs>
<TabItem value="models" label="Models">

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

This configuration accepts a valid column expression. As such, you can concatenate two columns together as a unique key if required. It's a good idea to use a separator (for example, `'-'`) to ensure uniqueness.

<File name='snapshots/transaction_items_snapshot.sql'>

```jinja2
{% snapshot transaction_items_snapshot %}

    {{
        config(
          unique_key="transaction_id||'-'||line_item_id",
          ...
        )
    }}

select
    transaction_id||'-'||line_item_id as id,
    *
from {{ source('erp', 'transactions') }}

{% endsnapshot %}

```

</File>

Though, it's probably a better idea to construct this column in your query and use that as the `unique_key`:

<File name='models/transaction_items_ephemeral.sql'>

```sql
{{ config(materialized='ephemeral') }}

select
  transaction_id || '-' || line_item_id as id,
  *
from {{ source('erp', 'transactions') }}

```

</File>

In this example, we create an ephemeral model `transaction_items_ephemeral` that creates an `id` column that can be used as the `unique_key` our snapshot configuration.

<File name='snapshots/transaction_items_snapshot.sql'>

```jinja2

{% snapshot transaction_items_snapshot %}

    {{
        config(
          unique_key="id",
          ...
        )
    }}

select
    transaction_id || '-' || line_item_id as id,
    *
from {{ source('erp', 'transactions') }}

{% endsnapshot %}


```

</File>
</TabItem>
</Tabs>
</VersionBlock>

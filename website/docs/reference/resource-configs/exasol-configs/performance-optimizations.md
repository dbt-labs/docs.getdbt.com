---
title: "Performance optimizations"
sidebar_label: "Performance optimizations"
description: "Configure table distribution, partitioning, and primary key settings to optimize query performance in Exasol."
---

### Table distribution and partitioning

Starting from dbt-exasol 1.8.1, you can configure table distribution and partitioning strategies to optimize query performance in Exasol. These configurations are available for models materialized as `table` or `incremental`.

Exasol supports the following performance optimization configurations:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `partition_by_config` | `<string>` or `[<string>]` | no | Partitions the table by specified column(s) for improved query performance |
| `distribute_by_config` | `<string>` | no | Distributes data across cluster nodes by specified column |
| `primary_key_config` | `[<string>]` | no | Defines primary key constraint(s) |

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project YAML file', value: 'project-yaml', },
    { label: 'Properties YAML file', value: 'property-yaml', },
    { label: 'SQL file config', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): table
    [+](/reference/resource-configs/plus-prefix)partition_by_config: <column-name>
    [+](/reference/resource-configs/plus-prefix)distribute_by_config: <column-name>
    [+](/reference/resource-configs/plus-prefix)primary_key_config: [<column-name>]
```

</File>

</TabItem>

<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml
models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): table
      partition_by_config: <column-name>
      distribute_by_config: <column-name>
      primary_key_config: [<column-name>]
```

</File>

</TabItem>

<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja
{{ config(
    [materialized](/reference/resource-configs/materialized)="table",
    partition_by_config="<column-name>",
    distribute_by_config="<column-name>",
    primary_key_config=["<column-name>"]
) }}
```

</File>

</TabItem>

</Tabs>

#### Single column example

The following example creates a table partitioned by `order_date`, distributed by `customer_id`, with a primary key on `customer_id`:

<File name='models/orders.sql'>

```sql
{{
    config(
        materialized='table',
        primary_key_config=['customer_id'],
        partition_by_config='order_date',
        distribute_by_config='customer_id'
    )
}}

select
    customer_id,
    order_date,
    order_total,
    order_status
from {{ source('sales', 'orders') }}
```

</File>

#### Multiple columns example

When configuring multiple columns for `primary_key_config`, provide them as a list:

<File name='models/order_items.sql'>

```sql
{{
    config(
        materialized='incremental',
        primary_key_config=['order_id', 'item_id'],
        partition_by_config='order_date',
        distribute_by_config='order_id',
        unique_key=['order_id', 'item_id']
    )
}}

select
    order_id,
    item_id,
    order_date,
    quantity,
    price
from {{ source('sales', 'order_items') }}
```

</File>

:::info
When configuring multiple columns for `primary_key_config`, always provide them as a list: `['column1', 'column2']`
:::

For more information about Exasol's table distribution and partitioning, refer to the [Exasol documentation](https://docs.exasol.com/db/latest/sql/create_table.htm).

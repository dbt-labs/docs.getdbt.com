---
title: How do I define a column type?
description: "Using cast function to define a column type"
sidebar_label: 'How to define a column type'
id: define-a-column-type

---

Your warehouse's SQL engine automatically assigns a [datatype](https://www.w3schools.com/sql/sql_datatypes.asp) to every column, whether it's found in a source or model. To force SQL to treat a columns a certain datatype, use `cast` functions:

<File name='models/order_prices.sql'>

```sql
select
    cast(order_id as integer),
    cast(order_price as double(6,2)) -- a more generic way of doing type conversion
from {{ ref('stg_orders') }}

```

</File>

Many modern <Term id="data-warehouse" />s now support `::` syntax as a shorthand for `cast( as )`.

<File name='models/orders_prices_colon_syntax.sql'>

```sql
select
    order_id::integer,
    order_price::numeric(6,2) -- you might find this in Redshift, Snowflake, and Postgres
from {{ ref('stg_orders') }}

```

</File>

Be warned, reading in data and casting that data may not always yield expected results, and every warehouse has its own subtleties. Certain casts may not be allowed (e.g. on Bigquery, you can't cast a `boolean`-type value to a `float64`). Casts that involve a loss in precision loss (e.g. `float` to `integer`) rely on your SQL engine to make a best guess or follow a specific schema not used by competing services. When performing casts, it's imperative that you are familiar with your warehouse's casting rules to best label fields in your sources and models.

Thankfully, popular database services tend to have type docs--[Redshift](https://docs.amazonaws.cn/en_us/redshift/latest/dg/r_CAST_function.html) and [Bigquery](https://cloud.google.com/bigquery/docs/reference/standard-sql/conversion_rules).

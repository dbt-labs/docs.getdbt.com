---
title: "Incremental models"
sidebar_label: "Incremental models"
description: "Configure how dbt builds incremental models in Firebolt using the incremental_strategy option."
---

The [`incremental_strategy` configuration](/docs/build/incremental-strategy) controls how dbt builds incremental models. Firebolt currently supports `append`, `insert_overwrite` and `delete+insert` configuration. You can specify `incremental_strategy` in `dbt_project.yml` or within a model file's `config()` block. The `append` configuration is the default. Specifying this configuration is optional.

The `append` strategy performs an `INSERT INTO` statement with all the new data based on the model definition. This strategy doesn't update or delete existing rows, so if you do not filter the data to the most recent records only, it is likely that duplicate records will be inserted.

Example source code:

```
{{ config(
   materialized = 'incremental',
   incremental_strategy='append'
) }}

/* All rows returned by this query will be appended to the existing model */


select * from {{ ref('raw_orders') }}
{% if is_incremental() %}
   where order_date > (select max(order_date) from {{ this }})
{% endif %}
```

Example run code:

```sql
CREATE DIMENSION TABLE IF NOT EXISTS orders__dbt_tmp AS
SELECT * FROM raw_orders
WHERE order_date > (SELECT MAX(order_date) FROM orders);

INSERT INTO orders VALUES ([columns])
SELECT ([columns])
FROM orders__dbt_tmp;
```

---
title: How we style our dbt models
id: 1-how-we-style-our-dbt-models
---

## Fields and model names

- 👥 Models should be pluralized, e.g. `customers`, `orders`, `products`.
- 🔑 Each model should have a primary key.
- 🔑 The primary key of a model should be named `<object>_id`, e.g. `account_id` – this makes it easier to know what `id` is being referenced in downstream joined models.
- 🔑 Keys should be string data types.
- 🔑 Consistency is key! Use the same field names across models where possible, e.g. a key to the `customers` table should be named `customer_id` rather than `user_id` or 'id'.
- ❌ Do not use abbreviations or aliases, emphasize readability over brevity, e.g. `cust` for `customer` or `o` for `orders`.
- ❌ Avoid reserved words as column names.
- ➕ Booleans should be prefixed with `is_` or `has_`.
- 🕰️ Timestamp columns should be named `<event>_at`, e.g. `created_at`, and should be in UTC. If a different timezone is being used, this should be indicated with a suffix, e.g `created_at_pt`.
- 📆 Dates should be named `<event>_date`, e.g. `created_date`.
- 🔙 Events dates and times should be past tense, e.g. `created`, `updated`, `deleted`.
- 💱 Price/revenue fields should be in decimal currency (e.g. `19.99` for $19.99; many app databases store prices as integers in cents). If non-decimal currency is used, indicate this with suffix, e.g. `price_in_cents`.
- 🐍 Schema, table and column names should be in `snake_case`.
- 🏦 Use names based on the _business_ terminology, rather than the source terminology. For example, if the source database uses `user_id` but the business calls them `customer_id`, use `customer_id` in the model.
- 🔢 Versions of models should use the suffix `_v1`, `_v2`, etc for consistency, e.g. `customers_v1`, `customers_v2`.
- 🗄️ Use a consistent ordering of data types and consider grouping and labeling columns by type as in the exampe below. This will minimize join errors and make it easier to read the model, as well as help downstream consumers of the data understand the data types and scan models for the columns they need. We prefer to use the following order: ids, strings, numerics, booleans, dates, timestamps.

````sql

## Example model

```sql
with

source as (

    select * from {{ source('ecom', 'raw_orders') }}

),

renamed as (

    select

        ----------  ids
        id as order_id,
        store_id as location_id,
        customer as customer_id,

        ---------- strings
        status as order_status,

        ---------- numerics
        (order_total / 100.0)::float as order_total,
        (tax_paid / 100.0)::float as tax_paid,

        ---------- booleans
        is_fulfilled,

        ---------- dates
        date(order_date) as ordered_date,

        ---------- timestamps
        ordered_at

    from source

)

select * from renamed
````

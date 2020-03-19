---
title: How do I create dependencies between models?
---

When you use the `ref` [function](docs/writing-code-in-dbt/jinja-context/ref.md), dbt automatically infers the dependencies between models.

For example, consider a model, `customer_orders`, like so:

<File name='models/customer_orders.sql'>

```sql
select
    customer_id,
    min(order_date) as first_order_date,
    max(order_date) as most_recent_order_date,
    count(order_id) as number_of_orders
from {{ ref('stg_orders') }}
group by 1

```

</File>

dbt will understand that the `stg_orders` model needs to be built before the above model (`customer_orders`), and will build models in order.

**There's no need to explicitly define these dependencies.**

To get some practice with this, we recommend you complete the [tutorial](tutorial/1-setting-up.md) to build your first dbt project

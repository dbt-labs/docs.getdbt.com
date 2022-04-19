---
title: Getting set up
id: getting-set-up
description: "Set up your environment so you can start using dbt."
---

Learn how to turn the following SQL query into a tested, documented, and deployed dbt project. You can preview [the generated documentation](https://www.getdbt.com/getting-started-tutorial/#!/overview) for the project you're about to build. You'll need a working knowledge of SQL to complete this tutorial.

If you want a more in-depth learning experience, we recommend taking the dbt Fundamentals on our [dbt Learn online courses site](https://courses.getdbt.com/).

<LoomVideo id="cb99861ab1034f7fab5fa48529e61f85" />

The project you're creating is based on a fictional business named `jaffle_shop`, so you'll see this name used throughout the project. In the Jaffle shop organization, you can use the following query to build a `customers` table.

```sql
with customers as (

    select
        id as customer_id,
        first_name,
        last_name

    from `dbt-tutorial`.jaffle_shop.customers

),

orders as (

    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from `dbt-tutorial`.jaffle_shop.orders

),

customer_orders as (

    select
        customer_id,

        min(order_date) as first_order_date,
        max(order_date) as most_recent_order_date,
        count(order_id) as number_of_orders

    from orders

    group by 1

),


final as (

    select
        customers.customer_id,
        customers.first_name,
        customers.last_name,
        customer_orders.first_order_date,
        customer_orders.most_recent_order_date,
        coalesce(customer_orders.number_of_orders, 0) as number_of_orders

    from customers

    left join customer_orders using (customer_id)

)

select * from final
```

---
title: Setting up
id: setting-up
---

In this tutorial, we will be turning the below query into a dbt project that is tested, documented, and deployed — you can check out the generated documentation for the project we're building [here](https://www.getdbt.com/getting-started-tutorial/#!/overview?g_v=1).

This tutorial is geared at first-time users who want detailed instructions on how to go from zero to a deployed dbt project. You'll need a working knowledge of SQL in order to do this tutorial.

<LoomVideo id="cb99861ab1034f7fab5fa48529e61f85" />


We recommend you go through this project once from beginning to end. Once you've completed it, you should go back through and read some of the FAQs to broaden your understanding of dbt.

This tutorial is based on a fictional business named `jaffle_shop`, so you'll see this name used throughout the project. At this organization, the following query is used to build a `customers` table.

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

## Choose the way you want to develop
There’s two main ways of working with dbt:

1. Edit files and run projects using the web-based Integrated Development Environment (IDE) in **dbt Cloud**.
2. Edit files locally using a code editor, and run projects using the Command Line Interface (**dbt CLI**).

To use the CLI, it's important that you know some basics of your terminal. In particular, you should understand `cd`, `ls` and `pwd` to navigate through the directory structure of your computer easily. As such, if you are new to programming, we recommend using **dbt Cloud** for this tutorial.

If you wish to use the CLI, please follow the [installation instructions](/dbt-cli/install/overview) for your operating system.

## Setting up your data platform

Now that you have some context for this tutorial, let's get your environment set up.  Check out the table of contents to the left to set up your environment on BigQuery, Snowflake, or Redshift.  These guides are helpful for anyone with an existing data platform or starting from scratch.
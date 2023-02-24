---
title: "Quickstart for dbt Cloud and Snowflake"
description: "Quickstart for dbt Cloud and Snowflake."
id: "snowflake"
sidebar_label: "Snowflake quickstart"
---
For the Snowflake project in the quickstart guide, you'll learn how to set up Snowflake and connect it to dbt Cloud.
This guide will walk you through:

:::tip Videos for you
You can check out [dbt Fundamentals](https://courses.getdbt.com/courses/fundamentals) for free if you're interested in course learning with videos.

You can also watch the [YouTube video on dbt and Snowflake](https://www.youtube.com/watch?v=kbCkwhySV_I&list=PL0QYlrC86xQm7CoOH6RS7hcgLnd3OQioG).
:::

## Set up a dbt Cloud managed repository 
<Snippet src="tutorial-managed-repo" />

## Initialize your dbt project​ and start developing
Now that you have a repository configured, you can initialize your project and start development in dbt Cloud:

1. Click **Develop** from the upper left. It might take a few minutes for your project to spin up for the first time as it establishes your git connection, clones your repo, and tests the connection to the warehouse.
2. Above the file tree to the left, click **Initialize your project**. This builds out your folder structure with example models.
3. Make your initial commit by clicking **Commit**. Use the commit message `initial commit`. This creates the first commit to your managed repo and allows you to open a branch where you can add new dbt code.
4. You can now directly query data from your warehouse and execute `dbt run`. You can try this out now:
    - In the IDE's editor, add this query: 
        ```sql
        select * from raw.jaffle_shop.customers
        ```
    - In the command line bar at the bottom, enter `dbt run` and click **Enter**. 

## Build your first model
1. Click **Develop** from the upper left of dbt Cloud. You need to create a new branch since the main branch is now set to read-only mode. 
2. Click **Create branch**. You can name it `add-customers-model`.
3. Click **Develop** from the upper left of dbt Cloud.
4. Click the **...** next to the Models directory, then select **Create file**.  
5. Name the file `models/customers.sql`, then click **Create**.
6. Copy the following query into the file and click **Save File**.
```sql
with customers as (

    select
        id as customer_id,
        first_name,
        last_name

    from raw.jaffle_shop.customers

),

orders as (

    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from raw.jaffle_shop.orders

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

7. Enter `dbt run` in the command prompt at the bottom of the screen. You should get a successful run and see three models under DETAILS.

Later, you can connect your business intelligence (BI) tools to these views and tables so they only read cleaned up data rather than raw data in your BI tool.

## Change the way your model is materialized

<Snippet src="quickstarts/change-way-model-materialized" />

## Delete the example models

<Snippet src="quickstarts/delete-example-models" />

## Build models on top of other models

<Snippet src="quickstarts/build-models-atop-other-models" />

<Snippet src="quickstarts/test-and-document-your-project" />

<Snippet src="quickstarts/schedule-a-job" />
---
title: Setting up
id: setting-up
description: This tutorial is the required pre-work for dbt Learn.
---


This tutorial is the required pre-work for dbt Learn. Before beginning this tutorial, please ensure that you been received your Snowflake credentials and dbt Cloud invitation by email from a Learn instructor.

If you are **new to dbt**, we recommend you take some time to read through the FAQs, and come armed with any questions you have along the way. If you get completely stuck in this tutorial, please ask questions in the dedicated Slack channel, as detailed in the welcome email.

If you are already **experienced with dbt**, you still need to complete this tutorial as we'll be building on this project in our lessons.

:::info
Please note that this tutorial is adapted from the main <a href="https://tutorial.getdbt.com/tutorial/setting-up/">Getting Started</a> tutorial — there may be some references to BigQuery in various videos, however the same concepts should apply on Snowflake.
:::

In this tutorial, we will be turning the below query into a dbt project that is tested, documented, and deployed — you can check out the generated documentation docs for the project we're building [here](https://www.getdbt.com/getting-started-tutorial/#!/overview?g_v=1).

<LoomVideo id="cb99861ab1034f7fab5fa48529e61f85" />


This tutorial is based on a fictional business named `jaffle_shop`, so you'll see this name used throughout the project. At this organization, the following query is used to build a `customers` table.

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

## Connect to Snowflake
For dbt Learn, we've created a Snowflake account that you will be added to, but dbt works with [many data warehouses](available-adapters).

1. Go to the Snowflake Console (link provided in email) and login with your supplied credentials.
2. Reset your password: all students will be asked to update their password — please use a password manager to store this securely.
3. Copy and paste the above query into a worksheet to validate that you are able to run it successfully.
<Lightbox src="/img/successful-snowflake-query.png" title="Ensure you can run the above query" />


### FAQs
<FAQ src="loading-data" alt_header="The data in this tutorial is already loaded into Snowflake. How do I load data into my warehouse?" />
<FAQ src="database-privileges" />


## Create a repository
We're going to use [GitHub](https://github.com/) as our git provider for this tutorial, but you can use any git provider. If you don't yet have a GitHub account, [create one now](https://github.com/join).
<LoomVideo id="afe148aeab5e4279a2ca310251ea20a6" />

1. Create a new GitHub repository [here](https://github.com/new) named `dbt-learn-[initialsurname]` (e.g. `dbt-learn-ccarroll`).
2. Click **Create repository** (without `.gitignore` and without a license).

<Lightbox src="/img/create-github-repo.png" title="Create a GitHub repo" />


## Choose the way you want to develop
There’s two main ways of working with dbt:

1. Edit files and run projects using the web-based Integrated Development Environment (IDE) in **dbt Cloud**.
2. Edit files locally using a code editor, and run projects using the Command Line Interface (**dbt CLI**).

To use the CLI, it's important that you know some basics of your terminal. In particular, you should understand `cd`, `ls` and `pwd` to navigate through the directory structure of your computer easily. As such, if you are new to programming, we recommend using **dbt Cloud** for this tutorial.

:::info
During dbt Learn, we try our best to demonstrate using both workflows. However, we tend to default to using dbt Cloud for some of the shorter demonstrations.
:::

If you wish to use the CLI, please follow the [installation instructions](/dbt-cli/install/overview) for your operating system.

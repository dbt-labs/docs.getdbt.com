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

## Create a BigQuery project
For this tutorial, we've created a public dataset in BigQuery that anyone can `select` from.

We're using BigQuery since anyone with a Google Account can use BigQuery, but dbt works with [many data warehouses](available-adapters).

:::info
BigQuery has <a href="https://cloud.google.com/bigquery/pricing">a generous free tier</a>. If you have an existing GCP account that has surpassed these tiers on BigQuery, running queries for this tutorial will incur a very small (less than a few USD) cost.
:::

<LoomVideo id="9b8d852c7e754d978209c3a60b53464e" />

1. Go to [the BigQuery Console](https://console.cloud.google.com/bigquery) — if you don't have a Google Cloud Platform account you will be asked to create one.
2. Create a new project for this tutorial — if you've just created a BigQuery account, you'll be prompted to create a new project straight away. If you already have an existing account, you can select the project drop down in the header bar, and create a new project from there.
<Lightbox src="/img/create-bigquery-project.png" title="Create a new GCP project" />
3. Head back to [the BigQuery Console](https://console.cloud.google.com/bigquery), and ensure your new project is selected. Copy and paste the above query into the Query Editor to validate that you are able to run it successfully.
<Lightbox src="/img/successful-bigquery-query.png" title="Ensure you can run the above query" />


### FAQs
<FAQ src="loading-data" alt_header="The data in this tutorial is already loaded into BigQuery. How do I load data into my warehouse?" />

## Generate BigQuery credentials
In order to let dbt connect to your warehouse, you'll need generate a keyfile. This is analogous to using a database user name and password with most other data warehouses.

<LoomVideo id="2b5a8ec255bd4dce91374f6941d279e5" />

1. Go to the [BigQuery credential wizard](https://console.cloud.google.com/apis/credentials/wizard). Ensure that your new project is selected in the header bar.
2. Generate credentials with the following options:
    * **Which API are you using?** BigQuery API
    * **What data will you be accessing?** Application data (you'll be creating a service account)
    * **Are you planning to use this API with App Engine or Compute Engine?** No
    * **Service account name:** `dbt-user`
    * **Role:** BigQuery Job User & BigQuery User
    * **Key type:** JSON
3. Download the JSON file and save it in an easy-to-remember spot, with a clear filename (e.g. `dbt-user-creds.json`)

### FAQs
<FAQ src="database-privileges" />

## Choose the way you want to develop
There’s two main ways of working with dbt:

1. Edit files and run projects using the web-based Integrated Development Environment (IDE) in **dbt Cloud**.
2. Edit files locally using a code editor, and run projects using the Command Line Interface (**dbt CLI**).

To use the CLI, it's important that you know some basics of your terminal. In particular, you should understand `cd`, `ls` and `pwd` to navigate through the directory structure of your computer easily. As such, if you are new to programming, we recommend using **dbt Cloud** for this tutorial.

If you wish to use the CLI, please follow the [installation instructions](/dbt-cli/install/overview) for your operating system.

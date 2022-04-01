---
title: Get started with dbt
id: setting-up
description: "Create your first dbt project using a SQL query."
---

Learn how to turn the following SQL query into a tested, documented, and deployed dbt project. You can preview [the generated documentation](https://www.getdbt.com/getting-started-tutorial/#!/overview) for the project you're about to build. You'll need a working knowledge of SQL to complete this tutorial.

If you want a more in-depth learning experience, consider taking some [dbt Learn online courses](https://courses.getdbt.com/).

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

1. Go to the [BigQuery credential wizard](https://console.cloud.google.com/apis/credentials/wizard). Ensure that your new project is selected in the header bar.
2. Select **+ Create Credentials** then **Service account**.
3. Type "dbt-user" in the Service account name field, then click **Create and Continue**.
4. Type and select **BigQuery Admin** in the Role field.
5. Click **Continue**.
6. Leave fields blank in the "Grant users access to this service account" section and click **Done**.
7. Click the service account that you just created.
8. Select **Keys**.
9. Click **Add Key** then select **Create new key**. 
10. Select **JSON** as the key type then click **Create**.  
11. You should be prompted to download the JSON file. Save it locally to an easy-to-remember spot, with a clear filename. For example, `dbt-user-creds.json`.

### FAQs
<FAQ src="database-privileges" />

## Choose the way you want to develop
There’s two main ways of working with dbt:

1. Edit files and run projects using the web-based Integrated Development Environment (IDE) in **dbt Cloud**.
2. Edit files locally using a code editor, and run projects using the Command Line Interface (**dbt CLI**).

To use the CLI, it's important that you know some basics of your terminal. In particular, you should understand `cd`, `ls` and `pwd` to navigate through the directory structure of your computer easily. As such, if you are new to programming, we recommend using **dbt Cloud** for this tutorial.

If you wish to use the CLI, please follow the [installation instructions](/dbt-cli/install/overview) for your operating system.

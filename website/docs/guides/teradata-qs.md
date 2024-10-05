---
title: "Quickstart for dbt Cloud and Teradata"
id: "teradata"
level: 'Beginner'
icon: 'teradata'
tags: ['dbt Cloud','Quickstart','Teradata']
hide_table_of_contents: true
---

<div style={{maxWidth:'900px'}}>

## Introduction

In this quickstart guide, you'll learn how to use dbt Cloud with Teradata Vantage. It will show you how to:

- Create a new Teradata Clearscape instance
- Load sample data into your Teradata Database
- Connect dbt Cloud to Teradata.
- Take a sample query and turn it into a model in your dbt project. A model in dbt is a select statement.
- Add tests to your models.
- Document your models.
- Schedule a job to run.

:::tip Videos for you
You can check out [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals) for free if you're interested in course learning with videos.
:::

### Prerequisites​

- You have a [dbt Cloud account](https://www.getdbt.com/signup/).
- You have access to a Teradata Vantage instance. You can provision one for free at https://clearscape.teradata.com. See [the ClearScape Analytics Experience guide](https://developers.teradata.com/quickstarts/get-access-to-vantage/clearscape-analytics-experience/getting-started-with-csae/) for details.

### Related content

- Learn more with [dbt Learn courses](https://learn.getdbt.com)
- [How we provision Teradata Clearscape Vantage instance](https://developers.teradata.com/quickstarts/get-access-to-vantage/clearscape-analytics-experience/getting-started-with-csae/)
- [CI jobs](/docs/deploy/continuous-integration)
- [Deploy jobs](/docs/deploy/deploy-jobs)
- [Job notifications](/docs/deploy/job-notifications)
- [Source freshness](/docs/deploy/source-freshness)

## Load data

The following steps will guide you through how to get the data stored as CSV files in a public S3 bucket and insert it into the tables.

:::tip SQL IDE

If you created your Teradata Vantage database instance at https://clearscape.teradata.com and you don't have an SQL IDE handy, use the JupyterLab bundled with your database to execute SQL:

1. Navigate to [ClearScape Analytics Experience dashboard](https://clearscape.teradata.com/dashboard) and click the **Run Demos** button. The demo will launch JupyterLab.

2. In JupyterLab, go to **Launcher** by clicking the blue **+** icon in the top left corner. Find the **Notebooks** section and click **Teradata SQL**.

3. In the notebook's first cell, connect to the database using `connect` magic. You will be prompted to enter your database password when you execute it:
   ```ipynb
   %connect local
   ```
4. Use additional cells to type and run SQL statements.

:::

1. Use your preferred SQL IDE editor to create two databases: `jaffle_shop` and `stripe`:

   ```sql
   CREATE DATABASE jaffle_shop AS PERM = 1e9;
   CREATE DATABASE stripe AS PERM = 1e9;
   ```

2. In the databases `jaffle_shop` and `stripe`, create three foreign tables and reference the respective csv files located in object storage:

  ```sql
  CREATE FOREIGN TABLE jaffle_shop.customers (
      id integer,
      first_name varchar (100),
      last_name varchar (100)
   )
   USING (
      LOCATION ('/s3/dbt-tutorial-public.s3.amazonaws.com/jaffle_shop_customers.csv')
   )
   NO PRIMARY INDEX;

   CREATE FOREIGN TABLE jaffle_shop.orders (
      id integer,
      user_id integer,
      order_date date,
      status varchar(100)
   )
   USING (
      LOCATION ('/s3/dbt-tutorial-public.s3.amazonaws.com/jaffle_shop_orders.csv')
   )
   NO PRIMARY INDEX;

   CREATE FOREIGN TABLE stripe.payment (
      id integer,
      orderid integer,
      paymentmethod varchar (100),
      status varchar (100),
      amount integer,
      created date
   )
   USING (
      LOCATION ('/s3/dbt-tutorial-public.s3.amazonaws.com/stripe_payments.csv')
   )
   NO PRIMARY INDEX;   
  ```

## Connect dbt cloud to Teradata

1. Create a new project in dbt Cloud. From **Account settings** (using the gear menu in the top right corner), click **New Project**. 
2. Enter a project name and click **Continue**.
3. In **Configure your development environment**, click **Add new connection**.
4. Select **Teradata**, fill in all the required details in the **Settings** section, and test the connection.

  <Lightbox src="/img/teradata/dbt_cloud_teradata_setup_connection_start.png" title="dbt Cloud - Choose Teradata Connection" />
  
  <Lightbox src="/img/teradata/dbt_cloud_teradata_account_settings.png" title="dbt Cloud - Teradata Account Settings" />

5. Enter your **Development Credentials** for Teradata with:
   * **Username** &mdash; The username of Teradata database.
   * **Password** &mdash; The password of Teradata database.
   * **Schema** &mdash; The default database to use
  
   <Lightbox src="/img/teradata/dbt_cloud_teradata_development_credentials.png" title="dbt Cloud - Teradata Development Credentials" />

6. Click **Test Connection** to verify that dbt Cloud can access your Teradata Vantage instance.
7. If the connection test succeeds, click **Next**. If it fails, check your Teradata settings and credentials.

## Set up a dbt Cloud managed repository

<Snippet path="tutorial-managed-repo" />

## Initialize your dbt project​ and start developing

Now that you have a repository configured, you can initialize your project and start development in dbt Cloud:

1. Click **Start developing in the IDE**. It might take a few minutes for your project to spin up for the first time as it establishes your git connection, clones your repo, and tests the connection to the warehouse.
2. Above the file tree to the left, click **Initialize your project** to build out your folder structure with example models.
3. Make your initial commit by clicking **Commit and sync**. Use the commit message `initial commit` to create the first commit to your managed repo. Once you’ve created the commit, you can open a branch to add new dbt code.
4. You can now directly query data from your warehouse and execute `dbt run`. You can try this out now:
   - Click **Create new file**, add this query to the new file, and click **Save as** to save the new file:
       ```sql
       select * from jaffle_shop.customers
       ```
   - In the command line bar at the bottom, enter `dbt run` and click **Enter**. You should see a `dbt run succeeded` message.

## Build your first model

You have two options for working with files in the dbt Cloud IDE:

- Create a new branch (recommended) &mdash; Create a new branch to edit and commit your changes. Navigate to **Version Control** on the left sidebar and click **Create branch**.
- Edit in the protected primary branch &mdash; If you prefer to edit, format, lint files, or execute dbt commands directly in your primary git branch. The dbt Cloud IDE prevents commits to the protected branch, so you will receive a prompt to commit your changes to a new branch.

Name the new branch `add-customers-model`.

1. Click the **...** next to the `models` directory, then select **Create file**. 
2. Name the file `customers.sql`, then click **Create**.
3. Copy the following query into the file and click **Save**.

```sql

with customers as (

   select
       id as customer_id,
       first_name,
       last_name

   from jaffle_shop.customers

),

orders as (

   select
       id as order_id,
       user_id as customer_id,
       order_date,
       status

   from jaffle_shop.orders

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

4. Enter `dbt run` in the command prompt at the bottom of the screen. You should get a successful run and see the three models.

You can connect your business intelligence (BI) tools to these views and tables so they only read cleaned-up data rather than raw data in your BI tool.

## Change the way your model is materialized

<Snippet path="quickstarts/change-way-model-materialized" />

## Delete the example models

<Snippet path="quickstarts/delete-example-models" />

## Build models on top of other models

<Snippet path="quickstarts/intro-build-models-atop-other-models" />

1. Create a new SQL file, `models/stg_customers.sql`, with the SQL from the `customers` CTE in your original query.
2. Create a second new SQL file, `models/stg_orders.sql`, with the SQL from the `orders` CTE in your original query.

   <File name='models/stg_customers.sql'>

   ```sql
   select
      id as customer_id,
      first_name,
      last_name

   from jaffle_shop.customers
   ```

   </File>

   <File name='models/stg_orders.sql'>

   ```sql
   select
      id as order_id,
      user_id as customer_id,
      order_date,
      status

   from jaffle_shop.orders
   ```

   </File>

3. Edit the SQL in your `models/customers.sql` file as follows:

   <File name='models/customers.sql'>

   ```sql
   with customers as (

      select * from {{ ref('stg_customers') }}
   
   ),

   orders as (

      select * from {{ ref('stg_orders') }}

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

   </File>

4. Execute `dbt run`.

   This time, when you performed a `dbt run`, it created separate views/tables for `stg_customers`, `stg_orders`, and `customers`. dbt inferred the order in which these models should run. Because `customers` depends on `stg_customers` and `stg_orders`, dbt builds `customers` last. You don’t need to define these dependencies explicitly.

#### FAQs {#faq-2}

<FAQ path="Runs/run-one-model" />
<FAQ path="Project/unique-resource-names" />
<FAQ path="Project/structure-a-project" alt_header="As I create more models, how should I keep my project organized? What should I name my models?" />

## Build models on top of sources

Sources make it possible to name and describe the data loaded into your warehouse by your extract and load tools. By declaring these tables as sources in dbt, you can:
- Select from source tables in your models using the `{{ source() }}` function, helping define the lineage of your data
- Test your assumptions about your source data
- Calculate the freshness of your source data

1. Create a new YML file, `models/sources.yml`.
2. Declare the sources by copying the following into the file and clicking **Save**.

   <File name='models/sources.yml'>

   ```yml
   version: 2

   sources:
      - name: jaffle_shop
        description: This is a replica of the Postgres database used by the app
        database: raw
        schema: jaffle_shop
        tables:
            - name: customers
              description: One record per customer.
            - name: orders
              description: One record per order. Includes canceled and deleted orders.
   ```

   </File>

3. Edit the `models/stg_customers.sql` file to select from the `customers` table in the `jaffle_shop` source.

   <File name='models/stg_customers.sql'>

   ```sql
   select
      id as customer_id,
      first_name,
      last_name

   from {{ source('jaffle_shop', 'customers') }}
   ```

   </File>

4. Edit the `models/stg_orders.sql` file to select from the `orders` table in the `jaffle_shop` source.

   <File name='models/stg_orders.sql'>

   ```sql
   select
      id as order_id,
      user_id as customer_id,
      order_date,
      status

   from {{ source('jaffle_shop', 'orders') }}
   ```

   </File>

5. Execute `dbt run`.

   Your `dbt run` results will be the same as those in the previous step. Your `stg_customers` and `stg_orders`
   models will still query from the same raw data source in Teradata. By using `source`, you can
   test and document your raw data and also understand the lineage of your sources.


</div>

<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />

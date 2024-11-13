---
title: "Quickstart for the dbt Cloud Semantic Layer and Snowflake"
id: sl-snowflake-qs
description: "Use this guide to build and define metrics, set up the dbt Cloud Semantic Layer, and query them using Google Sheets."
sidebar_label: "Quickstart with the dbt Semantic Layer and Snowflake"
meta:
  api_name: dbt Semantic Layer APIs
icon: 'guides'
hide_table_of_contents: true
tags: ['Semantic Layer', 'Snowflake', 'dbt Cloud','Quickstart']
keywords: ['dbt Semantic Layer','Metrics','dbt Cloud', 'Snowflake', 'Google Sheets']
level: 'Intermediate'
recently_updated: true
---

<!-- The below snippets (or reusables) can be found in the following file locations in the docs code repository) -->
import CreateModel from '/snippets/_sl-create-semanticmodel.md';
import DefineMetrics from '/snippets/_sl-define-metrics.md';
import ConfigMetric from '/snippets/_sl-configure-metricflow.md';
import TestQuery from '/snippets/_sl-test-and-query-metrics.md';
import ConnectQueryAPI from '/snippets/_sl-connect-and-query-api.md';
import RunProdJob from '/snippets/_sl-run-prod-job.md';
import SlSetUp from '/snippets/_new-sl-setup.md'; 

## Introduction

The [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), powered by [MetricFlow](/docs/build/about-metricflow), simplifies the setup of key business metrics. It centralizes definitions, avoids duplicate code, and ensures easy access to metrics in downstream tools. MetricFlow helps manage company metrics easier, allowing you to define metrics in your dbt project and query them in dbt Cloud with [MetricFlow commands](/docs/build/metricflow-commands).


import SLCourses from '/snippets/_sl-course.md';

<SLCourses/>

This quickstart guide is designed for dbt Cloud users using Snowflake as their data platform. It focuses on building and defining metrics, setting up the dbt Semantic Layer in a dbt Cloud project, and querying metrics in Google Sheets.

**For users on different data platforms**

If you're using a data platform other than Snowflake, this guide is also applicable to you. You can adapt the setup for your specific platform by following the account setup and data loading instructions detailed in the following tabs for each respective platform.

The rest of this guide applies universally across all supported platforms, ensuring you can fully leverage the dbt Semantic Layer.

<Tabs>

<TabItem value="bq" label="BigQuery">

Open a new tab and follow these quick steps for account setup and data loading instructions:

- [Step 2: Create a new GCP project](https://docs.getdbt.com/guides/bigquery?step=2)
- [Step 3: Create BigQuery dataset](https://docs.getdbt.com/guides/bigquery?step=3)
- [Step 4: Generate BigQuery credentials](https://docs.getdbt.com/guides/bigquery?step=4)
- [Step 5: Connect dbt Cloud to BigQuery](https://docs.getdbt.com/guides/bigquery?step=5)

</TabItem>

<TabItem value="databricks" label="Databricks">

Open a new tab and follow these quick steps for account setup and data loading instructions:

- [Step 2: Create a Databricks workspace](https://docs.getdbt.com/guides/databricks?step=2)
- [Step 3: Load data](https://docs.getdbt.com/guides/databricks?step=3)
- [Step 4: Connect dbt Cloud to Databricks](https://docs.getdbt.com/guides/databricks?step=4)

</TabItem>

<TabItem value="msfabric" label="Microsoft Fabric">

Open a new tab and follow these quick steps for account setup and data loading instructions:

- [Step 2: Load data into your Microsoft Fabric warehouse](https://docs.getdbt.com/guides/microsoft-fabric?step=2)
- [Step 3: Connect dbt Cloud to Microsoft Fabric](https://docs.getdbt.com/guides/microsoft-fabric?step=3)

</TabItem>

<TabItem value="redshift" label="Redshift">

Open a new tab and follow these quick steps for account setup and data loading instructions:

- [Step 2: Create a Redshift cluster](https://docs.getdbt.com/guides/redshift?step=2)
- [Step 3: Load data](https://docs.getdbt.com/guides/redshift?step=3)
- [Step 4: Connect dbt Cloud to Redshift](https://docs.getdbt.com/guides/redshift?step=3)

</TabItem>

<TabItem value="starburst" label="Starburst Galaxy">

Open a new tab and follow these quick steps for account setup and data loading instructions:

- [Step 2: Load data to an Amazon S3 bucket](https://docs.getdbt.com/guides/starburst-galaxy?step=2)
- [Step 3: Connect Starburst Galaxy to Amazon S3 bucket data](https://docs.getdbt.com/guides/starburst-galaxy?step=3)
- [Step 4: Create tables with Starburst Galaxy](https://docs.getdbt.com/guides/starburst-galaxy?step=4)
- [Step 5: Connect dbt Cloud to Starburst Galaxy](https://docs.getdbt.com/guides/starburst-galaxy?step=5)

</TabItem>

</Tabs>

## Prerequisites

- You need a [dbt Cloud](https://www.getdbt.com/signup/) Trial, Team, or Enterprise account for all deployments. Contact your representative for Single-tenant setup; otherwise, create an account using this guide.
- Have the correct [dbt Cloud license](/docs/cloud/manage-access/seats-and-users) and [permissions](/docs/cloud/manage-access/enterprise-permissions) based on your plan:
  <DetailsToggle alt_header="More info on license and permissions">  
  
  - Enterprise &mdash; Developer license with Account Admin permissions. Or "Owner" with a Developer license, assigned Project Creator, Database Admin, or Admin permissions.
  - Team &mdash; "Owner" access with a Developer license.
  - Trial &mdash; Automatic "Owner" access under a Team plan trial.
  
  </DetailsToggle>

- Production and development environments must be on [dbt version 1.6 or higher](/docs/dbt-versions/upgrade-dbt-version-in-cloud). Alternatively, set your environment to [**Versionless**](/docs/dbt-versions/upgrade-dbt-version-in-cloud#versionless) to always get the latest updates.
- Create a [trial Snowflake account](https://signup.snowflake.com/):
  - Select the Enterprise Snowflake edition with ACCOUNTADMIN access. Consider organizational questions when choosing a cloud provider, refer to Snowflake's [Introduction to Cloud Platforms](https://docs.snowflake.com/en/user-guide/intro-cloud-platforms).
  - Select a cloud provider and region. All cloud providers and regions will work so choose whichever you prefer.
- Basic understanding of SQL and dbt. For example, you've used dbt before or have completed the [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals) course.

### What you'll learn

This guide will cover the following topics:

- [Create a new Snowflake worksheet and set up your environment](/guides/sl-snowflake-qs?step=3)
- [Load sample data into your Snowflake account](/guides/sl-snowflake-qs?step=4)
- [Connect dbt Cloud to Snowflake](/guides/sl-snowflake-qs?step=5)
- [Set up a dbt Cloud managed repository](/guides/sl-snowflake-qs?step=6)
- [Initialize a dbt Cloud project and start developing](/guides/sl-snowflake-qs?step=7)
- [Build your dbt Cloud project](/guides/sl-snowflake-qs?step=8)
- [Create a semantic model in dbt Cloud](/guides/sl-snowflake-qs?step=9)
- [Define metrics in dbt Cloud](/guides/sl-snowflake-qs?step=10)
- [Add second semantic model](/guides/sl-snowflake-qs?step=11)
- [Test and query metrics in dbt Cloud](/guides/sl-snowflake-qs?step=12)
- [Run a production job in dbt Cloud](/guides/sl-snowflake-qs?step=13)
- [Set up dbt Semantic Layer in dbt Cloud](/guides/sl-snowflake-qs?step=14)
- [Connect and query metrics with Google Sheets](/guides/sl-snowflake-qs?step=15)

## Create new Snowflake worksheet and set up environment

1. Log in to your [trial Snowflake account](https://signup.snowflake.com).
2. In the Snowflake user interface (UI), click **+ Worksheet** in the upper right corner.
3. Select **SQL Worksheet** to create a new worksheet.

### Set up Snowflake environment

The data used here is stored as CSV files in a public S3 bucket and the following steps will guide you through how to prepare your Snowflake account for that data and upload it.

Create a new virtual warehouse, two new databases (one for raw data, the other for future dbt development), and two new schemas (one for `jaffle_shop` data, the other for `stripe` data).

1. Run the following SQL commands one by one by typing them into the Editor of your new Snowflake SQL worksheet to set up your environment.

2. Click **Run** in the upper right corner of the UI for each one:

```sql
-- Create a virtual warehouse named 'transforming'
create warehouse transforming;

-- Create two databases: one for raw data and another for analytics
create database raw;
create database analytics;

-- Within the 'raw' database, create two schemas: 'jaffle_shop' and 'stripe'
create schema raw.jaffle_shop;
create schema raw.stripe;
```

## Load data into Snowflake
Now that your environment is set up, you can start loading data into it. You will be working within the raw database, using the `jaffle_shop` and stripe schemas to organize your tables.

1. Create customer table. First, delete all contents (empty) in the Editor of the Snowflake worksheet. Then, run this SQL command to create the customer table in the `jaffle_shop` schema:

  ```sql
  create table raw.jaffle_shop.customers
  ( id integer,
    first_name varchar,
    last_name varchar
  );
  ```

  You should see a ‘Table `CUSTOMERS` successfully created.’ message.

2. Load data. After creating the table, delete all contents in the Editor. Run this command to load data from the S3 bucket into the customer table:

  ```sql
  copy into raw.jaffle_shop.customers (id, first_name, last_name)
  from 's3://dbt-tutorial-public/jaffle_shop_customers.csv'
  file_format = (
      type = 'CSV'
      field_delimiter = ','
      skip_header = 1
      );
  ```

  You should see a confirmation message after running the command.

3. Create `orders` table. Delete all contents in the Editor. Run the following command to create…

  ```sql
  create table raw.jaffle_shop.orders
  ( id integer,
    user_id integer,
    order_date date,
    status varchar,
    _etl_loaded_at timestamp default current_timestamp
  );
  ```

  You should see a confirmation message after running the command.

4. Load data. Delete all contents in the Editor, then run this command to load data into the orders table:

  ```sql
  copy into raw.jaffle_shop.orders (id, user_id, order_date, status)
  from 's3://dbt-tutorial-public/jaffle_shop_orders.csv'
  file_format = (
      type = 'CSV'
      field_delimiter = ','
      skip_header = 1
      );
  ```

  You should see a confirmation message after running the command.

5. Create `payment` table. Delete all contents in the Editor. Run the following command to create the payment table:

  ```sql
  create table raw.stripe.payment
  ( id integer,
    orderid integer,
    paymentmethod varchar,
    status varchar,
    amount integer,
    created date,
    _batched_at timestamp default current_timestamp
  );
  ```

  You should see a confirmation message after running the command.

6. Load data. Delete all contents in the Editor. Run the following command to load data into the payment table:

  ```sql
  copy into raw.stripe.payment (id, orderid, paymentmethod, status, amount, created)
  from 's3://dbt-tutorial-public/stripe_payments.csv'
  file_format = (
      type = 'CSV'
      field_delimiter = ','
      skip_header = 1
      );
  ```

  You should see a confirmation message after running the command.

7. Verify data. Verify that the data is loaded by running these SQL queries. Confirm that you can see output for each one, like the following confirmation image.

  ```sql
  select * from raw.jaffle_shop.customers;
  select * from raw.jaffle_shop.orders;
  select * from raw.stripe.payment;
  ```

  <Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-snowflake-confirm.jpg" width="90%" title="The image displays Snowflake's confirmation output when data loaded correctly in the Editor." />

## Connect dbt Cloud to Snowflake

There are two ways to connect dbt Cloud to Snowflake. The first option is Partner Connect, which provides a streamlined setup to create your dbt Cloud account from within your new Snowflake trial account. The second option is to create your dbt Cloud account separately and build the Snowflake connection yourself (connect manually). If you want to get started quickly, dbt Labs recommends using Partner Connect. If you want to customize your setup from the very beginning and gain familiarity with the dbt Cloud setup flow, dbt Labs recommends connecting manually.

<Tabs>
<TabItem value="partner-connect" label="Use Partner Connect" default>

Using Partner Connect allows you to create a complete dbt account with your [Snowflake connection](/docs/cloud/connect-data-platform/connect-snowflake), [a managed repository](/docs/collaborate/git/managed-repository), [environments](/docs/build/custom-schemas#managing-environments), and credentials.

1. In the Snowflake UI, click on the home icon in the upper left corner. In the left sidebar, select **Data Products**. Then, select **Partner Connect**. Find the dbt tile by scrolling or by searching for dbt in the search bar. Click the tile to connect to dbt.

    <Lightbox src="/img/snowflake_tutorial/snowflake_partner_connect_box.png" title="Snowflake Partner Connect Box" />

    If you’re using the classic version of the Snowflake UI, you can click the **Partner Connect** button in the top bar of your account. From there, click on the dbt tile to open up the connect box. 

    <Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_partner_connect.png" title="Snowflake Classic UI - Partner Connect" />

2. In the **Connect to dbt** popup, find the **Optional Grant** option and select the **RAW** and **ANALYTICS** databases. This will grant access for your new dbt user role to each selected database. Then, click **Connect**.

    <Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_connection_box.png" title="Snowflake Classic UI - Connection Box" />

    <Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_connection_box.png" title="Snowflake New UI - Connection Box" />

3. Click **Activate** when a popup appears: 

<Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_activation_window.png" title="Snowflake Classic UI - Actviation Window" />

<Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_activation_window.png" title="Snowflake New UI - Activation Window" />

4. After the new tab loads, you will see a form. If you already created a dbt Cloud account, you will be asked to provide an account name. If you haven't created an account, you will be asked to provide an account name and password.

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_account_info.png" title="dbt Cloud - Account Info" />

5. After you have filled out the form and clicked **Complete Registration**, you will be logged into dbt Cloud automatically.

6. Click your account name in the left side menu and select **Account settings**, choose the "Partner Connect Trial" project, and select **snowflake** in the overview table. Select **Edit** and update the **Database** field to `analytics` and the **Warehouse** field to `transforming`.

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_project_overview.png" title="dbt Cloud - Snowflake Project Overview" />

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_update_database_and_warehouse.png" title="dbt Cloud - Update Database and Warehouse" />

</TabItem>
<TabItem value="manual-connect" label="Connect manually">


1. Create a new project in dbt Cloud. Navigate to **Account settings** (by clicking on your account name in the left side menu), and click **+ New Project**.
2. Enter a project name and click **Continue**.
3. For the warehouse, click **Snowflake** then **Next** to set up your connection.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_setup_snowflake_connection_start.png" title="dbt Cloud - Choose Snowflake Connection" />

4. Enter your **Settings** for Snowflake with: 
    * **Account** &mdash; Find your account by using the Snowflake trial account URL and removing `snowflakecomputing.com`. The order of your account information will vary by Snowflake version. For example, Snowflake's Classic console URL might look like: `oq65696.west-us-2.azure.snowflakecomputing.com`. The AppUI or Snowsight URL might look more like: `snowflakecomputing.com/west-us-2.azure/oq65696`. In both examples, your account will be: `oq65696.west-us-2.azure`. For more information, see [Account Identifiers](https://docs.snowflake.com/en/user-guide/admin-account-identifier.html) in the Snowflake docs.  

        <Snippet path="snowflake-acct-name" />
    
    * **Role** &mdash; Leave blank for now. You can update this to a default Snowflake role later.
    * **Database** &mdash; `analytics`.  This tells dbt to create new models in the analytics database.
    * **Warehouse** &mdash; `transforming`. This tells dbt to use the transforming warehouse that was created earlier.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_account_settings.png" title="dbt Cloud - Snowflake Account Settings" />

5. Enter your **Development Credentials** for Snowflake with: 
    * **Username** &mdash; The username you created for Snowflake. The username is not your email address and is usually your first and last name together in one word. 
    * **Password** &mdash; The password you set when creating your Snowflake account.
    * **Schema** &mdash; You’ll notice that the schema name has been auto-created for you. By convention, this is `dbt_<first-initial><last-name>`. This is the schema connected directly to your development environment, and it's where your models will be built when running dbt within the Cloud IDE.
    * **Target name** &mdash; Leave as the default.
    * **Threads** &mdash; Leave as 4. This is the number of simultaneous connects that dbt Cloud will make to build models concurrently.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_development_credentials.png" title="dbt Cloud - Snowflake Development Credentials" />

6. Click **Test Connection**. This verifies that dbt Cloud can access your Snowflake account.
7. If the connection test succeeds, click **Next**. If it fails, you may need to check your Snowflake settings and credentials.

</TabItem>
</Tabs>

## Set up a dbt Cloud managed repository 
If you used Partner Connect, you can skip to [initializing your dbt project](#initialize-your-dbt-project-and-start-developing) as Partner Connect provides you with a [managed repository](/docs/collaborate/git/managed-repository). Otherwise, you will need to create your repository connection. 

<Snippet path="tutorial-managed-repo" />

## Initialize your dbt project and start developing
This guide assumes you use the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) to develop your dbt project, define metrics, and query and preview metrics using [MetricFlow commands](/docs/build/metricflow-commands).

Now that you have a repository configured, you can initialize your project and start development in dbt Cloud using the IDE:

1. Click **Start developing in the dbt Cloud IDE**. It might take a few minutes for your project to spin up for the first time as it establishes your git connection, clones your repo, and tests the connection to the warehouse.
2. Above the file tree to the left, click **Initialize your project**. This builds out your folder structure with example models.
3. Make your initial commit by clicking **Commit and sync**. Use the commit message `initial commit`. This creates the first commit to your managed repo and allows you to open a branch where you can add a new dbt code.
4. You can now directly query data from your warehouse and execute `dbt run`. You can try this out now:
    - Delete the models/examples folder in the **File Explorer**.
    - Click **+ Create new file**, add this query to the new file, and click **Save as** to save the new file:
      ```sql
      select * from raw.jaffle_shop.customers
      ```
    - In the command line bar at the bottom, enter dbt run and click Enter. You should see a dbt run succeeded message.

## Build your dbt project
The next step is to build your project. This involves adding sources, staging models, business-defined entities, and packages to your project.

### Add sources

[Sources](/docs/build/sources) in dbt are the raw data tables you'll transform. By organizing your source definitions, you document the origin of your data. It also makes your project and transformation more reliable, structured, and understandable.

You have two options for working with files in the dbt Cloud IDE:

- **Create a new branch (recommended)** &mdash; Create a new branch to edit and commit your changes. Navigate to **Version Control** on the left sidebar and click **Create branch**.
- **Edit in the protected primary branch** &mdash; If you prefer to edit, format, or lint files and execute dbt commands directly in your primary git branch, use this option. The dbt Cloud IDE prevents commits to the protected branch so you'll be prompted to commit your changes to a new branch.

Name the new branch `build-project`.

1. Hover over the `models` directory and click the three-dot menu (**...**), then select **Create file**.
2. Name the file `staging/jaffle_shop/src_jaffle_shop.yml` , then click **Create**.
3. Copy the following text into the file and click **Save**.

<File name='models/staging/jaffle_shop/src_jaffle_shop.yml'>

```yaml
version: 2

sources:
 - name: jaffle_shop
   database: raw
   schema: jaffle_shop
   tables:
     - name: customers
     - name: orders
```

</File>

:::tip
In your source file, you can also use the **Generate model** button to create a new model file for each source. This creates a new file in the `models` directory with the given source name and fill in the SQL code of the source definition.
:::

4. Hover over the `models` directory and click the three dot menu (**...**), then select **Create file**.
5. Name the file `staging/stripe/src_stripe.yml` , then click **Create**.
6. Copy the following text into the file and click **Save**.

<File name='models/staging/stripe/src_stripe.yml'>

```yaml
version: 2

sources:
 - name: stripe
   database: raw
   schema: stripe
   tables:
     - name: payment
```
</File>

### Add staging models
[Staging models](/best-practices/how-we-structure/2-staging) are the first transformation step in dbt. They clean and prepare your raw data, making it ready for more complex transformations and analyses. Follow these steps to add your staging models to your project.

1. In the `jaffle_shop` sub-directory, create the file `stg_customers.sql`. Or, you can use the **Generate model** button to create a new model file for each source.
2. Copy the following query into the file and click **Save**.

<File name='models/staging/jaffle_shop/stg_customers.sql'>

```sql
  select
   id as customer_id,
   first_name,
   last_name
from {{ source('jaffle_shop', 'customers') }}
```

</File>

3. In the same `jaffle_shop` sub-directory, create the file `stg_orders.sql`
4. Copy the following query into the file and click **Save**.

<File name='models/staging/jaffle_shop/stg_orders.sql'>

```sql
  select
    id as order_id,
    user_id as customer_id,
    order_date,
    status
  from {{ source('jaffle_shop', 'orders') }}
```

</File>

5. In the `stripe` sub-directory, create the file `stg_payments.sql`.
6. Copy the following query into the file and click **Save**.

<File name='models/staging/stripe/stg_payments.sql'>

```sql
select
   id as payment_id,
   orderid as order_id,
   paymentmethod as payment_method,
   status,
   -- amount is stored in cents, convert it to dollars
   amount / 100 as amount,
   created as created_at


from {{ source('stripe', 'payment') }}
```

</File>

7. Enter `dbt run` in the command prompt at the bottom of the screen. You should get a successful run and see the three models.

### Add business-defined entities

This phase involves creating [models that serve as the entity layer or concept layer of your dbt project](/best-practices/how-we-structure/4-marts), making the data ready for reporting and analysis.  It also includes adding [packages](/docs/build/packages) and the [MetricFlow time spine](/docs/build/metricflow-time-spine) that extend dbt's functionality.

This phase is the [marts layer](/best-practices/how-we-structure/1-guide-overview#guide-structure-overview), which brings together modular pieces into a wide, rich vision of the entities an organization cares about.

1. Create the file `models/marts/fct_orders.sql`.
2. Copy the following query into the file and click **Save**.

<File name='models/marts/fct_orders.sql'>

```sql
with orders as  (
   select * from {{ ref('stg_orders' )}}
),


payments as (
   select * from {{ ref('stg_payments') }}
),


order_payments as (
   select
       order_id,
       sum(case when status = 'success' then amount end) as amount


   from payments
   group by 1
),


final as (


   select
       orders.order_id,
       orders.customer_id,
       orders.order_date,
       coalesce(order_payments.amount, 0) as amount


   from orders
   left join order_payments using (order_id)
)


select * from final

```

</File>

3. In the `models/marts` directory, create the file `dim_customers.sql`.
4. Copy the following query into the file and click **Save**.

<File name='models/marts/dim_customers.sql'>

```sql
with customers as (
   select * from {{ ref('stg_customers')}}
),
orders as (
   select * from {{ ref('fct_orders')}}
),
customer_orders as (
   select
       customer_id,
       min(order_date) as first_order_date,
       max(order_date) as most_recent_order_date,
       count(order_id) as number_of_orders,
       sum(amount) as lifetime_value
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
       coalesce(customer_orders.number_of_orders, 0) as number_of_orders,
       customer_orders.lifetime_value
   from customers
   left join customer_orders using (customer_id)
)
select * from final
```

</File>

5. In your main directory, create the file `packages.yml`.
6. Copy the following text into the file and click **Save**.

<File name='packages.yml'>

```sql
packages:
 - package: dbt-labs/dbt_utils
   version: 1.1.1
```

</File>

7. In the `models` directory, create the file `metrics/metricflow_time_spine.sql` in your main directory.
8. Copy the following query into the file and click **Save**.

<File name='models/metrics/metricflow_time_spine.sql'>

```sql
{{
   config(
       materialized = 'table',
   )
}}
with days as (
   {{
       dbt_utils.date_spine(
           'day',
           "to_date('01/01/2000','mm/dd/yyyy')",
           "to_date('01/01/2027','mm/dd/yyyy')"
       )
   }}
),
final as (
   select cast(date_day as date) as date_day
   from days
)
select * from final

```

</File>

9. Enter `dbt run` in the command prompt at the bottom of the screen. You should get a successful run message and also see in the run details that dbt has successfully built five models.

## Create semantic models

[Semantic models](/docs/build/semantic-models) contain many object types (such as entities, measures, and dimensions) that allow MetricFlow to construct the queries for metric definitions.

- Each semantic model will be 1:1 with a dbt SQL/Python model.
- Each semantic model will contain (at most) 1 primary or natural entity.
- Each semantic model will contain zero, one, or many foreign or unique entities used to connect to other entities.
- Each semantic model may also contain dimensions, measures, and metrics. This is what actually gets fed into and queried by your downstream BI tool.

In the following steps, semantic models enable you to define how to interpret the data related to orders. It includes entities (like ID columns serving as keys for joining data), dimensions (for grouping or filtering data), and measures (for data aggregations).

1. In the `metrics` sub-directory, create a new file `fct_orders.yml`.

:::tip 
Make sure to save all semantic models and metrics under the directory defined in the [`model-paths`](/reference/project-configs/model-paths) (or a subdirectory of it, like `models/semantic_models/`). If you save them outside of this path, it will result in an empty `semantic_manifest.json` file, and your semantic models or metrics won't be recognized.
:::

2. Add the following code to that newly created file:

<File name='models/metrics/fct_orders.yml'>

```yaml
semantic_models:
  - name: orders
    defaults:
      agg_time_dimension: order_date
    description: |
      Order fact table. This table’s grain is one row per order.
    model: ref('fct_orders')
```

</File>

The following sections explain [dimensions](/docs/build/dimensions), [entities](/docs/build/entities), and [measures](/docs/build/measures) in more detail, showing how they each play a role in semantic models.

- [Entities](#entities) act as unique identifiers (like ID columns) that link data together from different tables.
- [Dimensions](#dimensions) categorize and filter data, making it easier to organize.
- [Measures](#measures) calculates data, providing valuable insights through aggregation.

### Entities

[Entities](/docs/build/semantic-models#entities) are a real-world concept in a business, serving as the backbone of your semantic model. These are going to be ID columns (like `order_id`) in our semantic models. These will serve as join keys to other semantic models.

Add entities to your `fct_orders.yml` semantic model file:

<File name='models/metrics/fct_orders.yml'>

```yaml
semantic_models:
  - name: orders
    defaults:
      agg_time_dimension: order_date
    description: |
      Order fact table. This table’s grain is one row per order.
    model: ref('fct_orders')
    # Newly added
    entities: 
      - name: order_id
        type: primary
      - name: customer
        expr: customer_id
        type: foreign
```

</File>

### Dimensions

[Dimensions](/docs/build/semantic-models#entities) are a way to group or filter information based on categories or time. 

Add dimensions to your `fct_orders.yml` semantic model file:

<File name='models/metrics/fct_orders.yml'>

```yaml
semantic_models:
  - name: orders
    defaults:
      agg_time_dimension: order_date
    description: |
      Order fact table. This table’s grain is one row per order.
    model: ref('fct_orders')
    entities:
      - name: order_id
        type: primary
      - name: customer
        expr: customer_id
        type: foreign
    # Newly added
    dimensions:   
      - name: order_date
        type: time
        type_params:
          time_granularity: day
```

</File>

### Measures

[Measures](/docs/build/semantic-models#measures) are aggregations performed on columns in your model. Often, you’ll find yourself using them as final metrics themselves. Measures can also serve as building blocks for more complicated metrics.

Add measures to your `fct_orders.yml` semantic model file:

<File name='models/metrics/fct_orders.yml'>

```yaml
semantic_models:
  - name: orders
    defaults:
      agg_time_dimension: order_date
    description: |
      Order fact table. This table’s grain is one row per order.
    model: ref('fct_orders')
    entities:
      - name: order_id
        type: primary
      - name: customer
        expr: customer_id
        type: foreign
    dimensions:
      - name: order_date
        type: time
        type_params:
          time_granularity: day
    # Newly added      
    measures:   
      - name: order_total
        description: The total amount for each order including taxes.
        agg: sum
        expr: amount
      - name: order_count
        expr: 1
        agg: sum
      - name: customers_with_orders
        description: Distinct count of customers placing orders
        agg: count_distinct
        expr: customer_id
      - name: order_value_p99 ## The 99th percentile order value
        expr: amount
        agg: percentile
        agg_params:
          percentile: 0.99
          use_discrete_percentile: True
          use_approximate_percentile: False
```

</File>

## Define metrics

[Metrics](/docs/build/metrics-overview) are the language your business users speak and measure business performance. They are an aggregation over a column in your warehouse that you enrich with dimensional cuts.

There are different types of metrics you can configure:

- [Conversion metrics](/docs/build/conversion) &mdash; Track when a base event and a subsequent conversion event occur for an entity within a set time period.
- [Cumulative metrics](/docs/build/metrics-overview#cumulative-metrics) &mdash; Aggregate a measure over a given window. If no window is specified, the window will accumulate the measure over all of the recorded time period. Note that you must create the time spine model before you add cumulative metrics.
- [Derived metrics](/docs/build/metrics-overview#derived-metrics) &mdash; Allows you to do calculations on top of metrics.
- [Simple metrics](/docs/build/metrics-overview#simple-metrics) &mdash; Directly reference a single measure without any additional measures involved.
- [Ratio metrics](/docs/build/metrics-overview#ratio-metrics) &mdash; Involve a numerator metric and a denominator metric. A constraint string can be applied to both the numerator and denominator or separately to the numerator or denominator.

Once you've created your semantic models, it's time to start referencing those measures you made to create some metrics:

1. Add metrics to your `fct_orders.yml` semantic model file:

:::tip 
Make sure to save all semantic models and metrics under the directory defined in the [`model-paths`](/reference/project-configs/model-paths) (or a subdirectory of it, like `models/semantic_models/`). If you save them outside of this path, it will result in an empty `semantic_manifest.json` file, and your semantic models or metrics won't be recognized.
:::

<File name='models/metrics/fct_orders.yml'>

```yaml
semantic_models:
  - name: orders
    defaults:
      agg_time_dimension: order_date
    description: |
      Order fact table. This table’s grain is one row per order
    model: ref('fct_orders')
    entities:
      - name: order_id
        type: primary
      - name: customer
        expr: customer_id
        type: foreign
    dimensions:
      - name: order_date
        type: time
        type_params:
          time_granularity: day
    measures:
      - name: order_total
        description: The total amount for each order including taxes.
        agg: sum
        expr: amount
      - name: order_count
        expr: 1
        agg: sum
      - name: customers_with_orders
        description: Distinct count of customers placing orders
        agg: count_distinct
        expr: customer_id
      - name: order_value_p99
        expr: amount
        agg: percentile
        agg_params:
          percentile: 0.99
          use_discrete_percentile: True
          use_approximate_percentile: False
# Newly added          
metrics: 
  # Simple type metrics
  - name: "order_total"
    description: "Sum of orders value"
    type: simple
    label: "order_total"
    type_params:
      measure:
        name: order_total
  - name: "order_count"
    description: "number of orders"
    type: simple
    label: "order_count"
    type_params:
      measure:
        name: order_count
  - name: large_orders
    description: "Count of orders with order total over 20."
    type: simple
    label: "Large Orders"
    type_params:
      measure:
        name: order_count
    filter: |
      {{ Metric('order_total', group_by=['order_id']) }} >=  20
  # Ratio type metric
  - name: "avg_order_value"
    label: "avg_order_value"
    description: "average value of each order"
    type: ratio
    type_params:
      numerator: order_total
      denominator: order_count
  # Cumulative type metrics
  - name: "cumulative_order_amount_mtd"
    label: "cumulative_order_amount_mtd"
    description: "The month to date value of all orders"
    type: cumulative
    type_params:
      measure:
        name: order_total
      grain_to_date: month
  # Derived metric
  - name: "pct_of_orders_that_are_large"
    label: "pct_of_orders_that_are_large"
    description: "percent of orders that are large"
    type: derived
    type_params:
      expr: large_orders/order_count
      metrics:
        - name: large_orders
        - name: order_count
```

</File>

## Add second semantic model to your project

Great job, you've successfully built your first semantic model! It has all the required elements: entities, dimensions, measures, and metrics.

Let’s expand your project's analytical capabilities by adding another semantic model in your other marts model, such as: `dim_customers.yml`.

After setting up your orders model:

1. In the `metrics` sub-directory, create the file `dim_customers.yml`.
2. Copy the following query into the file and click **Save**.

<File name='models/metrics/dim_customers.yml'>

```yaml
semantic_models:
  - name: customers
    defaults:
      agg_time_dimension: most_recent_order_date
    description: |
      semantic model for dim_customers
    model: ref('dim_customers')
    entities:
      - name: customer
        expr: customer_id
        type: primary
    dimensions:
      - name: customer_name
        type: categorical
        expr: first_name
      - name: first_order_date
        type: time
        type_params:
          time_granularity: day
      - name: most_recent_order_date
        type: time
        type_params:
          time_granularity: day
    measures:
      - name: count_lifetime_orders
        description: Total count of orders per customer.
        agg: sum
        expr: number_of_orders
      - name: lifetime_spend
        agg: sum
        expr: lifetime_value
        description: Gross customer lifetime spend inclusive of taxes.
      - name: customers
        expr: customer_id
        agg: count_distinct

metrics:
  - name: "customers_with_orders"
    label: "customers_with_orders"
    description: "Unique count of customers placing orders"
    type: simple
    type_params:
      measure:
        name: customers
```

</File>

This semantic model uses simple metrics to focus on customer metrics and emphasizes customer dimensions like name, type, and order dates. It uniquely analyzes customer behavior, lifetime value, and order patterns.

## Test and query metrics

<!-- The below snippets (or reusables) can be found in the following file locations in the docs code repository) 

https://github.com/dbt-labs/docs.getdbt.com/blob/current/website/snippets/_sl-test-and-query-metrics.md
-->

<TestQuery />

## Run a production job

<!-- The below snippets (or reusables) can be found in the following file locations in the docs code repository) 

https://github.com/dbt-labs/docs.getdbt.com/blob/current/website/snippets/_sl-run-prod-job.md
-->

<RunProdJob/>


## Set up dbt Semantic Layer

<!-- The below snippets (or reusables) can be found in the following file locations in the docs code repository) 

https://github.com/dbt-labs/docs.getdbt.com/blob/current/website/snippets/_new-sl-setup.md
-->

<SlSetUp/>

## Query the Semantic Layer

This page will guide you on how to connect and use the following integrations to query your metrics:

- [Connect and query with Google Sheets](#connect-and-query-with-google-sheets)
- [Connect and query with Hex](#connect-and-query-with-hex)

The dbt Semantic Layer enables you to connect and query your metric with various available tools like Google Sheets, Hex, Tableau, and more. 

Query metrics using other tools such as [first-class integrations](/docs/cloud-integrations/avail-sl-integrations), [Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview), and [exports](/docs/use-dbt-semantic-layer/exports) to expose tables of metrics and dimensions in your data platform and create a custom integration with tools like PowerBI.

 ### Connect and query with Google Sheets

<!-- The below snippets (or reusables) can be found in the following file locations in the docs code repository) 

https://github.com/dbt-labs/docs.getdbt.com/blob/current/website/snippets/_sl-connect-and-query-api.md
-->

<ConnectQueryAPI/>

### Connect and query with Hex
This section will guide you on how to use the Hex integration to query your metrics using Hex. Select the appropriate tab based on your connection method:

<Tabs>
<TabItem value="partner-connect" label="Query Semantic Layer with Hex" default>

1. Navigate to the [Hex login page](https://app.hex.tech/login). 
2. Sign in or make an account (if you don’t already have one). 
  - You can make Hex free trial accounts with your work email or a .edu email.
3. In the top left corner of your page, click on the **HEX** icon to go to the home page.
4. Then, click the **+ New project** button on the top right.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_new.png" width="50%" title="Click the '+ New project' button on the top right"/>
5. Go to the menu on the left side and select **Data browser**. Then select **Add a data connection**. 
6. Click **Snowflake**. Provide your data connection a name and description. You don't need to your data warehouse credentials to use the Semantic Layer.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_new_data_connection.png" width="50%" title="Select 'Data browser' and then 'Add a data connection' to connect to Snowflake."/>
7. Under **Integrations**, toggle the dbt switch to the right to enable the dbt integration.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_dbt_toggle.png" width="50%" title="Click on the dbt toggle to enable the integration. "/>

8. Enter the following information:
   * Select your version of dbt as 1.6 or higher
   * Enter your environment id 
   * Enter your service token 
   * Make sure to click on the **Use Semantic Layer** toggle. This way, all queries are routed through dbt.
   * Click **Create connection** in the bottom right corner.
9. Hover over **More** on the menu shown in the following image and select **dbt Semantic Layer**.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_make_sl_cell.png" width="90%" title="Hover over 'More' on the menu and select 'dbt Semantic Layer'."/>

10. Now, you should be able to query metrics using Hex! Try it yourself: 
    - Create a new cell and pick a metric. 
    - Filter it by one or more dimensions.
    - Create a visualization.

</TabItem>
<TabItem value="manual-connect" label="Getting started with the Semantic Layer workshop">

1. Click on the link provided to you in the workshop’s chat. 
   - Look at the **Pinned message** section of the chat if you don’t see it right away.
2. Enter your email address in the textbox provided. Then, select **SQL and Python** to be taken to Hex’s home screen.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/welcome_to_hex.png" width="70%" title="The 'Welcome to Hex' homepage."/>

3. Then click the purple Hex button in the top left corner.
4. Click the **Collections** button on the menu on the left.
5. Select the **Semantic Layer Workshop** collection. 
6. Click the **Getting started with the dbt Semantic Layer** project collection.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_collections.png" width="80%" title="Click 'Collections' to select the 'Semantic Layer Workshop' collection."/>

7. To edit this Hex notebook, click the **Duplicate** button from the project dropdown menu (as displayed in the following image). This creates a new copy of the Hex notebook that you own.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_duplicate.png" width="80%" title="Click the 'Duplicate' button from the project dropdown menu to create a Hex notebook copy."/>

8. To make it easier to find, rename your copy of the Hex project to include your name.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_rename.png" width="60%" title="Rename your Hex project to include your name."/>

9. Now, you should be able to query metrics using Hex! Try it yourself with the following example queries:

   - In the first cell, you can see a table of the `order_total` metric over time. Add the `order_count` metric to this table.
   - The second cell shows a line graph of the `order_total` metric over time. Play around with the graph! Try changing the time grain using the **Time unit** drop-down menu.
   - The next table in the notebook, labeled “Example_query_2”, shows the number of customers who have made their first order on a given day. Create a new chart cell. Make a line graph of `first_ordered_at` vs `customers` to see how the number of new customers each day changes over time.
   - Create a new semantic layer cell and pick one or more metrics. Filter your metric(s) by one or more dimensions.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_make_sl_cell.png" width="90%" title="Query metrics using Hex "/>

</TabItem>
</Tabs>

## What's next

<ConfettiTrigger>

Great job on completing the comprehensive dbt Semantic Layer guide 🎉! You should hopefully have gained a clear understanding of what the dbt Semantic Layer is, its purpose, and when to use it in your projects.

You've learned how to:

- Set up your Snowflake environment and dbt Cloud, including creating worksheets and loading data.
- Connect and configure dbt Cloud with Snowflake.
- Build, test, and manage dbt Cloud projects, focusing on metrics and semantic layers.
- Run production jobs and query metrics with our available integrations.

For next steps, you can start defining your own metrics and learn additional configuration options such as [exports](/docs/use-dbt-semantic-layer/exports), [fill null values](/docs/build/advanced-topics), [implementing dbt Mesh with the Semantic Layer](/docs/use-dbt-semantic-layer/sl-faqs#how-can-i-implement-dbt-mesh-with-the-dbt-semantic-layer), and more.

Here are some additional resources to help you continue your journey:

- [dbt Semantic Layer FAQs](/docs/use-dbt-semantic-layer/sl-faqs)
- [Available integrations](/docs/cloud-integrations/avail-sl-integrations)
- Demo on [how to define and query metrics with MetricFlow](https://www.loom.com/share/60a76f6034b0441788d73638808e92ac?sid=861a94ac-25eb-4fd8-a310-58e159950f5a)
- [Join our live demos](https://www.getdbt.com/resources/webinars/dbt-cloud-demos-with-experts)

</ConfettiTrigger>

---
title: "Quickstart for dbt Cloud and Snowflake"
description: "Quickstart for dbt Cloud and Snowflake."
id: "snowflake"
sidebar_label: "Snowflake quickstart"
---
In this quickstart guide, you'll learn how to use dbt Cloud with Snowflake. It will show you how to: 

- Create a new Snowflake worksheet.
- Load sample data into your Snowflake account.
- Connect dbt Cloud to Snowflake.
- Take a sample query and turn it into a model in your dbt project. A model in dbt is a select statement.
- Add tests to your models.
- Document your models.
- Schedule a job to run.

Snowflake also provides a quickstart for you to learn how to use dbt Cloud. It makes use of a different public dataset (Knoema Economy Data Atlas) than what's shown in this guide. For more information, refer to [Accelerating Data Teams with dbt Cloud & Snowflake](https://quickstarts.snowflake.com/guide/data_teams_with_dbt_cloud/#0) in the Snowflake docs.

:::tip Videos for you
You can check out [dbt Fundamentals](https://courses.getdbt.com/courses/fundamentals) for free if you're interested in course learning with videos.

You can also watch the [YouTube video on dbt and Snowflake](https://www.youtube.com/watch?v=kbCkwhySV_I&list=PL0QYlrC86xQm7CoOH6RS7hcgLnd3OQioG).
:::

## Prerequisites​

- You have a [dbt Cloud account](https://www.getdbt.com/signup/). 
- You have a [trial Snowflake account](https://signup.snowflake.com/). During trial account creation, make sure to choose the **Enterprise** Snowflake edition so you have `ACCOUNTADMIN` access. For a full implementation, you should consider organizational questions when choosing a cloud provider. For more information, see [Introduction to Cloud Platforms](https://docs.snowflake.com/en/user-guide/intro-cloud-platforms.html) in the Snowflake docs. For the purposes of this setup, all cloud providers and regions will work so choose whichever you’d like.

## Create a new Snowflake worksheet 
1. Log in to your trial Snowflake account. 
2. In the Snowflake UI, click **+ Worksheet** in the upper right corner to create a new worksheet.

## Load data 
The data used here is stored as CSV files in a public S3 bucket and the following steps will guide you through how to prepare your Snowflake account for that data and upload it.

1. Create a new virtual warehouse, two new databases (one for raw data, the other for future dbt development), and two new schemas (one for `jaffle_shop` data, the other for `stripe` data). 

    To do this, run these SQL commands by typing them into the Editor of your new Snowflake worksheet and clicking **Run** in the upper right corner of the UI:
    ```sql
    create warehouse transforming;
    create database raw;
    create database analytics;
    create schema raw.jaffle_shop;
    create schema raw.stripe;
    ```

2. In the `raw` database and `jaffle_shop` and `stripe` schemas, create three tables and load relevant data into them: 

    - First, delete all contents (empty) in the Editor of the Snowflake worksheet. Then, run this SQL command to create the `customer` table:

        ```sql 
        ​​create table raw.jaffle_shop.customers 
        ( id integer,
          first_name varchar,
          last_name varchar
        );
        ```

    - Delete all contents in the Editor, then run this command to load data into the `customer` table: 

        ```sql 
        copy into raw.jaffle_shop.customers (id, first_name, last_name)
        from 's3://dbt-tutorial-public/jaffle_shop_customers.csv'
        file_format = (
            type = 'CSV'
            field_delimiter = ','
            skip_header = 1
            ); 
        ```
    - Delete all contents in the Editor (empty), then run this command to create the `orders` table:
        ```sql
        create table raw.jaffle_shop.orders
        ( id integer,
          user_id integer,
          order_date date,
          status varchar,
          _etl_loaded_at timestamp default current_timestamp
        );
        ```

    - Delete all contents in the Editor, then run this command to load data into the `orders` table:
        ```sql
        copy into raw.jaffle_shop.orders (id, user_id, order_date, status)
        from 's3://dbt-tutorial-public/jaffle_shop_orders.csv'
        file_format = (
            type = 'CSV'
            field_delimiter = ','
            skip_header = 1
            );
        ```
    - Delete all contents in the Editor (empty), then run this command to create the `payment` table:
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
    - Delete all contents in the Editor, then run this command to load data into the `payment` table:
        ```sql
        copy into raw.stripe.payment (id, orderid, paymentmethod, status, amount, created)
        from 's3://dbt-tutorial-public/stripe_payments.csv'
        file_format = (
            type = 'CSV'
            field_delimiter = ','
            skip_header = 1
            );
        ```
3. Verify that the data is loaded by running these SQL queries. Confirm that you can see output for each one. 
    ```sql
    select * from raw.jaffle_shop.customers;
    select * from raw.jaffle_shop.orders;
    select * from raw.stripe.payment;   
    ```

## Connect dbt Cloud to Snowflake

There are two ways to connect dbt Cloud to Snowflake. The first option is Partner Connect, which provides a streamlined setup to create your dbt Cloud account from within your new Snowflake trial account. The second option is to create your dbt Cloud account separately and build the Snowflake connection yourself (connect manually). If you are looking to get started quickly, dbt Labs recommends using Partner Connect. If you are looking to customize your setup from the very beginning and gain familiarity with the dbt Cloud setup flow, we recommend connecting manually.

<Tabs>
<TabItem value="partner-connect" label="Use Partner Connect" default>

Using Partner Connect allows you to create a complete dbt account with your [Snowflake connection](/docs/get-started/connect-your-database#connecting-to-snowflake), [a managed repository](/docs/collaborate/git/managed-repository), [environments](/docs/build/custom-schemas#managing-environments), and credentials.

1. In the Snowflake UI, click on the home icon in the upper left corner. Click on your user, and then select **Partner Connect**. Find the dbt tile by scrolling or by searching for dbt in the search bar. Click the tile to connect to dbt.

    <Lightbox src="/img/snowflake_tutorial/snowflake_partner_connect_box.png" title="Snowflake Partner Connect Box" />

    If you’re using the classic version of the Snowflake UI, you can click the **Partner Connect** button in the top bar of your account. From there, click on the dbt tile to open up the connect box. 

    <Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_partner_connect.png" title="Snowflake Classic UI - Partner Connect" />

2. In the **Connect to dbt** popup, find the **Optional Grant** option and select the **RAW** and **ANALYTICS** databases. This will grant access for your new dbt user role to each database. Then, click **Connect**.

    <Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_connection_box.png" title="Snowflake Classic UI - Connection Box" />

    <Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_connection_box.png" title="Snowflake New UI - Connection Box" />

3. Click **Activate** when a popup appears: 

<Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_activation_window.png" title="Snowflake Classic UI - Actviation Window" />

<Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_activation_window.png" title="Snowflake New UI - Activation Window" />

4. After the new tab loads, you will see a form. If you already created a dbt Cloud account, you will be asked to provide an account name. If you haven't created account, you will be asked to provide an account name and password.

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_account_info.png" title="dbt Cloud - Account Info" />

5. After you have filled out the form and clicked **Complete Registration**, you will be logged into dbt Cloud automatically.

6. From your **Account Settings** in dbt Cloud (using the gear menu in the upper right corner), choose the "Partner Connect Trial" project and select **snowflake** in the overview table. Select edit and update the fields **Database** and **Warehouse** to be `analytics` and `transforming`, respectively.

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_project_overview.png" title="dbt Cloud - Snowflake Project Overview" />

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_update_database_and_warehouse.png" title="dbt Cloud - Update Database and Warehouse" />

</TabItem>
<TabItem value="manual-connect" label="Connect manually">


1. Create a new project in dbt Cloud. From **Account settings** (using the gear menu in the top right corner), click **+ New Project**.
2. Enter a project name and click **Continue**.
3. For the warehouse, click **Snowflake** then **Next** to set up your connection.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_setup_snowflake_connection_start.png" title="dbt Cloud - Choose Snowflake Connection" />

4. Enter your **Settings** for Snowflake with: 
    * **Account** &mdash; Find your account by using the Snowflake trial account URL and removing `snowflakecomputing.com`. The order of your account information will vary by Snowflake version. For example, Snowflake's Classic console URL might look like: `oq65696.west-us-2.azure.snowflakecomputing.com`. The AppUI or Snowsight URL might look more like: `snowflakecomputing.com/west-us-2.azure/oq65696`. In both examples, your account will be: `oq65696.west-us-2.azure`. For more information, see [Account Identifiers](https://docs.snowflake.com/en/user-guide/admin-account-identifier.html) in the Snowflake docs.  

        <Snippet src="snowflake-acct-name" />
    
    * **Role** &mdash; Leave blank for now. You can update this to a default Snowflake role later.
    * **Database** &mdash; `analytics`.  This tells dbt to create new models in the analytics database.
    * **Warehouse** &mdash; `transforming`. This tells dbt to use the transforming warehouse that was created earlier.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_account_settings.png" title="dbt Cloud - Snowflake Account Settings" />

5. Enter your **Development Credentials** for Snowflake with: 
    * **Username** &mdash; The username you created for Snowflake. The username is not your email address and is usually your first and last name together in one word. 
    * **Password** &mdash; The password you set when creating your Snowflake account.
    * **Schema** &mdash; You’ll notice that the schema name has been auto created for you. By convention, this is `dbt_<first-initial><last-name>`. This is the schema connected directly to your development environment, and it's where your models will be built when running dbt within the Cloud IDE.
    * **Target name** &mdash; Leave as the default.
    * **Threads** &mdash; Leave as 4. This is the number of simultaneous connects that dbt Cloud will make to build models concurrently.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_development_credentials.png" title="dbt Cloud - Snowflake Development Credentials" />

6. Click **Test Connection**. This verifies that dbt Cloud can access your Snowflake account.
7. If the connection test succeeds, click **Next**. If it fails, you may need to check your Snowflake settings and credentials.

</TabItem>
</Tabs>

## Set up a dbt Cloud managed repository 
If you used Partner Connect, you can skip to [initializing your dbt project](#initialize-your-dbt-project-and-start-developing) as the Partner Connect provides you with a managed repository. Otherwise, you will need to create your repository connection. 

<Snippet src="tutorial-managed-repo" />

## Initialize your dbt project​ and start developing
Now that you have a repository configured, you can initialize your project and start development in dbt Cloud:

1. Click **Develop** from the upper left. It might take a few minutes for your project to spin up for the first time as it establishes your git connection, clones your repo, and tests the connection to the warehouse.
2. Above the file tree to the left, click **Initialize your project**. This builds out your folder structure with example models.
3. Make your initial commit by clicking **Commit**. Use the commit message `initial commit`. This creates the first commit to your managed repo and allows you to open a branch where you can add new dbt code.
4. You can now directly query data from your warehouse and execute `dbt run`. You can try this out now:
    - Click **+ Create new file**, add this query to the new file, and click **Save as** to save the new file: 
        ```sql
        select * from raw.jaffle_shop.customers
        ```
    - In the command line bar at the bottom, enter `dbt run` and click **Enter**. You should see a `dbt run succeeded` message.

## Build your first model
1. Click **Develop** from the upper left of dbt Cloud. You need to create a new branch since the main branch is set to read-only mode. 
2. Click **Create branch**. You can name it `add-customers-model`.
3. Click the **...** next to the Models directory, then select **Create file**.  
4. Name the file `models/customers.sql`, then click **Create**.
5. Copy the following query into the file and click **Save**.
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

6. Enter `dbt run` in the command prompt at the bottom of the screen. You should get a successful run and see the three models.

Later, you can connect your business intelligence (BI) tools to these views and tables so they only read cleaned up data rather than raw data in your BI tool.

## Change the way your model is materialized

<Snippet src="quickstarts/change-way-model-materialized" />

## Delete the example models

<Snippet src="quickstarts/delete-example-models" />

## Build models on top of other models

<Snippet src="quickstarts/build-models-atop-other-models" />

<Snippet src="quickstarts/test-and-document-your-project" />

<Snippet src="quickstarts/schedule-a-job" />

## Related content
- Learn more with [dbt Courses](https://courses.getdbt.com/collections)
- [How we configure Snowflake](https://blog.getdbt.com/how-we-configure-snowflake/)
- [dbt Cloud CI job](/docs/deploy/cloud-ci-job)
- [Job triggers](/docs/deploy/job-triggers)
- [Job notifications](/docs/deploy/job-notifications)
- [Source freshness](/docs/deploy/source-freshness)
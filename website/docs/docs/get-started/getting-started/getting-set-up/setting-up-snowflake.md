---
title: "Set up and connect Snowflake"
id: setting-up-snowflake
description: "Set up Snowflake with sample data and connect to dbt Cloud."
sidebar_label: "Set up and connect Snowflake"
pagination_prev: docs/get-started/getting-started/set-up-dbt-cloud
pagination_next: docs/get-started/getting-started/building-your-first-project/build-your-first-models
---

## Introduction

For the Snowflake project in the getting started guide, you'll learn how to set up Snowflake and connect it to dbt Cloud.

This guide will walk you through:

* Setting up a Snowflake trial account
* Loading training data into your Snowflake account
* Creating a dbt Cloud account, either through Partner Connect or through the account flow
* Connecting dbt Cloud and Snowflake
* Setting up the dbt Cloud IDE, querying data, and doing your first dbt run

## Prerequisites

The only prerequisites for this guide are to have access to an email account for signing up for Snowflake and dbt Cloud.

## Setting up

You can start by signing up for a free trial on Snowflake:

1. Sign up for a free trial by following [this link](https://signup.snowflake.com/) and completing the sign-up form.
2. Select the Enterprise edition, choose a cloud provider and region, and agree to the terms of service. 

  You should consider organizational questions when choosing a cloud provider for a full implementation. For more information, see [Introduction to Cloud Platforms](https://docs.snowflake.com/en/user-guide/intro-cloud-platforms.html) in the Snowflake docs. For the purposes of this setup, all cloud providers and regions will work so choose whichever you’d like. 
3. Click **GET STARTED**.
<div style={{maxWidth: '400px'}}>
<Lightbox  src="/img/snowflake_tutorial/snowflake_account_configuration.png" title="Snowflake Account Configuration" />
</div>

4. After submitting the sign-up form, you should receive an email asking you to activate your account. Click the link in the email and a new tab will open up where you’ll create your username and password. Complete the form and click **Get started**.
<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/snowflake_tutorial/snowflake_account_signup.png" title="Snowflake Account Signup" />
</div>

5. Congrats! Your workspace is ready for some data. Feel free to check out any of the getting started tooltips that Snowflake provides in the UI to familiarize yourself before moving on to the next section.
<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/snowflake_tutorial/snowflake_workspace.png" title="Snowflake Workspace" />
</div>

## Loading data

Now we’re ready for some sample data. The data used here is stored as CSV files in a public S3 bucket and the following steps will guide you through how to prepare your Snowflake account for that data and upload it. 

1. If using the new Snowflake UI, create a new worksheet by clicking the "+ Worksheet" button in the upper right hand corner of the screen.

<p align="center">
<Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_create_new_worksheet.png" title="Snowflake New UI - Create New Worksheet" />
</p>

2. Run the following commands to create a new virtual warehouse, two new databases (one for raw data, the other for future dbt development), and two new schemas (one for `jaffle_shop` data, the other for 'stripe' data). If you're curious to learn more about the naming conventions used, check out [this article](https://blog.getdbt.com/how-we-configure-snowflake/). Feel free to copy/paste from below:

```sql
create warehouse transforming;
create database raw;
create database analytics;
create schema raw.jaffle_shop;
create schema raw.stripe;
```

<p align="center">
<Lightbox src="/img/snowflake_tutorial/snowflake_create_warehouse_database_and_schema_commands.png" title="Snowflake - Create Warehouse, Database, and Schema Commands" />
</p>

3. Our next step will focus on creating **three** raw tables in the `raw` database and `jaffle_shop` and `stripe` schemas.  Execute the tabbed code snippets below to create the customers, orders, and payment table and load the respective data.

  <Tabs
    defaultValue="customers"
    values={[
        {label: 'customers', value: 'customers'},
        {label: 'orders', value: 'orders'},
        {label: 'payment', value: 'payment' }
    ]}>

  <TabItem value="customers">

  ```sql
  ​​create table raw.jaffle_shop.customers 
  ( id integer,
    first_name varchar,
    last_name varchar
  );

  copy into raw.jaffle_shop.customers (id, first_name, last_name)
  from 's3://dbt-tutorial-public/jaffle_shop_customers.csv'
  file_format = (
    type = 'CSV'
    field_delimiter = ','
    skip_header = 1
    );
  ```

  </TabItem>

  <TabItem value="orders">

  ```sql
  create table raw.jaffle_shop.orders
  ( id integer,
    user_id integer,
    order_date date,
    status varchar,
    _etl_loaded_at timestamp default current_timestamp
  );

  copy into raw.jaffle_shop.orders (id, user_id, order_date, status)
  from 's3://dbt-tutorial-public/jaffle_shop_orders.csv'
  file_format = (
    type = 'CSV'
    field_delimiter = ','
    skip_header = 1
    );
  ```

  </TabItem>

  <TabItem value="payment">

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

  copy into raw.stripe.payment (id, orderid, paymentmethod, status, amount, created)
  from 's3://dbt-tutorial-public/stripe_payments.csv'
  file_format = (
    type = 'CSV'
    field_delimiter = ','
    skip_header = 1
    );
  ```

  </TabItem>
  </Tabs>

<p align="center">
<Lightbox src="/img/snowflake_tutorial/snowflake_create_customers_table.png" title="Snowflake - Create Customers Table" />
</p>

<p align="center">
<Lightbox src="/img/snowflake_tutorial/snowflake_create_orders_table.png" title="Snowflake - Create Orders Table" />
</p>

<p align="center">
<Lightbox src="/img/snowflake_tutorial/snowflake_create_payments_table.png" title="Snowflake - Create Payments Table" />
</p>

6. Great! Your data is loaded and ready to go. Just to make sure, run the following commands to query your data and confirm that you see an output for each one. 

```sql
select * from raw.jaffle_shop.customers;
select * from raw.jaffle_shop.orders;
select * from raw.stripe.payment;
```

Now we’re ready to set up dbt Cloud!

## Connecting to dbt Cloud

There are two ways to connect dbt Cloud and Snowflake. The first option is Partner Connect, which provides a streamlined setup to create your dbt Cloud account from within your new Snowflake trial account.  The second option is to create your dbt Cloud account separately and build the Snowflake connection yourself.  If you are looking to get started quickly, we recommend **option 1**.  If you are looking to customize your setup from the very beginning and gain familiarity with the dbt Cloud setup flow, we recommend **option 2**.

### Option 1: Connect dbt Cloud and Snowflake with partner connect

1. With your Snowflake account up and running with data, we’re ready to connect it with dbt Cloud. We’re going to use [Snowflake Partner Connect](https://docs.snowflake.com/en/user-guide/ecosystem-partner-connect.html) to set up your dbt Cloud account and project. Using Partner Connect will allow you to create a complete dbt account with your [Snowflake connection](https://docs.getdbt.com/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-your-database#connecting-to-snowflake), [a managed repository](/docs/collaborate/git/managed-repository), [environments](/docs/build/custom-schemas#managing-environments), and credentials.
2. There’s a couple of ways you can access the Partner Connect page depending on if you’re navigating in the classic Snowflake UI or the new UI. 

  * **Snowflake Classic UI:** If you’re using the classic version of the Snowflake UI, you can click the Partner Connect button in the top bar of your account. From there, click on the dbt tile to open up the connect box. 

<p align="center">
<Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_partner_connect.png" title="Snowflake Classic UI - Partner Connect" />
</p>

  * **Snowflake New UI:** If you’re using the new web interface, you’ll want to click on your name in the upper left hand corner and then click on Partner Connect in the drop down menu.  You can scroll down to find the dbt tile, or search for dbt in the search bar and it will float to the top. Click on the tile to open up the connect box.

<p align="center">
<Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_partner_connect.png" title="Snowflake New UI - Partner Connect" />
</p>

<p align="center">
<Lightbox src="/img/snowflake_tutorial/snowflake_partner_connect_box.png" title="Snowflake Partner Connect Box" />
</p>

3. Once you’ve clicked on the tile, a connection box will appear that will look slightly different depending on the route you took above, but will contain the same Optional Grant box towards the bottom. In both cases, you’ll want to type in or select the `RAW` and `ANALYTICS` databases. This will grant access for your new dbt user role to each database. 

<p align="center">
<Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_connection_box.png" title="Snowflake Classic UI - Connection Box" />
</p>

<p align="center">
<Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_connection_box.png" title="Snowflake New UI - Connection Box" />
</p>

4. After you’ve entered the database names using either option above, click "Connect". You should see a pop up window similar to the one of the options below. Click Activate.

<p align="center">
<Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_activation_window.png" title="Snowflake Classic UI - Actviation Window" />
</p>

<p align="center">
<Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_activation_window.png" title="Snowflake New UI - Activation Window" />
</p>

5. A new tab will be created that will take you to the dbt Cloud website. Here you’ll be asked to create an account name with password, as well as agree to the Terms of Service. Once that’s done, click Complete Registration.

<p align="center">
<Lightbox src="/img/snowflake_tutorial/dbt_cloud_account_info.png" title="dbt Cloud - Account Info" />
</p>

6. We have one slight tweak to make to the dbt Cloud interface to account for the `analytics` database and `transforming` warehouse created earlier. Click the gear icon in the upper right and select **Account Settings**. Choose the "Partner Connection Trial" project and select `snowflake` in the overview table. Select edit and update the fields `database` and `warehouse` to be `analytics` and `transforming`, respectively.

<p align="center">
<Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_project_overview.png" title="dbt Cloud - Snowflake Project Overview" />
</p>

<p align="center">
<Lightbox src="/img/snowflake_tutorial/dbt_cloud_update_database_and_warehouse.png" title="dbt Cloud - Update Database and Warehouse" />
</p>

7. Great! Your dbt Cloud account is now completely setup and connected to your Snowflake trial account with a [managed repository](https://docs.getdbt.com/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-using-a-managed-repository). You can skip to the **[Initialize your repo and start development](#initialize-your-repository-and-start-development)** section to get started in the IDE. 

### Option 2: Connect dbt Cloud and Snowflake manually

#### Create a dbt Cloud account

<Snippet src="tutorial-create-new-dbt-cloud-account" />

#### Connect dbt Cloud to Snowflake

Now let's formally set up the connection between dbt Cloud and Snowflake.

1. Choose **Snowflake** to setup your connection.
<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/snowflake_tutorial/dbt_cloud_setup_snowflake_connection_start.png" title="dbt Cloud - Choose Snowflake Connection" />
</div>
2. For the name, write `Snowflake` or another simple title.    
2. Enter the following information under Snowflake settings.
    * **Account:** Find your account by using the Snowflake trial account URL and removing `snowflakecomputing.com`. The order of your account information will vary by Snowflake version. For example, Snowflake's Classic console URL might look like: `oq65696.west-us-2.azure.snowflakecomputing.com`. The AppUI or Snowsight URL might look more like: `snowflakecomputing.com/west-us-2.azure/oq65696`. In both examples, your account will be: `oq65696.west-us-2.azure`. For more information, see "[Account Identifiers](https://docs.snowflake.com/en/user-guide/admin-account-identifier.html)" in the             Snowflake documentation.  
    <Snippet src="snowflake-acct-name" /> <br/>
    * **Role:** Leave blank for now. You can update this to a default Snowflake role in the future.
    * **Database:** `analytics`.  This tells dbt to create new models in the analytics database.
    * **Warehouse:** `transforming`. This tells dbt to use the transforming warehouse we created earlier.
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_account_settings.png" title="dbt Cloud - Snowflake Account Settings" />
    </div>

3. Enter the following information under Development credentials.
    * **Username:** The username you created for Snowflake. Note: The username is not your email address and is usually your first and last name together in one word. 
    * **Password:** The password you set when creating your Snowflake account
    * **Schema:** You’ll notice that the schema name has been auto created for you. By convention, this is `dbt_<first-initial><last-name>`. This is the schema connected directly to your development environment, and it's where your models will be built when running dbt within the Cloud IDE.
    * **Target name:** leave as default
    * **Threads:** Leave as 4. This is the number of simultaneous connects that dbt Cloud will make to build models concurrently.
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_development_credentials.png" title="dbt Cloud - Snowflake Development Credentials" />
    </div>

4. Click **Test Connection** at the bottom. This verifies that dbt Cloud can access your Snowflake account.
5. If the connection test succeeds, click **Next**. If it fails, you may need to check your Snowflake settings and credentials.

## Initialize your repository and start development

If you used Partner Connect, you can skip over to [initializing your dbt project](/setting-up-snowflake#initialize-your-dbt-project) as the Partner Connect sets you up with an managed repostiory already. If not, you will need to create your managed repository connection. 

### Setting up a managed repository

<Snippet src="tutorial-managed-repo" />

### Initialize your dbt project

<Snippet src="tutorial-initiate-project" />

Congratulations! You have successfully completed the following:

- Set up a new Snowflake instance
- Loaded training data into your Snowflake account
- Connected dbt Cloud and Snowflake

## Next steps

<Snippet src="tutorial-next-steps-setting-up" />

---
title: "Set up and connect Snowflake"
id: setting-up-snowflake
description: "Set up Snowflake with sample data and connect to dbt Cloud."
sidebar_label: "Set up and connect Snowflake"
---

## Introduction

For the Snowflake project in the getting started guide, you'll learn how to set up Snowflake and connect it to dbt Cloud.

This project will walk you through:

* Setting up a Snowflake trial account
* Loading training data into your Snowflake account
* Creating a dbt Cloud account, either through Partner Connect or through the account flow
* Connecting dbt Cloud and Snowflake
* Setting up the dbt Cloud IDE, querying data, and doing your first dbt run

## Prerequisites

The only prerequisites for this tutorial are to have access to an email account for signing up for Snowflake and dbt Cloud.

## Setting up

We will start by signing up for a free trial on Snowflake.

1. Sign up for a free trial by following [this link](https://signup.snowflake.com/) and completing the sign-up form.

2. Select the Enterprise edition, choose a cloud provider and region, and agree to the terms of service. There are some organizational questions to think about when choosing a cloud provider for a full implementation, which you can read more about [here](https://docs.snowflake.com/en/user-guide/intro-cloud-platforms.html). For the purposes of this setup, all cloud providers and regions will work so choose whichever you’d like. Finally, click "GET STARTED".

<p align="center">
<Lightbox  src="/img/snowflake_tutorial/snowflake_account_configuration.png" title="Snowflake Account Configuration" />
</p>

3. After submitting the sign-up form, you should receive an email asking you to activate your account. Click the link in the email and a new tab will open up where you’ll create your username and password. Complete the form and click **Get started**.

<p align="center">
<Lightbox src="/img/snowflake_tutorial/snowflake_account_signup.png" title="Snowflake Account Signup" />
</p>

4. Congrats! Your workspace is ready for some data. Feel free to check out any of the getting started tooltips that Snowflake provides in the UI to familiarize yourself before moving on to the next section.

<p align="center">
<Lightbox src="/img/snowflake_tutorial/snowflake_workspace.png" title="Snowflake Workspace" />
</p>

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

1. With your Snowflake account up and running with data, we’re ready to connect it with dbt Cloud. We’re going to use [Snowflake Partner Connect](https://docs.snowflake.com/en/user-guide/ecosystem-partner-connect.html) to set up your dbt Cloud account and project. Using Partner Connect will allow you to create a complete dbt account with your [Snowflake connection](https://docs.getdbt.com/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-your-database#connecting-to-snowflake), [a managed repository](https://docs.getdbt.com/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-using-a-managed-repository), [environments](https://docs.getdbt.com/docs/guides/managing-environments), and credentials. 
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

6. We have one slight tweak to make to dbt Cloud interface to account for the `analytics` database and `transforming` warehouse created earlier.  Click the hamburger menu in the top left and choose account settings.  Select the project titled, "Partner Connection Trial" and select `snowflake` in the overview table.  Select edit and update the fields `database` and `warehouse` to be `analytics` and `transforming` respectively.

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

1. Click on the "Snowflake" icon to set up your connection.
2. Enter the following information under Snowflake settings.
  - **Account:** Your account is going to be the url of your Snowflake trial account up to the period before snowflakecomputing.com. So, if this is the full url of my trial account: `oq65696.west-us-2.azure.snowflakecomputing.com` then the account will be: `oq65696.west-us-2.azure`. You can read more about Snowflake account identifiers [here](https://docs.snowflake.com/en/user-guide/admin-account-identifier.html).
  - **Role:** Leave blank for now. You can update this to a default Snowflake role in the future.
  - **Database:** `analytics`.  This tells dbt to create new models in the analytics database.
  - **Warehouse:** `transforming`. This tells dbt to use the transforming warehouse we created earlier.

<p align="center">
<Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_account_settings.png" title="dbt Cloud - Snowflake Account Settings" />
</p>

7. Enter the following information under Development credentials.
  - **Username:** The username you created for Snowflake. Note: The username is not your email address and is usually your first and last name together in one word. 
  - **Password:** The password you set when creating your Snowflake account
  - **Schema:** You’ll notice that the schema name has been auto created for you and is `dbt_` followed by your first initial and last name. This is the schema connected directly to your development environment and is where your models will be built when running dbt within the Cloud IDE.
  - **Target name:** leave as default
  - **Threads:** Leave as 4. This is the number of simultaneous connects that dbt Cloud will make to build models concurently.

<p align="center">
<Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_development_credentials.png" title="dbt Cloud - Snowflake Development Credentials" />
</p>

4. Click “Test” at the top. This will check that dbt Cloud can access your Snowflake account.
5. If test successful, click “Continue”

## Initialize your repository and start development

<Snippet src="tutorial-managed-repo-and-initiate-project" />

Congratulations! You have successfully completed the following:

* Set up a Snowflake trial account
* Loaded training data into your Snowflake account
* Created a dbt Cloud account, either through Partner Connect or through the account flow
* Connected dbt Cloud and Snowflake
* Set up the dbt Cloud IDE, queried data, and did your first dbt run

## Next steps

<Snippet src="tutorial-next-steps-setting-up" />

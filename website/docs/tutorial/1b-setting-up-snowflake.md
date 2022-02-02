---
title: Setting up with Snowflake
id: setting-up-snowflake
---

## Get started with Snowflake

1. Getting started with Snowflake is super easy. You can sign up for a free trial by following [this link](https://signup.snowflake.com/). 

2. Then fill out the signup form.

<Lightbox src="/img/snowflake_tutorial/sign_up_for_snowflake.png" title="Sign up for Snowflake" />

3. Select the Enterprise edition, choose a cloud provider and region, and agree to the terms of service. There are some organizational questions to think about when choosing a cloud provider for a full implementation, which you can read more about [here](https://docs.snowflake.com/en/user-guide/intro-cloud-platforms.html). For the purposes of this setup, all cloud providers and regions will work so choose whichever you’d like. Finally, click get started.

<p align="center">
<Lightbox  src="/img/snowflake_tutorial/choose_your_cloud_provider.png" title="Choose Your Cloud Provider" />
</p>

4. After submitting the signup form you should receive an email asking you to activate your account. Click on the link in the email and a new tab will open up where you’ll create your username and password. Enter in all that info and click Get started.

<Lightbox src="/img/snowflake_tutorial/create_username_and_password.png" title="Create Username and Password" />

5. Congrats! Your workspace is ready for some data. Feel free to check out any of the getting started tooltips that Snowflake provides in the UI to familiarize yourself before moving on to the next section.

<Lightbox src="/img/snowflake_tutorial/snowflake_workspace.png" title="Snowflake Workspace" />


## Load sample data into Snowflake

1. Now we’re ready for some sample data. The data used here is stored as CSV files in a public S3 bucket and the following steps will guide you through how to prepare your Snowflake account for that data and upload it.

2. Run the following commands to create a new virtual warehouse, two new databases (one for raw data, the other for future dbt development), and a jaffle_shop schema for your raw data. Feel free to copy/paste from below:

```sql
create warehouse transforming;

create database raw;

create database analytics;

create schema raw.jaffle_shop;
```

<Lightbox src="/img/snowflake_tutorial/create_warehouse_commands.png" title="Create Warehouse Commands" />

3. Create the jaffle_shop.customers table and then copy the customers data from S3 into the customers table by following these commands:

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
	)
;
```

<Lightbox src="/img/snowflake_tutorial/create_customers_table.png" title="Create Customers Table" />

4. Create the jaffle_shop.orders table and then copy the orders data from S3 into the orders table by following these commands:

create table raw.jaffle_shop.orders
(
  id integer,
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
	)
;

<Lightbox src="/img/snowflake_tutorial/create_orders_table.png" title="Create Orders Table" />

5. Create the stripe schema, the payment table, and copy the payment data into the payment table by following these commands:

```sql
create schema raw.stripe;

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
	)
;
```

<Lightbox src="/img/snowflake_tutorial/create_payments_table.png" title="Create Payments Table" />

6. Great! Your data is loaded and ready to go. Just to make sure, run the following commands to query your data and confirm that you see an output for each one. 

```sql
select * from raw.jaffle_shop.customers;

select * from raw.jaffle_shop.orders;

select * from raw.stripe.payment;
```

Now we’re ready to set up dbt Cloud!

## Set up a project to connect dbt Cloud to Snowflake with Partner Connect

1. With your Snowflake account up and running with data, we’re ready to connect it with dbt Cloud. We’re going to use [Snowflake Partner Connect](https://docs.snowflake.com/en/user-guide/ecosystem-partner-connect.html) to set up your dbt Cloud account and project. Using Partner Connect will allow you to create a complete dbt account with your [Snowflake connection](https://docs.getdbt.com/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-your-database#connecting-to-snowflake), [a managed repository](https://docs.getdbt.com/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-using-a-managed-repository), [environments](https://docs.getdbt.com/docs/guides/managing-environments), and credentials. 

2. There’s a couple of ways you can access the Partner Connect page depending on if you’re navigating in the classic Snowflake UI or the new UI. 

a. If you’re using the classic version of the Snowflake UI, you can click the Partner Connect button in the top bar of your account.

<Lightbox src="/img/snowflake_tutorial/classic_partner_connect.png" title="Classic Partner Connect" />

From there, click on the dbt tile to open up the connect box. 

b. If you’re using the new web interface, you’ll want to click on your name in the upper left hand corner and then click on Partner Connect in the drop down menu.

<Lightbox src="/img/snowflake_tutorial/new_partner_connect.png" title="New Partner Connect" />

You can scroll down to find the dbt tile, or search for dbt in the search bar and it will float to the top. Click on the tile to open up the connect box.

<Lightbox src="/img/snowflake_tutorial/partner_connect_box.png" title="Partner Connect Box" />

3. Once you’ve clicked on the tile, a connection box will appear that will look slightly different depending on the route you took above, but will contain the same Optional Grant box towards the bottom. In both cases, you’ll want to type in or select the RAW and ANALYTICS databases. This will grant access for your new dbt user role to each database. 

Classic UI

<Lightbox src="/img/snowflake_tutorial/classic_connection_box.png" title="Classic Connection Box" />

New UI

<Lightbox src="/img/snowflake_tutorial/new_connection_box.png" title="New Connection Box" />

4. After you’ve entered the database names using either option above, click Connect. You should see a pop up window similar to the one of the options below. Click Activate.

Classic UI

<Lightbox src="/img/snowflake_tutorial/classic_activation_window.png" title="Classic Actviation Window" />

New UI

<Lightbox src="/img/snowflake_tutorial/new_activation_window.png" title="New Actviation Window" />

5. A new tab will be created that will take you to the dbt Cloud website. Here you’ll be asked to create an account name with password, as well as agree to the Terms of Service. Once that’s done, click Complete Registration.

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_account_info.png" title="dbt Cloud Account Info" />

6. Great! Your dbt Cloud account is now completely setup and connected to your Snowflake trial account with a [managed repository](https://docs.getdbt.com/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-using-a-managed-repository). You can skip to the "How to start developing in dbt Cloud" section to get started in the IDE. 

## Set up a project to connect dbt Cloud to Snowflake (without partner connect)

1. With your Snowflake account up and running with data, we’re ready to connect it with dbt Cloud. We’ll start by going to [https://cloud.getdbt.com/signup/](https://cloud.getdbt.com/signup/) to start the signup process. Fill out all the information and click Create my account.

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_account_registration.png" title="dbt Cloud Account Registration" />

2. Once your account is created you’ll get a verification email. When you click the ‘Verify Email Address’ button in the email you should be redirected to your new dbt Cloud account.

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_setup.png" title="dbt Cloud Setup" />

3. Clicking Continue will send you to start setting up the database connection. Click Snowflake.

<Lightbox src="/img/snowflake_tutorial/connect_snowflake.png" title="Connect Snowflake" />

4. To create the connection we’ll start by inputting the account information. Your account is going to be the url of your Snowflake trial account up to the period before snowflakecomputing.com. So, if this is the full url of my trial account: oq65696.west-us-2.azure.snowflakecomputing.com 
then the account will be: oq65696.west-us-2.azure

5. The role is optional and can be left blank for the purposes here, but this can be filled in with the role that you’d like dbt to assume when connecting. 

6. Enter ANALYTICS as the database name and TRANSFORMING as the warehouse name. We created this database and warehouse earlier in the setup when adding data to our warehouse. This tells dbt to create models in the ANALYTICS database and to use the TRANSFORMING warehouse when running queries and building models. After all this is entered, the Snowflake settings section should look something like this, with your trial url as the account:

<Lightbox src="/img/snowflake_tutorial/snowflake_settings.png" title="Snowflake Settings" />

7. We’ll create the connection with your Snowflake account using your username and password, which means we’ll use the Username & Password Auth Method. Enter in the username and password that were created when you started the Snowflake trial account. Note that the username is not your email address and is usually your first and last name together in one word. 

8. Leave the rest of the Development Credentials section as is. You’ll notice that the schema name has been auto created for you and is dbt_ followed by your first initial and last name. This is the schema connected directly to your development environment and is where your models will be built when running dbt within the Cloud IDE.

<Lightbox src="/img/snowflake_tutorial/development_credentials.png" title="Development Credentials" />

9. Scroll back to the top of the page and click test to test your connection with Snowflake. If it’s successful, you should see a green connection succeeded banner at the top of the page and you can click continue. If the connection is unsuccessful, you should see an error message returned to allow you to take action to resolve the issue specified by the error. Keep testing until you’re able to successfully create the connection. 

10. Now it’s time to create your Git repository. For this setup we’re going to stick with a dbt Cloud managed repository, but feel free to create your own repo and connect it to your git provider of choice if you’d like to manage it yourself. To create the managed repository, make sure that Managed is selected from the list of repos/options and then type in the name that you’d like to give the repo. Once complete, click create.

<Lightbox src="/img/snowflake_tutorial/setup_a_repo.png" title="Setup a Repo" />

It should take a few seconds to create the repo and once it’s complete you’ll see a Successfully imported repository message and you’ll be able to click Continue. 

11. You can skip the final step of inviting other users to your account and click Skip & Complete to finish the setup. You’ll be able to go back and add users at any point within your account. 

12. Congrats! Your account is officially set up and ready to rock. 

## Start developing in dbt Cloud

1. On the welcome page click Start Developing, which will take you to Cloud IDE.

<Lightbox src="/img/snowflake_tutorial/welcome_page.png" title="Welcome Page" />

2. After the Cloud IDE loads, click the "Initialize your project" button in the upper left hand corner of the screen to initialize and create the directory structure within your project.

<Lightbox src="/img/snowflake_tutorial/initialize_your_project.png" title="Initialize Your Project" />

3. Next you’ll want to commit all the newly created folders and files to your main branch. Click commit, enter a brief message, and then click commit again in the pop up window.

<Lightbox src="/img/snowflake_tutorial/click_commit.png" title="Click Commit" />

<Lightbox src="/img/snowflake_tutorial/write_commit_message.png" title="Write Commit Message" />

4. Next we’re going to make sure that you can query the data we loaded earlier from within the IDE. Enter the following code into a tab in the IDE and click preview to view the results:
select * from raw.jaffle_shop.customers

<Lightbox src="/img/snowflake_tutorial/preview_results.png" title="Preview Results" />

5. Alright, we’re ready to run our first dbt command. In the run bar at the bottom of the screen enter dbt run and click enter.

<Lightbox src="/img/snowflake_tutorial/dbt_run.png" title="dbt Run" />

When you expand the run bar you should see something similar to the below. This run should have created the two example models in your development schema in Snowflake. By clicking on each model you should see more details about each run in the drop down menu. Next, go into your trial Snowflake account and open up the ANALYTICS database. You should be able to see that your development schema was created by this run and within that schema both of the models that you just ran.

<Lightbox src="/img/snowflake_tutorial/run_results.png" title="Run Results" />

Awesome!  You are all set to leverage the power of dbt Cloud and Snowflake together.  As a recap, we just completed the following:

* Set up a Snowflake trial account

* Loaded training data into your Snowflake account

* Created a dbt Cloud account, either through Partner Connect or through the account flow

* Connected dbt Cloud and Snowflake

* Set up the dbt Cloud IDE, queried data, and did your first dbt run
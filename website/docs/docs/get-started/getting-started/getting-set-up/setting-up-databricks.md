---
title: "Set up and connect Databricks"
id: setting-up-databricks
description: "Set up Databricks with sample data and connect to dbt Cloud."
sidebar_label: "Set up and connect Databricks"
pagination_prev: docs/get-started/getting-started/set-up-dbt-cloud
pagination_next: docs/get-started/getting-started/building-your-first-project/build-your-first-models
---

## Introduction

For the Databricks project in the getting started guide, you'll learn how to set up Databricks and connect it to dbt Cloud.

This project will walk you through:

- Setting up a Databricks account
- Loading training data into your Databricks account
- Configuring a SQL endpoint in Databricks
- Connecting dbt Cloud and Databricks

## Prerequisites

Before starting this tutorial, you will need the following:

- Existing Cloud Provider account (AWS, GCP, Azure).
- Permissions to create an S3 bucket in said account.

## Setting up

1. Use your existing account or sign up for a Databricks account at [Try Databricks](https://databricks.com/). Complete the form with your user information.
    
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/signup_form.png" title="Sign up for Databricks" />
    </div>

2. For the purpose of this tutorial, you will be selecting AWS as our cloud provider but if you use Azure or GCP internally, please choose one of them. The setup process will be similar.
3. Check your email to complete the verification process.
4. After setting up your password, you will be guided to choose a subscription plan. You will need to select either the `Premium` or `Enterprise` plan to access the SQL Compute functionality, required for using the SQL Endpoint for dbt. We have chosen `Premium` for this tutorial. Click `Continue` after selecting your plan.
    
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/choose_plan.png" title="Choose Databricks Plan" />
    </div>

5. Click on `Get Started` when you come to this below page and then `Confirm` after you validate that you have everything needed.

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/validate_1.png" />
    </div>
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/validate_2.png" />
    </div>

6. Now it's time to create your first workspace. A Databricks workspace is an environment for accessing all of your Databricks assets. The workspace organizes objects like notebooks, SQL Endpoints, clusters, etc into one place.  Provide the name of your workspace and choose the appropriate AWS region and click **Start Quickstart**. You might get the checkbox of `I have data in S3 that I want to query with Databricks`. You do not need to check this off for the purpose of this tutorial. 

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/setup_first_workspace.png" title="Setup First Workspace" />
    </div>

7. By clicking on `Start Quickstart`, you will be redirected to AWS and asked to log in if you haven’t already. After logging in, you should see a page similar to this. 

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/quick_create_stack.png" title="Create AWS resources" />
    </div>

:::tip
If you get a session error and don’t get redirected to this page, do not worry, go back to the Databricks UI and create a workspace from the interface. All you have to do is click **create workspaces**, choose the quickstart, fill out the form and click **Start Quickstart**.
:::

8. There is no need to change any of the pre-filled out fields in the Parameters. Just add in your Databricks password under **Databricks Account Credentials**.  Check off the Acknowledgement and click **Create stack**.   
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/parameters.png" title="Parameters" />
    </div>    

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/create_stack.png" title="Capabilities" />
    </div>    
9. Afterwards, you should land on the CloudFormation > Stacks page. Once the status becomes `CREATE_COMPLETE`, you will be ready to start. This process can take about 5 minutes so feel free to click refresh to refresh the status updates.     
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/stack_status.png" title="Confirm Status Completion" />
    </div>
10. Go back to the Databricks tab. You should see that your workspace is ready to use.
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/workspaces.png" title="A Databricks Workspace" />
    </div>
11. Now let’s jump into the workspace. Click on `Open` and log into the workspace using the same login as you used to log into the account. 

Congrats! You are now ready to start working in the workspace.
<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/databricks_tutorial/images/welcome_page.png" title="Welcome to the Databricks Workspace" />
</div>

## Loading data

Our next step is to load some data to transform. Luckily for us, Databricks makes it really easy for us to upload data.

1. First we need a SQL endpoint. Find the drop down menu and toggle into the SQL space.
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/go_to_sql.png" title="SQL space" />
    </div>
2. We will be setting up a SQL endpoint now.  Select `SQL Endpoints` from the left hand side console.  You will see that a default SQL Endpoint exists.  
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/sql_endpoints.png" title="SQL Endpoints" />
    </div>
3. Click **Start** on the Starter Endpoint.  This will take a few minutes to get the necessary resources spun up.

4. While you're waiting, download the three CSV files locally that you will need for this tutorial. You can find them here:
    - [jaffle_shop_customers.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_customers.csv)
    - [jaffle_shop_orders.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_orders.csv)
    - [stripe_payments.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/stripe_payments.csv)

5. Once the SQL Endpoint is up, click on the `Create` and then `Table` on the drop down menu. 
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/create_table_using_databricks_SQL.png" title="Create Table Using Databricks SQL" />
    </div>

6. Let's load the Jaffle Shop Customers data first. Drop in the `jaffle_shop_customers.csv` file into the UI.
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/databricks_table_loader.png" title="Databricks Table Loader" />
    </div>

7. Update the Table Attributes at the top:

    - <b>data_catalog</b> = hive_metastore
    - <b>database</b> = default 
    - <b>table</b> = jaffle_shop_customers
    - Make sure that the column data types are correct. The way you can do this is by hovering over the datatype icon next to the column name. 
        - <b>ID</b> = bigint
        - <b>FIRST_NAME</b> = string
        - <b>LAST_NAME</b> = string

    <div style={{maxWidth: '600px'}}>
    <Lightbox src="/img/databricks_tutorial/images/jaffle_shop_customers_upload.png" title="Load jaffle shop customers" />
    </div>

8. Click `Create` on the bottom once you’re done. 

9. Now let’s do the same for `Jaffle Shop Orders` and `Stripe Payments`. 

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/jaffle_shop_orders_upload.png" title="Load jaffle shop orders" />
    </div>

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/stripe_payments_upload.png" title="Load stripe payments" />
    </div>
    
10. Once that's done, make sure you can query the training data.  Navigate to the `SQL Editor` through the left hand menu.  This will bring you to a query editor.
11. Ensure that you can run a `select *` from each of the tables with the following code snippets. 

    ```sql
    select * from default.jaffle_shop_customers
    select * from default.jaffle_shop_orders
    select * from default.stripe_payments
    ```

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/query_check.png" title="Query Check" />
    </div>

12. To ensure any users who might be working on your dbt project has access to your object, run this command.

    ```sql 
    grant all privileges on schema default to users;
    ```    
    
Congratulations! At this point, you have created a Databricks account, loaded training data, and successfully set up a SQL end point to query the data.  

## Connecting to dbt Cloud

 There are two ways to connect dbt Cloud and Databricks. The first option is Partner Connect, which provides a streamlined setup to create your dbt Cloud account from within your new Databricks trial account. The second option is to create your dbt Cloud account separately and build the Databricks connection yourself. If you are looking to get started quickly, we recommend option 1. If you are looking to customize your setup from the very beginning and gain familiarity with the dbt Cloud setup flow, we recommend option 2.

### Option 1: Connect dbt Cloud and Databricks with partner connect

1. In the Databricks workspace, on the left-side console: click on `Partner Connect`. 

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/databricks_partner_connect.png" title="Databricks Partner Connect" />
    </div>

2. Select the dbt tile under `Data preparation and transformation`.
3. Click on `Next` when prompted to `Connect to partner`. This action will create a service principal, PAT token for that service principle, and SQL Endpoint for the dbt Cloud account to use. This does mean that you will have two SQL Endpoints at your disposal from the previous step and from using Partner Connect.

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/databricks_connect_to_partner.png" title="Databricks Partner Connect Connect to dbt Cloud" />
    </div>


4. Click on `Connect to dbt Cloud`.
<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/databricks_tutorial/images/databricks_connect_to_dbt_cloud.png" title="Databricks Partner Connect Connect to dbt Cloud" />
</div>
5. After the new tab loads, you will see a form. If you already created a dbt Cloud account, you will be asked to provide an account name. If you haven't created account, you will be asked to provide an account name and password. 

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/databricks_partner_connect_create_account.png" title="Databricks Partner Connect Connect to dbt Cloud" />
    </div>

6. After you have filled out the form and clicked on `Complete Registration`, you will be logged into dbt Cloud automatically. 


### Option 2: Connect dbt Cloud and Databricks manually

#### Get endpoint and token information

To manually setup dbt Cloud, you will need the SQL Endpoint connection information and to generate a user token. You can find your SQL endpoint connection information by going to the `Databricks UI > SQL > SQL Endpoints > Starter Endpoint > Connection details`. Save this information because you will need it later.

<Lightbox src="/img/databricks_tutorial/images/SQL_Endpoint_Details.png" title="Databrick SQL Endpoint Connection Information" />

To generate a user token for your development credentials in dbt Cloud, click on `Settings` on the left side console (while still in the SQL part of the workspace). Click on `Personal Access Token` and provide a comment like `dbt Cloud development`. Save the token information somewhere because you will need it for the next part. 
<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/databricks_tutorial/images/Generate_user_token.png" title="Generate User Token" />
</div>

#### Create a dbt Cloud account

<Snippet src="tutorial-create-new-dbt-cloud-account" />

#### Connect dbt Cloud to Databricks

1. Choose **Databricks** to setup your connection.
    <Lightbox src="/img/databricks_tutorial/images/dbt_cloud_setup_databricks_connection_start.png" title="dbt Cloud - Choose Databricks Connection" />
    
2. For the name, write `Databricks` or another simple title.    
3. For Databricks settings, reference your SQL endpoint connection details from step 6 of the previous section for each of the following fields:

    - Method will be ODBC
    - Hostname comes from Server hostname
    - Endpoint comes from the last part of HTTP path after `/endpoints`
      <div style={{maxWidth: '400px'}}>
      <Lightbox src="/img/databricks_tutorial/images/dbt_cloud_setup_databricks_connection_details.png" title="dbt Cloud - Databricks Workspace Settings" />
      </div>

4. For your Development Credentials, type:

    - `User` and `token` that you saved in a previous step.
    - You’ll notice that the schema name has been auto created for you. By convention, this is `dbt_<first-initial><last-name>`. This is the schema connected directly to your development environment, and it's where your models will be built when running dbt within the Cloud IDE.

5. Click **Test Connection** at the bottom. This verifies that dbt Cloud can access your Databricks workspace.
6. If the connection test succeeds, click **Next**. If it fails, you may need to check your Databricks settings and credentials.

## Initialize your repository and start development

If you used Partner Connect, you can skip to [initializing your dbt project](/setting-up-databricks#initialize-your-dbt-project) as the Partner Connect provides you with a managed repository. Otherwise, you will need to create your managed repository connection. 

### Setting up a managed repository

<Snippet src="tutorial-managed-repo" />

### Initialize your dbt project

<Snippet src="tutorial-initiate-project" />

Congratulations! You have successfully completed the following:

- Set up a Databricks account
- Loaded training data into your Databricks account
- Configured a SQL endpoint in Databricks
- Connected dbt Cloud and Databricks

## Next steps

<Snippet src="tutorial-next-steps-setting-up" />

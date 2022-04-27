---
title: "Set up and connect Databricks"
id: setting-up-databricks
description: "Set up Databricks with sample data and connect to dbt Cloud."
sidebar_label: "Set up and connect Databricks"
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
- Permissions to create S3 bucket in said account.

## Setting up


1. Use your existing account or sign up for a Databricks account at [Try Databricks](https://databricks.com/). Complete the form with your user information.

    <Lightbox src="/img/databricks_tutorial/images/signup_form.png" title="Sign up for Databricks" />

2. For the purpose of this tutorial, we will be selecting AWS as our cloud provider but if you use Azure or GCP internally, please choose one of them. The setup process will be similar. 

3. Check your email to complete the verification process. 

4. After setting up your password, you will be guided to choose a subscription plan. You will need to select either the `Premium` or `Enterprise` plan to access the SQL Compute functionality, required for using the SQL Endpoint for dbt. We have chosen `Premium` for this tutorial. Click `Continue` after selecting your plan. 

    <Lightbox src="/img/databricks_tutorial/images/choose_plan.png" title="Choose Databricks Plan" />

5. Click on `Get Started` when you come to this below page and then `Confirm` after you validate that you have everything needed.

    <Lightbox src="/img/databricks_tutorial/images/validate_1.png" />
    
    <Lightbox src="/img/databricks_tutorial/images/validate_2.png" />

6. Now it's time to create your first workspace. 

A Databricks workspace is an environment for accessing all of your Databricks assets. The workspace organizes objects like notebooks, SQL Endpoints, clusters, etc into one place. 

Provide the name of your workspace and choose the appropriate AWS region and click on `Start Quickstart`. You might get the checkbox of `I have data in S3 that I want to query with Databricks`. You do not need to check this off for the purpose of this tutorial. 

<Lightbox src="/img/databricks_tutorial/images/setup_first_workspace.png" title="Setup First Workspace" />



7. By clicking on `Start Quickstart`, you will be redirected to AWS and asked to log in if you haven’t already. After logging in, you should see a page similar to this. 

    <Lightbox src="/img/databricks_tutorial/images/quick_create_stack.png" title="Create AWS resources" />

*Tip:* If you get a session error and don’t get redirected to this page, do not worry, go back to the Databricks UI and create a workspace from the interface. All you have to do is click on `create workspaces`, choose the quickstart, fill out the form and click on `Start Quickstart`. 

8. There is no need to change any of the pre-filled out fields in the Parameters. Just add in your Databricks password under `Databricks Account Credentials` 

    <Lightbox src="/img/databricks_tutorial/images/parameters.png" title="Parameters" />
    
9. Check off the Acknowledgement and click `Create stack`.     
    
    <Lightbox src="/img/databricks_tutorial/images/create_stack.png" title="Capabilities" />
    
10. Afterwards, you should land on the `CloudFormation > Stacks` page. Once the status becomes `CREATE_COMPLETE`, you shall be ready to start. This process can take about 5 minutes so feel free to click on refresh to refresh the status updates. 

    <Lightbox src="/img/databricks_tutorial/images/stack_status.png" title="Confirm Status Completion" />

11. Go back to the Databricks tab. You should see that your workspace is ready to use.

    <Lightbox src="/img/databricks_tutorial/images/workspaces.png" title="A Databricks Workspace" />

12. Now let’s jump into the workspace. Click on `Open` and log into the workspace using the same login as you used to log into the account. 

13. Congrats! You are now ready to start working in the workspace.

    <Lightbox src="/img/databricks_tutorial/images/welcome_page.png" title="Welcome to the Databricks Workspace" />

14. Next up, we will need a cluster for our training. 

Spark cluster is going to be your compution resource for running your analytics workloads. We will be using it to run our queries. 

Hovering over the Databricks logo on the left, you will see a left hand side console. Click on `Compute` and you will see the clusters at your disposal. For this tutorial, we will be using the starter cluster that comes with our workspace but you can always create your own. 

Ghosting your pointer over the space under `Actions` of your starter cluster, click on the play button. Confirm that you do want to start up the cluster.'

<Lightbox src="/img/databricks_tutorial/images/start_cluster.png" title="Start the Cluster" />

If you ever want to edit the cluster in terms of the name of the cluster and resources allocated, you can click on the cluster name and the `Edit` button. Please note that you cannot edit the cluster when it is starting up or running.

## Loading data

Our next step is to load some data to transform. Luckily for us, Databricks makes it really easy for us to upload data. 

1. Download the three csv files locally that you will need for this tutorial. You can find them here:

- [jaffle_shop_customers.csv](http://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_customers.csv)
- [jaffle_shop_orders.csv](http://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_orders.csv)
- [stripe_payments.csv](http://dbt-tutorial-public.s3-us-west-2.amazonaws.com/stripe_payments.csv)


2. In your workspace, go to `Data` on the left side console. You should still be in the “Data Science & Engineering” part of the workspace. 

3. Click on `Create Table`. You should see that you have one database named `default`. This is where we will be loading our data into.

    <Lightbox src="/img/databricks_tutorial/images/create_table_upload.png" title="Create Table in Databricks" />
    
4. Now let's upload our first csv. Drag and drop the `jaffle_shop_customers.csv` file into the UI. 


<Lightbox src="/img/databricks_tutorial/images/create_new_table.png" title="Upload csv file" />

5. Click on `Create Table with UI` and then select your cluster from the dropdown of available clusters. Click `Preview Table`.

    <Lightbox src="/img/databricks_tutorial/images/select_cluster_to_preview_table.png" title="Select Cluster to Preview Table" />

6. Update the Table Attributes:
- Change the table name to `jaffle_shop_customers`
- Check off the `First row is header`. 
- Check off `Infer schema`
- Click on `Create Table` when you are done.

7. Congrats you have successfully uploaded your first table! 

    <Lightbox src="/img/databricks_tutorial/images/new_table_created.png" title="Jaffle Shop Customers table" />
    
8. Now let’s do the same for `Jaffle Shop Orders` and `Stripe Payments` by clicking on the Data tab on the left hand console. The end result will be three tables in the default database. While updating the table attributes, follow the same directions as in Step 6.

    <Lightbox src="/img/databricks_tutorial/images/raw_tables_created.png" title="Raw Data Tables" />

## Enable a SQL endpoint for Databricks

For dbt to connect to the most optimized SQL experience in Databricks, we need to create an SQL Endpoint for our connection.

1. Up to this point, we have been working in the Data Science & Engineering space. Now we need to change over to SQL.  Find the drop down menu and toggle into the SQL space.

<Lightbox src="/img/databricks_tutorial/images/go_to_sql.png" title="SQL space" />

2. We will be setting up a SQL endpoint now.  Select `SQL Endpoints` from the left hand side console.  You will see that a default SQL Endpoint exists.  

<Lightbox src="/img/databricks_tutorial/images/sql_endpoints.png" title="SQL Endpoints" />

3. Click `Start` on the Starter Endpoint.  This will take a few minutes to get the necessary resources spun up.

4. Once that's done, let’s ensure that we can query the training data that we loaded earlier.  Navigate back to the SQL space through the left hand menu and choose `SQL Editor`.  This will bring you to a query editor.

5. Ensure that you can run a select * from each of the tables with the following code snippets. 

```sql
select * from default.jaffle_shop_customers
```

```sql
select * from default.jaffle_shop_orders
```

```sql
select * from stripe.payments
```

<Lightbox src="/img/databricks_tutorial/images/query_check.png" title="Query Check" />

6. To get setup in dbt Cloud, you will now need to get the SQL Endpoint connection information and generate a user token. 

You can find your SQL endpoint connection information by going to the `Databricks UI > SQL > SQL Endpoints > Starter Endpoint > Connection details`. Save this information or keep this window open for the next section.

<Lightbox src="/img/databricks_tutorial/images/SQL_Endpoint_Details.png" title="Databrick SQL Endpoint Connection Information" />

7. To generate a user token for your development credentials in dbt Cloud, click on `Settings` on the left side console (while still in the SQL part of the workspace). Click on `Personal Access Token` and provide a comment like `dbt Cloud development`. Save the token information somewhere because you will need it for the next part. 

<Lightbox src="/img/databricks_tutorial/images/Generate_user_token.png" title="Generate User Token" />

Congratulations! At this point, you have created a Databricks account, loaded training data, and successfully set up a SQL end point to query the data.  

## Connecting to dbt Cloud

Now it’s time to connect to dbt Cloud to Databricks in order to develop your dbt Project. 

If you don't have an existing dbt Cloud account, you can [sign up for a dbt Cloud trial account here](https://www.getdbt.com/signup/). If you already have a dbt Cloud account, you can create a new project in your existing account.  In this tutorial, we will be using the Set Up project workflow for new users.  This can easily be adapted for additional projects to an existing account.

1. Log into dbt Cloud in a new window. Once you have logged into your new account and validated your email, you will see our Project Setup Flow with the page Set up “Analytics”.  Click `Continue`. 

<Lightbox src="/img/databricks_tutorial/images/setup_flow_dbt_cloud.png" title="dbt Cloud Set Up Flow" />

2. Choose `Databricks` on the Set Up a Database Connection page. 

<Lightbox src="/img/databricks_tutorial/images/setup_database_connection.png" title="Databrick Connection" />

3. Configure your connection to Databricks this way: 

    a. For the name, write `Databricks` or another simple title.
    
    b. For Databricks settings, reference your SQL endpoint connection details from step 6 of the previous section for each of the following fields:
    
    <ul>
        <li> Method will be ODBC</li>
        <li> Hostname comes from Server hostname</li>
        <li> Endpoint comes from the last part of HTTP path after `/endpoints`</li>
     </ul>
     
     c. For your Development Credentials, input:
    
    
     - `User` input `token` from Step 7 of the previous section 
     - For the schema field, choose a development schema (this will be your default development database to build objects into).  We recommend something in the form of dbt_{{ first initial, last name}} like `dbt_achen`.
     

 <Lightbox src="/img/databricks_tutorial/images/setup_databricks_connect.png" title="Databrick Connection" />
 
 
4. Then scroll to the top of the page to test your connection. Once successful, click `Continue`.

5. On the next page, we will `Set up a Repository`.  For training purposes, we recommend selecting a managed repo and entering your first initial, last name for the repository name.  `Create` your repository and select `Continue`.

6. Now you can start developing!  Open the left hand hamburger menu in dbt Cloud and choose `Develop`.  This will load up the dbt Cloud IDE.  

7. In the upper left hand corner, select `initialize your project`.  This will set up the folder structure for your dbt Project.  Then select `commit` to initialize your repo with the commit message `Initial Commit`.  Create a new branch with the title `start-dbt-fundamentals`.  Your UI should look like this.

 <Lightbox src="/img/databricks_tutorial/images/IDE.png" title="dbt Cloud IDE" />
 
 8. Finally, let’s make sure everything is connected correctly.  In the `Statement 1` tab, type the following code: 
 
```sql 
select * from jaffle_shop_orders
```

Click on `Preview` and you should see the same results as you saw earlier when you queried the table directly in Databricks SQL editor.


 <Lightbox src="/img/databricks_tutorial/images/preview_query.png" title="Preview Query" />

9. Now to make sure your dbt project can run, in the command line below, type in `dbt run`. 

 <Lightbox src="/img/databricks_tutorial/images/dbt_run.png" title="Test out dbt run" />
 
 You can click on the tab to expand to see 
 
 <Lightbox src="/img/databricks_tutorial/images/dbt_run_status.png" title="dbt Run status" />
 
### Create dbt Cloud account

<Snippet src="tutorial-create-new-dbt-cloud-account" />

### Enter connection credentials


Congratulations! You have successfully completed the following:

- Set up a Databricks account
- Loaded training data into your Databricks account
- Configured a SQL endpoint in Databricks
- Connected dbt Cloud and Databricks
## Next steps

<Snippet src="tutorial-next-steps-setting-up" />

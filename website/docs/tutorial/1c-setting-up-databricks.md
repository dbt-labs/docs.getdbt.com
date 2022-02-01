---
title: Setting up with Databricks
id: setting-up-databricks
---

This guide is under construction

## Prerequeistics 

Before starting this tutorial, you will need the following:

- Existing Cloud Provider account (AWS, GCP, Azure)
- Permissions to create S3 bucket in said account

## Setting up Databricks 

For this tutorial, you are going to need a Databricks account. 

1. You can sign up by clicking [Try Databricks](https://databricks.com/) on the Databricks homepage. Fill out the form with your user information. 

    <Lightbox src="/img/databricks_tutorial/images/signup_form.png" title="Sign up for Databricks" />

2. For the purpose of this tutorial, we will be selecting AWS as our cloud provider but if you use Azure or GCP internally, feel free to choose one of those. The setup process will be similar. 

3. Check your email to complete the verification process. 

4. After setting up your password, you will be guided to choose a subscription plan. You will need to select either the Premium or Enterprise plan to access the SQL Compute functionality, required for running dbt on Databricks. We have chosen `Premium` for this tutorial. Click `Continue` after selecting your plan. 

    <Lightbox src="/img/databricks_tutorial/images/choose_plan.png" title="Choose Databricks Plan" />

5. Click on `Get Started` when you come to this below page and then confirm after you validate that you have everything needed.

    <Lightbox src="/img/databricks_tutorial/images/validate_1.png" title="Click Get Started"/>
    
    <Lightbox src="/img/databricks_tutorial/images/validate_2.png" title="Click Get Started"/>

6. Now it's time to create your first workspace. A Databricks workspace is an environment for accessing all of your Databricks assets. The workspace organizes objects like notebooks, SQL Endpoints, clusters, etc into one place. 

Provide the name of your workspace and choose the appropriate AWS region and click on `Start Quickstart`. You might get the checkbox of `I have data in S3 that I want to query with Databricks`. You do not need to check this off for the purpose of our tutorial. 

    <Lightbox src="/img/databricks_tutorial/images/setup_first_workspace.png" title="Setup Workspace" />

7. By clicking on `Start Quickstart`, you will be redirected to AWS and ask you to log in if you haven’t already. After logging in, go back to the Databricks workspace. You should see a page similar to this. 

    <Lightbox src="/img/databricks_tutorial/images/quick_create_stack.png" title="Create AWS resources" />

*Tip:* If you get a session error and don’t get redirected to this page, do not worry, you can create a workspace from the interface. All you have to do is click on create workspaces, choose the quickstart, fill out the form and click on Start Quickstart. 

8. There is no need to change any of the pre-filled out fields in the Parameters. Just add in your Databricks password under `Databricks Account Credentials` 

    <Lightbox src="/img/databricks_tutorial/images/parameters.png" title="Parameters" />
    
9. Check off the Acknowledgement and click `Create stack`.     
    
    <Lightbox src="/img/databricks_tutorial/images/create_stack.png" title="Parameters" />
    
10. You should land on the `CloudFormation > Stacks` page. Once the status becomes `CREATE_COMPLETE`, you shall be ready to start. This process can take about 5 minutes so feel free to click on refresh to refresh the status updates. Afterward, go back to the Databricks tab.  

    <Lightbox src="/img/databricks_tutorial/images/stack_status.png" title="Confirm Status Completion" />

11. You should see that your workspace is ready to use.

    <Lightbox src="/img/databricks_tutorial/images/workspaces.png" title="A Databricks Workspace" />

12. Now let’s jump into the workspace. Click on `Open` and log into the workspace using the same login as you used to log into the account. 

13. Congrats! You are now ready to start working in the workspace.

    <Lightbox src="/img/databricks_tutorial/images/welcome_page.png" title="Welcome to Databricks Workspace" />

14. Next up, we will need a cluster for our training. Spark cluster is going to be your compution resource for running your analytics workloads. We will be using it to run our queries. 

Ghosting over the Databricks logo on the left, you will see a left hand side console. Click on `Compute` and you will see the clusters at your disposal. For this tutorial, we will be using the starter cluster that comes with our workspace but you can always create your own. 

Ghosting your pointer over the space under `Actions`, click on the play button. Confirm that you do want to start up the cluster.

    <Lightbox src="/img/databricks_tutorial/images/start_cluster.png" title="Start the Cluster" />

If you ever want to edit the cluster in terms of the name of the cluster and resources alocated, you can click on the cluster name and the 'Edit' button. Please note that you cannot edit the cluster when it is starting up or running. 

## Loading sample data into Databricks

Before we get started on the tutorial, we will need some data to transform. Luckily for us, Databricks makes it really easy for us to upload data. 

1. Download the following csv files locally that you will need for this tutorial. You can find them here:

- [Jaffle Shop Orders](http://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_orders.csv)

- [Jaffle Shop Customers](http://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_customers.csv)

- [Stripe Payments](http://dbt-tutorial-public.s3-us-west-2.amazonaws.com/stripe_payments.csv)


2. In your workspace, go to `Data` on the left side console. You should still be in the “Data Science & Engineering” part of the workspace. 

3. Click on Create Table. You should see that you have one database named default. This is where we will be loading our data into.

    <Lightbox src="/img/databricks_tutorial/images/create_table_upload.png" title="Create Table in Databricks" />
    
4. Now let's upload our first csv. Drag and drop the `jaffle_shop_customers.csv` file into the UI. 


    <Lightbox src="/img/databricks_tutorial/images/create_new_table.png" title="Upload csv file" />

5. Click on `Create Table with UI` and then select your cluster from the dropdown of available clusters. Click “Preview Table”.

    <Lightbox src="/img/databricks_tutorial/images/select_cluster_to_preview_table.png.png" title="Select Cluster to Preview Table" />


6. Update the Table Attributes:
- Change the table name to `jaffle_shop_customers`
- Check off the `First row is header`. 
- Check off “Infer schema”
- Click on “Create Table” when you are done.

7. Congrats you have successfully uploaded your first table! 

    <Lightbox src="/img/databricks_tutorial/images/new_table_created.png" title="Jaffle Shop Customers table" />
    
8. Now let’s do the same for `Jaffle Shop Orders` and `Stripe Payments` by clicking on the Data tab on the left hand console. The end result will be three tables in the default database. While updating the table attributes, follow the same directions as in Step 6 with the following renaming:

- Stripe Payments = `stripe_payments` 

- Jaffle Shop Orders = `jaffle_shop_orders`

    <Lightbox src="/img/databricks_tutorial/images/raw_tables_created.png" title="Raw Data Tables" />

## Enable a SQL endpoint for Databricks

Now let’s get started with your SQL endpoint.

1. Up to this point, we have been working in the Data Science & Engineering space.  Find the drop down menu and toggle into the SQL space.

<Lightbox src="/img/databricks_tutorial/images/go_to_sql.png" title="SQL space" />

2. We will be setting up a SQL endpoint now.  Select `SQL Endpoints` from the left hand side.  You will see that a default SQL Endpoint exists.  

<Lightbox src="/img/databricks_tutorial/images/sql_endpoint.png" title="SQL Endpoints" />

3. Click `Start` on the Starter Endpoint.  This will take a few minutes to get the necessary resources spun up.

4. Now, let’s ensure that we can query the training data that we loaded earlier.  Navigate back to the SQL space through the left hand menu and choose `SQL Editor`.  This will bring you to a query editor like this:

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


Congratulations! At this point, you have created a Databricks account, loaded training data, and successfully set up a SQL end point to query the data.  In the next section, we will walk through the next steps to connect dbt Cloud and Databricks.

## Set up a project to connect dbt Cloud to Databricks

Now it’s time to connect to dbt Cloud to Databricks in order to develop your dbt Project. 

If you haven’t already, navigate to dbt Cloud and create a new account. If you already have a dbt Cloud account, you can create a new project in your existing account.  In this tutorial, we will be using the Set Up project workflow for new users.  This can easily be adapted for additional projects to an existing account.


1. Let’s go over to dbt Cloud.  In the suitcase project dropdown at the top, click “Create a new account…”. Add a “COMPANY NAME”. As soon as you create a new account, you will be created with the Project Setup Flow, Set up “Analytics”.  Click”Continue”.



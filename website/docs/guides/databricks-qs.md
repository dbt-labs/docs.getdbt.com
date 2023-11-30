---
title: "Quickstart for dbt Cloud and Databricks"
id: "databricks"
level: 'Beginner'
icon: 'databricks'
hide_table_of_contents: true
recently_updated: true
tags: ['dbt Cloud', 'Quickstart','Databricks']
---
## Introduction

In this quickstart guide, you'll learn how to use dbt Cloud with Databricks. It will show you how to: 

- Create a Databricks workspace.
- Load sample data into your Databricks account.
- Connect dbt Cloud to Databricks.
- Take a sample query and turn it into a model in your dbt project. A model in dbt is a select statement.
- Add tests to your models.
- Document your models.
- Schedule a job to run.

:::tip Videos for you
You can check out [dbt Fundamentals](https://courses.getdbt.com/courses/fundamentals) for free if you're interested in course learning with videos.

:::

### Prerequisites​

- You have a [dbt Cloud account](https://www.getdbt.com/signup/). 
- You have an account with a cloud service provider (such as AWS, GCP, and Azure) and have permissions to create an S3 bucket with this account. For demonstrative purposes, this guide uses AWS as the cloud service provider.

### Related content

- Learn more with [dbt Courses](https://courses.getdbt.com/collections)
- [CI jobs](/docs/deploy/continuous-integration)
- [Deploy jobs](/docs/deploy/deploy-jobs)
- [Job notifications](/docs/deploy/job-notifications)
- [Source freshness](/docs/deploy/source-freshness)

## Create a Databricks workspace

1. Use your existing account or sign up for a Databricks account at [Try Databricks](https://databricks.com/). Complete the form with your user information.
    
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/signup_form.png" title="Sign up for Databricks" />
    </div>

2. For the purpose of this tutorial, you will be selecting AWS as our cloud provider but if you use Azure or GCP internally, please choose one of them. The setup process will be similar.
3. Check your email to complete the verification process.
4. After setting up your password, you will be guided to choose a subscription plan. Select the `Premium` or `Enterprise` plan to access the SQL Compute functionality required for using the SQL warehouse for dbt. We have chosen `Premium` for this tutorial. Click **Continue** after selecting your plan.
    
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/choose_plan.png" title="Choose Databricks Plan" />
    </div>

5. Click **Get Started** when you come to this below page and then **Confirm** after you validate that you have everything needed.

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/validate_1.png" />
    </div>
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/validate_2.png" />
    </div>

6. Now it's time to create your first workspace. A Databricks workspace is an environment for accessing all of your Databricks assets. The workspace organizes objects like notebooks, SQL warehouses, clusters, etc into one place.  Provide the name of your workspace and choose the appropriate AWS region and click **Start Quickstart**. You might get the checkbox of **I have data in S3 that I want to query with Databricks**. You do not need to check this off for the purpose of this tutorial. 

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/setup_first_workspace.png" title="Setup First Workspace" />
    </div>

7. By clicking on `Start Quickstart`, you will be redirected to AWS and asked to log in if you haven’t already. After logging in, you should see a page similar to this. 

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/quick_create_stack.png" title="Create AWS resources" />
    </div>

:::tip
If you get a session error and don’t get redirected to this page, you can go back to the Databricks UI and create a workspace from the interface. All you have to do is click **create workspaces**, choose the quickstart, fill out the form and click **Start Quickstart**.
:::

8. There is no need to change any of the pre-filled out fields in the Parameters. Just add in your Databricks password under **Databricks Account Credentials**.  Check off the Acknowledgement and click **Create stack**.   
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/parameters.png" title="Parameters" />
    </div>    

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/create_stack.png" title="Capabilities" />
    </div>    

10. Go back to the Databricks tab. You should see that your workspace is ready to use.
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/workspaces.png" title="A Databricks Workspace" />
    </div>
11. Now let’s jump into the workspace. Click **Open** and log into the workspace using the same login as you used to log into the account. 

## Load data

1. Download these CSV files (the Jaffle Shop sample data) that you will need for this guide:
    - [jaffle_shop_customers.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_customers.csv)
    - [jaffle_shop_orders.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_orders.csv)
    - [stripe_payments.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/stripe_payments.csv)

2. First we need a SQL warehouse. Find the drop down menu and toggle into the SQL space.
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/go_to_sql.png" title="SQL space" />
    </div>
3. We will be setting up a SQL warehouse now.  Select **SQL Warehouses** from the left hand side console.  You will see that a default SQL Warehouse exists.  

4. Click **Start** on the Starter Warehouse.  This will take a few minutes to get the necessary resources spun up.

5. Once the SQL Warehouse is up, click **New** and then **File upload** on the dropdown menu. 
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/new_file_upload_using_databricks_SQL.png" title="New File Upload Using Databricks SQL" />
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

8. Click **Create** on the bottom once you’re done. 

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

## Connect dbt Cloud to Databricks

There are two ways to connect dbt Cloud to Databricks. The first option is Partner Connect, which provides a streamlined setup to create your dbt Cloud account from within your new Databricks trial account. The second option is to create your dbt Cloud account separately and build the Databricks connection yourself (connect manually). If you want to get started quickly, dbt Labs recommends using Partner Connect. If you want to customize your setup from the very beginning and gain familiarity with the dbt Cloud setup flow, dbt Labs recommends connecting manually.

This quickstart assumes you'll use Partner Connect.

:::tip
 Partner Connect is intended for trial partner accounts. If your organization already has a dbt account, you should connect manually. Refer to [Connect to dbt Cloud manually](https://docs.databricks.com/partners/prep/dbt-cloud.html#connect-to-dbt-cloud-manually) in the Databricks docs for instructions.
:::

To connect dbt Cloud to Databricks using Partner Connect, do the following:

1. In the sidebar, click **Partner Connect**.

2. Click the dbt tile.

3. Select a catalog for dbt to write to, and then click **Next**. The drop-down list displays catalogs you own or have access to. If your workspace isn't <UC>-enabled, the legacy Hive metastore (`hive_metastore`) is used.

5. If there are SQL warehouses in your workspace, select a SQL warehouse from the drop-down list. If your SQL warehouse is stopped, click **Start**.

6. If there are no SQL warehouses in your workspace, do the following:

   a. Click **Create warehouse**. A new tab opens in your browser that displays the **New SQL Warehouse** page in the Databricks SQL UI.
   #. Follow the steps in [Create a SQL warehouse](https://docs.databricks.com/en/sql/admin/create-sql-warehouse.html#create-a-sql-warehouse) in the Databricks docs.
   #. Return to the Partner Connect tab in your browser, and then close the dbt tile.
   #. Re-open the dbt tile.
   #. Select the SQL warehouse you just created from the drop-down list.

7. Select a schema from the drop-down list, and then click **Add**. The drop-down list displays schemas you own or have access to. You can repeat this step to add multiple schemas.

   Partner Connect creates the following resources in your workspace:

   - A Databricks service principal named **DBT_CLOUD_USER**.
   - A Databricks personal access token that is associated with the **DBT_CLOUD_USER** service principal.
  
   Partner Connect also grants the following privileges to the **DBT_CLOUD_USER** service principal:

   - (Unity Catalog) **USE CATALOG**: Required to interact with objects within the selected catalog.
   - (Unity Catalog) **USE SCHEMA**: Required to interact with objects within the selected schema.
   - (Unity Catalog) **CREATE SCHEMA**: Grants the ability to create schemas in the selected catalog.
   - (Hive metastore) **USAGE**: Required to grant the **SELECT** and **READ_METADATA** privileges for the schemas you selected.
   - **SELECT**: Grants the ability to read the schemas you selected.
   - (Hive metastore) **READ_METADATA**: Grants the ability to read metadata for the schemas you selected.
   - **CAN_USE**: Grants permissions to use the SQL warehouse you selected.

8. Click **Next**.

   The **Email** box displays the email address for your Databricks account. dbt uses this email address to prompt you to create a trial dbt account.

9. Click **Connect to dbt Cloud**.

   A new tab opens in your web browser, which displays the dbt website.

10. Complete the on-screen instructions on the dbt website to create your trial dbt account.

## Initialize your dbt project​ and start developing
Now that you have a repository configured, you can initialize your project and start development in dbt Cloud:

1. Click **Start developing in the IDE**. It might take a few minutes for your project to spin up for the first time as it establishes your git connection, clones your repo, and tests the connection to the warehouse.
2. Above the file tree to the left, click **Initialize dbt project**. This builds out your folder structure with example models.
3. Make your initial commit by clicking **Commit and sync**. Use the commit message `initial commit` and click **Commit**. This creates the first commit to your managed repo and allows you to open a branch where you can add new dbt code.
4. You can now directly query data from your warehouse and execute `dbt run`. You can try this out now:
    - Click **+ Create new file**, add this query to the new file, and click **Save as** to save the new file: 
        ```sql
        select * from default.jaffle_shop_customers
        ```
    - In the command line bar at the bottom, enter `dbt run` and click **Enter**. You should see a `dbt run succeeded` message.

## Build your first model
1. Under **Version Control** on the left, click **Create branch**. You can name it `add-customers-model`. You need to create a new branch since the main branch is set to read-only mode.
3. Click the **...** next to the `models` directory, then select **Create file**.  
4. Name the file `customers.sql`, then click **Create**.
5. Copy the following query into the file and click **Save**.

```sql
with customers as (

    select
        id as customer_id,
        first_name,
        last_name

    from jaffle_shop_customers

),

orders as (

    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from jaffle_shop_orders

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

#### FAQs

<FAQ path="Runs/checking-logs" />
<FAQ path="Project/which-schema" />
<FAQ path="Models/create-a-schema" />
<FAQ path="Models/run-downtime" />
<FAQ path="Troubleshooting/sql-errors" />

## Change the way your model is materialized

<Snippet path="quickstarts/change-way-model-materialized" />

## Delete the example models

<Snippet path="quickstarts/delete-example-models" />

## Build models on top of other models

<Snippet path="quickstarts/intro-build-models-atop-other-models" />

1. Create a new SQL file, `models/stg_customers.sql`, with the SQL from the `customers` CTE in our original query.
2. Create a second new SQL file, `models/stg_orders.sql`, with the SQL from the `orders` CTE in our original query.

    <File name='models/stg_customers.sql'>

    ```sql
    select
        id as customer_id,
        first_name,
        last_name

    from jaffle_shop_customers
    ```

    </File>

    <File name='models/stg_orders.sql'>

    ```sql
    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from jaffle_shop_orders
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

    This time, when you performed a `dbt run`, separate views/tables were created for `stg_customers`, `stg_orders` and `customers`. dbt inferred the order to run these models. Because `customers` depends on `stg_customers` and `stg_orders`, dbt builds `customers` last. You do not need to explicitly define these dependencies.

#### FAQs {#faq-2}

<FAQ path="Runs/run-one-model" />
<FAQ path="Models/unique-model-names" />
<FAQ path="Project/structure-a-project" alt_header="As I create more models, how should I keep my project organized? What should I name my models?" />


<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />

---
title: "Quickstart for dbt Cloud and Starburst Galaxy"
id: "starburst-galaxy"
level: 'Beginner'
icon: 'starburst'
hide_table_of_contents: true
tags: ['dbt Cloud','Quickstart']
---

<div style={{maxWidth: '900px'}}>

## Introduction

In this quickstart guide, you'll learn how to use dbt Cloud with [Starburst Galaxy](https://www.starburst.io/platform/starburst-galaxy/). It will show you how to:

- Load data into the Amazon S3 bucket. This guide uses AWS as the cloud service provider for demonstrative purposes. Starburst Galaxy also [supports other data sources](https://docs.starburst.io/starburst-galaxy/catalogs/index.html) such as Google Cloud, Microsoft Azure, and more.
- Connect Starburst Galaxy to the Amazon S3 bucket.
- Create tables with Starburst Galaxy.
- Connect dbt Cloud to Starburst Galaxy.
- Take a sample query and turn it into a model in your dbt project. A model in dbt is a select statement.
- Add tests to your models.
- Document your models.
- Schedule a job to run.
- Connect to multiple data sources in addition to your S3 bucket. 

:::tip Videos for you
You can check out [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals) for free if you're interested in course learning with videos.

You can also watch the [Build Better Data Pipelines with dbt and Starburst](https://www.youtube.com/watch?v=tfWm4dWgwRg) YouTube video produced by Starburst Data, Inc.
:::

### Prerequisites 

- You have a [multi-tenant](/docs/cloud/about-cloud/access-regions-ip-addresses) deployment in [dbt Cloud](https://www.getdbt.com/signup/). For more information, refer to [Tenancy](/docs/cloud/about-cloud/tenancy).
- You have a [Starburst Galaxy account](https://www.starburst.io/platform/starburst-galaxy/). If you don't, you can start a free trial. Refer to the [getting started guide](https://docs.starburst.io/starburst-galaxy/get-started.html) in the Starburst Galaxy docs for further setup details.
- You have an AWS account with permissions to upload data to an S3 bucket.
- For Amazon S3 authentication, you will need either an AWS access key and AWS secret key with access to the bucket, or you will need a cross account IAM role with access to the bucket. For details, refer to these Starburst Galaxy docs: 
    - [AWS access and secret key instructions](https://docs.starburst.io/starburst-galaxy/security/external-aws.html#aws-access-and-secret-key)
    - [Cross account IAM role](https://docs.starburst.io/starburst-galaxy/security/external-aws.html#role)


### Related content

- [dbt Learn courses](https://learn.getdbt.com)
- [dbt Cloud CI job](/docs/deploy/continuous-integration)
- [Job notifications](/docs/deploy/job-notifications)
- [Source freshness](/docs/deploy/source-freshness)
- [SQL overview for Starburst Galaxy](https://docs.starburst.io/starburst-galaxy/sql/index.html)    

## Load data to an Amazon S3 bucket {#load-data-to-s3}

Using Starburst Galaxy, you can create tables and also transform them with dbt. Start by loading the Jaffle Shop data (provided by dbt Labs) to your Amazon S3 bucket. Jaffle Shop is a fictional cafe selling food and beverages in several US cities. 

1. Download these CSV files to your local machine:

    - [jaffle_shop_customers.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_customers.csv)
    - [jaffle_shop_orders.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_orders.csv)
    - [stripe_payments.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/stripe_payments.csv)
2. Upload these files to S3. For details, refer to [Upload objects](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html) in the Amazon S3 docs. 
    
    When uploading these files, you must create the following folder structure and upload the appropriate file to each folder:

    ```
    <bucket/blob>
        dbt-quickstart (folder)
            jaffle-shop-customers (folder)
                jaffle_shop_customers.csv (file)
            jaffle-shop-orders (folder)
                jaffle_shop_orders.csv (file)
            stripe-payments (folder)
                stripe-payments.csv (file)
    ```

## Connect Starburst Galaxy to the Amazon S3 bucket {#connect-to-s3-bucket}
If your Starburst Galaxy instance is not already connected to your S3 bucket, you need to create a cluster, configure a catalog that allows Starburst Galaxy to connect to the S3 bucket, add the catalog to your new cluster, and configure privilege settings.

In addition to Amazon S3, Starburst Galaxy supports many other data sources. To learn more about them, you can refer to the [Catalogs overview](https://docs.starburst.io/starburst-galaxy/catalogs/index.html) in the Starburst Galaxy docs.  

1. Create a cluster. Click **Clusters** on the left sidebar of the Starburst Galaxy UI, then click **Create cluster** in the main body of the page. 
2. In the **Create a new cluster** modal, you only need to set the following options. You can use the defaults for the other options.
    - **Cluster name** &mdash; Type a name for your cluster.
    - **Cloud provider region** &mdash; Select the AWS region.

    When done, click **Create cluster**.

3. Create a catalog. Click **Catalogs** on the left sidebar of the Starburst Galaxy UI, then click **Create catalog** in the main body of the page. 
4. On the **Create a data source** page, select the Amazon S3 tile. 
5. In the **Name and description** section of the **Amazon S3** page, fill out the fields. 
6. In the **Authentication to S3** section of the **Amazon S3** page, select the [AWS (S3) authentication mechanism](#prerequisites) you chose to connect with.
7. In the **Metastore configuration** section, set these options:
    - **Default S3 bucket name** &mdash; Enter the name of your S3 bucket you want to access.
    - **Default directory name** &mdash; Enter the folder name of where the Jaffle Shop data lives in the S3 bucket. This is the same folder name you used in [Load data to an Amazon S3 bucket](#load-data-to-s3).
    - **Allow creating external tables** &mdash; Enable this option.
    - **Allow writing to external tables** &mdash; Enable this option.

    The **Amazon S3** page should look similar to this, except for the **Authentication to S3** section which is dependant on your setup:

    <Lightbox src="/img/quickstarts/dbt-cloud/starburst-galaxy-config-s3.png" title="Amazon S3 connection settings in Starburst Galaxy" />

8. Click **Test connection**. This verifies that Starburst Galaxy can access your S3 bucket. 
9. Click **Connect catalog** if the connection test passes.
    <Lightbox src="/img/quickstarts/dbt-cloud/test-connection-success.png" title="Successful connection test" />

10. On the **Set permissions** page, click **Skip**. You can add permissions later if you want.
11. On the **Add to cluster** page, choose the cluster you want to add the catalog to from the dropdown and click **Add to cluster**.
12. Add the location privilege for your S3 bucket to your role in Starburst Galaxy. Click **Access control > Roles and privileges** on the left sidebar of the Starburst Galaxy UI. Then, in the **Roles** table, click the role name **accountadmin**. 

    If you're using an existing Starburst Galaxy cluster and don't have access to the accountadmin role, then select a role that you do have access to.

    To learn more about access control, refer to [Access control](https://docs.starburst.io/starburst-galaxy/security/access-control.html) in the Starburst Galaxy docs. 
13. On the **Roles** page, click the **Privileges** tab and click **Add privilege**.
14. On the **Add privilege** page, set these options:
    - **What would you like to modify privileges for?** &mdash; Choose **Location**.
    - **Enter a storage location provide** &mdash; Enter the storage location of _your S3 bucket_ and the folder of where the Jaffle Shop data lives. Make sure to include the `/*` at the end of the location. 
    - **Create SQL** &mdash; Enable the option. 
    
    When done, click **Add privileges**.

    <Lightbox src="/img/quickstarts/dbt-cloud/add-privilege.png" title="Add privilege to accountadmin role" />

## Create tables with Starburst Galaxy
To query the Jaffle Shop data with Starburst Galaxy, you need to create tables using the Jaffle Shop data that you [loaded to your S3 bucket](#load-data-to-s3). You can do this (and run any SQL statement) from the [query editor](https://docs.starburst.io/starburst-galaxy/query/query-editor.html). 

1. Click **Query > Query editor** on the left sidebar of the Starburst Galaxy UI. The main body of the page is now the query editor. 
2. Configure the query editor so it queries your S3 bucket. In the upper right corner of the query editor, select your cluster in the first gray box and select your catalog in the second gray box:

    <Lightbox src="/img/quickstarts/dbt-cloud/starburst-galaxy-editor.png" title="Set the cluster and catalog in query editor" />

3. Copy and paste these queries into the query editor. Then **Run** each query individually. 

    Replace `YOUR_S3_BUCKET_NAME` with the name of your S3 bucket. These queries create a schema named `jaffle_shop` and also create the `jaffle_shop_customers`, `jaffle_shop_orders`, and `stripe_payments` tables: 

    ```sql
    CREATE SCHEMA jaffle_shop WITH (location='s3://YOUR_S3_BUCKET_NAME/dbt-quickstart/');

    CREATE TABLE jaffle_shop.jaffle_shop_customers (
        id VARCHAR,
        first_name VARCHAR,
        last_name VARCHAR
    )

    WITH (
        external_location = 's3://YOUR_S3_BUCKET_NAME/dbt-quickstart/jaffle-shop-customers/',
        format = 'csv',
        type = 'hive',
        skip_header_line_count=1

    );

    CREATE TABLE jaffle_shop.jaffle_shop_orders (

        id VARCHAR,
        user_id VARCHAR,
        order_date VARCHAR,
        status VARCHAR

    )

    WITH (
        external_location = 's3://YOUR_S3_BUCKET_NAME/dbt-quickstart/jaffle-shop-orders/',
        format = 'csv',
        type = 'hive',
        skip_header_line_count=1
    );

    CREATE TABLE jaffle_shop.stripe_payments (

        id VARCHAR,
        order_id VARCHAR,
        paymentmethod VARCHAR,
        status VARCHAR,
        amount VARCHAR,
        created VARCHAR
    )

    WITH (

        external_location = 's3://YOUR_S3_BUCKET_NAME/dbt-quickstart/stripe-payments/',
        format = 'csv',
        type = 'hive',
        skip_header_line_count=1

    );
    ```
4. When the queries are done, you can see the following hierarchy on the query editor's left sidebar:

    <Lightbox src="/img/quickstarts/dbt-cloud/starburst-data-hierarchy.png" title="Hierarchy of data in query editor" />

5. Verify that the tables were created successfully. In the query editor, run the following queries:

    ```sql
    select * from jaffle_shop.jaffle_shop_customers;
    select * from jaffle_shop.jaffle_shop_orders;
    select * from jaffle_shop.stripe_payments;
    ```

## Connect dbt Cloud to Starburst Galaxy 

1. Make sure you are still logged in to [Starburst Galaxy](https://galaxy.starburst.io/login).
2. If you haven’t already, set your account’s role to accountadmin. Click your email address in the upper right corner, choose **Switch role** and select **accountadmin**. 
    
    If this role is not listed for you, choose the role you selected in [Connect Starburst Galaxy to the Amazon S3 bucket](#connect-to-s3-bucket) when you added location privilege for your S3 bucket.
3. Click **Clusters** on the left sidebar.
4. Find your cluster in the **View clusters** table and click **Connection info**. Choose **dbt** from the **Select client** dropdown. Keep the **Connection information** modal open. You will use details from that modal in dbt Cloud.
5. In another browser tab, log in to [dbt Cloud](/docs/cloud/about-cloud/access-regions-ip-addresses).
6. Create a new project in dbt Cloud. Click on your account name in the left side menu, select **Account settings**, and click **+ New Project**.
7. Enter a project name and click **Continue**.
8. Choose **Starburst** as your connection and click **Next**.
9. Enter the **Settings** for your new project:
    - **Host** – The **Host** value from the **Connection information** modal in your Starburst Galaxy tab.
    - **Port** – 443 (which is the default)
10. Enter the **Development Credentials** for your new project:
    - **User** – The **User** value from the **Connection information** modal in your Starburst Galaxy tab. Make sure to use the entire string, including the account's role which is the `/` and all the characters that follow. If you don’t include it, your default role is used and that might not have the correct permissions for project development.
    - **Password** – The password you use to log in to your Starburst Galaxy account.
    - **Database** – The Starburst catalog you want to save your data to (for example, when writing new tables). For future reference, database is synonymous to catalog between dbt Cloud and Starburst Galaxy. 
    - Leave the remaining options as is. You can use their default values.
11. Click **Test Connection**. This verifies that dbt Cloud can access your Starburst Galaxy cluster.
12. Click **Next** if the test succeeded. If it failed, you might need to check your Starburst Galaxy settings and credentials.

## Set up a dbt Cloud managed repository 
<Snippet path="tutorial-managed-repo" />

## Initialize your dbt project​ and start developing
Now that you have a repository configured, you can initialize your project and start development in dbt Cloud:

1. Click **Start developing in the IDE**. It might take a few minutes for your project to spin up for the first time as it establishes your git connection, clones your repo, and tests the connection to the warehouse.
2. Above the file tree to the left, click **Initialize dbt project**. This builds out your folder structure with example models.
3. Make your initial commit by clicking **Commit and sync**. Use the commit message `initial commit` and click **Commit**. This creates the first commit to your managed repo and allows you to open a branch where you can add new dbt code.
4. You can now directly query data from your warehouse and execute `dbt run`. You can try this out now:
    - Click **+ Create new file**, add this query to the new file, and click **Save as** to save the new file:  
        ```sql
            select * from dbt_quickstart.jaffle_shop.jaffle_shop_customers
        ```
    - In the command line bar at the bottom, enter `dbt run` and click **Enter**. You should see a `dbt run succeeded` message.

## Build your first model

You have two options for working with files in the dbt Cloud IDE:

- Create a new branch (recommended) &mdash; Create a new branch to edit and commit your changes. Navigate to **Version Control** on the left sidebar and click **Create branch**.
- Edit in the protected primary branch &mdash; If you prefer to edit, format, or lint files and execute dbt commands directly in your primary git branch. The dbt Cloud IDE prevents commits to the protected branch, so you will be prompted to commit your changes to a new branch.

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

    from dbt_quickstart.jaffle_shop.jaffle_shop_customers
),

orders as (

    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from dbt_quickstart.jaffle_shop.jaffle_shop_orders
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
    left join customer_orders on customers.customer_id = customer_orders.customer_id
)
select * from final

```

4. Enter `dbt run` in the command prompt at the bottom of the screen. You should get a successful run and see the three models.

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

    from dbt_quickstart.jaffle_shop.jaffle_shop_customers
    ```

    </File>

    <File name='models/stg_orders.sql'>

    ```sql
    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from dbt_quickstart.jaffle_shop.jaffle_shop_orders
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

        left join customer_orders on customers.customer_id = customer_orders.customer_id

    )

    select * from final
    
    ```

    </File>

4. Execute `dbt run`.

    This time, when you performed a `dbt run`, separate views/tables were created for `stg_customers`, `stg_orders` and `customers`. dbt inferred the order to run these models. Because `customers` depends on `stg_customers` and `stg_orders`, dbt builds `customers` last. You do not need to explicitly define these dependencies.


#### FAQs {#faq-2}

<FAQ path="Runs/run-one-model" />
<FAQ path="Project/unique-resource-names" />
<FAQ path="Project/structure-a-project" alt_header="As I create more models, how should I keep my project organized? What should I name my models?" />

</div>

<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />


## Connect to multiple data sources
This quickstart focuses on using dbt Cloud to run models against a data lake (S3) by using Starburst Galaxy as the query engine. In most real world scenarios, the data that is needed for running models is actually spread across multiple data sources and is stored in a variety of formats. With Starburst Galaxy, Starburst Enterprise, and Trino, you can run your models on any of the data you need, no matter where it is stored.

If you want to try this out, you can refer to the [Starburst Galaxy docs](https://docs.starburst.io/starburst-galaxy/catalogs/) to add more data sources and load the Jaffle Shop data into the source you select. Then, extend your models to query the new data source and the data source you created in this quickstart.

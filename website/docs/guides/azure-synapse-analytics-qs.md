---
title: "Quickstart for dbt Cloud and Azure Synapse Analytics"
id: "azure-synapse-analytics"
level: 'Beginner'
icon: 'azure-synapse-analytics'
hide_table_of_contents: true
tags: ['dbt Cloud','Quickstart']
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Introduction

In this quickstart guide, you'll learn how to use dbt Cloud with [Azure Synapse Analytics](https://azure.microsoft.com/en-us/products/synapse-analytics/). It will show you how to:

- Load the Jaffle Shop sample data (provided by dbt Labs) into your Azure Synapse Analytics warehouse. 
- Connect dbt Cloud to Azure Synapse Analytics.
- Turn a sample query into a model in your dbt project. A model in dbt is a SELECT statement.
- Add tests to your models.
- Document your models.
- Schedule a job to run.


### Prerequisites
- You have a [dbt Cloud](https://www.getdbt.com/signup/) account.
- You have an Azure Synapse Analytics account. For a free trial, refer to [Synapse Analytics](https://azure.microsoft.com/en-us/free/synapse-analytics/) in the Microsoft docs.
- As a Microsoft admin, you’ve enabled service principal authentication. You must add the service principal to the Synapse workspace with either a Member (recommended) or Admin permission set. For details, refer to [Create a service principal using the Azure portal](https://learn.microsoft.com/en-us/entra/identity-platform/howto-create-service-principal-portal) in the Microsoft docs. dbt Cloud needs these authentication credentials to connect to Azure Synapse Analytics.

### Related content
- [dbt Learn courses](https://learn.getdbt.com)
- [About continuous integration jobs](/docs/deploy/continuous-integration)
- [Deploy jobs](/docs/deploy/deploy-jobs)
- [Job notifications](/docs/deploy/job-notifications)
- [Source freshness](/docs/deploy/source-freshness)

## Load data into your Azure Synapse Analytics

1. Log in to your [Azure portal account](https://portal.azure.com/#home).  
1. On the home page, select the **SQL databases** tile.
1. From the **SQL databases** page, navigate to your organization’s workspace or create a new workspace; refer to [Create a Synapse workspace](https://learn.microsoft.com/en-us/azure/synapse-analytics/quickstart-create-workspace) in the Microsoft docs for more details.
1. From the workspace's sidebar, select **Data**. Click the three dot menu on your database and select **New SQL script** to open the SQL editor. 
1. Copy these statements into the SQL editor to load the Jaffle Shop example data:

    ```sql

    CREATE TABLE dbo.customers
    (
        [ID] [bigint],
        \[FIRST_NAME] [varchar](8000),
        \[LAST_NAME] [varchar](8000)
    );

    COPY INTO [dbo].[customers]
    FROM 'https://dbtlabsynapsedatalake.blob.core.windows.net/dbt-quickstart-public/jaffle_shop_customers.parquet'
    WITH (
        FILE_TYPE = 'PARQUET'
    );

    CREATE TABLE dbo.orders
    (
        [ID] [bigint],
        [USER_ID] [bigint],
        [ORDER_DATE] [date],
        \[STATUS] [varchar](8000)
    );

    COPY INTO [dbo].[orders]
    FROM 'https://dbtlabsynapsedatalake.blob.core.windows.net/dbt-quickstart-public/jaffle_shop_orders.parquet'
    WITH (
        FILE_TYPE = 'PARQUET'
    );

    CREATE TABLE dbo.payments
    (
        [ID] [bigint],
        [ORDERID] [bigint],
        \[PAYMENTMETHOD] [varchar](8000),
        \[STATUS] [varchar](8000),
        [AMOUNT] [bigint],
        [CREATED] [date]
    );

    COPY INTO [dbo].[payments]
    FROM 'https://dbtlabsynapsedatalake.blob.core.windows.net/dbt-quickstart-public/stripe_payments.parquet'
    WITH (
        FILE_TYPE = 'PARQUET'
    );
    ```

    <Lightbox src="/img/quickstarts/dbt-cloud/example-load-data-azure-syn-analytics.png" width="80%" title="Example of loading data" />

## Connect dbt Cloud to Azure Synapse Analytics

1. Create a new project in dbt Cloud. Click on your account name in the left side menu, select **Account settings**, and click **+ New Project**.
2. Enter a project name and click **Continue**.
3. Choose **Synapse** as your connection and click **Next**.
4. In the **Configure your environment** section, enter the **Settings** for your new project:
    - **Server** &mdash; Use the service principal's **Synapse host name** value (without the trailing `, 1433` string) for the Synapse test endpoint. 
    - **Port** &mdash; 1433 (which is the default).
    - **Database** &mdash; Use the service principal's **database** value for the Synapse test endpoint. 
5. Enter the **Development credentials** for your new project:
    - **Authentication** &mdash; Choose **Service Principal** from the dropdown.
    - **Tenant ID** &mdash; Use the service principal’s **Directory (tenant) id** as the value.
    - **Client ID** &mdash; Use the service principal’s **application (client) ID id** as the value.
    - **Client secret** &mdash; Use the service principal’s **client secret** (not the  **client secret id**) as the value.
6. Click **Test connection**. This verifies that dbt Cloud can access your Azure Synapse Analytics account.
7. Click **Next** when the test succeeds. If it failed, you might need to check your Microsoft service principal.

## Set up a dbt Cloud managed repository 
<Snippet path="tutorial-managed-repo" />

## Initialize your dbt project​ and start developing
Now that you have a repository configured, you can initialize your project and start development in dbt Cloud:

1. Click **Start developing in the IDE**. It might take a few minutes for your project to spin up for the first time as it establishes your git connection, clones your repo, and tests the connection to the warehouse.
2. Above the file tree to the left, click **Initialize dbt project**. This builds out your folder structure with example models.
3. Make your initial commit by clicking **Commit and sync**. Use the commit message `initial commit` and click **Commit Changes**. This creates the first commit to your managed repo and allows you to open a branch where you can add new dbt code.
4. You can now directly query data from your warehouse and execute `dbt run`. You can try this out now:
    - In the command line bar at the bottom, enter `dbt run` and click **Enter**. You should see a `dbt run succeeded` message.

## Build your first model
1. Under **Version Control** on the left, click **Create branch**. You can name it `add-customers-model`. You need to create a new branch since the main branch is set to read-only mode.
1. Click the three dot menu (**...**) next to the `models` directory, then select **Create file**.  
1. Name the file `customers.sql`, then click **Create**.
1. Copy the following query into the file and click **Save**.

    <File name='customers.sql'>

    ```sql
    with customers as (

    select
        ID as customer_id,
        FIRST_NAME as first_name,
        LAST_NAME as last_name

    from dbo.customers
    ),

    orders as (

        select
            ID as order_id,
            USER_ID as customer_id,
            ORDER_DATE as order_date,
            STATUS as status

        from dbo.orders
    ),

    customer_orders as (

        select
            customer_id,

            min(order_date) as first_order_date,
            max(order_date) as most_recent_order_date,
            count(order_id) as number_of_orders

        from orders

        group by customer_id
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

1. Enter `dbt run` in the command prompt at the bottom of the screen. You should get a successful run and see the three models.

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
        ID as customer_id,
        FIRST_NAME as first_name,
        LAST_NAME as last_name

    from dbo.customers
    ```

    </File>

    <File name='models/stg_orders.sql'>

    ```sql
    select
        ID as order_id,
        USER_ID as customer_id,
        ORDER_DATE as order_date,
        STATUS as status

    from dbo.orders
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

        group by customer_id

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

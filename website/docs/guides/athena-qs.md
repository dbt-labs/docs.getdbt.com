---
title: "Quickstart for dbt Cloud and Amazon Athena"
id: "athena"
# time_to_complete: '30 minutes' commenting out until we test
level: 'Beginner'
icon: 'athena'
hide_table_of_contents: true
tags: ['Amazon','Athena', 'dbt Cloud','Quickstart']
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Introduction

In this quickstart guide, you'll learn how to use dbt Cloud with Amazon Athena. It will show you how to: 

- Create an S3 bucket for Athena query results.
- Creat an Athena database.
- Access sample data in a public dataset.
- Connect dbt Cloud to Amazon Athena.
- Take a sample query and turn it into a model in your dbt project. A model in dbt is a select statement.
- Add tests to your models.
- Document your models.
- Schedule a job to run.

:::tip Videos for you
You can check out [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals) for free if you're interested in course learning with videos.
:::

### Prerequisites​

- You have a [dbt Cloud account](https://www.getdbt.com/signup/). 
- You have an [AWS account](https://aws.amazon.com/).
- You have set up [Amazon Athena](https://docs.aws.amazon.com/athena/latest/ug/getting-started.html).

### Related content

- Learn more with [dbt Learn courses](https://learn.getdbt.com)
- [CI jobs](/docs/deploy/continuous-integration)
- [Deploy jobs](/docs/deploy/deploy-jobs)
- [Job notifications](/docs/deploy/job-notifications)
- [Source freshness](/docs/deploy/source-freshness)

## Getting started

For the following guide you can use an existing S3 bucket or [create a new one](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html).

Download the following CSV files (the Jaffle Shop sample data) and upload them to your S3 bucket:
- [jaffle_shop_customers.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_customers.csv)
- [jaffle_shop_orders.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_orders.csv)
- [stripe_payments.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/stripe_payments.csv)


## Configure Amazon Athena

1. Log into your AWS account and navigate to the **Athena console**.
    - If this is your first time in the Athena console (in your current AWS Region), click **Explore the query editor** to open the query editor. Otherwise, Athena opens automatically in the query editor.
1. Open **Settings** and find the **Location of query result box** field.
    1. Enter the path of the S3 bucket (prefix it with `s3://`).
    2. Navigate to **Browse S3**, select the S3 bucket you created, and click **Choose**.
1. **Save** these settings.
1. In the **query editor**, create a database by running `create database YOUR_DATABASE_NAME`.
1. To make the database you created the one you `write` into, select it from the **Database** list on the left side menu. 
1. Access the Jaffle Shop data in the S3 bucket using one of these options:
    1. Manually create the tables.
    2. Create a glue crawler to recreate the data as external tables (recommended).
1. Once the tables have been created, you will able to `SELECT` from them. 

## Set up security access to Athena

To setup the security access for Athena, determine which access method you want to use: 
* Obtain `aws_access_key_id` and `aws_secret_access_key` (recommended)
* Obtain an **AWS credentials** file.

### AWS access key (recommended)

To obtain your `aws_access_key_id` and `aws_secret_access_key`:

1. Open the **AWS Console**.
1. Click on your **username** near the top right and click **Security Credentials**.
1. Click on **Users** in the sidebar.
1. Click on your **username** (or the name of the user for whom to create the key).
1. Click on the **Security Credentials** tab.
1. Click **Create Access Key**.
1. Click **Show User Security Credentials** and 

Save the `aws_access_key_id` and `aws_secret_access_key` for a future step.

### AWS credentials file

To obtain your AWS credentials file:
1. Follow the instructions for [configuring the credentials file](https://docs.aws.amazon.com/cli/v1/userguide/cli-configure-files.html) usin the AWS CLI
1. Locate the `~/.aws/credentials` file on your computer
    1. Windows: `%USERPROFILE%\.aws\credentials`
    2. Mac/Linux: `~/.aws/credentials`

Retrieve the `aws_access_key_id` and `aws_secret_access_key` from the `~/.aws/credentials` file for a future step.

## Configure the connection in dbt Cloud

To configure the Athena connection in dbt Cloud:
1. Click your **account name** on the left-side menu and click **Account settings**.
1. Click **Connections** and click **New connection**.
1. Click **Athena** and fill out the required fields (and any optional fields).
    1. **AWS region name** &mdash; The AWS region of your environment.
    1. **Database (catalog)** &mdash; Enter the database name created in earlier steps (lowercase only).
    1. **AWS S3 staging directory** &mdash; Enter the S3 bucket created in earlier steps.
1. Click **Save**

### Configure your environment

To configure the Athena credentials in your environment:
1. Click **Deploy** on the left-side menu and click **Environments**.
1. Click **Create environment** and fill out the **General settings**. 
    - Your **dbt version** must be set to `Versionless` to use the Athena connection. 
1. Select the Athena connection from the **Connection** dropdown. 
1. Fill out the `aws_access_key` and `aws_access_id` recorded in previous steps, as well as the `Schema` to write to. 
1. Click **Test connection** and once it succeeds, **Save** the environment.

Repeat the process to create a [development environment](https://docs.getdbt.com/docs/dbt-cloud-environments#types-of-environments). 

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
        select * from jaffle_shop.customers
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

    from jaffle_shop.customers

),

orders as (

    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from jaffle_shop.orders

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

    from jaffle_shop.customers
    ```

    </File>

    <File name='models/stg_orders.sql'>

    ```sql
    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from jaffle_shop.orders
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
<FAQ path="Project/unique-resource-names" />
<FAQ path="Project/structure-a-project" alt_header="As I create more models, how should I keep my project organized? What should I name my models?" />

</div>

<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />

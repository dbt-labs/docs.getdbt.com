---
title: "Quickstart for dbt Cloud and BigQuery"
id: "bigquery"
time_to_complete: '30 minutes'
platform: 'dbt-cloud'
hide_table_of_contents: true
---

## Introduction

In this quickstart guide, you'll learn how to use dbt Cloud with BigQuery. It will show you how to: 

- Create a Google Cloud Platform (GCP) project.
- Access sample data in a public dataset.
- Connect dbt Cloud to BigQuery.
- Take a sample query and turn it into a model in your dbt project. A model in dbt is a select statement.
- Add tests to your models.
- Document your models.
- Schedule a job to run.

:::tip Videos for you
You can check out [dbt Fundamentals](https://courses.getdbt.com/courses/fundamentals) for free if you're interested in course learning with videos.

:::

### Prerequisites​

- You have a  [dbt Cloud account](https://www.getdbt.com/signup/). 
- You have a [Google account](https://support.google.com/accounts/answer/27441?hl=en).
- You can use a personal or work account to set up BigQuery through [Google Cloud Platform (GCP)](https://cloud.google.com/free).

### Related content

- Learn more with [dbt Courses](https://courses.getdbt.com/collections)
- [dbt Cloud CI job](/docs/deploy/cloud-ci-job)
- [Job triggers](/docs/deploy/job-triggers)
- [Job notifications](/docs/deploy/job-notifications)
- [Source freshness](/docs/deploy/source-freshness)

## Create a new GCP project​

1. Go to the [BigQuery Console](https://console.cloud.google.com/bigquery) after you log in to your Google account. If you have multiple Google accounts, make sure you’re using the correct one. 
2. Create a new project from the [Manage resources page](https://console.cloud.google.com/projectcreate?previousPage=%2Fcloud-resource-manager%3Fwalkthrough_id%3Dresource-manager--create-project%26project%3D%26folder%3D%26organizationId%3D%23step_index%3D1&walkthrough_id=resource-manager--create-project). For more information, refer to [Creating a project](https://cloud.google.com/resource-manager/docs/creating-managing-projects#creating_a_project) in the Google Cloud docs. GCP automatically populates the Project name field for you. You can change it to be more descriptive for your use. For example, `dbt Learn - BigQuery Setup`.

## Create BigQuery datasets

1. From the [BigQuery Console](https://console.cloud.google.com/bigquery), click **Editor**. Make sure to select your newly created project, which is available at the top of the page.
1. Verify that you can run SQL queries. Copy and paste these queries into the Query Editor: 
    ```sql
    select * from `dbt-tutorial.jaffle_shop.customers`;
    select * from `dbt-tutorial.jaffle_shop.orders`;
    select * from `dbt-tutorial.stripe.payment`;
    ```

    Click **Run**, then check for results from the queries. For example: 
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/bigquery/query-results.png" title="Bigquery Query Results" />
    </div>
2. Create new datasets from the [BigQuery Console](https://console.cloud.google.com/bigquery). For more information, refer to [Create datasets](https://cloud.google.com/bigquery/docs/datasets#create-dataset) in the Google Cloud docs. Datasets in BigQuery are equivalent to schemas in a traditional database. On the **Create dataset** page:
    - **Dataset ID** &mdash; Enter a name that fits the purpose. This name is used like schema in fully qualified references to your database objects such as `database.schema.table`. As an example for this guide, create one for `jaffle_shop` and another one for `stripe` afterward.
    - **Data location** &mdash; Leave it blank (the default). It determines the GCP location of where your data is stored. The current default location is the US multi-region. All tables within this dataset will share this location.
    - **Enable table expiration** &mdash; Leave it unselected (the default). The default for the billing table expiration is 60 days. Because billing isn’t enabled for this project, GCP defaults to deprecating tables.
    - **Google-managed encryption key** &mdash; This option is available under **Advanced options**. Allow Google to manage encryption (the default). 
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/bigquery/create-dataset-id.png" title="Bigquery Create Dataset ID" />
    </div>
3. After you create the `jaffle_shop` dataset, create one for `stripe` with all the same values except for **Dataset ID**.

## Generate BigQuery credentials {#generate-bigquery-credentials}
In order to let dbt connect to your warehouse, you'll need to generate a keyfile. This is analogous to using a database username and password with most other <Term id="data-warehouse">data warehouses</Term>.

1. Start the [GCP credentials wizard](https://console.cloud.google.com/apis/credentials/wizard). Make sure your new project is selected in the header. If you do not see your account or project, click your profile picture to the right and verify you are using the correct email account. For **Credential Type**: 
    - From the **Select an API** dropdown, choose **BigQuery API**
    - Select **Application data** for the type of data you will be accessing
    - Select **No, I’m not using them** and click **Next**.
    - Click **Next** to create a new service account.
2. Create a service account for your new project from the [Service accounts page](https://console.cloud.google.com/projectselector2/iam-admin/serviceaccounts?supportedpurview=project). For more information, refer to [Create a service account](https://developers.google.com/workspace/guides/create-credentials#create_a_service_account) in the Google Cloud docs. As an example for this guide, you can:
    - Type `dbt-user` as the **Service account name**
    - From the **Select a role** dropdown, choose **BigQuery Admin** and click **Continue** 
    - Leave the **Grant users access to this service account** fields blank
    - Click **Done**
3. Create a service account key for your new project from the [Service accounts page](https://console.cloud.google.com/iam-admin/serviceaccounts?walkthrough_id=iam--create-service-account-keys&start_index=1#step_index=1). For more information, refer to [Create a service account key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating) in the Google Cloud docs. When downloading the JSON file, make sure to use a filename you can easily remember. For example, `dbt-user-creds.json`. For security reasons, dbt Labs recommends that you protect this JSON file like you would your identity credentials; for example, don't check the JSON file into your version control software.

## Connect dbt Cloud to BigQuery​
1. Create a new project in [dbt Cloud](https://cloud.getdbt.com/). From **Account settings** (using the gear menu in the top right corner), click **+ New Project**.
2. Enter a project name and click **Continue**.
3. For the warehouse, click **BigQuery** then **Next** to set up your connection.
4. Click **Upload a Service Account JSON File** in settings.
5. Select the JSON file you downloaded in [Generate BigQuery credentials](#generate-bigquery-credentials) and dbt Cloud will fill in all the necessary fields.
6. Click **Test Connection**. This verifies that dbt Cloud can access your BigQuery account.
7. Click **Next** if the test succeeded. If it failed, you might need to go back and regenerate your BigQuery credentials.


## Set up a dbt Cloud managed repository 
<Snippet src="tutorial-managed-repo" />


## Initialize your dbt project​ and start developing
Now that you have a repository configured, you can initialize your project and start development in dbt Cloud:

1. Click **Start developing in the IDE**. It might take a few minutes for your project to spin up for the first time as it establishes your git connection, clones your repo, and tests the connection to the warehouse.
2. Above the file tree to the left, click **Initialize dbt project**. This builds out your folder structure with example models.
3. Make your initial commit by clicking **Commit and sync**. Use the commit message `initial commit` and click **Commit**. This creates the first commit to your managed repo and allows you to open a branch where you can add new dbt code.
4. You can now directly query data from your warehouse and execute `dbt run`. You can try this out now:
    - Click **+ Create new file**, add this query to the new file, and click **Save as** to save the new file:  
        ```sql
        select * from `dbt-tutorial.jaffle_shop.customers`
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

    from `dbt-tutorial`.jaffle_shop.customers

),

orders as (

    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from `dbt-tutorial`.jaffle_shop.orders

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

<FAQ src="Runs/checking-logs" />
<FAQ src="Project/which-schema" />
<FAQ src="Models/create-a-schema" />
<FAQ src="Models/run-downtime" />
<FAQ src="Troubleshooting/sql-errors" />

## Change the way your model is materialized

<Snippet src="quickstarts/change-way-model-materialized" />

## Delete the example models

<Snippet src="quickstarts/delete-example-models" />

## Build models on top of other models

<Snippet src="quickstarts/intro-build-models-atop-other-models" />

1. Create a new SQL file, `models/stg_customers.sql`, with the SQL from the `customers` CTE in our original query.
2. Create a second new SQL file, `models/stg_orders.sql`, with the SQL from the `orders` CTE in our original query.

    <File name='models/stg_customers.sql'>

    ```sql
    select
        id as customer_id,
        first_name,
        last_name

    from `dbt-tutorial`.jaffle_shop.customers
    ```

    </File>

    <File name='models/stg_orders.sql'>

    ```sql
    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from `dbt-tutorial`.jaffle_shop.orders
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

<FAQ src="Runs/run-one-model" />
<FAQ src="Models/unique-model-names" />
<FAQ src="Project/structure-a-project" alt_header="As I create more models, how should I keep my project organized? What should I name my models?" />


<Snippet src="quickstarts/test-and-document-your-project" />

<Snippet src="quickstarts/schedule-a-job" />



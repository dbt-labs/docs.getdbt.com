---
title: "Get started with dbt Cloud and BigQuery"
description: "Get started with dbt Cloud and BigQuery."
id: "bigquery"
sidebar_label: "Get started with BigQuery"
---
For the BigQuery project in the getting started guide, you'll learn how to set up BigQuery and connect it to dbt Cloud.
This guide will walk you through:

- Setting up a new BigQuery instance &mdash; Log in and create a new Google Cloud project​.
- Accessing sample data in a public dataset &mdash; BigQuery supports public data sets that can be directly queried, so we will show you how to access those datasets via select statements. Additionally, we will show you how to populate your own database objects with that data.
- Connecting dbt Cloud to BigQuery &mdash; 

## Prerequisites​

- You have a [Google account](https://support.google.com/accounts/answer/27441?hl=en).
- You have a  [dbt Cloud account](https://cloud.getdbt.com/). 
- You can use a personal or work account to set up BigQuery through [Google Cloud Platform (GCP)](https://cloud.google.com/free).

## Create a new GCP project​

1. Go to the [BigQuery Console](https://console.cloud.google.com/bigquery) after you log in to your Google account. If you have multiple Google accounts, make sure you’re using the correct one. 
2. Create a [new project from the Console](https://cloud.google.com/resource-manager/docs/creating-managing-projects#creating_a_project). GCP automatically populates the Project name field for you. You can change it to be more descriptive for your use. For example, `dbt Learn - BigQuery Setup`.

## Create BigQuery datasets

1. Verify that you can run SQL queries. Copy and paste these queries into the Query Editor: 
    ```sql
    select * from `dbt-tutorial.jaffle_shop.customers`;
    select * from `dbt-tutorial.jaffle_shop.orders`;
    select * from `dbt-tutorial.stripe.payment`;
    ```

    Then, check for results from the queries. For example: 
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/bigquery/query-results.png" title="Bigquery Query Results" />
    </div>
2. Create [new BigQuery datasets](https://cloud.google.com/bigquery/docs/datasets#create-dataset). Datasets in BigQuery are equivalent to schemas in a traditional database. On the **Create dataset** page:
    - **Dataset ID** &mdash; Enter a name that fits the purpose. This name is used like schema in fully qualified references to your database objects such as database.schema.table. As an example for this guide, create one for jaffle_shop and another one for stripe afterward.
    - **Data location** &mdash; Leave it blank (the default). It determines the GCP location of where your data is stored. The current default location is the US multi-region. All tables within this dataset will share this location.
    - **Enable table expiration** &mdash; Leave it unselected (the default). The default for the billing table expiration is 60 days. Because billing isn’t enabled for this project, GCP defaults to deprecating tables.
    - **Google-managed encryption key** &mdash; Allow Google to manage encryption (the default).
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
    - Click **Continue** in the popup to create a new service account.
2. [Create a service account](https://developers.google.com/workspace/guides/create-credentials#service-account). As an example for this guide, you can:
    - Enter `dbt-user` as the **Service account name**
    - From the **Select a role** dropdown, choose **BigQuery Admin** 
    - Leave the **Grant users access to this service account** fields blank
3. [Create a service account key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating). When downloading the JSON file, make sure to use a filename you can easily remember. For example, `dbt-user-creds.json`. 

## Connect dbt Cloud to BigQuery​
1. Create a new project in [dbt Cloud](https://cloud.getdbt.com/). From **Account settings** (using the gear menu in the top right corner), click **+ New Project**.
2. Enter a project name and click **Continue**.
3. For the warehouse, click **BigQuery** then **Next** to set up your connection.
4. Click **Upload a Service Account JSON File** in settings.
5. Select the JSON file you downloaded in [Generate BigQuery credentials](#generate-bigquery-credentials) and dbt Cloud will fill in all the necessary fields.
6. Click **Test Connection**. This verifies that dbt Cloud can access your BigQuery account.
7. Click **Continue if the test succeeded**. If it failed, you might need to go back and regenerate your BigQuery credentials.

## Set up a dbt Cloud managed repository 
dbt Cloud uses Git for version control, but using a managed repository makes this easier. To set up a managed repository:

1. Under "Add repository from", select **Managed**.
2. Enter a name for your repo such as `bbaggins-dbt-quickstart`
3. Click **Create**. It takes a few seconds for your repository to be created and imported.
4. When you see the "Successfully imported repository," click **Continue**.

## Initialize your dbt project​ and start developing
Now that you have a repository configured, you can initialize your project and start development in dbt Cloud:

1. Click **Develop** from the upper left. It might take a few minutes for your project to spin up for the first time as it establishes your git connection, clones your repo, and tests the connection to the warehouse.
2. Above the file tree to the left, click **Initialize your project**. This builds out your folder structure with example models.
3. Make your initial commit by clicking **Commit**. Use the commit message `initial commit`. This creates the first commit to your managed repo and allows you to open a branch where you can add new dbt code.
4. You can now directly query data from your warehouse and execute `dbt run`. You can try this out now:
    - Delete all text in `Scratchpad 1` and add the query `select * from `dbt-tutorial.jaffle_shop.customers` to it.
    - In the command line bar at the bottom, enter `dbt run` and click **Enter**. 

## Build your first model
1. Click **Develop** from the upper left of dbt Cloud. You need to create a new branch since the main branch is now set to read-only mode. 
2. Click **Create branch**. You can name it `add-customers-model`.
3. Click **Develop** from the upper left of dbt Cloud.
4. Click the **...** next to the Models directory, then select **Create file**.  
5. Name the file `models/customers.sql`, then click **Create**.
6. Copy the following query into the file and click **Save File**.

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

7. Enter `dbt run` in the command prompt at the bottom of the screen. You should get a successful run and see three models under DETAILS.

Later, you can connect your business intelligence (BI) tools to these views and tables so they only read cleaned up data rather than raw data in your BI tool.

## Change the way your model is materialized

<Snippet src="tutorial-change-way-model-materialized" />

## Delete the example models

<Snippet src="tutorial-delete-example-models" />

## Build models on top of other models

<Snippet src="tutorial-build-models-atop-other-models" />

## Add tests to your models

<Snippet src="tutorial-add-tests-to-models" />

## Document your models

<Snippet src="tutorial-document-your-models" />

3. Click the link above the file tree in the Develop interface to launch documentation in a new tab.

Now that tests and docs are set up for your project, you can check out [these exercises](/docs/get-started/dbt-cloud/exercises#tests-docs) to learn more about what you can do with dbt.

#### FAQs

<FAQ src="Docs/long-descriptions" />
<FAQ src="Docs/sharing-documentation" />

## Commit your changes

Now that you've built your customer model, you need to commit the changes you made to the project so that the repository has your latest code.

1. Click **Commit** and add a message. For example, "Add customers model, tests, docs."
2. Click **merge to main** To add these changes to the main branch on your repo.

## Create a deployment environment

1. In the upper left, select **Deploy**, then click **Environments**.
2. Click **Create Environment**.
3. Name your deployment environment. For example, "Production."
4. Add a target dataset, for example, "Analytics." dbt will build into this dataset. For some warehouses this will be named "schema."
5. Click **Save**.

## Create and run a job

Jobs are a set of dbt commands that you want to run on a schedule. For example, `dbt run` and `dbt test`.

As the `jaffle_shop` business gains more customers, and those customers create more orders, you will see more records added to your source data. Because you materialized the customers model as a table, you'll need to periodically rebuild your table to ensure that the data stays up-to-date. This update will happen when you run a job.

1. After creating your deployment environment, you should be directed to the page for new environment. If not, select **Deploy** in the upper left, then click **Jobs**.
2. Click **Create one** and provide a name, for example `Production run`, and link to the Environment you just created.
3. Scroll down to "Execution Settings" and select **Generate docs on run**.
4. Under "Commands," add these commands as part of your job if you don't see them:
      * `dbt run`
      * `dbt test`
5. For this exercise, _do not_ set a schedule for your project to run. While your organization's project should run regularly, there's no need to run this example project on a schedule.
6. Select **Save**, then click **Run now** to run your job.
7. Click the run and watch its progress under "Run history."
8. Once the run is complete, click **View Documentation** to see the docs for your project.

:::tip
Congratulations 🎉! You've just deployed your first dbt project!
:::

Now that you have a runnable dbt project, you can check out [these exercises](/docs/get-started/dbt-cloud/exercises#advanced) to learn more about what you can do with dbt.

### FAQs

<FAQ src="Runs/failed-prod-run" />
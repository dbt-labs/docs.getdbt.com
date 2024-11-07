---
title: "Quickstart for dbt Cloud and Teradata"
id: "teradata"
level: 'Beginner'
icon: 'teradata'
tags: ['dbt Cloud','Quickstart','Teradata']
hide_table_of_contents: true
---

<div style={{maxWidth:'900px'}}>

## Introduction

In this quickstart guide, you'll learn how to use dbt Cloud with Teradata Vantage. It will show you how to:

- Create a new Teradata Clearscape instance
- Load sample data into your Teradata Database
- Connect dbt Cloud to Teradata.
- Take a sample query and turn it into a model in your dbt project. A model in dbt is a select statement.
- Add tests to your models.
- Document your models.
- Schedule a job to run.

:::tip Videos for you
You can check out [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals) for free if you're interested in course learning with videos.
:::

### Prerequisites​

- You have a [dbt Cloud account](https://www.getdbt.com/signup/).
- You have access to a Teradata Vantage instance. You can provision one for free at https://clearscape.teradata.com. See [the ClearScape Analytics Experience guide](https://developers.teradata.com/quickstarts/get-access-to-vantage/clearscape-analytics-experience/getting-started-with-csae/) for details.

### Related content

- Learn more with [dbt Learn courses](https://learn.getdbt.com)
- [How we provision Teradata Clearscape Vantage instance](https://developers.teradata.com/quickstarts/get-access-to-vantage/clearscape-analytics-experience/getting-started-with-csae/)
- [CI jobs](/docs/deploy/continuous-integration)
- [Deploy jobs](/docs/deploy/deploy-jobs)
- [Job notifications](/docs/deploy/job-notifications)
- [Source freshness](/docs/deploy/source-freshness)

## Load data

The following steps will guide you through how to get the data stored as CSV files in a public S3 bucket and insert it into the tables.

:::tip SQL IDE

If you created your Teradata Vantage database instance at https://clearscape.teradata.com and you don't have an SQL IDE handy, use the JupyterLab bundled with your database to execute SQL:

1. Navigate to [ClearScape Analytics Experience dashboard](https://clearscape.teradata.com/dashboard) and click the **Run Demos** button. The demo will launch JupyterLab.

2. In JupyterLab, go to **Launcher** by clicking the blue **+** icon in the top left corner. Find the **Notebooks** section and click **Teradata SQL**.

3. In the notebook's first cell, connect to the database using `connect` magic. You will be prompted to enter your database password when you execute it:
   ```ipynb
   %connect local
   ```
4. Use additional cells to type and run SQL statements.

:::

1. Use your preferred SQL IDE editor to create the database, `jaffle_shop`:

   ```sql
   CREATE DATABASE jaffle_shop AS PERM = 1e9;
   ```

2. In `jaffle_shop` database, create three foreign tables and reference the respective csv files located in object storage:

    ```sql
    CREATE FOREIGN TABLE jaffle_shop.customers (
        id integer,
        first_name varchar (100),
        last_name varchar (100),
        email varchar (100)
    )
    USING (
        LOCATION ('/gs/storage.googleapis.com/clearscape_analytics_demo_data/dbt/raw_customers.csv')
    )
    NO PRIMARY INDEX;

    CREATE FOREIGN TABLE jaffle_shop.orders (
        id integer,
        user_id integer,
        order_date date,
        status varchar(100)
    )
    USING (
        LOCATION ('/gs/storage.googleapis.com/clearscape_analytics_demo_data/dbt/raw_orders.csv')
    )
    NO PRIMARY INDEX;

    CREATE FOREIGN TABLE jaffle_shop.payments (
        id integer,
        orderid integer,
        paymentmethod varchar (100),
        amount integer
    )
    USING (
        LOCATION ('/gs/storage.googleapis.com/clearscape_analytics_demo_data/dbt/raw_payments.csv')
    )
    NO PRIMARY INDEX;
    ```

## Connect dbt Cloud to Teradata

1. Create a new project in dbt Cloud. From **Account settings** (using the gear menu in the top right corner), click **New Project**. 
2. Enter a project name and click **Continue**.
3. In **Configure your development environment**, click **Add new connection**.
4. Select **Teradata**, fill in all the required details in the **Settings** section, and test the connection.

  <Lightbox src="/img/teradata/dbt_cloud_teradata_setup_connection_start.png" title="dbt Cloud - Choose Teradata Connection" />
  
  <Lightbox src="/img/teradata/dbt_cloud_teradata_account_settings.png" title="dbt Cloud - Teradata Account Settings" />

5. Enter your **Development Credentials** for Teradata with:
   * **Username** &mdash; The username of Teradata database.
   * **Password** &mdash; The password of Teradata database.
   * **Schema** &mdash; The default database to use
  
   <Lightbox src="/img/teradata/dbt_cloud_teradata_development_credentials.png" title="dbt Cloud - Teradata Development Credentials" />

6. Click **Test Connection** to verify that dbt Cloud can access your Teradata Vantage instance.
7. If the connection test succeeds, click **Next**. If it fails, check your Teradata settings and credentials.

## Set up a dbt Cloud managed repository

<Snippet path="tutorial-managed-repo" />

## Initialize your dbt project​ and start developing

Now that you have a repository configured, you can initialize your project and start development in dbt Cloud:

1. Click **Start developing in the IDE**. It might take a few minutes for your project to spin up for the first time as it establishes your git connection, clones your repo, and tests the connection to the warehouse.
2. Above the file tree to the left, click **Initialize your project** to build out your folder structure with example models.
3. Make your initial commit by clicking **Commit and sync**. Use the commit message `initial commit` to create the first commit to your managed repo. Once you’ve created the commit, you can open a branch to add new dbt code.

## Delete the example models

You can now delete the files that dbt created when you initialized the project:

1. Delete the `models/example/` directory.
2. Delete the `example:` key from your `dbt_project.yml` file, and any configurations that are listed under it.

    <File name='dbt_project.yml'>

    ```yaml
    # before
    models:
      my_new_project:
        +materialized: table
        example:
          +materialized: view
    ```

    </File>

    <File name='dbt_project.yml'>

    ```yaml
    # after
    models:
      my_new_project:
        +materialized: table
    ```

    </File>

3. Save your changes.
4. Commit your changes and merge to the main branch.

#### FAQs

<FAQ path="Models/removing-deleted-models" />
<FAQ path="Troubleshooting/unused-model-configurations" />


## Build your first model

You have two options for working with files in the dbt Cloud IDE:

- Create a new branch (recommended) &mdash; Create a new branch to edit and commit your changes. Navigate to **Version Control** on the left sidebar and click **Create branch**.
- Edit in the protected primary branch &mdash; If you prefer to edit, format, lint files, or execute dbt commands directly in your primary git branch. The dbt Cloud IDE prevents commits to the protected branch, so you will receive a prompt to commit your changes to a new branch.

Name the new branch `add-customers-model`.

1. Click the **...** next to the `models` directory, then select **Create file**. 
2. Name the file `bi_customers.sql`, then click **Create**.
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

   left join customer_orders on customers.customer_id = customer_orders.customer_id

)

select * from final

```

4. Enter `dbt run` in the command prompt at the bottom of the screen. You should get a successful run and see the three models.

You can connect your business intelligence (BI) tools to these views and tables so they only read cleaned-up data rather than raw data in your BI tool.

## Change the way your model is materialized

One of the most powerful features of dbt is that you can change the way a model is materialized in your warehouse, simply by changing a configuration value.  You can change things between tables and views by changing a keyword rather than writing the data definition language (DDL) to do this behind the scenes.

By default, everything gets created as a view. You can override that at the directory level so everything in that directory will materialize to a different materialization.

1. Edit your `dbt_project.yml` file.
    - Update your project `name` to:
      <File name='dbt_project.yml'>

      ```yaml
      name: 'jaffle_shop'
      ```

      </File>
    - Configure `jaffle_shop` so everything in it will be materialized as a table; and configure `example` so everything in it will be materialized as a view. Update your `models` config block to:

      <File name='dbt_project.yml'>

      ```yaml
      models:
        jaffle_shop:
          +materialized: table
      ```

      </File>
    - Click **Save**.

2. Enter the `dbt run` command. Your `bi_customers` model should now be built as a table!
    :::info
    To do this, dbt had to first run a `drop view` statement (or API call on BigQuery), then a `create table as` statement.
    :::

3. Edit `models/bi_customers.sql`  to override the `dbt_project.yml` for the `customers` model only by adding the following snippet to the top, and click **Save**:  

    <File name='models/bi_customers.sql'>

    ```sql
    {{
      config(
        materialized='view'
      )
    }}

    with customers as (

        select
            id as customer_id
            ...

    )

    ```

    </File>

4. Enter the `dbt run` command. Your model, `bi_customers`, should now build as a view. 

### FAQs

<FAQ path="Models/available-materializations" />
<FAQ path="Project/which-materialization" />
<FAQ path="Models/available-configurations" />

## Build models on top of other models

<Snippet path="quickstarts/intro-build-models-atop-other-models" />

1. Create a new SQL file, `models/stg_customers.sql`, with the SQL from the `customers` CTE in your original query.
   <File name='models/stg_customers.sql'>

   ```sql
   select
      id as customer_id,
      first_name,
      last_name

   from jaffle_shop.customers
   ```

   </File>

2. Create a second new SQL file, `models/stg_orders.sql`, with the SQL from the `orders` CTE in your original query.
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

3. Edit the SQL in your `models/bi_customers.sql` file as follows:

   <File name='models/bi_customers.sql'>

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

   This time, when you performed a `dbt run`, it created separate views/tables for `stg_customers`, `stg_orders`, and `customers`. dbt inferred the order in which these models should run. Because `customers` depends on `stg_customers` and `stg_orders`, dbt builds `customers` last. You don’t need to define these dependencies explicitly.

#### FAQs {#faq-2}

<FAQ path="Runs/run-one-model" />
<FAQ path="Project/unique-resource-names" />
<FAQ path="Project/structure-a-project" alt_header="As I create more models, how should I keep my project organized? What should I name my models?" />

## Build models on top of sources

Sources make it possible to name and describe the data loaded into your warehouse by your extract and load tools. By declaring these tables as sources in dbt, you can:
- Select from source tables in your models using the `{{ source() }}` function, helping define the lineage of your data
- Test your assumptions about your source data
- Calculate the freshness of your source data

1. Create a new YML file, `models/sources.yml`.
2. Declare the sources by copying the following into the file and clicking **Save**.

   <File name='models/sources.yml'>

   ```yml
   version: 2

   sources:
      - name: jaffle_shop
        description: This is a replica of the Postgres database used by the app
        database: raw
        schema: jaffle_shop
        tables:
            - name: customers
              description: One record per customer.
            - name: orders
              description: One record per order. Includes canceled and deleted orders.
   ```

   </File>

3. Edit the `models/stg_customers.sql` file to select from the `customers` table in the `jaffle_shop` source.

   <File name='models/stg_customers.sql'>

   ```sql
   select
      id as customer_id,
      first_name,
      last_name

   from {{ source('jaffle_shop', 'customers') }}
   ```

   </File>

4. Edit the `models/stg_orders.sql` file to select from the `orders` table in the `jaffle_shop` source.

   <File name='models/stg_orders.sql'>

   ```sql
   select
      id as order_id,
      user_id as customer_id,
      order_date,
      status

   from {{ source('jaffle_shop', 'orders') }}
   ```

   </File>

5. Execute `dbt run`.

   Your `dbt run` results will be the same as those in the previous step. Your `stg_customers` and `stg_orders`
   models will still query from the same raw data source in Teradata. By using `source`, you can
   test and document your raw data and also understand the lineage of your sources.


</div>

## Add tests to your models

Adding [tests](/docs/build/data-tests) to a project helps validate that your models are working correctly.

To add tests to your project:

1. Create a new YAML file in the `models` directory, named `models/schema.yml`
2. Add the following contents to the file:

    <File name='models/schema.yml'>

    ```yaml
    version: 2

    models:
      - name: bi_customers
        columns:
          - name: customer_id
            tests:
              - unique
              - not_null

      - name: stg_customers
        columns:
          - name: customer_id
            tests:
              - unique
              - not_null

      - name: stg_orders
        columns:
          - name: order_id
            tests:
              - unique
              - not_null
          - name: status
            tests:
              - accepted_values:
                  values: ['placed', 'shipped', 'completed', 'return_pending', 'returned']
          - name: customer_id
            tests:
              - not_null
              - relationships:
                  to: ref('stg_customers')
                  field: customer_id

    ```

    </File>

3. Run `dbt test`, and confirm that all your tests passed.

When you run `dbt test`, dbt iterates through your YAML files, and constructs a query for each test. Each query will return the number of records that fail the test. If this number is 0, then the test is successful.

#### FAQs

<FAQ path="Tests/available-tests" alt_header="What tests are available for me to use in dbt? Can I add my own custom tests?" />
<FAQ path="Tests/test-one-model" />
<FAQ path="Runs/failed-tests" />
<FAQ path="Project/schema-yml-name" alt_header="Does my test file need to be named `schema.yml`?" />
<FAQ path="Project/why-version-2" />
<FAQ path="Tests/recommended-tests" />
<FAQ path="Tests/when-to-test" />


## Document your models

Adding [documentation](/docs/build/documentation) to your project allows you to describe your models in rich detail, and share that information with your team. Here, we're going to add some basic documentation to our project.

1. Update your `models/schema.yml` file to include some descriptions, such as those below.

    <File name='models/schema.yml'>

    ```yaml
    version: 2

    models:
      - name: bi_customers
        description: One record per customer
        columns:
          - name: customer_id
            description: Primary key
            tests:
              - unique
              - not_null
          - name: first_order_date
            description: NULL when a customer has not yet placed an order.

      - name: stg_customers
        description: This model cleans up customer data
        columns:
          - name: customer_id
            description: Primary key
            tests:
              - unique
              - not_null

      - name: stg_orders
        description: This model cleans up order data
        columns:
          - name: order_id
            description: Primary key
            tests:
              - unique
              - not_null
          - name: status
            tests:
              - accepted_values:
                  values: ['placed', 'shipped', 'completed', 'return_pending', 'returned']
          - name: customer_id
            tests:
              - not_null
              - relationships:
                  to: ref('stg_customers')
                  field: customer_id
    ```

    </File>

2. Run `dbt docs generate` to generate the documentation for your project. dbt introspects your project and your warehouse to generate a <Term id="json" /> file with rich documentation about your project.


3. Click the book icon in the Develop interface to launch documentation in a new tab.

#### FAQs

<FAQ path="Docs/long-descriptions" />
<FAQ path="Docs/sharing-documentation" />



## Commit your changes

Now that you've built your customer model, you need to commit the changes you made to the project so that the repository has your latest code.

**If you edited directly in the protected primary branch:**<br />
1. Click the **Commit and sync git** button. This action prepares your changes for commit.
2. A modal titled **Commit to a new branch** will appear.
3. In the modal window, name your new branch `add-customers-model`. This branches off from your primary branch with your new changes.
4. Add a commit message, such as "Add customers model, tests, docs" and commit your changes.
5. Click **Merge this branch to main** to add these changes to the main branch on your repo.


**If you created a new branch before editing:**<br />
1. Since you already branched out of the primary protected branch, go to  **Version Control** on the left.
2. Click **Commit and sync** to add a message.
3. Add a commit message, such as "Add customers model, tests, docs."
4. Click **Merge this branch to main** to add these changes to the main branch on your repo.

## Deploy dbt

Use dbt Cloud's Scheduler to deploy your production jobs confidently and build observability into your processes. You'll learn to create a deployment environment and run a job in the following steps.

### Create a deployment environment

1. In the upper left, select **Deploy**, then click **Environments**.
2. Click **Create Environment**.
3. In the **Name** field, write the name of your deployment environment. For example, "Production."
4. In the **dbt Version** field, select the latest version from the dropdown.
5. Under **Deployment connection**, enter the name of the dataset you want to use as the target, such as `jaffle_shop_prod`. This will allow dbt to build and work with that dataset.
6. Click **Save**.

### Create and run a job

Jobs are a set of dbt commands that you want to run on a schedule. For example, `dbt build`.

As the `jaffle_shop` business gains more customers, and those customers create more orders, you will see more records added to your source data. Because you materialized the `bi_customers` model as a table, you'll need to periodically rebuild your table to ensure that the data stays up-to-date. This update will happen when you run a job.

1. After creating your deployment environment, you should be directed to the page for a new environment. If not, select **Deploy** in the upper left, then click **Jobs**.
2. Click **+ Create job** and then select **Deploy job**. Provide a name, for example, "Production run", and link it to the Environment you just created.
3. Scroll down to the **Execution Settings** section.
4. Under **Commands**, add this command as part of your job if you don't see it:
   * `dbt build`
5. Select the **Generate docs on run** checkbox to automatically [generate updated project docs](/docs/collaborate/build-and-view-your-docs) each time your job runs. 
6. For this exercise, do _not_ set a schedule for your project to run &mdash; while your organization's project should run regularly, there's no need to run this example project on a schedule. Scheduling a job is sometimes referred to as _deploying a project_.
7. Select **Save**, then click **Run now** to run your job.
8. Click the run and watch its progress under "Run history."
9. Once the run is complete, click **View Documentation** to see the docs for your project.


Congratulations 🎉! You've just deployed your first dbt project!


#### FAQs

<FAQ path="Runs/failed-prod-run" />




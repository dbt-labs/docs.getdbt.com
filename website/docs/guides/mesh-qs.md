---
title: "Quickstart with dbt Mesh"
id: "mesh-qs"
level: 'Intermediate'
icon: 'guides'
tags: ['dbt Cloud','Quickstart']
hide_table_of_contents: true
---

<div style={{maxWidth: '900px'}}>

## Introduction

dbt Mesh is a framework that helps organizations scale their teams and data assets effectively. It promotes governance best practices and breaks large projects into manageable sections &mdash; for faster data development. dbt Mesh is available for [dbt Cloud Enterprise](https://www.getdbt.com/) accounts.

This guide will teach you how to set up a multi-project design using foundational concepts of [dbt Mesh](https://www.getdbt.com/blog/what-is-data-mesh-the-definition-and-importance-of-data-mesh) and how to implement a data mesh in dbt Cloud:

- Set up a foundational project called “Jaffle | Data Analytics”
- Set up a downstream project called “Jaffle | Finance”
- Add model access, versions, and contracts
- Set up a dbt Cloud job that is triggered on completion of an upstream job
 
For more information on why data mesh is important, read this post: [What is data mesh? The definition and importance of data mesh](https://www.getdbt.com/blog/what-is-data-mesh-the-definition-and-importance-of-data-mesh).

:::tip Videos for you
You can check out [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals) for free if you're interested in course learning with videos.

You can also watch the [YouTube video on dbt and Snowflake](https://www.youtube.com/watch?v=kbCkwhySV_I&list=PL0QYlrC86xQm7CoOH6RS7hcgLnd3OQioG).
:::

### Related content:
- [Data mesh concepts: What it is and how to get started](https://www.getdbt.com/blog/data-mesh-concepts-what-it-is-and-how-to-get-started)
- [Deciding how to structure your dbt Mesh](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-3-structures)
- [dbt Mesh best practices guide](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-4-implementation)
- [dbt Mesh FAQs](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-5-faqs)

## Prerequisites​

To leverage dbt Mesh, you need the following:

- You must have a [dbt Cloud Enterprise account](https://www.getdbt.com/get-started/enterprise-contact-pricing) <Lifecycle status="enterprise"/>
- You have access to a cloud data platform, permissions to load the sample data tables, and dbt Cloud permissions to create new projects. 
- Set your development and deployment [environments](/docs/dbt-cloud-environments) to use dbt [version](/docs/dbt-versions/core) 1.6 or later. You can also opt to go ["Versionless"](/docs/dbt-versions/upgrade-dbt-version-in-cloud#versionless) to always get the most recent features and functionality.
- This guide uses the Jaffle Shop sample data, including `customers`, `orders`, and `payments` tables. Follow the provided instructions to load this data into your respective data platform:
  - [Snowflake](https://docs.getdbt.com/guides/snowflake?step=3)
  - [Databricks](https://docs.getdbt.com/guides/databricks?step=3)
  - [Redshift](https://docs.getdbt.com/guides/redshift?step=3)
  - [BigQuery](https://docs.getdbt.com/guides/bigquery?step=3)
  - [Fabric](https://docs.getdbt.com/guides/microsoft-fabric?step=2)
  - [Starburst Galaxy](https://docs.getdbt.com/guides/starburst-galaxy?step=2)

This guide assumes you have experience with or fundamental knowledge of dbt. Take the [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals) course first if you are brand new to dbt.

## Create and configure two projects

In this section, you'll create two new, empty projects in dbt Cloud to serve as your foundational and downstream projects:

- **Foundational projects** (or upstream projects) typically contain core models and datasets that serve as the base for further analysis and reporting.
- **Downstream projects** build on these foundations, often adding more specific transformations or business logic for dedicated teams or purposes. 

For example, the always-enterprising and fictional account "Jaffle Labs" will create two projects for their data analytics and finance team: Jaffle | Data Analytics and Jaffle | Finance.

<Lightbox src="/img/guides/dbt-mesh/project_names.png" width="50%" title="Create two new dbt Cloud projects named 'Jaffle | Data Analytics' and 'Jaffle Finance' " />

To [create](/docs/cloud/about-cloud-setup) a new project in dbt Cloud:

1. From **Account settings**, click **+ New Project**.
2. Enter a project name and click **Continue**.
   - Use "Jaffle | Data Analytics" for one project
   - Use "Jaffle | Finance" for the other project
3. Select your data platform, then **Next** to set up your connection.
4. In the **Configure your environment** section, enter the **Settings** for your new project.
5. Click **Test Connection**. This verifies that dbt Cloud can access your data platform account.
6. Click **Next** if the test succeeded. If it fails, you might need to go back and double-check your settings.
   - For this guide, make sure you create a single [development](/docs/dbt-cloud-environments#create-a-development-environment) and [Deployment](/docs/deploy/deploy-environments) per project.
     - For "Jaffle | Data Analytics", set the default database to `jaffle_da`.
     - For "Jaffle | Finance", set the default database to `jaffle_finance`

<Lightbox src="/img/guides/dbt-mesh/create-new-project.gif" width="80%" title="Navigate to 'Account settings' and then click + 'New Project' to create new projects in dbt Cloud" /> 

7. Continue the prompts to complete the project setup. Once configured, each project should have:
    - A data platform connection
    - New git repo
    - One or more [environments](/docs/deploy/deploy-environments) (such as development, deployment)

### Create a production environment
In dbt Cloud, each project can have one deployment environment designated as "Production.". You must set up a ["Production" or "Staging" deployment environment](/docs/deploy/deploy-environments) for each project you want to "mesh" together. This enables you to leverage dbt Explorer in the [later steps](https://docs.getdbt.com/guides/mesh-qs?step=5#create-and-run-a-dbt-cloud-job) of this guide.

To set a production environment:
1. Navigate to **Deploy** -> **Environments**, then click **Create New Environment**.
2. Select **Deployment** as the environment type.
3. Under **Set deployment type**, select the **Production** button.
4. Select the dbt version.
5. Continue filling out the fields as necessary in the **Deployment connection** and **Deployment credentials** sections.
6. Click **Test Connection** to confirm the deployment connection.
6. Click **Save** to create a production environment.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/prod-settings.jpg" width="70%" title="Set your production environment as the default environment in your Environment Settings"/>


## Set up a foundational project

This upstream project is where you build your core data assets. This project will contain the raw data sources, staging models, and core business logic.

dbt Cloud enables data practitioners to develop in their tool of choice and comes equipped with a local [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) or in-browser [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud).

In this section of the guide, you will set the "Jaffle | Data Analytics" project as your foundational project using the dbt Cloud IDE.

1. First, navigate to the **Develop** page to verify your setup.
2. Click **Initialize dbt project** if you’ve started with an empty repo:

<Lightbox src="/img/guides/dbt-mesh/initialize_repo.png" width="40%" title="Initialize repo" />

3. Delete the `models/example` folder.  
4. Navigate to the `dbt_project.yml` file and rename the project (line 5) from `my_new_project` to `analytics`.
5. In your `dbt_project.yml` file, remove lines 39-42 (the `my_new_project` model reference).
6. In the **File Explorer**, hover over the project directory and click the **...**, then select **Create file**.
7. Create two new folders: `models/staging` and `models/core`.


### Staging layer
Now that you've set up the foundational project, let's start building the data assets. Set up the staging layer as follows:

1. Create a new YAML file `models/staging/sources.yml`.
2. Declare the sources by copying the following into the file and clicking **Save**.

  <File name='models/staging/sources.yml'>

  ```yaml
  version: 2

  sources:
    - name: jaffle_shop
      description: This is a replica of the Postgres database used by our app
      database: raw
      schema: jaffle_shop
      tables:
        - name: customers
          description: One record per customer.
        - name: orders
          description: One record per order. Includes cancelled and deleted orders.
  ```
  </File>

3. Create a `models/staging/stg_customers.sql` file to select from the `customers` table in the `jaffle_shop` source.

  <File name='models/staging/stg_customers.sql'>

  ```sql
  select
      id as customer_id,
      first_name,
      last_name

  from {{ source('jaffle_shop', 'customers') }}
  ```
  </File>

4. Create a `models/staging/stg_orders.sql` file to select from the `orders` table in the `jaffle_shop` source.

  <File name='models/staging/stg_orders.sql'>

  ```sql
  select
      id as order_id,
      user_id as customer_id,
      order_date,
      status

  from {{ source('jaffle_shop', 'orders') }}
  ```
  </File>

5. Create a `models/core/fct_orders.sql` file to build a fact table with customer and order details.

  <File name='models/core/fct_orders.sql'>

  ```sql
  with customers as (
      select * 
      from {{ ref('stg_customers') }}
  ),

  orders as (
      select * 
      from {{ ref('stg_orders') }}
  ),

  customer_orders as (
      select
          customer_id,
          min(order_date) as first_order_date
      from orders
      group by customer_id
  ),

  final as (
      select
          o.order_id,
          o.order_date,
          o.status,
          c.customer_id,
          c.first_name,
          c.last_name,
          co.first_order_date,
          -- Note that we've used a macro for this so that the appropriate DATEDIFF syntax is used for each respective data platform
          {{ datediff('first_order_date', 'order_date', 'day') }} as days_as_customer_at_purchase
      from orders o
      left join customers c using (customer_id)
      left join customer_orders co using (customer_id)
  )

  select * from final
  ```
  </File>

6. Navigate to the **Command bar** and execute `dbt build`.

Before a downstream team can leverage assets from this foundational project, you need to first:
- [Create and define](/docs/collaborate/govern/model-access) at least one model as “public”
- Run a [deployment job](/docs/deploy/deploy-jobs) successfully
  - Note, Enable the **Generate docs on run** toggle for this job to update the dbt Explorer. Once run, you can click Explore from the upper menu bar and see your lineage, tests, and documentation coming through successfully.

## Define a public model and run first job

In the previous section, you've arranged your basic building blocks, now let's integrate dbt Mesh.

Although the Finance team requires the `fct_orders` model for analyzing payment trends, other models, particularly those in the staging layer used for data cleansing and joining, are not needed by downstream teams.

To make `fct_orders` publicly available:

1. In the `models/core/core.yml` file, add a `access: public` clause to the relevant YAML file by adding and saving the following:

  <File name='models/core/core.yml'>

  ```yaml
  version: 2

  models:
    - name: fct_orders
      access: public
      description: "Customer and order details"
      columns:
        - name: order_id
          data_type: number
          description: ""

        - name: order_date
          data_type: date
          description: ""

        - name: status
          data_type: varchar
          description: "Indicates the status of the order"

        - name: customer_id
          data_type: number
          description: ""

        - name: first_name
          data_type: varchar
          description: ""

        - name: last_name
          data_type: varchar
          description: ""

        - name: first_order_date
          data_type: date
          description: ""

        - name: days_as_customer_at_purchase
          data_type: number
          description: "Days between this purchase and customer's first purchase"
  ```
  </File>

Note: By default, model access is set to "protected", which means they can only be referenced within the same project. Learn more about access types and model groups [here](/docs/collaborate/govern/model-access#access-modifiers).

2. Navigate to the dbt Cloud IDE **Lineage** tab to see the model noted as **Public**, below the model name.

<Lightbox src="/img/guides/dbt-mesh/da_lineage.png" title="Jaffle | Data Analytics lineage" />

3. Go to **Version control** and click the **Commit and Sync** button to commit your changes.
4. Merge your changes to the main or production branch.

### Create and run a dbt Cloud job

Before a downstream team can leverage assets from this foundational project, you need to [create a production environment](https://docs.getdbt.com/guides/mesh-qs?step=3#create-a-production-environment) and run a [deployment job](/docs/deploy/deploy-jobs) successfully.

To run your first deployment dbt Cloud job, you will need to create a new dbt Cloud job.  
1. Click **Deploy** and then **Jobs**. 
2. Click **Create job** and then **Deploy job**.
3. Select the **Generate docs on run** option. This will reflect the state of this project in the **Explore** section.

<Lightbox src="/img/guides/dbt-mesh/generate_docs_on_run.png" width="75%" title=" Select the 'Generate docs on run' option when configuring your dbt Cloud job." />

4. Then, click **Run now** to trigger the job.
<Lightbox src="/img/guides/dbt-mesh/job_run_now.png" width="80%" title="Trigger a job by clicking the 'Run now' button." />

5. After the run is complete, click **Explore** from the upper menu bar. You should now see your lineage, tests, and documentation coming through successfully.

For details on how dbt Cloud uses metadata from the Staging environment to resolve references in downstream projects, check out the section on [Staging with downstream dependencies](/docs/collaborate/govern/project-dependencies#staging-with-downstream-dependencies).

## Reference a public model in your downstream project

In this section, you will set up the downstream project, "Jaffle | Finance", and [cross-project reference](/docs/collaborate/govern/project-dependencies) the `fct_orders` model from the foundational project. Navigate to the **Develop** page to set up our project:

1. If you’ve also started with a new git repo, click **Initialize dbt project** under the **Version control** section.
2. Delete the `models/example` folder
3. Navigate to the dbt_project.yml file and rename the project (line 5) from `my_new_project` to `finance`
4. Navigate to the `dbt_project.yml` file and remove lines 39-42 (the `my_new_project` model reference).
5. In the **File Explorer**, hover over the project directory, click the **...** and Select **Create file**.
6. Name the file `dependencies.yml`.

<Lightbox src="/img/guides/dbt-mesh/finance_create_file.png" width="70%" title="Create file in the dbt Cloud IDE." />

6. Add the upstream `analytics` project and the `dbt_utils` package. Click **Save**.

  <File name='dependencies.yml'>

  ```yaml

  packages:
    - package: dbt-labs/dbt_utils
      version: 1.1.1

  projects:
    - name: analytics

  ```
  </File>

### Staging layer

Now that you've set up the foundational project, let's start building the data assets. Set up the staging layer as follows:

1. Create a new YAML file `models/staging/sources.yml` and declare the sources by copying the following into the file and clicking **Save**.

    <File name='models/staging/sources.yml'>

    ```yml
    version: 2

    sources:
      - name: stripe
        database: raw
        schema: stripe 
        tables:
          - name: payment
    ```

    </File>

2. Create `models/staging/stg_payments.sql` to select from the `payment` table in the `stripe` source.

    <File name='models/staging/stg_payments.sql'>

    ```sql

    with payments as (
        select * from {{ source('stripe', 'payment') }}
    ),

    final as (
        select 
            id as payment_id,
            orderID as order_id,
            paymentMethod as payment_method,
            amount,
            created as payment_date 
        from payments
    )

    select * from final

    ```

    </File>

### Reference the public model

You're now set to add a model that explores how payment types vary throughout a customer's journey. This helps determine whether coupon gift cards decrease with repeat purchases, as our marketing team anticipates, or remain consistent.

1. To reference the model, use the following logic to ascertain this:

    <File name='models/core/agg_customer_payment_journey.sql'>

    ```sql

    with stg_payments as (
        select * from {{ ref('stg_payments') }}
    ),

    fct_orders as (
        select * from {{ ref('analytics', 'fct_orders') }}
    ),

    final as (
        select 
            days_as_customer_at_purchase,
            -- we use the pivot macro in the dbt_utils package to create columns that total payments for each method
            {{ dbt_utils.pivot(
                'payment_method',
                dbt_utils.get_column_values(ref('stg_payments'), 'payment_method'),
                agg='sum',
                then_value='amount',
                prefix='total_',
                suffix='_amount'
            ) }}, 
            sum(amount) as total_amount
        from fct_orders
        left join stg_payments using (order_id)
        group by 1
    )

    select * from final

    ```

    </File> 

2. Notice the cross-project ref at work! When you add the `ref`, the dbt Cloud IDE's auto-complete feature recognizes the public model as available.
<Lightbox src="/img/guides/dbt-mesh/cross_proj_ref_autocomplete.png" title="Cross-project ref autocomplete in the dbt Cloud IDE" />

3. This automatically resolves (or links) to the correct database, schema, and table/view set by the upstream project.
<Lightbox src="/img/guides/dbt-mesh/cross_proj_ref_compile.png" title="Cross-project ref compile" />

4. You can also see this connection displayed in the live **Lineage** tab.
<Lightbox src="/img/guides/dbt-mesh/cross_proj_ref_lineage.png" title="Cross-project ref lineage" />

## Add model versions and contracts

How can you enhance resilience and add guardrails to this type of multi-project relationship? You can adopt best practices from software engineering by:

1. Defining model contracts &mdash; Set up [model contracts](/docs/collaborate/govern/model-contracts) in dbt to define a set of upfront "guarantees" that define the shape of your model. While building your model, dbt will verify that your model's transformation will produce a dataset matching up with its contract; if not, the build fails.
2. Defining model versions &mdash; Use [model versions](/docs/collaborate/govern/model-versions) to manage updates and handle breaking changes systematically.

### Set up model contracts
As part of the Data Analytics team, you may want to ensure the `fct_orders` model is reliable for downstream users, like the Finance team.

1. Navigate to `models/core/core.yml` and under the `fct_orders` model before the `columns:` section, add a data contract to enforce reliability:

```yaml
models:
  - name: fct_orders
    access: public
    description: “Customer and order details”
    config:
      contract:
        enforced: true
    columns:
      - name: order_id
        .....
```

2. Test what would happen if this contract were violated. In `models/core/fct_orders.sql`, comment out the `orders.status` column and click **Build** to try building the model.
   - If the contract is breached, the build fails, as seen in the command bar history.
    <Lightbox src="/img/guides/dbt-mesh/break_contract.png" title="The data contract was breached and the dbt build run failed." />


### Set up model versions
In this section, you will set up model versions by the Data Analytics team as they upgrade the `fct_orders` model while offering backward compatibility and a migration notice to the downstream Finance team.

1. Rename the existing model file from `models/core/fct_orders.sql` to `models/core/fct_orders_v1.sql`.
2. Create a new file `models/core/fct_orders_v2.sql` and adjust the schema:
   - Comment out `o.status` in the `final` CTE.
   - Add a new field, `case when o.status = 'returned' then true else false end as is_return` to indicate if an order was returned.
3. Then, add the following to your `models/core/core.yml` file:
   - The `is_return` column
   - The two model `versions`
   - A `latest_version` to indicate which model is the latest (and should be used by default, unless specified otherwise)
   - A `deprecation_date` to version 1 as well to indicate when the model will be deprecated.

4. It should now read as follows:

<File name='models/core/core.yml'>

```yaml

version: 2

models:
  - name: fct_orders
    access: public
    description: "Customer and order details"
    latest_version: 2
    config:
      contract:
        enforced: true
    columns:
      - name: order_id
        data_type: number
        description: ""

      - name: order_date
        data_type: date
        description: ""

      - name: status
        data_type: varchar
        description: "Indicates the status of the order"

      - name: is_return
        data_type: boolean
        description: "Indicates if an order was returned"

      - name: customer_id
        data_type: number
        description: ""

      - name: first_name
        data_type: varchar
        description: ""

      - name: last_name
        data_type: varchar
        description: ""

      - name: first_order_date
        data_type: date
        description: ""

      - name: days_as_customer_at_purchase
        data_type: number
        description: "Days between this purchase and customer's first purchase"

    # Declare the versions, and highlight the diffs
    versions:
    
      - v: 1
        deprecation_date: 2024-06-30 00:00:00.00+00:00
        columns:
          # This means: use the 'columns' list from above, but exclude is_return
          - include: all
            exclude: [is_return]
        
      - v: 2
        columns:
          # This means: use the 'columns' list from above, but exclude status
          - include: all
            exclude: [status]
```

</File>

5. Verify how dbt compiles the `ref` statement based on the updates. Open a new file, add the following select statements, and click **Compile**. Note how each ref is compiled to the specified version (or the latest version if not specified).

```sql
select * from {{ ref('fct_orders', v=1) }}
select * from {{ ref('fct_orders', v=2) }}
select * from {{ ref('fct_orders') }}
```

## Add a dbt Cloud job in the downstream project
Before proceeding, make sure you commit and merge your changes in both the “Jaffle | Data Analytics” and “Jaffle | Finance” projects.

A member of the Finance team would like to schedule a dbt Cloud job for their customer payment journey analysis immediately after the data analytics team refreshes their pipelines.

1. In the “Jaffle | Finance” project, go to the **Jobs** page by navigating to **Deploy** and then **Jobs**. 
2. Then click **Create job** and then **Deploy job**.
3. Add a name for the job, then scroll to the bottom of the **Job completion** section.  
4. In **Job completion** section, configure the job to **Run when another job finishes** and select the upstream job from the “Jaffle | Data Analytics” project.
<Lightbox src="/img/guides/dbt-mesh/trigger_on_completion.png" title="Trigger job on completion" />

5. Click **Save** and verify the job is set up correctly.
6. Go to the “Jaffle | Data Analytics” jobs page. Select the **Daily job** and click **Run now**. 
7. Once this job completes successfully, go back to the “Jaffle | Finance” jobs page. You should see that the Finance team’s job was triggered automatically.

This simplifies the process of staying in sync with the upstream tables and removes the need for more sophisticated orchestration skills, such as coordinating jobs across projects via an external orchestrator.

## View deprecation warning

To find out how long the Finance team has to migrate from `fct_orders_v1` to `fct_orders_v2`, follow these steps:

1. In the “Jaffle | Finance” project, navigate to the **Develop** page.
2. Edit the cross-project ref to use v=1 in `models/marts/agg_customer_payment_journey.sql`:

<File name='models/core/agg_customer_payment_journey.sql'>

```sql

with stg_payments as (
    select * from {{ ref('stg_payments') }}
),

fct_orders as (
    select * from {{ ref('analytics', 'fct_orders', v=1) }}
),

final as (
    select 
        days_as_customer_at_purchase,
        -- we use the pivot macro in the dbt_utils package to create columns that total payments for each method
        {{ dbt_utils.pivot(
            'payment_method',
            dbt_utils.get_column_values(ref('stg_payments'), 'payment_method'),
            agg='sum',
            then_value='amount',
            prefix='total_',
            suffix='_amount'
        ) }}, 
        sum(amount) as total_amount
    from fct_orders
    left join stg_payments using (order_id)
    group by 1
)

select * from final
```

</File>

3. In the dbt Cloud IDE, go to **Version control** to commit and merge the changes.
4. Go to the **Deploy** and then **Jobs** page.
5. Click **Run now** to run the Finance job. The `agg_customer_payment_journey` model will build and display a deprecation date warning.

<Lightbox src="/img/guides/dbt-mesh/deprecation_date_warning.png" title="The model will display a deprecation date warning." />

## View lineage with dbt Explorer

Use [dbt Explorer](/docs/collaborate/explore-projects) to view the lineage across projects in dbt Cloud. Navigate to the **Explore** page for each of your projects &mdash; you should now view the [lineage seamlessly across projects](/docs/collaborate/explore-multiple-projects).

<Lightbox src="/img/guides/dbt-mesh/jaffle_da_final_lineage.png" width="85%" title="View 'Jaffle | Data Analytics' lineage with dbt Explorer " />

## What's next

<ConfettiTrigger>

Congratulations 🎉! You're ready to bring the benefits of dbt Mesh to your organization. You've learned:

- How to establish a foundational project "Jaffle | Data Analytics."
- Create a downstream project "Jaffle | Finance."
- Implement model access, versions, and contracts.
- Set up dbt Cloud jobs triggered by upstream job completions.

Here are some additional resources to help you continue your journey:

- [How we build our dbt mesh projects](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-1-intro)
- [dbt Mesh FAQs](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-5-faqs)
- [Implement dbt Mesh with the Semantic Layer](/docs/use-dbt-semantic-layer/sl-faqs#how-can-i-implement-dbt-mesh-with-the-dbt-semantic-layer)
- [Cross-project references](/docs/collaborate/govern/project-dependencies#how-to-write-cross-project-ref)
- [dbt Explorer](/docs/collaborate/explore-projects)

</ConfettiTrigger>

</div>

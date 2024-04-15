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

dbt Mesh is a framework that helps organizations scale their teams and data assets effectively. It promotes governance best practices and breaks large projects into manageable sections &mdash; for faster data development.

In this guide you’ll walk through how to set up a multi-project design using foundational concepts of [dbt Mesh](https://www.getdbt.com/blog/what-is-data-mesh-the-definition-and-importance-of-data-mesh). In this guide, you’ll:

- Set up a foundational project called “Jaffle | Data Analytics”
- Set up a downstream project called “Jaffle | Finance”
- Add model access, versions, and contracts
- Set up a dbt Cloud job that is triggered on completion of an upstream job
 
This guide explains how to implement a data mesh in dbt Cloud. For more information on why data mesh is important, read this post:[What is data mesh? The definition and importance of data mesh](https://www.getdbt.com/blog/what-is-data-mesh-the-definition-and-importance-of-data-mesh).

:::tip Videos for you
You can check out [dbt Fundamentals](https://courses.getdbt.com/courses/fundamentals) for free if you're interested in course learning with videos.

You can also watch the [YouTube video on dbt and Snowflake](https://www.youtube.com/watch?v=kbCkwhySV_I&list=PL0QYlrC86xQm7CoOH6RS7hcgLnd3OQioG).
:::

### Related content:
- [Data mesh concepts: What it is and how to get started](https://www.getdbt.com/blog/data-mesh-concepts-what-it-is-and-how-to-get-started)
- [Deciding how to structure your dbt Mesh](/best-practices/how-we-mesh/mesh-2-structures)
- [Implementation guide](m/best-practices/how-we-mesh/mesh-3-implementation)
- [dbt Mesh FAQs](/best-practices/how-we-mesh/mesh-4-faqs)

## Prerequisites​

To leverage dbt Mesh, you need the following:

- You must have a [dbt Cloud Enterprise account](https://www.getdbt.com/get-started/enterprise-contact-pricing) <Lifecycle status="enterprise"/>
- You have access to a cloud data platform, permissions to load the sample data tables, and dbt Cloud permissions to create new projects.
- Set dbt [version](/docs/dbt-versions/core) to 1.6 or later in your development and deployment [environments](/docs/dbt-cloud-environments) or select [Keep on latest version of](/docs/dbt-versions/upgrade-dbt-version-in-cloud#keep-on-latest-version) dbt. 
- Load the Jaffle Shop sample data (customers, orders, and payments tables) into your data platform. You can find the steps to do so for each platform, respectively, here:
  - [Snowflake](https://docs.getdbt.com/guides/snowflake?step=3)
  - [Databricks](https://docs.getdbt.com/guides/databricks?step=3)
  - [Redshift](https://docs.getdbt.com/guides/redshift?step=3)
  - [BigQuery](https://docs.getdbt.com/guides/bigquery?step=3)
  - [Fabric](https://docs.getdbt.com/guides/microsoft-fabric?step=2)
  - [Starburst Galaxy](https://docs.getdbt.com/guides/starburst-galaxy?step=2)

This guide assumes you have experience with or fundamental knowledge of dbt. Take the [dbt Fundamentals](https://courses.getdbt.com/courses/fundamentals) course first if you are brand new to dbt.

## Create and configure two projects

In this section, create two new, empty projects in dbt Cloud to use as your foundational and downstream projects. The always-enterprising and fictional account "Jaffle Labs" is setting up a project for their data analytics and finance team, respectively:

<Lightbox src="/img/guides/dbt-mesh/project_names.png" width="50%" title="Two new dbt Cloud Projects" />

To [create](/docs/cloud/about-cloud-setup) a new project in dbt Cloud:

- From **Account settings**, click **+ New Project**.
- Enter a project name and click **Continue**.
  - Use "Jaffle | Data Analytics" for one project
  - Use "Jaffle | Finance" for the other project
- Select your data platform, then **Next** to set up your connection.
- In the **Configure your environment** section, enter the **Settings** for your new project.
- Click **Test Connection**. This verifies that dbt Cloud can access your data platform account.
- Click **Next** if the test succeeded. If it failed, you might need to go back and double check your settings.

<Lightbox src="/img/guides/dbt-mesh/create-new-project.gif" width="70%" title="Navigate to 'Account settings' and then click + 'New Project' to create new projects in dbt Cloud" /> 

- Once configured, each project should have:
  - A data platform connection
  - New git repo
  - one or more [environments](/docs/deploy/deploy-environments) (such as development, deployment)

:::note

For our walkthrough, we created a single [Development](https://docs.getdbt.com/docs/dbt-cloud-environments#create-a-development-environment) and [Deployment](https://docs.getdbt.com/docs/deploy/deploy-environments) per project. 

For "Jaffle | Data Analytics" we set the default database to `jaffle_da`. For "Jaffle | Finance" we set the default database to `jaffle_finance`

:::

## Set up a foundational project

Set up a foundational (i.e. hub) project

Before a downstream team can leverage assets from this foundational project, we’ll need to first:
- [Create and define](/docs/collaborate/govern/model-access) at least one model as “public”
- Run a deployment job successfully 
    - Note: toggle on “Generate docs on run” for this job to update dbt Explorer. Once run, you can tie Explorer to a deployment job on the **Project Settings** page (details [here](https://docs.getdbt.com/docs/deploy/artifacts)).

Let’s walk through setting this up in our “Jaffle | Data Analytics” project. First, head to the **Develop** page to verify our setup. Click **Initializing dbt project** if you’ve started with an empty repo:

<Lightbox src="/img/guides/dbt-mesh/initialize_repo.png" title="Initialize repo" />

Delete the `models/example` folder and remove lines 39-42 from the dbt_project.yml file. While there, let’s also rename the project (line 5) from `my_new_project` to `analytics`.

Create two new folders: `models/staging` and `models/core`.

We’ll set up our staging layer as follows:
1. Create a new YML file `models/staging/sources.yml`.
2. Declare the sources by copying the following into the file and clicking **Save**.

    <File name='models/staging/sources.yml'>

    ```yml
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

5. Create a `models/core/fct_orders.sql` file to build a fact table with customer and order details

    <File name='models/core/fct_orders.sql'>

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

        from orders

        group by 1

    ),

    final as (

        select 
            orders.order_id,
            orders.order_date,
            orders.status,
            
            customers.customer_id,
            customers.first_name,
            customers.last_name,
            
            customer_orders.first_order_date,
            -- Note that we've used a macro for this so that the appropriate DATEDIFF syntax is used for each respective data platform
            {{ dbt.datediff("first_order_date", "order_date", "day") }} as days_as_customer_at_purchase

        from orders 
        left join customers using (customer_id)
        left join customer_orders using (customer_id)

    )

    select * from final

    ```

    </File>

6. Execute `dbt build`. 

## Define a public model & run first job

Alright, we have our basic building blocks arranged. How does dbt Mesh come in?

We know our Finance team will need to build on fct_orders as they analyze payment trends. That said, many of the other models in our project – namely the staging layer where we cleansed and joined the data, in this example – aren’t needed by downstream teams.

To make fct_orders available, we’ll just need to add an “access: public” clause to the relevant yml file. Let’s add the following file into the project and save it:

<File name='models/core/core.yml'>

```yml

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

Note: if unspecified, model access defaults to “protected” (i.e. referenceable in the same project only). You can learn more about access types and model groups [here](https://docs.getdbt.com/docs/collaborate/govern/model-access#access-modifiers).

Now in the **Lineage** tab we should see the model noted as “public”:

<Lightbox src="/img/guides/dbt-mesh/da_lineage.png" title="Jaffle | Data Analytics lineage" />

Let’s **Commit & Sync** our changes, then merge them to the main/prod branch.

Last but not least, let’s run our first deployment dbt Cloud Job. Go to the **Deploy** -> **Jobs** page. Click **Create job** -> **Deploy job**.

Check the **Generate docs on run** box so that we can later represent the state of this project in the Explore page. Then, click **Run Now**.
<Lightbox src="/img/guides/dbt-mesh/generate_docs_on_run.png" title="Jaffle | Generate docs on run" />
<Lightbox src="/img/guides/dbt-mesh/job_run_now.png" title="Jaffle | Trigger job" />

After the run is complete, go to the **Project Setting** page and link documentation to the job:
<Lightbox src="/img/guides/dbt-mesh/set_project_artifacts.png" title="Configure project artifacts" />

Click **Explore** from the upper menu bar. If all has gone to plan, we should now see our lineage, tests, and documentation coming through successfully!

## Reference a public model in your downstream project

Reference a public model in your downstream (i.e. spoke) project

Now, let’s switch over to "Jaffle | Finance" and head to the **Develop** page. A couple quick tasks to set up our project:
1. Click **Initialize dbt project** (in the upper left) if you’ve also started with an new git repo
2. Delete the `models/example` folder and remove lines 39-42 from the `dbt_project.yml` file 
3. Create a `dependencies.yml` file. Add the upstream `analytics` project and the `dbt_utils` package.
<Lightbox src="/img/guides/dbt-mesh/finance_create_file.png" title="Create file" />

<File name='dependencies.yml'>

```yml

packages:
  - package: dbt-labs/dbt_utils
    version: 1.1.1

projects:
  - name: analytics

```

</File>

Add the following files:

4. `models/staging/sources.yml`

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

5. `models/staging/stg_payments.sql`

    <File name='models/staging/stg_payments.sql'>

    ```sql

    with payments as (
        select * from {{ source('stripe', 'payment') }}
    ),

    final as (
        select 
            id as payment_id,
            "orderID" as order_id,
            "paymentMethod" as payment_method,
            amount,
            created as payment_date 
        from payments
    )

    select * from final

    ```

    </File> 

Alright, now we’re ready to add the model to answer the question the exec team would like to understand: how does payment type change through a customer journey? This will be important to understand if coupon gift card amounts decrease as a customer repeats purchases (as hoped by our marketing team) or persists. 

6. We can use the following logic to ascertain this:

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


Notice the cross-project ref at work! As we add the familiar ref, the auto-complete helper in the IDE also detects the public model as available.
<Lightbox src="/img/guides/dbt-mesh/cross_proj_ref_autocomplete.png" title="Cross-project ref autocomplete" />

This resolves to the appropriate database, schema, and table/view as defined by the upstream project:
<Lightbox src="/img/guides/dbt-mesh/cross_proj_ref_compile.png" title="Cross-project ref compile" />

We now see this represented in the live “lineage” tab as well:
<Lightbox src="/img/guides/dbt-mesh/cross_proj_ref_lineage.png" title="Cross-project ref lineage" />

## Enrich this handoff with model versions & contracts
How can we build in additional resilience and guardrails to this type of multi-project relationship? Pulling from software engineering best practices, we can now:
1. Define model [contracts](https://docs.getdbt.com/docs/collaborate/govern/model-contracts) in dbt to define a set of upfront "guarantees" that define the shape of your model. While building your model, dbt will verify that your model's transformation will produce a dataset matching up with its contract, or it will fail to build.
2. Define model [versions](https://docs.getdbt.com/docs/collaborate/govern/model-versions) to offer a clear migration path in cases where a breaking change is required

Let’s switch back to our example: we’re on the Data Analytics team and want to set guarantees on fct_orders so that downstream teams – like the Finance team – can be certain of its reliability.

Add a data contract to fct_orders. Go to `models/core/core.yml` and add the following underneath the model name:
```yml
models:
  - name: fct_orders
    access: public
    description: "Customer and order details"
    config:
      contract:
        enforced: true

```
So, what would happen if this contract were violated? Let’s see. Open up `models/core/fct_orders.sql`, comment out the `orders.status` column, and click **Build** to try building the model.

In the command bar history, we can see that the contract failed because the status field was removed:
<Lightbox src="/img/guides/dbt-mesh/break_contract.png" title="Broken contract" />

Now, let’s walk through how model versions can be used by the Data Analytics team as they upgrade the `fct_orders` model while offering backward compatibility and a migration notice to the downstream Finance team.

Rename `models/core/fct_orders.sql` to `models/core/fct_orders_v1.sql` and create a new file named `models/core/fct_orders_v2.sql`:

In `models/core/fct_orders_v2.sql`, comment out `orders.status` and instead add a new field, is_return, that yields true if status = ‘returned’ and false otherwise.

Then, add the following to your `models/core/core.yml` file:
- the “is_return” column
- the two model versions
- a latest_version to indicate which model is the latest (and should be used by default, unless specified otherwise)
- a deprecation_date to version 1 as well to indicate 

It should now read as follows:
<File name='models/core/core.yml'>

```yml

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

Let’s verify how dbt compiles the ref statement now based on the version that we scope. Open a new file, add the following select statements, and click **Compile**.

```sql
select * from {{ ref('fct_orders', v=1) }}
select * from {{ ref('fct_orders', v=2) }}
select * from {{ ref('fct_orders') }}
```

## Add a dbt Cloud Job in the downstream project
Before proceeding, commit & merge your changes in both the “Jaffle | Data Analytics” and “Jaffle | Finance” projects. 

A member of the Finance team would like to schedule a dbt Cloud Job their customer payment journey analysis immediately after the Data Analytics team refreshes their pipelines.

In the “Jaffle | Finance” project, go to the Jobs page (**Deploy** -> **Jobs**) and click **Create job** -> **Deploy job**. Add a name for the job, then scroll to the bottom and configure the job to **Run when another job finishes**. Select the upstream job, like so:
<Lightbox src="/img/guides/dbt-mesh/trigger_on_completion.png" title="Trigger job on completion" />

Click **Save**. Let’s verify this works as we expect. Go to the “Jaffle | Data Analytics” Jobs page, select the **Daily Job**, and click **Run Now**. Once this job completes successfully, go back the “Jaffle | Finance” Jobs page. Boom! The Finance team’s job was triggered automatically.

This makes it dead simple to stay in sync with the upstream tables and removes the need for more sophisticated orchestration skills (e.g. coordinating jobs across projects via an external orchestrator).

## View deprecation warning

How would a finance team member know how long they have to migrate over from `fct_orders_v1` to `fct_orders_v2`?

Let’s check. Head back to the **Develop** page in the “Jaffle | Finance” project. Edit the cross project ref to use v=1 in `models/marts/agg_customer_payment_journey.sql`:

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

Then, commit & merge the change. Go to the **Deploy** -> **Jobs** page and click **Run Now** on the Finance Job. We’ll see that the the agg_customer_payment_journey model builds but surfaces a warning with the deprecation date.

<Lightbox src="/img/guides/dbt-mesh/deprecation_date_warning.png" title="Deprecation date warning" />

## View lineage with dbt Explorer

In dbt Cloud, navigate to the **Explore** page for each of your projects &mdash; you should now view the [lineage seamlessly across projects](/docs/collaborate/explore-multiple-projects)!

Congratulations 🎉! You're ready to bring the benefits of dbt Mesh to your organization.

</div>

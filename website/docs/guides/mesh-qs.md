---
title: "Quickstart for dbt Mesh"
id: "mesh-qs"
level: 'Intermediate'
icon: 'guides'
tags: ['dbt Cloud','Intermediate']
hide_table_of_contents: true
---

<div style={{maxWidth: '900px'}}>

## Introduction

In this guide you’ll walk through how to set up a multi-project design using foundational concepts of [dbt Mesh](https://www.getdbt.com/blog/what-is-data-mesh-the-definition-and-importance-of-data-mesh). In this example, you’ll:
- Set up a foundational (i.e. hub) project called “Jaffle | Data Analytics”
- Set up a downstream (i.e. spoke) project called “Jaffle | Finance”
- Add model access, versions, and contracts 
- Set up a dbt Cloud Job that is triggered on completion of an upstream job

This framework enables organizations to scale – across both teams and data assets – in a way that enforces governance best practices while distributing large projects into manageable data domains—for faster data development. 

:::tip Videos for you
You can check out [dbt Fundamentals](https://courses.getdbt.com/courses/fundamentals) for free if you're interested in course learning with videos.

You can also watch the [YouTube video on dbt and Snowflake](https://www.youtube.com/watch?v=kbCkwhySV_I&list=PL0QYlrC86xQm7CoOH6RS7hcgLnd3OQioG).
:::
 
### Prerequisites​

:::warning

This guide assumes you have a [dbt Cloud Enterprise Account](https://www.getdbt.com/get-started/enterprise-contact-pricing) (required for multiple projects)

:::

- You have access to a cloud data warehouse, permissions to load the sample data tables, and dbt Cloud permissions to create new projects.
- Load the Jaffle Shop sample data (customers, orders, and payments tables) into your data platform. You can find the steps to do so for each platform, respectively, here:
    - [Snowflake](https://docs.getdbt.com/guides/snowflake?step=3)
    - [Databricks](https://docs.getdbt.com/guides/databricks?step=3)
    - [Redshift](https://docs.getdbt.com/guides/redshift?step=3)
    - [BigQuery](https://docs.getdbt.com/guides/bigquery?step=3)
    - [Fabric](https://docs.getdbt.com/guides/microsoft-fabric?step=2)
    - [Starburst Galaxy](https://docs.getdbt.com/guides/starburst-galaxy?step=2)
- Set dbt [version](https://docs.getdbt.com/docs/dbt-versions/core) to 1.6 or later in your Development and Deployment Environments
- This guide assumes you have experience with or fundamental knowledge of dbt. Take the [dbt Fundamentals](https://courses.getdbt.com/courses/fundamentals) course first if you are brand new to dbt.

### Related content:
- [Data mesh concepts: What it is and how to get started](https://www.getdbt.com/blog/data-mesh-concepts-what-it-is-and-how-to-get-started)
- [Deciding how to structure your dbt Mesh](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-2-structures)
- [Implementation guide](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-3-implementation)
- [dbt Mesh FAQs](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-4-faqs)

## Create and configure two new dbt Cloud Projects

We’ll create two new, empty projects in dbt Cloud to use in this tutorial. Here, the always-enterprising Jaffle Labs is setting up a project for their Data Analytics and Finance team, respectively:

<Lightbox src="/img/guides/dbt-mesh/project_names.png" title="Two New dbt Cloud Projects" />

Once each project is [configured](https://docs.getdbt.com/docs/cloud/about-cloud-setup) with a) a data platform connection, b) new git repo, and c) 1+ Environments we’re ready to begin. 

## Set up a foundational (i.e. hub) project

Before a downstream team can leverage assets from this foundational project, we’ll need to first:
- Create and define at least one model as “public”
- Run a deployment job successfully 
    - Note: toggle on “Generate docs on run” for this job to update dbt Explorer. Once run, you can tie Explorer to a deployment job on the Project Settings page (details [here](https://docs.getdbt.com/docs/deploy/artifacts)).

Let’s walk through setting this up in our “Jaffle | Data Analytics” project. First, head to the “Develop” page to verify our setup. Click “Initializing dbt project” if you’ve started with an empty repo:

<Lightbox src="/img/guides/dbt-mesh/initialize_repo.png" title="Two New dbt Cloud Projects" />

Delete the “models/example” folder and remove lines 39-42 from the dbt_project.yml file. While there, let’s also rename the project (line 5) from “my_new_project” to “analytics”.

Create two new folders: “models/staging” and “models/core”.

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
            -- Note that the DATEDIFF syntax below might require a tweak depending on the data platform used: https://docs.getdbt.com/sql-reference/datediff
            DATEDIFF(day, first_order_date, order_date) as days_as_customer_at_purchase

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

    version: 2

    models:
      - name: fct_orders
        access: public
        description: "Customer and order details"
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

Now in the “Lineage” tab we should see the model noted as “Public”:

<Lightbox src="/img/guides/dbt-mesh/da_lineage.png" title="Jaffle | Data Analytics Lineage" />

Let’s “Commit & Sync” our changes, then merge them to the main/prod branch.

Last but not least, let’s run our first deployment dbt Cloud Job. Go to the “Deploy” -> “ Jobs” page. Click “Create job” -> “Deploy job”.

Check the “Generate docs on run” box so that we can later represent the state of this project in the Explore page. Then, click “Run Now”.



## Reference a public model in your downstream (i.e. spoke) project

## Enrich this handoff with model versions & contracts

## Add dbt Cloud Job in the downstream project

## View deprecation warning

## View Explore
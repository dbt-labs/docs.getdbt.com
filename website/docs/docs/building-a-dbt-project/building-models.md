---
title: "dbt Models"
id: "building-models"
---

## Related reference docs
* [Model configurations](model-configs)
* [Model properties](model-properties)
* [`run` command](run)
* [`ref` function](ref)

## Getting started

:::info Building your first models

If you're new to dbt, we recommend that you check out our [Getting Started guide](/guides/getting-started) to build your first dbt project with models.

:::

<VersionBlock firstVersion="1.3">

In v1.3, dbt Core is adding support for **Python models**.

dbt's Python capabilities are an extension of its capabilities with SQL models. We recommend that you read this page first, and then read: ["dbt Models (Python)"](building-models-python)

</VersionBlock>

A model is a `select` statement. Models are defined in `.sql` files (typically in your `models` directory):
- Each `.sql` file contains one model / `select` statement
- The name of the file is used as the model name
- Models can be nested in subdirectories within the `models` directory

When you execute the [`dbt run` command](run), dbt will build this model in your <Term id="data-warehouse" /> by wrapping it in a `create view as` or `create table as` statement.

For example, consider this `customers` model:

<File name='models/customers.sql'>

```sql
with customer_orders as (
    select
        customer_id,
        min(order_date) as first_order_date,
        max(order_date) as most_recent_order_date,
        count(order_id) as number_of_orders

    from jaffle_shop.orders

    group by 1
)

select
    customers.customer_id,
    customers.first_name,
    customers.last_name,
    customer_orders.first_order_date,
    customer_orders.most_recent_order_date,
    coalesce(customer_orders.number_of_orders, 0) as number_of_orders

from jaffle_shop.customers

left join customer_orders using (customer_id)
```

</File>

When you execute `dbt run`, dbt will build this as a <Term id="view" /> named `customers` in your target schema:

```sql
create view dbt_alice.customers as (
    with customer_orders as (
        select
            customer_id,
            min(order_date) as first_order_date,
            max(order_date) as most_recent_order_date,
            count(order_id) as number_of_orders

        from jaffle_shop.orders

        group by 1
    )

    select
        customers.customer_id,
        customers.first_name,
        customers.last_name,
        customer_orders.first_order_date,
        customer_orders.most_recent_order_date,
        coalesce(customer_orders.number_of_orders, 0) as number_of_orders

    from jaffle_shop.customers

    left join customer_orders using (customer_id)
)
```

Why a _view_ named `dbt_alice.customers`? By default dbt will:
* create models as <Term id="view">views</Term>
* build models in a target schema you define
* use your file name as the view or <Term id="table" /> name in the database

You can use _configurations_ to change any of these behaviors — more on that below.

### FAQs
<FAQ src="Runs/checking-logs" />
<FAQ src="Models/create-a-schema" />
<FAQ src="Models/run-downtime" />
<FAQ src="Troubleshooting/sql-errors" />
<FAQ src="Models/sql-dialect" />

## Configuring models
Configurations are "model settings"  that can be set in your `dbt_project.yml` file, _and_ in your model file using a `config` block. Some example configurations include:
* Change the [materialization](materializations) that a model uses — a <Term id="materialization" /> determines the SQL that dbt uses to create the model in your warehouse.
* Build models into separate [schemas](using-custom-schemas).
* Apply [tags](resource-configs/tags) to a model.

Here's an example of model configuration:

<File name='dbt_project.yml'>

```yaml
name: jaffle_shop
config-version: 2
...

models:
  jaffle_shop: # this matches the `name:`` config
    +materialized: view # this applies to all models in the current project
    marts:
      +materialized: table # this applies to all models in the `marts/` directory
      marketing:
        +schema: marketing # this applies to all models in the `marts/marketing/`` directory

```

</File>


<File name='models/customers.sql'>

```sql

{{ config(
    materialized="view",
    schema="marketing"
) }}

with customer_orders as ...

```

</File>

Importantly, configurations are applied hierarchically — a configuration applied to a subdirectory will override any general configurations.

You can learn more about configurations in the [reference docs](model-configs).

### FAQs
<FAQ src="Models/available-materializations" />
<FAQ src="Models/available-configurations" />


## Building dependencies between models
By using the [`ref` function](ref) in the place of table names in a query, you can build dependencies between models. Use the name of another model as the argument for `ref`.

<Tabs
  defaultValue="model"
  values={[
    {label: 'Model', value: 'model'},
    {label: 'Compiled code in dev', value: 'dev'},
    {label: 'Compiled code in prod', value: 'prod'},
  ]}>
  <TabItem value="model">


  <File name='models/customers.sql'>

  ```sql
  with customers as (

      select * from {{ ref('stg_customers') }}

  ),

  orders as (

      select * from {{ ref('stg_orders') }}

  ),

  ...

  ```

  </File>


  </TabItem>

  <TabItem value="dev">

```sql
create view dbt_alice.customers as (
  with customers as (

      select * from dbt_alice.stg_customers

  ),

  orders as (

      select * from dbt_alice.stg_orders

  ),

  ...
)

...

```


  </TabItem>

  <TabItem value="prod">

```sql
create view analytics.customers as (
  with customers as (

      select * from analytics.stg_customers

  ),

  orders as (

      select * from analytics.stg_orders

  ),

  ...
)

...

  ```

  </TabItem>
</Tabs>


dbt uses the `ref` function to:
* Determine the order to run models in by creating a dependent acyclic graph (DAG).
<Lightbox src="/img/dbt-dag.png" title="The DAG for our dbt project" />

* Manage separate environments — dbt will replace the model specified in the `ref` function with the database name for the <Term id="table" /> (or view). Importantly, this is environment-aware — if you're running dbt with a target schema named `dbt_alice`, it will select from an upstream table in the same schema. Check out the tabs above to see this in action.

Additionally, the `ref` function encourages you to write modular transformations, so that you can re-use models, and reduce repeated code.

## Testing and documenting models
You can also document and test models — skip ahead to the section on [testing](building-a-dbt-project/tests) and [documentation](documentation) for more information.


## Additional FAQs
<FAQ src="Project/example-projects" alt_header="Are there any example dbt models?" />
<FAQ src="Models/configurable-model-path" />
<FAQ src="Models/model-custom-schemas" />
<FAQ src="Models/unique-model-names" />
<FAQ src="Models/removing-deleted-models" />
<FAQ src="Project/structure-a-project" alt_header="As I create more models, how should I keep my project organized? What should I name my models?" />
<FAQ src="Models/insert-records" />
<FAQ src="Project/why-not-write-dml" />
<FAQ src="Models/specifying-column-types" />

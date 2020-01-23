---
title: Build your first models
id: build-your-first-models
---

<!---
To-do:
- remake Cloud video with debug logs
- update debug instructions for Cloud
-->

## Build your first model
Now that we're all set up, it's time to get to the fun part — building models!
We're going to take the query from the [Setting up](docs/setting-up) instructions,
and turn it into a model in our dbt project.

### dbt Cloud
<iframe width="640" height="400" src="https://www.loom.com/embed/49b4069f4eb7473e9cc23d2e2349d3a3" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

1. Ensure you're in the Develop interface. If you're not, click the hamburger menu,
and then `Develop`.
2. Create a new file in the `models` directory named `models/customers.sql`.
3. Paste the query from the [Setting up](docs/setting-up) instructions into the
file.
4. Execute `dbt run` in the command prompt at the bottom of the screen. You
should get a successful run, like so:
<div class='text-left'>
    <a href="#" data-featherlight="/img/first-model-dbt-cloud.png">
        <img
            data-toggle="lightbox"
            width="300px"
            alt="A successful run with dbt Cloud"
            src="/img/first-model-dbt-cloud.png"
            class="docImage" />
    </a>
</div>

If you switch back to the BigQuery console you'll be able to `select` from this
model.

### dbt CLI
<iframe width="640" height="400" src="https://www.loom.com/embed/2ae3e1c6dfab451ab165ce928c5600c0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

1. Open your project in a code editor
2. Create a new SQL file in the `models` directory, named `models/customers.sql`.
3. Paste the query from the [Setting up](docs/setting-up) instructions into the
file.
4. From the command line, execute `dbt run`. Your output should look like this:

<div class='text-left'>
    <a href="#" data-featherlight="/img/first-model-cli.png">
        <img
            data-toggle="lightbox"
            width="300px"
            alt="A successful run with the dbt CLI"
            src="/img/first-model-cli.png"
            class="docImage" />
    </a>
</div>

5. Switch back to the BigQuery console and check that you can `select` from this
model.


## Change the way your model is materialized
One of the most powerful features of dbt is that you can change the way a model
is materialized in your warehouse, simply by changing a configuration value.
Let's see this in action.

<iframe width="640" height="400" src="https://www.loom.com/embed/604c8aaf793f4f2c874022dd59ea965e" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

<iframe width="640" height="400" src="https://www.loom.com/embed/22ebdc914426461ea5c617a415cb4c21" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

1. Edit the following in your `dbt_project.yml` file:
```yaml
models:
  jaffle_shop:
    materialized: table
    example:
      materialized: view
```
2. Execute `dbt run`. Your model, `customers` should now be built as a table!
> To do this, dbt had to first run a `drop view` statement, then a `create table
as` statement.
>
> **Pro-tip**: To check out the SQL that dbt is running, you can look in:
> * dbt Cloud:
> * dbt CLI:
>     * The `target/compiled/` directory for compiled `select` statements
>     * The `target/run/` directory for compiled `create` statements
>     * The `logs/dbt.log` file for verbose logging.

3. Edit `models/customers.sql` to have the following snippet at the top:
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

4. Execute `dbt run`. Your model, `customers` should be built as a view.

## Delete the example models

We don't need the sample files that dbt created for us anymore! Let's delete them.
<iframe width="640" height="400" src="https://www.loom.com/embed/b93903ed1cba4e70ac540b12966f6cdf" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

<iframe width="640" height="400" src="https://www.loom.com/embed/db63e6e937594b38bf044c78e720d95d" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

1. Delete the `models/example/` directory
2. Delete the `example:` key from your `dbt_project.yml` file, and any
configurations that are listed under it

```yaml
# before
models:
  jaffle_shop:
    materialized: table
    example:
      materialized: view
```
```yaml
# after
models:
  jaffle_shop:
    materialized: table
```


## Build models on top of other models
Often, it's a good idea to clean your data in one place, before doing additional
transformations downstream. Our query already uses CTEs to this effect, but now
we're going to experiment with using the [ref](https://docs.getdbt.com/docs/ref)
function to separate this clean-up into a separate model.

<iframe width="640" height="400" src="https://www.loom.com/embed/548e19fd107d4594b0d588a3d79e8344" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

<iframe width="640" height="400" src="https://www.loom.com/embed/39eceeedf69641b5aca6f94c4da172a8" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

1. Create a new SQL file, `models/stg_customers.sql`, with the SQL from the
`customers` CTE in our original query:
```sql
select
    id as customer_id,
    first_name,
    last_name

from `dbt-tutorial`.jaffle_shop.customers
```
2. Create a second new SQL file, `models/stg_orders.sql`, with the SQL from the
`orders` CTE in our original query:
```sql
select
    id as order_id,
    user_id as customer_id,
    order_date,
    status

from `dbt-tutorial`.jaffle_shop.orders
```
3. Edit the SQL in your `models/customers.sql` file as follows:
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
4. Execute `dbt run`

This time when dbt ran, it created separate views/tables for `stg_customers`,
`stg_orders` and `customers`. dbt was able to infer which order to run these
models in -- `customers` depends on `stg_customers` and `stg_orders`, so gets
built last. There's no need to explicitly define these dependencies.

This can be expressed in a DAG (directed acyclic graph) like so:
<div class='text-left'>
    <a href="#" data-featherlight="/img/dbt-dag.png">
        <img
            data-toggle="lightbox"
            width="300px"
            alt="The DAG for our dbt project"
            src="/img/dbt-dag.png"
            class="docImage" />
    </a>
</div>

### Extra exercises
* Check what happens when you write some bad SQL — can you debug this failure?
* Try to run only a single model at a time ([docs](https://docs.getdbt.com/docs/model-selection-syntax))
* Group your models with a `stg_` prefix into a `staging` subdirectory (i.e.
`models/staging/stg_customers.sql`)
    * Try configuring your `staging` models to be views
    * Try to run only the `staging` models

<iframe width="640" height="400" src="https://www.loom.com/embed/40a664884de746b6bb85e775bdf89db9" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

<iframe width="640" height="400" src="https://www.loom.com/embed/2fc44590f2614a68bea402322c36f56e" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

---
title: Build your first models
---
## Build your first model
### dbt Cloud

### dbt CLI
1. Open your project in a code editor
2. Create a new SQL file in the `models` directory, named `models/customers.sql`.
3. Paste the query from the [Setting up](docs/setting-up) instruction into the
file.
4. From the command line, execute `dbt run`. Your output should look like this:
[to-do: image]
5. Switch back to the BigQuery console and check that you can `select` from this
model.

* Paste the model into a new file
* `dbt run` -- do we have different views for this based on whether you are using dbt Cloud / CLI
* Create a `ref`

## Change the way your model is materialized
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
Pro-tip: To check out the SQL that dbt is running, you can look in:
* The `target/compiled/` directory for compiled `select` statements
* The `target/run/` directory for compiled `create` statements
* The `logs/dbt.log` file for verbose logging.

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


## Use the `ref` function (there should be a better title here)
Now we're going to split your project up into a few models.
1. Create a new SQL file, `models/stg_customers.sql`, with the following contents:
```sql
select
    id as customer_id,
    first_name,
    last_name

from `dbt-tutorial`.jaffle_shop.customers
```
2. Create a second new SQL file, `models/stg_orders.sql`, with the following
contents:
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

        min(order_date) as first_order,
        max(order_date) as most_recent_order,
        count(order_id) as number_of_orders

    from orders

    group by 1

),


final as (

    select
        customers.customer_id,
        customers.first_name,
        customers.last_name,
        customer_orders.first_order,
        customer_orders.most_recent_order,
        customer_orders.number_of_orders

    from customers

    left join customer_orders using (customer_id)

)

select * from final
```
4. Execute `dbt run`

You should see even more models being created.

## Extra exercises
* Check what happens when you write some bad SQL
* Try to run only a single model at a time.
* Group your models with a `stg_` prefix into a `staging` subdirectory (i.e.
`models/staging/stg_customers.sql`).
  * Try configuring your `staging` models to be views
  * Try to run only the `staging` models

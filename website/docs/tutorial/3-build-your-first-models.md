---
title: Build your first models
id: build-your-first-models
description: With our starter project setup, it's time to get to the fun part — building models!
---

import Lightbox from '@site/src/components/lightbox';
import LoomVideo from '@site/src/components/loom';
import CloudCore from '@site/src/components/cloudcore';
import Alert from '@site/src/components/alert';
import FAQ from '@site/src/components/faqs';

With our starter project setup, it's time to get to the fun part — building [models](https://docs.getdbt.com/docs/building-models)!

We're going to take the query from the [Setting up](setting-up) instructions, and turn it into a model in our dbt project.

## Build your first model
### dbt Cloud
<LoomVideo id="09919ddb02e44015878c9e93e15fe792" />

1. Ensure you're in the Develop interface. If you're not, click the hamburger menu, and then `Develop`.
2. Create a new file in the `models` directory named `models/customers.sql`.
3. Paste the query from the [Setting up](setting-up) instructions into the file.
4. Execute `dbt run` in the command prompt at the bottom of the screen. You should get a successful run, like so:

<Lightbox src="/img/first-model-dbt-cloud.png" title="A successful run with dbt Cloud" />

If you switch back to the BigQuery console you'll be able to `select` from this model.


### dbt CLI

<LoomVideo id="2ae3e1c6dfab451ab165ce928c5600c0" />

1. Open your project in a code editor
2. Create a new SQL file in the `models` directory, named `models/customers.sql`.
3. Paste the query from the [Setting up](setting-up) instructions into the file.
4. From the command line, execute `dbt run`. Your output should look like this:

<Lightbox src="/img/first-model-dbt-cli.png" title="A successful run with the dbt CLI" />

If you switch back to the BigQuery console you'll be able to `select` from this model.

### FAQs
<FAQ src="faqs/checking-logs" />
<FAQ src="faqs/which-schema" />
<FAQ src="faqs/create-a-schema" />
<FAQ src="faqs/run-downtime" />
<FAQ src="faqs/sql-errors" />


## Change the way your model is materialized
One of the most powerful features of dbt is that you can change the way a model is materialized in your warehouse, simply by changing a configuration value. Let's see this in action.

<CloudCore>
    <LoomVideo id="fbaa9948dccf4f74a17ffc7de1ddf4f2" />
    <LoomVideo id="22ebdc914426461ea5c617a415cb4c21" />
</CloudCore>

1. Edit the following in your `dbt_project.yml` file:
```yaml
models:
  jaffle_shop:
    materialized: table
    example:
      materialized: view
```
2. Execute `dbt run`. Your model, `customers` should now be built as a table!
<Alert type="info">
To do this, dbt had to first run a `drop view` statement (or API call on BigQuery), then a `create table as` statement.
</Alert>


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

4. Execute `dbt run`. Your model, `customers` should be built as a view. You may need to run `dbt run --full-refresh` for this to take effect on BigQuery.

### FAQs
<FAQ src="faqs/available-materializations" />
<FAQ src="faqs/which-materialization" />
<FAQ src="faqs/available-configurations" />

## Delete the example models

We don't need the sample files that dbt created for us anymore! Let's delete them.

<CloudCore>
    <LoomVideo id="093d46e965994cb6a13e8a98559f6f9f" />
    <LoomVideo id="db63e6e937594b38bf044c78e720d95d" />
</CloudCore>

1. Delete the `models/example/` directory
2. Delete the `example:` key from your `dbt_project.yml` file, and any configurations that are listed under it

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

### FAQs
<FAQ src="faqs/removing-deleted-models" />
<FAQ src="faqs/unused-model-configurations" />


## Build models on top of other models
Often, it's a good idea to clean your data in one place, before doing additional transformations downstream. Our query already uses CTEs to this effect, but now we're going to experiment with using the [ref](https://docs.getdbt.com/docs/ref) function to separate this clean-up into upstream models, like so:


<Lightbox src="/img/dbt-dag.png" title="The DAG we want for our dbt project" />

<CloudCore>
    <LoomVideo id="cf070e26faa3423e80338e6a918ae9f8" />
    <LoomVideo id="39eceeedf69641b5aca6f94c4da172a8" />
</CloudCore>

1. Create a new SQL file, `models/stg_customers.sql`, with the SQL from the `customers` CTE in our original query:
```sql
select
    id as customer_id,
    first_name,
    last_name

from `dbt-tutorial`.jaffle_shop.customers
```
2. Create a second new SQL file, `models/stg_orders.sql`, with the SQL from the `orders` CTE in our original query:
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

This time when dbt ran, separate views/tables were created for `stg_customers`, `stg_orders` and `customers`. dbt was able to infer the order in which to run these models in — `customers` depends on `stg_customers` and `stg_orders`, so gets built last. There's no need to explicitly define these dependencies.


### FAQs
<FAQ src="faqs/run-one-model" />
<FAQ src="faqs/unique-model-names" />
<FAQ src="faqs/structure-a-project" alt_header="As I create more models, how should I keep my project organized? What should I name my models?" />

## Extra exercises
* Write some bad SQL to cause an error — can you debug this error?
* Run only a single model at a time ([docs](https://docs.getdbt.com/docs/model-selection-syntax))
* Group your models with a `stg_` prefix into a `staging` subdirectory (i.e. `models/staging/stg_customers.sql`)
    * Configure your `staging` models to be views
    * Run only the `staging` models

<CloudCore>
    <LoomVideo id="8e9ff6e496e44347afe7accc44eb6c79" />
    <LoomVideo id="2fc44590f2614a68bea402322c36f56e" />
</CloudCore>

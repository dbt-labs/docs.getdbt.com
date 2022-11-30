As a best practice in SQL, you should separate logic that cleans up your data from logic that transforms your data. You have already started doing this in the existing query by using common table expressions (CTEs).

Now you can experiment by separating the logic out into separate models and using the [ref](ref) function to build models on top of other models:

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/dbt-dag.png" title="The DAG we want for our dbt project" />
</div>

1. Create a new SQL file, `models/stg_customers.sql`, with the SQL from the `customers` CTE in our original query.
2. Create a second new SQL file, `models/stg_orders.sql`, with the SQL from the `orders` CTE in our original query.

    <WHCode>

    <div warehouse="BigQuery">

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

    </div>

    <div warehouse="Databricks">

    <File name='models/stg_customers.sql'>

    ```sql
    select
        id as customer_id,
        first_name,
        last_name

    from jaffle_shop_customers
    ```

    </File>

    <File name='models/stg_orders.sql'>

    ```sql
    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from jaffle_shop_orders
    ```

    </File>

    </div>

    <div warehouse="Redshift">

    <File name='models/stg_customers.sql'>

    ```sql
    select
        id as customer_id,
        first_name,
        last_name

    from jaffle_shop.customers
    ```

    </File>

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

    </div>

    <div warehouse="Snowflake">

    <File name='models/stg_customers.sql'>

    ```sql
    select
        id as customer_id,
        first_name,
        last_name

    from raw.jaffle_shop.customers
    ```

    </File>

    <File name='models/stg_orders.sql'>

    ```sql
    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from raw.jaffle_shop.orders
    ```

    </File>

    </div>

    </WHCode>

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

4. Execute `dbt run`

This time, when you performed a `dbt run`, separate views/tables were created for `stg_customers`, `stg_orders` and `customers`. dbt inferred the order to run these models. Because `customers` depends on `stg_customers` and `stg_orders`, dbt builds `customers` last. You do not need to explicitly define these dependencies.


### FAQs {#faq-2}

<FAQ src="Runs/run-one-model" />
<FAQ src="Models/unique-model-names" />
<FAQ src="Project/structure-a-project" alt_header="As I create more models, how should I keep my project organized? What should I name my models?" />

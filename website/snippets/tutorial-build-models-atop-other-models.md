As a best practice, clean your data in one place before doing additional transformations downstream. The query you're using already uses CTEs for this purpose. 

Now you can experiment using the [ref](ref) function to separate this clean up into upstream models:

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/dbt-dag.png" title="The DAG we want for our dbt project" />
</div>

1. Create a new SQL file, `models/stg_customers.sql`, with the SQL from the `customers` CTE in our original query:

    <File name='models/stg_customers.sql'>

    ```sql
    select
        id as customer_id,
        first_name,
        last_name

    from `dbt-tutorial`.jaffle_shop.customers
    ```

    </File>

2. Create a second new SQL file, `models/stg_orders.sql`, with the SQL from the `orders` CTE in our original query:

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

This time, when you performed a `dbt run`, separate views/tables were created for `stg_customers`, `stg_orders` and `customers`. dbt was able to infer the order in which to run these models in — `customers` depends on `stg_customers` and `stg_orders`, so gets built last. You do not need to explicitly define these dependencies.

### FAQs

<FAQ src="run-one-model" />
<FAQ src="unique-model-names" />
<FAQ src="structure-a-project" alt_header="As I create more models, how should I keep my project organized? What should I name my models?" />

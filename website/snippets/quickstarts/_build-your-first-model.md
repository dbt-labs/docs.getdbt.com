You have two options for working with files in the dbt Cloud IDE:

- Editing in the protected primary branch &mdash; Edit, format, or lint files and execute dbt commands directly in your primary git branch. Since the dbt Cloud IDE prevents commits to the protected branch, it prompts you to commit those changes to a new branch.

- Create a new branch before editing &mdash; If you prefer to keep the primary branch unchanged, create a new branch before starting your edits. Navigate to **Version Control** on the left sidebar and click **Create branch**.

Name the new branch `add-customers-model`.

1. Click the **...** next to the `models` directory, then select **Create file**.  
2. Name the file `customers.sql`, then click **Create**.
3. Copy the following query into the file and click **Save**.

```sql
with customers as (

    select
        id as customer_id,
        first_name,
        last_name

    from `dbt-tutorial`.jaffle_shop.customers

),

orders as (

    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from `dbt-tutorial`.jaffle_shop.orders

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

4. Enter `dbt run` in the command prompt at the bottom of the screen. You should get a successful run and see the three models.

Later, you can connect your business intelligence (BI) tools to these views and tables so they only read cleaned up data rather than raw data in your BI tool.

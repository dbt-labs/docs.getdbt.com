Both jaffle shop projects already ship with a staging layer, so you'll build something new on top of it: a daily revenue model.

Copy this prompt into the chat:

```text
Add a new model models/daily_revenue.sql that returns total order amount and order count per order date, using the existing orders model. Add a description and not_null and unique tests for the order date column in models/schema.yml.
```

**You should see** a new file, `models/daily_revenue.sql`. It selects from `orders`, sums the amount, counts the orders, and groups by order date:

```sql
with orders as (

    select
        order_date,
        amount
    from {{ ref('orders') }}

),

final as (

    select
        order_date,
        sum(amount) as total_order_amount,
        count(*) as order_count

    from orders

    group by order_date

)

select * from final
```

You should also see an update to `models/schema.yml` with a description for the model and `not_null` and `unique` tests on `order_date`:

```yaml
  - name: daily_revenue
    description: Total order amount and order count per order date

    columns:
      - name: order_date
        description: Date (UTC) that the orders were placed
        tests:
          - not_null
          - unique

      - name: total_order_amount
        description: Total amount of orders placed on this date

      - name: order_count
        description: Number of orders placed on this date
```

Your version may differ. <Constant name="wizard" /> might use different column names or descriptions, and that's fine.

**What just happened:** you asked for a model, a test, and docs in plain English. <Constant name="wizard" /> used the `orders` model that's already in your project, so you didn't have to name columns or write YAML.

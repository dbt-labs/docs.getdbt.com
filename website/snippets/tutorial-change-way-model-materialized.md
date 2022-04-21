:::info Using the `+` sign in your `dbt_project.yml`
These videos were recorded with a slightly older version of dbt (dbt v0.15.0), which did not use the `+` sign in the `dbt_project.yml` file (this was introduced in dbt v0.17.0).

We'll try to update the videos soon, but for now, take extra note of the `+` signs in the code samples below, under the `models:` key.

:::

1. Edit the following in your `dbt_project.yml` file:

<File name='dbt_project.yml'>

```yaml
models:
  jaffle_shop:
    +materialized: table
    example:
      +materialized: view
```

</File>

2. Execute `dbt run`. Your model, `customers` should now be built as a table!
:::info
To do this, dbt had to first run a `drop view` statement (or API call on BigQuery), then a `create table as` statement.
:::

3. Edit `models/customers.sql` to have the following snippet at the top:

<File name='models/customers.sql'>

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

</File>

4. Execute `dbt run`. Your model, `customers` should be built as a view. You may need to run `dbt run --full-refresh` for this to take effect on BigQuery.

### FAQs

<FAQ src="available-materializations" />
<FAQ src="which-materialization" />
<FAQ src="available-configurations" />

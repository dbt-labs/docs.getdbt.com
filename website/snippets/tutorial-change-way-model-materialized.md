1. Edit your `dbt_project.yml` file:

    <File name='dbt_project.yml'>

    ```yaml
    models:
      jaffle_shop:
        +materialized: table
        example:
          +materialized: view
    ```

    </File>

2. Run the `dbt run` command. Your `customers` model should now be built as a table!
    :::info
    To do this, dbt had to first run a `drop view` statement (or API call on BigQuery), then a `create table as` statement.
    :::

3. Edit `models/customers.sql` to add following snippet to the top:

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

4. Execute `dbt run`. Your model, `customers` should be built as a view. 
5. Run `dbt run --full-refresh` for this to take effect in your warehouse.

### FAQs

<FAQ src="available-materializations" />
<FAQ src="which-materialization" />
<FAQ src="available-configurations" />

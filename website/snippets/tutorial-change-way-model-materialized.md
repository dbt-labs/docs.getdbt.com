One of the most powerful features of dbt is that you can change the way a model is materialized in your warehouse, simply by changing a configuration value.  You can change things between tables and views by changing a keyword rather than writing the data definition language (DDL) to do this behind the scenes.

By default, everything gets created as a view. You can override that by materializing everything in jaffle_shop as a table.  Everything in the example project will still be materialized as a view.

1. Edit your `dbt_project.yml` file.
    - Update your project `name` to:
      <File name='dbt_project.yml'>

      ```yaml
      name: 'jaffle_shop'
      ```

      </File>
    - Update your `models` config block to:

      <File name='dbt_project.yml'>

      ```yaml
      models:
        jaffle_shop:
          +materialized: table
          example:
            +materialized: view
      ```

      </File>
    - Click **Save**.

2. Enter the `dbt run` command. Your `customers` model should now be built as a table!
    :::info
    To do this, dbt had to first run a `drop view` statement (or API call on BigQuery), then a `create table as` statement.
    :::

3. Edit `models/customers.sql`  to override the `dbt_project.yml` for the `customers` model only by adding the following snippet to the top, and click **Save**:  

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

4. Enter the `dbt run` command. Your model, `customers` should now build as a view.
5. Enter the `dbt run --full-refresh` command for this to take effect in your warehouse.

### FAQs

<FAQ src="Models/available-materializations" />
<FAQ src="Project/which-materialization" />
<FAQ src="Models/available-configurations" />

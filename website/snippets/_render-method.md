#### SQL compilation error when running the `--empty` flag on a model

If you encounter a SQL compilation error when running a model with the `--empty` flag, explicitly call the `.render()` method on that relation. The error occurs because dbt processes certain parts of the workflow differently when the `--empty flag` is used, leading to confusion when it encounters the table reference (`{{ source(...) }}`) in the pre-hook. The error you're seeing is a result of dbt not handling the reference as you anticipated.

The recommended solution is to explicitly instruct dbt on how to interpret the reference in the pre-hook by using the `.render()` method. This approach ensures that dbt properly prepares the reference before executing it.


<File name='models.sql'>

```Jinja

-- models/staging/stg_sys__customers.sql
{{ config(
    pre_hook = [
        "alter external table {{ source('sys', 'customers').render() }} refresh"
    ]
) }}

with cus as (
    select * from {{ source("sys", "customers") }} -- leave this as is!
)

select * from cus

```

</File>
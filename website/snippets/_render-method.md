#### The render method

The `.render()` method is generally used to resolve or evaluate Jinja expressions (such as `{{ source(...) }}`) during runtime. When a pre-hook or post-hook contains a dynamic reference, such as a table or column, dbt might not automatically resolve the reference correctly, particularly when certain flags (such as `--empty`) are applied.

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
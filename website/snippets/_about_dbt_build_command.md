#### SQL compilation error when running the `--empty` flag on a model

If you encounter the error: `SQL compilation error: syntax error line 1 at position 21 unexpected '('.` when running a model with the `--empty` flag, explicitly call the `.render()` method on that relation.


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
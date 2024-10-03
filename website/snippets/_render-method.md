#### The render method

The `.render()` method is generally used to resolve or evaluate Jinja expressions (such as `{{ source(...) }}`) during runtime. When a pre-hook or post-hook contains a dynamic reference, such as a table or column, dbt might not automatically resolve the reference correctly, particularly when certain flags (such as `--empty`) are applied.

When using the `--empty flag`, dbt may skip processing `ref()` or `source()` for optimization. To avoid compilation errors and to explicitly tell dbt to process a specific relation (`ref()` or `source()`), use the `.render()` method in your model file. For example:


<File name='models.sql'>

```Jinja
{{ config(
    pre_hook = [
        "alter external table {{ source('sys', 'customers').render() }} refresh"
    ]
    select * from {{ source("sys", "customers") }} 
)
select * from cus
```

</File>

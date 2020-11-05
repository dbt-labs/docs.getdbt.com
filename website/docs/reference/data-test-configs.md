---
title: Data test configurations
---
## Related documentation
* [Data tests](building-a-dbt-project/tests#data-tests)

Data tests can only be configured from a config block, not in a `dbt_project.yml`:


<File name='tests/<filename>.sql'>

```jinja
{{
    config(
        [enabled](enabled)=true | false,
        [severity](resource-properties/tests#severity)='warn' | 'error',
        [tags](resource-configs/tags) = 'example_tag' | ['example_tag_1', 'example_tag_2']
    )
}}
```

</File>

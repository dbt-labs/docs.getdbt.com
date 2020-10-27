---
title: Data test configurations
---
<!---
Note that this doc is not shown in the sidebar as it's sort of weird behavior.
-->
* enabled
* severity
* tags

Can only be configured from a config block, not in a `dbt_project.yml`:


```jinja
{{
    config(
        enabled=true | false,
        severity='warn' | 'error',
        tags = 'example_tag' | ['example_tag_1', 'example_tag_2']
    )
}}
```

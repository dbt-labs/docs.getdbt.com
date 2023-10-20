---
title: Advanced configuration usage
sidebar_label: Advanced usage
---
## Alternative config block syntax

Some configurations may contain characters (e.g. dashes) that cannot be parsed as a jinja argument. For example, the following would return an error:

```sql
{{ config(
    post-hook="grant select on {{ this }} to role reporter",
    materialized='table'
) }}

select ...
```

While dbt provides an alias for any core configurations (e.g. you should use `pre_hook` instead of `pre-hook` in a config block), your dbt project may contain custom configurations without aliases.

If you want to specify these configurations inside of a model, use the alternative config block syntax:


<File name='models/events/base/base_events.sql'>

```sql
{{
  config({
    "post-hook": "grant select on {{ this }} to role reporter",
    "materialized": "table"
  })
}}


select ...
```

</File>

<!---
## Hierarchies / overriding configs / precedence
For Drew to do
--->

---
title: "Controlling table expiration"
sidebar_label: "Table expiration"
description: "How to set BigQuery tables to expire after a number of hours using the hours_to_expiration config."
---

By default, dbt-created tables never expire. You can configure certain model(s)
to expire after a set number of hours by setting `hours_to_expiration`.

<File name='dbt_project.yml'>

```yml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +hours_to_expiration: 6

```

</File>

<File name='models/<modelname>.sql'>

```sql

{{ config(
    hours_to_expiration = 6
) }}

select ...

```

</File>

The `hours_to_expiration` config only applies when the underlying table is first created. It doesn't reset on incremental runs.To work around this, call a macro in your +post-hook that resets the expiration timestamp manually. Update the hours argument to match your hours_to_expiration value.

**Example macro SQL:**

```sql
{% macro reset_expiration_for_incremental(hours) %}
  -- Check if the current model is being run incrementally
  {% if is_incremental() %}
    -- Set expiration timestamp because it's only applied on creation, not on merge
    ALTER TABLE {{ this }}
      SET OPTIONS (expiration_timestamp = TIMESTAMP_ADD(CURRENT_TIMESTAMP(), INTERVAL {{ hours }} HOUR))
  {% endif %}
{% endmacro %}
```
<File name='dbt_project.yml'>

```yml
models:
  my_project:
    +post-hook:
      - "{{ reset_expiration_for_incremental(hours=6) }}"
```

</File>

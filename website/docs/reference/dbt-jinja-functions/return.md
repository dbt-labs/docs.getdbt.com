---
title: "About return function"
sidebar_variable: "return"
id: "return"
description: "Read this guide to understand the return Jinja function in dbt."
---

__Args__:

 * `data`: The data to return to the caller

The `return` function can be used in macros to return data to the caller. The type of the data (dict, list, int, etc) will be preserved through the `return` call.

<File name='macros/get_data.sql'>

```sql
{% macro get_data() %}

  {{ return([1,2,3]) }}
  
{% endmacro %}
```

</File>



<File name='models/my_model.sql'>

```sql

select
  -- getdata() returns a list!
  {% for i in get_data() %}
    {{ i }}
    {% if not loop.last %},{% endif %}
  {% endfor %}
```

</File>

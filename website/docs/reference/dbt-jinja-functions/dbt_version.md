---
title: "About dbt_version variable"
sidebar_label: "dbt_version"
id: "dbt_version"
description: "Read this guide to understand the dbt_version Jinja function in dbt."
---

The `dbt_version` variable returns the installed version of dbt that is
currently running. It can be used for debugging or auditing purposes.

### Example Usage

<File name="macros/get_version.sql">

```sql
{% macro get_version() %}

  {% do log("The installed version of dbt is: " ~ dbt_version, info=true) %}

{% endmacro %}
```

</File>


```
$ dbt run-operation get_version
The installed version of dbt is 0.16.0
```

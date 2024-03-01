---
title: "About dbt_version variable"
sidebar_label: "dbt_version"
id: "dbt_version"
description: "Read this guide to understand the dbt_version Jinja function in dbt."
---

The `dbt_version` variable returns the installed version of dbt that is
currently running. It can be used for debugging or auditing purposes.

## Versioning
To learn more about release versioning for dbt Core, refer to [How dbt Core uses semantic versioning](docs/dbt-versions/core#how-dbt-core-uses-semantic-versioning). 

If the [Keep on latest version](/docs/dbt-versions/upgrade-dbt-version-in-cloud#keep-on-latest-version) setting is selected in dbt Cloud, then `dbt_version` will be the latest (continuous) release version. This also follows follows semantic versioning guidelines, starting with `2024.0.0`.

## Example usage

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

---
title: "About schemas variable"
sidebar_label: "schemas"
id: "schemas"
description: "A list of schemas where dbt built objects during the current run."
---

`schemas` is a variable available in an `on-run-end` hook, representing a list of schemas that dbt built objects in on this run. 

If you do not use [custom schemas](/docs/build/custom-schemas), `schemas` will evaluate to your target schema, e.g. `['dbt_alice']`. If you use custom schemas, it will include these as well, e.g. `['dbt_alice', 'dbt_alice_marketing', 'dbt_alice_finance']`.

The `schemas`  variable is useful for granting privileges to all schemas that dbt builds relations in, like so (note this is Redshift specific syntax):


<File name='dbt_project.yml'>

```yaml
...

on-run-end:
  - "{% for schema in schemas%}grant usage on schema {{ schema }} to group reporter;{% endfor%}"
  - "{% for schema in schemas %}grant select on all tables in schema {{ schema }} to group reporter;{% endfor%}"
  - "{% for schema in schemas %}alter default privileges in schema {{ schema }}  grant select on tables to group reporter;{% endfor %}"
```

</File>



:::info Want more in-depth instructions on the recommended way to grant privileges?

We've written a full discourse article [here](https://discourse.getdbt.com/t/the-exact-grant-statements-we-use-in-a-dbt-project/430)

:::

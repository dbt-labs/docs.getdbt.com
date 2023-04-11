---
title: "show"
id: "show"
---

`dbt show` generates post-transformation preview from a source `model`, `test`, or `analysis` file. The preview lines are ephemeral and only exist in the `dbt show` CLI output. It will generate and display the first 5 rows of data.

Example:

```
dbt show --select model_name.sql
```
or
```
dbt show --inline "select * from {{ ref('model_name') }}"
```
The `show` command is useful for:

1. Visually inspecting the transformed data without accessing the data platform. 
2. Validating the output of ephemeral models.



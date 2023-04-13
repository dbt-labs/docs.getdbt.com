---
title: "show"
id: "show"
---

`dbt show` generates post-transformation preview from a source `model`, `test`, or `analysis` file. By default, it will display the first 5 rows from the selected model, though this can be customize with the selector `--limit n` (where `n` is the number of rows to display). The results themselves are not materialized in the data warehouse or stored in any dbt file, only displayed in the terminal.

The command does access the data platform to run introspective queries. Use the flag `--no-introspect` to disable instrospective queries.

Example:

```
dbt show --select model_name.sql
```
or
```
dbt show --inline "select * from {{ ref('model_name') }}"
```

<Lightbox src="/img/docs/reference/dbt-show" title="dbt show preview"/>

The `show` command is useful for visually inspecting transformed data directly in the terminal interface and making it easy to validate the output of all models, including ephemeral models.

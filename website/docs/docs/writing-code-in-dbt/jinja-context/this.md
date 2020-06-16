---
title: "this"
id: "this"
---


:::info New in dbt 0.11.0

Before 0.11.0, there was a difference between `this.table` and `this.name`. In 0.11.0, this distinction was removed! Both syntaxes can be used, but `this.table` is recommended, and `this.name` may be deprecated in a future release.

:::

`this` makes available schema information about the currently executing model. It's is useful in any context in which you need to write code that references the current model, for example when defining a `sql_where` clause for an incremental model and for writing pre- and post-model hooks that operate on the model in some way. Developers have options for how to use `this`:

| dbt Model Syntax | Output |
| ---------------- | ------ |
| `{{this}}` | `"schema"."table"` |
| `{{this.schema}}` | `schema` |
| `{{this.table}}` | `table` |
| `{{this.name}}` | `table` |

Here's an example of how to use `this` in `dbt_project.yml` to grant select rights on a table to a different db user.

<File name='example.yml'>

```yaml
models:
  project-name:
    post-hook:
      - "grant select on {{ this }} to db_reader"
```

</File>

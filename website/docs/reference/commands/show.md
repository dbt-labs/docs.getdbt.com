---
title: "show"
id: "show"
---

Use `dbt show` to:
- Compile the dbt-SQL definition of a `model`, `test`, `analysis`, or an arbitrary dbt-SQL query passed `--inline`
- Run that query against the data warehouse
- Preview the results in the terminal

By default, `dbt show` will display the first 5 rows from the query result. This can be customized by passing the flag `--limit n`, where `n` is the number of rows to display.

The results of the preview query are not materialized in the data warehouse, or stored in any dbt file. They are only included in dbt's logs and displayed in the terminal. Note also that, if previewing a model, dbt will always compile and run the compiled query from source. It will not select from the already-materialized database relation, even if you've just run the model. (We may support that in the future; if you're interested, upvote or comment on [dbt-core#7391](https://github.com/dbt-labs/dbt-core/issues/7391).)

Example:

```
dbt show --select model_name.sql
```
or
```
dbt show --inline "select * from {{ ref('model_name') }}"
```

<Lightbox src="/img/docs/reference/dbt-show.png" title="dbt show preview"/>

For example, if you've just built a model that has a failing test, you can quickly preview the test failures right in the terminal, to find values of `id` that are duplicated:

<Lightbox src="/img/docs/reference/dbt-show-failing-test.png" title="dbt show failing test"/>

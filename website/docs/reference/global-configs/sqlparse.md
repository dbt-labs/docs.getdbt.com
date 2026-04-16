---
title: "SQL parse"
id: "sqlparse"
sidebar: "sqlparse"
description: "Configure sqlparse grouping limits when dbt compiles SQL."
---

dbt uses the Python [`sqlparse`](https://pypi.org/project/sqlparse/) library when it parses SQL. For large or complex queries, you may need to adjust how `sqlparse` groups tokens to avoid performance issues or parsing limits.

You can use the `--sqlparse` flag to adjust how `sqlparse` groups tokens. This maps to the grouping limits described in the [sqlparse Security and Performance Considerations](https://sqlparse.readthedocs.io/en/latest/api.html#security-and-performance-considerations).

Supported keys:

<SimpleTable>
| Key | What it does |
| --- | --- |
| `MAX_GROUPING_DEPTH` | Sets the maximum nesting depth when grouping tokens |
| `MAX_GROUPING_TOKENS` | Sets the maximum number of tokens that can be grouped at once |
</SimpleTable>

<br></br>

Each key accepts a single value: an integer or `null`. The default value for both keys is `null`, which means dbt does not apply a custom limit.

`sqlparse` enforces built-in limits (`MAX_GROUPING_DEPTH = 100` and `MAX_GROUPING_TOKENS = 10000`) to prevent excessive resource usage. Setting a value to `null` disables the limit entirely.

For example, the following command sets both grouping limits:

```bash
dbt compile --sqlparse '{"MAX_GROUPING_DEPTH": 200, "MAX_GROUPING_TOKENS": 20000}'
```

You can configure only one key to set a single limit. Any unspecified key defaults to `null`. In the following example, only the depth limit is raised to `500`; `MAX_GROUPING_TOKENS` is not set, so `sqlparse` does not apply a token limit for this run.

```bash
dbt compile --sqlparse '{"MAX_GROUPING_DEPTH": 500}'
```

If no keys are provided, both limits remain unset (`null`), and `sqlparse` does not apply any grouping limits.

You can use `--sqlparse` with the following commands:

- [`dbt compile`](/reference/commands/compile)
- [`dbt run`](/reference/commands/run)
- [`dbt build`](/reference/commands/build)
- [`dbt test`](/reference/commands/test)
- [`dbt seed`](/reference/commands/seed)
- [`dbt snapshot`](/reference/commands/snapshot)
- [`dbt source freshness`](/reference/commands/source#dbt-source-freshness)
- [`dbt docs generate`](/reference/commands/cmd-docs#dbt-docs-generate)
- [`dbt show`](/reference/commands/show)


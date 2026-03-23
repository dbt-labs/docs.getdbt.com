---
title: "SQL parse"
id: "sqlparse"
sidebar: "sqlparse"
description: "Configure sqlparse grouping limits when dbt compiles SQL."
---

dbt uses the Python [`sqlparse`](https://pypi.org/project/sqlparse/) library when it parses SQL. For large or complex queries, you may need to tune how `sqlparse` groups tokens to avoid performance issues or parsing limits.

You can use the `--sqlparse` flag to adjust how `sqlparse` groups tokens. This maps to the grouping limits described in the [sqlparse Security and Performance Considerations](https://sqlparse.readthedocs.io/en/latest/api.html#security-and-performance-considerations).

Supported keys are:

<SimpleTable>
| Key | What it does |
| --- | --- |
| `MAX_GROUPING_DEPTH` | Maximum recursion depth during token grouping |
| `MAX_GROUPING_TOKENS` | Maximum number of tokens processed in a single grouping operation |
</SimpleTable>

<br></br>

Each value must be an integer. The default for both keys is `null`. Setting a key to `null` leaves the limit unset.

For example, the following command sets both grouping limits:

```bash
dbt compile --sqlparse '{"MAX_GROUPING_DEPTH": 200, "MAX_GROUPING_TOKENS": 20000}'
```

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


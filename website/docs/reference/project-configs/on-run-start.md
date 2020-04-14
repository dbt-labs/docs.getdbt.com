---
datatype: sql-statement | [sql-statement]
---

## Definition
A SQL statement (or list of SQL statements) to be run at the start of the following commands:
- `dbt run`
- `dbt seed`

`on-run-start` hooks can also call macros that return SQL statements

## Examples
`on-run-start` hooks work very similarly to `on-run-end` hooks, check out the [on-run-end](on-run-end.md) docs for more examples.

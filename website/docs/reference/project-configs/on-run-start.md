---
datatype: sql-statement | [sql-statement]
---
<Alert type='warning'>
<h4>Heads up!</h4>

This is a work in progress document.

</Alert>

## Definition
A SQL statement (or list of SQL statements) to be run at the start of the following commands:
- `dbt run`
- `dbt seed`

`on-run-start` hooks can also call macros that return SQL statements.

## Examples
`on-run-start` hooks work very similarly to `on-run-end` hooks, check out the [post-hook](post-hook.md) docs for more examples.

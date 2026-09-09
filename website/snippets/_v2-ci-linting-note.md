:::note Linting on dbt v2
CI jobs that run on v2 automatically use the built-in [`dbt lint`](/reference/commands/lint?version=2.0) command instead of SQLFluff. `dbt lint` is SQLFluff-compatible and it reads your existing `.sqlfluff` config, uses the same rule codes, and respects `-- noqa` suppression comments.
:::

---
title: "About dbt compile command"
sidebar_label: "compile"
id: "compile"
---

`dbt compile` generates executable SQL from source `model`, `test`, and `analysis` files. You can find these compiled SQL files in the `target/` directory of your dbt project.

The `compile` command is useful for:

1. Visually inspecting the compiled output of model files. This is useful for validating complex jinja logic or macro usage.
2. Manually running compiled SQL. While debugging a model or schema test, it's often useful to execute the underlying `select` statement to find the source of the bug.
3. Compiling `analysis` files. Read more about analysis files [here](/docs/build/analyses).

Some common misconceptions:
- `dbt compile` is _not_ a pre-requisite of `dbt run`, or other building commands. Those commands will handle compilation themselves.
- If you just want dbt to read and validate your project code, without connecting to the data warehouse, use `dbt parse` instead.

<VersionBlock firstVersion="1.5">

### Interactive compile

Starting in dbt v1.5, `compile` can be "interactive" in the CLI, by displaying the compiled code of a node or arbitrary dbt-SQL query:
- `--select` a specific node _by name_
- `--inline` an arbitrary dbt-SQL query

This will log the compiled SQL to the terminal, in addition to writing to the `target/` directory.

For example:

```bash
dbt compile --select stg_payments
dbt compile --inline "select * from {{ ref('raw_orders') }}"
```

<Lightbox src="/img/docs/reference/dbt-compile.png" title="dbt compile --select stg_payments"/>

</VersionBlock>

The command accesses the data platform to cache related metadata, and to run introspective queries. Use the flags:
- `--no-populate-cache` to disable initial cache population. If metadata is needed, it will be a cache miss, requiring dbt to run the metadata query.
- `--no-introspect` to disable instrospective queries. dbt will raise an error if a model's definition requires running one.


### FAQs
<FAQ path="Warehouse/db-connection-dbt-compile" />

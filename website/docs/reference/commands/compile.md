---
title: "compile"
id: "compile"
---

`dbt compile` generates executable SQL from source `model`, `test`, and `analysis` files. You can find these compiled SQL files in the `target/` directory of your dbt project.

The `compile` command is useful for:

1. Visually inspecting the compiled output of model files. This is useful for validating complex jinja logic or macro usage.
2. Manually running compiled SQL. While debugging a model or schema test, it's often useful to execute the underlying `select` statement to find the source of the bug.
3. Compiling `analysis` files. Read more about analysis files [here](/docs/build/analyses).

<VersionBlock firstVersion="1.5">

Starting in dbt v1.5, `compile` becomes interactive in the CLI using the selection syntaxt `--select` or `--inline` to target specic models or Jinja references, respectively. This will return the compiled SQL in the CLI (in addition to the `target/` directory). 

For example:

```
dbt compile --select stg_payments
```

or

```
dbt compile --inline "select * from {{ ref('raw_orders') }}"
```

</VersionBlock>

It is _not_ a pre-requisite of `dbt run`.
---
title: "compile"
id: "compile"
---

`dbt compile` generates executable SQL from source `model`, `test`, and `analysis` files. You can find these compiled SQL files in the `target/` directory of your dbt project.

The `compile` command is useful for:

1. Visually inspecting the compiled output of model files. This is useful for validating complex jinja logic or macro usage.
2. Manually running compiled SQL. While debugging a model or schema test, it's often useful to execute the underlying `select` statement to find the source of the bug.
3. Compiling `analysis `files. Read more about analysis files [here](analyses).

It is _not_ a pre-requisite of `dbt run`.

## Options

---
title: "New concepts in the dbt Fusion engine"
id: "new-concepts"
sidebar_label: "New Concepts"
description: "New concepts and configurations you will encounter when you install the dbt Fusion engine."
pagination_next: null
pagination_prev: null
intro_text: "Learn about the net-new concepts you will encounter when using Fusion."
---

# New concepts <Lifecycle status="beta" />

import FusionBeta from '/snippets/_fusion-beta-callout.md';

<FusionBeta />

The new dbt Fusion engine compiles and statically analyzes SQL, to provide dialect-aware validation and extract column-level lineage. This means running `dbt compile` will generate and analyze a full logical plan for all the models in a dbt project, before running any models.
To enable this capability, Fusion introduces **two new concepts**:
- **Compilation strategies** (ahead-of-time or just-in-time) to determine whether a mode is compiled before or during DAG execution.
- **Static analysis** of code (SQL) in dbt models. When turned on, Fusion will produce a logical plan, validate it, and statically analyze the model's plan to extract column-level lineage and other rich metadata.

In dbt core, `compile` means rendering Jinja. In dbt Fusion, compile introduces a new step and analyzes the SQL. Therefore a `compile` in Fusion can be broken down into two steps: `render` (Jinja) and `analyze` (SQL).

## Compilation strategies

[Ahead-of-time compilation](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) is the default compilation strategy of Fusion. This means when a user runs `dbt run` on Fusion, it compiles all models first, then runs them, providing a platform for significant performance improvements and guaranteeing correctness of the DAG before execution. This models compiled languages like Rust, Typescript, or Java where the compiler catches all issues upfront before anything is executed. 

<Lightbox src="/img/fusion/aot-compilation.png" title="Ahead-of-time compilation strategy (Fusion default)" />

[Just-in-time compilation](https://en.wikipedia.org/wiki/Just-in-time_compilation) is the default behavior of <Constant name="core" />. dbt compiles, then runs, each model sequentially in the DAG. This is necessary in cases where the results of upstream models are inputs to introspective queries used to template downstream models. The downstream model must be compiled "just-in-time," after the upstream models have finished building.

<Lightbox src="/img/fusion/jit-compilation.png" title="Just-In-time compilation strategy (dbt Core)" />

### Dynamic Templating

While Fusion defaults to ahead-of-time (AOT) compilation for performance and validation benefits, models with dynamic Jinja templating ([introspective queries](/faqs/Warehouse/db-connection-dbt-compile)) require just-in-time compilation.

Dynamic templating functions that depend on the state of the data platform, such as [run_query](/reference/dbt-jinja-functions/run_query) and [`dbt_utils.get_column_values`](https://github.com/dbt-labs/dbt-utils?tab=readme-ov-file#get_column_values-source), need to query the database to determine what SQL to generate.

These patterns create a chicken-and-egg problem for AOT compilation: Fusion can't know what SQL will be generated until it runs the upstream models and queries their results. The downstream model's SQL depends on the data produced _at runtime_ in the upstream model, and so it must be compiled "just in time."

**Fusion intelligently switches to JIT compilation only for models that require it, while maintaining AOT compilation for all other models in your DAG.** This selective approach gives you the best of both worlds:

- Models without dynamic templating benefit from AOT's performance improvements and upfront validation
- Models with dynamic templating still work correctly with JIT compilation
- The compilation mode is determined on a per-model basis, not for the entire DAG

For example, in a DAG like this:
<Lightbox src="/img/fusion/introspection-normal.png" title="Fusion switches to JIT compilation since all model_b contains an introspection query" />


Fusion will:
1. Render `model_a`, `model_b`, `model_d` ahead of time
2. In DAG order, analyze the SQL of `model_a` then `model_b`
3. Run `model_a → model_b`
4. Switch to JIT compile-run for `model_c` (due to dynamic templating)
5. Continue with SQL analysis then run for `model_d` (since it depends on a dynamic model)


However, if you have a parallel branch:
<Lightbox src="/img/fusion/introspection-mixed.png" title="Fusion switches to JIT compilation _only_ for model_c (dynamic templating) and its downstreams" />


Fusion will:
1. AOT compile `model_a`, `model_b` _and_ `model_x`, `model_y`, `model_z` because none depend on a dynamically templated model. It also AOT renders `model_d` since its Jinja is not dynamic.
2. Switch to JIT compile and run for `model_c`
3. JIT analyze and run `model_d`

This granular approach ensures maximum performance and reliability, while maintaining compatibility with dynamic SQL patterns.

## The `static_analysis` config

Fusion can statically analyze the vast majority of SQL in supported dialects, with some exceptions and limitations. You can toggle on and off the new static (SQL) analysis features for specific models in your project, if they contain unsupported or dynamic SQL. This configuration propagates downstream, which means if an upstream model's static analysis is turned off, then Fusion will also turn off static analysis for any downstream models referencing that model.

## Usage

You can set `static_analysis` as a model-level config (preferred), or as a CLI flag for an entire run, which overrides model-level configuration and is really intended as an aid to debugging. Refer to [CLI options](/reference/global-configs/command-line-options) and [Configurations and properties](/reference/configs-and-properties) to learn more about configs.

The `static_analysis` model-level config uses these options:

- `on`: (Default) Statically analyzes SQL.
- `off`: Skips SQL analysis on a model and all downstream models that depend on it. If Fusion detects that a model is dynamically templated with introspective queries, it will automatically shut off static analysis for this model and all downstream models, and switch to just-in-time compilation.
- `unsafe`: Force Fusion to analyze the SQL for dynamically generated models. As the user, you accept the risk that SQL may _change_ between compile and run, as the state of the data platform or upstream models change. At runtime, the resulting SQL may be invalid or different. Fusion switches to JIT compilation for this model and models downstream.

<File name='models/<filename>.yml'>

```yml
version: 2

models:
  - name: <model_name>
    config:
      static-analysis: unsafe
      ...
```

</File>

The CLI flag uses `--static-analysis=unsafe` or `--static-analysis=off` for the entire run, which takes precedence over the model-level config:

```bash
dbt run --static-analysis=unsafe
```

## Example: new concepts in action

Imagine a DAG wtih `model_a → model_b → model_c → model_d`. All of these models are defined with static SQL.

### Default behavior (`static_analysis: on`)

- During `dbt compile`, Fusion will compile and analyze all models
- During `dbt run`, Fusion will compile and analyze all models, then run all models

### After adding dynamic SQL

We update `model_c` to introduce dynamic SQL (such as `dbt_utils.get_column_values`). Fusion will automatically detect that `model_c` has dynamic Jinja. It will turn off static analysis for `model_c+` and switch them to a just-in-time compilation strategy.

During `dbt compile`, Fusion will:
- Parse the project, detect that `model_c` is dynamic, switch `static_analysis: off` for `model_c+`
- Compile and analyze `model_a`, `model_b`
- Skip analysis for `model_c+` (including `model_d`)

During `dbt run`, Fusion will:
- Parse the project, detect that `model_c` is dynamic, switch `static_analysis: off` and just-in-time rendering for `model_c+`
- Compile and analyze `model_a`, `model_b`
- Run `model_a → model_b`
- Render SQL for `model_c` (without static analysis), then run `model_c`
- Render SQL for `model_d` (no static analysis), then run `model_d`

### Explicitly set `static_analysis: unsafe` for `model_c`

This configuration tells Fusion to attempt static analysis, even though `model_c` is dynamically templated.

During `dbt compile`, Fusion will:
- Parse the project, detect that `model_c` is unsafe, but the explicit user configuration of `static_analysis: unsafe` tells Fusion not to shut off static analysis for `model_c+`
- Compile and analyze all models. For `model_b`'s introspection queries, it uses data from previously-built tables or production (if using defer)

During `dbt run`, Fusion will:
- Parse the project, detect that `model_c` is unsafe, but the explicit user configuration of `static_analysis: unsafe` tells Fusion not to shut off static analysis for `model_c+`. Fusion still switches to JIT compilation for those models.
- Compile and analyze `model_a`, `model_b`
- Run `model_a → model_b`
- Compile `model_c` (including static analysis), then run `model_c`
- Compile `model_d` (including static analysis), then run `model_d`

- **Warning:** The actual SQL executed for `model_c` and `model_d` may differ from what was analyzed during compilation, which may lead to schema mismatches or errors. Many of those errors will be detected during static analysis, but the detection is "just-in-time," after `model_a → model_b` have already been materialized.

## Limitations to static analysis

Fusion is unable to compile user-defined functions (UDFs), which define custom functions in Snowflake and other data warehouses. When using a UDF in a model, you need to set `static_analysis: off`. In the future, we intend to add native support for UDF definition and compilation within  Fusion.

Fusion automatically detects dynamically templated SQL, via introspective query calls within dbt-jinja, but it is unable to detect dynamic SQL, such as the Snowflake `PIVOT` function. You can either configure your model to set `static_analysis: off`, or you can refactor your model to have a statically enforceable schema. (See example below.)

### Dynamic SQL

We currently do not detect when the schema is dynamic based on SQL functionality (instead of Jinja). For example, when you use Snowflake with the `ANY` keyword:

```sql
with quarterly_sales as (
  select * from values
    (1, 10000, '2023_Q1'),
    (1, 400, '2023_Q1'),
    (2, 4500, '2023_Q1'),
    (2, 35000, '2023_Q1'),
    (3, 10200, '2023_Q4')
  as quarterly_sales(emp_id, amount, quarter)
)

select *
from quarterly_sales
pivot (
  sum(amount) for quarter in (ANY)
)
order by emp_id
```

This example model uses a dynamic schema based on SQL functionality (not Jinja), which causes an error:

```terminal
error: dbt0432: PIVOT ANY is not compilable
  --> models/example/my_first_model.sql:12:29 (target/compiled/models/example/my_first_model.sql:12:29)
```

To fix this error, you may:
- configure your model with `static_analysis: off`
- refactor your model to use dynamic Jinja templating, e.g. `dbt_utils.get_columns_values`, and configure your model with `static_analyis: unsafe`
- refactor your model to be a static pivot, and benefit from safe static analysis

```sql
with quarterly_sales as ( 
    select * from values
    (1, 10000, '2023_01'),
    (1, 400, '2023_01'),
    (2, 4500, '2023_01'),
    (2, 35000, '2023_01'),
    (3, 10200, '2023_04')   
as quarterly_sales(emp_id, amount, quarter)
)

select * from quarterly_sales pivot (
sum(amount) for quarter in ('2023_01', '2023_04'))
order by emp_id
```

### UDFs

If you call a user-defined function in your model SQL:

```sql
select my_example_udf(player_id)
    from {{ source('raw_data', 'raw_players') }}
```

Fusion will raise an error during static analysis:

```terminal
error: dbt0209: No function MY_EXAMPLE_UDF
  --> models/staging/stg_players.sql:7:9 (target/compiled/models/staging/stg_players.sql:7:9)
```

To fix this error, you need to set `static_analysis: off` for that model. This will also have the effect of turning off static analysis for any downstream models as well.

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />
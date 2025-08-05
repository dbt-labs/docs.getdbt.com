---
title: "New concepts in the dbt Fusion engine"
id: "new-concepts"
sidebar_label: "New Concepts"
description: "New concepts and configurations you will encounter when you install the dbt Fusion engine."
pagination_next: null
pagination_prev: null
---

# New concepts <Lifecycle status="beta" />

import FusionBeta from '/snippets/_fusion-beta-callout.md';

<FusionBeta />

<IntroText>

The dbt Fusion engine [fully comprehends your project's SQL](/blog/the-levels-of-sql-comprehension), enabling advanced capabilities like dialect-aware validation and precise column-level lineage.

It can do this because its compilation step is more comprehensive than that of the <Constant name="core" /> engine. When <Constant name="core" /> referred to _compilation_, it only meant _rendering_ &mdash; converting Jinja-templated strings into a SQL query to send to a database.

The dbt Fusion engine can also render Jinja, but then it completes a second phase: producing and validating with _static analysis_ a logical plan for every rendered query in the project. This static analysis step is the cornerstone of Fusion's new capabilities.

</IntroText>

| Step | dbt Core engine | dbt Fusion engine |
|------|-----------------|--------------------|
| Render Jinja into SQL | ✅ | ✅ |
| Produce and statically analyze logical plan  | ❌ | ✅ |
| Run rendered SQL | ✅ | ✅ |

## Rendering strategies

<Lightbox src="/img/fusion/annotated_steps.png" title="Each dot represents a step in that model's execution (render, analyze, run). The numbers reflect step order across the DAG. JIT steps are green; AOT steps are purple." alignment="left" width="600px"/>

<Expandable alt_header="JIT rendering and execution (dbt Core)" is_open="true">
  <video src="/img/fusion/CoreJitRun.mp4" autoPlay loop muted style={{ width: "100%", maxWidth: 950 }} />
</Expandable>

<Constant name="core" /> will _always_ use **Just In Time (JIT) rendering**. It renders a model, runs it in the warehouse, then moves on to the next model.

<Expandable alt_header="AOT rendering, analysis and execution (dbt Fusion engine)" is_open="true">
  <video src="/img/fusion/FusionAotRun.mp4" autoPlay loop muted style={{ width: "100%", maxWidth: 950 }} />
</Expandable>

The <Constant name="fusion_engine" /> will _default to_ **Ahead of Time (AOT) rendering and analysis**. It renders all models in the project, then produces and statically analyzes every model's logical plan, and only then will it start running models in the warehouse.

By rendering and analyzing all models ahead of time, and only beginning execution once everything is proven to be valid, the <Constant name="fusion_engine" /> avoids consuming any warehouse resources unnecessarily. By contrast, SQL errors in models run by <Constant name="core" />'s engine will only be flagged by the database itself during execution.

### Rendering introspective queries

The exception to AOT rendering is an introspective model: a model whose rendered SQL depends on the results of a database query. Models containg macros like `run_query()` or `dbt_utils.get_column_values()` are introspective. Introspection causes issues with ahead-of-time rendering because:

- Most introspective queries are run against the results of an earlier model in the DAG, which may not yet exist in the database during AOT rendering.
- Even if the model does exist in the database, it might be out of date until after the model has been refreshed.

The <Constant name="fusion_engine" /> switches to **JIT rendering for introspective models**, to ensure it renders them the same way as <Constant name="core" />.

Note that macros like `adapter.get_columns_in_relation()` and `dbt_utils.star()` _can_ be rendered and analyzed ahead of time, as long as the [`Relations`](/reference/dbt-classes#relation) they inspect aren't themselves dynamic. This is because the <Constant name="fusion_engine" /> populates schemas into memory as part of the compilation process.

## Principles of static analysis

[Static analysis](https://en.wikipedia.org/wiki/Static_program_analysis) is meant to guarantee that if a model compiles without error in development, it will also run without compilation errors when deployed. Introspective queries can break this promise by making it possible to modify the rendered query after a model is committed to source control.

The <Constant name="fusion_engine" /> is unique in that it can statically analyze not just a single model in isolation, but every query from one end of your DAG to the other. Even your database can only validate the query in front of it! Concepts like [information flow theory](https://roundup.getdbt.com/i/156064124/beyond-cll-information-flow-theory-and-metadata-propagation) &mdash; although not incorporated into the dbt platform [yet](https://www.getdbt.com/blog/where-we-re-headed-with-the-dbt-fusion-engine) &mdash; rely on stable inputs and the ability to trace columns DAG-wide.

### Static analysis and introspective queries

When Fusion encounters an introspective query, that model will switch to just-in-time rendering (as described above). Both the introspective model and all of its descendants will also be opted in to JIT static analysis. We refer to JIT static analysis as "unsafe" because it will still capture most SQL errors and prevent execution of an invalid model, but only after upstream models have already been materialized.

This classification is meant to indicate that Fusion can no longer 100% guarantee alignment between what it analyzes and what will be executed. The most common real-world example where unsafe static analysis can cause an issue is a standalone `dbt compile` step (as opposed to the compilation that happens as part of a `dbt run`).

During a `dbt run`, JIT rendering ensures the downstream model's code will be up to date with the current warehouse state, but a standalone compile does not refresh the upstream model. In this scenario Fusion will read from the upstream model as it was last run. This is _probably_ fine, but could lead to errors being raised incorrectly (a false positive) or not at all (a false negative).

<Expandable alt_header="Rendering and analyzing without execution" is_open="true">
  <video src="/img/fusion/FusionJitCompileUnsafe.mp4" autoPlay loop muted style={{ width: "100%", maxWidth: 950 }} />
  Note that `model_d` is rendered AOT, since it doesn't use introspection, but it still has to wait for `introspective_model_c` to be analyzed.
</Expandable>

You will still derive significant benefits from "unsafe" static analysis compared to no static analysis, and we recommend leaving it on unless you notice it causing you problems. Better still, you should consider whether your introspective code could be rewritten in a way that is eligible for AOT rendering and static analysis.

## Recapping the differences between engines

dbt Core:

- renders all models just-in-time
- never runs static analysis

The dbt Fusion engine:

- renders all models ahead-of-time, unless they use introspective queries
- statically analyzes all models, defaulting to ahead-of-time unless they or their parents were rendered just-in-time, in which case the static analysis step will also happen just-in-time.

## Configuring `static_analysis`

Beyond the default behavior described above, you can always modify the way static analysis is applied for specific models in your project. Remember that **a model is only eligible for static analysis if all of its parents are also eligible.**

The `static_analysis` options are:

- `on`: Statically analyze SQL. The default for non-introspective models, depends on AOT rendering.
- `unsafe`: Statically analyze SQL. The default for introspective models. Always uses JIT rendering.
- `off`: Skip SQL analysis on this model and its descendants.

When you disable static analysis, features of the VS Code extension which depend on SQL comprehension will be unavailable.

The best place to configure `static_analysis` is as a config on an individual model or group of models. As a debugging aid, you can also use the `--static-analysis off` or `--static-analysis unsafe` CLI flags to override all model-level configuration. Refer to [CLI options](/reference/global-configs/command-line-options) and [Configurations and properties](/reference/configs-and-properties) to learn more about configs.

### Example configurations

Disable static analysis for all models in a package:

<File name='dbt_project.yml'>

```yml
name: jaffle_shop

models:
  jaffle_shop: 
    marts:
      +materialized: table
  
  a_package_with_introspective_queries:
    +static_analysis: off
```

</File>

Disable static analysis for a model using a custom UDF:

<File name='models/my_udf_using_model.sql'>

```sql
{{ config(static_analysis='off') }}

select 
  user_id,
  my_cool_udf(ip_address) as cleaned_ip
from {{ ref('my_model') }}
```

</File>

### When should I turn static analysis `off`?

Static analysis may incorrectly fail on valid queries if they contain:

- **syntax or native functions** that the <Constant name="fusion_engine" /> doesn't recognize. Please [open an issue](https://github.com/dbt-labs/dbt-fusion/issues) in addition to disabling static analysis.
- **user-defined functions** that the <Constant name="fusion_engine" /> doesn't recognize. You will need to temporarily disable static analysis. Native support for UDF compilation will arrive in a future version - see [dbt-fusion#69](https://github.com/dbt-labs/dbt-fusion/issues/69).
- **dynamic SQL** such as [Snowflake's PIVOT ANY](https://docs.snowflake.com/en/sql-reference/constructs/pivot#dynamic-pivot-on-all-distinct-column-values-automatically) which cannot be statically analyzed. You can disable static analysis, refactor your pivot to use explicit column names, or create a [dynamic pivot in Jinja](https://github.com/dbt-labs/dbt-utils#pivot-source).
- **highly volatile data feeding an introspective query** during a standalone `dbt compile` invocation. Because the `dbt compile` step does not run models, it uses old data or defers to a different environment when running introspective queries. The more frequently the input data changes, the more likely it is for this divergence to cause a compilation error. Consider whether these standalone `dbt compile` commands are necessary before disabling static analysis.

## Examples

### No introspective models

<Expandable alt_header="AOT rendering, analysis and execution" is_open="true">
  <video src="/img/fusion/FusionAotRun.mp4" autoPlay loop muted style={{ width: "100%", maxWidth: 950 }} />
</Expandable>

- Fusion renders each model in order.
- Then it statically analyzes each model's logical plan in order.
- Finally, it runs each model's rendered SQL. Nothing is persisted to the database until Fusion has validated the entire project.

### Introspective model with `unsafe` static analysis

Imagine we update `model_c` to contain an introspective query (such as `dbt_utils.get_column_values`). We'll say it's querying `model_b`, but the <Constant name="fusion_engine" />'s response is the same regardless of what the introspection does.

<Expandable alt_header="Unsafe static analysis of introspective models" is_open="true">
  <video src="/img/fusion/FusionJitRunUnsafe.mp4" autoPlay loop muted style={{ width: "100%", maxWidth: 950 }} />
</Expandable>

- During parsing, Fusion discovers `model_c`'s introspective query. It switches `model_c` to JIT rendering and opts `model_c+` in to JIT static analysis.
- `model_a` and `model_b` are still eligible for AOT compilation, so Fusion handles them the same as in the introspection-free example above. `model_d` is still eligible for AOT rendering (but not analysis).
- Once `model_b` is run, Fusion renders `model_c`'s SQL (using the just-refreshed data), analyzes it, and runs it. All three steps happen back-to-back.
- `model_d`'s AOT-rendered SQL is analyzed and run.

<Expandable alt_header="Complex DAG with an introspective branch" is_open="true">
  <video src="/img/fusion/FusionJitRunUnsafeComplexDag.mp4" autoPlay loop muted style={{ width: "100%", maxWidth: 950 }} />
</Expandable>

As you'd expect, a branching DAG will AOT compile as much as possible before moving on to the JIT components, and will work with multiple `--threads` if they're available. Here, `model_c` can start rendering as soon as `model_b` has finished running, while the AOT-compiled `model_x` and `model_y` run separately:

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />

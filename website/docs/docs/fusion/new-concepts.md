---
title: "New concepts in the dbt Fusion engine"
id: "new-concepts"
sidebar_label: "New concepts"
description: "New concepts and configurations you will encounter when you install the dbt Fusion engine."
pagination_next: null
pagination_prev: null
---

# New concepts

<VersionBlock lastVersion="1.99">

import FusionLifecycle from '/snippets/_fusion-lifecycle-callout.md';

<FusionLifecycle />

</VersionBlock>

<IntroText>

The <Constant name="fusion_engine" /> [fully comprehends your project's SQL](/blog/the-levels-of-sql-comprehension), enabling advanced capabilities like dialect-aware validation and precise column-level lineage.

It can do this because its compilation step is more comprehensive than that of the <Constant name="core" /> engine. When <Constant name="core" /> referred to _compilation_, it only meant _rendering_ &mdash; converting Jinja-templated strings into a SQL query to send to a database.

The dbt Fusion engine can also render Jinja, but then it completes a second phase: producing and validating with _static analysis_ a logical plan for every rendered query in the project. This static analysis step is the cornerstone of Fusion's new capabilities.

</IntroText>

| Step | dbt Core engine | dbt Fusion engine |
|------|-----------------|--------------------|
| Render Jinja into SQL | ✅ | ✅ |
| Produce and statically analyze logical plan  | ❌ | ✅ |
| Run rendered SQL | ✅ | ✅ |

## Rendering strategies

<Lightbox src="/img/fusion/annotated_steps.png" title="Each dot represents a step in that model's execution (render, analyze, run). The numbers reflect step order across the DAG." alignment="left" width="600px"/>

<Expandable alt_header="Rendering and execution (dbt Core)" is_open="true">
  <video src="/img/fusion/CoreJitRun.mp4" autoPlay loop muted style={{ width: "100%", maxWidth: 950 }} />
</Expandable>

<Constant name="core" /> renders a model, runs it in the warehouse, then moves on to the next model.

<Expandable alt_header="Rendering, analysis, and execution (dbt Fusion engine)" is_open="true">
  <video src="/img/fusion/FusionAotRun.mp4" autoPlay loop muted style={{ width: "100%", maxWidth: 950 }} />
</Expandable>

When configured with `static_analysis: strict`, the <Constant name="fusion_engine" /> renders all models in the project, then produces and statically analyzes every model's logical plan, and only then starts running models in the warehouse.

By rendering and analyzing all models before execution, and only beginning execution once everything is proven valid, the <Constant name="fusion_engine" /> prevents unnecessary consumption of warehouse resources. The amount of analysis performed is determined by the `static_analysis` setting &mdash; `baseline` or `strict`.

By contrast, SQL errors in models run by <Constant name="core" />'s engine will only be flagged by the database itself during execution.

### Rendering introspective queries

An introspective model is a model whose rendered SQL depends on the results of a database query. Models containing macros like `run_query()` or `dbt_utils.get_column_values()` are introspective. Introspection causes issues with pre-execution rendering because:

- Most introspective queries run against the results of an earlier model in the DAG, which may not yet exist in the database during rendering.
- Even if the model does exist in the database, it might be out of date until after the model has been refreshed.

The <Constant name="fusion_engine" /> handles introspective models by rendering them during execution, ensuring they behave the same way as in <Constant name="core" />.

Note that macros like `adapter.get_columns_in_relation()` and `dbt_utils.star()` _can_ be rendered and analyzed before execution, as long as the [`Relations`](/reference/dbt-classes#relation) they inspect aren't themselves dynamic. This is because the <Constant name="fusion_engine" /> populates schemas into memory as part of the compilation process.

## Principles of static analysis

The concept of [static analysis](https://en.wikipedia.org/wiki/Static_program_analysis) is meant to guarantee that if a model compiles without error in development, it will also run without compilation errors when deployed. Introspective queries can break this promise by making it possible to modify the rendered query after a model is committed to source control. 

The <Constant name="fusion_engine" /> uses the [`static_analysis`](/reference/resource-configs/static-analysis) config to help you control how it performs static analysis for your models.

The <Constant name="fusion_engine" /> is unique in that it can statically analyze not just a single model in isolation, but every query from one end of your DAG to the other. Even your database can only validate the query in front of it! Concepts like [information flow theory](https://roundup.getdbt.com/i/156064124/beyond-cll-information-flow-theory-and-metadata-propagation) &mdash; although not incorporated into the dbt platform [yet](https://www.getdbt.com/blog/where-we-re-headed-with-the-dbt-fusion-engine) &mdash; rely on stable inputs and the ability to trace columns DAG-wide.

### Baseline mode: A smooth transition from dbt Core

The <Constant name="fusion_engine" /> defaults to `static_analysis: baseline` mode, inspired by similar type-checking and linting tools like [TypeScript's migration approach](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html), [basedpyright's baseline feature](https://docs.basedpyright.com/latest/benefits-over-pyright/baseline/), and [Pydantic's strict/lax modes](https://docs.pydantic.dev/latest/why/#strict-lax).

The philosophy behind baseline mode:

- **Smooth transition**: Provide a familiar first-time experience for users coming from <Constant name="core" />.
- **Incremental opt-in**: Offer a clear pathway to adopt more <Constant name="fusion" /> features over time.
- **Pragmatic validation**: Catch most SQL errors without requiring a complete project overhaul

Migrating to <Constant name="fusion" /> involves more than moving YAML around. Some scenarios that can make migration more involved include:

1. **Limited access to sources**: You don't have access to all the sources and models of a large dbt project.
2. **Intricate Jinja workflows**: Your project uses post-hooks and introspection extensively.
3. **Package compatibility**: Your project depends on packages that aren't yet <Constant name="fusion" />-compatible.
4. **Unsupported SQL features**: Your models or sources use advanced data types (`STRUCT`, `ARRAY`, `GEOGRAPHY`) or built-in functions (`AI.PREDICT`, `JSON_FLATTEN`, `st_pointfromgeohash`) not yet supported by the engine.

Baseline mode lets you start using <Constant name="fusion" /> immediately while you address these scenarios incrementally. As you resolve compatibility issues, you can opt specific models or your entire project into `strict` mode for maximum validation guarantees.

## Recapping the differences between engines

<Constant name="dbt_core" />:

- Renders and runs models one at a time.
- Never runs static analysis.

The <Constant name="fusion_engine" /> (baseline mode &mdash; default):

- Statically analyzes all models, catching most SQL errors while providing a familiar migration experience.

The <Constant name="fusion_engine" /> (strict mode):

- Renders and statically analyzes all models before execution begins.
- Guarantees nothing runs until the entire project is proven valid.

## Configuring `static_analysis`

You can modify the way static analysis is applied for specific models in your project. Remember that **a model is only eligible for `strict` static analysis if all of its parents are also eligible.**

The [`static_analysis`](/reference/resource-configs/static-analysis) config options are:

- `baseline` (default): Statically analyze SQL. This is the recommended starting point for users transitioning from <Constant name="core" />, providing a smooth migration experience while still catching most SQL errors.
- `strict` (previously `on`): Statically analyze all SQL before execution begins. Use this for maximum validation guarantees &mdash; nothing runs until the entire project is proven valid.
- `off`: Skip SQL analysis on this model and its descendants.

:::caution Deprecated values

The `on` and `unsafe` values are deprecated and will be removed in May 2026. Use `strict` instead.

:::

When you disable static analysis, features of the VS Code extension which depend on SQL comprehension will be unavailable.

The best place to configure `static_analysis` is as a config on an individual model or group of models. As a debugging aid, you can also use the [`--static-analysis strict` or `--static-analysis off` CLI flags](/reference/global-configs/static-analysis-flag) to override all model-level configuration. 

### Incrementally adopting strict mode

Once you're comfortable with <Constant name="fusion" /> in baseline mode, you can incrementally opt models or directories into `strict` mode:

<File name='dbt_project.yml'>

```yml
name: jaffle_shop

models:
  jaffle_shop:
    # Start with strict analysis on your cleanest models
    staging:
      +static_analysis: strict
    # Keep baseline for models that need more work
    marts:
      +static_analysis: baseline
```

</File>

This approach lets you gain the benefits of strict validation where possible while keeping the flexibility of baseline analysis for models that aren't yet compatible.

Refer to [CLI options](/reference/global-configs/command-line-options) and [Configurations and properties](/reference/configs-and-properties) to learn more about configs.

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

Disable static analysis in YAML:

<File name='models/my_udf_using_model.yml'>

```yml
models:
  - name: model_with_static_analysis_off
    config:
      static_analysis: off
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
- **dynamic SQL** such as [Snowflake's PIVOT ANY](https://docs.snowflake.com/en/sql-reference/constructs/pivot#dynamic-pivot-on-all-distinct-column-values-automatically) which cannot be statically analyzed. You can disable static analysis, refactor your pivot to use explicit column names, or create a [dynamic pivot in Jinja](https://github.com/dbt-labs/dbt-utils#pivot-source).
- **highly volatile data feeding an introspective query** during a standalone `dbt compile` invocation. Because the `dbt compile` step does not run models, it uses old data or defers to a different environment when running introspective queries. The more frequently the input data changes, the more likely it is for this divergence to cause a compilation error. Consider whether these standalone `dbt compile` commands are necessary before disabling static analysis.


import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />

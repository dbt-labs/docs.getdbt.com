---
title: "About static analysis"
id: "about-static-analysis"
sidebar_label: "About static analysis"
description: "New concepts and configurations you will encounter when you install the dbt v2."
pagination_next: null
pagination_prev: null
---

<VersionBlock lastVersion="1.99">

import FusionLifecycle from '/snippets/_fusion-lifecycle-callout.md';

<FusionLifecycle />

</VersionBlock>

<IntroText>

The <Constant name="fusion_engine" /> [fully comprehends your project's SQL](/blog/the-levels-of-sql-comprehension), enabling advanced capabilities like dialect-aware validation and precise column-level lineage.

It can do this because its compilation step is more comprehensive than that of the dbt Core v1.x engine. When dbt Core v1.x referred to _compilation_, it only meant _rendering_ &mdash; converting Jinja-templated strings into a SQL query to send to a database.

<Constant name="fusion_engine" /> can also render Jinja, but then it completes a second phase: _static analysis_, producing and validating a logical plan for every rendered query in the project. This step is the cornerstone of <Constant name="fusion" />'s new capabilities.

</IntroText>

## Principles of static analysis

The software engineering concept of [static analysis](https://en.wikipedia.org/wiki/Static_program_analysis) describes checks that can be done on code before it runs (static == not running).

The most rigorous static analysis means you can trust that if the analysis succeeds, the code will run in production without compilation errors.

Less strict static analysis also surfaces helpful information to developers as they work. There's no free lunch&mdash;what you gain in responsiveness you lose in correctness guarantees.

The <Constant name="fusion_engine" /> uses the [`static_analysis`](/reference/resource-configs/static-analysis) config to help you control how it performs static analysis for your models.

The <Constant name="fusion_engine" /> is unique in that it can statically analyze not just a single model in isolation, but every query from one end of your DAG to the other. Even your database can only validate the query in front of it! Concepts like [information flow theory](https://roundup.getdbt.com/i/156064124/beyond-cll-information-flow-theory-and-metadata-propagation) &mdash; although not incorporated into the dbt platform [yet](https://www.getdbt.com/blog/where-we-re-headed-with-the-dbt-fusion-engine) &mdash; rely on stable inputs and the ability to trace columns DAG-wide.

### Baseline mode: A smooth transition from dbt Core

The <Constant name="fusion_engine" /> defaults to `static_analysis: baseline` mode, inspired by similar type-checking and linting tools like [TypeScript's migration approach](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html), [basedpyright's baseline feature](https://docs.basedpyright.com/latest/benefits-over-pyright/baseline/), and [Pydantic's strict/lax modes](https://docs.pydantic.dev/latest/why/#strict-lax).

The philosophy behind the above-mentioned tools and <Constant name="fusion" />'s baseline mode is:

- **Smooth transition**: Provide a familiar first-time experience for users coming from <Constant name="core" />.
- **Incremental opt-in**: Offer a clear pathway to adopt more <Constant name="fusion" /> features over time.
- **Pragmatic validation**: Catch most SQL errors without requiring a complete project overhaul.

Use this style of gradual typing to start with lightweight validation, then incrementally adopt strict guarantees as your project is ready.

#### What baseline mode changes

Baseline mode introduces several fundamental behavior changes compared to the previous binary (off/on) approach:

- **No downloading of remote schemas** &mdash; Baseline mode does not fetch schemas from the warehouse.
- **Unit tests work without strict mode** &mdash; Previously, unit tests required static analysis to be fully on. In baseline mode, they work out of the box.
- **No unsafe introspection warnings** &mdash; We no longer warn about unsafe introspection, though we'd still love to help you assess it in the future.

The following table shows how baseline mode expands what's available without requiring strict mode.

### LSP feature comparison

Baseline mode unlocks a meaningful set of features without requiring strict mode. We're also investing in moving more features into baseline over time.

VS Code extension features by static analysis configuration:

✅ = Available | ❌ = Not available

| Feature | off | baseline | strict |
|---------|-----|----------|--------|
| Go-to-definition/reference (except columns) | ✅ | ✅ | ✅ |
| Table lineage | ✅ | ✅ | ✅ |
| YAML validation | ✅ | ✅ | ✅ |
| Render + preview SQL | ✅ | ✅ | ✅ |
| Unit tests | ✅ | ✅ | ✅ |
| Detect syntax errors | ❌ | ✅ | ✅ |
| Preview CTE results | ❌ | ✅ | ✅ |
| Go-to-definition/reference (columns) | ❌ | ❌ | ✅ |
| Automatic refactor column names | ❌ | ❌ | ✅ |
| Rich column lineage | ❌ | ❌ | ✅ |
| Detect data type and function signature errors | ❌ | ❌ | ✅ |

- dbt VS Code extension features in this table are available to all users for 14 days. 
- After the 14-day period, sign in or register for a <Constant name="dbt_platform" /> account from the dbt VS Code extension to keep using advanced capabilities. 
- Unregistered users can continue using core editing and build workflows without signing in.
- Existing registered dbt VS Code extension users keep access to registration-required features automatically.

:::tip Supported Snowflake functions
To check out which Snowflake functions are supported in <Constant name="fusion"/> in `strict` mode, refer to [Snowflake function support](/reference/resource-configs/snowflake-function-support)
:::

:::tip CodeLens visibility
The VS Code extension and Studio IDE provide CodeLens even when static analysis is off, giving you visibility into which models have static analysis disabled and why.
:::

Ultimately, we want everyone developing in strict mode for maximum guarantees. We acknowledge this isn't a change that can happen overnight &mdash; baseline exists to smooth the transition. Many planned features (like local compute) require strict mode. We're also exploring inferring column types on your behalf, which would enable more functionality in baseline mode without requiring you to manually provide type information.

### Introspection handling in baseline mode

In `baseline` mode, all static analysis findings are warnings, not errors &mdash; your project can continue running even when the compiler flags invalid or problematic SQL. This section is a good example of why that design exists.

Previously, with `strict` mode, the system assumed local schemas of your compiled models would be available. In `baseline` mode, we can no longer assume the full local schema is available and complete, so `baseline` uses the remote database as the source of truth &mdash; similar to <Constant name="core"/>.

The practical result is that the <Constant name="fusion" /> compiler may sometimes flag incorrect queries that result from introspective queries that come back empty. If you encounter this, you can:

1. Ignore the warning
2. Build the model locally
3. (Coming soon) Use `warn_error_options` to disable the warning

For example, consider this query using the `dbt_utils.unpivot` macro:

```sql
select * from (
{{
    dbt_utils.unpivot(
        relation=ref('example_model'),
        cast_to='integer',
        exclude=['order_id', 'customer_id'],
        field_name='product_type',
        value_name='quantity'
    )
}}
)
```

If the introspection query fails or returns no results, this renders to:

```sql
select * from (

)
```

This is invalid SQL. In `baseline` mode, <Constant name="fusion" /> displays a warning so your project can continue running while still alerting you to the issue:

```bash
dbt0101: no viable alternative at input '(
    
)'
  --> models/example_model.sql:17:1
```

#### Migration scenarios

Migrating to <Constant name="fusion" /> can involve more than moving YAML around. Some scenarios that can make migration more involved include:

1. **Limited access to sources**: You don't have access to all the sources and models of a large dbt project.
2. **Intricate Jinja workflows**: Your project uses post-hooks and introspection extensively.
3. **Package compatibility**: Your project depends on packages that aren't yet <Constant name="fusion" />-compatible.
4. **Unsupported SQL features**: Your models or sources use advanced data types (`STRUCT`, `ARRAY`, `GEOGRAPHY`) or built-in functions (`AI.PREDICT`, `JSON_FLATTEN`, `st_pointfromgeohash`) not yet supported by the <Constant name="fusion_engine" />.

Setting `static_analysis` to `baseline` mode lets you start using <Constant name="fusion" /> immediately while you address these scenarios incrementally. As you resolve compatibility issues, you can opt specific models or your entire project into `strict` mode for maximum validation guarantees.

## Recapping the differences between engines

<Constant name="core_v1" /> and [<Constant name="core_v2" />](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2) (currently in beta):

- Renders and runs models one at a time.
- Never runs static analysis.

The <Constant name="fusion_engine" /> (baseline mode &mdash; default):

- Statically analyzes all models, catching most SQL errors while providing a familiar migration experience.

The <Constant name="fusion_engine" /> (strict mode):

- Renders and statically analyzes all models before execution begins.
- Guarantees nothing runs until the entire project is proven valid.
- Parses `CREATE FUNCTION` in [`sql_header`](/reference/resource-configs/sql_header) and in [`on-run-start`](/reference/project-configs/on-run-start-on-run-end) hooks, then registers those UDFs so strict compilation can resolve calls to them. `baseline` and `off` don't register UDFs this way. See [User-defined functions (UDFs) in `strict` mode](/reference/resource-configs/static-analysis#user-defined-functions-udfs-in-strict-mode).

## Configuring `static_analysis`

You can modify the way static analysis is applied for specific models in your project. The static analysis configuration cascades from most strict to least strict. Going downstream in your lineage, a model can keep the same mode or relax it &mdash; it can't be stricter than its parent.

Setting `static_analysis: strict` on a model does not automatically set `strict` for downstream models; they keep the project default unless you set them explicitly. For rules and examples, refer to [How modes cascade in your lineage](#how-modes-cascade-in-your-lineage) and [strict mode inheritance](#strict-mode-inheritance).

Some models are also downgraded automatically, regardless of what you configure. Refer to [Custom materializations and static analysis](#custom-materializations).

The [`static_analysis`](/reference/resource-configs/static-analysis) config options are:

- `baseline` (default): Statically analyze SQL. This is the recommended starting point for users transitioning from <Constant name="core" />, providing a smooth migration experience while still catching most SQL errors.
- `strict` (previously `on`): Statically analyze all SQL before execution begins. Use this for maximum validation guarantees &mdash; nothing runs until the entire project is proven valid.
- `off`: Skip SQL analysis on this model and its descendants.

<VersionBlock firstVersion="2.0">

Any run that uses `strict` mode requires authentication using [`dbt login`](/reference/commands/login?version=2.0), whether `strict` is set with the `--static-analysis strict` CLI flag or in `dbt_project.yml`. Unauthenticated runs fall back to `baseline`.

</VersionBlock>

:::caution Deprecated values

The `on` and `unsafe` values are deprecated and will be removed in May 2026. Use `strict` instead.

:::

When you disable static analysis, features of the VS Code extension which depend on SQL comprehension will be unavailable.

The best place to configure `static_analysis` is as a config on an individual model or group of models. As a debugging aid, you can also use the [`--static-analysis strict`](/reference/global-configs/static-analysis-flag) or `--static-analysis off` CLI flags to override all model-level configuration.

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

#### How modes cascade in your lineage

Two rules determine which mode a model can use:

- **Eligibility rule:** A model is eligible for static analysis only if all of its upstream dependencies are eligible.
- **Strictness rule:** A model can't be stricter than its parents. The strictness hierarchy is `strict` → `baseline` → `off`.

Going downstream, a model can keep its parent's mode or relax it, but it can't tighten it:

<SimpleTable>

| Upstream model | Downstream can be |
|-------------|--------------|
| `strict`    | `strict`, `baseline`, or `off` |
| `baseline`  | `baseline` or `off` (not `strict`) |
| `off`       | `off` only |

</SimpleTable>

The strictness rule exists because `baseline` doesn't produce the full analyzed schema that `strict` needs from its upstream models. Without that information, a downstream model can't run strict-level type checking. For the complete reference, refer to [How static analysis modes cascade](/reference/resource-configs/static-analysis#how-static-analysis-modes-cascade).

#### strict mode inheritance

Unlike `baseline` or `off`, `strict` mode doesn't propagate to downstream models. If you configure a model as `strict`, its downstream models won't inherit `strict` mode unless you set them explicitly. To make all models `strict`, you must set `+static_analysis: strict` on root models first, or use the project-wide config in the next section at the project level.

For example, in A → B → C with a default of `baseline`, configuring A (a root node) as `strict` makes only A `strict` &mdash; B and C remain baseline unless configured. To make the full chain `strict`, set `+static_analysis: strict` on each relevant model or group, or use a project-wide setting.

This approach lets you gain the benefits of strict validation where possible while keeping the flexibility of baseline analysis for models that aren't yet compatible.

Refer to [CLI options](/reference/global-configs/command-line-options) and [Configurations and properties](/reference/configs-and-properties) to learn more about configs.

### Custom materializations

If a model uses a [custom materialization](/guides/create-new-materializations), dbt v2 turns static analysis `off` for that model and for every model downstream of it. It does this automatically, without an error or a warning, no matter what you set `static_analysis` to.

Because custom materialization is code you wrote, and it can change the finished table in ways v2 can't predict (for example, adding, renaming, or retyping columns). Rather than check your SQL against a schema that might be wrong, dbt skips analysis. It's the same reason dbt skips [introspective queries](#introspection-handling-in-baseline-mode), whose results also aren't known until the model runs.
Two kinds of custom materializations trigger the downgrade to `off`:
- **A name you invented**, such as `materialized='my_custom_load'`. Find these in your model configs.
- **A name that's already built in**, such as your own macro named `materialization table, default`. These are harder to spot, because models that say `materialized='table'` look standard but run your code instead of dbt's.
What this means in practice:

- Models using a custom materialization don't fail because of static analysis.
- Setting `static_analysis: strict` (or `baseline`) on those models has no effect as the downgrade to `off` overrides other settings.
- Because `off` cascades downstream, every model downstream of a model using a custom materialization is also ineligible for static analysis. In a project where most models use a custom materialization, this can disable static analysis, and the [features that depend on it](#lsp-feature-comparison), for the majority of the DAG.

If your project depends heavily on custom materializations and you want static analysis coverage, these are your options today:
* Convert those models to built-in materializations where practical
* Isolate custom materializations so fewer downstream models are affected

:::note

We're reevaluating this automatic downgrade. The intent is for `baseline` analysis to keep working for models with custom materializations, and for you to account for schema-modifying materializations yourself when using `strict`. This page will be updated when that behavior changes.

:::

### Identify a model's mode

Because a model's effective mode depends on its parents (and on [custom materializations](#custom-materializations)), the mode you configured isn't always the mode in effect. The [dbt VS Code extension](/docs/about-dbt-extension) and the <Constant name="studio_ide" /> show CodeLens above your models even when static analysis is off, indicating which models have static analysis disabled and why.

Keep in mind that `dbt ls --output json --output-keys config.static_analysis` reports the mode you _configured_ for each model, not the mode dbt v2 resolves after applying the cascading rules and automatic downgrades.

### Example configurations

##### Configure strict for the entire project

Many teams want to enable `strict` mode for the whole project and all packages. You can do this by setting `+static_analysis: strict` under each resource type in `dbt_project.yml` for your project name (and for any package names if you want those to be strict too):

<File name='dbt_project.yml'>

```yaml
models:
  my_project:
    +static_analysis: strict

seeds:
  my_project:
    +static_analysis: strict

snapshots:
  my_project:
    +static_analysis: strict

tests:
  my_project:
    +static_analysis: strict

unit_tests:
  my_project:
    +static_analysis: strict

sources:
  my_project:
    +static_analysis: strict

analyses:
  my_project:
    +static_analysis: strict
```

</File>

Use your project name in place of `my_project` — that's the same value as the `name:` key at the top of `dbt_project.yml` (for example, `jaffle_shop`). To apply `strict` to a package as well, add another entry under each resource type using the package name as the key; for example, under `models:` add `your_package_name:` with `+static_analysis: strict` beneath it.

##### Disable static analysis for all models in a package:

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

##### Disable static analysis in YAML:

<File name='models/my_udf_using_model.yml'>

```yml
models:
  - name: model_with_static_analysis_off
    config:
      static_analysis: off
```

</File>

##### Disable static analysis for a model using a custom UDF:

<File name='models/my_udf_using_model.sql'>

```sql
{{ config(static_analysis='off') }}

select 
  user_id,
  my_cool_udf(ip_address) as cleaned_ip
from {{ ref('my_model') }}
```

</File>

### Can I use strict mode in development and baseline in deployment?

Yes. This pattern is valid and recommended: use `strict` while you develop for stronger validation, and keep `baseline` in deployment for faster runs that are less likely to stop on analysis findings.

For more information, including CLI examples and an optional environment variable pattern, refer to [Optimize static analysis for development and deployment](/best-practices/optimize-static-analysis-for-development-and-deployment).

### When should I turn static analysis `off`?

With baseline mode enabled by default, static analysis is less likely to block your runs. You should only disable it if the <Constant name="fusion_engine" /> cannot parse SQL that is valid for your database of choice.

This is a very rare occurrence. If you encounter this situation, please [open an issue](https://github.com/dbt-labs/dbt-fusion/issues) with an example of the failing SQL so we can update our parsers.

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />

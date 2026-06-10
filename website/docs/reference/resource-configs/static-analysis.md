---
resource_types: [models, tests, seeds, snapshots]
title: "static_analysis"
description: "Use the static_analysis config to control how the Fusion engine performs static SQL analysis for models, tests, seeds, and snapshots."
intro_text: "static_analysis controls how the Fusion engine analyzes SQL at compile time for models, tests, seeds, and snapshots."
datatype: string
default_value: baseline
sidebar_label: "static_analysis"
---

:::info

The `static_analysis` config is available in the <Constant name="fusion_engine"/> only. It isn't available in <Constant name="core" /> and will be ignored. To upgrade to <Constant name="fusion"/>, refer to [Get started with <Constant name="fusion"/>](/docs/fusion/get-started-fusion).

:::

The `static_analysis` config sets how the <Constant name="fusion_engine" /> validates SQL before execution—using `strict` analysis, a `baseline` that balances checks with compatibility, or `off` to skip analysis when needed. You can find supported configuration locations for each resource type.

To check out which Snowflake functions are supported in <Constant name="fusion"/> in `strict` mode, refer to [Snowflake function support](/reference/resource-configs/snowflake-function-support)

<Tabs>

<TabItem value="models" label="Models">

<File name='dbt_project.yml'>

```yml
models:
  [resource-path](/reference/resource-configs/resource-path):
    +static_analysis: strict | baseline | off

```

</File>

<File name='models/filename.yml'>

```yml
models:
  - name: model_name
    [config](/reference/resource-properties/config):
      static_analysis: strict | baseline | off
```

</File>

<File name='models/model_name.sql'>

```sql
{{ config(static_analysis='strict' | 'baseline' | 'off') }}
```

</File>

</TabItem>

<TabItem value="tests" label="Tests">

<File name='dbt_project.yml'>

```yml
data_tests:
  +static_analysis: strict | baseline | off
```

</File>

<File name='models/filename.yml'>

```yml
models:
  - name: model_name
    data_tests:
      - not_null:
          arguments:
            column_name: your_column_name
          config:
            static_analysis: strict | baseline | off
```

</File>

</TabItem>

<TabItem value="seeds" label="Seeds">

<File name='dbt_project.yml'>

```yml
seeds:
  [resource-path](/reference/resource-configs/resource-path):
    +static_analysis: strict | baseline | off
```

</File>

<File name='seeds/filename.yml'>

```yml
seeds:
  - name: seed_name
    [config](/reference/resource-properties/config):
      static_analysis: strict | baseline | off
```

</File>

</TabItem>

<TabItem value="snapshots" label="Snapshots">

<File name='dbt_project.yml'>

```yml
snapshots:
  [resource-path](/reference/resource-configs/resource-path):
    +static_analysis: strict | baseline | off
```

</File>

<File name='snapshots/filename.yml'>

```yml
snapshots:
  - name: snapshot_name
    [config](/reference/resource-properties/config):
      static_analysis: strict | baseline | off
```

</File>

</TabItem>

</Tabs>

## Definition

You can configure `static_analysis` for [models](/docs/build/sql-models), [data tests](/docs/build/data-tests), [seeds](/docs/build/seeds), and [snapshots](/docs/build/snapshots).

You can configure if and when the <Constant name="fusion_engine" /> performs static SQL analysis for a model. Configure the `static_analysis` config in your project YAML file (`dbt_project.yml`), model properties YAML file, or in a SQL config block in your model file. Refer to [Principles of static analysis](/docs/fusion/new-concepts?version=1.12#principles-of-static-analysis) for more information on the different modes of static analysis.

Setting a model to `strict` does not automatically set `strict` for downstream models; they keep the project default unless you configure them explicitly. For more information and examples, refer to [strict mode inheritance](/docs/fusion/new-concepts#strict-mode-inheritance).

The following values are available for `static_analysis`:

- `baseline` (default): Statically analyze SQL. This is the recommended starting point for users transitioning from <Constant name="core" />, providing a smooth migration experience while still catching most SQL errors. You can incrementally opt-in to stricter analysis over time.
- `strict` (previously `on`): Statically analyze all SQL before execution begins. Use this for maximum validation guarantees &mdash; nothing runs until the entire project is proven valid.
- `off`: Skip SQL analysis for this model and its descendants.

:::caution Deprecated values

The `on` and `unsafe` values are deprecated and will be removed in May 2026. Use `strict` instead.

:::

### User-defined functions (UDFs) in `strict` mode

When `static_analysis: strict` is in effect, the <Constant name="fusion_engine" /> parses `CREATE FUNCTION` statements from [`sql_header`](/reference/resource-configs/sql_header) and from [`on-run-start`](/reference/project-configs/on-run-start-on-run-end) project hooks, registers those UDFs in the compiler registry, and makes them available during strict static compilation. The `baseline` and `off` modes don't perform this UDF registration for static analysis.

A model’s `sql_header` can include multiple statements. <Constant name="fusion" /> registers UDFs from `CREATE FUNCTION` statements and ignores other statements for this step.

If strict analysis still cannot resolve a UDF, set [`static_analysis: off`](/reference/resource-configs/static-analysis#disable-static-analysis-in-sql-for-a-model-using-a-custom-udf) on the affected models.

### How static analysis modes cascade

Two rules determine how `static_analysis` modes apply in a lineage:
- Eligibility rule: A model is eligible for static analysis only if all of its "parents" are eligible (by parents, we mean the models that are upstream of the current model in the lineage).
- Strictness rule: A "child" model cannot be stricter than its parent (by child, we mean the models that are downstream of the current model in the lineage).

The static analysis configuration cascades from most strict to least strict. Here's the strictness hierarchy:
`strict` → `baseline` → `off`

**Allowed downstream by parent mode**<br /> 
When going downstream in your lineage, you can keep the same mode or relax it; but you cannot make a child stricter than its parent. The following table shows the allowed downstream modes by parent mode:

<SimpleTable>
| Parent mode | Child can be |
|-------------|--------------|
| `strict`    | `strict`, `baseline`, or `off` |
| `baseline`  | `baseline` or `off` (not `strict`) |
| `off`       | `off` only |
</SimpleTable>

For example, for the lineage Model A → Model B → Model C:

- If Model A is `baseline`, you _cannot_ set Model B to `strict`
- If Model A is `strict`, you _can_ set Model B to `baseline`

This makes sure that stricter validation requirements don't apply downstream when parent models haven't met those requirements.

Refer to the Fusion concepts page for deeper discussion and visuals: [New concepts](/docs/fusion/new-concepts). For more info on the JSON schema, refer to the [dbt-jsonschema file](https://github.com/dbt-labs/dbt-jsonschema/blob/1e2c1536fbdd421e49c8b65c51de619e3cd313ff/schemas/latest_fusion/dbt_project-latest-fusion.json#L4689).

## CLI override

You can override model-level configuration for a run using the following CLI flags. For example, to disable static analysis for a run:

```bash
dbt run --static-analysis off # disable static analysis for all models
dbt run --static-analysis baseline # use baseline analysis for all models
```

See [static analysis CLI flag](/reference/global-configs/static-analysis-flag).

## Examples

The following examples show how to disable or configure `static_analysis` for different scenarios:

<!-- no toc -->
- [Disable static analysis for all models in a package](#disable-static-analysis-for-all-models-in-a-package)
- [Disable static analysis in YAML for a single model](#disable-static-analysis-in-yaml-for-a-single-model)
- [Disable static analysis in SQL for a model using a custom UDF](#disable-static-analysis-in-sql-for-a-model-using-a-custom-udf)
- [Configure static analysis for tests](#configure-static-analysis-for-tests)
- [Configure static analysis for seeds](#configure-static-analysis-for-seeds)
- [Configure static analysis for snapshots](#configure-static-analysis-for-snapshots)

#### Disable static analysis for all models in a package
This example shows how to disable static analysis for all models in a package. The [`+` prefix](/reference/resource-configs/plus-prefix) applies the config to all models in the package.

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

#### Disable static analysis in YAML for a single model

This example shows how to disable static analysis for a single model in YAML.

<File name='models/my_udf_using_model.yml'>

```yml
models:
  - name: model_with_static_analysis_off
    config:
      static_analysis: off
```

</File>

#### Disable static analysis in SQL for a model using a custom UDF

This example shows how to disable static analysis for a model using a custom [user-defined function (UDF)](/docs/build/udfs) in a SQL file.

<File name='models/my_udf_using_model.sql'>

```sql
{{ config(static_analysis='off') }}

select
  user_id,
  my_cool_udf(ip_address) as cleaned_ip
from {{ ref('my_model') }}
```

</File>

#### Configure static analysis for data tests

This example shows how to set static analysis for all tests in a project using `dbt_project.yml`.

<File name='dbt_project.yml'>

```yaml
# dbt_project.yml
data_tests:
  +static_analysis: baseline
```

</File>

To configure static analysis for a specific data test on a model:

<File name='models/filename.yml'>

```yaml
# models/filename.yml
models:
  - name: my_model
    data_tests:
      - not_null:
          arguments:
            column_name: order_id
          config:
            static_analysis: off
```

</File>

#### Configure static analysis for seeds

This example shows how to set static analysis for all seeds in a project.

<File name='dbt_project.yml'>

```yaml
# dbt_project.yml
seeds:
  your_project:
    +static_analysis: baseline
```

</File>

To configure a single seed in a properties file:

<File name='seeds/filename.yml'>

```yaml
# seeds/filename.yml
seeds:
  - name: my_seed
    config:
      static_analysis: off
```

</File>

#### Configure static analysis for snapshots

This example shows how to set static analysis for all snapshots in a project.

<File name='dbt_project.yml'>

```yaml
# dbt_project.yml
snapshots:
  your_project:
    +static_analysis: baseline
```

</File>

To configure a single snapshot in a properties file:

<File name='snapshots/filename.yml'>

```yaml
# snapshots/filename.yml
snapshots:
  - name: my_snapshot
    config:
      static_analysis: off
```

</File>

## Considerations

- For models, disabling static analysis means that features of the VS Code extension that depend on SQL comprehension will be unavailable.
- For models, static analysis can fail in some cases (for example, dynamic SQL constructs or unrecognized UDFs) and you might need to set `static_analysis: off`. For more examples, refer to [When should I turn static analysis off?](/docs/fusion/new-concepts#when-should-i-turn-static-analysis-off).

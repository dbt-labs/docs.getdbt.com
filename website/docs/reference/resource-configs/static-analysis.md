---
resource_types: [models]
title: "static_analysis"
description: "Use static_analysis config to control how the Fusion engine performs static SQL analysis for models."
datatype: string
default_value: on
sidebar_label: "static_analysis"
---

:::info

The `static_analysis` config is available in the <Constant name="fusion_engine"/> only. It isn't available in <Constant name="core" /> and will be ignored. To upgrade to <Constant name="fusion"/>, refer to [Get started with <Constant name="fusion"/>](/docs/fusion/get-started-fusion).

:::

<Tabs>

<TabItem value="dbt_project.yml" label="Project file">

<File name='dbt_project.yml'>

```yml
models:
  [resource-path](/reference/resource-configs/resource-path):
    +static_analysis: on | unsafe | off

```

</File>

</TabItem>

<TabItem value="Property file">

<File name='models/filename.yml'>

```yml
models:
  - name: model_name
    [config](/reference/resource-properties/config):
      static_analysis: on | unsafe | off
```

</File>
</TabItem>

<TabItem value="SQL config">

<File name='models/model_name.sql'>

```sql
{{ config(static_analysis='on' | 'unsafe' | 'off') }}

select 
  user_id,
  my_cool_udf(ip_address) as cleaned_ip
from {{ ref('my_model') }}
```

</File>

</TabItem>

</Tabs>

## Definition

You can configure if and when the <Constant name="fusion_engine" /> performs static SQL analysis for a model. Configure the `static_analysis` config in your `dbt_project.yml` file, model YAML file, or in the `config` block of your model file. Refer to [rendering strategies](/docs/fusion/new-concepts#rendering-strategies) for more information on how the <Constant name="fusion_engine" /> renders models.

The following values are available for `static_analysis`:

- `on`: Statically analyze SQL ahead-of-time (AOT). Default for non-introspective models, depends on AOT rendering.
- `unsafe`: Statically analyze SQL just-in-time (JIT). The default for when a model (or any of its parents) uses introspective queries. JIT analysis still catches most SQL errors, but [analysis happens]( /docs/fusion/new-concepts#static-analysis-and-introspective-queries) after some upstream execution.
- `off`: Skip SQL analysis for this model and its descendants.

A model is _only_ eligible for static analysis if all of its parents are also eligible.

Refer to the Fusion concepts page for deeper discussion and visuals: [New concepts](/docs/fusion/new-concepts). For more info on the JSON schema, refer to the [dbt-jsonschema file](https://github.com/dbt-labs/dbt-jsonschema/blob/1e2c1536fbdd421e49c8b65c51de619e3cd313ff/schemas/latest_fusion/dbt_project-latest-fusion.json#L4689).

## CLI override

You can override model-level configuration for a run using the following CLI flags. For example, to disable static analysis for a run:

```bash
dbt run --static-analysis off # disable static analysis for all models
dbt run --static-analysis unsafe # use JIT analysis for all models
```

See [static analysis CLI flag](/reference/global-configs/static-analysis-flag).

## Examples

The following examples show how to disable static analysis for all models in a package, for a single model, and for a model that uses a custom UDF.

<!-- no toc -->
- [Disable static analysis for all models in a package](#disable-static-analysis-for-all-models-in-a-package)
- [Disable static analysis in YAML for a single model](#disable-static-analysis-in-yaml-for-a-single-model)
- [Disable static analysis in SQL for a model using a custom UDF](#disable-static-analysis-in-sql-for-a-model-using-a-custom-udf)   

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

## Considerations

- Disabling static analysis means that features of the VS Code extension that depend on SQL comprehension will be unavailable.
- Static analysis might fail in some cases (for example, dynamic SQL constructs or unrecognized UDFs) and may require setting `static_analysis: off`. For more examples, refer to [When should I turn static analysis off?](/docs/fusion/new-concepts#when-should-i-turn-static-analysis-off).

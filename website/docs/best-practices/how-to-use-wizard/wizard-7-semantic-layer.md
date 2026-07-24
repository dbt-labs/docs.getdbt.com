---
title: "Building Semantic Layer definitions with dbt Wizard"
id: "wizard-7-semantic-layer"
description: "Use dbt Wizard to plan, write, and validate Semantic Layer entities, dimensions, metrics, and saved queries."
sidebar_label: "Build Semantic Layer definitions"
tags: [AI, Wizard, Semantic Layer]
---

<IntroText>
Use <Constant name="wizard" /> to turn a business question or an existing dbt model into version-compatible <Constant name="semantic_layer" /> definitions. <Constant name="wizard" /> inspects model grain, columns, lineage, and nearby YAML before it proposes entities, dimensions, and metrics.
</IntroText>

This workflow uses your project files and available dbt metadata to guide the work. You can also add the `building-dbt-semantic-layer` skill from the [dbt Agent Skills repository](https://github.com/dbt-labs/dbt-agent-skills) for reusable Semantic Layer guidance.

The prompts on this page work the same way in <Constant name="dbt_platform" />.

## Before you begin

Identify the following information before you ask <Constant name="wizard" /> to edit files:

- The business question or metric you want to support.
- The model, or set of candidate models, that contains the relevant data.
- The grain of each model, when you already know it.
- Any naming, certification, or ownership conventions your team follows.

If you don't know which model to use, start with the business question. For example:

```text
We need to report gross revenue and order count by customer segment and month.
Find the best models to build on, explain your choices, and propose the Semantic
Layer definitions before editing files.
```

## Ask Wizard to plan the definitions

Give <Constant name="wizard" /> a specific model when you know the starting point:

```text
Build Semantic Layer definitions for fct_orders. First determine the dbt version
and inspect the model grain, columns, lineage, and existing YAML. Propose the
entities, dimensions, and metrics before making changes. Include total revenue,
order count, and a monthly time dimension.
```

<Constant name="wizard" /> should complete these planning steps before editing:

1. Determine the dbt version from the installed binary, `require-dbt-version`, or manifest metadata.
2. Inspect the target model's SQL, columns, and upstream and downstream lineage.
3. Check nearby YAML and existing semantic definitions so the new content follows project conventions.
4. Identify the model grain and at least one primary entity.
5. Propose time and categorical dimensions and metrics whose aggregations are meaningful for the underlying data.

Ask <Constant name="wizard" /> to sample data only when names, types, and SQL don't establish the meaning of a column. Review and approve the warehouse query before it runs.

## Review the generated YAML

The correct YAML structure depends on the dbt version in your project. Review the generated file for the version-specific patterns in the following table.

<SimpleTable>

| Project version | Expected structure |
|---|---|
| [<Constant name="core" /> 1.12 and later](/docs/dbt-versions/core-upgrade/upgrading-to-v1.12?version=2.0&name=Fusion#new-semantic-layer-yaml-spec), and the [<Constant name="fusion_engine" />](/docs/dbt-versions/core-upgrade/upgrading-to-v2?version=2.0) | Configure `semantic_model` on a model, annotate entities and dimensions on columns, and define metrics on the model. Don't use a top-level `semantic_models:` block for new definitions. |
| [<Constant name="core" /> 1.6 through 1.11](/docs/dbt-versions/core-upgrade/upgrading-to-v1.11?version=2.0) | Define semantic models in a top-level `semantic_models:` block and define metrics with `type_params` that reference measures. |

</SimpleTable>

For <Constant name="core" /> 1.12 and later and the <Constant name="fusion_engine" />, a generated definition can resemble the following example:

```yaml
models:
  - name: fct_orders
    semantic_model:
      enabled: true
    agg_time_dimension: ordered_at
    columns:
      - name: order_id
        entity:
          type: primary
          name: order
      - name: customer_id
        entity:
          type: foreign
          name: customer
      - name: ordered_at
        granularity: day
        dimension:
          type: time
      - name: order_status
        dimension:
          type: categorical
    metrics:
      - name: total_revenue
        type: simple
        label: Total Revenue
        agg: sum
        expr: order_total
      - name: order_count
        type: simple
        label: Order Count
        agg: count_distinct
        expr: order_id
```

For <Constant name="core" /> 1.6 through 1.11, expect the top-level semantic model pattern:

```yaml
semantic_models:
  - name: orders
    model: ref('fct_orders')
    defaults:
      agg_time_dimension: ordered_at
    entities:
      - name: order
        type: primary
        expr: order_id
    dimensions:
      - name: ordered_at
        type: time
        type_params:
          time_granularity: day
    measures:
      - name: total_revenue
        agg: sum
        expr: order_total

metrics:
  - name: total_revenue
    type: simple
    label: Total Revenue
    type_params:
      measure: total_revenue
```

Confirm that every generated definition has a clear business meaning. A numeric column isn't automatically a useful metric, and an ID isn't automatically the correct primary entity.

## Validate the definitions

Ask <Constant name="wizard" /> to validate after you approve the YAML:

```text
Validate the Semantic Layer changes. Parse the project, run the supported
Semantic Layer validation for this environment, and report errors, warnings,
and any checks you couldn't complete. Don't change the definitions to silence
an error without explaining the root cause.
```

At minimum, validation should confirm that:

- The project parses successfully.
- Model, column, entity, measure, and metric references resolve.
- The aggregate time dimension points to a declared time dimension.
- The selected metric aggregation matches the model grain.
- Semantic Layer validation passes when the project's dbt runtime supports it.

When a validation command isn't available in the current environment, <Constant name="wizard" /> should report that limitation instead of treating the work as fully validated. For a broader validation procedure, refer to [Validating dbt changes with <Constant name="wizard" />](/best-practices/how-to-use-wizard/wizard-3-validate-changes).

## Extend the first definitions

After the initial definitions validate, continue with focused prompts rather than asking for an entire project conversion at once. For example:

```text
Add a derived average order value metric using the existing revenue and order
count metrics. Explain how the metric joins and time grain will behave before
editing the YAML.
```

```text
Create a saved query for monthly revenue and order count grouped by customer
segment. Reuse existing entities and dimensions, and validate every reference.
```

## Related docs

- [Semantic models](/docs/build/semantic-models)
- [Metrics overview](/docs/build/metrics-overview)
- [Use cases and examples](/docs/dbt-ai/wizard-use-cases)
- [Use skills with <Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-skills)
- [Validating dbt changes with <Constant name="wizard" />](/best-practices/how-to-use-wizard/wizard-3-validate-changes)

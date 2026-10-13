---
title: "Understanding a dbt project with dbt Wizard"
id: "wizard-2-understand-project"
description: "Use dbt Wizard CLI to map an unfamiliar dbt project, investigate model behavior, and identify downstream impact."
sidebar_label: "Understand a dbt project"
tags: [AI, Wizard]
---


<IntroText>

Use <Constant name="wizard" / > to move from a broad project map to evidence-backed answers about model logic, lineage, tests, and data.
</IntroText>

This workflow helps when you join a project, review an unfamiliar area of the DAG, prepare a refactor, or investigate why a model exists.

## Prerequisites

Start <Constant name="wizard" /> from the dbt project root, and make sure the project has a current `target/manifest.json`. Refer to [Use <Constant name="wizard" /> locally](/docs/dbt-ai/wizard-quickstart) for setup.

If you want <Constant name="wizard" /> to inspect warehouse results, you also need a working development connection and permission to query the relevant relations.

The prompts on this page work the same way in <Constant name="dbt_platform" />.

## Start with a project map

Ask for a read-only inventory before narrowing the investigation:

```text
Map this dbt project for a new analytics engineer. Identify the main model
layers, important sources, high fan-out models, test coverage gaps, and the
three areas that deserve careful review. Cite the files and metadata you used.
Do not edit anything.
```

This gives you a starting hypothesis, not a complete project specification. Ask follow-up questions about any labels or architectural claims that aren't supported by code, configuration, or metadata.

## Investigate one model

Name a model and ask <Constant name="wizard" /> to connect its definition to its place in the DAG:

```text
Explain fct_orders to me. Describe its grain, inputs, important transformations,
tests, materialization, and direct downstream consumers. Point out anything the
code does not make clear.
```

For a thorough investigation, <Constant name="wizard" /> can:

1. Find the model and its related YAML, tests, macros, and configuration.
2. Describe the selected columns, SQL, materialization, and dependencies.
3. Trace upstream inputs and downstream consumers through project lineage.
4. Query structured project metadata for test coverage and resource properties.
5. Preview or summarize warehouse data when a connection and relation are available.

Ask <Constant name="wizard" /> to separate observed facts from inferences. For example:

```text
For each conclusion, label it as code, metadata, warehouse evidence, or an
inference. List the business questions I still need to ask the model owner.
```

## Trace a business concept

You don't need to know the model name before you begin. Describe the concept and let <Constant name="wizard" /> search for likely resources:

```text
Trace how recurring revenue is calculated from source to final mart. Include
the models, columns, macros, tests, and metrics involved. Call out where the
definition changes or where multiple definitions exist.
```

When several candidates match, ask <Constant name="wizard" /> to show the candidates and explain why each one might be relevant before continuing.

## Assess change impact

Once you understand the current behavior, test a proposed change without editing files:

```text
What would be affected if stg_payments changed from one row per payment to one
row per payment attempt? Identify direct and indirect downstream resources,
grain-dependent joins, tests, metrics, and exposures. Do not make changes.
```

Use the result to define the scope of a change plan. High fan-out models, contracts, metrics, exposures, and joins on the changed grain deserve closer review.

## Confirm assumptions with data

SQL and metadata show intended behavior. Warehouse data can help you check whether that intent matches current results:

```text
Check whether fct_orders is currently one row per order_id and summarize nulls
or duplicates in its key columns. Use the smallest reasonable query and show
me the query before running it.
```

Treat current data as evidence about the present state, not a permanent guarantee. Sampling, filters, stale relations, and environment differences can all affect the result.

## Turn findings into a plan

End the investigation with a handoff that another engineer can review:

```text
Summarize what we learned, unresolved business questions, affected resources,
and a safe implementation and validation plan. Keep facts separate from
recommendations. Do not edit files yet.
```

The summary should include relevant file paths, model names, lineage scope, supporting evidence, and explicit unknowns.

## Understand what can be missing

<Constant name="wizard" /> can reason from the project and the tools connected to the session. It can't reliably infer context that isn't represented there, including:

- Undocumented business definitions and ownership decisions.
- Dashboard or application dependencies that aren't represented as exposures or connected metadata.
- Warehouse behavior that the current connection can't query.
- The reason behind a historical design choice when it isn't recorded in code, documentation, or version history.
- Data quality guarantees that don't have corresponding tests or contracts.

Use model owners, pull request history, and business documentation to fill these gaps.

## Related docs

- [Validate dbt changes with <Constant name="wizard" />](/best-practices/how-to-use-wizard/wizard-3-validate-changes)
- [<Constant name="wizard" /> use cases](/docs/dbt-ai/wizard-use-cases)
- [How <Constant name="wizard" /> works](/docs/dbt-ai/wizard-how-it-works)
- [About model governance](/docs/mesh/govern/about-model-governance)

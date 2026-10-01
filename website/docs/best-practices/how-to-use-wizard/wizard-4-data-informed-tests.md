---
title: "Adding data-informed tests with dbt Wizard"
id: "wizard-4-data-informed-tests"
description: "Use dbt Wizard CLI to find test coverage gaps, check assumptions against warehouse data, and add focused dbt data tests."
sidebar_label: "Add data-informed tests"
tags: [AI, Wizard]
---


<IntroText>
Use <Constant name="wizard" /> CLI to identify meaningful test gaps, validate assumptions against current warehouse data, and write focused dbt data tests.
</IntroText>

This workflow uses the built-in `test_writer` agent. Unlike a request that names tests in advance, `test_writer` starts with project metadata and model importance, forms candidate assertions, and checks those assertions against available data before proposing YAML changes.

:::info CLI workflow
The built-in `test_writer` agent is available in <Constant name="wizard" /> CLI. Refer to [Use subagents with <Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-subagents) for availability and agent behavior.
:::

## Prerequisites

Before you begin:

- [Install and configure <Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-quickstart).
- Start <Constant name="wizard" /> from a dbt project with a current `target/manifest.json`.
- Configure a development connection that can query the models you want to inspect.
- Build the relevant models if their development relations don't exist.
- Decide whether sensitive columns or expensive relations should be excluded from profiling.

Warehouse queries can consume compute and can expose data values in your terminal session. Review proposed queries and apply your organization's data-access policies.

## Choose a focused scope

Start with a model or a small project area. This keeps the proposed tests reviewable and the warehouse queries bounded:

```text
Use test_writer to improve test coverage for stg_customers. Inspect its existing
tests and downstream importance, validate candidate assumptions against current
data, and propose only high-signal tests. Do not change model SQL.
```

You can also ask <Constant name="wizard" /> to find a starting point:

```text
Use test_writer to find three important models with weak test coverage. Prioritize
high fan-out models and models that define a business grain. Explain the ranking
before writing tests.
```

State constraints in the prompt. For example, name columns that must not be queried, limit the number of models, or ask <Constant name="wizard" /> to avoid custom generic tests.

## Review the coverage analysis

Before it writes YAML, ask `test_writer` to explain:

- Which models and columns already have tests.
- Why the selected model is important to downstream resources.
- What grain or business rule each candidate test represents.
- Which candidates are based on code or metadata and which are inferred from data.
- What warehouse query would validate each assumption.

The strongest candidates protect model contracts and business behavior, not just the shape of today's sample.

<SimpleTable>

| Candidate test | Evidence to review |
| --- | --- |
| `not_null` | The column is required by the model grain, contract, or downstream logic, and current nulls have been investigated. |
| `unique` | The column or column combination represents the intended grain, and duplicate checks support that assumption. |
| `relationships` | The parent resource and key are authoritative, and orphaned values have been investigated. |
| `accepted_values` | The field is a governed enumeration, not merely a list of values observed in one query. |

</SimpleTable>

If the data disproves a candidate assertion, investigate the discrepancy. Don't automatically add a filter or weaken the test to make it pass.

## Approve the warehouse checks

`test_writer` can use warehouse previews to check assumptions such as uniqueness, nullability, relationships, and observed values. Before approving a query, confirm that:

- It uses the expected target and relation.
- Its selected columns comply with data-access policies.
- Its filters and limits won't hide the condition the test is meant to protect.
- Its expected scan and run time are reasonable.

You can ask for a smaller or more targeted query before approving it:

```text
Validate the proposed grain without selecting customer attributes. Query only
customer_id and aggregate counts, and explain any sampling or date filter.
```

## Review the proposed tests

For each proposed YAML change, confirm that:

- The test expresses an intended rule, not an accidental property of current data.
- The test is attached to the correct model and column.
- The YAML syntax matches the dbt version used by the project.
- Existing tests aren't duplicated.
- Test names, arguments, configuration, and severity follow project conventions.
- The diff doesn't include unrelated documentation or model changes.

The `test_writer` agent writes the tests. The normal <Constant name="wizard" /> validation flow is responsible for running them. Select an appropriate [validation level](/best-practices/how-to-use-wizard/wizard-3-validate-changes#choose-a-validation-level) and review any failing rows before accepting the final change.

## Investigate a failed candidate

When a new test fails, keep the original assumption visible while you determine what the data means:

```text
The proposed unique test on customer_id fails. Show the duplicate pattern,
check whether the intended grain uses another column, and tell me whether this
is a model defect, a source-data issue, or a bad test assumption. Do not modify
the test until you explain the evidence.
```

Possible outcomes include fixing a model defect, documenting a source limitation, selecting the correct compound grain, or rejecting the candidate test.

## Understand the limits

Data-informed test generation still requires engineering judgment:

- Current data can support or disprove an assumption, but it doesn't define the business rule.
- A passing test can miss future values, late-arriving data, and unqueried partitions.
- `accepted_values` tests need a governed list when new legitimate values can appear.
- Warehouse access, permissions, stale relations, and sampling can limit the evidence available.
- High test counts can increase build time without improving meaningful coverage.
- Tests don't replace model contracts, source freshness checks, monitoring, or review by a model owner.

## Related docs

- [Validate dbt changes with <Constant name="wizard" />](/best-practices/how-to-use-wizard/wizard-3-validate-changes)
- [Use subagents with <Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-subagents)
- [Data tests](/docs/build/data-tests)
- [Test best practices](/best-practices/writing-custom-generic-tests)

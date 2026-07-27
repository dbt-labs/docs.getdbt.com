---
title: "Validating dbt changes with dbt Wizard"
id: "wizard-3-validate-changes"
description: "Use dbt Wizard to assess impact, run the right level of validation, and review a dbt change before merging it."
sidebar_label: "Validate dbt changes"
tags: [AI, Wizard]
---

# Validating dbt changes with <Constant name="wizard" />

<IntroText>
Use <Constant name="wizard" /> to assess the impact of a change, choose a validation depth, and review evidence before you merge.
</IntroText>

This workflow is useful after you edit a model, test, macro, or YAML file and want more than a code-only review. <Constant name="wizard" /> can combine project metadata, dbt commands, development builds, and production comparisons based on the validation level you select.

:::info CLI workflow
The validation levels on this page are available in <Constant name="wizard" /> CLI. Validation controls in the <Constant name="dbt_platform" /> can differ. Refer to [<Constant name="wizard" /> in the <Constant name="dbt_platform" />](/docs/platform/wizard-platform) for platform behavior.
:::

## Prerequisites

Before you begin:

- [Install and configure <Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-quickstart).
- Open your dbt project in the terminal and start <Constant name="wizard" /> from the project root.
- Make sure the project has a current `target/manifest.json`. Run `dbt parse`, `dbt compile`, or `dbt build` if needed.
- Configure a development target that <Constant name="wizard" /> can use for commands that query or materialize data.
- Review your Git status so you know which changes belong to the task.

Warehouse validation can consume compute. <Constant name="wizard" /> shows commands for approval according to your session policy before it runs them.

## Review the change and its impact

Start by asking <Constant name="wizard" /> to establish the scope before it runs commands or edits files:

```text
Review my uncommitted changes. Explain which dbt resources changed, trace their
downstream impact, and propose a validation plan. Do not edit files yet.
```

For a targeted review, name the resource and the behavior that must remain stable:

```text
Validate the changes to fct_orders. Its grain must remain one row per order,
order_total must not change for completed orders, and downstream finance models
must still compile. Show me the validation plan before running it.
```

<Constant name="wizard" /> uses the project graph and changed files to identify affected models, tests, and downstream resources. Review this scope carefully. Add any business invariant that cannot be inferred from SQL or metadata.

## Choose a validation level

When <Constant name="wizard" /> asks how thoroughly to validate a change, choose the level that matches its risk and cost.

<SimpleTable>

| Level | What <Constant name="wizard" /> checks | Use it when |
| --- | --- | --- |
| Light | Checks SQL syntax, lints changed files when linting is supported, runs focused dbt tests, and reviews the code. It doesn't materialize changed models. | You made a low-risk change and need fast feedback. |
| Medium | Compiles and lints, runs focused tests, materializes modified models in development, and checks affected downstream resources. This is the default level. | You changed model logic and need to verify the development result. |
| Heavy | Performs medium validation, forms explicit expectations, compares development and production results, and reports row counts, schema differences, sample records, and downstream impact when the required data is available. | The change affects grain, financial logic, contracts, or other high-risk behavior. |
| Skip | Doesn't run the structured validation workflow. | You only need a draft, or you plan to validate through another process. |

</SimpleTable>

The exact commands depend on your dbt engine, project, adapter, and selected resources. <Constant name="wizard" /> can use commands such as `dbt compile`, `dbt lint`, `dbt test`, `dbt run`, and `dbt build`. Linting isn't available in every dbt CLI environment.

## Approve and monitor commands

Before approving a command, check:

- The selected models and downstream depth match the intended scope.
- The target points to a development schema, unless you intentionally approved another target.
- Deferral and state settings point to the expected environment.
- A production comparison is read-only and uses the intended production relations.
- The expected warehouse cost and run time are appropriate for the change.

You can redirect the plan at any time. For example:

```text
Do not build every downstream model. Build fct_orders and its first-degree
children, then compile the rest of the downstream graph.
```

## Review the validation result

A useful validation summary should distinguish evidence from unresolved risk. Check that it includes:

- The resources and commands that were validated.
- Compile, lint, run, and test outcomes.
- Development and production differences, when you selected heavy validation.
- Downstream resources that weren't run or inspected.
- Failures, warnings, skipped checks, and the reason for each skip.
- Any assumptions that still need a subject-matter expert to confirm.

If a check fails, ask <Constant name="wizard" /> to investigate the failure before changing the test or expected result:

```text
Explain whether this failure is caused by my code, existing warehouse data,
or the validation environment. Do not weaken or remove the test.
```

## Understand the limits

Validation is evidence, not a guarantee that a change is correct. Keep these limits in mind:

- A successful compile doesn't validate business logic or warehouse results.
- Tests only cover the assertions encoded in the project.
- A development-to-production comparison requires accessible relations with comparable schemas and data.
- Sample records can reveal differences, but they don't prove that all rows are correct.
- External consumers aren't included unless they are represented in dbt metadata or another connected tool.
- A skipped check should remain visible in your review and pull request notes.

## Related docs

- [Understanding a dbt project with <Constant name="wizard" />](/best-practices/how-to-use-wizard/wizard-2-understand-project)
- [How <Constant name="wizard" /> works](/docs/dbt-ai/wizard-how-it-works)
- [Use subagents with <Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-subagents)
- [About dbt state](/docs/deploy/dbt-state-about)

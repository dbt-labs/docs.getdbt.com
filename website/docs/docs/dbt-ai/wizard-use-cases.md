---
title: "dbt Wizard use cases"
id: "wizard-use-cases"
description: "Realistic analytics engineering scenarios for dbt Wizard — from building new models to debugging failures."
sidebar_label: "Use cases and examples"
tags: [AI, Wizard]
---

<IntroText>
Common use cases for <Constant name="wizard" />, with example prompts and what to expect.
</IntroText>

<Constant name="wizard" /> works best when you give it a clear scope (which dbt model or area), an intent (what you want to change or learn), and any constraints (naming conventions, materialization, tests). The following examples follow that pattern.

<!-- no toc -->
- [Build a new model](#build-a-new-model)
- [Refactor to incremental](#refactor-to-incremental)
- [Add tests and docs](#add-tests-and-docs)
- [Debug a job failure](#debug-a-job-failure)
- [Assess source impact](#assess-source-impact)
- [Rename a column project-wide](#rename-a-column-project-wide)
- [Multi-file changes](#multi-file-changes)
- [Validate before shipping](#validate-before-shipping)
- [Add a semantic model](#add-a-semantic-model)
- [CI and scripting](#ci-and-scripting)

This page assumes you're using <Constant name="wizard" /> in the terminal with an active session or in <Constant name="dbt_platform" />. For examples of using <Constant name="wizard" /> in the Studio IDE, refer to the [Prompt cookbook](/guides/prompt-cookbook). To use <Constant name="wizard" /> in the CLI, use the `wizard` [command reference](/docs/dbt-ai/wizard-cli-reference).

## Build a new model

You have clean source data and want a new mart model without writing all the SQL by hand.

**Example prompt:**

```text
Create a model called `fct_monthly_revenue` that joins `stg_orders` and `stg_payments`,
groups by `month` and `customer_id`, and materializes as a table. Add `not_null` tests
to the primary key and a unique test on the grain.
```

**What <Constant name="wizard" /> does:**
1. Reads `stg_orders` and `stg_payments` from your project index to understand the available columns
2. Generates `fct_monthly_revenue.sql` with the join and aggregation logic
3. Creates a matching YAML block with the tests you asked for
4. Shows a diff for both files — you approve before anything is saved

**Tips:**
- Reference your existing staging models by name so <Constant name="wizard" /> uses the right columns
- If your project has a team style guide in `.agents/skills/`, <Constant name="wizard" /> picks it up automatically and applies naming and materialization conventions


## Refactor to incremental

A full-refresh mart is getting slow. You want to switch it to incremental without breaking existing tests.

**Example prompt:**

```
Refactor `fct_orders` to use incremental materialization with a `unique_key` on `order_id`
and an updated_at filter. Keep all existing tests and don't change the output schema.
```

**What <Constant name="wizard" /> does:**
1. Reads the current `fct_orders.sql` and its YAML
2. Rewrites the model with an `{% if is_incremental() %}` filter
3. Adds the `unique_key` and `materialized = 'incremental'` config
4. Flags if any existing tests might behave differently on incremental runs

**Tips:**
- Tell <Constant name="wizard" /> which column to use as the high-watermark: it can infer a likely candidate from your schema but an explicit instruction is more reliable
- Ask it to add a `full_refresh` note to the model description so future maintainers understand the intent


## Add tests and docs

You've inherited a model with no tests or YAML. You want coverage without writing boilerplate.

**Example prompt:**

```
Generate tests and documentation for dim_customers. Add not_null and unique on
customer_id, not_null on email, and accepted_values on customer_status with values
active, churned, and prospect. Write a column description for each.
```

**What <Constant name="wizard" /> does:**
1. Reads `dim_customers.sql` and any existing YAML
2. Generates a complete `dim_customers.yml` with model description, column descriptions, and the tests you specified
3. Infers reasonable descriptions from column names — you review and edit before approving

**Tips:**
- You can ask <Constant name="wizard" /> to write descriptions in a specific voice or format: "Write the descriptions in plain language, one sentence each"
- To document a whole layer at once: "Generate documentation for all models in `models/staging/` that don't have a YAML file yet"


## Debug a job failure

A <Constant name="dbt_platform" /> job failed overnight. You want to understand why without digging through logs manually.

**Example prompt:**

```
The nightly job failed. What's the root cause and how do I fix it?
```

**What <Constant name="wizard" /> does:**
1. Uses the `troubleshooting-dbt-job-errors` skill (built in, no setup needed) to pull recent job run details
2. Identifies the failing model, the error message, and the likely cause
3. Proposes a fix and shows the diff
4. Notes if your local branch differs from the job's branch so you have full context

**Tips:**
- You can be more specific: "What caused the failure in `fct_orders` in the last run of the Production job?"
- Wizard won't apply a fix without your approval, which is especially useful when the failure is in a production model


## Assess source impact

Before modifying a stg model, you want to know what other downstream models might be affected.

**Example prompt:**

```
If I change the grain of stg_payments from one row per payment to one row per
payment attempt, which downstream models break?
```

**What <Constant name="wizard" /> does:**
1. Runs a lineage and impact query against your project to find all downstream dependents of `stg_payments`
2. Identifies which models join on payment-level keys and would be affected by a grain change
3. Lists the models by severity — marts and exposures first, then intermediate models
4. Suggests which models need to be updated as part of the change

**Tips:**
- You don't need to be precise about the change: even a "what depends on stg_payments?" gives you the blast radius
- Follow up with: "Write a migration plan for making this change safely"

## Rename a column project-wide

A source column has been renamed. You need to update all references without missing anything.

**Example prompt:**

```
The source column user_id in raw_customers has been renamed to customer_id.
Update stg_customers and find any downstream models that reference user_id directly.
```

**What <Constant name="wizard" /> does:**
1. Updates the column alias in `stg_customers.sql`
2. Searches downstream models for direct references to `user_id`
3. Proposes updates to any models that would break
4. Updates YAML column descriptions to match

**Tips:**
- Always run `dbt compile` after <Constant name="wizard" />'s changes to catch any references it might have missed
- Ask Wizard to "check for user_id in any raw SQL strings or Jinja macros too" for thorough coverage

## Multi-file changes

You need to make a change that touches multiple files at once — a model rename, a contract update, or a schema change — and have all the related files stay in sync.

**Example prompt:**

```
Rename dim_users to dim_customers. Update the model file, its YAML, every
downstream ref(), the tests, the documentation, and any exposures that point to it.
```

**What <Constant name="wizard" /> does:**
1. Renames `dim_users.sql` to `dim_customers.sql`
2. Updates the model name in the corresponding YAML
3. Searches the project for `ref('dim_users')` and rewrites each occurrence
4. Updates any tests, docs blocks, and exposures that reference the old name
5. Compiles the project to confirm every reference resolves before showing you the diff
6. Flags anything it couldn't update automatically (for example, raw SQL strings or external dashboards)

**Tips:**
- Multi-file changes are coordinated as a single diff: review them together rather than file by file
- For column type or schema changes, name the new type explicitly: "Change `order_amount` in `fct_orders` from `numeric` to `decimal(18,2)` and update downstream models and tests"


## Validate before shipping

For changes where correctness matters more than speed, ask Wizard to validate its own output against your project before presenting the final diff.

**Example prompt:**

```
Add not_null and unique tests to the primary key of dim_customers, and make
sure they pass against current data before you show me the diff.
```

**What <Constant name="wizard" /> does:**
1. Generates the YAML for the new tests
2. Compiles the project to confirm the YAML parses
3. Runs `dbt test --select dim_customers` (with your approval) to confirm the tests actually pass
4. If a test fails, reports which one and why, then proposes an adjusted approach — for example, investigating the duplicate rows or scoping the test to a non-null subset
5. Only after validation passes does it present the final diff

Wizard runs a comparison loop like this on most write operations by default. See [Validation loop mechanics](/docs/dbt-ai/wizard-how-it-works#validation-loop-mechanics) for the full list of what gets validated.

**Tips:**
- Be explicit about what "validates" means for your change ("compile only" vs "compile and run tests" vs "run against a sample")
- In CI, pair this with `wizard review --base main` to validate the diff against your project before opening a PR

## Add a semantic model

You have a mart model and want to expose it via the dbt Semantic Layer.

**Example prompt:**

```
Create a semantic model for fct_orders. Include a revenue metric that sums
order_total, a count of orders, and time dimensions on order_date at day,
week, and month granularity.
```

**What <Constant name="wizard" /> does:**
1. Reads `fct_orders.sql` and its YAML to understand available columns
2. Generates a `semantic_models:` block with entities, dimensions, and measures
3. Adds the metrics you described with the correct aggregation types
4. Validates that the column references exist in the model

**Tips:**
- If you're unsure what entities to use, ask first: "What would be good entities for a semantic model on fct_orders?"
- <Constant name="wizard" /> follows the [dbt Semantic Layer documentation](/docs/build/semantic-models): you can ask it to explain any generated field

## CI and scripting

For tasks you want to automate or run in a pipeline without the TUI:

```bash
# Run a single prompt and exit
wizard exec "list all models with no tests"

# Code review against a base branch
wizard review --base BRANCH_NAME

# Output as JSON for downstream processing
wizard exec --json "summarize test coverage by schema"
```

## Related docs

- [dbt Wizard quickstart](/docs/dbt-ai/wizard-quickstart)
- [dbt Wizard overview](/docs/dbt-ai/about-dbt-wizard-cli)
- [Configure BYOK](/docs/dbt-ai/wizard-byok)
- [dbt Wizard in Studio IDE](/docs/dbt-ai/wizard-ide): same agent, in the dbt platform
- [Prompt cookbook](/guides/prompt-cookbook): more prompt patterns for the dbt Wizard in Studio IDE (many apply to the CLI too)

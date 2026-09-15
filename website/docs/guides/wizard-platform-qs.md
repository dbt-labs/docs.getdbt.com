---
title: "Quickstart for dbt Wizard in the dbt platform"
id: "wizard-platform-qs"
description: "Set up a dbt platform account, load the Jaffle Shop data into your warehouse, and use dbt Wizard in the Studio IDE to build, test, and deploy a project end to end."
hoverSnippet: "Build the Jaffle Shop project end to end with dbt Wizard in the Studio IDE."
displayText: Quickstart for dbt Wizard in the dbt platform
level: 'Beginner'
icon: 'dbt'
hide_table_of_contents: true
tags: ['dbt Wizard', 'AI', 'Quickstart', 'dbt platform']
---

import WizardTrialBilling from '/snippets/_wizard-trial-billing.md';

<div style={{maxWidth: '900px'}}>

## Introduction

In this quickstart, you'll set up a <Constant name="dbt_platform" /> account and use <Constant name="wizard" /> in the <Constant name="studio_ide" /> to build a project end to end &mdash; from raw tables to a scheduled production job. You'll use [Jaffle Shop](https://github.com/dbt-labs/jaffle-shop), dbt Labs' sample project for a fictional cafe.

You'll learn how to:

- Create a <Constant name="dbt_platform" /> account and start a <Constant name="wizard" /> trial.
- Connect your data platform and load the Jaffle Shop sample data.
- Set up a repository and a development environment.
- Ask project-aware questions in Explore mode.
- Build sources, staging models, and a mart with prompts instead of hand-written SQL.
- Test and document with quick actions.
- Open a pull request and schedule a production job.

This guide is warehouse agnostic. Bring any [supported data platform](/docs/platform/connect-data-platform/about-connections) &mdash; you'll link out to your warehouse's quickstart for the load and connect steps, then come back.

If you'd rather work in your terminal, refer to [Quickstart for dbt Wizard in the CLI](/guides/wizard-cli-qs).

### Related content

- [<Constant name="wizard" /> in <Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide)
- [<Constant name="wizard" /> in the <Constant name="dbt_platform" />](/docs/platform/wizard-platform)
- [How to use <Constant name="wizard" /> in your dbt project](/best-practices/how-to-use-wizard/wizard-1-intro)
- [Develop in the <Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio)

## Prerequisites

- A [<Constant name="dbt_platform" /> account](https://www.getdbt.com/signup) on a Starter, Enterprise, or Enterprise+ plan, with a [Developer seat license](/docs/platform/manage-access/seats-and-users). [Legacy Team plans](/docs/platform/billing/plans-and-billing#legacy-plans) don't have access to <Constant name="wizard" />.
- An account on a [supported data platform](/docs/platform/connect-data-platform/about-connections) with permission to create schemas and load data.
- Optional: a GitHub, GitLab, or Azure DevOps account. You can use a dbt managed repository instead.

<WizardTrialBilling />

## Create your account and turn on AI

1. [Sign up for the <Constant name="dbt_platform" />](https://www.getdbt.com/signup) or sign in to an existing account.
2. AI features are on by default for new accounts. If <Constant name="wizard" /> isn't available, an admin can turn it on in **Account settings** &mdash; refer to [Manage AI features](/docs/platform/manage-dbt-ai).
3. Confirm you have credits to spend. Developer and Starter plans get a 30-day trial with $100 in usage credits; Enterprise and Enterprise+ accounts get monthly credits. Refer to [Trial and billing](/docs/dbt-ai/pricing-billing/trial-and-billing).

Credits are per account, not per user, so a team shares one pool. Admins can set a [spend limit](/docs/dbt-ai/pricing-billing/trial-and-billing) before handing <Constant name="wizard" /> to a wider group.

## Load the Jaffle Shop data and connect your warehouse

<Constant name="wizard" /> works against your real warehouse, so the sample data needs to live there. Jaffle Shop ships the raw data as seeds, so you don't need a separate load script.

1. In the <Constant name="dbt_platform" />, create a connection to your warehouse and add your development credentials. Refer to [Connect your data platform](/docs/platform/connect-data-platform/about-connections) for your platform's fields.
2. Test the connection before you move on. A broken connection looks like a broken <Constant name="wizard" /> later, because the agent can't run `dbt build` to check its own work.
3. You'll load the seeds in a later step, once your project is set up, by running:

    ```bash
    dbt seed --vars 'load_source_data: true'
    ```

    That variable is what enables the seeds in `seeds/jaffle-data/`. Without it, `dbt seed` loads nothing and the build fails on missing sources.

If you'd rather use the warehouse-specific load steps and a hand-written SQL file, the [Snowflake](/guides/snowflake?step=3), [BigQuery](/guides/bigquery?step=2), [Databricks](/guides/databricks?step=3), and [Redshift](/guides/redshift?step=2) quickstarts each cover that.

## Set up your repository

Fork [dbt-labs/jaffle-shop](https://github.com/dbt-labs/jaffle-shop) into your own Git account, then connect that fork to your dbt project. Working from your own fork means you can open real pull requests, which is where <Constant name="wizard" />'s changes should land.

1. On GitHub, click **Fork** on the Jaffle Shop repo.
2. In the <Constant name="dbt_platform" />, connect your Git provider and select your fork. Refer to [Git configuration](/docs/platform/git/configure-git) for GitHub, GitLab, and Azure DevOps setup.
3. In your fork, open `dbt_project.yml` and set `dbt-cloud.project-id` to your own project ID, or delete the `dbt-cloud:` block. It ships pointing at a dbt Labs project you don't have access to.

<Expandable alt_header="Alternative: start from an empty managed repository">

<Snippet path="tutorial-managed-repo" />

A managed repository is faster to set up but can't open pull requests, and you'd be starting from an empty project rather than Jaffle Shop. The rest of this guide assumes the Jaffle Shop fork.

</Expandable>

## Build the project for the first time

1. Click **Start developing in the <Constant name="studio_ide" />**. The first load takes a few minutes while the platform clones your repo and tests the warehouse connection.
2. Create a new branch to work in.
3. In the command bar, run each of these in turn:

    ```bash
    dbt deps
    dbt seed --vars 'load_source_data: true'
    dbt build
    ```

4. Confirm you see `6 seeds` load, then `43 total | 43 success` across 13 models, 27 tests, and 3 unit tests. That confirms your warehouse connection, the raw data, and the project all work before you add <Constant name="wizard" /> to the mix.

## Open Wizard and explore the project

1. Click **<Constant name="wizard" />** in the command palette to open the panel.
2. Set the [agent mode](/docs/dbt-ai/wizard-ide#agent-modes) to **Ask for approval** so you see every change before it's written. Use **Explore only** for questions and **Edit files automatically** once you trust a workflow.
3. Ask a question you can verify:

    ```text
    Summarize what this project does and list the models by layer.
    ```

4. Switch to **Explore only** mode and ask about your production data:

    ```text
    How many orders are in the raw orders table, and what date range do they cover?
    ```

    Explore mode queries with your personal warehouse credentials and never changes your project. Refer to [Ask questions in Explore mode](/docs/dbt-ai/wizard-ide#ask-questions-in-explore-mode).

## Set your conventions

<Constant name="wizard" /> reads an `AGENTS.md` file at your project root at the start of every session. Create one and describe how your team writes dbt:

```markdown
## Conventions

- Staging models are prefixed `stg_`, live in `models/staging/`, and select from a source.
- Marts are named for the business concept, with no prefix, and live in `models/marts/`.
- Models use a `with ... as (...)` CTE structure, matching the existing models.
- Every model has its own `.yml` file next to it with descriptions and tests.
- Use `ref()` and `source()` &mdash; never hard-code a table name.
```

These describe how Jaffle Shop is already laid out, so <Constant name="wizard" />'s new files look like the ones already there. Conventions are the difference between a model you can merge and a model you have to rewrite. For reusable workflows on top of that, refer to [Agent Skills](/docs/dbt-ai/wizard-platform-skills) and [subagents](/docs/dbt-ai/wizard-platform-subagents).

## Understand the project before you change it

Jaffle Shop already has sources, a staging layer, and marts. Get <Constant name="wizard" /> to explain them, so you can judge its answers against code you can read:

```text
Show me how models/staging/stg_orders.sql goes from the ecom source to renamed columns,
and explain what the cents_to_dollars macro does.
```

Use `@` in the prompt field to scope a question or change to a specific model.

## Transform: build a new mart

Build something a stakeholder would ask for &mdash; a model that doesn't exist in the project yet:

```text
Build a new mart, models/marts/location_monthly_revenue.sql, that returns one row per
location per month with the number of orders and total revenue. Use the existing staging
models and marts and follow the conventions in AGENTS.md.
```

Review the file diffs in the panel and approve or reject each one. When <Constant name="wizard" /> asks to run a dbt command like `dbt compile` or `dbt build`, [approve it](/docs/dbt-ai/wizard-ide#granting-command-permissions) so the agent can validate its own changes against your warehouse.

Then check the result rather than trusting the diff:

```text
Run dbt build --select location_monthly_revenue, then show me five sample rows.
```

Iterate in plain language: `break it out by product type too`, or `materialize this as a view`.

## Test and document

Use the [quick actions](/docs/dbt-ai/wizard-ide#quick-action-resource-generation) at the top of the panel to generate tests and documentation for the models you just built, or prompt for both at once:

```text
Create models/marts/location_monthly_revenue.yml following the pattern in the other marts:
a description for the model and each column, a not_null test on location_id, and a
uniqueness test on the location and month combination. Then run
dbt build --select location_monthly_revenue and fix any failures.
```

Generated tests are a starting point, not a review. Check that each one encodes a rule your business actually has &mdash; a test that passes on today's data but describes no real constraint is worse than no test.

## Review before you ship

You now have models, tests, and docs that an agent wrote. Before they reach production:

1. Read the diff for every file <Constant name="wizard" /> touched, not just the ones that failed a test.
2. Confirm the numbers in the mart against a query you write yourself.
3. Get a human review on the pull request. <Constant name="wizard" /> speeds up the writing, not the accountability.
4. Set up [continuous integration jobs](/docs/deploy/continuous-integration) so every future pull request is built and tested automatically.

When you're ready, use the wayfinder bar above the prompt field to commit your work, then deploy it.

<Snippet path="quickstarts/schedule-a-job" />

## Next steps

- Work through [How to use <Constant name="wizard" /> in your dbt project](/best-practices/how-to-use-wizard/wizard-1-intro) for prompts on real project tasks.
- Try the same workflow in your terminal: [Quickstart for <Constant name="wizard" /> in the CLI](/guides/wizard-cli-qs).
- Ask questions about production data and jobs from the [<Constant name="wizard" /> home page](/docs/platform/wizard-home).
- Add [MCP servers](/docs/dbt-ai/wizard-platform-mcp) so <Constant name="wizard" /> can reach your other tools.
- Give stakeholders read-only access with [<Constant name="wizard" /> for read-only users](/docs/platform/wizard-read-only-users).

</div>

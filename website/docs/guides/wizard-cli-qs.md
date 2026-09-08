---
title: "Quickstart for dbt Wizard in the CLI"
id: "wizard-cli-qs"
description: "Install dbt Wizard in your terminal, then use it to build, test, document, and ship the Jaffle Shop project end to end."
hoverSnippet: "Build the Jaffle Shop project end to end with dbt Wizard in your terminal."
displayText: Quickstart for dbt Wizard in the CLI
level: 'Beginner'
icon: 'dbt'
hide_table_of_contents: true
tags: ['dbt Wizard', 'AI', 'Quickstart']
---

import WizardTrialBilling from '/snippets/_wizard-trial-billing.md';

<div style={{maxWidth: '900px'}}>

## Introduction

In this quickstart, you'll go from an empty machine to a working dbt project built with <Constant name="wizard" /> in your terminal. You'll use [Jaffle Shop](https://github.com/dbt-labs/jaffle-shop), dbt Labs' sample project for a fictional cafe, running on DuckDB so you don't need a warehouse account to finish.

You'll learn how to:

- Install dbt and <Constant name="wizard" /> locally.
- Start a <Constant name="wizard" /> trial from the command line.
- Give <Constant name="wizard" /> context about your project and conventions.
- Explore an existing project, then build a new mart with prompts instead of hand-written SQL.
- Test, document, and review the changes before you commit them.
- Hand the project to the <Constant name="dbt_platform" /> to run on a schedule.

<Constant name="wizard" /> is warehouse agnostic. This guide uses DuckDB for speed, but every step works the same against Snowflake, BigQuery, Databricks, or Redshift &mdash; refer to [Connect to a data platform](/docs/local/connect-data-platform/about-dbt-connections) to point the project somewhere else.

If you'd rather work in the browser, refer to [Quickstart for dbt Wizard in the dbt platform](/guides/wizard-platform-qs).

### Related content

- [Use <Constant name="wizard" /> locally](/docs/dbt-ai/wizard-quickstart)
- [<Constant name="wizard" /> CLI reference](/docs/dbt-ai/wizard-cli-reference)
- [How to use <Constant name="wizard" /> in your dbt project](/best-practices/how-to-use-wizard/wizard-1-intro)
- [Clone the Jaffle Shop sample project](/guides/clone-jaffle-shop)

## Prerequisites

- A terminal on macOS, Linux, or Windows.
- [Git](https://git-scm.com/downloads) installed.
- Python 3.9 or later if you plan to use <Constant name="core" /> instead of the <Constant name="fusion_engine" />. Jaffle Shop sets `require-dbt-version: ">=1.12.0"`, so <Constant name="core" /> users need 1.12 or later &mdash; the <Constant name="fusion_engine" /> install in the next step already satisfies it.
- No <Constant name="dbt_platform" /> plan needed. `dbt login` creates a free <Constant name="dbt" /> account for you in step 3.

<WizardTrialBilling />

## Install dbt

Install the <Constant name="fusion_engine" /> so <Constant name="wizard" /> can parse your project and validate its own changes:

```bash
curl -fsSL https://public.cdn.getdbt.com/fs/install/install.sh | sh -s -- --update
```

Confirm the install:

```bash
dbt --version
```

For Windows, air-gapped installs, and <Constant name="core" /> alternatives, refer to [Install dbt](/docs/local/install-dbt).

## Install dbt Wizard

<Constant name="wizard" /> is a separate install from dbt. Run the script for your operating system:

macOS/Linux:

```bash
curl -fsSL https://public.cdn.getdbt.com/dbt-wizard/install/install-wizard.sh | sh
```

Windows (PowerShell):

```powershell
irm https://public.cdn.getdbt.com/dbt-wizard/install/install-wizard.ps1 | iex
```

Confirm the install:

```bash
wizard --version
```

This also installs the dbt [metadata engine](/docs/dbt-ai/wizard-how-it-works#native-metadata-engine), which is what makes <Constant name="wizard" /> project-aware instead of a generic coding assistant. For update and uninstall details, refer to [Install <Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-cli).

## Start your Wizard trial

<Constant name="wizard" /> needs access to an AI model. The fastest option is a dbt-managed provider:

```bash
dbt login
```

A browser window opens where you sign in to or create a free <Constant name="dbt" /> account. That starts a 30-day trial with $100 in usage credits &mdash; no plan and no provider key required.

If your team already has an AI provider account, use your own key instead. Refer to [Configure BYOK](/docs/dbt-ai/wizard-byok).

Credits are per account, not per user, and the trial can't be paused. Refer to [Trial and billing](/docs/dbt-ai/pricing-billing/trial-and-billing) for what happens when the trial ends.

## Get the Jaffle Shop project

Clone Jaffle Shop:

```bash
git clone https://github.com/dbt-labs/jaffle-shop.git
cd jaffle-shop
```

The repo doesn't ship a `profiles.yml`, so create one in the project root pointing at DuckDB:

<File name='profiles.yml'>

```yaml
default:
  target: dev
  outputs:
    dev:
      type: duckdb
      path: 'jaffle_shop.duckdb'
      threads: 8
```

</File>

Then open `dbt_project.yml` and delete the `dbt-cloud:` block. It points at a dbt Labs project ID you don't have access to, and leaving it in produces a warning on every command.

Install the project's packages, load the raw data, and build everything:

```bash
dbt deps
dbt seed --vars 'load_source_data: true'
dbt build
```

The `load_source_data` variable is what enables the seeds in `seeds/jaffle-data/` &mdash; without it, `dbt seed` loads nothing and the whole build fails on missing sources. You should see `6 seeds` load, then `43 total | 43 success` across 13 models, 27 tests, and 3 unit tests.

One warning is expected and harmless when you're working locally: `Skipping semantic manifest validation due to: No dbt_cloud.yml config`. Set `DBT_ENGINE_NO_WARN_SEMANTIC_MANIFEST_VALIDATION` if you'd rather not see it.

This project already ships a staging layer, a set of marts, sources in `models/staging/__sources.yml`, and unit tests. That's exactly what you want &mdash; <Constant name="wizard" /> works best when it has existing patterns to copy.

<Constant name="wizard" /> reads `target/` for lineage, column types, and test results, which `dbt build` just populated. If you skip the build, the first prompts will be much less accurate. Any time your project changes outside of a session, run `dbt parse` to refresh it.

:::tip Using your own warehouse instead
Same repo, different profile. Replace the DuckDB `profiles.yml` above with your warehouse's connection details, then run the same three commands. Refer to [Connect to a data platform](/docs/local/connect-data-platform/about-dbt-connections) for the profile format.
:::

## Start a session and set your conventions

Start <Constant name="wizard" /> from the project root:

```bash
wizard
```

The first run walks you through a short setup: accepting the Terms of Use, trusting the directory, confirming your dbt executable and target, and choosing how [deferral](/docs/dbt-ai/wizard-config#deferral) works. Your answers save to `wizard_config.toml` so you only do it once per project. To re-run any part later, refer to [Re-trigger onboarding flows](/docs/dbt-ai/wizard-config#re-trigger-onboarding-flows).

When the welcome screen appears, get oriented and write down your conventions:

1. Ask what the project does, so you can check the answer against something you can verify:

    ```text
    Summarize what this project does and list the models by layer.
    ```

2. Create a project instruction file:

    ```text
    /init
    ```

    This writes an `AGENTS.md` at the project root. <Constant name="wizard" /> reads it at the start of every session.

3. Open `AGENTS.md` and add the conventions you want enforced. For example:

    ```markdown
    ## Conventions

    - Staging models are prefixed `stg_`, live in `models/staging/`, and select from a source.
    - Marts are named for the business concept, with no prefix, and live in `models/marts/`.
    - Models use a `with ... as (...)` CTE structure, matching the existing models.
    - Every model has its own `.yml` file next to it with descriptions and tests.
    - Use `ref()` and `source()` &mdash; never hard-code a table name.
    ```

    Match the conventions to the project you're in. These describe how Jaffle Shop is already laid out, so <Constant name="wizard" />'s new files look like the ones already there.

Conventions in `AGENTS.md` are the difference between a model you can merge and a model you have to rewrite. Refer to [Migrate to <Constant name="wizard" />](/docs/dbt-ai/wizard-migrate) for what else it reads, and [Agent Skills](/docs/dbt-ai/wizard-skills) for reusable workflows.

## Understand the project before you change it

Jaffle Shop already has a staging layer, marts, and [sources](/docs/build/sources). Get <Constant name="wizard" /> to explain them, so you can judge its answers against code you can read:

```text
Walk me through the model layers in this project. Which models are staging, which are
marts, and where does the raw data come from?
```

Then dig into one thing you'll rely on later:

```text
Show me how models/staging/stg_orders.sql goes from the ecom source to renamed columns,
and explain what the cents_to_dollars macro does.
```

Refer to [Slash commands](/docs/dbt-ai/wizard-slash-commands) for session controls like `/model` and `/clear`.

## Transform: build a new mart

Now build something a stakeholder would actually ask for &mdash; a model that doesn't exist in the project yet:

```text
Build a new mart, models/marts/location_monthly_revenue.sql, that returns one row per
location per month with the number of orders and total revenue. Use the existing staging
models and marts and follow this project's conventions.
```

<Constant name="wizard" /> proposes the file changes and shows you a diff before writing anything. Review it, then have it build and check the result rather than trusting the diff:

```text
Run dbt build --select location_monthly_revenue, then show me five sample rows.
```

Iterate in plain language: `break it out by product type too`, or `materialize this as a view`.

:::tip Query the result yourself
Fusion needs the `--limit` flag rather than a `limit` clause in the query:

```bash
dbt show --inline "select * from main.location_monthly_revenue order by location_id, revenue_month" --limit 5
```
:::

## Test and document

This project keeps a `.yml` file next to every model, so ask for one that matches:

```text
Create models/marts/location_monthly_revenue.yml following the pattern in the other marts:
a description for the model and each column, a not_null test on location_id, and a
uniqueness test on the location and month combination. Then run
dbt build --select location_monthly_revenue and fix any failures.
```

Generated tests are a starting point, not a review. Check that the tests describe rules your business actually has &mdash; a test that passes on today's data but doesn't encode a real constraint is worse than no test.

## Review and commit

Before you open a pull request, have <Constant name="wizard" /> review its own work:

```bash
wizard review --uncommitted
```

You can also review against a base branch with `wizard review --base main`. Then commit and push:

```bash
git checkout -b add-location-monthly-revenue
git add .
git commit -m "Add location_monthly_revenue mart with tests and docs"
git push -u origin add-location-monthly-revenue
```

Because you cloned dbt Labs' repo, you won't have push access &mdash; fork it first, or point `origin` at your own remote. Then open the pull request in your Git provider and get a human review. <Constant name="wizard" /> speeds up the writing, not the accountability.

## Run it on a schedule

Your project now runs on your machine. To run it in production on a schedule, with alerting and logs, connect the repo to the <Constant name="dbt_platform" />:

1. [Create or sign in to your <Constant name="dbt_platform" /> account](https://www.getdbt.com/signup) &mdash; the same account you created with `dbt login`.
2. [Connect your data platform](/docs/platform/connect-data-platform/about-connections) and [connect your Git repository](/docs/platform/git/configure-git).
3. [Create a deploy job](/docs/deploy/deploy-jobs) that runs `dbt build`, and set a schedule.
4. [Set up notifications](/docs/deploy/job-notifications) so you hear about failures before your stakeholders do.

You can keep developing locally with <Constant name="wizard" /> and let the platform own production runs.

## Next steps

- Work through [How to use <Constant name="wizard" /> in your dbt project](/best-practices/how-to-use-wizard/wizard-1-intro) for prompts on real project tasks.
- Try the same workflow in the browser: [Quickstart for <Constant name="wizard" /> in the <Constant name="dbt_platform" />](/guides/wizard-platform-qs).
- Connect <Constant name="wizard" /> to the [dbt MCP server](/docs/dbt-ai/wizard-mcp) for production metadata and Semantic Layer queries.
- Set up [Agent Skills](/docs/dbt-ai/wizard-skills) and [subagents](/docs/dbt-ai/wizard-subagents) for workflows your team repeats.
- Automate reviews and non-interactive runs with [headless mode](/docs/dbt-ai/wizard-headless).

</div>

---
title: "Quickstart for dbt Wizard Desktop"
id: "wizard-desktop-qs"
level: 'Beginner'
icon: 'dbt-copilot'
hide_table_of_contents: true
tags: ['dbt Wizard', 'AI', 'Quickstart', 'Wizard Desktop']
---

<div style={{maxWidth: '900px'}}>

import WizardTrialBilling from '/snippets/_wizard-trial-billing.md';
import WizardQsAsk from '/snippets/_wizard-qs-ask.md';
import WizardQsBuild from '/snippets/_wizard-qs-build.md';
import WizardQsChange from '/snippets/_wizard-qs-change.md';

## Introduction

<Constant name="wizard" /> is an AI agent that knows your dbt project: your lineage, tests, and docs, not just your code. In about 20 minutes, you'll ask it about a real project, then have it build a tested model from a plain-English prompt and see that model in your lineage.

You'll use Wizard Desktop <Lifecycle status="beta" />, a native app. No warehouse, no setup. The sample project runs on DuckDB, a database that lives on your computer.

### What you'll build

- A `daily_revenue` model on top of the jaffle shop `orders` model.
- A description and two tests for it, written by <Constant name="wizard" />.
- A validation run and a lineage view that show the model working.

{/* SCREENSHOT: finished state. Lineage pane in Wizard Desktop showing orders feeding daily_revenue, with validation results next to it. */}

### Before you begin

- A computer running macOS, Linux, or Windows.
- A way to use an AI model: a free dbt account (dbt-managed keys) or your own API key. You choose during setup.
- A business email address if you create a dbt account. Personal email domains like Gmail aren't accepted for the trial.

<WizardTrialBilling />

## Install Wizard Desktop

1. Download the installer for your operating system.

    <DownloadCard />

2. Open Wizard Desktop and select **Get started** on the welcome screen.

{/* SCREENSHOT: Wizard Desktop welcome screen with the Get started button. */}

Need the Intel Mac, Linux, or other installers? Refer to [Get started with Wizard Desktop](/docs/dbt-ai/wizard-desktop#install-wizard-desktop) for every install option.

## Open the sample project

**Goal:** get the jaffle shop project open in Wizard Desktop.

Jaffle shop is a small, pretend storefront with customers, orders, and payments. It's built into the app.

1. On the **Scan for your dbt projects** screen, select **Scan for projects**. Allow folder access if your computer asks.
2. When the scan finishes, find **Jaffle Shop** in the list. It has a **Sample** badge.
3. Select **Jaffle Shop**, then select **Continue**. Wait for **Setting up the sample project** to finish.

{/* SCREENSHOT: Scan for your dbt projects screen with the Jaffle Shop row, Sample badge, and Continue button highlighted. */}

{/* TODO(verify): the sample row appears only after you run the scan (from wizard-local e2e test sample-project-onboarding.spec.ts). Confirm this against the shipped app and update if the sample shows up before the scan. */}

**You should see:** the **Connect an AI model provider** screen.

**What just happened:** Wizard Desktop cloned the `jaffle_shop_duckdb` sample project to your computer and set it up to run on DuckDB.

**Need help?** If you don't see **Jaffle Shop**, make sure you ran the scan and that you're on the latest version of the app. Refer to [Update the app](/docs/dbt-ai/wizard-desktop#update-the-app).

## Choose how to use an AI model

**Goal:** give <Constant name="wizard" /> a model to think with.

Pick one:

- **Start free trial with dbt-managed keys:** sign in or create a free dbt account when asked. dbt Labs manages the keys for you.
- **Use my own API key:** bring your own provider credentials. Refer to [Bring your own key](/docs/dbt-ai/wizard-desktop-byok).

**You should see:** the Wizard Desktop home screen with the Jaffle Shop project selected.

## Ask Wizard about the project

**Goal:** see that <Constant name="wizard" /> understands your project before it changes anything.

1. In the prompt area, set the permission mode to **Plan changes**. <Constant name="wizard" /> can answer questions but won't edit files.
2. Confirm **Jaffle Shop** is the selected project.
3. Run the prompts below.

<WizardQsAsk />

{/* SCREENSHOT: chat showing the "Tell me about this project" answer. */}

**Need help?** If the prompt area says no models are available, configure a provider in **Settings** → **AI providers**.

## Build a model, tests, and docs

**Goal:** go from a plain-English ask to working files.

1. In the prompt area, switch the permission mode to **Ask for approval**. <Constant name="wizard" /> proposes each change and waits for you.
2. Run the prompt below.

<WizardQsBuild />

3. Open the **Changes** pane to review the diff, file by file. Accept the changes.

{/* SCREENSHOT: Changes pane showing daily_revenue.sql and schema.yml diffs. */}

**Need help?** If the model isn't named `daily_revenue`, ask: *Rename the model to daily_revenue.* If a test is missing, ask: *Add the missing not_null and unique tests.*

## Run it and see it in your lineage

**Goal:** prove the model works, then see where it fits.

1. Open the **Validation** pane. Generate a validation plan, then choose the **Medium** validation level. It builds your new model and runs its tests. Since the sample runs on DuckDB, everything stays on your computer.
2. Select **Run validation**.
3. When it finishes, expand the checks to see what ran. You should see the `daily_revenue` build and both tests pass.
4. Open the **Lineage** pane. Find `daily_revenue` and look one step upstream.

{/* SCREENSHOT: Validation pane with passing checks. */}
{/* SCREENSHOT: Lineage pane with orders feeding daily_revenue. */}

{/* TODO(verify): confirm how Desktop shows dbt run output for the build (Validation pane vs. Commands pane), and that Medium builds into the chat's schema-suffixed DuckDB schema. Open question 4 in the audit. */}

Want to see the data itself? Ask: *Show me the first 10 rows of daily_revenue.*

{/* TODO(verify): confirm the table renders inline for the DuckDB sample. */}

**You should see:**

- Validation checks for `daily_revenue` marked as passed.
- `orders` → `daily_revenue` in the lineage pane.
- A table of dates, order counts, and revenue, if you asked for the rows.

**What just happened:** <Constant name="wizard" /> built your new model, ran the tests it wrote, and showed you the result. Nothing was committed or deployed. All of it happened on a branch in a copy of your project.

**Need help?** If validation fails on the compile step, expand the failed check and select **Re-run validation** after you fix it, or ask <Constant name="wizard" /> to fix it. Refer to [Validation](/docs/dbt-ai/wizard-desktop-use#validation).

## Change something

**Goal:** see <Constant name="wizard" /> reason about impact.

<WizardQsChange />

## What just happened

You worked through the loop <Constant name="wizard" /> is built for:

| Step | What you did | What <Constant name="wizard" /> used |
|------|--------------|--------------------------------------|
| Ask | Asked about the project in plain English | Your models, tests, and lineage |
| Build | Described a model and its tests | The existing `orders` model |
| Validate | Ran a validation plan | Compile, build, and tests on DuckDB |
| See | Opened the lineage pane | The project graph |
| Change | Asked for a new column | Lineage, to check the impact |

## Next steps

- Connect your own warehouse: refer to [Set up your warehouse connection](/docs/dbt-ai/wizard-desktop#set-up-your-warehouse-connection).
- Learn the app: refer to [Use Wizard Desktop](/docs/dbt-ai/wizard-desktop-use).
- Write better prompts with the [prompt cookbook](/guides/prompt-cookbook).
- Use <Constant name="wizard" /> in your team's platform project with the [Quickstart for dbt Wizard in the dbt platform](/guides/wizard-platform-qs).
- Prefer a terminal? Refer to [Use dbt Wizard locally](/docs/dbt-ai/wizard-cli).

</div>

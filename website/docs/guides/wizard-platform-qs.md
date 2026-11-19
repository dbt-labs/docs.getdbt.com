---
title: "Quickstart for dbt Wizard in the dbt platform"
id: "wizard-platform-qs"
level: 'Beginner'
icon: 'dbt-copilot'
hide_table_of_contents: true
tags: ['dbt Wizard', 'AI', 'dbt platform', 'Quickstart']
---

<div style={{maxWidth: '900px'}}>

import WizardTrialBilling from '/snippets/_wizard-trial-billing.md';
import WizardAgentModes from '/snippets/_wizard-agent-modes.md';
import WizardQsAsk from '/snippets/_wizard-qs-ask.md';
import WizardQsBuild from '/snippets/_wizard-qs-build.md';
import WizardQsChange from '/snippets/_wizard-qs-change.md';

## Introduction

<Constant name="wizard" /> is an AI agent that knows your dbt project: your lineage, tests, and docs, not just your code. In about 20 minutes, you'll ask it about a project, then have it build a tested model from a plain-English prompt and see that model in your lineage.

You'll work in the <Constant name="wizard" /> home tab in <Constant name="dbt_platform" /> <Lifecycle status="preview" />.

Want the fastest path with no warehouse? Try the [Quickstart for dbt Wizard Desktop](/guides/wizard-desktop-qs) first. It uses a sample project that runs on your computer.

### What you'll build

- A `daily_revenue` model on top of the jaffle shop `orders` model.
- A description and two tests for it, written by <Constant name="wizard" />.
- A build that passes in your development environment, and the model in your lineage.

{/* SCREENSHOT: finished state. Wizard home tab with the diff and passing validation for daily_revenue. */}

### Before you begin

- A <Constant name="dbt_platform" /> account on a Starter, Enterprise, or Enterprise+ plan. [Legacy Team plans](/docs/platform/billing/plans-and-billing#legacy-plans) don't include <Constant name="wizard" />.
- A [Developer or Read-only seat](/docs/platform/manage-access/seats-and-users). Read-only users can ask questions but can't make changes.
- A jaffle shop project in <Constant name="dbt_platform" />, connected to a warehouse. Any of the [warehouse quickstarts](/guides?tags=Quickstart) builds one. The prompts in this guide use its `orders` model.
- A [development environment and credentials](/docs/platform/studio-ide/develop-in-studio#get-started-with-the-studio-ide) set up in the <Constant name="studio_ide" />.
- [Experimental features](/docs/dbt-versions/experimental-features) turned on for your account, which the <Constant name="wizard" /> home tab requires.
- AI features turned on for your account. They're on by default. If <Constant name="wizard" /> doesn't appear, ask an admin to [enable AI features](/docs/platform/manage-dbt-ai#manage-ai-features).

<WizardTrialBilling />

Don't have an account yet?

<PlatformCta label="Create a dbt account" href="https://www.getdbt.com/signup" step="create-account" />

{/* TODO(verify): the Wizard trial starts from Billing & Usage > Start trial. Confirm the label and whether a CTA to that page has a stable URL (audit open question 6). */}

## Open dbt Wizard

**Goal:** open the home tab in a safe, read-only mode.

<PlatformCta label="Open dbt platform" href="https://cloud.getdbt.com/" step="open-platform" />

1. Sign in to <Constant name="dbt_platform" />.
2. Select the <Constant name="wizard" /> icon in the navigation menu to open the home tab.
3. Select the **Agent mode** button in the bottom-left corner and choose **Explore only**. <Constant name="wizard" /> can answer questions but can't change your files.

{/* SCREENSHOT: Wizard home tab with Agent mode set to Explore only. */}

<Expandable alt_header="What do the agent modes do?">

<WizardAgentModes />

</Expandable>

**You should see:** the home tab, ready for your first prompt.

**Need help?** If you don't see the <Constant name="wizard" /> icon, check the prerequisites above. Refer to [Wizard in dbt platform](/docs/platform/wizard-platform).

## Ask Wizard about the project

**Goal:** see that <Constant name="wizard" /> understands your project before it changes anything.

<WizardQsAsk />

{/* SCREENSHOT: home tab showing the "Tell me about this project" answer. */}

## Build a model, tests, and docs

**Goal:** go from a plain-English ask to working files.

1. Select **Agent mode** and switch to **Ask for approval**. <Constant name="wizard" /> drafts changes, but nothing is saved until you approve.
2. Run the prompt below.

<WizardQsBuild />

3. Review the diff. <Constant name="wizard" /> shows every file it wants to create or edit.

{/* SCREENSHOT: diff view for daily_revenue.sql and schema.yml before approval. */}

## Run it and see it in your lineage

**Goal:** prove the model works.

1. Check the validation results. <Constant name="wizard" /> can run compile and build checks on the change and show them inline, so you know the new tests pass before anything is saved.
2. If it doesn't run them, ask: *Build daily_revenue and run its tests.*
3. Approve the change to save it to your branch.
4. Ask: *Show me the lineage for daily_revenue.* Or open the model in the <Constant name="studio_ide" /> and use the lineage tab.

{/* SCREENSHOT: dbt run output for daily_revenue in the home tab. */}
{/* SCREENSHOT: dbt run output for daily_revenue in the Studio IDE. */}
{/* SCREENSHOT: the daily_revenue table in the warehouse. */}

{/* TODO(verify): confirm how lineage is shown in the home tab vs. the Studio IDE, and the exact steps to see dbt run output in each. Docs say the preview links out to Catalog for lineage (wizard-home.md). Capture the three screenshots above from a real run. */}

**You should see:**

- The `daily_revenue` build and its two tests pass.
- `orders` → `daily_revenue` in the lineage.
- A new table in your development schema.

**What just happened:** <Constant name="wizard" /> built the model in your development environment, ran the tests it wrote, and showed you the results. Nothing is in production. The change is on your branch until you commit it.

**Need help?** If the build fails, paste the error into the chat and ask <Constant name="wizard" /> to fix it. Check that your development credentials are set in the <Constant name="studio_ide" />.

## Change something

**Goal:** see <Constant name="wizard" /> reason about impact.

<WizardQsChange />

When you're happy, use the wayfinder bar to commit the change. It shows your project and branch, and walks you through creating a branch or committing files.

## What just happened

| Step | What you did | What <Constant name="wizard" /> used |
|------|--------------|--------------------------------------|
| Ask | Asked about the project in plain English | Your project's metadata |
| Build | Described a model and its tests | The existing `orders` model |
| Validate | Checked the build and tests | Your development environment |
| See | Looked at lineage | The project graph |
| Change | Asked for a new column | Lineage, to check the impact |

## Next steps

- Write better prompts with the [prompt cookbook](/guides/prompt-cookbook).
- See <Constant name="wizard" /> on real tasks in [Use cases and examples](/docs/dbt-ai/wizard-use-cases).
- Learn recommended workflows, like debugging a failed job, in [How to use dbt Wizard in your dbt project](/best-practices/how-to-use-wizard/wizard-1-intro).
- Teach <Constant name="wizard" /> your team's conventions with [skills](/docs/dbt-ai/wizard-platform-skills).
- Prefer a desktop app or your terminal? Try [Wizard Desktop](/guides/wizard-desktop-qs) or the [CLI](/docs/dbt-ai/wizard-cli).

</div>

---
title: "dbt Wizard home tab"
id: "wizard-home"
description: "Use the dbt Wizard home tab in the dbt platform for an agent-native development workflow — iterate in natural language, review inline diffs and DAG previews, and validate changes without leaving the agent."
sidebar_label: "Wizard home tab"
tags: [AI, Wizard, Platform]
availability: platform_usage
image: /img/docs/dbt-platform/wizard-home-empty.png
---

import WizardExploreUsage from '/snippets/_wizard-explore-usage.md';
import WizardAgentModes from '/snippets/_wizard-agent-modes.md';
import WizardModelPicker from '/snippets/_wizard-model-picker.md';

# dbt Wizard home tab <Lifecycle status="preview" />

<IntroText>
The <Constant name="wizard" /> home tab is an agent-native development experience in the <Constant name="dbt_platform" />. 
</IntroText>

Use the <Constant name="wizard" /> home tab to investigate and generate changes with natural language prompts, review inline diffs and DAG previews, and validate changes without leaving the agent.

AI features are being enabled by default. They're already on for new accounts and are rolling out soon to existing accounts. If your organization opted out, they'll remain off. Admins can [turn AI off or back on and configure providers](/docs/platform/manage-dbt-ai) anytime.


The <Constant name="wizard" /> home tab is complementary to the [<Constant name="wizard" /> experience in <Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide). Where the <Constant name="studio_ide" /> supports users working directly within a traditional IDE environment, the home tab is purpose-built for agent-native development and keeps you focused on supervising and validating agent-generated work.


<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/dbt-platform/wizard-home-empty.png" width="95%" title="dbt Wizard home tab — empty state with quick-start prompts" />
<Lightbox src="/img/docs/dbt-platform/wizard-home-agent.png" width="95%" title="dbt Wizard agent refactoring a docs github model for tech writers :) " />
</DocCarousel>


## Prerequisites

- A [<Constant name="dbt" /> account](https://www.getdbt.com/signup) and [Developer or Read-only seat license](/docs/platform/manage-access/seats-and-users).
  - [Legacy Team plans](/docs/platform/billing/plans-and-billing#legacy-plans) don't have access to <Constant name="wizard" />. Move to a [Starter, Enterprise, or Enterprise+ plan](https://www.getdbt.com/pricing) to use it.
- A [development environment](/docs/platform/studio-ide/develop-in-studio#get-started-with-the-studio-ide) and credentials set up in the <Constant name="studio_ide" />.
- Use a supported AI provider. Refer to [Supported AI providers](/docs/platform/wizard-platform#supported-ai-providers), or the [Model Provider Rate Table](https://www.getdbt.com/legal/dbt-wizard-token-costs-by-model) for the full model list and rates.
- If you're using <Constant name="wizard" /> in the home tab, you need to [enable experimental features](/docs/dbt-versions/experimental-features) for your account.

If <Constant name="wizard" /> stops responding, your account may have used up its usage credits. Refer to [Trial and billing](/docs/dbt-ai/pricing-billing/trial-and-billing).

## What you can do

Use <Constant name="wizard" /> in the home tab to:

- **Answer project-aware questions**: Ask about lineage, dependencies, model logic, and project context.
- **Debug failed jobs**: Investigate run and job failures using dbt Agent Skills with full project context.
- **Create and manage branches**: Initiate and switch branches directly from the agent workflow.
- **Make model and project changes**: Refactor SQL, update YAML, and modify project configuration through natural language.
- **Generate and refine transformation logic**: Build or rewrite models, tests, documentation, and semantic definitions from plain-language prompts.
- **Run validation workflows**: Execute compile and build checks to validate proposed changes before they're persisted.
- **Ask questions of production data**: Use [Explore mode](#agent-modes) to query governed metrics and models in plain language, and see the SQL or metric definition behind every answer. This is the main surface for [read-only users](/docs/platform/wizard-read-only-users).
- **Choose your model**: Select the dbt <Term id="managed" /> model you'd like to work with from the [model picker](/docs/dbt-ai/pricing-billing/overview#choose-a-model).

:::tip Best practices for using dbt Wizard
Refer to [How to use dbt Wizard in your dbt project](/best-practices/how-to-use-wizard/wizard-1-intro) for recommended workflows &mdash; including [debugging a failed job](/best-practices/how-to-use-wizard/wizard-5-debug-failed-job), which applies directly to the home tab.
:::

## Agent modes {#agent-modes}

<WizardAgentModes />

## Ask questions in Explore mode 

Explore mode in the <Constant name="wizard"/> home tab lets you ask questions of your production data in plain language. <Constant name="wizard" /> in Explore mode answers and explains but never changes your project. This option is great for exploratory data analysis and getting a quick understanding of your data.

Explore mode queries with your personal warehouse credentials. If you don't have any, it falls back to the project's [analytics credential](/docs/platform/wizard-read-only-users#set-up-analytics-credentials), a shared credential an admin sets up on Snowflake, BigQuery, Redshift, or Databricks connections. This is how [read-only users](/docs/platform/wizard-read-only-users) query without their own credentials. If neither exists, <Constant name="wizard" /> asks you to set up credentials or contact an admin.

Explore mode answers are grounded in what your project defines, so it needs metadata or <Constant name="semantic_layer" /> definitions to answer against. For what makes answers better, refer to [Set your team up for good answers](/docs/platform/wizard-read-only-users#set-your-team-up-for-good-answers).

<WizardExploreUsage />

In the home tab, click **Open** on a result to view the visualization in the right-hand context sidebar, and download the data from there.

<Lightbox src="/img/docs/dbt-platform/wizard-home-explore-viz.png" width="95%" title="Explore mode in the dbt Wizard home tab, with a plain-language summary, a chart, and Chart/Table/SQL toggles." />

## Inline preview mode

A core part of the home tab experience is **inline preview mode**, which gives you multiple ways to review and validate agent-generated changes directly in the workflow without switching to a separate tool.

The preview experience includes:

- **Enhanced SQL diffs**: Review proposed code changes side by side before accepting them.
- **Structural DAG visualizations**: Inspect transformations as operator-level DAG views that break logic into familiar patterns — joins, filters, aggregations, and projections — making it easier to understand how a model changed beyond the raw SQL.
- **Execution-aware validation feedback**: See results from compile and build checks inline, so you can assess both the proposed implementation and how the transformation behaves in practice.
- **Jump to related surfaces**: From the preview, open a model directly in <Constant name="catalog" /> to explore metadata and lineage, or open the file in <Constant name="studio_ide" /> to iterate manually when needed.

## When to use the home tab or Studio IDE

The home tab and <Constant name="studio_ide" /> support different parts of the development workflow:

<SimpleTable>

| | Home tab | <Constant name="studio_ide" /> |
|---|---|---|
| **Primary workflow** | Supervise and validate agent-generated work | Write and edit code directly in the editor |
| **Interface** | Streamlined agent-native chat | Full IDE with file explorer, editor, console |
| **Best for** | Natural language iteration, reviewing diffs, running validations | Manual file edits, direct SQL authoring, complex multi-file work |
| **Inline preview** | ✅ SQL diffs, DAG visualizations, build feedback | File diffs shown before changes are persisted |

</SimpleTable>

For most development workflows, you can move between the two surfaces freely. Use the home tab to investigate and generate, and drop into <Constant name="studio_ide" /> when you need direct control.

## Choose a model

<WizardModelPicker />

## Related docs

- [dbt Wizard in Studio IDE](/docs/dbt-ai/wizard-ide)
- [Invite read-only users to dbt Wizard](/docs/platform/wizard-read-only-users)
- [About dbt Wizard in the dbt platform](/docs/platform/wizard-platform)
- [How dbt Wizard works](/docs/dbt-ai/wizard-how-it-works)
- [Prompt cookbook](/guides/prompt-cookbook)
- [dbt AI FAQs](/docs/dbt-ai/dbt-ai-faqs)

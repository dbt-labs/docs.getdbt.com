---
title: "dbt Wizard home tab"
id: "wizard-home"
description: "Use the dbt Wizard home tab in the dbt platform for an agent-native development workflow — iterate in natural language, review inline diffs and DAG previews, and validate changes without leaving the agent."
sidebar_label: "Wizard home tab"
tags: [AI, Wizard, Platform]
image: /img/docs/dbt-platform/wizard-home-empty.png
---

import WizardPlatformPreviewDisclaimer from '/snippets/_wizard-platform-preview-disclaimer.md';
import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';

# dbt Wizard home tab <Lifecycle status="beta,self_service,managed,managed_plus" />

<IntroText>
The <Constant name="wizard" /> home tab is an agent-native development experience in the <Constant name="dbt_platform" />. It centers your workflow around collaborating with the agent itself &mdash; iterating through natural language, reviewing generated changes, and validating outcomes &mdash; without the overhead of a traditional IDE environment.
</IntroText>

<WizardFeedbackCallout />

<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/dbt-platform/wizard-home-empty.png" width="95%" title="dbt Wizard home tab — empty state with quick-start prompts" />
<Lightbox src="/img/docs/dbt-platform/wizard-home-agent.png" width="95%" title="dbt Wizard agent refactoring a docs github model for tech writers :) " />
</DocCarousel>

The <Constant name="wizard" /> home tab is complementary to the [<Constant name="wizard" /> experience in <Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide). Where the <Constant name="studio_ide" /> supports users working directly within a traditional IDE environment, the home tab is purpose-built for agent-native development &mdash; it reduces overhead and keeps you focused on supervising and validating agent-generated work.

## Prerequisites

- A Starter, Enterprise, or Enterprise+ plan
- A [<Constant name="dbt" /> account](https://www.getdbt.com/signup) and [Developer seat license](/docs/platform/manage-access/seats-and-users).
- A [development environment](/docs/platform/studio-ide/develop-in-studio#get-started-with-the-studio-ide) and credentials set up in the <Constant name="studio_ide" />.
- [Enabled AI features](/docs/platform/enable-dbt-ai#enable-ai-features) for your account.
- If you're using <Constant name="wizard" /> in the home tab, you need to [enable experimental features](/docs/dbt-versions/experimental-features) for your account.

## What you can do

Use <Constant name="wizard" /> in the home tab to:

- **Answer project-aware questions**: Ask about lineage, dependencies, model logic, and project context.
- **Debug failed jobs**: Investigate run and job failures using dbt Agent Skills with full project context.
- **Create and manage branches**: Initiate and switch branches directly from the agent workflow.
- **Make model and project changes**: Refactor SQL, update YAML, and modify project configuration through natural language.
- **Generate and refine transformation logic**: Build or rewrite models, tests, documentation, and semantic definitions from plain-language prompts.
- **Run validation workflows**: Execute compile and build checks to validate proposed changes before they're persisted.

:::tip Best practices for using dbt Wizard
Refer to [How to use dbt Wizard in your dbt project](/best-practices/how-to-use-wizard/wizard-1-intro) for recommended workflows &mdash; including [debugging a failed job](/best-practices/how-to-use-wizard/wizard-5-debug-failed-job), which applies directly to the home tab.
:::

:::tip
Always review AI-generated content before applying it. For prompt best practices, refer to the [Prompt cookbook](/guides/prompt-cookbook).
:::

## Inline preview mode

A core part of the home tab experience is **inline preview mode**, which gives you multiple ways to review and validate agent-generated changes directly in the workflow without switching to a separate tool.

The preview experience includes:

- **Enhanced SQL diffs**: Review proposed code changes side by side before accepting them.
- **Structural DAG visualizations**: Inspect transformations as operator-level DAG views that break logic into familiar patterns — joins, filters, aggregations, and projections — making it easier to understand how a model changed beyond the raw SQL.
- **Execution-aware validation feedback**: See results from compile and build checks inline, so you can assess both the proposed implementation and how the transformation behaves in practice.
- **Jump to related surfaces**: From the preview, open a model directly in <Constant name="catalog" /> to explore metadata and lineage, or open the file in <Constant name="studio_ide" /> to iterate manually when needed.

## Wizard home tab vs Studio IDE

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

## Related docs

- [dbt Wizard in Studio IDE](/docs/dbt-ai/wizard-ide)
- [About dbt Wizard in the dbt platform](/docs/platform/wizard-platform)
- [How dbt Wizard works](/docs/dbt-ai/wizard-how-it-works)
- [Prompt cookbook](/guides/prompt-cookbook)
- [dbt AI FAQs](/docs/dbt-ai/dbt-ai-faqs)

---
title: "dbt Wizard in Studio IDE"
id: "wizard-ide"
description: "Use dbt Wizard in the Studio IDE to write or refactor dbt models from natural language, validate with your dbt engine, and run against your warehouse with full project context."
sidebar_label: "Wizard in Studio IDE"
tags: [AI, Agents, Studio]
availability: platform_usage
---

import CopilotResources from '/snippets/_use-copilot-resources.md';
import WizardIde from '/snippets/_wizard-ide.md';
import WizardExploreUsage from '/snippets/_wizard-explore-usage.md';
import WizardModelPicker from '/snippets/_wizard-model-picker.md';

# dbt Wizard in Studio IDE <Lifecycle status="preview"/>

<IntroText>
Use <Constant name="wizard" /> in the <Constant name="studio_ide" /> to ship trusted dbt changes faster. It understands your project, answers context-grounded questions, generates models, tests, docs, and <Constant name="semantic_layer" /> definitions, and shows file diffs before changes are persisted.
</IntroText>

<Constant name="wizard" /> supports the dbt development lifecycle from investigation to review. Use it to:

- Ask project-aware questions using lineage, metadata, and catalog context.
- Build or refactor models from natural-language prompts.
- Generate and validate YAML for tests, documentation, semantic models, and metrics.
- Make scoped edits to logic, names, materializations, tests, and related YAML.
- Investigate job and run failures with dbt Agent Skills.

The agent comes with the following out of the box, meaning no configuration needed:

- [dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills): dbt-recommended guidance and instructions, managed by dbt Labs.
- [dbt MCP server Product docs toolset](/docs/dbt-ai/mcp-available-tools#product-docs): Tools for searching and fetching content from dbt's official documentation.

AI features are being enabled by default. They're already on for new accounts and are rolling out soon to existing accounts. If your organization opted out, they'll remain off. Admins can [turn AI off or back on and configure providers](/docs/platform/manage-dbt-ai) anytime.

### Prerequisites

- A [<Constant name="dbt_platform" /> account](https://www.getdbt.com/signup) and [Developer seat license](/docs/platform/manage-access/seats-and-users).
  - [Legacy Team plans](/docs/platform/billing/plans-and-billing#legacy-plans) don't have access to <Constant name="wizard" />. Move to a [Starter, Enterprise, or Enterprise+ plan](https://www.getdbt.com/pricing) to use it.
- A [development environment](/docs/platform/studio-ide/develop-in-studio#get-started-with-the-studio-ide) and credentials set up in the <Constant name="studio_ide" />.
- Use a supported AI provider. Refer to [Supported AI providers](/docs/platform/wizard-platform#supported-ai-providers), or the [Model Provider Rate Table](https://www.getdbt.com/legal/dbt-wizard-token-costs-by-model) for the full model list and rates.

If <Constant name="wizard" /> stops responding, your account may have used up its usage credits. Refer to [Trial and billing](/docs/dbt-ai/pricing-billing/trial-and-billing).

<WizardIde />

:::tip Best practices for using dbt Wizard
For recommended workflows on real project tasks &mdash; understanding a project, validating changes, building Semantic Layer definitions, and more &mdash; refer to [How to use dbt Wizard in your dbt project](/best-practices/how-to-use-wizard/wizard-1-intro). Most of these prompts work the same in Studio IDE.
:::

## Ask questions in Explore mode

Explore mode in <Constant name="studio_ide"/> lets you ask questions of your production data in plain language. <Constant name="wizard" /> in Explore mode answers and explains but never changes your project. This option is great for exploratory data analysis and getting a quick understanding of your data.

Explore mode queries with your personal warehouse credentials.

<WizardExploreUsage />

In the <Constant name="studio_ide" />, the answer and its visualization appear inline in the <Constant name="wizard" /> panel alongside your project.

<Lightbox src="/img/docs/dbt-platform/wizard-ide-explore-viz.png" width="100%" title="Explore mode in the Studio IDE, showing a chart and Chart/Table/SQL toggles in the dbt Wizard panel." />

## Choose a model

<WizardModelPicker />

## Related docs

- [About dbt Wizard in the dbt platform](/docs/platform/wizard-platform)
- [dbt v2 readiness checklist](/docs/dbt/dbt-readiness)
- [Develop with dbt Wizard](/docs/platform/studio-ide/develop-studio-ai)
- [Prompt cookbook](/guides/prompt-cookbook)
- [Semantic models](/docs/build/semantic-models)
- [About dbt AI and intelligence](/docs/dbt-ai/about-dbt-ai)

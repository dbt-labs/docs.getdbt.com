---
title: "About dbt Wizard in the dbt platform"
id: "wizard-platform"
sidebar_label: "Overview"
description: "dbt Wizard in the dbt platform helps teams investigate, change, validate, and ship trusted dbt work with warehouse-aware AI."
hide_table_of_contents: false
image: /img/docs/dbt-platform/wizard-home-empty.png
tags: [AI, Wizard]
keywords: ["dbt Wizard", "dbt platform", "AI", "agent", "dbt"]
availability: platform_usage
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardTrialBilling from '/snippets/_wizard-trial-billing.md';
import CopilotWizardDifferences from '/snippets/_copilot-wizard-diff.md';

# About dbt Wizard in the dbt platform <Lifecycle status="preview" />

<IntroText>
<Constant name="wizard" /> is dbt's AI agent in the <Constant name="dbt_platform" />, helping teams investigate, change, validate, and ship trusted dbt work with warehouse-aware grounding.
</IntroText>

<Constant name="wizard" /> is more than a general coding agent with access to dbt. Built for governed data development in dbt, it understands lineage, documentation, tests, and semantic definitions, and accounts for dev builds, compute, run time, and post-build inspection. Its suggestions are grounded in your project's actual data _and_ context.

AI features are being enabled by default. They're already on for new accounts and are rolling out soon to existing accounts. If your organization opted out, they'll remain off. Admins can [turn AI off or back on and configure providers](/docs/platform/manage-dbt-ai) anytime.

<WizardTrialBilling />

## Where you can use dbt Wizard

- **[dbt Wizard home tab](/docs/platform/wizard-home):** Ask questions about your project, generate changes, review the diff, and run validations &mdash; all in one place.
- **[Studio IDE](/docs/dbt-ai/wizard-ide):** Work with <Constant name="wizard" /> alongside the code editor, console, and file explorer.
- **[Terminal (CLI)](/docs/dbt-ai/wizard-cli):** Use the same agent from your terminal, with or without a <Constant name="dbt_platform" /> account.

You can teach <Constant name="wizard" /> your team's conventions with [skills](/docs/dbt-ai/wizard-platform-skills), hand off bigger jobs to [subagents](/docs/dbt-ai/wizard-platform-subagents), or connect your project to other AI tools with the [<Constant name="dbt_platform" /> MCP server](/docs/dbt-ai/wizard-platform-mcp).

## What you can do

- Ask project-aware questions and get answers grounded in your project's context
- Generate documentation, semantic models, tests, and metrics
- Build or refactor models from plain-language prompts
- Review file changes as diffs before you save them
- Run end-to-end tasks in [agent mode](/docs/dbt-ai/wizard-ide#agent-modes), either approving each file change or letting <Constant name="wizard" /> edit automatically
- Follow along in the wayfinder bar, which shows your current project and branch and guides you through Git tasks like committing files or creating a branch
- Get consistent output from [dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills), which encode dbt best practices out of the box

For more examples, visit [Use cases and examples](/docs/dbt-ai/wizard-use-cases).

:::tip Best practices for using dbt Wizard
Most of the workflows in [How to use dbt Wizard in your dbt project](/best-practices/how-to-use-wizard/wizard-1-intro) apply here too &mdash; the prompts work the same in <Constant name="studio_ide" /> and the <Constant name="wizard" /> home tab.
:::

## Supported AI providers

<WizardSupportedProviders />

## Open dbt Wizard

1. Sign in to <Constant name="dbt_platform" />.
2. Select the <Constant name="wizard" /> icon in the navigation menu, or open it in the <Constant name="studio_ide"/>.
3. Enter a prompt. Try one of these to get a feel for it:
   - `summarize what this project does`
   - `which models in this project have no tests?`
   - `add not_null and unique tests to the primary key of stg_customers`
4. ..and that's it 🎉!

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-platform/wizard-ide-refactor-lineage.png" width="85%" title="dbt Wizard in the Studio IDE refactoring a model and displaying the lineage inside the chat interface."/>

<Lightbox src="/img/docs/dbt-platform/wizard-ide-refactor-diff.png" width="85%" title="Wizard's final refactor result displayed as a diff in the Studio IDE"/>

</DocCarousel>

For more prompt ideas, refer to the [prompt cookbook](/guides/prompt-cookbook).

If <Constant name="wizard" /> isn't available, confirm that your plan is eligible and that an admin has [enabled account access to AI features](/docs/platform/manage-dbt-ai#manage-ai-features).

## Trial and usage credits

Every prompt you send to <Constant name="wizard" /> uses AI model tokens. What you pay for those tokens depends on your plan and whether you use a <Constant name="dbt" /> Labs-<Term id="managed" /> model or your own key. If you [bring your own key](/docs/platform/wizard-byok-platform), your AI provider bills you directly and your usage doesn't draw from your consumption pool.

[Legacy team plans](/docs/platform/billing/plans-and-billing#legacy-plans) don't have access to <Constant name="wizard" />. You can move to a [Starter, Enterprise, or Enterprise+ plan](https://www.getdbt.com/pricing) to use it.

For steps on how to start your trial and manage your spend, refer to [Start your trial](/docs/dbt-ai/pricing-billing/trial-and-billing#start-your-trial) and [Manage your spend limit](/docs/dbt-ai/pricing-billing/trial-and-billing#manage-your-spend-limit).

To choose a provider or bring your own key, refer to [Manage AI features](/docs/platform/manage-dbt-ai#configure-ai-provider).

## Other AI features in dbt platform

<Constant name="dbt_platform" /> also has AI features that work separately from <Constant name="wizard" />:

- [dbt Copilot](/docs/dbt-ai/copilot-overview) generates SQL, documentation, tests, and semantic models in one click in <Constant name="studio_ide" />, <Constant name="canvas" />, and <Constant name="insights" />.
- The [dbt Support Assistant](/docs/dbt-support?version=2#ask-dbt-support-assistant) answers product questions and helps you open a ticket. Contact the [dbt Support team](mailto:support@getdbt.com) for more info.

<Expandable alt_header="What's the difference between dbt Wizard and dbt Copilot?">

<CopilotWizardDifferences />

</Expandable>

## Related docs

- [<Constant name="wizard" /> home tab](/docs/platform/wizard-home)
- [<Constant name="wizard" /> in <Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide)
- [Manage AI features in <Constant name="dbt_platform" />](/docs/platform/manage-dbt-ai) &mdash; admin setup for AI access and providers
- [Configure BYOK in <Constant name="dbt_platform" />](/docs/platform/wizard-byok-platform)
- [Models and pricing](/docs/dbt-ai/pricing-billing/overview)
- [Data & Privacy in <Constant name="dbt_platform" />](/docs/dbt-ai/dbt-ai-faqs#privacy-and-data)


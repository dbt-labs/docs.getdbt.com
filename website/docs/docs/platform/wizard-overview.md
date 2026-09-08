---
title: "Overview of dbt Wizard"
id: "wizard-overview"
description: "dbt Wizard is an AI agent purpose-built for governed data development in dbt — available in the dbt platform and from your terminal."
sidebar_label: "Overview"
pagination_next: null
keywords: ["dbt Wizard", "dbt Agents", "AI", "analytics", "dbt"]
availability:
  surface:
    - local
    - platform
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardCliInstall from '/snippets/_wizard-cli-install-by-version.md';
import NewToTerminal from '/snippets/_new-to-terminal.md';
import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';
import WizardTrialBilling from '/snippets/_wizard-trial-billing.md';

# About dbt Wizard

<IntroText>
Your personal dbt agent &mdash; wherever you work.
</IntroText>

<Constant name="wizard" /> is an AI agent purpose-built for governed data development in dbt. Unlike general-purpose coding agents, it understands your dbt project through a [native metadata engine](/docs/dbt-ai/wizard-how-it-works#native-metadata-engine) &mdash; a structured index of lineage, model health, tests, contracts, run results, and semantic definitions.

Think of it like a map of your city: <Constant name="wizard" /> knows how everything connects before it starts, rather than walking every street to figure out the layout. <Constant name="wizard"/> comes with:

- **Project understanding:** A native dbt metadata engine for lineage, contracts, tests, and runtime context
- **Impact awareness:** Checks upstream and downstream dependencies before you change code
- **Safe validation:** Compiles and builds changes before review
- **Complete workflow:** Investigate, change, validate, and review in one place
- **Setup and governance:** Works out of the box with dbt governance built in
- **Conversational analytics:** Answers questions about production data in plain language through [Explore mode](/docs/dbt-ai/wizard-ide#agent-modes), grounded in governed metric definitions

<WizardTrialBilling/>

## Use dbt Wizard

<Constant name="wizard" /> is for anyone doing dbt development. You can use it in the platform with managed or bring-your-own-key (BYOK) credentials, or in the terminal with your own key, with or without a <Constant name="dbt_platform" /> account. <Constant name="wizard" /> is data warehouse agnostic and works on any [dbt version](/docs/introduction#dbt-versions).

It's also for people who don't build data at all. In the <Constant name="dbt_platform" />, [Explore mode](/docs/dbt-ai/wizard-ide#agent-modes) lets [read-only users](/docs/platform/wizard-read-only-users) ask questions of production data in plain language, with no developer license and nothing to set up.

The following table shows where <Constant name="wizard" /> is available, the AI keys each surface uses, and how usage is billed:

<SimpleTable>

| Where | Status | AI access options |
|---|---|---|
| [<Constant name="dbt_platform" />: <Constant name="studio_ide" /> ](/docs/dbt-ai/wizard-ide) | Public preview | dbt <Term id="managed" /> or BYOK |
| [<Constant name="dbt_platform" />: <Constant name="wizard" /> home tab](/docs/platform/wizard-home) | Public preview | dbt <Term id="managed" /> or BYOK |
| [Locally: Terminal (CLI)](/docs/dbt-ai/wizard-cli) | Public beta | dbt <Term id="managed" />, BYOK, or OpenAI subscription |

</SimpleTable>

## Supported providers

<WizardSupportedProviders />

For pricing and how billing works, refer to [Models and pricing](/docs/dbt-ai/pricing-billing/overview).

## Get started

You can get started with Wizard wherever you work, whether it's the terminal or the <Constant name="dbt_platform" />:
- [Wizard in the CLI](#wizard-in-the-cli)
- [Wizard in <Constant name="dbt_platform"/>](#wizard-in-dbt-platform)

(Be warned, the wizard has been known to <WizardPopcorn>cast spells</WizardPopcorn>.)

### Wizard in the CLI <Lifecycle status="beta"/>

A terminal-based agent for governed data development in dbt, whether your team uses the <Constant name="dbt_platform" /> or self-hosts. Bring your own key to experience the full agentic analytics engineering loop.

<WizardCliInstall />
<NewToTerminal />


### Wizard in dbt platform <Lifecycle status="preview"/>

Leverage agentic capabilities in the home app or [<Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide) for governed data development in dbt.

AI features are on by default, so most accounts can jump straight in. If your account has them turned off, an admin can turn them back on in [Account settings](/docs/platform/manage-dbt-ai#manage-ai-features).

To get started:

1. Sign in to the [<Constant name="dbt_platform" />](https://www.getdbt.com/signup), or create a free account if you don't have one yet.
2. Open <Constant name="wizard" /> from the **home tab** in the left sidebar, or from [<Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide) to work alongside the file editor.
3. Start with your usage credits or a 30-day trial. Enterprise and Enterprise+ accounts get monthly usage credits; all other plans can start a trial. Refer to [Trial and billing](/docs/dbt-ai/pricing-billing/trial-and-billing).
4. Try a prompt, such as:
    - `summarize what this project does`
    - `list all models with no tests`
    - `add not_null and unique tests to the primary key of stg_customers`

Refer to [Use cases and examples](/docs/dbt-ai/wizard-use-cases) for more prompts.

## Related docs

- [dbt Wizard in Studio IDE](/docs/dbt-ai/wizard-ide) — generate docs, tests, semantic models, SQL, and delegate end-to-end model work
- [Invite read-only users to dbt Wizard](/docs/platform/wizard-read-only-users) — let business users ask questions of production data in Explore mode, without development access
- [Use skills in the dbt platform](/docs/dbt-ai/wizard-platform-skills) — give dbt Wizard reusable instructions for your project
- [Use MCP servers with dbt Wizard CLI](/docs/dbt-ai/wizard-mcp) — connect the dbt Wizard CLI to more tools and context
- [Migrate to dbt Wizard](/docs/dbt-ai/wizard-migrate) — switch from Claude Code, Cursor, or another AI agent to dbt Wizard
- [Privacy and data FAQs](/docs/dbt-ai/dbt-ai-faqs#privacy-and-data) — understand how dbt Wizard handles privacy and data

<WizardFeedbackCallout />

---
title: "Overview of dbt Wizard"
id: "wizard-overview"
description: "dbt Wizard is an AI agent purpose-built for governed data development in dbt — available in the dbt platform and from your terminal."
sidebar_label: "Overview"
pagination_next: null
keywords: ["dbt Wizard", "dbt Agents", "AI", "analytics", "dbt"]
---

import WizardPlatformPreviewDisclaimer from '/snippets/_wizard-platform-preview-disclaimer.md';
import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';

# About dbt Wizard

<IntroText>
Your personal dbt agent &mdash; wherever you work.
</IntroText>

<Constant name="wizard" /> is an AI agent purpose-built for governed data development in dbt. Unlike general-purpose coding agents, it understands your dbt project through a [native metadata engine](/docs/dbt-ai/wizard-how-it-works#native-metadata-engine) &mdash; a structured index of lineage, model health, tests, contracts, run results, and semantic definitions.

Use <Constant name="wizard" /> to:

- **Project understanding:** A native dbt metadata engine for lineage, contracts, tests, and runtime context
- **Impact awareness:** Checks upstream and downstream dependencies before you change code
- **Safe validation:** Compiles and builds changes before review
- **Complete workflow:** Investigate, change, validate, and review in one place
- **Setup and governance:** Works out of the box with dbt governance built in

## Use dbt Wizard

<Constant name="wizard" /> is for anyone doing dbt development, from analytics engineers working locally in the terminal to teams building in the <Constant name="dbt_platform" />. It is data warehouse agnostic and works with both the [<Constant name="fusion_engine" />](/docs/fusion) and [<Constant name="core" />](/docs/local/install-dbt).

The following table shows where <Constant name="wizard" /> is available, the AI keys each surface uses, and how usage is billed:

<SimpleTable>

| Where | Status | AI provider keys | Availability and cost |
|---|---|---|---|
| [<Constant name="dbt_platform" /> — <Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide) | Public preview | Managed keys, or BYOK | Managed usage is included with [dbt AI](/docs/platform/billing#dbt-ai-usage-metering-and-limiting) by plan (not available on Developer). BYOK is available on Enterprise and Enterprise+. |
| [<Constant name="dbt_platform" /> — <Constant name="wizard" /> home tab](/docs/platform/wizard-home) | Public beta | Managed keys, or BYOK | Same as <Constant name="studio_ide" />. |
| [Terminal (CLI)](/docs/dbt-ai/wizard-cli) | Public beta | BYOK, or OpenAI subscription |You pay your AI provider directly. Works with or without a <Constant name="dbt_platform" /> account. |

</SimpleTable>

For included action limits by plan and how managed usage is metered, refer to [Billing](/docs/platform/billing). For supported bring-your-own-key (BYOK) providers, refer to [Configure BYOK](/docs/dbt-ai/wizard-byok#supported-ai-providers).

## Get started

Choose the path that matches where you want to work:

<div className="grid--2-col">

<Card
    title="Use dbt Wizard in the dbt platform"
    body="Enable dbt AI, then use dbt Wizard from the platform home app or Studio IDE."
    link="/docs/platform/enable-dbt-ai"
    icon="wizard"/>

<Card
    title="Use dbt Wizard CLI"
    body="Install dbt Wizard locally, connect an AI provider, and send your first prompt from the terminal."
    link="/docs/dbt-ai/wizard-quickstart"
    icon="wizard"/>

</div>

## Learn more

- [Use cases and examples](/docs/dbt-ai/wizard-use-cases)
- [How dbt Wizard works](/docs/dbt-ai/wizard-how-it-works)
- [About dbt Wizard CLI](/docs/dbt-ai/about-dbt-wizard-cli)
- [dbt Wizard in Studio IDE](/docs/dbt-ai/wizard-ide)
- [Data and privacy in the dbt platform](/docs/dbt-ai/wizard-platform-privacy-data)

<WizardFeedbackCallout />

<WizardPlatformPreviewDisclaimer />

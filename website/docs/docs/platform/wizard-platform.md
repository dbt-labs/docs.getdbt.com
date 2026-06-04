---
title: "About dbt Wizard in the dbt platform"
id: "wizard-platform"
sidebar_label: "Overview"
description: "dbt Wizard in the dbt platform helps teams investigate, change, validate, and ship trusted dbt work with warehouse-aware AI."
hide_table_of_contents: false
tags: [AI, Wizard]
keywords: ["dbt Wizard", "dbt platform", "AI", "agent", "dbt"]
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardPlatformPreviewDisclaimer from '/snippets/_wizard-platform-preview-disclaimer.md';
import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';

# About dbt Wizard in the dbt platform <Lifecycle status="preview,self_service,managed,managed_plus" />

<IntroText>
<Constant name="wizard" /> helps teams ship trusted dbt changes faster and with less risk. It uses native dbt metadata, routes to the right tools, and validates with warehouse awareness so teams can investigate, change, validate, and ship in one place.
</IntroText>

<WizardFeedbackCallout />

<Constant name="wizard" /> is more than a general coding agent with access to dbt. Built for governed data development in dbt, it understands lineage, documentation, tests, and semantic definitions, and accounts for dev builds, compute, run time, and post-build inspection. Its suggestions are grounded in your project's actual data _and_ context.

In [approval mode](/docs/dbt-ai/wizard-how-it-works#approval-and-review), <Constant name="wizard" /> shows every file change as a diff before anything is persisted. Built-in [dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills) encode dbt best practices for consistent output.
An admin must [enable <Constant name="wizard" />](/docs/platform/enable-dbt-ai) for your account before you can use it in the platform.

<WizardSupportedProviders />

Looking for the terminal experience? Visit [About <Constant name="wizard" /> CLI](/docs/dbt-ai/about-dbt-wizard-cli).

## What you can do

Use <Constant name="wizard" /> in the <Constant name="dbt_platform" /> to:

- Leverage agentic capabilities in the [Wizard home tab](/docs/platform/wizard-home) or [<Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide) for governed data development in dbt.
- Ask project-aware questions and get context-grounded answers
- Generate documentation, semantic models, tests, and metrics
- Build or refactor models from plain-language prompts
- Review file changes as diffs before persisting
- Run end-to-end tasks in approval or automatic edit modes

For more examples, visit [Use cases and examples](/docs/dbt-ai/wizard-use-cases).

:::tip
Always review AI-generated content, as it may be incorrect. For prompt best practices, refer to the [Prompt cookbook](/guides/prompt-cookbook).
:::

<WizardPlatformPreviewDisclaimer />

## Get started in the dbt platform

<div className="grid--2-col">

<Card
    title="Enable AI in dbt"
    body="Turn on dbt Wizard and dbt Copilot for your account in the dbt platform."
    link="/docs/platform/enable-dbt-ai"
    icon="wizard"/>

<Card
    title="Wizard in Studio IDE"
    body="Leverage agentic development in the Studio IDE for governed data development in dbt."
    link="/docs/dbt-ai/wizard-ide"
    icon="wizard"/>

<Card
    title="Wizard home tab"
    body="Use the agent-native home tab to iterate in natural language, review inline diffs, and validate changes."
    link="/docs/platform/wizard-home"
    icon="wizard"/>

<Card
    title="dbt AI FAQs"
    body="Common questions about availability, data handling, and billing."
    link="/docs/dbt-ai/dbt-ai-faqs"
    icon="wizard"/>

</div>

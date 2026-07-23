---
title: "About dbt Wizard in the dbt platform"
id: "wizard-platform"
sidebar_label: "Overview"
description: "dbt Wizard in the dbt platform helps teams investigate, change, validate, and ship trusted dbt work with warehouse-aware AI."
hide_table_of_contents: false
image: /img/docs/dbt-platform/wizard-home-empty.png
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

<Constant name="wizard" /> is more than a general coding agent with access to dbt. Built for governed data development in dbt, it understands lineage, documentation, tests, and semantic definitions, and accounts for dev builds, compute, run time, and post-build inspection. Its suggestions are grounded in your project's actual data _and_ context. 

An admin must [enable <Constant name="wizard" />](/docs/platform/enable-dbt-ai) for your account before you can use it in the platform.

<Constant name="wizard" /> comes with various features like:
- Built-in [agent mode](/docs/dbt-ai/wizard-ide#agent-modes) to help you manage agent control: 
    - **Ask for approval** mode allows you to review and approve each file change before <Constant name="wizard" /> takes action
    - **Edit files automatically** mode allows the agent to automatically make edits without approval.  
- A simplified wayfinder bar shows your current project and branch and guides you through Git tasks, such as committing files or creating a branch.
- Built-in [dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills) encode dbt best practices for consistent output.

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

:::tip Best practices for using dbt Wizard
Most of the workflows in [How to use dbt Wizard in your dbt project](/best-practices/how-to-use-wizard/wizard-1-intro) apply here too &mdash; the prompts work the same in Studio IDE and the Wizard home tab.
:::

:::tip
Always review AI-generated content, as it may be incorrect. For prompt best practices, refer to the [Prompt cookbook](/guides/prompt-cookbook).
:::

<WizardPlatformPreviewDisclaimer />

## Get started in the dbt platform

<div className="grid--2-col">

<Card
    title="Get started in dbt platform"
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
    title="Configure BYOK"
    body="Bring your own API key to use dbt Wizard or dbt Copilot in the dbt platform."
    link="/docs/platform/wizard-byok-platform"
    icon="wizard"/>

<Card
    title="Use skills"
    body="Give dbt Wizard reusable instructions for your project."
    link="/docs/dbt-ai/wizard-platform-skills"
    icon="wizard"/>

<Card
    title="Use MCP servers"
    body="Understand MCP server support in the dbt platform experience."
    link="/docs/dbt-ai/wizard-platform-mcp"
    icon="wizard"/>

<Card
    title="Data & Privacy"
    body="Understand how dbt Wizard in the dbt platform handles privacy and data."
    link="/docs/dbt-ai/wizard-platform-privacy-data"
    icon="wizard"/>

</div>

---
title: "About dbt Wizard CLI"
id: "about-dbt-wizard-cli"
description: "The dbt Wizard CLI helps teams ship higher-quality dbt changes faster and with less risk."
sidebar_label: "About dbt Wizard CLI"
hide_table_of_contents: true
tags: [AI, Wizard]
image: /img/docs/wizard-cli-intro.png
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';
import WizardCliDbtCliSupport from '/snippets/_wizard-cli-dbt-cli-support.md';

# <Constant name="wizard" /> CLI <Lifecycle status="beta"/>

<IntroText>
The <Constant name="wizard" /> CLI helps teams ship higher-quality dbt changes faster and with less risk. Built for governed data development in dbt, it understands your project, routes to the right dbt tools, validates changes, and shows how logic evolves from your local machine.
</IntroText>

<WizardFeedbackCallout />

For a first session walkthrough, visit the [Quickstart](/docs/dbt-ai/wizard-quickstart) page.

Use <Constant name="wizard" /> CLI to:

- Investigate lineage, model health, and downstream impact
- Debug failed runs and propose fixes
- Build or refactor models from plain-language prompts
- Update SQL, YAML, refs, tests, and docs together
- Validate changes before review
- Run non-interactively in CI with `exec` and `review`

For more examples, visit [Use cases and examples](/docs/dbt-ai/wizard-use-cases).

<WizardCliDbtCliSupport />

<WizardSupportedProviders />

Looking for the in-platform experience? Visit [About <Constant name="wizard" /> in the dbt platform](/docs/platform/wizard-platform).


## Get started with the dbt Wizard CLI

<div className="grid--3-col">

<Card
    title="Get started with the local CLI"
    body="Install dbt Wizard locally, complete first-run onboarding, and send your first prompt."
    link="/docs/dbt-ai/wizard-quickstart"
    icon="wizard"/>

<Card
    title="Install and update"
    body="Install, verify, update, and uninstall the dbt Wizard CLI on your machine."
    link="/docs/dbt-ai/wizard-cli"
    icon="wizard"/>

<Card
    title="BYOK configuration"
    body="Bring your own API key and choose a supported AI provider."
    link="/docs/dbt-ai/wizard-byok"
    icon="wizard"/>

<Card
    title="Use skills"
    body="Give dbt Wizard reusable instructions for your project."
    link="/docs/dbt-ai/wizard-skills"
    icon="wizard"/>

<Card
    title="Use subagents"
    body="Organize long-running dbt Wizard work into focused agent threads."
    link="/docs/dbt-ai/wizard-subagents"
    icon="wizard"/>

<Card
    title="Use MCP servers"
    body="Connect the dbt Wizard CLI to MCP servers for more tools and context."
    link="/docs/dbt-ai/wizard-mcp"
    icon="wizard"/>

<Card
    title="Headless mode"
    body="Run dbt Wizard in scripts and CI with exec, review, and other headless workflows."
    link="/docs/dbt-ai/wizard-headless"
    icon="wizard"/>

<Card
    title="Migrate to dbt Wizard"
    body="Move Claude Code project context, skills, and settings into dbt Wizard."
    link="/docs/dbt-ai/wizard-migrate"
    icon="wizard"/>

<Card
    title="Command reference"
    body="Curated reference for common wizard subcommands and global flags."
    link="/docs/dbt-ai/wizard-cli-reference"
    icon="wizard"/>

<Card
    title="Slash command reference"
    body="Full reference for interactive TUI slash commands."
    link="/docs/dbt-ai/wizard-slash-commands"
    icon="wizard"/>

<Card
    title="Config reference"
    body="Configure agent runtime defaults and per-project dbt Wizard settings."
    link="/docs/dbt-ai/wizard-config"
    icon="wizard"/>

<Card
    title="Data & privacy"
    body="Understand what dbt Wizard CLI collects and how to opt out."
    link="/docs/dbt-ai/wizard-telemetry"
    icon="wizard"/>

</div>

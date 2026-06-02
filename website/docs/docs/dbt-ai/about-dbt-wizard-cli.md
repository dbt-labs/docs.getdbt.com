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

<WizardSupportedProviders />

Looking for the in-platform experience? Visit [About <Constant name="wizard" /> in the dbt platform](/docs/platform/wizard-platform).


## Get started with the dbt Wizard CLI

<div className="grid--3-col">

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
    title="Non-interactive mode"
    body="Run dbt Wizard in scripts and CI with exec, review, and other headless workflows."
    link="/docs/dbt-ai/wizard-headless"
    icon="wizard"/>

<Card
    title="CLI commands"
    body="Curated reference for common wizard subcommands and global flags."
    link="/docs/dbt-ai/wizard-cli-reference"
    icon="wizard"/>

<Card
    title="Slash commands"
    body="Full reference for interactive TUI slash commands."
    link="/docs/dbt-ai/wizard-slash-commands"
    icon="wizard"/>

<Card
    title="CLI config"
    body="Configure agent runtime defaults and per-project dbt Wizard settings."
    link="/docs/dbt-ai/wizard-config"
    icon="wizard"/>

</div>

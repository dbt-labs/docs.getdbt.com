---
title: "Use dbt Wizard locally"
id: "wizard-quickstart"
description: "Install the dbt Wizard local CLI, complete first-run onboarding, and send your first prompt from the terminal."
sidebar_label: "Use dbt Wizard locally"
tags: [AI, CLI, dbt Wizard]
availability: local_all
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardCliOnboarding from '/snippets/_wizard-cli-onboarding.md';
import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';
import WizardCliDbtCliSupport from '/snippets/_wizard-cli-dbt-cli-support.md';
import WizardTrialBilling from '/snippets/_wizard-trial-billing.md';

# Use <Constant name="wizard" /> locally <Lifecycle status="beta"/>

<IntroText>
Install <Constant name="wizard" /> locally and start an agentic dbt development session from your terminal. 

</IntroText>

<WizardCliDbtCliSupport />

<WizardTrialBilling />

## Prerequisites

- Access to a [supported AI provider](#supported-ai-providers). Use a dbt managed provider or configure [BYOK](/docs/dbt-ai/wizard-byok) with your own provider credentials.
- A dbt project with a built `target/` directory (run `dbt parse`, `dbt compile`, or `dbt build`)

<Constant name="wizard" /> is data warehouse agnostic and works with both the [<Constant name="fusion_engine" />](/docs/introduction) and [<Constant name="core" />](/docs/local/install-dbt) &mdash; no specific engine is required.

## Supported AI providers

<WizardSupportedProviders defaultSurface="local" />

<VersionBlock lastVersion="1.99">

:::tip Upgrade to the <Constant name="fusion_engine" />
On <Constant name="fusion_engine"/> (version 2.0 and later), start <Constant name="wizard"/> with `wizard` and use `wizard COMMAND_NAME` for CLI commands.
:::

</VersionBlock>


## Install and set up dbt Wizard

<WizardCliOnboarding />

:::tip Best practices for using dbt Wizard
Once you're set up, refer to [How to use dbt Wizard in your dbt project](/best-practices/how-to-use-wizard/wizard-1-intro) for recommended workflows on real project tasks.
:::

## Useful terminal commands

Use the following commands to get started:

<SimpleTable>

| Command | Description | Example |
|---------|-------------|---------|
| `wizard "[prompt]"` | Start an interactive session seeded with a prompt. Once you activate the session, you don't need to pass your prompt in quotes. | `wizard "summarize what this project does"` |
| `wizard exec "[prompt]"` | Run a single prompt non-interactively and exit | `wizard exec "list all models with no tests"` |
| `wizard review --uncommitted` | Non-interactive code review of uncommitted changes | `wizard review --uncommitted` |
| `wizard review --base BRANCH` | Review diff against a base branch | `wizard review --base main` |
| `wizard resume` | Resume a previous session | `wizard resume --last` |
| `wizard apply` | Apply the latest Wizard diff to your working directory | `wizard apply TASK_ID` |
| `wizard login` / `logout` | Authenticate with your dbt account | `wizard login` |
| `wizard mcp` | Manage MCP server connections | `wizard mcp add dbt` |
| `wizard update` | Update Wizard to the latest version | `wizard update` |

</SimpleTable>

:::tip Need to re-run setup?
If you want to re-run onboarding — re-authenticate, reset project config, or retrigger the trusted folder prompt &mdash; refer to [Re-trigger onboarding flows](/docs/dbt-ai/wizard-config#re-trigger-onboarding-flows).
:::

## Next steps

- [Use cases and examples](/docs/dbt-ai/wizard-use-cases) for realistic analytics engineering scenarios
- [Install and update reference](/docs/dbt-ai/wizard-cli) for full install, update, and uninstall details
- [Configure BYOK](/docs/dbt-ai/wizard-byok) for managing your API key and choosing an AI model
- [How to use dbt Wizard in your dbt project](/best-practices/how-to-use-wizard/wizard-1-intro) for recommended workflows
- [Use skills locally](/docs/dbt-ai/wizard-skills) for giving Wizard reusable instructions for your project
- [Use MCP servers](/docs/dbt-ai/wizard-mcp) to connect <Constant name="wizard" /> CLI to more tools and context
- [Migrate from Claude Code](/docs/dbt-ai/wizard-migrate) for bringing existing Claude Code project context into <Constant name="wizard" />

<WizardFeedbackCallout />

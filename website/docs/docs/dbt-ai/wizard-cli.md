---
title: "CLI Overview"
id: "wizard-cli"
description: "Install, verify, update, and uninstall the dbt Wizard CLI on your local machine."
sidebar_label: "Install and update"
tags: [AI, Wizard]
image: /img/docs/wizard-cli-intro.png
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardCliInstall from '/snippets/_wizard-cli-install-by-version.md';
import WizardCliOnboarding from '/snippets/_wizard-cli-onboarding.md';
import NewToTerminal from '/snippets/_new-to-terminal.md';
import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';
import WizardCliDbtCliSupport from '/snippets/_wizard-cli-dbt-cli-support.md';

# Install <Constant name="wizard" /> CLI <Lifecycle status="beta"/>

<IntroText>
Install the <Constant name="wizard" /> CLI from your terminal for agentic and governed data development in dbt.
</IntroText>

This guide explains how to install, verify, update, and uninstall the <Constant name="wizard" /> CLI on your local machine.
(Be warned, the wizard has been known to <WizardPopcorn>cast spells</WizardPopcorn>)

## Install dbt Wizard CLI

<WizardCliInstall />

Next up, check out the [Prerequisites](#prerequisites) and [First-run setup and onboarding](#first-run-setup-and-onboarding) sections for more details.

## Prerequisites

- macOS, Windows, or Linux
- A dbt project with a built `target/` directory (`dbt parse`, `dbt compile`, or `dbt build`)
- Credentials for a supported CLI provider. Refer to [Supported AI providers](/docs/dbt-ai/wizard-byok#supported-ai-providers) in the next section.

<WizardCliDbtCliSupport />

<WizardFeedbackCallout />

<WizardSupportedProviders />

<NewToTerminal />

## First-run setup and onboarding

<WizardCliOnboarding />

## Update

Run the following command to update <Constant name="wizard" /> to the latest version:

```bash
wizard system update
```


## Uninstall

Run the following command to uninstall <Constant name="wizard" />:

```bash
wizard system uninstall
```


## Telemetry

<Constant name="wizard" /> collects anonymous product telemetry to improve the AI agent experience. This data helps us understand usage patterns, optimize performance, and attribute compute costs — without ever capturing your code, queries, or file contents.

### What we don't collect

- Prompt or response content (your conversations with the AI)
- SQL queries, file paths, or dbt node names
- MCP tool call arguments or outputs
- Raw API keys or tokens (only SHA-256 hashed identifiers)
- Error messages containing user content (limited to error class/code only)

### What we do collect

High-level, anonymous usage signals only:

- **Session events** for when a session starts and ends, client surface (CLI/VS Code/Desktop), model selected, OS/arch, binary version, session duration, and turn count
- **Turn events** for per-conversation-turn status (completed/failed/interrupted), duration, and aggregate token counts
- **Tool usage** for which tool was called, whether it succeeded, and execution time. Tool arguments and outputs are never collected.
- **LLM request metadata** for model, provider, latency, token counts, and estimated cost for each request routed through the gateway. No prompt or response content.

### How to opt out

<Constant name="wizard" /> respects the following opt-out mechanisms, checked in order:

1. `DO_NOT_TRACK=1` environment variable (community standard)
2. `DBT_SEND_ANONYMOUS_USAGE_STATS=false` environment variable
3. Consent stored in `~/.dbt/.user.yml`

Setting any of these disables all client-side telemetry. Note that LiteLLM Gateway telemetry is server-side infrastructure monitoring and does not require user opt-in.

For dbt Core's general usage stats stance, refer to [Usage statistics](/reference/global-configs/usage-stats).

## Related docs

- [Quickstart](/docs/dbt-ai/wizard-quickstart): Get up and running with <Constant name="wizard" /> in your terminal or in the <Constant name="dbt_platform" />
- [Configure BYOK](/docs/dbt-ai/wizard-byok): Manage your API key and choose an AI model
- [Command reference](/docs/dbt-ai/wizard-cli-reference): Full reference for all `wizard` subcommands and global flags
- [Use cases and examples](/docs/dbt-ai/wizard-use-cases): Realistic analytics engineering scenarios
- [Migrate from another AI agent](/docs/dbt-ai/wizard-migrate): Migrate from another AI agent to <Constant name="wizard" />
- [Telemetry](#telemetry): What dbt Wizard collects and how to opt out

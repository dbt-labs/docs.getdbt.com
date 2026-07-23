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

This guide explains how to install, verify, update, and uninstall the <Constant name="wizard" /> CLI on your local machine. (Be warned, the wizard has been known to <WizardPopcorn>cast spells</WizardPopcorn>)

<WizardCliDbtCliSupport />
<WizardCliInstall />

Next up, check out the [Prerequisites](#prerequisites) and [First-run setup and onboarding](#first-run-setup-and-onboarding) sections for more details.

## Prerequisites

- macOS, Windows, or Linux
- A dbt project with a built `target/` directory (`dbt parse`, `dbt compile`, or `dbt build`)
- Credentials for a supported CLI provider. Refer to [Supported AI providers](/docs/dbt-ai/wizard-byok#supported-ai-providers) in the next section.

<WizardSupportedProviders />

<NewToTerminal />

## First-run setup and onboarding

<WizardCliOnboarding />

## Update

Run the following command to update <Constant name="wizard" /> to the latest version:

```bash
wizard update
```

## Uninstalling dbt Wizard

If you installed dbt Wizard via the `install-wizard.sh` script, the binaries were installed into system-wide executable directories requiring administrative access.

### 1. Remove Global Binaries
Run the following command to delete `dbt-wizard` along with its helper binaries (such as `dbt-index`):

```bash
sudo rm -f /usr/local/bin/dbt-wizard /usr/local/bin/dbt-index
```

### 2. Verify Cleanup
Confirm that the binary has been completely removed by checking your system path:

```bash
which dbt-wizard
```
If no output path is returned, dbt Wizard is successfully uninstalled.


## Telemetry

<Constant name="wizard" /> collects anonymous product telemetry to improve the AI agent experience, understand usage patterns, optimize performance, and attribute compute costs without capturing your code, queries, prompts, responses, or file contents.

For details about what is collected, what is not collected, and how to opt out of client telemetry, refer to [<Constant name="wizard" /> CLI data use and telemetry](/docs/dbt-ai/wizard-telemetry).

## Related docs

- [Use <Constant name="wizard" /> locally](/docs/dbt-ai/wizard-quickstart): Install <Constant name="wizard" /> and start a local terminal session
- [Configure BYOK](/docs/dbt-ai/wizard-byok): Manage your API key and choose an AI model
- [Command reference](/docs/dbt-ai/wizard-cli-reference): Full reference for all `wizard` subcommands and global flags
- [Use cases and examples](/docs/dbt-ai/wizard-use-cases): Realistic analytics engineering scenarios
- [Migrate from another AI agent](/docs/dbt-ai/wizard-migrate): Migrate from another AI agent to <Constant name="wizard" />
- [CLI data use and telemetry](/docs/dbt-ai/wizard-telemetry): What <Constant name="wizard" /> CLI collects and how to opt out

<WizardFeedbackCallout />
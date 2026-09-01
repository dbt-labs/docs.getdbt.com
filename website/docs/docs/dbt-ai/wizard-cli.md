---
title: "CLI Overview"
id: "wizard-cli"
description: "Install, verify, update, and uninstall the dbt Wizard CLI on your local machine."
sidebar_label: "Install and update"
tags: [AI, Wizard]
image: /img/docs/wizard-cli-intro.png
availability: local_all
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardCliOnboarding from '/snippets/_wizard-cli-onboarding.md';
import NewToTerminal from '/snippets/_new-to-terminal.md';
import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';
import WizardCliDbtCliSupport from '/snippets/_wizard-cli-dbt-cli-support.md';
import WizardTrialBilling from '/snippets/_wizard-trial-billing.md';

# Install <Constant name="wizard" /> CLI <Lifecycle status="beta"/>

<IntroText>
Install the <Constant name="wizard" /> CLI from your terminal for agentic and governed data development in dbt.
</IntroText>

This guide explains how to install, verify, update, and uninstall the <Constant name="wizard" /> CLI on your local machine.

<WizardTrialBilling />

<WizardCliDbtCliSupport />

## Prerequisites

- macOS, Windows, or Linux
- A dbt project with a built `target/` directory (`dbt parse`, `dbt compile`, or `dbt build`)
- Access to a supported AI provider. You can use a managed provider in dbt, or configure [BYOK](/docs/dbt-ai/wizard-byok) with your own provider credentials.

### Supported AI models

<WizardSupportedProviders defaultSurface="local" />

<NewToTerminal />

## Install and set up dbt Wizard CLI

<WizardCliOnboarding />

## Update

Run the following command to update <Constant name="wizard" /> to the latest version:

```bash
wizard update
```

## Uninstall

1. Run the built-in uninstall command. It lists every binary, config, and data directory it's about to remove, then asks you to confirm (`Proceed? [Y/N]`) before deleting anything:

    ```shell
    wizard system uninstall
    ```

:::info Uninstalling Wizard
Removing `~/.dbt/wizard` deletes your local config, logs, and cache, and can't be undone. Your dbt profiles (`~/.dbt/`) and dbt projects aren't part of <Constant name="wizard" /> and won't be touched.
:::

2. Confirm the binary is deleted by checking your system path:

    ```bash
    which wizard
    ```

If no output path is returned, <Constant name="wizard" /> is successfully uninstalled.


## Telemetry

<Constant name="wizard" /> collects anonymous product telemetry to improve the AI agent experience, understand usage patterns, optimize performance, and attribute compute costs without capturing your code, queries, prompts, responses, or file contents.

For details about what is collected, what is not collected, and how to opt out of client telemetry, refer to [<Constant name="wizard" /> CLI data use and telemetry](/docs/dbt-ai/wizard-telemetry).

:::tip Best practices for using dbt Wizard
Once you're set up, refer to [How to use dbt Wizard in your dbt project](/best-practices/how-to-use-wizard/wizard-1-intro) for recommended workflows on real project tasks.
:::

## Related docs

- [Use <Constant name="wizard" /> locally](/docs/dbt-ai/wizard-quickstart): Install <Constant name="wizard" /> and start a local terminal session
- [Configure BYOK](/docs/dbt-ai/wizard-byok): Manage your API key and choose an AI model
- [Command reference](/docs/dbt-ai/wizard-cli-reference): Full reference for all `wizard` subcommands and global flags
- [Use cases and examples](/docs/dbt-ai/wizard-use-cases): Realistic analytics engineering scenarios
- [Migrate from another AI agent](/docs/dbt-ai/wizard-migrate): Migrate from another AI agent to <Constant name="wizard" />
- [CLI data use and telemetry](/docs/dbt-ai/wizard-telemetry): What <Constant name="wizard" /> CLI collects and how to opt out
- [How to use dbt Wizard in your dbt project](/best-practices/how-to-use-wizard/wizard-1-intro) for recommended workflows

<WizardFeedbackCallout />

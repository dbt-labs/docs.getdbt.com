---
title: "Configure BYOK for dbt Wizard"
id: "wizard-byok"
description: "Bring your own API key to use dbt Wizard CLI. Supports OpenAI, Anthropic, AWS Bedrock, and Snowflake Cortex (preview)."
sidebar_label: "BYOK configuration"
tags: [AI, Wizard, Configuration]
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';

# Configure BYOK for <Constant name="wizard" /> <Lifecycle status="beta"/>

<IntroText>
The <Constant name="wizard" /> CLI runs in bring-your-own-key (BYOK) mode, which means you supply credentials from a supported provider. 
</IntroText>

<WizardFeedbackCallout />

BYOK applies to the CLI only. The <Constant name="dbt_platform" /> uses a separate [account-level integration](/docs/platform/enable-dbt-ai). 

BYOK works as follows:

- <Constant name="wizard" /> calls your chosen provider's API directly using your key.
- Usage costs appear on your provider account, so token costs are billed directly by whichever provider you choose.

<WizardSupportedProviders />

### Configure with `wizard providers`

Use the `providers` subcommand to enable a provider and store credentials:

```bash
wizard providers list
wizard providers configure openai_subscription    # or openai, anthropic, bedrock, azure, snowflake
wizard providers enable openai_subscription
```

You can also configure providers interactively from an active CLI session with the `/providers` slash command.

For OpenAI subscription support, run `wizard providers configure openai_subscription` and follow the prompts. Use `wizard providers configure openai` if you want to use an OpenAI API key instead.

To store an API key without echoing it in your shell history:

```bash
printf '%s' 'sk-...' | wizard providers set-key openai
```

Credentials are stored in `~/.dbt/wizard/provider-auth.json`. Provider settings are stored in `~/.dbt/wizard/providers.json`.

## Set your API key

<Tabs>
<TabItem value="interactive" label="Interactive session" default>

The first time you start <Constant name="wizard" /> in a project, onboarding prompts you to choose a provider:

1. At the **Configure a Provider** prompt, select your provider (OpenAI subscription, OpenAI API key, Anthropic, Amazon Bedrock, Azure, or Snowflake).
2. Paste your API key or cloud credential details when prompted, then press **Enter**.
3. Choose an AI model to finish.

To add or switch providers later from an active session, type `/providers` in the TUI. <Constant name="wizard" /> stores credentials in `~/.dbt/wizard/provider-auth.json`.

</TabItem>
<TabItem value="env-var" label="Environment variable">

Set the key as an environment variable — the simplest option for headless runs (like `wizard exec`) and to reuse your key across sessions:

<Tabs>
<TabItem value="openai" label="OpenAI">

```bash
export OPENAI_API_KEY="sk-..."
```

</TabItem>
<TabItem value="anthropic" label="Anthropic">

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

</TabItem>
</Tabs>

Add this line to your shell profile (`.zshrc`, `.bashrc`, or equivalent) to make it permanent across terminal sessions.

</TabItem>
</Tabs>

To persist provider credentials, use `wizard providers configure PROVIDER_NAME`, `wizard providers set-key PROVIDER_NAME`, or the provider's environment variable.

## Choose an AI model

You can change the AI model in the following ways:

<SimpleTable >
| Method | Description | Example |
|---|---|---|
| Interactive session | Change the AI model interactively in the TUI | `/model` |
| Invocation flag | Change the AI model at invocation with the `-m` flag | `wizard -m gpt-4o "refactor stg_orders to use incremental materialization"` |
| Config file | Set a default AI model in the config file (`~/.dbt/wizard/config.toml`); applies to all future sessions. Run `wizard debug models` to list available model IDs. | `model = "gpt-4o"` |
</SimpleTable>


Make sure to restart the <Constant name="wizard" /> CLI to apply the change.

## AWS Bedrock

AWS Bedrock is supported in the CLI only. Wizard uses your local [AWS credential chain](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) (environment variables, shared credentials file, or IAM role).

1. Enable the Bedrock provider:

    ```bash
    wizard providers enable bedrock
    ```

2. Set the AWS Region (and optional profile):

    ```bash
    wizard providers bedrock set-region us-east-1
    wizard providers bedrock set-profile default   # optional
    ```

3. Or run the interactive setup:

    ```bash
    wizard providers configure bedrock
    ```

4. Choose a Bedrock AI model with `/model` in the TUI, or set a default in `config.toml`. Run `wizard debug models` to list available model IDs.

Ensure your AWS account has access to the Bedrock models you plan to use.

## Snowflake Cortex (preview)

Snowflake Cortex BYOK support in the CLI is in preview. Availability and setup steps may change.

1. Enable the Snowflake provider when supported in your CLI version:

    ```bash
    wizard providers enable snowflake
    ```

2. Run the interactive setup:

    ```bash
    wizard providers configure snowflake
    ```

3. Ensure your Snowflake account has the privileges required for Cortex LLM functions. Refer to the [Snowflake Cortex documentation](https://docs.snowflake.com/en/user-guide/snowflake-cortex/overview).

Run `wizard providers list` to confirm whether Cortex is available in your installed version.

## Related docs

- [Install <Constant name="wizard" />](/docs/dbt-ai/wizard-cli)
- [Configuration reference](/docs/dbt-ai/wizard-config)
- [dbt Wizard in Studio IDE](/docs/dbt-ai/wizard-ide)

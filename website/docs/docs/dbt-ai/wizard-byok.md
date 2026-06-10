---
title: "Configure BYOK for dbt Wizard"
id: "wizard-byok"
description: "Bring your own API key to use dbt Wizard CLI. Supports OpenAI, Anthropic, AWS Bedrock, Google Gemini, and Snowflake Cortex (preview)."
sidebar_label: "BYOK configuration"
tags: [AI, Wizard, Configuration]
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';

# Configure BYOK for <Constant name="wizard" /> <Lifecycle status="beta"/>

<IntroText>
You can use the <Constant name="wizard" /> CLI with bring-your-own-key (BYOK), which means you supply credentials from a supported provider.
</IntroText>

<WizardFeedbackCallout />

The following BYOK instructions on this page apply to the CLI only. <Constant name="dbt_platform" /> uses a separate [account-level integration](/docs/platform/enable-dbt-ai). BYOK works as follows:

- <Constant name="wizard" /> calls your chosen provider's API directly using your key.
- Usage costs appear on your provider account.
- Token costs are billed by whichever provider you choose.

<WizardSupportedProviders />

## Configure a provider

You can configure a provider in one of the following ways:

- **Terminal commands**: Best for users who want to configure providers from the shell.
- **Interactive session**: Best for most users working in the <Constant name="wizard" /> TUI. Use the `/providers` slash command.
- **Environment variables**: Best for headless runs, such as `wizard exec`, automation, or temporary local sessions.

### Configure in the terminal

In the terminal, use the `providers` subcommand to list, configure, and enable providers:

```bash
wizard providers list
wizard providers configure PROVIDER_NAME
wizard providers enable PROVIDER_NAME
```

Replacing `PROVIDER_NAME` with the name of a supported provider, such as `openai`, `anthropic`, `bedrock`, `azure`, `gemini`, or `snowflake`.

The `wizard providers list` command shows you the currently configured providers and their status:

```bash
➜  jaffle-shop git:(mwong-fusion) wizard providers list
provider              enabled  route      auth         models
dbt                   true     remote     dbt          3
openai                false    local      missing      3
openai_subscription   false    local      missing      1
anthropic             false    local      missing      3
bedrock               true     local      configured   15
azure                 false    local      missing      3
snowflake             false    local      missing      3
gemini                false    local      missing      3
```

The `configure` command prompts you to enter credentials for the selected provider. To use environment variables or set a key without echoing it in your shell history, refer to [Set your API key](#set-your-api-key).

So for example, if you're using OpenAI, you would run and follow the prompts to configure it:

```bash
wizard providers configure openai
wizard providers enable openai
```

For OpenAI subscription support, run `wizard providers configure openai_subscription` and follow the prompts. Use `wizard providers configure openai` if you want to use an OpenAI API key instead.

To store an API key without echoing it in your shell history:

```bash
printf '%s' 'sk-...' | wizard providers set-key openai
```

Credentials are stored in `~/.dbt/wizard/provider-auth.json`. Provider settings are stored in `~/.dbt/wizard/providers.json`.

### Configure in the TUI

You can configure providers from an active CLI TUI session with the `/providers` slash command:

```bash
/providers
```

From the provider menu, you can:

* Enable or disable a provider.
* Add or update credentials.
* Select available models.
* Check whether a provider is authenticated and active.

Example provider menu:

```bash
/providers

  Model Providers
  Select a provider to inspect or update it.
 
› 1. dbt                  enabled; 3/3 models selected; uses dbt login; active
  2. openai               disabled; 3/3 models selected; missing credentials; needs setup
  3. openai_subscription  disabled; 1/1 models selected; not connected; needs setup
  4. anthropic            disabled; 3/3 models selected; authenticated; needs setup
  5. bedrock              enabled; 15/15 models selected; authenticated; active
  6. azure                disabled; 3/3 models selected; missing credentials; needs setup
  7. snowflake            disabled; 3/3 models selected; missing credentials; needs setup
  8. gemini               disabled; 3/3 models selected; missing credentials; needs setup
```

## Set your API key

<Tabs>
<TabItem value="interactive" label="Interactive session" default>

The first time you start <Constant name="wizard" /> in a project, onboarding prompts you to choose a provider.

1. At the **Configure a Provider** prompt, select your provider.
2. Paste your API key or provider credentials when prompted.
3. Choose an AI model to finish setup.

To add or switch providers later from an active session, type `/providers` in the TUI.

When you configure a provider through <Constant name="wizard" />, credentials are stored in `~/.dbt/wizard/provider-auth.json`.

</TabItem>
<TabItem value="env-var" label="Environment variable">

Set the key as an environment variable if you want to:

* Run <Constant name="wizard" /> in headless mode, such as with `wizard exec`.
* Use a key for the current terminal [session](/docs/dbt-ai/wizard-how-it-works#sessions) only.
* Reuse the same key across different terminal sessions.
* Avoid storing credentials in the <Constant name="wizard" /> config directory.

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
<TabItem value="bedrock" label="Amazon Bedrock">

```bash
export AWS_BEARER_TOKEN_BEDROCK="ABSK..."
```

</TabItem>
</Tabs>

To make an environment variable available across terminal sessions, add it to your shell profile, such as `.zshrc`, `.bashrc`, or equivalent.

Avoid committing API keys to version control, project files, or shared configuration.

</TabItem>
</Tabs>

To persist provider credentials, use one of the following options:

* `wizard providers configure PROVIDER_NAME`
* `wizard providers set-key PROVIDER_NAME`
* The provider's environment variable

## Choose an AI model

You can change the AI model in the following ways:

<SimpleTable>
| Method | Description | Example |
|---|---|---|
| Interactive session | Change the AI model interactively in the TUI. | `/model` |
| Invocation flag | Change the AI model at invocation with the `-m` flag. | `wizard -m gpt-4o "refactor stg_orders to use incremental materialization"` |
| Config file | Set a default AI model in the config file (`~/.dbt/wizard/config.toml`); applies to all future sessions. Run `wizard debug models` to list available model IDs. | `model = "gpt-4o"` |
</SimpleTable>

Restart the <Constant name="wizard" /> CLI after changing the model.

## Examples

The following examples use the same provider configuration flow described earlier, with provider-specific credential requirements.

### AWS Bedrock

AWS Bedrock is supported in the CLI only. <Constant name="wizard" /> currently supports Bedrock through an Amazon Bedrock API key, not the full AWS credential chain. Ensure your AWS account has access to the Bedrock models you plan to use and that your Bedrock API key has permission to invoke them.

```bash
export AWS_BEARER_TOKEN_BEDROCK="ABSK..."
wizard providers enable bedrock
wizard providers bedrock set-region us-east-1
wizard providers list
wizard debug models
```

To set a default Bedrock model, add the model ID to `~/.dbt/wizard/config.toml`:

```toml
model = "BEDROCK_MODEL_ID"
```

### Snowflake Cortex <Lifecycle status="preview"/>

Snowflake Cortex BYOK support in the CLI is in preview. Availability and setup steps may change. Ensure your Snowflake account has the privileges required for Cortex large language model (LLM) functions. Refer to the [Snowflake Cortex documentation](https://docs.snowflake.com/en/user-guide/snowflake-cortex/overview).

```bash
wizard providers list
wizard providers enable snowflake
wizard providers configure snowflake
wizard providers list
wizard debug models
```

To set a default Snowflake Cortex model, add the model ID to `~/.dbt/wizard/config.toml`:

```toml
model = "SNOWFLAKE_CORTEX_MODEL_ID"
```

## Related docs

* [Install <Constant name="wizard" />](/docs/dbt-ai/wizard-cli)
* [Configuration reference](/docs/dbt-ai/wizard-config)
* [dbt Wizard in Studio IDE](/docs/dbt-ai/wizard-ide)

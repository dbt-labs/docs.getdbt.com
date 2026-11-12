---
title: "Configure BYOK in Wizard Desktop"
id: "wizard-desktop-byok"
description: "Bring your own API key to use Wizard Desktop. Set up Amazon Bedrock, Anthropic, Azure OpenAI, Databricks, Google Gemini, OpenAI, and more from Settings."
sidebar_label: "BYOK configuration"
tags: [AI, Agents, dbt Wizard]
availability: local_all
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';

# Configure BYOK in Wizard Desktop <Lifecycle status="beta"/>

<IntroText>
Bring your own key (BYOK) means you use credentials from your own AI provider instead of dbt Labs-managed models. Add them in <Constant name="wizard" /> Desktop under **Settings** &rarr; **AI providers**.
</IntroText>

With BYOK, <Constant name="wizard" /> calls your provider directly, so usage costs show up on your provider account, not your dbt account. 

Using the CLI or <Constant name="dbt_platform" /> instead? Refer to [Configure BYOK for the CLI](/docs/dbt-ai/wizard-byok) or [Configure BYOK in dbt platform](/docs/platform/wizard-byok-platform).

## Add a provider

1. Open **Settings** (<kbd>⌘</kbd> + <kbd>,</kbd>) and select **AI providers**.
2. Under **Managed by you**, find your provider and select **Configure**.
   <Lightbox src="/img/wizard/desktop/wizard-desktop-byok-ai-providers.png" width="90%" title="AI providers settings in Wizard Desktop" />
3. Select the models you want to use or select **Use provider defaults** (if available) to use the recommended selection.
4. Fill in the fields shown for your provider. The app explains each one as you go.
5. Select **Save**.
<Lightbox src="/img/wizard/desktop/wizard-desktop-byok-configure-provider.png" width="60%" title="Configure a provider, using Amazon Bedrock as an example" />

Each provider shows whether it's set up and how many models are available. You can click **Refresh** if a provider or model you expect isn't listed.

You can pick the model and reasoning effort for each chat from the chat composer.

## Supported providers

<WizardSupportedProviders defaultSurface="local" />

## Update or turn off a provider
You can update or disable a provider directly in Wizard Desktop's **Settings** → **AI providers** page:

- To update credentials: Select **Configure**, enter the new key, and select **Save**. Leave the key blank to keep the saved one.
- To turn a provider off: Select **Configure**, clear every model, and select **Save**.

## Switch the dbt account for managed models

Under **Managed by dbt Labs**, select **Configure** on the `dbt` provider to:

- Choose which dbt account <Constant name="wizard" /> uses for hosted models and billing. This doesn't change which accounts <Constant name="wizard" /> can import projects from.
- Turn individual dbt-managed models on or off.

<Lightbox src="/img/wizard/desktop/wizard-desktop-byok-dbt-managed.png" width="60%" title="Configure dbt-managed models and the dbt account" />

## Related docs

- [Wizard Desktop settings](/docs/dbt-ai/wizard-desktop-settings)
- [Get started with Wizard Desktop](/docs/dbt-ai/wizard-desktop)
- [Configure BYOK for the CLI](/docs/dbt-ai/wizard-byok)
- [dbt Labs-managed providers and billing](/docs/dbt-ai/pricing-billing/overview#dbt-managed-providers)

<WizardFeedbackCallout />

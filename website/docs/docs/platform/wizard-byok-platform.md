---
title: "Configure BYOK for dbt Wizard in dbt platform"
sidebar_label: "BYOK configuration"
description: "Bring your own API key to use dbt Wizard and dbt Copilot in dbt platform. Supports OpenAI, Azure AI Foundry, and Anthropic."
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardConfigureAiProvider from '/snippets/_wizard-configure-ai-provider.md';
import WizardPlatformPreviewDisclaimer from '/snippets/_wizard-platform-preview-disclaimer.md';

<IntroText>
Use bring-your-own-key (BYOK) to connect <Constant name="wizard" /> or dbt Copilot in <Constant name="dbt_platform" /> to your own AI provider account instead of using dbt Labs' managed infrastructure.
</IntroText>

The following BYOK instructions apply to <Constant name="dbt_platform" /> only. For CLI BYOK setup, refer to [Configure BYOK for dbt Wizard](/docs/dbt-ai/wizard-byok).

When you configure a provider with your own key, usage costs appear on your provider account instead of your dbt Labs account, and token costs are billed by whichever provider you choose.

## Prerequisites

- A [<Constant name="dbt_platform" /> account](https://www.getdbt.com/pricing) on Starter, Enterprise, or Enterprise+ plans
- <Constant name="dbt" /> admin permissions to enable AI features and configure providers in **Account settings**
- AI features enabled for your account &mdash; refer to [Enable AI in dbt platform](/docs/platform/enable-dbt-ai#enable-ai-features)
- An API key or credentials for your supported AI provider
<Expandable alt_header="See the full list of supported AI providers">

<WizardSupportedProviders />

#### dbt Copilot

dbt Copilot supports different AI providers, including bring your own key (BYOK) for Enterprise and Enterprise+ plans:

- dbt Labs-<Term id="managed" /> OpenAI API key
- BYOK OpenAI API key
- BYOK Azure OpenAI API key

Snowflake Cortex, AWS Bedrock, Azure AI Foundry, and Anthropic aren't supported for dbt Copilot.

</Expandable>

## Configure AI provider

<WizardConfigureAiProvider />

<WizardPlatformPreviewDisclaimer />

---
title: "Configure BYOK for dbt Wizard in dbt platform"
sidebar_label: "BYOK configuration"
description: "Bring your own API key to use dbt Wizard in dbt platform. Supports OpenAI, Azure AI Foundry, and Anthropic."
availability:
  surface: platform
  access: paid_plan
  minPlan: starter
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import OpenAiProjectRegion from '/snippets/_open-ai-project-region.md';
import WizardConfigureAiProvider from '/snippets/_wizard-configure-ai-provider.md';

<IntroText>
Use bring-your-own-key (BYOK) to connect <Constant name="wizard" /> in <Constant name="dbt_platform" /> to your own AI provider account instead of using dbt Labs' managed infrastructure.
</IntroText>

The following BYOK instructions apply to <Constant name="dbt_platform" /> only. For CLI BYOK setup, refer to [Configure BYOK for dbt Wizard](/docs/dbt-ai/wizard-byok).

When you configure a provider with your own key, usage costs appear on your provider account instead of your dbt Labs account, and token costs are billed by whichever provider you choose.

If you'd rather skip that upkeep, the [dbt Labs-<Term id="managed" /> option](/docs/platform/manage-dbt-ai#configure-ai-provider) is ready to use with no setup, and comes with [trial and monthly usage credits](/docs/dbt-ai/pricing-billing/trial-and-billing).

## Prerequisites

- A [<Constant name="dbt_platform" /> account](https://www.getdbt.com/pricing) on a Starter, Enterprise, or Enterprise+ plan
- <Constant name="dbt" /> admin permissions to enable AI features and configure providers in **Account settings**
- An API key or credentials for your supported AI provider
<Expandable alt_header="See the full list of supported AI providers">

<WizardSupportedProviders />

</Expandable>

## Configure AI provider

<WizardConfigureAiProvider />


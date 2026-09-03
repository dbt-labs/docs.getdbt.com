---
title: "Models and pricing"
id: "overview"
description: "The AI models dbt Wizard supports in the dbt platform and CLI, plus how model pricing works."
sidebar_label: "Models and pricing"
tags: [AI, Wizard]
keywords: ["dbt Wizard", "AI models", "pricing", "open weight models", "frontier models"]
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardModelPicker from '/snippets/_wizard-model-picker.md';

<IntroText>

Learn how <Constant name="wizard" /> usage is metered and how model access works across the <Constant name="dbt_platform" /> and local CLI.

</IntroText>

This page covers which AI models <Constant name="wizard" /> can use and how usage is priced. To start a trial, add a credit card, or set a spend limit, refer to [Trial and billing](/docs/dbt-ai/pricing-billing/trial-and-billing).

Get started with free dbt-managed usage credits. Every credit balance is _per account, not per user_, which means everyone on your account shares the same pool. Enterprise and Enterprise+ accounts get monthly usage credits, and all other plans get a 30-day free trial with $100 in credits.

There are two ways to pay for AI usage: let dbt Labs handle the models and the billing, or bring your own provider key. Here's how they compare:

<SimpleTable>
| <div style={{width:'150px'}}></div> | <div style={{width:'250px'}}>[dbt <Term id="managed" />](#dbt-managed-providers)</div> | <div style={{width:'250px'}}>[Bring your own key (BYOK)](#bring-your-own-key-byok)</div> |
|---|---|---|
| **Choose it when** | You want to start now, with no AI provider account of your own | You already have provider credits, or your company requires a specific vendor |
| **Who bills you** | dbt Labs, through your dbt account | Your AI provider, directly |
| **Spend controls** | Consumption pool and spend limits in **Billing & Usage** | Managed with your provider |
| **Setup** | Nothing to configure | [Configure a provider key](/docs/platform/wizard-byok-platform) |
</SimpleTable>

Both options are metered per token. For dbt <Term id="managed" /> rates, refer to the [Model Provider Rate Table](https://www.getdbt.com/legal/dbt-wizard-token-costs-by-model). With BYOK, you pay whatever your provider charges.

Most users start with the dbt <Term id="managed" /> model and only reach for BYOK or a specific <Term id="managed" /> frontier provider when they need it.

## Key terms

These four terms come up on every <Constant name="wizard" /> billing page:

<SimpleTable>
| Term | What it means |
|---|---|
| Token | The unit of AI model usage. How many tokens you use, and the rate you pay for them, depends on the model, the context window, the length and complexity of your prompt, and the size of the response |
| Usage credits | The free balance included with your plan, shared by everyone on the account, whether thats trial credits on Developer and Starter, or monthly credits on Enterprise and Enterprise+. Scoped to <Constant name="wizard" /> only |
| Consumption pool | Your overall dbt <Term id="managed" /> usage balance, including any pool you purchase once your credits run out. A purchased pool covers both <Constant name="wizard" /> and dbt State. Shown as **Consumption pool** in **Billing & Usage** |
| Spend limit | The maximum dbt <Term id="managed" /> usage your account can consume in a billing period |
</SimpleTable>

Usage draws down from your credits first, then your consumption pool, and stops at your spend limit. Usage costs are passed through directly from the AI provider.

## dbt managed providers

In the <Constant name="dbt_platform" />, <Constant name="wizard" /> offers a <Term id="managed" /> OpenAI model by default. dbt Labs also offers <Term id="managed" /> access to Anthropic and to open weight models.

You'll see two kinds of models across these pages:

- **Frontier models** are the flagship models hosted by providers like OpenAI and Anthropic. They're the most capable and the most expensive per token.
- **Open weight models**, such as DeepSeek and Kimi, are openly published models available through dbt Labs. They offer a strong balance of capability and cost compared to frontier models.

Refer to the [Model Provider Rate Table](https://www.getdbt.com/legal/dbt-wizard-token-costs-by-model) and [Supported AI providers](#supported-ai-providers) for the full list of what's available where.

## Bring your own key (BYOK)

With BYOK, you supply your own credentials for a provider &mdash; OpenAI, Anthropic, Azure AI Foundry, AWS Bedrock, Google Gemini, Snowflake Cortex, or Databricks.

To set up BYOK, refer to [Configure BYOK for dbt platform](/docs/platform/wizard-byok-platform) or [Configure BYOK for the CLI](/docs/dbt-ai/wizard-byok).

## Supported AI providers

<WizardSupportedProviders />

## Choose a model

<WizardModelPicker />

## Related docs

- [Trial and billing](/docs/dbt-ai/pricing-billing/trial-and-billing) for trials, spend limits, and paid access
- [Billing](/docs/platform/billing) for general dbt platform billing
- [Model Provider Rate Table](https://www.getdbt.com/legal/dbt-wizard-token-costs-by-model) for per-model token rates
- [Service Consumption Table](https://www.getdbt.com/legal/service-consumption-table)

---
title: "Manage AI features in dbt platform"
sidebar_label: "Manage AI features"
description: "Admin tasks for AI in dbt platform: turn account access to AI features on or off, choose an AI provider, and manage spend."
availability: platform_login
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardConfigureAiProvider from '/snippets/_wizard-configure-ai-provider.md';
import WizardTrialBilling from '/snippets/_wizard-trial-billing.md';

<IntroText>
Manage AI features in <Constant name="dbt_platform" /> by turning AI features on or off, choosing which AI provider to use, and controlling spend.
</IntroText>

The details on this page are generally for admin tasks. If you're looking for what <Constant name="wizard" /> does and where you can use it, start with [About <Constant name="wizard" /> in <Constant name="dbt_platform" />](/docs/platform/wizard-platform).

<WizardTrialBilling/>

## Prerequisites

- A [<Constant name="dbt_platform" /> account](https://www.getdbt.com/pricing) on Developer, Starter, Enterprise, or Enterprise+ plans
  - [Legacy team plans](/docs/platform/billing/plans-and-billing#legacy-plans) don't have access to <Constant name="wizard" /> and we recommend moving to a [Starter, Enterprise, or Enterprise+ plan](https://www.getdbt.com/pricing) to use it and other features.
  - Certain features like [natural prompts in Canvas](/docs/platform/build-canvas-copilot) are only available on Enterprise and Enterprise+ plans.
- <Constant name="dbt" /> admin permissions to change account settings and configure providers.
- A development environment on a supported [release track](/docs/dbt-versions/dbt-release-tracks) to receive ongoing updates.

## Manage account access to AI features {#manage-ai-features}

Eligible accounts, including new ones, have AI features on by default, so most users can open <Constant name="wizard" /> without an admin changing anything first. Admins with governance or compliance requirements can turn AI off or back on anytime by following these steps:

1. Navigate to **Account settings** in the navigation menu.
2. Under **Settings**, confirm the account you want to change.
3. Click **Edit** in the top right corner.
4. Turn **Enable account access to AI features** off to disable access or on to enable it.
5. Click **Save**.

Turning AI features off applies to the whole account, including <Constant name="wizard" /> and dbt Copilot. The [dbt Support Assistant](/docs/dbt-support?version=2#ask-dbt-support-assistant) is managed separately by dbt Labs (contact the [dbt Support team](mailto:support@dbtlabs.com) for more info).

## Supported AI providers

<WizardSupportedProviders />

dbt Copilot supports a smaller set of providers. Refer to [dbt Copilot](/docs/dbt-ai/copilot-overview#configure-ai-provider-for-dbt-copilot) for its providers and setup steps.

## Configure AI provider

<WizardConfigureAiProvider />

To bring your own key instead of using dbt Labs' managed infrastructure, refer to [Configure BYOK for dbt Wizard in dbt platform](/docs/platform/wizard-byok-platform).

## Manage spend

<Constant name="wizard"/> is available to <Constant name="dbt_platform"/> Developer, Starter, Enterprise, and Enterprise+ plans. Legacy team plans don't have access to <Constant name="wizard"/> but can [upgrade](https://www.getdbt.com/pricing) to Starter or Enterprise-tiered plans to access.

Enterprise and Enterprise+ accounts get monthly usage credits, and all other plans start with a 30-day trial with $100 in usage credits. When your credits or trial run out (whichever comes first), set a spend limit so your team can keep working with minimal interruption:

- [Manage your spend limit](/docs/dbt-ai/pricing-billing/trial-and-billing#manage-your-spend-limit) to cap what the account can spend on AI usage.
- [Models and pricing](/docs/dbt-ai/pricing-billing/overview) explains what each model costs.
- With [BYOK](/docs/platform/wizard-byok-platform), your AI provider bills you directly and the usage doesn't draw from your consumption pool.

## Related docs

- [About <Constant name="wizard" /> in <Constant name="dbt_platform" />](/docs/platform/wizard-platform)
- [Configure BYOK in <Constant name="dbt_platform" />](/docs/platform/wizard-byok-platform)
- [Trial and billing](/docs/dbt-ai/pricing-billing/trial-and-billing)
- [Data & Privacy in <Constant name="dbt_platform" />](/docs/dbt-ai/dbt-ai-faqs#privacy-and-data)

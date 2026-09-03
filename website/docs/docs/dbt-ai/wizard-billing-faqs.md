---
title: "dbt Wizard billing and AI access FAQs"
id: "wizard-billing-faqs"
description: "Answers to common questions about AI being enabled by default, dbt Wizard usage, consumption pools, trials, spend limits, and BYOK billing."
sidebar_label: "Billing and access FAQs"
tags: [AI, Wizard, billing]
---

import WizardBillingFaqs from '/snippets/_wizard-billing-faqs.md';

<IntroText>

Common questions about AI being turned on by default, how <Constant name="wizard" /> usage is measured, what your usage credits covers, and how spend limits work.

</IntroText>

:::info What's changing from September 1, 2026

From September 1, 2026, a couple of things are changing for dbt AI features:
- **AI features are being enabled by default.** They're already on for new accounts and are rolling out soon to existing accounts. If your organization opted out, they'll remain off. Admins can turn AI features on or off anytime in **Account settings**.
- **<Constant name="wizard" /> is moving to usage-based billing** for [dbt-<Term id="managed"/> AI](#dbt-managed-inference). Usage is metered per token against your consumption pool, and an admin can set a monthly spend limit in <Constant name="dbt_platform"/>.

:::

## AI enabled by default

AI features are being enabled by default for <Constant name="dbt_platform" /> accounts. They're already on for new accounts and are rolling out soon to existing accounts. If your organization opted out, they'll remain off. Admins can turn AI features on or off anytime in **Account settings**. Turning AI on doesn't create a charge on its own &mdash; refer to [Billing FAQs](#billing-faqs) in the next section to understand how usage is metered.

<Expandable alt_header="Which AI features are enabled by default?">

The following surfaces are on by default:

- <Constant name="wizard" /> in <Constant name="studio_ide" />
- <Constant name="wizard" /> home tab
- dbt Copilot in <Constant name="dbt_platform"/> (includes Canvas and Insights).
- Any future dbt AI features will automatically become available as well.           
</Expandable>

<Expandable alt_header="AI features aren't on for my account yet. How do I turn them on?">

AI features are already on for new accounts and are rolling out soon to existing accounts, so they may not be on for your account right away. An account admin can turn them on now in **Account settings** &mdash; refer to [Manage AI features in dbt platform](/docs/platform/manage-dbt-ai). If your organization opted out, they'll remain off until an admin turns them on.

</Expandable>

<Expandable alt_header="I previously asked for AI to be permanently disabled. Will it turn on anyway?">

No. If your organization already opted out of AI features contractually or had them permanently disabled, they stay off. You don't need to do anything before September 1, 2026.

</Expandable>

<Expandable alt_header="Can I opt out of AI features?">

Yes. An account admin can turn AI off at any time in **Account settings**. Refer to [Manage AI features in dbt platform](/docs/platform/manage-dbt-ai) for the steps &mdash; the same toggle controls both <Constant name="wizard" /> and dbt Copilot.

</Expandable>

<Expandable alt_header="If AI is enabled by default, will I be charged automatically?">

No. Enabling AI doesn't authorize paid usage by itself. <Constant name="wizard" /> usage draws from your included consumption pool or trial pool.

On Developer, Starter, and self-hosted plans, dbt-managed <Constant name="wizard" /> pauses once that pool is used up, and going beyond it requires explicit purchase. 

Enterprise and Enterprise+ account should add a committed spend amount to their contract to keep using <Constant name="wizard" />. You may lose access to <Constant name="wizard" /> without this commit in place. If you've set an optional monthly <Constant name="wizard" /> spend limit, that still applies and pauses usage once reached.


If you keep AI disabled, you incur no AI charges after September 1, 2026.

</Expandable>

<Expandable alt_header="Which AI features use consumption-based billing?">

Only <Constant name="wizard" /> with dbt-<Term id="managed" /> inference, across <Constant name="wizard" /> in <Constant name="dbt_platform" /> and the <Constant name="wizard" /> CLI. dbt Copilot stays on its existing actions-based model and isn't moving to consumption-based billing.

</Expandable>

<Expandable alt_header="How do I check whether AI is enabled and what my account has used?">

An account admin will be able to check the AI toggle in **Account settings**. To see usage and remaining credit from September 1st, 2026, go to **Account settings** > **Billing & Usage**. 

The overview and the <Constant name="wizard" /> usage-based feature page will show your consumption pool, amount used and remaining, and the reset date. Historical dbt Copilot Actions usage appears there too.

</Expandable>

<Expandable alt_header="Who do I contact about AI access or usage limits?">

Contact your dbt Labs account team for questions about enabling or disabling AI features, purchasing additional usage credits, or contract-specific billing questions. If you're on Developer or Starter plan, [reach out to dbt Support](mailto:support@getdbt.com) for help.

</Expandable>

## Billing FAQs

The following questions cover how dbt-<Term id="managed" /> inference is metered for <Constant name="wizard" /> usage, what your plan's consumption pool will include, and how you can track and cap your spend once Wizard usage-based billing goes live on September 1st, 2026.

<WizardBillingFaqs />

## Related docs

- [Manage AI features in <Constant name="dbt_platform" />](/docs/platform/manage-dbt-ai) to turn AI features on or off
- [How <Constant name="wizard" /> works](/docs/dbt-ai/wizard-how-it-works)
- [dbt AI usage](/docs/platform/billing/dbt-ai-usage) for how dbt AI usage is metered and limited
- [BYOK for the <Constant name="dbt_platform" />](/docs/platform/wizard-byok-platform) or [BYOK for the CLI](/docs/dbt-ai/wizard-byok)
- [Billing](/docs/platform/billing) for general <Constant name="dbt_platform" /> billing

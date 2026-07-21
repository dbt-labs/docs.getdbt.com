---
title: "dbt State trial and billing"
sidebar_label: "Trial and billing"
description: "Learn about dbt State trial and billing."
id: "dbt-state-trial"
tags: ['dbt State']
---

import DbtStatePricing from '/snippets/_dbt-state-pricing.md';
import DbtStateTrialHowItWorks from '/snippets/_dbt-state-trial-how-it-works.md';

# dbt State trial and billing <Lifecycle status="preview" />

<IntroText>

Start a dbt State trial and manage paid access from the <Constant name="dbt_platform" /> **Billing & Usage** dashboard.

</IntroText>

## How the trial works

<DbtStateTrialHowItWorks />

## Starting your trial

To start your 30-day trial, refer to the instructions in [Setting up dbt State](/docs/deploy/dbt-state-setup).

## Continuing after the trial ends <Lifecycle status="managed,managed_plus" />

Once your trial ends, dbt notifies your billing admin &mdash; they must set up paid access to keep using dbt State.

If your account has consumption spend on contract, go to the **State** tab of the **Usage-based features** page and click **Allow** to bill against your committed spend. Otherwise, [contact the dbt Labs sales team](https://www.getdbt.com/contact).

<!--
**Self-serve accounts**:

1. Go to **Billing & Usage** > **Usage-based features**.
2. Click **Add billing info**.
3. Add a payment method or use a card on file. 
4. Click **Confirm and activate**.

-->

## How billing works

<DbtStatePricing />

## Setting spend alerts

You can set a spend alert to get notified when your monthly dbt State costs reach a defined threshold.

1. In your <Constant name="dbt_platform" /> account, click your account name in the lower-left corner above your username and click **Account settings**.
2. Go to **Billing & Usage** > **Usage-based features**.
3. In the **Spend alert** section, click **Set a spend alert**.
4. Enable the toggle to receive email notifications when monthly spend reaches your threshold.
5. In the **Alert threshold** field, enter the amount in USD that triggers the alert.
6. Click **Save**.

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
- [dbt State usage and pricing](/docs/platform/billing#dbt-state-usage)

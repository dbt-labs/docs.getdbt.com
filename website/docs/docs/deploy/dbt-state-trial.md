---
title: "dbt State trial and billing"
sidebar_label: "Trial and billing"
description: "Learn about dbt State trial and billing."
id: "dbt-state-trial"
tags: ['dbt State']
availability: everywhere_usage
---

import DbtStatePricing from '/snippets/_dbt-state-pricing.md';
import DbtStateTrialHowItWorks from '/snippets/_dbt-state-trial-how-it-works.md';
import DbtStateFreePlan from '/snippets/_dbt-state-free-plan.md';

# dbt State trial and billing

<IntroText>

Start a dbt State trial, continue on your plan's free monthly DATT allowance, or manage paid access from the <Constant name="dbt_platform" /> **Billing & Usage** dashboard.

</IntroText>

## How the trial works

<DbtStateTrialHowItWorks />


## How billing works

<DbtStatePricing />

## Free monthly DATT allowance

<DbtStateFreePlan />

## Setting up usage-based billing

dbt State pricing is usage-based; you're billed per target table that dbt State reuses each day, _not_ per <Constant name="dbt_platform" /> seat.

You can set up billing during your trial or at any time after. Follow the steps for your account type:

#### Managed accounts

If your account has consumption spend on contract, go to the **State** tab of the **Usage-based features** page and click **Allow** to bill against your committed spend. Otherwise, [contact the dbt Labs sales team](https://www.getdbt.com/contact).

#### Self-hosted and Developer accounts

1. Go to **Billing & Usage** > **Usage-based features**.
2. Click **Set up billing** (if your trial is still active) or **Add billing info** (if your trial has ended).
3. In **Add a payment method**, enter your card details and billing address.
4. Click **Save card**.
5. Under the **State** tab, the card you added is displayed. Click **Confirm and activate**.

After setting up billing, you can optionally [set a spend alert](#setting-spend-alerts) to get notified when your monthly costs reach a threshold.

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

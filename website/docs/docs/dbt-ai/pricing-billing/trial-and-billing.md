---
title: "Trial and billing"
id: "trial-and-billing"
description: "Start a dbt Wizard trial, set a spend limit, and manage Wizard billing for the dbt platform and local CLI."
sidebar_label: "Trial and billing"
tags: [AI, Wizard, billing]
---

import WizardHowTrialWorks from '/snippets/_wizard-how-trial-works.md';

# Trial and billing

<IntroText>

Start a <Constant name="wizard" /> trial, set a spend limit, and manage paid access for both the <Constant name="dbt_platform" /> and local CLI.

</IntroText>

This page covers how to get <Constant name="wizard" /> access and pay for it. For the models <Constant name="wizard" /> can use and how tokens and credits work, refer to [Models and pricing](/docs/dbt-ai/pricing-billing/overview).

Billing and spend controls are shared across the <Constant name="dbt_platform" /> and local CLI. Both surfaces draw from the same account-level balance.

## Prerequisites

- Account admin or billing admin permissions to start a trial or change a spend limit.
- A <Constant name="dbt" /> account to manage usage, billing, spend limits, and more.
    - If you don't have one, you can create one during setup. No paid <Constant name="dbt_platform" /> plan required. This is generally useful for users on self-hosted <Constant name="dbt" /> running the CLI.
- A business email address. Personal domains such as Gmail aren't eligible for a trial.

## What you get by plan

<WizardHowTrialWorks product={<Constant name="wizard" />} />

Everything on this page describes dbt <Term id="managed" /> billing &mdash; usage that dbt Labs bills through your <Constant name="dbt" /> account. If you bring your own key, your AI provider bills you directly and none of this applies. Refer to [BYOK for <Constant name="dbt_platform" />](/docs/platform/wizard-byok-platform) or [BYOK for the CLI](/docs/dbt-ai/wizard-byok) instead.

## Start your trial

Start your trial from anywhere in the <Constant name="dbt_platform" /> or from the <Constant name="wizard" /> CLI.
Note, Enterprise-tiered plans automatically have a [spend limit set](/docs/dbt-ai/wizard-billing-faqs#what-does-the-dbt-wizard-enterprise-plan-monthly-usage-credits-include)

<Tabs queryString="start-trial">

<TabItem value="platform" label="dbt platform">

Start from **Billing & Usage**, or from the <Constant name="wizard" /> prompt in <Constant name="studio_ide" /> or the home tab as they all take you to the same flow. 

1. Click your account name, then select **Account settings**. (Or click on any button that says "Start trial" to start your Wizard trial.)
2. Under **Settings**, click **Billing & Usage**.
3. On the **Overview** tab, find the **dbt Wizard** card and click **Start trial**.

No credit card is required. Your 30-day trial with $100 in usage credits starts right away, and you can track how much you've used anytime in **Billing & Usage**.

<Lightbox src="/img/docs/dbt-platform/wizard-billing-overview.png" width="85%" title="The Billing & Usage Overview page, showing dbt State and dbt Wizard cards with Start trial buttons, plus a usage-by-month chart" />

</TabItem>

<TabItem value="cli" label="Wizard CLI">

There's no **Start trial** button in the CLI. Logging in is what starts your trial &mdash; one command creates your free <Constant name="dbt" /> account, if you don't have one, and provisions the 30-day trial with $100 in usage credits at the same time.

1. [Install <Constant name="wizard" />](/docs/dbt-ai/wizard-quickstart).
2. Run `dbt login` and complete the browser sign-in, or create a new account to manage your <Constant name="wizard" /> spend limits:

   ```shell
   dbt login
   ```

3. Run `wizard` in your project and choose **dbt-managed** when onboarding asks how AI usage is billed. You don't need an AI provider key.

You don't need a paid <Constant name="dbt_platform" /> plan, so this path is the same whether you're on a <Constant name="dbt_platform" /> plan or running against a self-hosted <Constant name="dbt" /> project. Refer to [Use <Constant name="wizard" /> locally](/docs/dbt-ai/wizard-quickstart) for the full onboarding walkthrough.

</TabItem>

</Tabs>

## Set up paid usage

What you do next depends on your plan.

### Developer, Starter, or self hosted

1. Go to **Billing & Usage > Usage-based features**.
2. Click **Set up billing**.
3. Add a credit card and fill in your payment details. Click **Save card**.
4. Complete your setup to choose a preset monthly spend limit, or set your own with the **Custom** option.
5. Optionally, turn on automatic increases for when you're close to your limit.
6. Click **Continue**.
7. Review and confirm your spend limit. Click **Activate dbt Wizard** to start your billing. You won't be charged today and will be billed monthly for actual usage, up to the limit you set. Usage then pauses if you reach that limit.


<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-platform/wizard-add-billing.png" width="90%" title="The Add billing page, showing a credit card form and a complete billing setup flow" />

<Lightbox src="/img/docs/dbt-platform/wizard-manage-spend.png" width="85%" title="The Set your dbt Wizard spend limit page, showing pre-set monthly options, a Custom option, and an auto-raise toggle" />

<Lightbox src="/img/docs/dbt-platform/wizard-activate.png" width="85%" title="The Activate dbt Wizard page where you can review and confirm your spend limit and a button to activate dbt Wizard" />

</DocCarousel>

### Enterprise and Enterprise+ plans

There's no trial to start and no self-serve credit card flow. Your monthly usage credits are granted automatically &mdash; [contact your account team](https://www.getdbt.com/contact) to set up or adjust committed spend.

## Manage your spend limit

Your spend limit caps how much dbt <Term id="managed" /> <Constant name="wizard" /> usage your account can consume in a billing period, across both the <Constant name="dbt_platform" /> and local development.

- You only pay for actual usage, up to the limit you choose. The limit is a cap, not a prepaid charge.
- If you reach your limit, <Constant name="wizard" /> usage pauses until you raise it or the next billing cycle starts.
- Limits are set separately for <Constant name="wizard" /> and [dbt State](/docs/deploy/dbt-state-about), but both draw from your account's overall usage-based spend.

To view or update your limit, go to **Billing & Usage > Usage-based features > Wizard**. Enterprise-tiered plans can [contact their account team](https://www.getdbt.com/contact) to adjust their limit.

<Lightbox src="/img/docs/dbt-platform/wizard-manage-spend.png" width="85%" title="The Manage your dbt Wizard spend limit page, showing pre-set monthly options and a Custom option." />

## View your usage and costs

To see what you've spent, go to **Account settings > Billing & Usage > Usage-based features** and open the **Wizard** tab. From there you can check:

- How much of your included monthly usage you've used, what's left, and when it resets.
- Your current <Constant name="wizard" /> spend limit, with an **Edit** button to change it.
- **<Constant name="wizard" /> usage by model**, which breaks down your usage (in UTC) so you can see which models are driving your costs.

## How usage is measured

<Constant name="wizard" /> usage is measured in tokens, then converted into dollar-based usage based on the model and the token type, such as input, cached read, cache write, or output. Refer to [Key terms](/docs/dbt-ai/pricing-billing/overview#key-terms) for what a token is, and the [Model Provider Rate Table](https://www.getdbt.com/legal/dbt-wizard-token-costs-by-model) for current rates.

## Related docs

- [<Constant name="wizard" /> billing FAQs](/docs/dbt-ai/wizard-billing-faqs) for common billing questions
- [Models and pricing](/docs/dbt-ai/pricing-billing/overview) for model options and token pricing
- [BYOK for dbt platform](/docs/platform/wizard-byok-platform) or [BYOK for the CLI](/docs/dbt-ai/wizard-byok) for bring-your-own-key setup
- [Billing](/docs/platform/billing) for general <Constant name="dbt_platform" /> billing

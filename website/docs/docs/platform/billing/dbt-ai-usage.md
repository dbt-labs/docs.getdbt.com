---
title: "dbt AI: Usage metering and limiting"
id: dbt-ai-usage
description: "Learn how dbt AI usage is metered and limited by plan."
sidebar_label: "dbt AI usage"
---

<Lifecycle status="Starter, Enterprise, Enterprise+" />

dbt AI usage is measured based on the number of completed AI requests, known as dbt Copilot actions. Usage limits are enforced to ensure fair access and system performance.

A defined number of dbt Copilot invocations is allocated monthly based on your [subscription plan](https://www.getdbt.com/pricing). Once the usage limit is reached, access to dbt AI will be temporarily disabled until the start of the next billing cycle.

As a temporary compatibility bridge, <Constant name="wizard" /> can draw from your existing dbt Copilot included action allotment through July 13, 2026 or longer (timeline subject to change). We may extend this timeline and will provide advance notice before any changes.

After the temporary bridge ends, <Constant name="wizard" /> usage will be metered separately. Pricing and usage are subject to change.

### Usage and metering information 

<Expandable alt_header="Temporary dbt Copilot Actions bridge (through July 13, 2026)">

As a temporary compatibility bridge, dbt Wizard can draw from your existing dbt Copilot included action allotment through July 13, 2026 or longer (timeline subject to change). After this temporary bridge ends, <Constant name="wizard" /> usage will be metered separately. 

Users that bring their own key (BYOK) aren't affected by this bridge.

</Expandable>

<Expandable alt_header="AI usage tracking by dbt Copilot actions">

dbt Copilot actions refer to requests made to the dbt Copilot assistant through the <Constant name="dbt" /> interface. These actions are recorded and displayed on the billing page alongside other usage metrics by accessing the **Copilot Actions** tab in the **Billing** page.

The following interactions count as dbt Copilot actions:

- **Each inline generation** &mdash; Every time dbt AI writes or suggests code in your file, it counts toward your usage limit.

- **Each generation of documentation, tests, semantic models, or metrics** &mdash; Any time you ask dbt AI to automatically create things like documentation, tests, data models, or metrics, it counts as one interaction.

- **Each generation within dbt AI chats on <Constant name="canvas" /> or <Constant name="insights" />** &mdash; Any time you use dbt Copilot chat in <Constant name="canvas" /> or <Constant name="insights" /> to generate something, it counts as an interaction.

</Expandable>

<Expandable alt_header="Allowed limits on number of dbt Copilot actions per month per license">

The following table outlines the limits of dbt Copilot actions by plan per month:

<SimpleTable>
|Plan                       |Limit |
|---------------------------|------|
|Developer                  | ❌   |
|Starter*                   |100   |
|Enterprise                 |5,000 |
|Enterpise+                 |10,000|
</SimpleTable>

*Team plan customers who enrolled in dbt Copilot Beta prior to March 19, 2025 have access to dbt Copilot. All other legacy Team plan customers must move to the [Starter plan or above](https://www.getdbt.com/pricing) to get access. 

</Expandable>

<Expandable alt_header="Notifications when limitations are reached ">

When usage limits are reached, a notification appears in the UI. Additionally, an email notification is sent to the designated recipient. 

For users on the Starter plan, the account owner receives an email notification when the usage limit is reached. 

For users enrolled on the Enterprise and Enterprise+ plans, both the billing administrator and the account administrator are notified by email when the usage limit is reached.

Once usage limits are reached, attempts to perform an action in dbt Copilot triggers a banner notification indicating that the limit has been exceeded.

Under Bring Your Own Key (BYOK), usage is not tracked by dbt AI and is subject to your OpenAI limits.

</Expandable>

### Viewing usage in the product

To view the usage in your account:

1. Navigate to [**Account settings**](/docs/platform/account-settings).

2. Select **Billing** under the Settings header.
3. On the billing page, click the **Copilot Actions** tab to view your usage.

<Lightbox src="/img/docs/dbt-platform/view-usage-in-copilot.gif" title="View usage in dbt Copilot" />

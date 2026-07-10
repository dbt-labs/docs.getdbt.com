---
title: "Billing"
id: billing 
description: "dbt billing information." 
sidebar_label: Billing
pagination_next: null
pagination_prev: null
---

dbt offers a variety of [plans and pricing](https://www.getdbt.com/pricing) to fit your organization's needs, with [server availability](https://docs.getdbt.com/docs/platform/about-platform/access-regions-ip-addresses) worldwide.

## How does dbt pricing work?

You pay for the number of seats you have and the amount of usage consumed each month. Seats are billed based on the Developer and Read licenses you purchase. Usage is based on [Successful Models Built](#what-counts-as-a-successful-model-built) and, if purchased, Semantic Layer [Queried Metrics](#what-counts-as-a-queried-metric), subject to reasonable usage. All billing computations are conducted in Coordinated Universal Time (UTC).

For exact rates and included allotments by plan, see [dbt pricing](https://www.getdbt.com/pricing).

### What counts as a seat license?

Learn more about allocating users to your account in [Users and licenses](https://docs.getdbt.com/docs/platform/manage-access/seats-and-users). There are four seat license types:

- **Analyst** — for permission sets shared among those who don't need day-to-day access.
- **Developer** — for permission sets that require day-to-day interaction with dbt platform.
- **IT** — for access to account management features (for example, configuring git integration).
- **Read-Only** — for viewing certain documents and reports.

\* The [Analyst license type](https://docs.getdbt.com/docs/platform/manage-access/about-user-access?version=1.12#licenses) is not available for new purchase.

### What counts as a Successful Model Built?

A Successful Model Built is any model successfully built through dbt's orchestration functionality in a deployment environment — including scheduled jobs, CI builds, API-triggered runs, and similar tools. A model counts as soon as it's built, even if the rest of the job later fails. Models built in a development environment (for example, the Studio IDE) don't count, nor do tests, seeds, ephemeral models, or snapshots.

Dynamic tables count on initial creation. On later runs, they're only recounted if the dynamic table's [`on_configuration_change` config](https://docs.getdbt.com/reference/resource-configs/on_configuration_change) changes — not simply because the underlying data refreshed.

| What counts toward Successful Models Built | |
| --- | --- |
| View | ✅ |
| Table | ✅ |
| Incremental | ✅ |
| Ephemeral models | ❌ |
| Tests | ❌ |
| Seeds | ❌ |
| Snapshots | ❌ |

### What counts as a Queried Metric?

The Semantic Layer, powered by MetricFlow, measures usage in Queried Metrics:

- Every successful request to render or run SQL against the Semantic Layer API counts as at least one queried metric, even if no data is returned.
- A request covering multiple metrics counts each calculated metric separately.
- Failed or incomplete queries, and metadata-only requests, don't count.

For example, querying one metric grouped by two dimensions counts as one queried metric; querying two metrics grouped by the same dimensions counts as two.

## Where to view usage

You can see estimated usage in a few places, depending on your role and plan:

- **Account settings → Billing** — an account-level view of usage against your plan's allotment (Starter/Developer) or annual commit (Enterprise). Access is restricted to the Owner group (Starter) or Account and Billing admin roles (Enterprise/Enterprise+).
- **Project Home** — how many models each project has built this month.
- **Job Details → Insights** — models built per month for a specific job, and which models take the longest to build.
- **Billing → Copilot Actions tab** — dbt Copilot usage against your plan's monthly allotment.

Usage shown in the product is an estimate and may lag slightly; your monthly statement reflects final usage (Starter and Enterprise-tier plans).

## dbt State usage

[dbt State](https://docs.getdbt.com/docs/deploy/dbt-state-about) lets dbt reuse nodes by cloning from another location or skipping a rebuild when logic and data haven't changed. It's a separate, usage-based product available to dbt Core, dbt platform, and dbt Fusion engine users, billed on **daily active target tables (DATT)** — the distinct target tables (models, seeds, snapshots, and tests) for which dbt State performs at least one skip, clone, or test reuse on a given UTC day. All reuses of the same table on the same day count as a single DATT.

Eligible new organizations get 30 days of free use with no usage limit; a credit card or enterprise contract is required afterward. Usage is tracked through your cancellation date — you're billed for usage incurred before cancellation and not charged afterward.

For current DATT rates, see [dbt pricing](https://www.getdbt.com/pricing).

## dbt AI usage: metering and limits

dbt AI usage is measured by completed AI requests, called **dbt Copilot actions**. Each plan includes a monthly allotment of Copilot actions that scales with plan tier; once it's reached, dbt AI is temporarily disabled until the next billing cycle. See [dbt pricing](https://www.getdbt.com/pricing) for current allotments by plan.

The following count as Copilot actions:

- Each inline code generation or suggestion.
- Each generation of documentation, tests, semantic models, or metrics.
- Each generation within dbt AI chats on Canvas or Insights.

Actions are recorded on the **Copilot Actions** tab of the Billing page. Under Bring Your Own Key (BYOK), usage isn't tracked by dbt AI and is instead subject to your own model provider's limits.

**Notifications:** When a usage limit is reached, a banner appears in the product and an email goes to the relevant admins — the account owner (Starter) or billing and account administrators (Enterprise/Enterprise+).

## Plans and billing

dbt offers several [plans](https://www.getdbt.com/pricing) with different features. We'll always give advance notice of any changes to plan details. Included model allotments and rates reflect current pricing and packaging — your account's actual entitlements may differ based on the terms in place when you signed up.

### Developer plan

Free, and includes one Developer license plus a monthly model allotment that refreshes at the start of each calendar month. Exceeding it pauses subsequent runs until the next refresh or an upgrade; the rest of dbt platform stays accessible and no work is lost.

### Starter plan

Billed monthly via credit card for seats and usage. Seats are charged upfront at the start of the month; seats added mid-month are prorated, and seats removed are reflected on the next invoice (not refunded). You can manage your card and seat count anytime from the Billing section.

Usage is calculated and billed in arrears for the prior month. Exceeding your plan's included models results in additional usage charges on the next invoice, at the rates on the [pricing page](https://www.getdbt.com/pricing). Unused included models don't roll over.

### Enterprise plan

Billed annually via invoice, with usage in excess of your commit billed monthly in arrears; negotiated rates may apply. Refer to your order form or contract for pricing specifics, or [contact your account team](https://www.getdbt.com/contact-demo) with questions. Enterprise billing details aren't available in the dbt UI — changes go through your dbt Labs Solutions Architect or account manager.

### Legacy plans

Customers who purchased the dbt Starter plan (formerly Team) before August 11, 2023 remain on legacy seat-based pricing, with unlimited models subject to reasonable use, as long as the account is in good standing.

Customers on the legacy Semantic Layer (dbt_metrics package) can upgrade anytime to the current Semantic Layer powered by MetricFlow, available free on a limited trial basis for eligible accounts (see [prerequisites](https://docs.getdbt.com/guides/sl-snowflake-qs#prerequisites)).

dbt Labs may institute use limits if reasonable use is exceeded, and additional features or upgrades may carry separate charges. Plan pricing changes are communicated in advance per our Terms of Use.

## Managing usage

From dbt, select your account name in the left sidebar, then **Account settings → Billing** to view available plans and features.

### Usage notifications

Every plan sends automatic email alerts at 75%, 90%, and 100% of estimated usage, to the Owner group (Starter) or Account/Billing admins (Enterprise-tier). These can't be opted out of — to add recipients, assign them the relevant permission. Because of usage patterns and minor latency, actual usage may already exceed the percentage shown in an alert.

### How do I stop usage from accruing?

- **Pause jobs without deleting them:** in each job's **Settings → Triggers**, turn off **Run on Schedule** and set **Run on Pull Requests?** to No. Also check for any API-triggered runs in your workflows.
- **Delete jobs:** stops all runs permanently, including the job configuration itself.

For cost-optimization techniques — like tuning `lag_tolerance`, using selectors to limit rebuilds, and identifying slow-running models — see [Optimize dbt performance and cost](#) *(moved from this page — link to new location)*.

For answers to common plan and billing questions, refer to [Billing FAQs](https://docs.getdbt.com/docs/platform/billing-faqs).
---
title: "Managing usage"
id: managing-usage
description: "Learn how to view, monitor, and manage your dbt usage."
sidebar_label: "Managing usage"
availability: everywhere_usage
---

Use **Billing & Usage** (labeled **Billing** on some accounts) to monitor how your account is tracking against its usage on your current plan.

To view your plan's usage and included features:

1. From <Constant name="dbt" />, click your account name in the left side menu and select **Account settings**.
2. Under **Settings**, select **Billing & Usage** (labeled **Billing** on some accounts).
3. Open **Overview** if it appears.

### Usage notifications 

Every plan automatically sends email alerts when 75%, 90%, and 100% of usage estimates have been reached.
- Starter plan &mdash; All users within the Owner group receive alerts. 
- Enterprise-tier plans &mdash; All users with the Account Admin and Billing Admin [permission sets](/docs/platform/manage-access/enterprise-permissions#permission-sets) receive alerts. 

Users cannot opt out of these emails. To have additional users to receive these alert emails, assign them the applicable permissions mentioned earlier. Note that your usage may already be higher than the percentage indicated in the alert due to your usage pattern and minor latency times.

### How do I stop usage from accruing?

There are 2 options to disable models from being built and charged:

1. Open the **Job Settings** of every job and navigate to the **Triggers** section. Disable the **Run on Schedule** and set the **Continuous Integration** feature **Run on Pull Requests?**  to **No**. Check your workflows to ensure that you are not triggering any runs via the <Constant name="dbt" /> API. This option will enable you to keep your <Constant name="dbt" /> jobs without building more models. 
2. Alternatively, you can delete some or all of your <Constant name="dbt" /> jobs. This will ensure that no runs are kicked off, but you will permanently lose your job(s). 

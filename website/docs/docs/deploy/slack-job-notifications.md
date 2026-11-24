---
title: "dbt job notifications for Slack"
id: "slack-job-notifications"
description: "Connect dbt to Slack and send job run alerts to the public channels your team uses."
sidebar_label: "Slack job notifications"
availability: platform_login
---

Get job run updates from <Constant name="dbt_platform" /> in Slack. Choose which jobs to follow and send alerts to the public channels where your team works. Alerts show what happened and link to the run in <Constant name="dbt" />.

<Lightbox src="/assets/slack-job-alert.jpg" title="The dbt platform app reports a successful daily revenue refresh in Slack and links to the job run." width="592px" />

## Connect your Slack workspace

You need a <Constant name="dbt_platform" /> account and a Slack workspace that allows app installation. A <Constant name="dbt" /> account admin connects the workspace. Your workspace may also require approval from a Slack admin.

1. [Sign in to your dbt platform account](/docs/platform/about-platform/login).
2. Open **Account settings** and select **Integrations**.
3. In the **OAuth** section, select **Link** next to **Slack**.
4. In Slack, select your workspace, review the permissions, and select **Allow**.
5. When you return to **Integrations**, confirm that Slack shows your workspace name.

If your account already uses the legacy Slack integration, confirm that your Slack admin can approve the app before following the [migration steps](/docs/deploy/job-notifications#migrating-legacy-slack-notification-settings).

## Choose where alerts go

1. In <Constant name="dbt" />, open your profile menu and select **Notification settings**, then **Slack notifications**.
2. Select a public **Notification channel** and the **Environment** you want to monitor.
3. Select **Edit**. For each job you want to follow, choose **Succeeds**, **Warns**, **Fails**, or **Is canceled** to set which outcomes send alerts.
4. Select **Save**.

When a job reaches an outcome you selected, the <Constant name="dbt_platform" /> app posts to your channel. Open the run from the notification to see the results in <Constant name="dbt" />.

## Support and privacy

For more details, see [account-level Slack notifications](/docs/deploy/job-notifications#slack-notifications-account). If you need help, contact [dbt Support](/docs/dbt-support).

See the [Fivetran Privacy Notice](https://www.fivetran.com/legal/privacy) for information about how Fivetran handles personal data.

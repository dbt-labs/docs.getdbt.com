---
title: "Configuring notifications"
description: "Set up notifications in dbt Cloud to receive Email or Slack alerts for job run status."
---

### Overview

Setting up notifications in dbt Cloud will allow you to receive alerts via Email or a chosen Slack channel when a job run succeeds, fails, or is cancelled.

### Email

There are two options for setting up email notifications. As a **user**, you can set up email notifications for yourself under your Profile. As an **admin**, you can set up notifications on your team members' behalf.

* **As a user:** Navigate to your **Profile** (found in the top right-hand side of dbt Cloud) and select **Notifications**.
\
Next select **Edit** and select the type of Notification (Succeeds, Fails, or Is Cancelled) for each Job for which you would like to be notified.

* **As an admin:**  Navigate to Account Settings > Notifications.
Select the User you'd like to set notifications for. Select **Edit** and select the type of Notification (Succeeds, Fails, or Is Cancelled) for each Job for which they will be notified.

Finally press **Save**.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/email-notifications.png" title="Configuring Email Notifications"/>

### Slack

**Note**: Currently, Slack notifications can only be configured by one user to one Slack channel. Additionally, you must be an admin of the Slack workspace in order to configure Slack notifications.

In general, there are two parts to setting up Slack notifications. The first involves setting up the dbt Cloud integration with Slack, while the second involves setting up the notifications themselves.

### Setup the integration

1. Click the gear icon to the top right and select **Profile**.

2. Click **Integrations** to the left.

<Lightbox src="/img/docs/dbt-cloud/Navigate-to-integrations.png" title="Navigate to integrations"/>

3. Click **Link your Slack profile**

<Lightbox src="/img/docs/dbt-cloud/Link-your-Slack-Profile.png" title="Link your Slack profile"/>

Allow dbt Labs to access the Slack workspace. If you are a member of multiple, you can select the appropriate workspace from the dropdown menu in the top right corner.

<Lightbox src="/img/docs/dbt-cloud/Allow-dbt-to-access-slack.png" title="Allow dbt access to Slack"/>

### Configure the notifications

Open the main menu and click **Account Settings**.

Click **Notifications** from the left-hand menu and **Edit** from the top right-hand side of the notifications pane.

<Lightbox src="/img/docs/dbt-cloud/Navigate-to-notifications.png" title="Navigate to notifications"/>

3. You can find the Slack notification settings at the bottom of the page.

<Lightbox src="img/docs/dbt-cloud/Configure-Slack-notifications.png" title="Configure Slack notifications"/>

### Disable the Slack integration

To disable the integration entirely, navigate back to the Integrations page and click **Disconnect Account** in the Slack pane. Confirm the disconnect, and the option will revert to its original state.


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

<Snippet src="slack-notifications-config-steps" />

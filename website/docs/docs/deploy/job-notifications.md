---
title: "Job notifications"
id: "job-notifications"
description: "Set up notifications in dbt Cloud to receive Email or Slack alerts for job run status."
---

### Overview

Setting up notifications in dbt Cloud will allow you to receive alerts via Email or a chosen Slack channel when a job run succeeds, fails, or is cancelled.

### Email

There are two options for setting up email notifications. As a **user**, you can set up email notifications for yourself under your Profile. As an **admin**, you can set up notifications on behalf of your team members.

1. Click the gear in the top right and select **Notification settings**.

2. **As a user:** Select **Edit** and select the type of Notification (Succeeds, Fails, or Is Cancelled) for each Job for which you would like to be notified, or

    **As an admin:**  Select one or more users you'd like to set notifications for. If you only see your own name, then you might not have admin privileges. Select **Edit** and select the type of Notification (Succeeds, Fails, or Is Cancelled) for each Job for which they will be notified.

3. Click **Save**.
    <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/email-notifications.png" title="Configuring Email Notifications"/>

### Slack

<Snippet src="slack-notifications-config-steps" />

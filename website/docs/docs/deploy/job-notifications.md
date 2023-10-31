---
title: "Job notifications"
id: "job-notifications"
description: "Set up notifications in dbt Cloud to receive Email or Slack alerts for job run status."
---


Setting up notifications in dbt Cloud will allow you to receive alerts via Email or a chosen Slack channel when a job run succeeds, fails, or is cancelled.

### Email

These are the following options for setting up email notifications. Refer to [Users and licenses](/docs/cloud/manage-access/seats-and-users) for info on license types eligible for email notifications. 

- As a **user** &mdash; You can set up email notifications for yourself under your Profile.
- As an **admin** &mdash; You can set up notifications on behalf of your team members. 

To set up job notifications, follow these steps:

1. Click the gear menu in the top right corner and select **Notification Settings**.

2. Select **Edit** to begin editing the **Email Notifications** settings.
    - **As a user:** Choose the Notification type (Succeeds, Fails, or Is Cancelled) for each Job you want to receive notifications for.

    - **As an admin:**  Under **Configure notifications for**, use the dropdown to select one or more users you'd like to set notifications for. If you only see your own name, then you might not have admin privileges. <br /><br />
    Choose the Notification type (Succeeds, Fails, or Is Cancelled) for each Job you want them to receive notifications for.

3. Click **Save**.

    <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/email-notifications.png" width="75%" title="Configuring Email Notifications"/>

### Slack

<Snippet path="slack-notifications-config-steps" />

---
title: "Job notifications"
id: "job-notifications"
description: "Set up notifications in dbt Cloud to receive email or Slack alerts about job run status."
---

Set up notifications in dbt Cloud to receive email or Slack alerts when a job run succeeds, fails, or is cancelled.

## Email notifications

You can receive email alerts about jobs by configuring the dbt Cloud email notification settings.

### Prerequisites 
- You must be either a _developer user_ or an _account admin_ to configure email notifications in dbt Cloud. For more details, refer to [Users and licenses](/docs/cloud/manage-access/seats-and-users).
    - As a developer user, you can set up email notifications for yourself. 
    - As an account admin, you can set up notifications for yourself and other team members. 

### Configure email notifications

1. From the gear menu, choose **Notification settings**.
1. By default, dbt Cloud sends notifications to the email address that's in your **User profile** page.

    If you're an account admin, you can choose a different email address to receive notifications. Select the **Notification email** dropdown and choose another address from the list. The list includes **Internal Users** with access to the account and **External Emails** that have been added. 
    - To add an external email address, select the **Notification email** dropdown and choose **Add external email**. After you add the external email, it becomes available for selection in the **Notification email** dropdown list. External emails can be addresses that are outside of your dbt Cloud account and also for third-party integrations like [channels in Microsoft Teams](https://support.microsoft.com/en-us/office/tip-send-email-to-a-channel-2c17dbae-acdf-4209-a761-b463bdaaa4ca) and [PagerDuty email integration](https://support.pagerduty.com/docs/email-integration-guide).

    <Lightbox src="/img/docs/deploy/example-notification-external-email.png" width="50%" title="Example of the Notification email dropdown"/>

1. Select the **Environment** for the jobs you want to receive notifications about from the dropdown. 

1. Click **Edit** to configure the email notification settings. Choose one or more of the run statuses (**Succeeds**, **Fails**, **Is Canceled**) for each job you want to receive notifications about.

1. When you're done with the settings, click **Save**.

    As an account admin, you can add more email recipients by choosing another **Notification email** from the dropdown, **Edit** the job notification settings, and **Save** the changes.
    
    To set up alerts on jobs from a different environment, select another **Environment** from the dropdown, **Edit** those job notification settings, and **Save** the changes. 

    <Lightbox src="/img/docs/deploy/example-email-notification-settings-page.png" width="100%" title="Example of the Email notifications page"/>

### Unsubscribe from email notifications
1. From the gear menu, choose **Notification settings**.
1. On the **Email notifications** page, click **Unsubscribe from all email notifications**. 

## Slack notifications

See [Slack integration](/docs/cloud/slack-integration) for setup instructions before proceeding to the notification configuration. 

### Configure Slack notifications

1. From the gear menu, choose **Notification settings**. 
1. Select **Slack notifications** in the left sidebar. 
1. Select the **Notification channel** you want to receive the job run notifications from the dropdown. 
    <Lightbox src="/img/docs/deploy/example-notification-slack-channels.png" width="75%" title="Example of the Notification channel dropdown"/>
1. Select the **Environment** for the jobs you want to receive notifications about from the dropdown. 
1. Click **Edit** to configure the Slack notification settings. Choose one or more of the run statuses (**Succeeds**, **Fails**, **Is Canceled**) for each job you want to receive notifications about.
1. When you're done with the settings, click **Save**.
    
    To send alerts to another Slack channel, select another **Notification channel** from the dropdown, **Edit** those job notification settings, and **Save** the changes.

    To set up alerts on jobs from a different environment, select another **Environment** from the dropdown, **Edit** those job notification settings, and **Save** the changes.

    <Lightbox src="/img/docs/deploy/example-slack-notification-settings-page.png" width="100%" title="Example of the Slack notifications page"/>



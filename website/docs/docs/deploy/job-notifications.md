---
title: "Job notifications"
id: "job-notifications"
description: "Set up notifications in dbt Cloud to receive email or Slack alerts about job run status."
---


Set up notifications in dbt Cloud to receive email or Slack alerts about the status of a job run. You can choose to be notified by one or more of the following job run statuses: 

- **Succeeds** option &mdash; A job run completed successfully.
- **Warns** option &mdash; A job run encountered warnings from [tests](/docs/build/data-tests) or [source freshness](/docs/deploy/source-freshness) checks (if applicable).
- **Fails** option &mdash; A job run failed to complete. 
- **Is canceled** option &mdash; A job run is canceled.

## Email notifications

You can receive email alerts about jobs by configuring the dbt Cloud email notification settings.

### Prerequisites 
- You must be either a _developer user_ or an _account admin_ to configure email notifications in dbt Cloud. For more details, refer to [Users and licenses](/docs/cloud/manage-access/seats-and-users).
    - As a developer user, you can set up email notifications for yourself. 
    - As an account admin, you can set up notifications for yourself and other team members. 

### Configure email notifications

1. Select your profile icon and then click **Notification settings**.
1. By default, dbt Cloud sends notifications to the email address that's in your **User profile** page.

    If you're an account admin, you can choose a different email address to receive notifications. Select the **Notification email** dropdown and choose another address from the list. The list includes **Internal Users** with access to the account and **External Emails** that have been added. 
    - To add an external email address, select the **Notification email** dropdown and choose **Add external email**. After you add the external email, it becomes available for selection in the **Notification email** dropdown list. External emails can be addresses that are outside of your dbt Cloud account and also for third-party integrations like [channels in Microsoft Teams](https://support.microsoft.com/en-us/office/tip-send-email-to-a-channel-2c17dbae-acdf-4209-a761-b463bdaaa4ca) and [PagerDuty email integration](https://support.pagerduty.com/docs/email-integration-guide).

    <Lightbox src="/img/docs/deploy/example-notification-external-email.png" width="50%" title="Example of the Notification email dropdown"/>

1. Select the **Environment** for the jobs you want to receive notifications about from the dropdown. 

1. Click **Edit** to configure the email notification settings. Choose one or more of the run statuses for each job you want to receive notifications about.

1. When you're done with the settings, click **Save**.

    As an account admin, you can add more email recipients by choosing another **Notification email** from the dropdown, **Edit** the job notification settings, and **Save** the changes.
    
    To set up alerts on jobs from a different environment, select another **Environment** from the dropdown, **Edit** those job notification settings, and **Save** the changes. 

    <Lightbox src="/img/docs/deploy/example-email-notification-settings-page.png" width="100%" title="Example of the Email notifications page"/>

### Unsubscribe from email notifications
1. Select your profile icon and click on **Notification settings**.
1. On the **Email notifications** page, click **Unsubscribe from all email notifications**. 

## Slack notifications

You can receive Slack alerts about jobs by setting up the Slack integration and then configuring the dbt Cloud Slack notification settings. dbt Cloud integrates with Slack via OAuth to ensure secure authentication.

:::note 
If there has been a change in user roles or Slack permissions where you no longer have access to edit a configured Slack channel, please [contact support](mailto:support@getdbt.com) for assistance. 
:::

### Prerequisites 
- You must be a Slack Workspace Owner. 
- You must be an account admin to configure Slack notifications in dbt Cloud. For more details, refer to [Users and licenses](/docs/cloud/manage-access/seats-and-users).
- The integration only supports _public_ channels in the Slack workspace. 

### Set up the Slack integration

1. Select **Account settings** and then select **Integrations** from the left sidebar. 
1. Locate the **OAuth** section with the Slack application and click **Link**.
   <Lightbox src="/img/docs/dbt-cloud/Link-your-Slack-Profile.png" width="75%" title="Link for the Slack app"/>

#### Logged in to Slack
If you're already logged in to Slack, the handshake only requires allowing the app access. If you're a member of multiple workspaces, you can select the appropriate workspace from the dropdown menu in the upper right corner.
   <Lightbox src="/img/docs/dbt-cloud/Allow-dbt-to-access-slack.png" width="75%" title="Allow dbt access to Slack"/>

#### Logged out

If you're logged out or the Slack app/website is closed, you must authenticate before completing the integration.

1. Complete the field defining the Slack workspace you want to integrate with dbt Cloud.
    <Lightbox src="/img/docs/dbt-cloud/define-workspace.png" width="60%" title="Define the workspace"/>
2. Sign in with an existing identity or use the email address and password. 
3. Once you have authenticated successfully, accept the permissions.
    <Lightbox src="/img/docs/dbt-cloud/accept-permissions.png" width="65%" title="Allow dbt access to Slack"/>

### Configure Slack notifications

1. Select your profile icon and then click on **Notification settings**. 
1. Select **Slack notifications** in the left sidebar. 
1. Select the **Notification channel** you want to receive the job run notifications from the dropdown. 
    <Lightbox src="/img/docs/deploy/example-notification-slack-channels.png" width="100%" title="Example of the Notification channel dropdown"/>
1. Select the **Environment** for the jobs you want to receive notifications about from the dropdown. 
1. Click **Edit** to configure the Slack notification settings. Choose one or more of the run statuses for each job you want to receive notifications about.
1. When you're done with the settings, click **Save**.
    
    To send alerts to another Slack channel, select another **Notification channel** from the dropdown, **Edit** those job notification settings, and **Save** the changes.

    To set up alerts on jobs from a different environment, select another **Environment** from the dropdown, **Edit** those job notification settings, and **Save** the changes.

    <Lightbox src="/img/docs/deploy/example-slack-notification-settings-page.png" width="100%" title="Example of the Slack notifications page"/>

### Disable the Slack integration

1. Select **Account settings** and on the **Integrations** page, scroll to the **OAuth** section.
1. Click the trash can icon (on the far right of the Slack integration) and click **Unlink**. Channels that you configured will no longer receive Slack notifications. _This is not an account-wide action._ Channels configured by other account admins will continue to receive Slack notifications if they still have active Slack integrations. To migrate ownership of a Slack channel notification configuration, have another account admin edit their configuration.

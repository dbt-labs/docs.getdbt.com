---
title: "Job notifications"
id: "job-notifications"
description: "Set up notifications in dbt Cloud to receive email or Slack alerts about job run status."
---

Set up notifications in dbt Cloud to receive email or Slack alerts when a job run succeeds, fails, or is cancelled.

## Email notifications

You can receive email alerts by configuring the dbt Cloud notification settings. As a **user**, you can set up email notifications for yourself. As an **admin**, you can set up notifications for yourself and other team members. Refer to [Users and licenses](/docs/cloud/manage-access/seats-and-users) for details on license types that are eligible for email notifications.

### Configure email notifications

1. From the gear menu in the upper right corner, choose **Notification settings**.
1. By default, the **Notification email** option is set to the email address that's in [your dbt Cloud personal profile](https://cloud.getdbt.com/settings/profile). 

    If you're an **admin**, you can choose a different email address. Select the **Notification email** dropdown and choose another address from the list. The list includes internal users with access to the account and also external emails that have been added. 
    - To add an external email address, select the **Notification email** dropdown and choose **Add external email**. After you add the external email, it becomes available for selection in the **Notification email** dropdown list.

    <Lightbox src="/img/docs/deploy/example-notification-external-email.png" width="50%" title="Example of the Notification email dropdown"/>

1. Select the **Environment** (in the dropdown) for the jobs you want to receive notifications about. 

1. Click **Edit** to configure the email notification settings.

    - If you're a **user**, choose one or more of the run statuses (**Succeeds**, **Fails**, **Is Canceled**) for each job you want to receive notifications for.

    - If you're an **admin**, use the **Configure notifications for** dropdown to select all the users you want to sent notifications to. Then, choose one or more of the run statuses (**Succeeds**, **Fails**, **Is Canceled**) for each job you want them to receive notifications for.

1. When you're done with the settings, click **Save**.
    
    To set up alerts on jobs from a different environment, select another **Environment** from the dropdown, **Edit** those job notification settings, and click **Save**.

    <Lightbox src="/img/docs/deploy/example-email-notification-settings-page.png" width="100%" title="Example of the Email notifications page"/>

### Unsubscribe from email notifications
1. From the gear menu in the upper right corner, choose **Notification settings**.
1. On the **Email notifications** page, click **Unsubscribe from all email notifications**. 

## Slack notifications

You can receive Slack alerts by setting up the Slack integration first, then configuring the dbt Cloud notification settings.

:::note 
If there have been changes to the user roles and you need to move ownership, please [contact support](mailto:support@getdbt.com) and provide the necessary information for them to make this change for you.
:::

### Prerequisites 
- You must be an administrator of the Slack workspace to configure Slack notifications in dbt Cloud. 

### Set up the Slack integration

1. Go to your [Personal profile](https://cloud.getdbt.com/settings/profile) page and scroll to the **Linked accounts** section.
1. In the **Linked accounts** section, find the Slack application and click **Link**.
   <Lightbox src="/img/docs/dbt-cloud/Link-your-Slack-Profile.png" width="75%" title="Link for the Slack app"/>
1. Allow dbt Labs to access the Slack workspace. If you are a member of multiple workspaces, you can select the appropriate workspace from the dropdown menu in the upper right corner.
   <Lightbox src="/img/docs/dbt-cloud/Allow-dbt-to-access-slack.png" width="75%" title="Allow dbt access to Slack"/>

### Configure Slack notifications

1. From the gear menu in the upper right corner, choose **Notification settings**. 
1. Select **Slack notifications** in the left sidebar. 
1. Select the **Notification channel** (in the dropdown) you want to send the job run notifications to. 
    <Lightbox src="/img/docs/deploy/example-notification-slack-channels.png" width="75%" title="Example of the Notification channel dropdown"/>
1. Select the **Environment** (in the dropdown) for the jobs you want to receive notifications about. 
1. Click **Edit** to configure the Slack notification settings. Choose one or more of the run statuses (**Succeeds**, **Fails**, **Is Canceled**) for each job you want to receive notifications for.
1. When you're done with the settings, click **Save**.
    
    To send alerts to another Slack channel, select another **Notification channel** from the dropdown, **Edit** those job notification settings, and click **Save**.

    <Lightbox src="/img/docs/deploy/example-slack-notification-settings-page.png" width="100%" title="Example of the Slack notifications page"/>

### Disable the Slack integration

1. Go to your [Personal profile](https://cloud.getdbt.com/settings/profile) page and scroll to the **Linked accounts** section.
1. Find the Slack application in the **Linked accounts** section, click the trash can icon, and click **Unlink**. The Slack notification settings are no longer active.
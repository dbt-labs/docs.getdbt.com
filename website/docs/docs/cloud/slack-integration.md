--- 
title: "Integrate with Slack for job notifications"
id: slack-integration
description: "Integrate with Slack for job notifications in dbt Cloud" 
pagination_prev: null
---

You can receive Slack alerts about jobs by setting up the Slack integration, then configuring the dbt Cloud Slack notification settings. dbt Cloud integrates with Slack via OAuth to ensure secure authentication.

:::note 
If there has been a change in user roles or Slack permissions where you no longer have access to edit a configured Slack channel, please [contact support](mailto:support@getdbt.com) for assistance. 
:::

### Prerequisites 
- You must be an administrator of the Slack workspace. 
- You must be an account admin to configure Slack notifications in dbt Cloud. For more details, refer to [Users and licenses](/docs/cloud/manage-access/seats-and-users).
- The integration only supports _public_ channels in the Slack workspace. 

### Set up the Slack integration

1. From the gear menu, select **Account settings** and select **Integrations** from the left navigation pane. 
1. Locate the **OAuth** section with the Slack application and click **Link**.
   <Lightbox src="/img/docs/dbt-cloud/Link-your-Slack-Profile.png" width="75%" title="Link for the Slack app"/>

### Logged in to Slack
If you are already logged in to Slack, the handover will only require allowing the app access. If you are a member of multiple workspaces, you can select the appropriate workspace from the dropdown menu in the upper right corner.
   <Lightbox src="/img/docs/dbt-cloud/Allow-dbt-to-access-slack.png" width="75%" title="Allow dbt access to Slack"/>

## Logged out

If you are logged out or the Slack app/website is closed, you will need to authenticate before completing the integraion.

1. Complete the field defining the Slack workspace you want to integrate with dbt Cloud.
    <Lightbox src="/img/docs/dbt-cloud/define-workspace.png" width="75%" title="Define the workspace"/>
2. Sign in with an existing identity or use email address and password. 
3. Once you have authenticated successfully, accept the permissions.
    <Lightbox src="/img/docs/dbt-cloud/accept-permissions.png" width="75%" title="Allow dbt access to Slack"/>

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

### Disable the Slack integration

1. From the gear menu, select **Account settings**. On the **Integrations** page, scroll to the **OAuth** section.
1. Click the trash can icon to the right of the Slack integration, and click **Unlink**. Channels that you configured will no longer receive Slack notifications. _This is not an account-wide action._ Channels configured by other account admins will continue to receive Slack notifications if they still have active Slack integrations. To migrate ownership of a Slack channel notification configuration, have another account admin edit their configuration.
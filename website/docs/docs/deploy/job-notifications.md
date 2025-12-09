---
title: "Job notifications"
id: "job-notifications"
description: "Set up notifications in dbt to receive email or Slack alerts about job run status."
---

Set up notifications in <Constant name="cloud" /> to receive [email](#email-notifications), [Slack](#slack-notifications), or [Microsoft Teams](#microsoft-teams-notifications) alerts about the status of a job run. You can choose to be notified by one or more of the following job run statuses: 

- **Succeeds** option &mdash; A job run completed successfully with no warnings or errors.
- **Warns** option &mdash; A job run encountered warnings from [data tests](/docs/build/data-tests) or [source freshness](/docs/deploy/source-freshness) checks (if applicable).
- **Fails** option &mdash; A job run failed to complete. 
- **Is canceled** option &mdash; A job run is canceled.

## Email notifications

You can receive email alerts about jobs by configuring the <Constant name="cloud" /> email notification settings.

### Prerequisites 
- You must be either a _developer user_ or an _account admin_ to configure email notifications in <Constant name="cloud" />. For more details, refer to [Users and licenses](/docs/cloud/manage-access/seats-and-users).
    - As a developer user, you can set up email notifications for yourself. 
    - As an account admin, you can set up notifications for yourself and other team members. 

### Configure email notifications

1. Select your profile icon and then click **Notification settings**. 
2. By default, <Constant name="cloud" /> sends notifications to the email address that's in your **User profile** page.

    If you're an account admin, you can choose a different email address to receive notifications:
    1. Under Job notifications, click the **Notification email** dropdown.
    2. Select another address from the list.
       The list includes **Internal Users** with access to the account and **External Emails** that have been added.  
    3. To add an external email address, click the **Notification email** dropdown
    4. Click **Add external email**.
    5. Enter the email address, and click Add user.
       After adding an external email, it becomes available for selection in the **Notification email** dropdown list. External emails can be addresses that are outside of your <Constant name="cloud" /> account and also for third-party integrations like [channels in Microsoft Teams](https://support.microsoft.com/en-us/office/tip-send-email-to-a-channel-2c17dbae-acdf-4209-a761-b463bdaaa4ca) and [PagerDuty email integration](https://support.pagerduty.com/docs/email-integration-guide).
       :::note
       External emails and their notification settings persist until edited or removed even if you remove the admin who added them from the account.
       :::

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

You can receive Slack alerts about jobs by setting up the Slack integration and then configuring the <Constant name="cloud" /> Slack notification settings. <Constant name="cloud" /> integrates with Slack via OAuth to ensure secure authentication.

:::note 
Virtual Private Cloud (VPC) admins must [contact support](mailto:support@getdbt.com) to complete the Slack integration.

If there has been a change in user roles or Slack permissions where you no longer have access to edit a configured Slack channel, please [contact support](mailto:support@getdbt.com) for assistance. 
:::

### Prerequisites 
- You must be a Slack Workspace Owner. 
- You must be an account admin to configure Slack notifications in <Constant name="cloud" />. For more details, refer to [Users and licenses](/docs/cloud/manage-access/seats-and-users).
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

1. Complete the field defining the Slack workspace you want to integrate with <Constant name="cloud" />.
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

## Microsoft Teams notifications <Lifecycle status="beta" />

:::info
Configuring Microsoft Teams notifications is currently in beta. To request access, contact dbt Support or your account manager.
:::

You can receive Microsoft Teams alerts for your dbt jobs by connecting your Teams account to the <Constant name="dbt_platform" />, and configuring your notification preferences. 

dbt integrates with Teams through Microsoft Entra to provide secure authentication.

### Prerequisites

Before you begin:
- You must have a <Constant name="dbt_platform" /> account.
- Contact dbt Support or your account manager to request access.
- Make sure you have permission to view the **Account integrations** and **Job notifications** pages in <Constant name="dbt_platform" />.

### Set up Microsoft Teams
To enable Microsoft Teams job notifications, complete the following sections:
 
1. [Link dbt platform account to Teams](#link-dbt-platform-account-to-teams) &mdash; A user-level connection that links an individual <Constant name="dbt_platform" /> account (or a dedicated service account) to a Microsoft Teams user profile within your tenant.
2. [Configure Teams notifications](#configure-teams-notifications) &mdash; Configures which Teams channels receive job notifications.
3. [Disable the Teams integration](#disable-the-teams-integration) (optional) &mdash; Remove or reset the connection between <Constant name="dbt_platform" /> and Microsoft Teams.


#### Link dbt platform account to Teams

:::info
You can link any Teams user account from your tenant, but we recommend creating a dedicated account just for posting dbt notifications.
During the OAuth process, you’ll need to sign in to a Microsoft account to complete the integration.
- If you’re logged into a single Microsoft account, the integration will complete automatically.
- If you’re logged into multiple accounts (or none), you’ll be prompted to select or log in to one.


<Expandable alt_header="Image of the Microsoft account selection popup">
<Lightbox src="/img/docs/deploy/pick-account.png" width="50%" title="Photo example of the Microsoft account popup"/>
</Expandable>
:::

To link your <Constant name="dbt_platform" /> account to Microsoft Teams:
1. In <Constant name="dbt_platform" />, go to the **Account settings** page by clicking on your account name and selecting **Account settings**.
2. In the left sidebar, select **Integrations**.
3. Scroll to the **OAuth** section.
4. Next to **Teams** and click on the **Link** button.
5. After doing this, you’ll either be prompted to choose your Microsoft account before completing the setup, or return directly to the <Constant name="dbt_platform" /> with your Teams profile linked. 
6. Your <Constant name="dbt_platform" /> account is now linked to Microsoft Teams! 

dbt will now add the **dbt-cloud-integration app** to your Microsoft Entra tenant. This app manages authentication requests and permissions securely.

<Lightbox src="/img/docs/deploy/dbt-cloud-integrations.png" width="100%" title="Example of the dbt-cloud-integration app overview"/>

- The current Entra app permissions are:
	- `profile`
  - `openid`
  - `offline_access`
  - `Team.ReadBasic.All`
  - `TeamsActivity.Send`
  - `ChannelMessage.Send`
  - `ChannelMessage.Read.All`
  - `Channel.ReadBasic.All`

#### Configure Teams notifications

Once you’ve connected <Constant name="dbt_platform" /> and Teams, you can now configure which Teams channels receive job notifications. The **Teams notifications** menu requires that you have an active integration with Teams on the account.

:::info
Currently, dbt only sends notifications to Teams channels (standard, shared, or private) that you belong to.
:::

1. In the <Constant name="dbt_platform" />, click your profile icon and select **Notification settings**.
2. Select **Teams notifications** in the left sidebar.
3. From the dropdown, select the **Notification team** that you want to send notifications to.
4. Select the **Notification channel** you want to send notifications to.
   - d<Constant name="dbt_platform" /> only sends notifications to Teams channels (standard, shared, or private) that _you_ belong to.
5. In the dropdown, choose the environment for the jobs you want to receive notifications about. 
6. Click **Edit** on the top right to configure the Teams job notification settings and customize which job statuses trigger job notifications.
7. When finished, click **Save**.

Your Teams channel is now set up to receive dbt job notifications!

<Lightbox src="/img/docs/deploy/configure-teams-notification.png" width="100%" title="Example of the configure Teams notification page"/>

#### Disable the Teams integration

Disabling and unlinking the Teams integration in the <Constant name="dbt_platform" /> removes it for the entire account. To disable it:

1. In the <Constant name="dbt_platform" />, go to **Account settings**. 
2. Click on **Integrations** and scroll down to **OAuth**.
3. On the far right of the **Teams** integration, click the **X** icon.
4. Confirm the unlinking by selecting **Unlink**.

The Teams integration has been disabled.

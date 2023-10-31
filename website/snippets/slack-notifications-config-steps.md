Setting up Slack notifications in dbt Cloud enables you to receive alerts in a chosen Slack channel when a job run succeeds, fails, or is cancelled.

:::info Note
Currently, Slack notifications can only be configured by one user to one Slack channel. Additionally, you must be an admin of the Slack workspace in order to configure Slack notifications. 

If there have been changes to the user roles and you need to move ownership, please reach out to support@getdbt.com and provide the support team with the necessary information needed to make this change for you.
:::
### Setup the integration

1. Click the gear in the top right and select **Profile**.
2. Click **Integrations**  to the left.
    <Lightbox src="/img/docs/dbt-cloud/Navigate-to-integrations.png" width="75%" title="Navigate to integrations"/>
3. Click **Link your Slack profile**
   <Lightbox src="/img/docs/dbt-cloud/Link-your-Slack-Profile.png" width="75%" title="Link your Slack profile"/>
4. Allow dbt Labs to access the Slack workspace. If you are a member of multiple, you can select the appropriate workspace from the dropdown menu in the top right corner.
   <Lightbox src="/img/docs/dbt-cloud/Allow-dbt-to-access-slack.png" width="75%" title="Allow dbt access to Slack"/>

### Configure the notifications

1. Click the gear in the top right and select **Account Settings**.
2. Click **Slack Notifications** to the left and click **Edit** to the right.
   <Lightbox src="/img/docs/dbt-cloud/Navigate-to-notifications.png" width="75%" title="Navigate to notifications"/>
3. You can find the Slack notification settings at the bottom of the page.

### Disabling the Slack integration

To disable the integration entirely, navigate back to the Integrations page and click **Disconnect Account** in the Slack pane. Confirm the disconnect, and the option will revert to its original state.


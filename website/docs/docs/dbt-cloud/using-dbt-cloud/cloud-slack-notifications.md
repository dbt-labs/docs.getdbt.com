---
title: "Configuring Slack notifications"
description: "Report status alerts in a designated Slack channel every time you run a job."
---

Setting up Slack notifications in dbt Cloud will allow you to receive alerts in a chosen Slack channel when a job run succeeds, fails, or is cancelled.

### Setup the integration

Click on your profile in the top right corner of the dbt Cloud UI and click **Profile**.

Click **Integrations** on the left-hand side menu.

<Lightbox src="/img/docs/dbt-cloud/Navigate-to-integrations.png" title="Navigate to integrations"/>

3. Click **Link your Slack profile**

<Lightbox src="/img/docs/dbt-cloud/Link-your-Slack-Profile.png" title="Link your Slack profile"/>

4. Allow dbt Labs to access the Slack workspace. If you are a member of multiple, you can select the appropriate workspace from the dropdown menu in the top right corner.

<Lightbox src="/img/docs/dbt-cloud/Allow-dbt-to-access-slack.png" title="Allow dbt access to Slack"/>

### Configure the notifications

Open the main menu and click **Account Settings**.

Click **Notifications** from the left-hand menu and **Edit** from the top right-hand side of the notifications pane.

<Lightbox src="/img/docs/dbt-cloud/Navigate-to-notifications.png" title="Navigate to notifications"/>

Slack notification settings will be towards the bottom of the page (you may have to scroll down).


### Disabling the Slack integration

To disable the integration entirely, navigate back to the Integrations page and click **Disconnect Account** in the Slack pane. Confirm the disconnect, and the option will revert to its original state.

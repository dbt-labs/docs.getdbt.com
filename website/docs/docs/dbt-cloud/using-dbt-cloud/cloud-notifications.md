---
title: "Configuring Notifications"
---

### Overview

Setting up notifications in dbt Cloud will allow you to receive alerts via Email or a chosen Slack channel when a job run succeeds, fails, or is cancelled.

### Email

To set up email noticiations first navigate to your **Profile** (found in the top right hand side of dbt Cloud) and the select **Notifications**.

Next select **Edit** and select the type of Notification (Succeeds, Fails or Is Cancelled) for each Job for which you woud like to be notified.

Finally press **Save**.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/email-notifications.png" title="Configuring Email Notifications"/>

### Slack

**Note**: Currently, Slack notifications can only be configured by one user to one Slack channel. Additionally, you must be an admin of the Slack workspace in order to configure Slack notifications.

In general, there are two parts to setting up Slack notifications. The first involves setting up the dbt Cloud integration with Slack, while the second involves setting up the notifications themselves.

 - If you **haven't** set up the integration: Watch the entire video below!

 - If you **have** set up the integration: Feel free to skip ahead to 0:40 in the video.

 <LoomVideo id="80f368e6d03d483282970b2cbc4abf78" />
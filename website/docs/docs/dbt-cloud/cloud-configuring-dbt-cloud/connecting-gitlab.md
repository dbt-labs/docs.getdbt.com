---
title: "Connecting your GitLab Account"
id: "connecting-gitlab"
sidebar_label: "Connecting your GitLab Account"
---

:::info Enterprise Feature

This guide describes a feature of the dbt Cloud Enterprise plan. If you’re interested in learning more about an Enterprise plan, let us know at sales@getdbt.com.

:::

## Overview

Connecting your GitLab account to dbt Cloud unlocks exciting and compelling functionality in dbt Cloud. Once your GitLab account is connected, you can:
- trigger CI builds when Pull Requests are opened in GitLab!
- log into dbt Cloud via oauth through GitLab!
- add new repos to Cloud in a single click!
- and more!

## Linking dbt Cloud to your GitLab account

To link your dbt Cloud account to your GitLab account, navigate to your Account Settings and click the Integrations tab. 

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/gitlab_navigation_setup.gif" title="Like so!"/>

Here you can link your GitLab account to dbt Cloud. 

You'll need to set up an application at GitLab in order to make it official - [they have a guide for that here](https://docs.gitlab.com/ee/integration/oauth_provider.html#adding-an-application-through-the-profile)! For your dbt Cloud application, you'll want to check the `api` scope level.

Once you've gotten your Application ID and Secret from GitLab, you can click the Edit button in your Integrations tab, and copy-paste those values into the form.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/gitlab_integration_edit_button.png" title="This button!"/>

GitLab will then ask for your explicit approval:

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/gitlab_application_auth.png"/>

And then you're all set!

## Usage Notes

Note that only the GitLab admin who sets up new dbt Cloud projects needs to connect their GitLab account. It’s not necessary for every dbt Cloud user to connect GitLab (but it can be convenient to do so!)

## Connect your personal GitLab account

To connect your personal GitLab account, navigate to your [User Profile](https://cloud.getdbt.com/#/profile/) select the [Integrations section](https://cloud.getdbt.com/#/profile/integrations/) from the left sidebar. Under "GitLab", if your account is already connected, you’ll see "Your user account is linked to a GitLab account with username &lt;your-gitlab-username&gt;."

If your account is not connected, you’ll see "This account is not linked to a GitLab account.” Click the button to begin the setup process. You’ll be redirected to GitLab, and then back into dbt Cloud. When you are redirected to dbt Cloud, you should now see your connected account. 
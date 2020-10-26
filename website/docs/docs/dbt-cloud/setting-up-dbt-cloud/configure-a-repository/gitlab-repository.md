---
title: "Connecting your GitLab Account"
id: "connecting-gitlab"
sidebar_label: "GitLab"
---

:::info Enterprise Feature

This guide describes a feature of the dbt Cloud Enterprise plan. If you’re interested in learning more about an Enterprise plan, let us know at sales@getdbt.com.

:::

## Overview

Once your GitLab account is connected, you can:
- Import new repos with one click
- Carry GitLab permissions through to dbt cloud IDE driven git actions

## Linking dbt Cloud to your GitLab account

To link your dbt Cloud account to your GitLab account:
1. Click the hamburger menu in the upper left hand corner of your screen.
2. Select Account Settings
2. Click into the Integrations tab.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/gitlab_navigation_setup.gif" title="Navigating to the GitLab Integration"/>

Here you can link your GitLab account to dbt Cloud.

You'll need to set up an application at GitLab in order to make it official - [they have a guide for that here](https://docs.gitlab.com/ee/integration/oauth_provider.html#adding-an-application-through-the-profile).

For your dbt Cloud application, you'll want to select:
- `Name` - We recommend `dbt Cloud`
- `Redirect URI` - You will want to copy-paste this from your Account Integrations page
- Check the `Confidential` box
- Check the `api` Scope

The screen at GitLab should look something like this:

<Lightbox src="/img/docs/dbt-cloud/dbt_cloud_gitlab_application_settings.png" title="Add New Application Screen at GitLab"/>

Once you've gotten your Application ID and Secret from GitLab, you can click the Edit button in your Integrations tab, and copy-paste those values into the form.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/gitlab_integration_edit_button.png" title="Edit button in the top right corner"/>

Note that if you're using the regular consumer version of GitLab, you'll want to use the standard `https://gitlab.com` for your GitLab instance - if your organization is using a hosted version of GitLab, you'll want to use the hostname provided by your organization, probably something like `https://gitlab.yourgreatcompany.com/`

GitLab will then ask for your explicit approval:

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/gitlab_application_auth.png" title="GitLab Authorization Screen" />

And then you're all set!

## Usage Notes

Note that only Admins and dbt Developers working in the IDE need to connect their GitLab accounts. It’s not necessary for every dbt Cloud user to connect GitLab.

If your dbt Project is connected to your organization's GitLab repo, you'll be prompted to also connect your personal GitLab account before you're able to use the Cloud IDE:

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/gitlab_personal_auth.png" title="GitLab Authentication Required" />

You can click the Authenticate button to begin the process, or follow the instructions below.

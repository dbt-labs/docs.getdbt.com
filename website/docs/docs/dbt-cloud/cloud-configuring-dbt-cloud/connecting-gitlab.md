---
title: "Connecting your GitLab Account"
id: "connecting-gitlab"
sidebar_label: "Connecting GitLab"
---

:::info Enterprise Feature

This guide describes a feature of the dbt Cloud Enterprise plan. If you’re interested in learning more about an Enterprise plan, let us know at sales@getdbt.com.

:::

## Overview

Once your GitLab account is connected, you can:
- Import new repos with one click
- Carry GitLab permissions through to dbt cloud IDE driven git actions

## Linking dbt Cloud to your GitLab account

To link your dbt Cloud account to your GitLab account, navigate to your Account Settings and click the Integrations tab. 

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

## Connect your personal GitLab account

To connect your personal GitLab account, navigate to your [User Profile](https://cloud.getdbt.com/#/profile/) select the [Integrations section](https://cloud.getdbt.com/#/profile/integrations/) from the left sidebar. Under "GitLab", if your account is already connected, you’ll see "Your user account is linked to a GitLab account with username &lt;your-gitlab-username&gt;."

If your account is not connected, you’ll see "This account is not linked to a GitLab account.” Click the button to begin the setup process. You’ll be redirected to GitLab, and then back into dbt Cloud. When you are redirected to dbt Cloud, you should now see your connected account. 

## Troubleshooting

### Errors importing a repository
If you do not see your repository listed, double-check that:
- Your repository is in a Gitlab group you have access to

If you do see your repository listed but after selecting it, it's stuck loading/errors, double-check that:
- You are a maintainer on that repository (only users with a maintainer or owner permissions can set up repository connections


---
title: "Connecting your GitLab Account"
id: "connecting-gitlab"
sidebar_label: "Connecting GitLab"
---

## Overview

Connecting your GitLab account to dbt Cloud unlocks exciting and compelling functionality in dbt Cloud. Once your GitLab account is connected, you can:
- [Trigger CI builds](cloud-enabling-continuous-integration-with-github) when Merge Requests are opened in GitLab
- Import new repos with one click
- Carry GitLab permissions through to dbt Cloud IDE's git actions

## Linking dbt Cloud to your GitLab account

To link your dbt Cloud account to your GitLab account, navigate to your Account Settings and click the Integrations tab. 

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/gitlab_navigation_setup.gif" title="Navigating to the GitLab Integration"/>


You'll first need to set up a Group Owned Application in GitLab - [GitLab has a guide for that here](https://docs.gitlab.com/ee/integration/oauth_provider.html#group-owned-applications). 

In GitLab, when creating your dbt Cloud application, input the following:
- `Name` - We recommend `dbt Cloud`
- `Redirect URI` - You should copy-paste this from your Account Integrations page in dbt Cloud, but it is likely `https://cloud.getdbt.com/complete/gitlab`
- Check the `Confidential` box
- Check the `api` Scope

The application form in GitLab should look like this:

<Lightbox src="/img/docs/dbt-cloud/connecting-gitlab/GitLab-Group-App.png" title="GitLab group owned applications set up"/>

Click `Save application` in GitLab, and GitLab will then generate an Application ID and Secret. You can copy-paste those values back into the form on your dbt Cloud's Integrations page.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/gitlab_integration_edit_button.png" title="Edit button in the top right corner"/>

Note that if you're using the regular consumer version of GitLab, you'll want to use the standard `https://gitlab.com` for your GitLab instance - if your organization is using a hosted version of GitLab, you'll want to use the hostname provided by your organization: `https://gitlab.yourgreatcompany.com/`.

Once the form is complete in dbt Cloud, click the button `Connect to GitLab`.

GitLab will then ask for your explicit authorization: 

<Lightbox src="/img/docs/dbt-cloud/connecting-gitlab/GitLab-Auth.png" title="GitLab Authorization Screen" />

And then you're all set!

## Usage Notes

Note that only Admins working in the IDE need to connect their GitLab accounts. It’s not necessary for every dbt Cloud user to connect GitLab.

If your dbt Project is connected to your organization's GitLab repo, you'll be prompted to also connect your personal GitLab account before you're able to use the Cloud IDE:

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/gitlab_personal_auth.png" title="GitLab Authentication Required" />

You can click the Authenticate button to begin the process or follow the instructions below.

## Connect your personal GitLab account

To connect your personal GitLab account, navigate to your [User Profile](https://cloud.getdbt.com/#/profile/) select the [Integrations section](https://cloud.getdbt.com/#/profile/integrations/) from the left sidebar. Under "GitLab", if your account is already connected, you’ll see "Your user account is linked to &lt;your-gitlab-username&gt;."
<Lightbox src="/img/docs/dbt-cloud/connecting-gitlab/connected.png" title="GitLab connected" />

If your account is not connected, you’ll see "This account is not linked to a GitLab account.” Click the button to complete the setup process. 
<Lightbox src="/img/docs/dbt-cloud/connecting-gitlab/not-connected.png" title="GitLab not connected" />

## Troubleshooting

### Errors importing a repository
If you do not see your repository listed, double-check that:
- Your repository is in a Gitlab group you have access to

If you do see your repository listed but are unable to import the repository successfully, double-check that:
- You are a maintainer on that repository (only users with maintainer permissions can set up repository connections)

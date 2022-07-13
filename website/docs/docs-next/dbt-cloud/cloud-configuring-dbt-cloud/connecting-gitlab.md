---
title: "Connecting your GitLab Account"
id: "connecting-gitlab"
sidebar_label: "Connecting GitLab"
---

## Overview

Connecting your GitLab account to dbt Cloud unlocks exciting and compelling functionality in dbt Cloud. Once your GitLab account is connected, you can:
- [Trigger CI builds](cloud-enabling-continuous-integration-with-github) when Merge Requests are opened in GitLab.
- Import new repos with one click
- Carry GitLab user permissions through to dbt Cloud IDE's git actions.
## For Developer and Team tiers

To connect your personal GitLab account, navigate to your [Profile](https://cloud.getdbt.com/#/profile/) and select [Integrations](https://cloud.getdbt.com/#/profile/integrations/) from the left sidebar. 

If your account is not connected, click the button `Link your GitLab account` to continue the setup process. 
<Lightbox src="/img-next/docs/dbt-cloud/connecting-gitlab/not-connected.png" title="Link your GitLab" />

You should be redirected to GitLab and prompted to sign into your account. GitLab will then ask for your explicit authorization: 

<Lightbox src="/img-next/docs/dbt-cloud/connecting-gitlab/GitLab-Auth.png" title="GitLab Authorization Screen" />

Once you've accepted, you should be redirected back to dbt Cloud, and you'll see that your account has been linked.

<Lightbox src="/img-next/docs/dbt-cloud/connecting-gitlab/connected.png" title="GitLab connected" />

Now that you've linked to your account from your Profile page, you should verify that your Project Settings page also shows your deploy token. 

## For Enterprise tier

Before developers can personally authenticate in GitLab, account admins need to set up a GitLab application.

Account admins should navigate to `Account Settings` and click on the `Integrations` tab. 

<Lightbox src="/img-next/docs/dbt-cloud/cloud-configuring-dbt-cloud/gitlab_navigation_setup.gif" title="Navigating to the GitLab Integration"/>


Admins can create a Group Owned Application in GitLab - [GitLab has a guide for that here](https://docs.gitlab.com/ee/integration/oauth_provider.html#group-owned-applications). 

In GitLab, when creating your Group Owned Application, input the following:
- `Name` - We recommend `dbt Cloud`
- `Redirect URI` - You should copy-paste this from your Account Integrations page in dbt Cloud, but it is likely `https://cloud.getdbt.com/complete/gitlab`
- Check the `Confidential` box
- Check the `api` Scope

The application form in GitLab should look like this:

<Lightbox src="/img-next/docs/dbt-cloud/connecting-gitlab/GitLab-Group-App.png" title="GitLab group owned applications set up"/>

Click `Save application` in GitLab, and GitLab will then generate an Application ID and Secret. You can copy-paste those values back into the form on your dbt Cloud's Integrations page.

<Lightbox src="/img-next/docs/dbt-cloud/cloud-configuring-dbt-cloud/gitlab_integration_edit_button.png" title="Edit button in the top right corner"/>

Note that if you're using the regular consumer version of GitLab, you'll want to use the standard `https://gitlab.com` for your GitLab instance - if your organization is using a hosted version of GitLab, you'll want to use the hostname provided by your organization: `https://gitlab.yourgreatcompany.com/`.

Once the form is complete in dbt Cloud, click the button `Connect to GitLab`.

GitLab will then ask for your explicit authorization: 

<Lightbox src="/img-next/docs/dbt-cloud/connecting-gitlab/GitLab-Auth.png" title="GitLab Authorization Screen" />

And you're all set!

Non-admins on Enterprise accounts can authenticate by going to `Profile` and then `Integrations` and clicking the `Link your GitLab account` button.

<Lightbox src="/img-next/docs/dbt-cloud/connecting-gitlab/not-connected.png" title="Link your GitLab" />


## Troubleshooting

### Errors importing a repository
If you do not see your repository listed, double-check that:
- Your repository is in a Gitlab group you have access to. dbt Cloud will not read repos associated with a user.

If you do see your repository listed but are unable to import the repository successfully, double-check that:
- You are a maintainer on that repository (only users with maintainer permissions can set up repository connections)

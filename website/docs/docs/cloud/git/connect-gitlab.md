---
title: "Connect to GitLab"
description: "Learn how connecting your GitLab account provides convenience and another layer of security to dbt Cloud."
id: "connect-gitlab"
---


Connecting your GitLab account to dbt Cloud provides convenience and another layer of security to dbt Cloud:
- Import new GitLab repos with a couple clicks during dbt Cloud project setup.
- Clone repos using HTTPS rather than SSH.
- Carry GitLab user permissions through to dbt Cloud IDE's git actions.
- Trigger [Continuous integration](/docs/deploy/continuous-integration) builds when merge requests are opened in GitLab.

The steps to integrate GitLab in dbt Cloud depend on your plan. If you are on:
- the Developer or Team plan, read these [instructions](#for-dbt-cloud-developer-and-team-tiers).
- the Enterprise plan, jump ahead to these [instructions](#for-the-dbt-cloud-enterprise-tier).

## For dbt Cloud Developer and Team tiers

To connect your GitLab account:
1. Navigate to Your Profile settings by clicking the gear icon in the top right.
2. Select **Linked Accounts** in the left menu.
3. Click **Link** to the right of your GitLab account.

<Lightbox src="/img/docs/dbt-cloud/connecting-gitlab/gitlab redirect.gif" title="Link your GitLab" />

When you click **Link**, you will be redirected to GitLab and prompted to sign into your account. GitLab will then ask for your explicit authorization:

<Lightbox src="/img/docs/dbt-cloud/connecting-gitlab/GitLab-Auth.png" title="GitLab Authorization Screen" />

Once you've accepted, you should be redirected back to dbt Cloud, and you'll see that your account has been linked to your profile.


## For the dbt Cloud Enterprise tier

dbt Cloud enterprise customers have the added benefit of bringing their own GitLab OAuth application to dbt Cloud. This tier benefits from extra security, as dbt Cloud will:
- Enforce user authorization with OAuth.
- Carry GitLab's user repository permissions (read / write access) through to dbt Cloud IDE's git actions.

In order to connect GitLab in dbt Cloud, a GitLab account admin must:
1. [Set up a GitLab OAuth application](#setting-up-a-gitlab-oauth-application).
2. [Add the GitLab app to dbt Cloud](#adding-the-gitlab-oauth-application-to-dbt-cloud).

Once the admin completes those steps, dbt Cloud developers need to:
1. [Personally authenticate with GitLab](#personally-authenticating-with-gitlab) from dbt Cloud.


### Setting up a GitLab OAuth application
We recommend that before you set up a project in dbt Cloud, a GitLab account admin set up an OAuth application in GitLab for use in dbt Cloud.

For more detail, GitLab has a [guide for creating a Group Application](https://docs.gitlab.com/ee/integration/oauth_provider.html#group-owned-applications).

In GitLab, navigate to your group settings and select **Applications**. Here you'll see a form to create a new application.

<Lightbox src="/img/docs/dbt-cloud/connecting-gitlab/gitlab nav.gif" title="GitLab application navigation"/>

In GitLab, when creating your Group Application, input the following:

| Field | Value |
| ------ | ----- |
| **Name** | dbt Cloud |
| **Redirect URI** | `https://YOUR_ACCESS_URL/complete/gitlab` |
| **Confidential** | ✔️ |
| **Scopes** | ✔️ api |

Replace `YOUR_ACCESS_URL` with the [appropriate Access URL](/docs/cloud/about-cloud/regions-ip-addresses) for your region and plan.

The application form in GitLab should look as follows when completed:

<Lightbox src="/img/docs/dbt-cloud/connecting-gitlab/gitlab app.png" title="GitLab group owned application form"/>

Click **Save application** in GitLab, and GitLab will then generate an **Application ID** and **Secret**. These values will be available even if you close the app screen, so this is not the only chance you have to save them.

If you're a Business Critical customer using [IP restrictions](/docs/cloud/secure/ip-restrictions), ensure you've added the appropriate Gitlab CIDRs to your IP restriction rules, or else the Gitlab connection will fail.

### Adding the GitLab OAuth application to dbt Cloud
After you've created your GitLab application, you need to provide dbt Cloud information about the app. In dbt Cloud, account admins should navigate to **Account Settings**, click on the **Integrations** tab, and expand the GitLab section.

<Lightbox src="/img/docs/dbt-cloud/connecting-gitlab/GitLab-Navigation.gif" title="Navigating to the GitLab Integration in dbt Cloud"/>

In dbt Cloud, input the following values:

| Field | Value |
| ------ | ----- |
| **GitLab Instance** | https://gitlab.com |
| **Application ID** | *copy value from GitLab app* |
| **Secret** | *copy value from GitLab app* |

Note, if you have a special hosted version of GitLab, modify the **GitLab Instance** to use the hostname provided for your organization instead - for example `https://gitlab.yourgreatcompany.com/`.

Once the form is complete in dbt Cloud, click **Save**.

You will then be redirected to GitLab and prompted to sign into your account. GitLab will ask for your explicit authorization:

<Lightbox src="/img/docs/dbt-cloud/connecting-gitlab/GitLab-Auth.png" title="GitLab Authorization Screen" />

Once you've accepted, you should be redirected back to dbt Cloud, and your integration is ready for developers on your team to [personally authenticate with](#personally-authenticating-with-gitlab).

### Personally authenticating with GitLab
dbt Cloud developers on the Enterprise plan must each connect their GitLab profiles to dbt Cloud, as every developer's read / write access for the dbt repo is checked in the dbt Cloud IDE.

To connect a personal GitLab account, dbt Cloud developers should navigate to Your Profile settings by clicking the gear icon in the top right, then select **Linked Accounts** in the left menu.

If your GitLab account is not connected, you’ll see "No connected account". Select **Link** to begin the setup process. You’ll be redirected to GitLab, and asked to authorize dbt Cloud in a grant screen.

<Lightbox src="/img/docs/dbt-cloud/connecting-gitlab/GitLab-Auth.png" title="Authorizing the dbt Cloud app for developers" />

Once you approve authorization, you will be redirected to dbt Cloud, and you should see your connected account. You're now ready to start developing in the dbt Cloud IDE.


## Troubleshooting

### Errors when importing a repository on dbt Cloud project set up
If you do not see your repository listed, double-check that:
- Your repository is in a Gitlab group you have access to. dbt Cloud will not read repos associated with a user.

If you do see your repository listed, but are unable to import the repository successfully, double-check that:
- You are a maintainer of that repository. Only users with maintainer permissions can set up repository connections.

If you imported a repository using the dbt Cloud native integration with GitLab, you should be able to see the clone strategy is using a `deploy_token`. If it's relying on an SSH key, this means the repository was not set up using the native GitLab integration, but rather using the generic git clone option. The repository must be reconnected in order to get the benefits described above.

## FAQs

<FAQ path="Git/gitignore"/>
<FAQ path="Git/gitlab-authentication"/>
<FAQ path="Git/gitlab-selfhosted"/>
<FAQ path="Git/git-migration"/>

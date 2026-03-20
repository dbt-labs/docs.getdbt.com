---
title: "Connect to GitLab"
description: "Learn how connecting your GitLab account provides convenience and another layer of security to dbt."
id: "connect-gitlab"
---


Connecting your GitLab account to <Constant name="dbt" /> provides convenience and another layer of security to <Constant name="dbt" />:
- Import new GitLab repos with a couple clicks during <Constant name="dbt" /> project setup.
- Clone repos using HTTPS rather than SSH.
- Carry GitLab user permissions through to <Constant name="dbt" /> or <Constant name="dbt" /> CLI's git actions.
- Trigger [Continuous integration](/docs/deploy/continuous-integration) builds when merge requests are opened in GitLab.

:::info
When configuring the repository in <Constant name="dbt" />, GitLab automatically:
- Registers a webhook that triggers pipeline jobs in <Constant name="dbt" />.
- Creates a [project access token](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html) in your GitLab repository, which sends the job run status back to GitLab using the <Constant name="dbt" /> API for CI jobs. <Constant name="dbt" /> automatically refreshes this token for you. 

Requires a [GitLab Premium or Ultimate account](https://about.gitlab.com/pricing/).

:::


Depending on your plan, use these steps to integrate GitLab in <Constant name="dbt" />:
- The Developer or Starter plan, read these [instructions](#for-dbt-developer-and-starter-plans).
- The Enterprise or Enterprise+ plan, jump ahead to these [instructions](#for-the-dbt-enterprise-plans).

## For dbt Developer and Starter plans

Before you can work with GitLab repositories in <Constant name="dbt" />, you’ll need to connect your GitLab account to your user profile. This allows <Constant name="dbt" /> to authenticate your actions when interacting with Git repositories. Make sure to read about [limitations](#limitations) of the Team and Developer plans before you connect your account.

To connect your GitLab account:
1. From <Constant name="dbt" />, click on your account name in the left side menu and select **Account settings**. 
2. Select **Personal profile** under the **Your profile** section.
3. Scroll down to **Linked accounts**.
4. Click **Link** to the right of your GitLab account.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-github/github-connect.png" title="The Personal profile settings with the Linked Accounts section of the user profile"/>

When you click **Link**, you will be redirected to GitLab and prompted to sign into your account. GitLab will then ask for your explicit authorization:

<Lightbox src="/img/docs/dbt-cloud/connecting-gitlab/GitLab-Auth.png" title="GitLab Authorization Screen" />

Once you've accepted, you should be redirected back to <Constant name="dbt" />, and you'll see that your account has been linked to your profile.

### Requirements and limitations

<Constant name="dbt" /> Team and Developer plans use a single GitLab deploy token created by the first user who connects the repository, which means:
- All repositories users access from the <Constant name="dbt_platform" /> must belong to a [GitLab group](https://docs.gitlab.com/user/group/).
- All Git operations (like commits and pushes) from the <Constant name="studio_ide" /> appear as coming from the same deploy token.
- GitLab push rules may reject pushes made through <Constant name="dbt" />, particularly when multiple users are committing via the same deploy token. 

To support advanced Git workflows and multi-user commit behavior, upgrade to the Enterprise plan, which provides more flexible Git authentication strategies.

## For the dbt Enterprise plans

<Constant name="dbt" /> Enterprise and Enterprise+ customers have the added benefit of bringing their own GitLab OAuth application to <Constant name="dbt" />. This tier benefits from extra security, as <Constant name="dbt" /> will:
- Enforce user authorization with OAuth.
- Carry GitLab's user repository permissions (read / write access) through to <Constant name="dbt" /> or <Constant name="dbt" /> CLI's git actions.

In order to connect GitLab in <Constant name="dbt" />, a GitLab account admin must:
1. [Set up a GitLab OAuth application](#setting-up-a-gitlab-oauth-application).
2. [Add the GitLab app to <Constant name="dbt" />](#adding-the-gitlab-oauth-application-to-dbt-cloud).

Once the admin completes those steps, <Constant name="dbt" /> developers need to:
1. [Personally authenticate with GitLab](#personally-authenticating-with-gitlab) from <Constant name="dbt" />.


### Setting up a GitLab OAuth application

We recommend that before you set up a project in <Constant name="dbt" />, a GitLab account admin set up an OAuth application in GitLab for use in <Constant name="dbt" />.

For more detail, GitLab has a [guide for creating a Group Application](https://docs.gitlab.com/ee/integration/oauth_provider.html#group-owned-applications).

In GitLab, navigate to your group settings and select **Applications**. Here you'll see a form to create a new application.

<Lightbox src="/img/docs/dbt-cloud/connecting-gitlab/gitlab nav.gif" title="GitLab application navigation"/>

In GitLab, when creating your Group Application, input the following:

| Field | Value |
| ------ | ----- |
| **Name** | <Constant name="dbt" /> |
| **Redirect URI** | `https://YOUR_ACCESS_URL/complete/gitlab` |
| **Confidential** | ✅ |
| **Scopes** | ✅ api |

Replace `YOUR_ACCESS_URL` with the [appropriate Access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) for your region and plan.

The application form in GitLab should look as follows when completed:

<Lightbox src="/img/docs/dbt-cloud/connecting-gitlab/gitlab app.png" title="GitLab group owned application form"/>

Click **Save application** in GitLab, and GitLab will then generate an **Application ID** and **Secret**. These values will be available even if you close the app screen, so this is not the only chance you have to save them.

If you're a Business Critical customer using [IP restrictions](/docs/cloud/secure/ip-restrictions), ensure you've added the appropriate Gitlab CIDRs to your IP restriction rules, or else the Gitlab connection will fail.

### Adding the GitLab OAuth application to dbt
After you've created your GitLab application, you need to provide <Constant name="dbt" /> information about the app. In <Constant name="dbt" />, account admins should navigate to **Account Settings**, click on the **Integrations** tab, and expand the GitLab section.

<Lightbox src="/img/docs/dbt-cloud/connecting-gitlab/GitLab-Navigation.gif" title="Navigating to the GitLab Integration in dbt"/>

In <Constant name="dbt" />, input the following values:

| Field | Value |
| ------ | ----- |
| **GitLab Instance** | https://gitlab.com |
| **Application ID** | *copy value from GitLab app* |
| **Secret** | *copy value from GitLab app* |

Note, if you have a special hosted version of GitLab, modify the **GitLab Instance** to use the hostname provided for your organization instead - for example `https://gitlab.yourgreatcompany.com/`.

Once the form is complete in <Constant name="dbt" />, click **Save**.

You will then be redirected to GitLab and prompted to sign into your account. GitLab will ask for your explicit authorization:

<Lightbox src="/img/docs/dbt-cloud/connecting-gitlab/GitLab-Auth.png" title="GitLab Authorization Screen" />

Once you've accepted, you should be redirected back to <Constant name="dbt" />, and your integration is ready for developers on your team to [personally authenticate with](#personally-authenticating-with-gitlab).

### Personally authenticating with GitLab
<Constant name="dbt" /> developers on the Enterprise or Enterprise+ plan must each connect their GitLab profiles to <Constant name="dbt" />, as every developer's read / write access for the dbt repo is checked in the <Constant name="studio_ide" /> or <Constant name="dbt" /> CLI.

To connect a personal GitLab account:

1. From <Constant name="dbt" />, click on your account name in the left side menu and select **Account settings**.

2. Select **Personal profile** under the **Your profile** section.

3. Scroll down to **Linked accounts**.

If your GitLab account is not connected, you’ll see "No connected account". Select **Link** to begin the setup process. You’ll be redirected to GitLab, and asked to authorize <Constant name="dbt" /> in a grant screen.

<Lightbox src="/img/docs/dbt-cloud/connecting-gitlab/GitLab-Auth.png" title="Authorizing the dbt app for developers" />

Once you approve authorization, you will be redirected to <Constant name="dbt" />, and you should see your connected account. You're now ready to start developing in the <Constant name="studio_ide" /> or <Constant name="dbt" /> CLI.

## Troubleshooting

<FAQ path="Troubleshooting/gitlab-webhook"/>
<FAQ path="Troubleshooting/error-importing-repo"/>
<FAQ path="Git/gitignore"/>
<FAQ path="Git/gitlab-authentication"/>
<FAQ path="Git/gitlab-selfhosted"/>
<FAQ path="Git/git-migration"/>
<FAQ path="Git/gitlab-token-refresh" />

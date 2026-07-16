---
title: "Connect to GitLab"
description: "Learn how connecting your GitLab account provides convenience and another layer of security to dbt."
id: "connect-gitlab"
---


Connecting your GitLab account to <Constant name="dbt" /> provides convenience and another layer of security to <Constant name="dbt" />:
- Import new GitLab repos with a couple of clicks during <Constant name="dbt" /> project setup.
- Clone repos using HTTPS rather than SSH.
- Carry GitLab user permissions through to <Constant name="dbt" /> and <Constant name="platform_cli" /> git actions.
- Trigger [continuous integration](/docs/deploy/continuous-integration) builds when merge requests are opened in GitLab.

:::info
When configuring the repository in <Constant name="dbt" />, GitLab automatically:
- Registers a webhook that triggers pipeline jobs in <Constant name="dbt" />.
- Creates a [project access token](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html) in your GitLab repository, which sends the job run status back to GitLab using the <Constant name="dbt" /> API for CI jobs. <Constant name="dbt" /> automatically refreshes this token for you.

You must have a [GitLab Premium or Ultimate account](https://about.gitlab.com/pricing/).

:::


Depending on your plan, use these steps to integrate GitLab with <Constant name="dbt" />:
- For the Developer or Starter plans, follow these [instructions](#for-dbt-developer-and-starter-plans).
- For the Enterprise or Enterprise+ plans, follow these [instructions](#for-the-dbt-enterprise-plans).

## For dbt Developer and Starter plans

Before you can work with GitLab repositories in <Constant name="dbt" />, you’ll need to connect your GitLab account to your user profile. This allows <Constant name="dbt" /> to authenticate your actions when interacting with Git repositories. Make sure to read the [requirements and limitations](#requirements-and-limitations) of the Starter and Developer plans before you connect your account.

To connect your GitLab account:
1. From <Constant name="dbt" />, click on your account name in the left-side menu and select **Account settings**.
2. Select **Personal profile** under the **Your profile** section.
3. Go to **Linked accounts**.
4. Click **Link** to the right of your GitLab account.
5. In GitLab, sign in if prompted. When an authorization prompt appears, select the option to authorize <Constant name="dbt" />.

After you authorize the request, you’ll be redirected back to <Constant name="dbt" />, and you'll see that your account has been linked to your profile.

### Requirements and limitations

<Constant name="dbt" /> Starter and Developer plans use a single GitLab deploy token created by the first user who connects the repository, which means:
- All repositories that users access from the <Constant name="dbt_platform" /> must belong to a [GitLab group](https://docs.gitlab.com/user/group/).
- All Git operations (like commits and pushes) from the <Constant name="studio_ide" /> appear as coming from the same deploy token.
- GitLab push rules may reject pushes made through <Constant name="dbt" />, particularly when multiple users are committing via the same deploy token. 

To support advanced Git workflows and multi-user commit behavior, upgrade to the Enterprise plan, which provides more flexible Git authentication strategies.

## For the dbt Enterprise plans

<Constant name="dbt" /> Enterprise and Enterprise+ customers have the added benefit of bringing their own GitLab OAuth application to <Constant name="dbt" />. This tier benefits from extra security, as <Constant name="dbt" /> will:
- Enforce user authorization with OAuth.
- Carry GitLab's user repository permissions (read/write access) through to <Constant name="dbt" /> or <Constant name="platform_cli" /> git actions.

In order to connect GitLab in <Constant name="dbt" />, a GitLab account admin must:
1. [Set up a GitLab OAuth application](#setting-up-a-gitlab-oauth-application).
2. [Add the GitLab app to <Constant name="dbt" />](#adding-the-gitlab-oauth-application-to-dbt).

Once the admin completes those steps, <Constant name="dbt" /> developers need to:
1. [Personally authenticate with GitLab](#personally-authenticating-with-gitlab) from <Constant name="dbt" />.


### Setting up a GitLab OAuth application

We recommend that before you set up a project in <Constant name="dbt" />, a GitLab account admin set up an OAuth application in GitLab for use in <Constant name="dbt" />.

For more detail, GitLab has a [guide for creating a Group Application](https://docs.gitlab.com/ee/integration/oauth_provider.html#group-owned-applications).

To create a group-owned OAuth application in GitLab:
1. In GitLab, navigate to your group settings and select **Applications**.

    <Lightbox src="/img/docs/dbt-platform/connecting-gitlab/gitlab nav.gif" title="GitLab application navigation"/>

2. When creating your group application, enter the following:
    | Field | Value |
    | ------ | ----- |
    | **Name** | <Constant name="dbt" /> |
    | **Redirect URI** | `https://YOUR_ACCESS_URL/complete/gitlab` |
    | **Confidential** | ✅ |
    | **Scopes** | ✅ api |

    For the **Redirect URI** field, replace `YOUR_ACCESS_URL` with the [appropriate Access URL](/docs/platform/about-platform/access-regions-ip-addresses) for your region and plan.

3. Click **Save application**. GitLab will generate an **Application ID** and **Secret**. These values remain available even if you close the app screen, so you can return to save them later.

If you're a Business Critical customer using [IP restrictions](/docs/platform/secure/ip-restrictions), ensure you've added the appropriate GitLab CIDRs to your IP restriction rules, or else the GitLab connection will fail.

### Adding the GitLab OAuth application to dbt

After you've created your GitLab application, add it to <Constant name="dbt" />:

1. In <Constant name="dbt" />, go to **Account settings** > **Integrations**, then expand the GitLab section.
2. Enter the following values:
    | Field | Value |
    | ------ | ----- |
    | **GitLab Instance** | `https://gitlab.com` |
    | **Application ID** | *copy value from GitLab app* |
    | **Secret** | *copy value from GitLab app* |

    If you use a self-hosted GitLab instance, set **GitLab Instance** to your organization’s GitLab hostname (for example, `https://gitlab.yourgreatcompany.com`).

3. Click **Save**.
4. You will then be redirected to GitLab and prompted to sign in.
5. When an authorization prompt appears, select the option to authorize <Constant name="dbt" />.

After you authorize the request, you’ll be redirected back to <Constant name="dbt" />. Your integration is now ready for developers on your team to [personally authenticate with GitLab](#personally-authenticating-with-gitlab).

### Personally authenticating with GitLab

<Constant name="dbt" /> developers on the Enterprise or Enterprise+ plan must each connect their GitLab profiles to <Constant name="dbt" />, as every developer's read/write access for the <Constant name="dbt" /> repo is checked in the <Constant name="studio_ide" /> or <Constant name="platform_cli" />.

To connect a personal GitLab account:

1. From <Constant name="dbt" />, click on your account name in the left-side menu and select **Account settings**.
2. Select **Personal profile** under the **Your profile** section.
3. Go to **Linked accounts**.
4. If your GitLab account is not connected, you’ll see "No connected account". Select **Link** to begin the setup process.
5. In GitLab, sign in if prompted. When an authorization prompt appears, select the option to authorize <Constant name="dbt" />.

Once you approve authorization, you will be redirected to <Constant name="dbt" />, and you should see your connected account. You're now ready to start developing in the <Constant name="studio_ide" /> or <Constant name="dbt" /> CLI.

## Troubleshooting

<FAQ path="Troubleshooting/gitlab-webhook"/>
<FAQ path="Troubleshooting/error-importing-repo"/>
<FAQ path="Git/gitignore"/>
<FAQ path="Git/gitlab-authentication"/>
<FAQ path="Git/gitlab-selfhosted"/>
<FAQ path="Git/git-migration"/>
<FAQ path="Git/gitlab-token-refresh" />

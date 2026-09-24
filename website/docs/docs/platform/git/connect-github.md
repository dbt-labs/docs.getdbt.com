---
title: "Connect to GitHub"
description: "Learn how connecting your GitHub account provides convenience and another layer of security to dbt."
id: "connect-github"
sidebar_label: "Connect to GitHub"
availability:
  surface: platform
  access: login_required
---


Connecting your GitHub account to <Constant name="dbt" /> provides convenience and another layer of security to <Constant name="dbt" />:
- Import new GitHub repositories with a couple clicks during <Constant name="dbt" /> project setup.
- Clone repos using HTTPS rather than SSH.
- Trigger [Continuous integration](/docs/deploy/continuous-integration)(CI) builds when pull requests are opened in GitHub.

:::note GitHub Enterprise Cloud (`ghe.com`) domains
If your organization uses GitHub Enterprise Cloud hosted on a `ghe.com` domain, the shared <Constant name="dbt" /> GitHub App can't reach it. Note that `ghe.com` accounts are cloud-managed (not on-premises), but this limitation still applies.

Enterprise and Enterprise+ accounts can connect by registering a [custom GitHub application](#custom-github-application) instead. On other plans, use [importing a project by git URL](/docs/platform/git/import-a-project-by-git-url) with SSH/deploy keys. Your organization's SSH URL configuration may require additional steps, and some native integration features are unavailable with the git URL method.

For additional help with your specific setup, contact [dbt Support](mailto:support@getdbt.com) or your <Constant name="dbt" /> account team.
:::

## Prerequisites

- **GitHub permissions**: You must be a GitHub organization owner to [install the application](/docs/platform/git/connect-github#installing-dbt-in-your-github-account). Learn more about [GitHub organization](https://docs.github.com/en/organizations/managing-peoples-access-to-your-organization-with-roles/roles-in-an-organization) roles.
- **dbt permissions**: Your GitHub organization owner also needs [_Owner_](/docs/platform/manage-access/self-service-permissions) or [_Account Admin_](/docs/platform/manage-access/enterprise-permissions) permissions in <Constant name="dbt_platform"/>. If needed, create a temporary account with these [permissions](/docs/platform/manage-access/enterprise-permissions) for the installation.
- **On-premises GitHu or EU-hosted GitHub**: On Enterprise and Enterprise+ plans, you can use the native integration by registering a [custom GitHub application](#custom-github-application). On other plans, [connect using a Git URL](/docs/platform/git/import-a-project-by-git-url), which supports [fewer](/docs/platform/git/import-a-project-by-git-url#limited-integration) Git features.

:::important Case-sensitive repository names
When specifying a GitHub repository in the <Constant name="dbt_platform" /> using the UI, API, or Terraform provider, the repository name must exactly match the case used in the GitHub URL to avoid cloning errors or job failures. For example, if the URL of your repository is `github.com/my-org/MyRepo`, enter the name as `MyRepo`, not `myrepo`.
:::

## Choose your GitHub application

<Constant name="dbt" /> connects to GitHub through a GitHub App. You have two options:

- [Shared <Constant name="dbt" /> application (default)](#installing-dbt-in-your-github-account), available to any org connecting to `github.com`. 
- Your own [custom GitHub application](#custom-github-application), available on Enterprise and Enterprise+ accounts on GitHub Enterprise Server, or GitHub with EU data residency.

You can use one GitHub application per <Constant name="dbt" /> account, not one per project.

## Installing dbt in your GitHub account

You can connect your <Constant name="dbt" /> account to GitHub by installing the <Constant name="dbt" /> application in your GitHub organization and providing access to the right repos:

1. From <Constant name="dbt" />, click on your account name in the left side menu and select **Account settings**. 
2. Select **Personal profile** under the **Your profile** section.
3. Scroll down to **Linked accounts**.
<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/connecting-github/github-connect-1.png" width= "80%" title="Navigated to Linked Accounts under your profile"/>
4. In the **Linked accounts** section, set up your GitHub account connection to <Constant name="dbt" /> by clicking **Link** to the right of GitHub. This redirects you to your account on GitHub where you will be asked to install and configure the <Constant name="dbt" /> application. 
5. Select the GitHub organization and repos <Constant name="dbt" /> should access.

   <Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/connecting-github/github-app-install.png" width="50%" title="Installing the dbt application into a GitHub organization"/>

6. Assign the <Constant name="dbt" /> GitHub App the following permissions:
   - Read access to metadata
   - Read and write access to Checks
   - Read and write access to Commit statuses
   - Read and write access to Contents (Code)
   - Read and write access to Pull requests
   - Read and write access to Webhooks
   - Read and write access to Workflows

7. Once you grant access to the app, you will be redirected back to <Constant name="dbt" /> and shown a linked account success state. You are now personally authenticated. 
8. Ask your team members to individually authenticate by connecting their [personal GitHub profiles](#authenticate-your-personal-github-account).

## Limiting repository access in GitHub
If you are your GitHub organization owner, you can also configure the <Constant name="dbt" /> GitHub application to have access to only select repositories. This configuration must be done in GitHub, but we provide an easy link in <Constant name="dbt" /> to start this process.
<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/connecting-github/configure-github.png" title="Configuring the dbt app"/>

## Custom GitHub application <Lifecycle status="managed,managed_plus" /> {#custom-github-application}

The shared <Constant name="dbt" /> GitHub App is hosted per [region](/docs/platform/about-platform/access-regions-ip-addresses), so it can only reach repositories on `github.com`. If your organization runs [GitHub Enterprise Server](https://docs.github.com/en/enterprise-server@3.14/admin/overview/about-github-enterprise-server) or [GitHub with EU data residency](https://github.com/enterprise/data-residency), register your own GitHub application and point <Constant name="dbt" /> at it. 

An account admin (or security admin) can set this up once:

1. [Register a GitHub application](#register-a-github-application) in your GitHub organization
2. [Add your GitHub application to <Constant name="dbt" />](#add-your-github-application-to-dbt)

Then each developer on the account needs to [relink their GitHub profile](#relink-your-github-profile).

### Register a GitHub application

We recommend creating the app in your GitHub organization instead of a personal account to ensure the connection doesn't break should a person leave. For the full walkthrough on the GitHub side, check out GitHub's guide to [registering a GitHub App](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app).

1. In <Constant name="dbt" />, go to **Account settings** > **Integrations** > **Git** and expand the **GitHub** section. Select **Copy** next to **Redirect URL** &mdash; you need it in the next step. Leave this page open.
2. In your GitHub organization, go to **Settings** > **Developer settings** > **GitHub Apps** and select **New GitHub App**.
3. Enter the following:
    <SimpleTable>
    | Field | Value |
    | ----- | ----- |
    | **GitHub App name** | Something recognizable, such as `dbt platform` |
    | **Homepage URL** | Your <Constant name="dbt" /> [access URL](/docs/platform/about-platform/access-regions-ip-addresses) |
    | **Redirect URL** | The **Redirect URL** you copied from <Constant name="dbt" /> |
    | **Webhook** | Leave **Active** selected |
    </SimpleTable>
4. Grant the app these repository permissions:

    - Read access to metadata
    - Read and write access to Checks
    - Read and write access to Commit statuses
    - Read and write access to Contents (Code)
    - Read and write access to Pull requests
    - Read and write access to Webhooks
    - Read and write access to Workflows

5. Select **Create GitHub App**. GitHub generates an **App ID** and a **Client ID**.
6. Generate a **Client secret** and copy it somewhere safe as GitHub only shows it once.
7. Under **Private keys**, select **Generate a private key**. GitHub downloads a `.pem` file. You'll then paste its contents into <Constant name="dbt" />.
8. Install the app into your organization and note its **install URL**. Refer to GitHub's docs on [sharing your app via an install link](https://docs.github.com/en/apps/sharing-github-apps/sharing-your-github-app#sharing-your-github-app-via-an-install-link).

If you're a Business Critical customer using [IP restrictions](/docs/platform/secure/ip-restrictions), make sure your GitHub instance's CIDRs are allowed, or the connection will fail.

### Add your GitHub application to dbt

:::caution Existing GitHub connections break

If your account already uses the shared <Constant name="dbt" /> GitHub App, switching to your own application invalidates every existing GitHub profile link. Everyone on the account has to [relink their GitHub profile](#relink-your-github-profile) before they can develop or run CI. Plan the switch with your team.

:::

1. In <Constant name="dbt" />, go back to **Account settings** > **Integrations** > **Git** and expand the **GitHub** section.
2. Enter the following:
    <SimpleTable>
    | Field | Value |
    | ----- | ----- |
    | **GitHub base URL** | Your GitHub hostname. Use `https://github.com` for GitHub.com, or your own hostname for GitHub Enterprise Server, such as `https://github.yourgreatcompany.com` |
    | **App ID** | The **App ID** from your GitHub app |
    | **Client ID** | The **Client ID** from your GitHub app |
    | **Client secret** | The client secret you generated |
    | **Private key** | The full contents of the `.pem` file you downloaded, including the `BEGIN` and `END` lines |
    | **Install URL** | Optional. Your app's install link |
    </SimpleTable>
    <Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/connecting-github/github-application-platform.png" width="85%" title="Adding your own GitHub application under Account settings, Integrations, Git"/>

3. Select **Save**. <Constant name="dbt" /> validates the credentials against GitHub. If something's isn't right, <Constant name="dbt" /> shows an error and doesn't save the configuration.

<Constant name="dbt" /> now routes all GitHub authorization for this account through your application.

### Relink your GitHub profile

Every developer authenticates against the account's GitHub application, so repo access matches what your GitHub admin actually granted them. After an admin adds or changes the application, relink your profile:

1. From <Constant name="dbt" />, click your account name in the left side menu and select **Account settings**.
2. Select **Personal profile** under the **Your profile** section.
3. Scroll to **Linked accounts** and select **Unlink** next to GitHub if an old connection is still listed.
4. Select **Link** and authorize your organization's GitHub application.

For the full walkthrough, refer to [Authenticate your personal GitHub account](#authenticate-your-personal-github-account).

### Remove a GitHub integration

Account admins and security admins can delete a GitHub integration from **Account settings** > **Integrations** > **Git**.

:::caution Removing an integration disconnects everyone

Deleting the integration breaks repo access and CI for the _whole_ account until you configure a new one. You can't stage a replacement first, because an account supports only one GitHub integration at a time.

:::

### Limitations

Note that the following limitations apply:

- One GitHub application per <Constant name="dbt" /> account. You can't set a different application per project.
- You can't configure multiple GitHub integrations on the same account.
- Only account admins and security admins can create, update, or delete a GitHub integration.

## Authenticate your personal GitHub account

After the <Constant name="dbt" /> administrator [sets up a connection](/docs/platform/git/connect-github#installing-dbt-in-your-github-account) to your organization's GitHub account, you need to authenticate using your personal account. You must connect your personal GitHub profile to <Constant name="dbt" /> to use the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) and [CLI](/docs/platform/dbt-cli-installation) and verify your read and write access to the repository.

:::info GitHub profile connection

- <Constant name="dbt" /> developers on the [Enterprise or Enterprise+ plan](https://www.getdbt.com/pricing/) must each connect their GitHub profiles to <Constant name="dbt" />. This is because the <Constant name="studio_ide" /> verifies every developer's read / write access for the dbt repo. 

- <Constant name="dbt" /> developers on the [Starter plan](https://www.getdbt.com/pricing/) don't need to each connect their profiles to GitHub, however, it's still recommended to do so.

:::

If your account uses a [custom GitHub application](#custom-github-application), you authorize that application instead of the shared <Constant name="dbt" /> app, and your repository access mirrors your GitHub App installation.

To connect a personal GitHub account:

1. From <Constant name="dbt" />, click on your account name in the left side menu and select **Account settings**.

2. Select **Personal profile** under the **Your profile** section.

3. Scroll down to **Linked accounts**. If your GitHub account is not connected, you’ll see "No connected account". 

4. Select **Link** to begin the setup process. You’ll be redirected to GitHub, and asked to authorize <Constant name="dbt" /> in a grant screen.
<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/connecting-github/github-auth.png" title="Authorizing the dbt app for developers"/>

5. Once you approve authorization, you will be redirected to <Constant name="dbt" />, and you should now see your connected account. 

You can now use the <Constant name="studio_ide" /> or <Constant name="dbt" /> CLI.


## FAQs
<FAQ path="Git/gitignore"/>
<FAQ path="Git/git-migration"/>
<FAQ path="Git/github-custom-app-errors"/>

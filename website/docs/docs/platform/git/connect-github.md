---
title: "Connect to GitHub"
description: "Learn how connecting your GitHub account provides convenience and another layer of security to dbt."
id: "connect-github"
sidebar_label: "Connect to GitHub"
---


Connecting your GitHub account to <Constant name="dbt" /> provides convenience and another layer of security to <Constant name="dbt" />:
- Import new GitHub repositories with a couple clicks during <Constant name="dbt" /> project setup.
- Clone repos using HTTPS rather than SSH.
- Trigger [Continuous integration](/docs/deploy/continuous-integration)(CI) builds when pull requests are opened in GitHub.

:::note GitHub Enterprise Cloud (`ghe.com`) domains
If your organization uses GitHub Enterprise Cloud hosted on a `ghe.com` domain, native GitHub App connectivity is not supported. Note that `ghe.com` accounts are cloud-managed (not on-premises), but this limitation still applies.

To connect a ghe.com-hosted repository, use [importing a project by git URL](/docs/platform/git/import-a-project-by-git-url) with SSH/deploy keys instead. Note that your organization's SSH URL configuration may require additional steps.

Some native integration features are unavailable when using the git URL method. For additional help with your specific setup, contact [dbt Support](mailto:support@getdbt.com) or your <Constant name="dbt" /> account team.
:::

## Prerequisites

- For On-Premises GitHub deployment, reference [importing a project by git URL](/docs/platform/git/import-a-project-by-git-url) to set up your connection instead. Some git features are [limited](/docs/platform/git/import-a-project-by-git-url#limited-integration) with this setup.
  * **Note** &mdash; [Single tenant](/docs/platform/about-platform/tenancy#single-tenant) accounts offer enhanced connection options for integrating with an On-Premises GitHub deployment setup using the native integration.  This integration allows you to use all the features of the integration, such as triggering CI builds. The dbt Labs infrastructure team will coordinate with you to ensure any additional networking configuration requirements are met and completed. To discuss details, contact dbt Labs support or your <Constant name="dbt" /> account team.
- You _must_ be a **GitHub organization owner** in order to [install the <Constant name="dbt" /> application](/docs/platform/git/connect-github#installing-dbt-in-your-github-account) in your GitHub organization. To learn about GitHub organization roles, see the [GitHub documentation](https://docs.github.com/en/organizations/managing-peoples-access-to-your-organization-with-roles/roles-in-an-organization). 
- The GitHub organization owner requires [_Owner_](/docs/platform/manage-access/self-service-permissions) or [_Account Admin_](/docs/platform/manage-access/enterprise-permissions) permissions when they log into <Constant name="dbt" /> to integrate with a GitHub environment using organizations.
- You may need to temporarily provide an extra <Constant name="dbt" /> user account with _Owner_ or _Account Admin_ [permissions](/docs/platform/manage-access/enterprise-permissions) for your GitHub organization owner until they complete the installation.

:::important Case-sensitive repository names
When specifying a GitHub repository in the <Constant name="dbt_platform" /> using the UI, API, or Terraform provider, the repository name must exactly match the case used in the GitHub URL to avoid cloning errors or job failures. For example, if the URL of your repository is `github.com/my-org/MyRepo`, enter the name as `MyRepo`, not `myrepo`.
:::

## Installing dbt in your GitHub account

You can connect your <Constant name="dbt" /> account to GitHub by installing the <Constant name="dbt" /> application in your GitHub organization and providing access to the appropriate repositories. 
To connect your <Constant name="dbt" /> account to your GitHub account: 

1. From <Constant name="dbt" />, click on your account name in the left side menu and select **Account settings**. 

2. Select **Personal profile** under the **Your profile** section.

3. Scroll down to **Linked accounts**.

<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/connecting-github/github-connect-1.png" width= "80%" title="Navigated to Linked Accounts under your profile"/>

4. In the **Linked accounts** section, set up your GitHub account connection to <Constant name="dbt" /> by clicking **Link** to the right of GitHub. This redirects you to your account on GitHub where you will be asked to install and configure the <Constant name="dbt" /> application. 

5. Select the GitHub organization and repositories <Constant name="dbt" /> should access.

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

## Authenticate your personal GitHub account

After the <Constant name="dbt" /> administrator [sets up a connection](/docs/platform/git/connect-github#installing-dbt-cloud-in-your-github-account) to your organization's GitHub account, you need to authenticate using your personal account. You must connect your personal GitHub profile to <Constant name="dbt" /> to use the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) and [CLI](/docs/platform/cloud-cli-installation) and verify your read and write access to the repository.

:::info GitHub profile connection

- <Constant name="dbt" /> developers on the [Enterprise or Enterprise+ plan](https://www.getdbt.com/pricing/) must each connect their GitHub profiles to <Constant name="dbt" />. This is because the <Constant name="studio_ide" /> verifies every developer's read / write access for the dbt repo. 

- <Constant name="dbt" /> developers on the [Starter plan](https://www.getdbt.com/pricing/) don't need to each connect their profiles to GitHub, however, it's still recommended to do so.

:::

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

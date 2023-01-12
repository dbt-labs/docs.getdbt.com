---
title: "Connecting your GitHub account"
id: "connect-github"
sidebar_label: "Connecting GitHub"
---

## Overview

Connecting your GitHub account to dbt Cloud provides convenience and another layer of security to dbt Cloud:
- Log into dbt Cloud using OAuth through GitHub.
- Import new GitHub repositories with a couple clicks during dbt Cloud project setup.
- Clone repos using HTTPS rather than SSH.
- Trigger [Continuous integration](/docs/deploy/cloud-ci-job) builds when pull requests are opened in GitHub.

## Prerequisites

- For On-Premises GitHub deployment, reference [importing a project by git URL](/docs/collaborate/git/import-a-project-by-git-url) to set up your connection instead. Some git features are [limited](/docs/collaborate/git/import-a-project-by-git-url#limited-integration) with this setup.
- You _must_ be a **GitHub organization owner** in order to [install the dbt Cloud application](/docs/collaborate/git/connect-github#installing-dbt-cloud-in-your-github-account) in your GitHub organization. For more GitHub organization role, see the [GitHub documentation](https://docs.github.com/en/organizations/managing-peoples-access-to-your-organization-with-roles/roles-in-an-organization). 
- The GitHub organization owner requires [_Owner_](/docs/collaborate/manage-access/self-service-permissions) or [_Account Admin_](/docs/collaborate/manage-access/enterprise-permissions) permissions when they log into dbt Cloud to integrate with a GitHub environment using organizations.
- You may need to temporarily provide an extra dbt Cloud user account with _Owner_ or _Account Admin_ [permissions](/docs/collaborate/manage-access/self-service-permissions) for your GitHub organization owner until they complete the installation.


## Installing dbt Cloud in your GitHub account

You can connect your dbt Cloud account to GitHub by installing the dbt Cloud application in your GitHub organization and providing access to the appropriate repositories. 
To connect your dbt Cloud account to your GitHub account: 

1. Navigate to **Your Profile** settings by clicking the gear icon in the top right. 

2. Select **Linked Accounts** from the left menu.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-github/github-connect.gif" title="Navigated to Linked Accounts under your profile"/>

3. In the **Linked Accounts** section, set up your GitHub account connection to dbt Cloud by clicking **Link** to the right of GitHub. This redirects you to your account on GitHub where you will be asked to install and configure the dbt Cloud application. 

4. Select the GitHub organization and repositories dbt Cloud should access.

   <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-github/github-app-install.png" title="Installing the dbt Cloud application into a GitHub organization"/>

5. Assign the dbt Cloud GitHub App the following permissions:
   - Read access to metadata
   - Read and write access to checks, code, commit statuses, pull requests, and workflows

6. Once you grant access to the app, you will be redirected back to dbt Cloud and shown a linked account success state. You are now personally authenticated. 
7. Ask your team members to [personally authenticate](/docs/collaborate/git/connect-github#personally-authenticate-with-github) by connecting their GitHub profiles.

## Limiting repository access in GitHub
If you are your GitHub organization owner, you can also configure the dbt Cloud GitHub application to have access to only select repositories. This configuration must be done in GitHub, but we provide an easy link in dbt Cloud to start this process.
<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-github/configure-github.png" title="Configuring the dbt Cloud app"/>

## Personally authenticate with GitHub

Once the dbt Cloud admin has [set up a connection](docs/collaborate/git/connect-github#installing-dbt-cloud-in-your-github-account) to your organization GitHub account, you need to personally authenticate, which improves the security of dbt Cloud by enabling you to log in using OAuth through GitHub.
:::infoGitHub profile connection
- dbt Cloud developers on the [Enterprise plan](https://www.getdbt.com/pricing/) must each connect their GitHub profiles to dbt Cloud. This is because the dbt Cloud IDE verifies every developer's read / write access for the dbt repo. 

- dbt Cloud developers on the [Team plan](https://www.getdbt.com/pricing/) don't need to each connect their profiles to GitHub, however, it's still recommended to do so.
:::

To connect a personal GitHub account:

1. Navigate to **Your Profile** settings by clicking the gear icon in the top right. 

2. Select **Linked Accounts** in the left menu. If your GitHub account is not connected, you’ll see "No connected account". 

3. Select **Link** to begin the setup process. You’ll be redirected to GitHub, and asked to authorize dbt Cloud in a grant screen.
<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-github/github-auth.png" title="Authorizing the dbt Cloud app for developers"/>

4. Once you approve authorization, you will be redirected to dbt Cloud, and you should now see your connected account. 

The next time you log into dbt Cloud, you will be able to do so via OAuth through GitHub, and if you're on the Enterprise plan, you're ready to use the dbt Cloud IDE.

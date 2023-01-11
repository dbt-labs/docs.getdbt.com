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

To connect GitHub in dbt Cloud:
1. A GitHub organization owner must first [install the dbt Cloud application](/docs/collaborate/git/connect-github#installing-dbt-cloud-in-your-github-account) in your team's GitHub account.
2. All other dbt Cloud developers on the account need to [personally authenticate with GitHub](/docs/collaborate/git/connect-github#personally-authenticate-with-github) from dbt Cloud.

If you are the GitHub organization owner tasked with the installation of the dbt Cloud app in step 1, you will also be automatically personally authenticated after completion, so step 2 will be taken care of. This means teams of one only need to complete step 1.

GitHub On-Premise**

If you're using an On-Premises GitHub deployment, this method will not work for your account. Please instead reference our docs on [importing a project by git URL](/docs/collaborate/git/import-a-project-by-git-url) to set up your connection. This alternative connection method does not include the benefits of the native integration mentioned above.


## Prerequisites

In order to [install](#installing-dbt-cloud-in-your-github-account) dbt Cloud to your GitHub account, you must meet the following prerequisites first:

- To integrate a GitHub environment that uses Organizations, a GitHub org admin _must_ log into dbt Cloud with _Owner_ or _Account Admin_ [permissions](/docs/collaborate/manage-access/self-service-permissions) first before installing dbt Cloud.
- You may need to provide an extra dbt Cloud user account for your GitHub org admin until they complete the steps.

## Installing dbt Cloud in your GitHub account

To connect your dbt Cloud account to your GitHub account: 

1. Navigate to **Your Profile** settings by clicking the gear icon in the top right. 

2. Select **Linked Accounts** from the left menu.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-github/github-connect.gif" title="Navigated to Linked Accounts under your profile"/>

3. In the **Linked Accounts** section, set up your GitHub account connection to dbt Cloud by clicking **Link** to the right of GitHub. This redirects you to your account on GitHub where you will be asked to install and configure the dbt Cloud application. 

4. Select the GitHub organization and repositories dbt Cloud should access.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-github/github-app-install.png" title="Installing the dbt Cloud application into a GitHub organization"/>

The dbt Cloud GitHub App requires the following permissions:
   - Read access to metadata
   - Read and write access to checks, code, commit statuses, pull requests, and workflows

5. Once you grant access to the app, you will be redirected back to dbt Cloud and shown a linked account success state. You are now personally authenticated too, and your team members can begin [connecting their profiles](/docs/collaborate/git/connect-github#personally-authenticate-with-github).

## Limiting repository access in GitHub
If you are your GitHub organization owner, you can also configure the dbt Cloud GitHub application to have access to only select repositories. This configuration must be done in GitHub, but we provide an easy link in dbt Cloud to start this process.
<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-github/configure-github.png" title="Configuring the dbt Cloud app"/>

## Personally authenticate with GitHub
:::infoGitHub profile connection
&mdash; dbt Cloud developers on the [Enterprise plan](https://www.getdbt.com/pricing/) must each connect their GitHub profiles to dbt Cloud. This is because the dbt Cloud IDE verifies every developer's read / write access for the dbt repo. 

&mdash; dbt Cloud developers on the [Team plan](https://www.getdbt.com/pricing/) don't need to each connect their profiles to GitHub, however, it's still recommended to do so.
:::

To connect a personal GitHub account:

1. Navigate to **Your Profile** settings by clicking the gear icon in the top right. 

2. Select **Linked Accounts** in the left menu. If your GitHub account is not connected, you’ll see "No connected account". 

3. Select **Link** to begin the setup process. You’ll be redirected to GitHub, and asked to authorize dbt Cloud in a grant screen.
<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-github/github-auth.png" title="Authorizing the dbt Cloud app for developers"/>

4. Once you approve authorization, you will be redirected to dbt Cloud, and you should now see your connected account. 

The next time you log into dbt Cloud, you will be able to do so via OAuth through GitHub, and if you're on the Enterprise plan, you're ready to use the dbt Cloud IDE.

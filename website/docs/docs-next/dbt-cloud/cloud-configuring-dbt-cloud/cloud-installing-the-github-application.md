---
title: "Connecting your GitHub Account"
id: "cloud-installing-the-github-application"
sidebar_label: "Connecting GitHub"
---

## Overview

Connecting your GitHub account to dbt Cloud unlocks exciting and compelling functionality in dbt Cloud. Once your GitHub account is connected, you can:
- [Trigger CI builds](cloud-enabling-continuous-integration-with-github) when Pull Requests are opened in GitHub
- Log into dbt Cloud via OAuth through GitHub
- Add new repos to Cloud in a single click (no need to fuss with Deploy Keys)



:::info Use GitHub On-Premise?
This method will not work for On-Premise GitHub deployments. Please reference our 
[Importing a project by git url](docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-import-a-project-by-git-url#github) to setup your connection. This alternative method does not include the benefits mentioned above.
:::

## Linking dbt Cloud to your GitHub account

To link your dbt Cloud account to your GitHub account, navigate to your [user profile](https://cloud.getdbt.com/#/profile/) and click the [Integrations section](https://cloud.getdbt.com/#/profile/integrations/). Here you can link your GitHub account to dbt Cloud.

<Lightbox src="/img-next/docs/dbt-cloud/cloud-configuring-dbt-cloud/profile_integrations_page.png" title="Click the green button to connect dbt Cloud to your GitHub account"/>

On the next page, you can select a GitHub organization to install the dbt Cloud application into.

<Lightbox src="/img-next/docs/dbt-cloud/cloud-configuring-dbt-cloud/github-app-2.png" title="Installing the dbt Cloud application into an organization."/>

The dbt Cloud GitHub App requires the following permissions:
- Read access to metadata
- Read and write access to checks, code, commit statuses, pull requests, and workflows (new!)

## Usage notes

A GitHub organization owner needs to connect and configure the dbt Cloud app for their organization. Users on the Developer or Team plans do not need to each connect to GitHub, but it is recommended to do so. Users on the Enterprise plan must each connect their GitHub accounts, as dbt Cloud will enforce the repository's access permissions for every user in the IDE.

## Connect your personal GitHub account

To connect your personal GitHub account, navigate to your [User Profile](https://cloud.getdbt.com/#/profile/) select the [Integrations section](https://cloud.getdbt.com/#/profile/integrations/) from the left sidebar. Under “GitHub”, if your account is already connected, you’ll see "Your user account is linked to a GitHub account with username &lt;your-github-username&gt;."

If your account is not connected, you’ll see "This account is not linked to a GitHub account.” Click the button to begin the setup process. You’ll be redirected to GitHub, and then back into dbt Cloud. When you are redirected to dbt Cloud, you should now see your connected account. The next time you log into dbt Cloud, you will be able to do so via OAuth through GitHub.

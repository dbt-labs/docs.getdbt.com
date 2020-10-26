---
title: "Connecting your GitHub Account"
id: "cloud-installing-the-github-application"
sidebar_label: "GitHub"
---

## Overview

Connecting your GitHub account to dbt Cloud unlocks exciting and compelling functionality in dbt Cloud. Once your GitHub account is connected, you can:
- trigger CI builds when Pull Requests are opened in GitHub
- log into dbt Cloud via oauth through GitHub
- add new repos to Cloud in a single click (no need to fuss with Deploy Keys)
- and more!

## Linking dbt Cloud to your GitHub account

To link your dbt Cloud account to your GitHub account: 
1. Navigate to your [user profile](https://cloud.getdbt.com/#/profile/) in the upper right hand corner of the screen.
2. Click into the [Integrations](https://cloud.getdbt.com/#/profile/integrations/) section.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/profile_integrations_page.png" title="Click the green button to connect dbt Cloud to your GitHub account"/>

3. Click the green button under the Github section to begin the integration process.
4. Select the Github organization you'd like to install the dbt Cloud application into.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/github-app-2.png" title="Installing the dbt Cloud application into an organization."/>

## Configuring your Github repository in your Project settings

Now that you've successfully integrated your Github account, you'll be able to clone your repository using the Github app. To do so, follow the steps below:
1. Click the hamburger menu in the left hand corner.
2. Select 'Account Settings' from the sidebar.
3. Click into the Repository section of our project.
4. Select the "Github" button and choose your preferred repository you'd like to import.

<LoomVideo id="16a2a6fa964d4438a4e240515b9e22bc" />

## Usage Notes

Note that only the Github admin who sets up new dbt Cloud projects needs to connect their GitHub account. It’s not necessary for every dbt Cloud user to connect GitHub (but it can be convenient to do so!)

## Connect your personal GitHub account

To connect your personal GitHub account, navigate to your [User Profile](https://cloud.getdbt.com/#/profile/) select the [Integrations section](https://cloud.getdbt.com/#/profile/integrations/) from the left sidebar. Under “GitHub”, if your account is already connected, you’ll see "Your user account is linked to a GitHub account with username &lt;your-github-username&gt;."

If your account is not connected, you’ll see "This account is not linked to a GitHub account.” Click the button to begin the setup process. You’ll be redirected to GitHub, and then back into dbt Cloud. When you are redirected to dbt Cloud, you should now see your connected account. The next time you log into dbt Cloud, you will be able to do so via oauth through GitHub.

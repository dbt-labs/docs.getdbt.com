---
title: "Connecting your GitHub Account"
id: "cloud-installing-the-github-application"
---

## Overview

Connecting your GitHub account to dbt Cloud unlocks exciting and compelling functionality in dbt Cloud. Once your GitHub account is connected, you can:
- trigger CI builds when Pull Requests are opened in GitHub
- log into dbt Cloud via oauth through GitHub
- add new repos to Cloud in a single click (no need to fuss with Deploy Keys)
- and more!

## Linking dbt Cloud to your GitHub account

To link your dbt Cloud account to your GitHub account, navigate to your [profile page](https://cloud.getdbt.com/#/profile/). In the Integrations section of the page, you can link your GitHub account to GitHub.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/63cf3d2-Screen_Shot_2019-01-31_at_4.39.52_PM.png" title="Click the green button to connect dbt Cloud to your GitHub account"/>

On the next page, you can select a GitHub organization to install the dbt Cloud application into.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/aae6ccf-Screen_Shot_2019-01-31_at_4.40.54_PM.png" title="Installing the dbt Cloud application into an organization."/>

## Usage Notes

Note that only the Github admin who sets up new dbt Cloud projects needs to connect their GitHub account. It’s not necessary for every dbt Cloud user to connect GitHub (but it can be convenient to do so!)

## Connect your personal GitHub account

To connect your personal GitHub account, navigate to the [Profile page](https://cloud.getdbt.com/#/profile/). at the bottom of the profile page, you’ll see an “Integrations” section. Under “GitHub”, if your account is already connected, you’ll see "Your user account is linked to a GitHub account with username `<your-github-username>`."

If your account is not connected, you’ll see "This account is not linked to a GitHub account.” Click the button to begin the setup process. You’ll be redirected to GitHub, and then back into dbt Cloud. When you are redirected to dbt Cloud, you should now see your connected account. The next time you log into dbt Cloud, you will be able to do so via oauth through GitHub.

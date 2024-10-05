--- 
title: "Enable dbt Copilot" 
sidebar_label: "Enable dbt Copilot" 
description: "Enable the dbt Copilot AI engine in dbt Cloud to speed up your development." 
---

# Enable dbt Copilot <Lifecycle status='beta'/>

This page explains how to enable the dbt Copilot engine in dbt Cloud, leveraging AI to speed up your development and allowing you to focus on delivering quality data.

## Prerequisites

- Available in the dbt Cloud IDE only.
- Must have an active [dbt Cloud Enterprise account](https://www.getdbt.com/pricing).
- Development environment has been upgraded to ["Versionless"](/docs/dbt-versions/upgrade-dbt-version-in-cloud#versionless).
- Current dbt Copilot deployments use a central OpenAI API key managed by dbt Labs. In the future, you may provide your own key for Azure OpenAI or OpenAI.
- Accept and sign legal agreements. Reach out to your Account team to begin this process.

## Enable dbt Copilot

dbt Copilot is only available at an account level after your organization has signed the legal requirements. It's disabled by default. A dbt Cloud admin(s) can enable it by following these steps:

1. Navigate to **Account settings** in the navigation menu.

2. Under **Settings**, confirm the account you're enabling.

3. Click **Edit** in the top right corner.

4. Enable the **Enable account access to AI-powered features** option.

5. Click **Save**. You should now have the dbt Copilot AI engine enabled for use.

Note: To disable (only after enabled), repeat steps 1 to 3, toggle off in step 4, and repeat step 5.

<Lightbox src="/img/docs/deploy/example-account-settings.png" width="90%" title="Example of the 'Enable account access to AI-powered feature' option in Account settings" />
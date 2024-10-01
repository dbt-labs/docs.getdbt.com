--- 
title: "Enable dbt Copilot" 
sidebar_label: "Enable dbt Copilot" 
description: "Enable the dbt Copilot experience in dbt Cloud and leverage AI to speed up your development." 
---

# Enable dbt Copilot <Lifecycle status='beta'/>

This page explains how to enable the dbt Copilot experience in dbt Cloud to leverage AI to speed up your development and allow you to focus on delivering quality data.

## Prerequisites

- Available in the dbt Cloud IDE only.
- Must have an active [dbt Cloud Enterprise account](https://www.getdbt.com/pricing).
- Development environment be ["Versionless"](/docs/dbt-versions/upgrade-dbt-version-in-cloud#versionless).
- Current dbt Copilot deployments use a central OpenAI API key managed by dbt Labs. In the future, you may provide your own key for Azure OpenAI or OpenAI.
- Accept and sign legal agreements. Reach out to your Account team to begin this process.

## Enable dbt Copilot

The dbt Copilot experience will only be available at an account level after your organization has signed the legal requirements. It will be disabled by default. Your dbt Cloud Admin(s) will enable it by following these steps:

1. Navigate to **Account Settings** in the navigation menu.

2. Under **Settings**, confirm the account you're enabling.

3. Click **Edit** in the top right corner.

4. To turn on dbt Copilot, toggle the **Enable account access to AI-powered features** switch to the right. The toggle will slide to the right side, activating the dbt Copilot experience.

5. Click **Save** and you should now have the dbt Copilot feature enabled to use.

Note: To disable (only after enabled), repeat steps 1 to 3, toggle off in step 4, and repeat step 5.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/dbt-assist-toggle.jpg" width="90%" title="Example of the 'Enable account access to AI-powered feature' option in Account settings" />

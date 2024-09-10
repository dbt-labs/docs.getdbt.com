--- 
title: "Enable dbt Assist" 
sidebar_label: "Enable dbt Assist" 
description: "Enable dbt Assist in dbt Cloud and leverage AI to speed up your development." 
---

# Enable dbt Assist <Lifecycle status='beta'/>

This page explains how to enable dbt Assist in dbt Cloud to leverage AI to speed up your development and allow you to focus on delivering quality data.

## Prerequisites

- Available in the dbt Cloud IDE only.
- Must have an active [dbt Cloud Enterprise account](https://www.getdbt.com/pricing).
- Development environment be ["Versionless"](/docs/dbt-versions/upgrade-dbt-version-in-cloud#versionless).
- Current dbt Assist deployments use a central OpenAI API key managed by dbt Labs. In the future, you may provide your own key for Azure OpenAI or OpenAI.
- Accept and sign legal agreements. Reach out to your account team to begin this process.

## Enable dbt Assist

dbt Assist will only be available at an account level after your organization has signed the legal requirements. It will be disabled by default. Your dbt Cloud Admin(s) will enable it by following these steps:

1. Navigate to **Account Settings** in the navigation menu.

2. Under **Settings**, confirm the account you're enabling.

3. Click **Edit** in the top right corner.

4. To turn on dbt Assist, toggle the **Enable account access to AI-powered features** switch to the right. The toggle will slide to the right side, activating dbt Assist.

5. Click **Save** and you should now have dbt Assist AI enabled to use.

Note: To disable (only after enabled), repeat steps 1 to 3, toggle off in step 4, and repeat step 5.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/dbt-assist-toggle.jpg" width="90%" title="In Account Settings, click the 'Enable account access to AI-powered feature' toggle to enable dbt Assist." />

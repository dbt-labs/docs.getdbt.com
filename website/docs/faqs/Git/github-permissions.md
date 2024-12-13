---
title: "I'm seeing a 'GitHub and dbt Cloud latest permissions' error"
description: "GitHub and dbt Cloud permissions error"
sidebar_label: "GitHub and dbt Cloud permissions error"
---

If you see the error `This account needs to accept the latest permissions for the dbt Cloud GitHub App` in dbt Cloud &mdash; this usually occurs when the permissions for the dbt Cloud GitHub App are out of date.

To solve this issue, you'll need to update the permissions for the dbt Cloud GitHub App in your GitHub account. This FAQ shares a couple of ways you can do it.

## Update permissions

A GitHub organization admin will need to update the permissions in GitHub for the dbt Cloud GitHub App. If you're not the admin, reach out to your organization admin to request this. 

1. Navigate to your GitHub account. Click on the top right profile icon and then **Settings** (or personal if using a non-organization account).

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/github-settings.jpg" width="50%" title="Navigate to your GitHub account to configure your settings." />

2. Then go to **Integrations** and then select **Applications** to identify any necessary permission changes. Note that a GitHub repository admin may not see the same permission request.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/github-applications.jpg" width="80%" title="Navigate to Application settings to identify permission changes." />

3. Click on **Review request** and then click on the **Accept new permissions** button on the next page.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/github-review-request.jpg" width="80%" title="Grant access to the dbt Cloud app by accepting the new permissions." />

For more info on GitHub permissions, refer to [access permissions](https://docs.github.com/en/get-started/learning-about-github/access-permissions-on-github).

Alternatively, try [disconecting your GitHub account](#disconect-github) in dbt Cloud, detailed in the following section.

## Disconnect GitHub

Disconnect the GitHub and dbt Cloud integration in dbt Cloud.

1. In dbt Cloud, go to **Account Settings**.
2. In **Projects**, select the project experiencing the issue.
3. Click the repository link under **Repository**.
4. In the **Repository details** page, click **Edit**.
5. Click **Disconnect** to remove the GitHub integration.
6. Return to your **Project details** page and reconnect your repository by clicking the **Configure Repository** link.
7. Configure your repository and click **Save**

<Lightbox src="/img/docs/dbt-cloud/disconnect-repo.png" title="Disconnect and reconnect your git repository in your dbt Cloud Account Settings pages."/>

## Support
If you've tried these workarounds and are still experiencing this behavior &mdash; reach out to the [dbt Support](mailto:support@getdbt.com) team and we'll be happy to help!

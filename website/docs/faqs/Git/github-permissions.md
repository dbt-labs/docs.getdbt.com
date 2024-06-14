---
title: "I'm seeing a 'GitHub and dbt Cloud latest permissions' error"
description: "GitHub and dbt Cloud permissions error"
sidebar_label: "GitHub and dbt Cloud permissions error"
---

If you see the error `This account needs to accept the latest permissions for the dbt Cloud GitHub App` in dbt Cloud &mdash; this usually occurs when the permissions for the dbt Cloud GitHub App are out of date.

To solve this issue, you'll need to update the permissions for the dbt Cloud GitHub App in your GitHub account. Here's a couple of ways you can do it:

#### Update permissions

A Github organization admin will need to update the permissions in GitHub for the dbt Cloud GitHub App. If you're not the admin, reach out to your organization admin to request this. Alternatively, try [disconecting your GitHub account](#disconect-github) in dbt Cloud.

1. Go directly to GitHub to determine if any updated permissions are required.
2. In GitHub, go to your organization **Settings** (or personal if using a non-organization account).
3. Then navigate to **Applications** to identify any necessary permission changes.
For more info on GitHub permissions, refer to [access permissions](https://docs.github.com/en/get-started/learning-about-github/access-permissions-on-github).

#### Disconnect GitHub

Disconnect the GitHub and dbt Cloud integration in dbt Cloud.

1. In dbt Cloud, go to **Account Settings**.
2. In **Projects**, select the project that's experiencing the issue.
3. Click the repository link under **Repository**.
4. In the **Repository details** page, click **Edit**.
5. Click **Disconnect** to remove the GitHub integration.
6. Go back to your **Project details** page and reconnect your repository by clicking the **Configure Repository** link.
7. Configure your repository and click **Save**

<Lightbox src="/img/repository-details-faq.jpg" title="Disconnect your GitHub connection in the 'Repository details' page."/>

If you've tried these workarounds and are still experiencing this behavior &mdash; reach out to the [dbt Support](mailto:support@getdbt.com) team and we'll be happy to help!

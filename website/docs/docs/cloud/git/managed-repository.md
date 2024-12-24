---
title: "Connect with managed repository"
id: "managed-repository"
description: "Learn how to set up a project with a managed repository."
pagination_next: "docs/cloud/git/import-a-project-by-git-url"
pagination_prev: "docs/cloud/git/git-configuration-in-dbt-cloud"
---

Managed repositories are a great way to trial dbt without needing to create a new repository. If you don't already have a Git repository for your dbt project, you can let dbt Cloud host and manage a repository for you. 

If in the future you choose to host this repository elsewhere, you can export the information from dbt Cloud at any time. Refer to [Move from a managed repository to a self-hosted repository](/faqs/Git/managed-repo) for more information on how to do that.


:::info
dbt Labs recommends against using a managed repository in a production environment. You can't use Git features like pull requests, which are part of our recommended version control best practices.
:::

To set up a project with a managed repository:

1. From your **Account settings** in dbt Cloud, select the project you want to set up with a managed repository. If the project already has a repository set up, you need to edit the repository settings and disconnect the existing repository.
2. Click **Edit** for the project.
3. Under Repository, click **Configure repository**.
4. Select **Managed**.
5. Enter a name for the repository. For example, "analytics" or "dbt-models."
6. Click **Create**.
   <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/managed-repo.png" title="Adding a managed repository"/>


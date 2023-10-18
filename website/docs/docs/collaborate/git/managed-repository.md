---
title: "Managed repository"
id: "managed-repository"
---

If you do not already have a git repository for your dbt project, you can let dbt Cloud manage a repository for you. Managed repositories are a great way to trial dbt without needing to create a new repository.

To set up a project with a managed repository:

1. From your Account settings in dbt Cloud, select the project you want to set up with a managed repository. If the project already has a repository set up, you need to edit the repository settings and disconnect the existing repository.
2. Click **Edit** for the project.
3. Under Repository, click **Configure repository**.
4. Select **Managed**.
5. Enter a name for the repository. For example, "analytics" or "dbt-models."
6. Click **Create**.
   <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/managed-repo.png" title="Adding a managed repository"/>

dbt Cloud will host and manage this repository for you. If in the future you choose to host this repository elsewhere, you can export the information from dbt Cloud at any time.

** We do not recommend using a managed repository in a production environment. You will not be able to use git features like pull requests which are part of our recommended version control best practices.

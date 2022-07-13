---
title: "Using a dbt Cloud managed repository"
id: "cloud-using-a-managed-repository"
---

If you do not already have a git repository for your dbt project, you can let dbt Cloud manage a repository for you. Managed repositories are a great way to trial dbt without needing to spin a new repository. 

To create a managed repository, choose the "Managed" option when creating a repository in dbt Cloud. Next, supply the name for the repository -- something like "analytics" or "dbt-models" is a good choice.

Once saved, dbt Cloud will host and manage this repository for you. If in the future you choose to host this repository yourself, you can contact support to have the contents of your repo transferred to you.

<Lightbox src="/img-next/docs/dbt-cloud/cloud-configuring-dbt-cloud/managed-repo.png" title="Adding a managed repository"/>


** We do not recommend productionizing with a managed repository. This is because you will not be able to use git features like pull requests which are part of our recommended version control best practices. 

---
title: "How to migrate git providers"
sidebar_label: "Git provider migration"
id: "git-migration"
hide_table_of_contents: true
description: "Learn how to migrate git providers in dbt Cloud with minimal disruption."
tags: [Git]
---

To migrate from one git provider to another, refer to the following steps to avoid minimal disruption:

1. Outside of dbt Cloud, you'll need to import your existing repository into your new provider. 
   
   As an example, if you're migrating from GitHub to Azure DevOps, you'll need to import your existing repository (GitHub) into your new git provider (Azure DevOps). For detailed steps on how to do this, refer to your git provider's documentation (Such as [GitHub](https://docs.github.com/en/migrations/importing-source-code/using-github-importer/importing-a-repository-with-github-importer), [GitLab](https://docs.gitlab.com/ee/user/project/import/repo_by_url.html), [Azure DevOps](https://learn.microsoft.com/en-us/azure/devops/repos/git/import-git-repository?view=azure-devops)) 
   
2. Go back to dbt Cloud and set up your [integration for the new git provider](/docs/cloud/git/connect-github), if needed. 
3. Disconnect the old repository in dbt Cloud by going to **Account Settings** and then **Projects**, click on the **Repository** link. Then click **Edit** and **Disconnect**. 
   
   <Lightbox src="/img/docs/dbt-cloud/disconnect-repo.gif" width="65%" title="Disconnect and reconnect you git repository in your dbt Cloud Account Settings pages."/>

4. On the same page, connect to the new git provider repository by clicking **Configure Repository**
   - If you're using the native integration, you may need to OAuth to it.
  
5. That's it, you should now be connected to the new git provider 🎉

Note &mdash; As a tip, we recommend you refresh your page and dbt Cloud IDE before performing any actions. 

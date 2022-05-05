---
title: "Connecting your Azure DevOps Account"
id: "connecting-azure-devops"
sidebar_label: "Connecting Azure DevOps"
---

:::info Beta feature
This feature is currently in Beta. If you are interested in getting access to the beta, please reach out to support@getdbt.com.

You can still use dbt Cloud with Azure DevOps before this feature is generally available by [following these instructions](/dbt-cloud/cloud-configuring-dbt-cloud/cloud-import-a-project-by-git-url#azure-devops).
:::

## About Azure DevOps and dbt Cloud

You can connect your Azure DevOps account and use Azure Active Directory (Azure AD) to enable identity and access management in dbt Cloud:

- Import new Azure DevOps repos with a couple clicks during dbt Cloud project setup.
- Enforce user authorization with OAuth 2.0.
- Carry Azure DevOps user repository permissions through to dbt Cloud IDE's git actions.
- Trigger Continuous integration (CI) builds when pull requests are opened in Azure DevOps. (Coming soon!)

To connect Azure DevOps and use Azure AD in dbt Cloud:

1. An account admin needs to [set up an Active Directory application and add it to dbt Cloud](docs/dbt-cloud/cloud-configuring-dbt-cloud/setup-azure).
2. dbt Cloud developers need to [personally authenticate with Azure DevOps](docs/dbt-cloud/cloud-configuring-dbt-cloud/authenticate-azure) from dbt Cloud.



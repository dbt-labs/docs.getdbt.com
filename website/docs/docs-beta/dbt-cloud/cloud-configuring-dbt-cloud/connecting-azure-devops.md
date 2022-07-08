---
title: "Connecting your Azure DevOps Account"
id: "connecting-azure-devops"
sidebar_label: "Connecting Azure DevOps"
---

<Snippet src="available-beta-banner" />

:::info
You can still use dbt Cloud with Azure DevOps before this feature is generally available by [following these instructions](/dbt-cloud/cloud-configuring-dbt-cloud/cloud-import-a-project-by-git-url#azure-devops).
:::

<Snippet src="available-enterprise-tier-only" />


## About Azure DevOps and dbt Cloud

You can connect your Azure DevOps account in dbt Cloud to unlock new product experiences:

- Import new Azure DevOps repos with a couple clicks during dbt Cloud project setup.
- Clone repos using HTTPS rather than SSH
- Enforce user authorization with OAuth 2.0.
- Carry Azure DevOps user repository permissions (read / write access) through to dbt Cloud IDE's git actions.
- Trigger Continuous integration (CI) builds when pull requests are opened in Azure DevOps.

To connect Azure DevOps in dbt Cloud:

1. An account admin needs to [set up an Active Directory application and add it to dbt Cloud](docs/dbt-cloud/cloud-configuring-dbt-cloud/setup-azure).
2. dbt Cloud developers need to [personally authenticate with Azure DevOps](docs/dbt-cloud/cloud-configuring-dbt-cloud/authenticate-azure) from dbt Cloud.



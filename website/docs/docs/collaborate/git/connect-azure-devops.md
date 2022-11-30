---
title: "Connect to Azure DevOps"
id: "connect-azure-devops"
---

<Snippet src="available-enterprise-tier-only" />


## About Azure DevOps and dbt Cloud

Connect your Azure DevOps cloud account in dbt Cloud to unlock new product experiences:

- Import new Azure DevOps repos with a couple clicks during dbt Cloud project setup.
- Clone repos using HTTPS rather than SSH
- Enforce user authorization with OAuth 2.0.
- Carry Azure DevOps user repository permissions (read / write access) through to dbt Cloud IDE's git actions.
- Trigger Continuous integration (CI) builds when pull requests are opened in Azure DevOps.


To connect Azure DevOps in dbt Cloud:

1. An account admin needs to [set up an Active Directory application and add it to dbt Cloud](/docs/collaborate/git/setup-azure).
2. dbt Cloud developers need to [personally authenticate with Azure DevOps](/docs/collaborate/git/authenticate-azure) from dbt Cloud.



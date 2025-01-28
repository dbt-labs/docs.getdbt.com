---
title: "Connect to Azure DevOps"
id: "connect-azure-devops"
pagination_next: "docs/cloud/git/setup-service-principal"
---

# Connect to Azure DevOps <Lifecycle status="enterprise" />

<Snippet path="available-enterprise-tier-only" />


## About Azure DevOps and dbt Cloud

Connect your Azure DevOps cloud account in dbt Cloud to unlock new product experiences:

- Import new Azure DevOps repos with a couple clicks during dbt Cloud project setup.
- Clone repos using HTTPS rather than SSH
- Enforce user authorization with OAuth 2.0.
- Carry Azure DevOps user repository permissions (read / write access) through to dbt Cloud IDE or dbt Cloud CLI's git actions.
- Trigger Continuous integration (CI) builds when pull requests are opened in Azure DevOps.


Currently, there are multiple methods for integrating Azure DevOps with dbt Cloud: 

- [**Service principal (recommended)**](/docs/cloud/git/setup-service-principal): Currently, this feature is in a phased rollout and not widely available to all accounts.
- [**Service user (legacy)**](/docs/cloud/git/setup-service-user): Available to all accounts.
- [**Service user to service principal migration**](/docs/cloud/git/setup-service-principal#migrate-to-service-principal): Once the **Service principal** option is available, you can migrate to the new service. 

No matter which approach you take, you will need admins for dbt Cloud, Azure Entra ID, and Azure DevOps to complete the integration. For more information, follow the setup guide that's right for you. 

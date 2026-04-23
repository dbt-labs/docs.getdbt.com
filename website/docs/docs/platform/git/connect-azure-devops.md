---
title: "Connect to Azure DevOps"
id: "connect-azure-devops"
pagination_next: "docs/platform/git/setup-service-principal"
---

# Connect to Azure DevOps <Lifecycle status="managed,managed_plus" />

<Snippet path="available-enterprise-tier-only" />


## About Azure DevOps and dbt

Connect your Azure DevOps cloud account in <Constant name="dbt" /> to unlock new product experiences:

- Import new Azure DevOps repos with a couple clicks during <Constant name="dbt" /> project setup.
- Clone repos using HTTPS rather than SSH
- Enforce user authorization with OAuth 2.0.
- Carry Azure DevOps user repository permissions (read / write access) through to <Constant name="studio_ide" /> or <Constant name="dbt" /> CLI's git actions.
- Trigger Continuous integration (CI) builds when pull requests are opened in Azure DevOps.


Currently, there are multiple methods for integrating Azure DevOps with <Constant name="dbt" />. The following methods are available to all accounts: 

- [**Service principal (recommended)**](/docs/platform/git/setup-service-principal)
- [**Service user (legacy)**](/docs/platform/git/setup-service-user)
- [**Service user to service principal migration**](/docs/platform/git/setup-service-principal#migrate-to-service-principal)

No matter which approach you take, you will need admins for <Constant name="dbt" />, Azure Entra ID, and Azure DevOps to complete the integration. For more information, follow the setup guide that's right for you. 

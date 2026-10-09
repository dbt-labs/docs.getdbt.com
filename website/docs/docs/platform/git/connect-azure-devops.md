---
title: "Connect to Azure DevOps"
id: "connect-azure-devops"
pagination_next: "docs/platform/git/setup-service-principal"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

# Connect to Azure DevOps

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

## Troubleshooting

### CI jobs don't trigger on pull requests

If continuous integration (CI) jobs stop starting when you open pull requests in Azure DevOps, and you don't see an error in <Constant name="dbt" /> or Azure DevOps, try these checks:

- Confirm the Azure DevOps service hooks for the repository still exist and point to your <Constant name="dbt" /> account.
- Confirm your service principal or service user still has access to the repository.

If those look fine, disconnect the repository and connect the same one again:

1. From **Account settings**, select **Projects**, then select the project.
2. Select the **Repository** link, then **Edit**, then **Disconnect**.
3. Select **Confirm Disconnect**.
4. Select **Configure Repository** and connect the same Azure DevOps repository.

---
title: "Connect to Azure DevOps"
id: "connect-azure-devops"
pagination_next: "docs/cloud/git/setup-azure"
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


To connect Azure DevOps in dbt Cloud:

1. An Entra ID admin role (or role with proper permissions) needs to [set up an Active Directory application](/docs/cloud/git/setup-azure#register-an-azure-ad-app).
2. An Azure DevOps admin needs to [connect the accounts](/docs/cloud/git/setup-azure#connect-azure-devops-to-your-new-app). 
3. A dbt Cloud account admin needs to [add the app to dbt Cloud](/docs/cloud/git/setup-azure#add-your-azure-ad-app-to-dbt-cloud).    
4. dbt Cloud developers need to [personally authenticate with Azure DevOps](/docs/cloud/git/authenticate-azure) from dbt Cloud.


If you're a Business Critical customer using [IP restrictions](/docs/cloud/secure/ip-restrictions), ensure you've added the appropriate Azure DevOps CIDRs to your IP restriction rules, or else the Azure DevOps connection will fail.

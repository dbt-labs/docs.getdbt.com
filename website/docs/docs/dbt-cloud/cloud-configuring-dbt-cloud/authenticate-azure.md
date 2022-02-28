---
title: "Authenticate with Azure DevOps"
id: "authenticate-azure"
description: "dbt Cloud developers need to authenticate with Azure DevOps."
sidebar_label: "Authenticate with Azure DevOps"
---

If you are dbt Cloud developer who contributes code to the dbt Cloud IDE, and you use Azure DevOps for collaborating on code and building and deploying apps, you need to [link your dbt Cloud profile to Azure DevOps](#link-your-dbt-cloud-profile-to-azure-devops). Linking these two profiles provides access to your Azure DevOps profile from your dbt Cloud profile by authenticating.

:::info Beta feature
This feature is currently in Beta. If you are interested in getting access to the beta, please reach out to support@getdbt.com
:::

## Link your dbt Cloud profile to Azure DevOps

Connect your dbt Cloud profile to Azure DevOps using OAuth:

1. From your profile page, click **Integrations** in the left pane.
2. Click **Link your Azure DevOps Profile**.
3. Once you're redirected to Azure DevOps, sign into your account.
4. When you see the permission request screen from Azure DevOps App, click **Accept**. 

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/profile link.gif" title="Linking your Azure DevOps Profile" /> <Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/OAuth Acceptance.png" title="Azure DevOps Authorization Screen"/>

You will be directed back to dbt Cloud, and your profile should be linked. You are now ready for developing in the IDE!

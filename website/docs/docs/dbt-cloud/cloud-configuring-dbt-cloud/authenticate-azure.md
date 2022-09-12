---
title: "Authenticate with Azure DevOps"
id: "authenticate-azure"
description: "dbt Cloud developers need to authenticate with Azure DevOps."
sidebar_label: "Authenticate with Azure DevOps"
---

<Snippet src="available-beta-banner" />

If you use the dbt Cloud IDE to collaborate on your team's Azure DevOps dbt repo, you need to [link your dbt Cloud profile to Azure DevOps](#link-your-dbt-cloud-profile-to-azure-devops), which provides an extra layer of authentication.

## Link your dbt Cloud profile to Azure DevOps

Connect your dbt Cloud profile to Azure DevOps using OAuth:

1. Click the gear icon at the top right and select **Profile settings**.
2. Click **Linked Accounts**.
3. Next to  Azure DevOps, click **Link**.
   <Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/LinktoAzure.png" title="Azure DevOps Authorization Screen"/>

4. Once you're redirected to Azure DevOps, sign into your account.
5. When you see the permission request screen from Azure DevOps App, click **Accept**. 
   <Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/OAuth Acceptance.png" title="Azure DevOps Authorization Screen"/>

You will be directed back to dbt Cloud, and your profile should be linked. You are now ready to develop in dbt Cloud!
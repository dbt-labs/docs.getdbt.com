---
title: "Authenticate with Azure DevOps"
id: "authenticate-azure"
description: "dbt Cloud developers need to authenticate with Azure DevOps."
sidebar_label: "Authenticate with Azure DevOps"
pagination_next: null
---


If you use the dbt Cloud IDE or dbt Cloud CLI to collaborate on your team's Azure DevOps dbt repo, you need to [link your dbt Cloud profile to Azure DevOps](#link-your-dbt-cloud-profile-to-azure-devops), which provides an extra layer of authentication.

## Link your dbt Cloud profile to Azure DevOps

Connect your dbt Cloud profile to Azure DevOps using OAuth:

1. Click your account name at the bottom of the left-side menu and click **Account settings**
2. Scroll down to **Your profile** and select **Personal profile**.
3. Go to the **Linked accounts** section in the middle of the page.
   <Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/LinktoAzure.png" title="Azure DevOps Authorization Screen"/>

4. Once you're redirected to Azure DevOps, sign into your account.
5. When you see the permission request screen from Azure DevOps App, click **Accept**. 
   <Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/OAuth Acceptance.png" title="Azure DevOps Authorization Screen"/>

You will be directed back to dbt Cloud, and your profile should be linked. You are now ready to develop in dbt Cloud!

## FAQs

<FAQ path="Git/gitignore"/>
<FAQ path="Git/git-migration"/>

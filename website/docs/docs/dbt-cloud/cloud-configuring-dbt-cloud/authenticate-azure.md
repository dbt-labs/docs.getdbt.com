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

1. From your profile page, click **Integrations** in the left pane.
2. Click **Link your Azure DevOps Profile**.
3. Once you're redirected to Azure DevOps, sign into your account.
4. When you see the permission request screen from Azure DevOps App, click **Accept**. 

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/profile link.gif" title="Linking your Azure DevOps Profile" /> <Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/OAuth Acceptance.png" title="Azure DevOps Authorization Screen"/>

You will be directed back to dbt Cloud, and your profile should be linked. You are now ready for developing in the IDE!

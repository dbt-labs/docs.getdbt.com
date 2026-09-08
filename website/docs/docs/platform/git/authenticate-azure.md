---
title: "Authenticate with Azure DevOps"
id: "authenticate-azure"
description: "dbt developers need to authenticate with Azure DevOps."
sidebar_label: "Authenticate with Azure DevOps"
pagination_next: null
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---


If you use the <Constant name="studio_ide" /> or <Constant name="dbt" /> CLI to collaborate on your team's Azure DevOps dbt repo, you need to [link your <Constant name="dbt" /> profile to Azure DevOps](#link-your-dbt-profile-to-azure-devops), which provides an extra layer of authentication.

## Link your dbt profile to Azure DevOps

Connect your <Constant name="dbt" /> profile to Azure DevOps using OAuth:

1. Click your account name at the bottom of the left-side menu and click **Account settings**
2. Scroll down to **Your profile** and select **Personal profile**.
3. Go to the **Linked accounts** section in the middle of the page.
   <Lightbox src="/img/docs/dbt-platform/connecting-azure-devops/LinktoAzure.png" title="Azure DevOps Authorization Screen"/>

4. Once you're redirected to Azure DevOps, sign into your account.
5. When you see the permission request screen from Azure DevOps App, click **Accept**. 
   <Lightbox src="/img/docs/dbt-platform/connecting-azure-devops/OAuth Acceptance.png" title="Azure DevOps Authorization Screen"/>

You will be directed back to <Constant name="dbt" />, and your profile should be linked. You are now ready to develop in <Constant name="dbt" />!

## Troubleshooting

The following section provides troubleshooting steps for common issues when authenticating with Azure DevOps.

<Expandable alt_header="Studio fails to start with an Azure Service User not found error">

If the <Constant name="studio_ide" /> fails to start and displays the following error, your personal Azure DevOps account isn't linked to <Constant name="dbt" />:

`Failed to start server. The project is not fully set up: Azure Service User not found`

The error refers to the account-level service user, but the cause is usually your own Azure DevOps account not being linked. To resolve it, [link your dbt profile to Azure DevOps](#link-your-dbt-profile-to-azure-devops).

If your profile is already linked and you still see `Azure Service User not found`, ask an account admin to check the account-level service user. Refer to [Connect a service user](/docs/platform/git/setup-service-user#connect-a-service-user) for more details.

</Expandable>

## FAQs

<FAQ path="Git/gitignore"/>
<FAQ path="Git/git-migration"/>

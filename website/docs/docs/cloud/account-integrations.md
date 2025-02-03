---
title: "Account integrations in dbt Cloud"
sidebar_label: "Account integrations" 
description: "Learn how to configure account integrations for your dbt Cloud account."
---

The following sections describe the different **Account integrations** available from your dbt Cloud account under the account **Settings** section.

<Lightbox src="/img/docs/dbt-cloud/account-integrations.jpg" title="Example of Account integrations from the sidebar" /> 

## Git integrations

Connect your dbt Cloud account to your Git provider to enable dbt Cloud users to authenticate your personal accounts. dbt Cloud will perform Git actions on behalf of your authenticated self, against repositories to which you have access according to your Git provider permissions.

To configure a Git account integration:
1. Navigate to **Account settings** in the side menu.
2. Under the **Settings** section, click on **Integrations**.
3. Click on the Git provider from the list and select the **Pencil** icon to the right of the provider.
4. dbt Cloud [natively connects](/docs/cloud/git/git-configuration-in-dbt-cloud) to the following Git providers:

   - [GitHub](/docs/cloud/git/connect-github)
   - [GitLab](/docs/cloud/git/connect-gitlab)
   - [Azure DevOps](/docs/cloud/git/connect-azure-devops) <Lifecycle status="enterprise" />

You can connect your dbt Cloud account to additional Git providers by importing a git repository from any valid git URL. Refer to [Import a git repository](/docs/cloud/git/import-a-project-by-git-url) for more information.

<Lightbox src="/img/docs/dbt-cloud/account-integration-git.jpg" width="85%" title="Example of the Git integration page" />

## OAuth integrations

Connect your dbt Cloud account to an OAuth provider that are integrated with dbt Cloud. 

To configure an OAuth account integration:
1. Navigate to **Account settings** in the side menu.
2. Under the **Settings** section, click on **Integrations**.
3. Under **OAuth**, click on **Link** to [connect your Slack account](/docs/deploy/job-notifications#set-up-the-slack-integration).
4. For custom OAuth providers, under **Custom OAuth integrations**, click on **Add integration** and select the [OAuth provider](/docs/cloud/manage-access/sso-overview) from the list. Fill in the required fields and click **Save**.

<Lightbox src="/img/docs/dbt-cloud/account-integration-oauth.jpg" width="85%" title="Example of the OAuth integration page" />

## AI integrations

Once AI features have been [enabled](/docs/cloud/enable-dbt-copilot#enable-dbt-copilot), you can use dbt Labs' AI integration or bring-your-own provider to support AI-powered dbt Cloud features like [dbt Copilot](/docs/cloud/dbt-copilot) and [Ask dbt](/docs/cloud-integrations/snowflake-native-app) (both available on [dbt Cloud Enterprise plans](https://www.getdbt.com/pricing)).

dbt Cloud supports AI integrations for dbt Labs-managed OpenAI keys, Self-managed OpenAI keys, or Self-managed Azure OpenAI keys <Lifecycle status="beta" />.

Note, if you bring-your-own provider, you will incur API calls and associated charges for features used in dbt Cloud.

:::info
dbt Cloud's AI is optimized for OpenAIs gpt-4o. Using other models can affect performance and accuracy, and functionality with other models isn't guaranteed.
:::

To configure the AI integration in your dbt Cloud account, a dbt Cloud admin can perform the following steps:
1. Navigate to **Account settings** in the side menu.
2. Select **Integrations** and scroll to the **AI** section.
3. Click on the **Pencil** icon to the right of **OpenAI** to configure the AI integration.
   <Lightbox src="/img/docs/dbt-cloud/account-integration-ai.jpg" width="85%" title="Example of the AI integration page" />
4. Configure the AI integration for either **dbt Labs OpenAI**, **OpenAI**, or **Azure OpenAI**.

  <Tabs queryString="ai-integration"> 
  <TabItem value="dbtlabs" label="dbt Labs OpenAI">

  1. Select the toggle for **dbt Labs** to use dbt Labs' managed OpenAI key.
  2. Click **Save**.

  <Lightbox src="/img/docs/dbt-cloud/account-integration-dbtlabs.jpg" width="85%" title="Example of the dbt Labs integration page" />
  </TabItem>

  <TabItem value="openai" label="OpenAI">

  1. Select the toggle for **OpenAI** to use your own OpenAI key.
  2. Enter the API key.
  3. Click **Save**.
    <Lightbox src="/img/docs/dbt-cloud/account-integration-openai.jpg" width="85%" title="Example of the OpenAI integration page" />

  </TabItem>

  <TabItem value="azure" label="Azure OpenAI (beta)">
  To learn about deploying your own OpenAI model on Azure, refer to [Deploy models on Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/deploy-models-openai). Configure credentials for your Azure OpenAI deployment in dbt Cloud in the following two ways:
    - [From a Target URI](#from-a-target-uri)
    - [Manually providing the credentials](#manually-providing-the-credentials)

  #### From a Target URI

  1. Locate your Azure OpenAI deployment URI in your Azure Deployment details page.
  2. In the dbt Cloud **Azure OpenAI** section, select the tab **From Target URI**.
  3. Paste the URI into the **Target URI** field.
  4. Enter your Azure OpenAI API key.
  5. Verify the **Endpoint**, **API Version**, and **Deployment Name** are correct.
  6. Click **Save**.
  <Lightbox src="/img/docs/dbt-cloud/account-integration-azure-target.jpg" width="85%" title="Example of Azure OpenAI integration section" />

  #### Manually providing the credentials

  1. Locate your Azure OpenAI configuration in your Azure Deployment details page.
  2. In the dbt Cloud **Azure OpenAI** section, select the tab **Manual Input**.
  2. Enter your Azure OpenAI API key.
  3. Enter the **Endpoint**, **API Version**, and **Deployment Name**.
  4. Click **Save**.
  <Lightbox src="/img/docs/dbt-cloud/account-integration-azure-manual.jpg" width="85%" title="Example of Azure OpenAI integration section" />

  </TabItem>
  </Tabs>

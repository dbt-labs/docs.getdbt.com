--- 
title: "Enable dbt Copilot" 
sidebar_label: "Enable dbt Copilot" 
description: "Enable dbt Copilot, an AI-powered assistant, in dbt to speed up your development." 
---

# Enable dbt Copilot <Lifecycle status="self_service,managed,managed_plus" /> 

<IntroText>
Enable <Constant name="copilot" />, an AI-powered assistant, in <Constant name="cloud" /> to speed up your development and focus on delivering quality data.
</IntroText>

This page explains how to enable <Constant name="copilot" /> in <Constant name="cloud" /> to speed up your development and allow you to focus on delivering quality data.

## Prerequisites

- Available in the <Constant name="dbt_platform" /> only.
- Must have a [<Constant name="cloud" /> Starter, Enterprise, or Enterprise+ account](https://www.getdbt.com/pricing).
  - Certain features like [BYOK](#bringing-your-own-openai-api-key-byok), [natural prompts in Canvas](/docs/cloud/build-canvas-copilot), and more are only available on Enterprise and Enterprise+ plans.
- Development environment is on a supported [release track](/docs/dbt-versions/cloud-release-tracks) to receive ongoing updates.
- By default, <Constant name="copilot" /> deployments use a central OpenAI API key managed by dbt Labs. Alternatively, you can [bring your own OpenAI API key](#bringing-your-own-openai-api-key-byok) (BYOK).
  - For BYOK, ensure your API key has access to the required models:
    - **Text generation models**: GPT-4 or later (GPT-4o, GPT-4 Turbo, or o1 models)
    - **Embedding model**: `text-embedding-3-small`
- Opt-in to AI features by following the steps in the next section in your **Account settings**.

## Enable dbt Copilot

To opt in to <Constant name="copilot" />, a <Constant name="cloud" /> admin can follow these steps:

1. Navigate to **Account settings** in the navigation menu.
2. Under **Settings**, confirm the account you're enabling.
3. Click **Edit** in the top right corner.
4. Enable the **Enable account access to dbt Copilot features** option.
5. Click **Save**. You should now have <Constant name="copilot" /> AI enabled for use.

Note: To disable (only after enabled), repeat steps 1 to 3, toggle off in step 4, and repeat step 5.

<Lightbox src="/img/docs/deploy/example-account-settings.png" width="90%" title="Example of the 'Enable account access to dbt Copilot features' option in Account settings" />

## Bringing your own OpenAI API key (BYOK) <Lifecycle status="managed_plus,managed" /> 

Once AI features have been enabled, you can provide your organization's OpenAI API key. <Constant name="cloud" /> will then leverage your OpenAI account and terms to power <Constant name="copilot" />. This will incur billing charges to your organization from OpenAI for requests made by <Constant name="copilot" />.

Configure AI keys using:
- dbt Labs-managed OpenAI API key
- Your own OpenAI API key
- Azure OpenAI

### AI integrations

Once AI features have been [enabled](/docs/cloud/enable-dbt-copilot#enable-dbt-copilot), you can use dbt Labs' AI integration or bring-your-own provider to support AI-powered <Constant name="cloud" /> features like [<Constant name="copilot" />](/docs/cloud/dbt-copilot) and [Ask dbt](/docs/cloud-integrations/snowflake-native-app).

<Constant name="cloud" /> supports AI integrations for dbt Labs-managed OpenAI keys, Self-managed OpenAI keys, or Self-managed Azure OpenAI keys.

Note, if you bring your own provider, you will incur API calls and associated charges for features used in <Constant name="cloud" />. Bringing your own provider is available for Enterprise or Enterprise+ plans.

To configure the AI integration in your <Constant name="cloud" /> account, a <Constant name="cloud" /> admin can perform the following steps:
1. Click on your account name and select **Account settings** in the side menu.
2. Under **Settings**, click **Copilot**.
3. Under **API Keys**, click the **Pencil** icon to the right of **OpenAI** to configure the AI integration.
   <Lightbox src="/img/docs/dbt-cloud/account-integration-ai.png" width="85%" title="Example of the AI integration page" />
4. Configure the AI integration for either **dbt Labs OpenAI**, **OpenAI**, or **Azure OpenAI**. The following tabs will walk you through the process.

  <Tabs queryString="ai-integration"> 
  <TabItem value="dbtlabs" label="dbt Labs OpenAI">

  1. Select the toggle for **dbt Labs** to use dbt Labs' managed OpenAI key.
  2. Click **Save**.

  <Lightbox src="/img/docs/dbt-cloud/account-integration-dbtlabs.png" width="85%" title="Example of the dbt Labs integration page" />
  </TabItem>

  <TabItem value="openai" label="OpenAI">
  Bringing your own OpenAI key is available for Enterprise or Enterprise+ plans.

  **Prerequisites**:
  - Ensure your OpenAI API key has access to the required models:
    - **Text generation models**: GPT-4 or later (GPT-4o, GPT-4 Turbo, or o1 models)
    - **Embedding model**: `text-embedding-3-small`

  1. Select the toggle for **OpenAI** to use your own OpenAI key.
  2. Enter the API key.
  3. Click **Save**.
  
  <Lightbox src="/img/docs/dbt-cloud/account-integration-openai.png" width="85%" title="Example of the OpenAI integration page" />

  </TabItem>

  <TabItem value="azure" label="Azure OpenAI">
  Bringing your own Azure OpenAI key is available for Enterprise or Enterprise+ plans.

  To learn about deploying your own OpenAI model on Azure, refer to [Deploy models on Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/deploy-models-openai). 
  
  **Prerequisites**:
  - Deploy a text generation model in Azure OpenAI (GPT-4, GPT-4o, GPT-4 Turbo, or o1 models)
  - Deploy the `text-embedding-3-small` embedding model in Azure OpenAI
  - Note the deployment names for both models
  
  Configure credentials for your Azure OpenAI deployment in <Constant name="cloud" /> the following way:

  1. Locate your Azure OpenAI configuration in your Azure Deployment details page.
  2. Enter your Azure OpenAI API key.
  3. Enter the **Endpoint** (your Azure OpenAI resource endpoint URL).
  4. Enter the **API Version** (for example, `2024-02-15-preview` or later).
  5. Enter the **Deployment / Model Name** (the deployment name you created in Azure for your text generation model).
  6. Click **Save**.
  
  <Lightbox src="/img/docs/dbt-cloud/account-integration-azure-manual.png" width="85%" title="Example of Azure OpenAI integration section" />
  
  **Note**: Currently, you only need to configure the text generation model deployment. The embedding model will be supported in future releases, but ensure you have it deployed and ready in your Azure OpenAI resource.

  </TabItem>
  </Tabs>



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
- By default, <Constant name="copilot" /> deployments use a central OpenAI API key managed by dbt Labs. Alternatively, you can [provide your own OpenAI API key](#bringing-your-own-openai-api-key-byok).
  - For [BYOK](#bringing-your-own-openai-api-key-byok), make sure to enable the latest text generation models as well as the `text-embedding-3-small` model.
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

## AI integrations

Once AI features have been [enabled](/docs/cloud/enable-dbt-copilot#enable-dbt-copilot), you can use dbt Labs' AI integration or bring-your-own provider to support AI-powered <Constant name="cloud" /> features like [<Constant name="copilot" />](/docs/cloud/dbt-copilot) and [Ask dbt](/docs/cloud-integrations/snowflake-native-app).

<Constant name="cloud" /> supports AI integrations for dbt Labs-managed OpenAI keys, Self-managed OpenAI keys, or Self-managed Azure OpenAI keys.

Note, if you bring-your-own provider, you will incur API calls and associated charges for features used in <Constant name="cloud" />. Bringing your own provider is available for Enterprise or Enterprise+ plans.

To configure the AI integration in your <Constant name="cloud" /> account, a <Constant name="cloud" /> admin can perform the following steps:
1. Navigate to **Account settings** in the side menu.
2. Select **Integrations** and scroll to the **AI** section.
3. Click on the **Pencil** icon to the right of **OpenAI** to configure the AI integration.
   <Lightbox src="/img/docs/dbt-cloud/account-integration-ai.png" width="85%" title="Example of the AI integration page" />
4. Configure the AI integration for either **dbt Labs OpenAI**, **OpenAI**, or **Azure OpenAI**.

  <Tabs queryString="ai-integration"> 
  <TabItem value="dbtlabs" label="dbt Labs OpenAI">

  1. Select the toggle for **dbt Labs** to use dbt Labs' managed OpenAI key.
  2. Click **Save**.

  <Lightbox src="/img/docs/dbt-cloud/account-integration-dbtlabs.png" width="85%" title="Example of the dbt Labs integration page" />
  </TabItem>

  <TabItem value="openai" label="OpenAI">
  Bringing your own OpenAI key is available for Enterprise or Enterprise+ plans.

  1. Select the toggle for **OpenAI** to use your own OpenAI key.
  2. Enter the API key.
  3. Click **Save**.
    <Lightbox src="/img/docs/dbt-cloud/account-integration-openai.png" width="85%" title="Example of the OpenAI integration page" />

  </TabItem>

  <TabItem value="azure" label="Azure OpenAI">
  Bringing your own Azure OpenAI key is available for Enterprise or Enterprise+ plans.

  To learn about deploying your own OpenAI model on Azure, refer to [Deploy models on Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/deploy-models-openai). Configure credentials for your Azure OpenAI deployment in <Constant name="cloud" /> in the following two ways:
    - [From a Target URI](#from-a-target-uri)
    - [Manually providing the credentials](#manually-providing-the-credentials)

  #### From a Target URI

  1. Locate your Azure OpenAI deployment URI in your Azure Deployment details page.
  2. In the <Constant name="cloud" /> **Azure OpenAI** section, select the tab **From Target URI**.
  3. Paste the URI into the **Target URI** field.
  4. Enter your Azure OpenAI API key.
  5. Verify the **Endpoint**, **API Version**, and **Deployment Name** are correct.
  6. Click **Save**.
  <Lightbox src="/img/docs/dbt-cloud/account-integration-azure-target.png" width="85%" title="Example of Azure OpenAI integration section" />

  #### Manually providing the credentials

  1. Locate your Azure OpenAI configuration in your Azure Deployment details page.
  2. In the <Constant name="cloud" /> **Azure OpenAI** section, select the tab **Manual Input**.
  2. Enter your Azure OpenAI API key.
  3. Enter the **Endpoint**, **API Version**, and **Deployment Name**.
  4. Click **Save**.
  <Lightbox src="/img/docs/dbt-cloud/account-integration-azure-manual.png" width="85%" title="Example of Azure OpenAI integration section" />

  </TabItem>
  </Tabs>



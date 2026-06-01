---
title: "Enable AI in dbt platform"
sidebar_label: "Enable AI in dbt platform"
description: "Enable AI features in the dbt platform, including dbt Wizard and dbt Copilot, to speed up your development."
---

import OpenAiProjectRegion from '/snippets/_open-ai-project-region.md';
import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardPlatformPreviewDisclaimer from '/snippets/_wizard-platform-preview-disclaimer.md';
import CopilotWizardDifferences from '/snippets/_copilot-wizard-diff.md';

# Enable AI in dbt platform <Lifecycle status="self_service,managed,managed_plus" />

<IntroText>
Enable AI features in <Constant name="dbt_platform" /> to speed up your development and focus on delivering quality data.
</IntroText>

You can control AI features in <Constant name="dbt_platform" /> for <Constant name="wizard" /> and dbt Copilot in your **Account settings**.

- **<Constant name="wizard" />**: dbt's innovative and recommended agentic AI layer, available on the <Constant name="dbt_platform" /> and CLI. 
- **dbt Copilot**: Inline AI assistance (code generation, docs, tests, metrics buttons) in <Constant name="studio_ide" />, as well as <Constant name="canvas" /> and <Constant name="insights" />. 

Both experiences are controlled by a single AI toggle in **Account settings**.

## Prerequisites

- Must have a [<Constant name="dbt_platform account" /> on Starter, Enterprise, or Enterprise+ plans](https://www.getdbt.com/pricing).
  - Certain features like [natural prompts in Canvas](/docs/platform/build-canvas-copilot) are only available on Enterprise and Enterprise+ plans.
- Development environment is on a supported [release track](/docs/dbt-versions/dbt-release-tracks) to receive ongoing updates.
- Opt-in to AI features by following the steps in the next section in your **Account settings**.

## Enable AI features

To opt in to AI features, a <Constant name="dbt" /> admin can follow these steps:

1. Navigate to **Account settings** in the navigation menu.
2. Under **Settings**, confirm the account you're enabling.
3. Click **Edit** in the top right corner.
4. Enable the **Enable account access to AI features** option.
5. Click **Save**. You should now have AI features enabled for use.

Note: To disable (only after enabled), repeat steps 1 to 3, toggle off in step 4, and repeat step 5.

<WizardSupportedProviders />

#### dbt Copilot

dbt Copilot supports different AI providers, including bring your own key (BYOK) for Enterprise and Enterprise+ plans:

- dbt Labs-managed OpenAI API key
- BYOK OpenAI API key
- BYOK Azure OpenAI API key

Snowflake Cortex, AWS Bedrock, Azure AI Foundry, and Anthropic aren't supported for dbt Copilot.

<Expandable alt_header="What's the difference between dbt Wizard and dbt Copilot?">

<CopilotWizardDifferences />

</Expandable>

## Configure AI provider <Lifecycle status="managed,managed_plus" />

Once AI features have been [enabled](#enable-ai-features), Enterprise and Enterprise+ accounts can configure a custom AI provider. If you bring your own provider, you will incur API calls and associated charges from that provider.

### dbt Wizard

To configure your AI provider for <Constant name="wizard" />:

1. Click on your account name and select **Account settings** in the side menu.
2. Under **Settings**, click **AI features**.
3. Under **AI providers**, click **Edit** to configure the AI integration.
4. For each provider, select your **Key management** option from the dropdown.

<Tabs queryString="wizard-ai-integration">

  <TabItem value="openai" label="OpenAI">

  **Managed by <Constant name="dbt" /> Labs** (default, no setup required)

  1. Select the toggle for **<Constant name="dbt" /> Labs** to use <Constant name="dbt" /> Labs' managed OpenAI key.
  2. Click **Save**.

  <Lightbox src="/img/docs/dbt-platform/account-integration-dbtlabs.png" width="85%" title="Example of the dbt Labs integration page" />

  **Managed by you** (Enterprise or Enterprise+ plans)

  1. Select **OpenAI** from the options.
  2. Enter your OpenAI API key.
  3. Click **Save**.

  <Lightbox src="/img/docs/dbt-platform/account-integration-openai.png" width="85%" title="Example of the OpenAI integration page" />

  :::info Data residency limitation
  <OpenAiProjectRegion />
  :::

  - For BYOK, enable the latest text generation models as well as the `text-embedding-3-small` model.
  - Ensure your project doesn't have data residency controls enabled. Projects without project region settings use the standard OpenAI endpoint (https://api.openai.com) and support BYOK.

  </TabItem>

  <TabItem value="azure" label="Azure AI Foundry">

  **Managed by you only** (Enterprise or Enterprise+ plans)

  To learn about deploying models on Azure, refer to [Deploy models on Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/deploy-models-openai) and [Azure AI Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/). Configure credentials for your Azure AI Foundry deployment in dbt as follows:

  1. Locate your deployment details in the Azure portal (Azure AI Foundry or Azure OpenAI).
  2. Enter your Azure API key.
  3. Enter the **Endpoint**, **API Version**, and **Deployment / AI model name**.
  4. Click **Save**.

  :::info Use the full Azure Target URI
  For the **Endpoint** field, enter the full Azure Target URI from Azure &mdash; not just the base endpoint. Entering only the base endpoint (for example, `https://<resource>.openai.azure.com`) prevents credential validation and blocks setup.

  Supported formats include:

  - `https://<resource>.openai.azure.com/openai/deployments/<deployment>/chat/completions?api-version=<version>`
  - `https://<resource>.openai.azure.com/openai/responses?api-version=<version>`
  :::

  <Lightbox src="/img/docs/dbt-platform/account-integration-azure-manual.png" width="85%" title="Example of the Azure AI Foundry integration section" />

  </TabItem>

  <TabItem value="anthropic" label="Anthropic">

  **Managed by <Constant name="dbt" /> Labs** (default, no setup required)

  1. Select **<Constant name="dbt" /> Labs** from the list to use <Constant name="dbt" /> Labs' managed Anthropic key.
  2. Click **Save**.

  **Managed by you** (Enterprise or Enterprise+ plans)

  1. Select **Anthropic** from the options.
  2. Enter your Anthropic API key.
  3. Click **Save**.

  :::note Embedding limitations
  When using an Anthropic API key, <Constant name="dbt" /> continues to use the <Constant name="dbt" /> Labs-managed OpenAI key for embeddings in `text_to_sql` MCP tools, since Anthropic doesn't natively provide embeddings.
  :::

  </TabItem>

</Tabs>

### dbt Copilot

To configure your AI provider for dbt Copilot:

1. Click on your account name and select **Account settings** in the side menu.
2. Under **Settings**, click **Copilot**.
3. Under **AI providers**, click **Edit** to configure the AI integration.
4. For each provider, select your **Key management** option from the dropdown.

<Tabs queryString="ai-integration"> 
  <TabItem value="dbtlabs" label="dbt Labs OpenAI">

  1. Select the toggle for **dbt Labs** to use dbt Labs' managed OpenAI key.
  2. Click **Save**.

  <Lightbox src="/img/docs/dbt-platform/account-integration-dbtlabs.png" width="85%" title="Example of the dbt Labs integration page" />
  </TabItem>

  <TabItem value="openai" label="OpenAI">
  Bringing your own OpenAI key is available for Enterprise or Enterprise+ plans.

  1. Select the toggle for **OpenAI** to use your own OpenAI key.
  2. Enter the API key.
  3. Click **Save**.
    <Lightbox src="/img/docs/dbt-platform/account-integration-openai.png" width="85%" title="Example of the OpenAI integration page" />


  :::info Data residency limitation
  <OpenAiProjectRegion />
  :::

  </TabItem>

  <TabItem value="azure" label="Azure OpenAI">
  Bringing your own Azure OpenAI key is available for Enterprise or Enterprise+ plans.

  To learn about deploying your own OpenAI model on Azure, refer to [Deploy models on Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/deploy-models-openai). Configure credentials for your Azure OpenAI deployment in dbt as follows:

  1. Locate your Azure OpenAI configuration in your Azure Deployment details page.
  2. Enter your Azure OpenAI API key.
  3. Enter the **Endpoint**, **API Version**, and **Deployment / Model Name**.
  4. Click **Save**.

  :::info Use the full Azure Target URI
  For the **Endpoint** field, enter the full Azure Target URI from Azure &mdash; not just the base endpoint. Entering only the base endpoint (for example, `https://<resource>.openai.azure.com`) prevents credential validation and blocks setup.

  Supported formats include:

  - `https://<resource>.openai.azure.com/openai/deployments/<deployment>/chat/completions?api-version=<version>`
  - `https://<resource>.openai.azure.com/openai/responses?api-version=<version>`
  :::

  <Lightbox src="/img/docs/dbt-platform/account-integration-azure-manual.png" width="85%" title="Example of Azure OpenAI integration section" />


  - For BYOK, enable the latest text generation models as well as the `text-embedding-3-small` model.
  - Ensure your project doesn't have data residency controls enabled.

  </TabItem>
  </Tabs>

<WizardPlatformPreviewDisclaimer />

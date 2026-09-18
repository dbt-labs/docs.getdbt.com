import OpenAiProjectRegion from '/snippets/_open-ai-project-region.md';

A <Constant name="dbt_platform"/> account on any plan can use a dbt <Term id="managed"/> provider to get started right away or configure a custom AI provider by BYOK. If you use BYOK, you will incur API calls and associated charges from that provider.

The following instructions explain how to configure a dbt Labs managed or BYOK AI provider for <Constant name="wizard" />. dbt managed AI providers are administered by dbt Labs and don’t require a user-provided API key. The AI providers shown in **Account settings** may change as dbt Labs adds <Term id="managed" /> models. For the current list of models and providers, refer to the [Model Provider Rate table](https://www.getdbt.com/legal/dbt-wizard-token-costs-by-model).

**To configure a provider:**

1. Click your account name and select **Account settings** in the side menu.
2. Under **Settings**, click **AI features**.
3. Under **AI providers**, click **Edit** to configure the AI integration.
4. For each provider, select your **Key management** option from the dropdown, then follow these steps for your provider below.

<Tabs queryString="wizard-ai-integration">
  
  <TabItem value="anthropic" label="Anthropic">

  **Managed by dbt Labs**  

  Use this option as a managed alternative to the default OpenAI model.

  1. Unless not selected, select **dbt Labs** from the list to use dbt Labs' managed Anthropic key.
  2. Click **Save**.

  **Managed by you (BYOK)**
  1. Select **Anthropic** from the options.
  2. Enter your Anthropic API key.
  3. Click **Save**.

  :::note Embedding limitations
  When using an Anthropic API key, <Constant name="dbt" /> continues to use the <Constant name="dbt" /> Labs-managed OpenAI key for embeddings in `text_to_sql` MCP tools, since Anthropic doesn't natively provide embeddings.
  :::

  </TabItem>

  <TabItem value="openai" label="OpenAI">

  **Managed by dbt Labs**  

  This is the default option and use it if you want to use dbt managed AI provider keys. Refer to [Models and pricing](/docs/dbt-ai/pricing-billing/overview?version=2.0) for more information.

  1. Unless not selected, select the toggle for **dbt Labs** to use a dbt Labs' managed key.
  2. Click **Save**.

  <Lightbox src="/img/docs/dbt-platform/account-integration-dbtlabs.png" width="85%" title="Example of the dbt Labs integration page" />

  **Managed by you (BYOK)** 

  1. Select **OpenAI** from the options.
  2. Enter your OpenAI API key.
  3. Click **Save**.

  <Lightbox src="/img/docs/dbt-platform/account-integration-openai.png" width="85%" title="Example of the OpenAI integration page" />

  :::info Data residency limitation
  <OpenAiProjectRegion />
  :::

  - For BYOK, enable the latest text generation models as well as the `text-embedding-3-small` model.
  - Ensure your project doesn't have data residency controls enabled. Projects without project region settings use the standard OpenAI endpoint (`https://api.openai.com`) and support BYOK.

  </TabItem>

  <TabItem value="azure" label="Azure AI Foundry">

  **Managed by you only (BYOK)**  

  To learn about deploying models on Azure, refer to [Deploy models on Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/deploy-models-openai) and [Azure AI Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/).

  Configure credentials for your Azure AI Foundry deployment in dbt as follows:

  1. Locate your deployment details in the Azure portal, either in Azure AI Foundry or Azure OpenAI.
  2. Enter your Azure API key.
  3. Enter the **Endpoint**, **API Version**, and **Deployment / AI model name**.
  4. Click **Save**.

  :::info Use the full Azure Target URI
  For the **Endpoint** field, enter the full Azure Target URI from Azure &mdash; not just the base endpoint. Entering only the base endpoint, for example `https://<resource>.openai.azure.com`, prevents credential validation and blocks setup.

  Supported formats include:

  - `https://<resource>.openai.azure.com/openai/deployments/<deployment>/chat/completions?api-version=<version>`
  - `https://<resource>.openai.azure.com/openai/responses?api-version=<version>`
  :::

  <Lightbox src="/img/docs/dbt-platform/account-integration-azure-manual.png" width="85%" title="Example of the Azure AI Foundry integration section" />

  </TabItem>



</Tabs>

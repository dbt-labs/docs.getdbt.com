import OpenAiProjectRegion from '/snippets/_open-ai-project-region.md';

dbt Copilot supports fewer providers than <Constant name="wizard" />, including bring your own key (BYOK) on any plan:

- dbt Labs-<Term id="managed" /> OpenAI API key
- BYOK OpenAI API key
- BYOK Azure OpenAI API key

Snowflake Cortex, AWS Bedrock, Azure AI Foundry, and Anthropic aren't supported for dbt Copilot.

dbt Copilot is available for inline assistance in <Constant name="studio_ide" />, <Constant name="canvas" />, and <Constant name="insights" />. Configure it separately from <Constant name="wizard" /> if your team uses these inline AI experiences.

**To configure a provider:**

1. Click your account name and select **Account settings** in the side menu.
2. Under **Settings**, click **Copilot**.
3. Under **AI providers**, click **Edit** to configure the AI integration.
4. Select your **Key management** option from the dropdown, then follow the steps for your provider below.

<Tabs queryString="copilot-ai-integration">

  <TabItem value="dbtlabs" label="dbt Labs OpenAI">

  1. Select the toggle for **dbt Labs** to use dbt Labs' managed OpenAI key.
  2. Click **Save**.

  <Lightbox src="/img/docs/dbt-platform/account-integration-dbtlabs.png" width="85%" title="Example of the dbt Labs integration page" />

  </TabItem>

  <TabItem value="openai" label="OpenAI">

  1. Select the toggle for **OpenAI** to use your own OpenAI key.
  2. Enter the API key.
  3. Click **Save**.

  <Lightbox src="/img/docs/dbt-platform/account-integration-openai.png" width="85%" title="Example of the OpenAI integration page" />

  :::info Data residency limitation
  <OpenAiProjectRegion />
  :::

  </TabItem>

  <TabItem value="azure" label="Azure OpenAI">


  To learn about deploying your own OpenAI model on Azure, refer to [Deploy models on Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/deploy-models-openai).

  Configure credentials for your Azure OpenAI deployment in dbt as follows:

  1. Locate your Azure OpenAI configuration in your Azure Deployment details page.
  2. Enter your Azure OpenAI API key.
  3. Enter the **Endpoint**, **API Version**, and **Deployment / Model Name**.
  4. Click **Save**.

  :::info Use the full Azure Target URI
  For the **Endpoint** field, enter the full Azure Target URI from Azure &mdash; not just the base endpoint. Entering only the base endpoint, for example `https://<resource>.openai.azure.com`, prevents credential validation and blocks setup.

  Supported formats include:

  - `https://<resource>.openai.azure.com/openai/deployments/<deployment>/chat/completions?api-version=<version>`
  - `https://<resource>.openai.azure.com/openai/responses?api-version=<version>`
  :::

  <Lightbox src="/img/docs/dbt-platform/account-integration-azure-manual.png" width="85%" title="Example of Azure OpenAI integration section" />

  - For BYOK, enable the latest text generation models as well as the `text-embedding-3-small` model.
  - Ensure your project doesn't have data residency controls enabled.

  </TabItem>

</Tabs>

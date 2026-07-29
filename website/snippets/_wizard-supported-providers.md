## Supported AI providers

#### dbt Wizard

<Constant name="wizard" /> supports different AI providers depending on where you use it.

<SimpleTable>

| Provider | <Constant name="wizard" /> in <Constant name="dbt_platform" /> | <Constant name="wizard" /> CLI |
|---|---|---|
| [OpenAI](https://openai.com/policies/row-terms-of-use/) | ✓ (<Term id="managed" /> or BYOK) | ✓ (OpenAI subscription or BYOK) |
| [Anthropic](https://www.anthropic.com/legal/consumer-terms)<sup>†</sup> | ✓ (BYOK) | ✓ (BYOK) |
| [Azure AI Foundry](https://www.microsoft.com/licensing/terms) / Azure OpenAI | ✓ (BYOK) | ✓ (BYOK) |
| [AWS Bedrock](https://aws.amazon.com/service-terms/) |- | ✓ (BYOK) |
| [Google Gemini](https://ai.google.dev/gemini-api/terms) | - | ✓ (BYOK) |
| [Snowflake Cortex](https://www.snowflake.com/en/legal/terms-of-service/) | - | ✓ (BYOK) |
| [Databricks Unity AI Gateway](https://www.databricks.com/legal/mcsa) | - | ✓ (BYOK) |

</SimpleTable>

<sup>†</sup> *Anthropic enterprise and subscription licenses (such as Claude Enterprise) aren't supported per Anthropic's [terms of service](https://www.anthropic.com/legal/consumer-terms). BYOK requires an Anthropic API key.*

Refer to the following pages for more information:
- [Configure <Constant name="dbt_platform" />](/docs/platform/wizard-byok-platform) integrations in account settings.
- [Configure BYOK for the CLI](/docs/dbt-ai/wizard-byok) by running `wizard providers configure PROVIDER_NAME` and follow the prompts.

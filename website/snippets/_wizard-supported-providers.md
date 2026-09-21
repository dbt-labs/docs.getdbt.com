<Constant name="wizard" /> supports [<Term id="managed" /> models](/docs/dbt-ai/pricing-billing/overview#dbt-managed-providers) (billed by dbt Labs, no key to manage) and [bring-your-own-key (BYOK)](/docs/dbt-ai/wizard-byok) models (billed directly by your provider).

Here are the following AI providers supported depending on where you work. Refer to [Model Provider Rate table](https://www.getdbt.com/legal/dbt-wizard-token-costs-by-model) for the full list of available models. 

<Tabs defaultValue={props.defaultSurface || "platform"}>

<TabItem value="platform" label="dbt platform">

<SimpleTable>

| Provider | Access |
|---|---|
| [OpenAI](https://openai.com/policies/row-terms-of-use/) (default) | dbt <Term id="managed" /> or BYOK |
| [Anthropic](https://www.anthropic.com/legal/consumer-terms)† | dbt <Term id="managed" /> or BYOK |
| Open weight models (like DeepSeek, Kimi, and so on). | dbt <Term id="managed" /> |
| [Azure AI Foundry](https://www.microsoft.com/licensing/terms) / Azure OpenAI | BYOK |

</SimpleTable>

</TabItem>

<TabItem value="local" label="Locally (CLI)">

<SimpleTable>

| Provider | Access |
|---|---|
| [OpenAI](https://openai.com/policies/row-terms-of-use/) | dbt <Term id="managed" /> or BYOK |
| [Anthropic](https://www.anthropic.com/legal/consumer-terms)† | dbt <Term id="managed" /> or BYOK |
| Open weight models (like DeepSeek, Kimi, and so on).  | dbt <Term id="managed" /> |
| [Azure AI Foundry](https://www.microsoft.com/licensing/terms) / Azure OpenAI | BYOK |
| [AWS Bedrock](https://aws.amazon.com/service-terms/) | BYOK |
| [Google Gemini](https://ai.google.dev/gemini-api/terms) | BYOK |
| [Snowflake Cortex](https://www.snowflake.com/en/legal/terms-of-service/) | BYOK |
| [Databricks Unity AI Gateway](https://www.databricks.com/legal/mcsa) | BYOK |

</SimpleTable>

You can also connect a personal OpenAI ChatGPT subscription instead of a key.

</TabItem>

</Tabs>

†Anthropic enterprise and subscription licenses (such as Claude Enterprise) aren't supported per Anthropic's [terms of service](https://www.anthropic.com/legal/consumer-terms).

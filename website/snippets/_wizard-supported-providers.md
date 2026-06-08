## Supported AI providers

#### dbt Wizard

<Constant name="wizard" /> supports different AI providers depending on where you use it.

<SimpleTable>

| Provider | <Constant name="wizard" /> in <Constant name="dbt_platform" /> | <Constant name="wizard" /> CLI |
|---|---|---|
| [OpenAI](https://openai.com/policies/row-terms-of-use/) | ✓ (managed* or BYOK) | ✓ (OpenAI subscription or BYOK) |
| [Anthropic](https://www.anthropic.com/legal/consumer-terms)<sup>†</sup> | ✓ (BYOK) | ✓ (BYOK) |
| [Azure AI Foundry](https://www.microsoft.com/licensing/terms) / Azure OpenAI | ✓ (BYOK) | ✓ (BYOK) |
| [AWS Bedrock](https://aws.amazon.com/service-terms/) |- | ✓ (BYOK) |
| [Snowflake Cortex](https://www.snowflake.com/en/legal/terms-of-service/) | - | ✓ (BYOK) |
</SimpleTable>

\* *Managed: <Constant name="dbt" /> Labs manages the AI provider connection; no user provider key is required. Refer to [Billing](/docs/platform/billing?version=2.0&name=Fusion#temporary-dbt-copilot-actions-bridge-through-july-1) for more info.*

<sup>†</sup> *Anthropic enterprise and subscription licenses (such as Claude Enterprise) aren't supported per Anthropic's [terms of service](https://www.anthropic.com/legal/consumer-terms). BYOK requires an Anthropic API key.*

<br />

- [Configure <Constant name="dbt_platform" />](/docs/platform/enable-dbt-ai#enable-ai-features) integrations in account settings. BYOK is available for Enterprise and Enterprise+ plans.
- [Configure BYOK for the CLI](/docs/dbt-ai/wizard-byok). For OpenAI subscription support in the CLI, run `wizard providers configure openai_subscription` and follow the prompts.

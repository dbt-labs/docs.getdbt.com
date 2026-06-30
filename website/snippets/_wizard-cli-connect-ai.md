<Tabs>
<TabItem value="dbt-login" label="Sign in with dbt (recommended)" default>

Run `dbt login` to sign in to &mdash; or create &mdash; a <Constant name="dbt_platform" /> account. <Constant name="wizard" /> then uses the managed `dbt` provider, so there's no separate API key to create, bill, or rotate. It's the fastest way to get started, and the same login works across the dbt CLI, the [dbt VS Code extension](/docs/about-dbt-extension), and <Constant name="wizard" />.

```shell
dbt login
```

This opens a browser to sign in or create an account. You can also sign in at the browser prompt during onboarding.

</TabItem>
<TabItem value="byok" label="Bring your own key">

Prefer a fully self-managed setup with no <Constant name="dbt_platform" /> account? Bring your own key for a supported provider (OpenAI, Anthropic, AWS Bedrock, Azure, Gemini, or Snowflake). The simplest path: when first-run onboarding prompts you, select your provider and paste your API key **at the prompt** &mdash; entering it there keeps it out of your shell history and stores it in `~/.dbt/wizard/provider-auth.json`. To add or switch providers later, run `wizard providers configure PROVIDER_NAME` or type `/providers` in a session. For all provider options, refer to [Configure BYOK](/docs/dbt-ai/wizard-byok).

:::caution Keep your API key safe
Treat your provider key like a password. Prefer entering it at the onboarding prompt rather than as a shell command, since environment variables and command-line values can persist in your shell history. Never commit keys to version control or paste them into shared logs, screenshots, or chats, and rotate any key that's been exposed.
:::

<Expandable alt_header="Set the key with an environment variable instead">

For headless runs (like `wizard exec`) or to reuse a key across sessions, set it as an environment variable before starting <Constant name="wizard" />:

```shell
export OPENAI_API_KEY="sk-..."
```

For Amazon Bedrock, the variable is `AWS_BEARER_TOKEN_BEDROCK` (a common mistake is `AWS_BEDROCK_TOKEN`, which <Constant name="wizard" /> doesn't read):

```shell
export AWS_BEARER_TOKEN_BEDROCK="ABSK..."
```

Environment variables can persist in your shell history. To set a key without echoing it, refer to [Configure BYOK](/docs/dbt-ai/wizard-byok#set-your-api-key).

</Expandable>

</TabItem>
</Tabs>

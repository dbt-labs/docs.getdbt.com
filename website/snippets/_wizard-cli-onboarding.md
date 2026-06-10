

The first time you start <Constant name="wizard" /> in a project, it walks you through a short setup and saves your answers to [`wizard_config.toml`, `providers.json`, and `provider-auth.json`](/docs/dbt-ai/wizard-config), so you only do this once per project. You'll be asked to:

- Review and accept the **Terms of Use**.
- If you have a <Constant name="dbt_platform" /> account, sign in through the browser authentication link when prompted and follow the steps in the browser.
- **Trust the directory** so <Constant name="wizard" /> can read your project.
- Confirm the **path to your dbt executable or virtual environment** &mdash; point it at `/path/to/bin/dbt` or a `.venv` root (<Constant name="wizard" /> uses `bin/dbt` automatically).
- Add any **extra compile flags** to append to the startup `dbt compile -s state:modified+`, or leave empty to skip.
- **Configure [deferral](/docs/dbt-ai/wizard-config#deferral)** &mdash; choose **Wizard** (<Constant name="wizard" /> manages it), **Manual**, or **Disabled**. If you choose **Wizard**, enter the `profiles.yml` target to defer to (defaults to `prod`). On the <Constant name="fusion_engine" /> connected to the <Constant name="dbt_platform" />, <Constant name="wizard" /> instead offers to let the platform handle deferral.
- Confirm your **detected dbt profile and target**, or customize the profile, target, or `profiles.yml` path.
- **Configure a provider** (OpenAI subscription, OpenAI API key, Anthropic, Amazon Bedrock, Azure, Gemini, or Snowflake). Refer to [Configure BYOK](/docs/dbt-ai/wizard-byok).

To re-run any of these steps later, refer to [Re-trigger onboarding flows](/docs/dbt-ai/wizard-config#re-trigger-onboarding-flows).

:::tip Set your API key without the prompt
During onboarding, <Constant name="wizard" /> prompts you to configure a provider interactively. To skip the API key prompt &mdash; for headless runs like `wizard exec` or to reuse your key across sessions &mdash; set it as an environment variable before starting `wizard` instead:

```bash
export OPENAI_API_KEY="sk-..."                  # or ANTHROPIC_API_KEY
export AWS_BEARER_TOKEN_BEDROCK="ABSK..."       # for Amazon Bedrock
```

For AWS Bedrock and Snowflake Cortex, refer to [Configure BYOK](/docs/dbt-ai/wizard-byok).
:::

After onboarding, <Constant name="wizard" /> shows a welcome screen with two sections:

- **STATUS** &mdash; the <Constant name="wizard" /> version, the active AI model (change it with `/model`), and your project directory.
- **OVERVIEW** &mdash; a snapshot of your project from the [metadata engine](/docs/dbt-ai/wizard-how-it-works#native-metadata-engine): build status and a count of passing (✓), warning (⚠), and failing (✗) checks.

Enter `/` to see the available [slash commands](/docs/dbt-ai/wizard-slash-commands), or try `/overview` for a summary of your project. CLI commands use the `wizard` prefix, so you can also run [subcommands](/docs/dbt-ai/wizard-cli-reference) such as `wizard exec`, `wizard review`, and `wizard resume`.

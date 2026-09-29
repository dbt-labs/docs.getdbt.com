import WizardPrompts from '/snippets/wizard-prompts.md';

<VersionBlock lastVersion="1.99">

:::tip Upgrade for automatic updates
Upgrade to [v2](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2) to run <Constant name="wizard"/> as `wizard` and get automatic updates.
:::

</VersionBlock>

<Steps>

<Step title="Install the dbt Wizard CLI">

Run the install script for your operating system:

macOS/Linux:

```bash
curl -fsSL https://public.cdn.getdbt.com/dbt-wizard/install/install-wizard.sh | sh
```

Windows (PowerShell):

```powershell
irm https://public.cdn.getdbt.com/dbt-wizard/install/install-wizard.ps1 | iex
```

This installs <Constant name="wizard"/> to `/usr/local/bin/wizard`, along with the dbt [metadata engine](/docs/dbt-ai/wizard-how-it-works#native-metadata-engine) that powers <Constant name="wizard"/>'s project-aware answers. For install and update details, refer to [Install <Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-cli); to remove them, refer to [Uninstall](/docs/dbt-ai/wizard-cli#uninstall).

</Step>

<Step title="Start a session">

Verify the install and start an interactive session in your project:

```bash
wizard --version   # confirm the install
wizard             # start a session
```

The first time you run `wizard` in a project, it walks you through a short setup and saves your answers to `wizard_config.toml`, `providers.json`, and `provider-auth.json`, so you only do this once per project.

</Step>

<Step title="Choose how AI usage is billed">

Choose one of the following options:

- **dbt-managed:** Run `dbt login` (or `wizard login`) to start a 30-day trial that includes $100 in usage credits. That one command creates your free <Constant name="dbt" /> account if you don't have one and provisions the trial &mdash; no <Constant name="dbt_platform" /> plan and no AI provider key required.
    - The first time you run `dbt login`, a browser window opens where you can sign in to or create a <Constant name="dbt_platform" /> account to manage billing.
    - You can't pause the trial once it starts. After 30 days, or when your usage credits run out (whichever comes first), add a credit card or an enterprise contract to continue, and set a spend limit. For details, refer to [Trial and billing](/docs/dbt-ai/pricing-billing/trial-and-billing) and the [dbt Wizard billing and AI access FAQs](/docs/dbt-ai/wizard-billing-faqs).
- **Bring your own key (BYOK):** Use an API key from a supported provider. Your AI provider bills you directly. Refer to [Configure BYOK](/docs/dbt-ai/wizard-byok).

</Step>

<Step title="Complete the setup prompts">

During setup, you'll also be asked to:

- Review and accept the Terms of Use.
- Trust the directory so <Constant name="wizard" /> can read your project.
- Confirm your dbt executable, virtual environment, profile, and target.
- Choose how to handle [deferral](/docs/dbt-ai/wizard-config#deferral).
- Configure the AI access option you chose.

To re-run any of these steps later, refer to [Re-trigger onboarding flows](/docs/dbt-ai/wizard-config#re-trigger-onboarding-flows).

:::tip Set your API key without the prompt
During onboarding, <Constant name="wizard" /> prompts you to configure a provider interactively.

<Expandable alt_header="Set key as environment variable for headless runs or to reuse key">

To skip the API key prompt &mdash; for headless runs like `wizard exec` or to reuse your key across sessions &mdash; set it as an environment variable before starting `wizard` instead. For example:

```bash
export OPENAI_API_KEY="sk-..."                  # or ANTHROPIC_API_KEY
export AWS_BEARER_TOKEN_BEDROCK="ABSK..."       # for Amazon Bedrock
```

Refer to [Configure BYOK](/docs/dbt-ai/wizard-byok) for more examples.

</Expandable>

:::

</Step>

<Step title="Review and ask your first question">

After onboarding, <Constant name="wizard" /> shows a welcome screen with **STATUS** (version, active model &mdash; change it with `/model` &mdash; and project directory) and **OVERVIEW** (a snapshot of your project's build status and passing, warning, and failing checks from the [metadata engine](/docs/dbt-ai/wizard-how-it-works#native-metadata-engine)).

Enter `/` to see the available [slash commands](/docs/dbt-ai/wizard-slash-commands), then ask your first question:

<WizardPrompts />

</Step>

</Steps>

import WizardCliInstall from '/snippets/_wizard-cli-install-by-version.md';
import WizardCliOnboarding from '/snippets/_wizard-cli-onboarding.md';
import NewToTerminal from '/snippets/_new-to-terminal.md';
import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';
import WizardCliDbtCliSupport from '/snippets/_wizard-cli-dbt-cli-support.md';

<div style={{maxWidth: '900px'}}>

# Building with <Constant name="wizard" /> CLI and DuckDB

<IntroText>
Install <Constant name="wizard" /> CLI, create a local DuckDB dbt project, and use <Constant name="wizard" /> to make, test, and document a real dbt change.
</IntroText>

In this guide, you'll create a local Magic Shop dbt project, load sample data into DuckDB, ask <Constant name="wizard" /> to inspect the project, have <Constant name="wizard" /> propose tests and docs for a staging model, and validate the change with `dbt build`. It takes about 7-8 minutes.

By the end of this guide, you'll have:

- <Constant name="wizard" /> CLI installed and connected to AI &mdash; through your <Constant name="dbt_platform" /> account or your own provider key
- A local DuckDB project built with the <Constant name="fusion_engine" /> that <Constant name="wizard" /> can inspect
- A first <Constant name="wizard" /> session that explains the project
- A small dbt change proposed by <Constant name="wizard" />, reviewed by you, documented, and validated with dbt

## Prerequisites

You'll need:

- A terminal and basic familiarity with `cd`, `ls`, and `pwd`
- Python 3.9 or later
- A way to connect <Constant name="wizard" /> to AI &mdash; either a <Constant name="dbt_platform" /> account (you can create one with `dbt login`) or your own [provider key](/docs/dbt-ai/wizard-byok) (OpenAI, Anthropic, AWS Bedrock, Azure, Gemini, or Snowflake). You'll choose during setup.

<WizardCliDbtCliSupport />

<NewToTerminal />

## 1. Install <Constant name="wizard" />

<Constant name="wizard" /> CLI is a standalone tool you can point at any dbt project. In this guide, you'll point it at a tiny DuckDB project you create next.

<WizardCliInstall />

## 2. Create a local DuckDB project

Use the setup script to create a complete Magic Shop dbt project locally. The script creates a project folder, installs the <Constant name="fusion_engine" /> in a virtual environment, writes sample seed and model files, loads the seed data into DuckDB, and runs `dbt build`.

```shell
curl -fsSL https://docs.getdbt.com/files/wizard/setup-magic-shop-duckdb.sh | bash
```

The setup creates a new `magic_shop_wizard` directory. To use a different directory name, set `PROJECT_DIR`:

```shell
curl -fsSL https://docs.getdbt.com/files/wizard/setup-magic-shop-duckdb.sh | PROJECT_DIR=my_wizard_project bash
```

You should see a successful run with four seeds and four view models. The project contains:

<SimpleTable>

| Path | Purpose |
| --- | --- |
| `seeds/*.csv` | Magic Shop sample data loaded into DuckDB |
| `models/staging/*.sql` | Staging models that clean up the seed data |
| `dbt_project.yml` | Local dbt project configuration |
| `profiles.yml` | Local DuckDB profile used by this quickstart |
| `magic_shop.duckdb` | Local DuckDB database file created by dbt |

</SimpleTable>

If `dbt build` fails, fix the dbt project before continuing. <Constant name="wizard" /> works best when it can compile and inspect your project.

## 3. Start <Constant name="wizard" />

The setup script built the project, and you've installed <Constant name="wizard" /> CLI. From your project directory:

1. Activate the virtual environment:

    ```shell
    cd magic_shop_wizard
    source .venv/bin/activate
    ```

2. Start <Constant name="wizard" />:

    ```shell
    wizard
    ```

<Constant name="wizard" /> needs an AI provider before it can answer prompts or propose changes. Choose one of these paths:

<Tabs>
<TabItem value="dbt-login" label="Sign in with dbt (recommended)" default>

Run `dbt login` to sign in to &mdash; or create &mdash; a <Constant name="dbt_platform" /> account. <Constant name="wizard" /> then uses the managed `dbt` provider, so there's no separate API key to create, bill, or rotate. It's the fastest way to get started, and your login is shared across the dbt CLI, the [dbt VS Code extension](/docs/about-dbt-extension), and <Constant name="wizard" />.

```shell
dbt login
```

This opens a browser to sign in or create an account. You can also sign in at the browser prompt during onboarding.

</TabItem>
<TabItem value="byok" label="Bring your own key">

Prefer a fully self-managed setup with no <Constant name="dbt_platform" /> account? Bring your own key for a supported provider (OpenAI, Anthropic, AWS Bedrock, Azure, Gemini, or Snowflake). During onboarding, select your provider and paste your API key **at the prompt** &mdash; entering it there keeps it out of your shell history and stores it in `~/.dbt/wizard/provider-auth.json`. For all provider options, refer to [Configure BYOK](/docs/dbt-ai/wizard-byok).

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

Complete first-run onboarding:

<WizardCliOnboarding />

When <Constant name="wizard" /> asks for your dbt profile location, use this project directory. The setup script writes `profiles.yml` in the project root, where <Constant name="fusion" /> can find it.

## 4. Ask <Constant name="wizard" /> to explain the project

Send prompts one at a time: enter a prompt, press **Enter**, and review the response before sending the next one.

Start with a read-only prompt to confirm <Constant name="wizard" /> understands your project:

```text
summarize what this project does
```

<Constant name="wizard" /> reads your project's models, seeds, and metadata and returns a quick summary in seconds &mdash; without changing anything. That's your first result.

Once you've reviewed the summary, ask <Constant name="wizard" /> to find a gap to fix:

```text
which staging models are missing tests?
```

Review the response and pick one model to improve in the next step.

## 5. Make your first dbt change

Ask <Constant name="wizard" /> to add tests and docs to one staging model:

```text
add not_null and unique tests to wizard_id in stg_wizards, and add clear column descriptions for the model
```

<Constant name="wizard" /> proposes a diff before it writes changes. Review the diff, then approve, reject, or redirect the change.

## 6. Validate the change

After you apply a change, run dbt from the same project directory:

```shell
dbt build --select stg_wizards+
```

If the command succeeds, review the changed files:

```shell
git diff
```

You should see a YAML change that adds tests and descriptions for `stg_wizards`. The `dbt build` command confirms that the model, tests, and YAML parse cleanly.

If the command fails, return to <Constant name="wizard" /> and paste the error message:

```text
dbt build failed with this error: ERROR_MESSAGE
```

Replace `ERROR_MESSAGE` with the error from your terminal.

## 7. Review before you commit

Use <Constant name="wizard" /> to review your local changes:

```shell
wizard review --uncommitted
```

Then commit the change with your usual Git workflow:

```shell
git status
git add .
git commit -m "Add tests and docs for staging model"
```

## What just happened

You installed <Constant name="wizard" /> CLI, created a local DuckDB project with the <Constant name="fusion_engine" />, loaded sample data with seeds, built staging models, and started <Constant name="wizard" /> in the project. <Constant name="wizard" /> used your dbt project files and build context to answer questions, propose tests and docs, and help you validate the change.

## Troubleshooting

### Wizard cannot find dbt

Confirm that your dbt executable works from the same terminal:

```shell
dbt --version
dbt compile
```

If your project uses a virtual environment, activate it before starting <Constant name="wizard" />.

### Provider authentication fails

Run `/providers` in the interactive <Constant name="wizard" /> session and check that your provider is enabled and authenticated. For BYOK setup details, refer to [Configure BYOK](/docs/dbt-ai/wizard-byok).

### The sample project does not build

Run `dbt debug`, `dbt seed`, and `dbt build` before starting <Constant name="wizard" />. Fix profile, seed, or model errors first.

## Next steps

- Try more [Wizard use cases](/docs/dbt-ai/wizard-use-cases)
- Configure default models and project settings in [Configuration reference](/docs/dbt-ai/wizard-config)
- Add reusable project guidance with [Wizard skills](/docs/dbt-ai/wizard-skills)
- Learn how <Constant name="wizard" /> uses [deferral and state](/docs/dbt-ai/wizard-how-it-works#deferral-and-state), or read more about [dbt state](/docs/deploy/dbt-state-about)
- Connect a real project to the <Constant name="dbt_platform" /> when you're ready to deploy scheduled jobs
- Install the [dbt VS Code extension](/docs/about-dbt-extension) if you want dbt editing help in your IDE too

<WizardFeedbackCallout />

</div>

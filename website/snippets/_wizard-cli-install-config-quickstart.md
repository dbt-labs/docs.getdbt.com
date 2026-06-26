import WizardCliInstall from '/snippets/_wizard-cli-install-by-version.md';
import NewToTerminal from '/snippets/_new-to-terminal.md';
import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';
import WizardCliDbtCliSupport from '/snippets/_wizard-cli-dbt-cli-support.md';

<div style={{maxWidth: '900px'}}>

# Getting started with <Constant name="wizard" /> CLI

<IntroText>
Install <Constant name="wizard" /> CLI, connect it to AI, and configure it for an existing dbt project in about five minutes.
</IntroText>

Use this quickstart when you already have a dbt project and want to start using <Constant name="wizard" /> from your terminal. If you want a guided sample project instead, follow the [end-to-end <Constant name="wizard" /> CLI guide](/guides/wizard-cli-qs).

## 1. Install <Constant name="wizard" />

<WizardCliInstall />

(Be warned, the wizard has been known to <WizardPopcorn>cast spells</WizardPopcorn>.)

## 2. Check your setup

You'll need:

- A terminal and basic familiarity with `cd`, `ls`, and `pwd`
- An existing dbt project that can run `dbt compile`, `dbt parse`, or `dbt build`
- A way to connect <Constant name="wizard" /> to AI: sign in with your <Constant name="dbt_platform" /> account, or bring your own [provider key](/docs/dbt-ai/wizard-byok)

<WizardCliDbtCliSupport />

<NewToTerminal />

Open your dbt project and confirm dbt works:

```shell
cd PATH_TO_YOUR_DBT_PROJECT
dbt compile
```

If your project uses a virtual environment, activate it first:

```shell
source .venv/bin/activate
```

Replace `PATH_TO_YOUR_DBT_PROJECT` with the folder that contains your `dbt_project.yml` file.

## 3. Connect an AI provider

Choose one path:

<Tabs>
<TabItem value="dbt-login" label="Sign in with dbt (recommended)" default>

Run `dbt login` to sign in to your <Constant name="dbt_platform" /> account or create one:

```shell
dbt login
```

This opens a browser. After you sign in, <Constant name="wizard" /> can use the managed `dbt` provider. You don't need to create, bill, or rotate a separate API key.

</TabItem>
<TabItem value="byok" label="Bring your own key">

Configure a provider in the terminal:

```shell
wizard providers configure PROVIDER_NAME
wizard providers enable PROVIDER_NAME
```

Replace `PROVIDER_NAME` with a supported provider, such as `openai`, `anthropic`, `bedrock`, `azure`, `gemini`, or `snowflake`. You can also configure providers from the interactive session with `/providers`.

:::caution Keep your API key safe
Treat your provider key like a password. Never commit keys to version control, paste them into shared logs, or include them in screenshots.
:::

For provider details, refer to [Configure BYOK](/docs/dbt-ai/wizard-byok).

</TabItem>
</Tabs>

## 4. Start and configure <Constant name="wizard" />

From your dbt project directory, start a session:

```shell
wizard
```

First-run setup saves your answers to files in `~/.dbt/wizard/`, so you only do this once per project.

For the fastest path:

- Accept the **Terms of Use**
- Trust the project directory
- Confirm the path to your dbt executable or virtual environment
- Leave extra compile flags blank unless your project needs them for `dbt compile`
- Choose **Wizard** for deferral if you have a stable target to defer to, or **Disabled** for a simple local setup
- Confirm your dbt profile and target
- Configure your provider if prompted

For more about these settings, refer to the [config reference](/docs/dbt-ai/wizard-config).

## 5. Send your first prompt

Start with a read-only prompt:

```text
summarize this dbt project and list the models with missing tests
```

<Constant name="wizard" /> reads your project files and dbt metadata, then returns a project summary without changing anything.

## Useful commands

<SimpleTable>

| Command | Use it to |
| --- | --- |
| `wizard` | Start an interactive session |
| `wizard "PROMPT"` | Start a session with an initial prompt |
| `wizard exec "PROMPT"` | Run one prompt and exit |
| `wizard review --uncommitted` | Review local changes before you commit |
| `wizard resume --last` | Resume your last session |

</SimpleTable>

## Next steps

- Try the [end-to-end DuckDB guide](/guides/wizard-cli-qs) to make, test, and document a real dbt change
- Learn more about [installing, updating, and uninstalling <Constant name="wizard" />](/docs/dbt-ai/wizard-cli)
- Explore [Wizard use cases](/docs/dbt-ai/wizard-use-cases)
- Configure providers with [BYOK](/docs/dbt-ai/wizard-byok)
- Configure models, deferral, and trusted projects in the [config reference](/docs/dbt-ai/wizard-config)
- Install the [dbt VS Code extension](/docs/about-dbt-extension) if you want dbt editing help in your IDE too

<WizardFeedbackCallout />

</div>

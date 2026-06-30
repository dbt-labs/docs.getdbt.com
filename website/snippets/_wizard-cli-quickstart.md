import WizardCliInstall from '/snippets/_wizard-cli-install-by-version.md';
import WizardCliOnboarding from '/snippets/_wizard-cli-onboarding.md';
import NewToTerminal from '/snippets/_new-to-terminal.md';
import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';
import WizardCliDbtCliSupport from '/snippets/_wizard-cli-dbt-cli-support.md';

<div style={{maxWidth: '900px'}}>

# Building with <Constant name="wizard" /> CLI and DuckDB

<IntroText>
Create a local DuckDB dbt project, then use <Constant name="wizard" /> to inspect it, make a change, and validate it &mdash; all from your terminal. Takes about 7-8 minutes.
</IntroText>

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

You don't have to leave <Constant name="wizard" /> to check your work. Ask it to build and test the model:

```text
build stg_wizards and its downstream models, then tell me whether the tests pass
```

<Constant name="wizard" /> runs `dbt build --select stg_wizards+` for you (with your approval) and reports the result. If a model or test fails, it reads the error and proposes a fix &mdash; no copying error messages back and forth. That's the difference from a plain terminal: <Constant name="wizard" /> can run dbt and act on what it finds.

:::tip Prefer to run it yourself?
You can still run any command directly in another terminal &mdash; for example, `dbt build --select stg_wizards+`.
:::

## 7. Review and commit

Ask <Constant name="wizard" /> to review everything before you commit:

```text
review my uncommitted changes and summarize what changed
```

When you're happy with the summary, let <Constant name="wizard" /> commit for you:

```text
commit these changes with a clear message
```

<Constant name="wizard" /> stages the files and writes the commit (with your approval). Prefer to do it by hand? Run `wizard review --uncommitted` or your usual `git` commands instead.

## What just happened

You installed <Constant name="wizard" /> CLI, created a local DuckDB project with the <Constant name="fusion_engine" />, loaded sample data with seeds, built staging models, and started <Constant name="wizard" /> in the project. <Constant name="wizard" /> used your dbt project files and build context to answer questions, propose tests and docs, and help you validate the change.

## Optional: feel the full power of dbt

You now have a working dbt and <Constant name="wizard" /> setup. These optional add-ons layer on more dbt features so you can see how they fit together. Each one is self-contained &mdash; do them in any order, or skip them.

<Expandable alt_header="See dbt state and deferral in action">

dbt can build only what changed by comparing your project to a previous run. It's the same state mechanism <Constant name="wizard" /> uses for [deferral](/docs/dbt-ai/wizard-how-it-works#deferral-and-state).

1. Build the project once and save the result as a baseline:

    ```shell
    dbt build
    cp -r target prod-state
    ```

2. Change one model &mdash; or ask <Constant name="wizard" /> to &mdash; then build only what changed and anything downstream of it:

    ```shell
    dbt build --select state:modified+ --state prod-state
    ```

    dbt rebuilds just the modified model instead of all eight nodes. On a real project with hundreds of models, that's the difference between a multi-minute run and a few seconds.

For more, refer to [About dbt state](/docs/deploy/dbt-state-about).

</Expandable>

<Expandable alt_header="Edit the project in the dbt VS Code extension">

The [dbt VS Code extension](/docs/about-dbt-extension) adds autocomplete, lineage, and inline previews while you edit, and it shares the same `dbt login` as <Constant name="wizard" />.

1. Install it from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt), or from your terminal:

    ```shell
    code --install-extension dbtLabsInc.dbt
    ```

2. Open the project:

    ```shell
    code .
    ```

Now you can edit `stg_wizards.sql` with dbt-aware help in the editor and keep using <Constant name="wizard" /> in the terminal for larger changes.

</Expandable>

<Expandable alt_header="Catch issues fast with Fusion lint">

Your project already runs on the [<Constant name="fusion_engine" />](/docs/fusion). Because Fusion understands your SQL, it can flag issues without touching your warehouse.

Run the linter:

```shell
dbt lint
```

Fusion checks every model and points to the exact line of each finding &mdash; for example, the unnecessary quotes around `"date"` in `stg_orders.sql`. Fix what it reports and run `dbt lint` again to confirm a clean result. This is the same analysis <Constant name="wizard" /> relies on to understand your project.

</Expandable>

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

---
title: "dbt Wizard quickstart"
id: "wizard-quickstart"
description: "Get up and running with dbt Wizard in your terminal or in the dbt platform."
sidebar_label: "Quickstart"
tags: [AI, CLI, dbt platform, dbt Wizard]
hide_table_of_contents: true
---

import WizardPrompts from '/snippets/wizard-prompts.md';
import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardCliInstall from '/snippets/_wizard-cli-install-by-version.md';
import WizardCliOnboarding from '/snippets/_wizard-cli-onboarding.md';
import NewToTerminal from '/snippets/_new-to-terminal.md';
import WizardPlatformPreviewDisclaimer from '/snippets/_wizard-platform-preview-disclaimer.md';
import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';
import WizardCliDbtCliSupport from '/snippets/_wizard-cli-dbt-cli-support.md';

# dbt Wizard quickstart

<IntroText>
Use <Constant name="wizard" /> in your terminal or in the <Constant name="dbt_platform" />.
</IntroText>

By the end of this guide, you can install or invoke <Constant name="wizard" /> in your terminal (depending on your dbt version), authenticate with your <Constant name="dbt_platform" /> credentials if applicable, and send your first prompt.

<Constant name="wizard" /> is data warehouse agnostic and works with both the [<Constant name="fusion_engine" />](/docs/fusion) and [<Constant name="core" />](/docs/local/install-dbt) &mdash; no specific engine is required.

Be warned, the wizard has been known to <WizardPopcorn>cast spells</WizardPopcorn>.

<WizardSupportedProviders />

<VersionBlock lastVersion="1.99">

:::tip Upgrade to the <Constant name="fusion_engine" />
On <Constant name="fusion_engine"/> (version 2.0 and later), start <Constant name="wizard"/> with `wizard` and use `wizard COMMAND_NAME` for CLI commands.
:::

</VersionBlock>

<Tabs>
<TabItem value="platform" label={<span className="tabs-lifecycle-label">dbt platform <Lifecycle status="preview" size="90%" /></span>} default>

_Available in public preview._

<WizardPlatformPreviewDisclaimer />

#### dbt platform prerequisites 

You'll need:
- A [<Constant name="dbt_platform" /> account](https://www.getdbt.com/signup) on a Starter, Enterprise, or Enterprise+ [plan](https://www.getdbt.com/pricing)
- An account admin to [enable](/docs/platform/enable-dbt-ai) <Constant name="wizard" /> for your account
- Access to [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) (public preview) or the <Constant name="wizard" /> home tab (beta)
- (Optional) If you're using <Constant name="wizard" /> in the home tab, [enable experimental features](/docs/dbt-versions/experimental-features) for your account

#### Get started in the dbt platform

1. From the <Constant name="dbt_platform" /> sidebar menu, open <Constant name="studio_ide" /> or the <Constant name="wizard" /> home app.
2. In the <Constant name="studio_ide" />, open a project and try a prompt:

    <WizardPrompts />

<Constant name="wizard" /> will read your project's lineage, tests, and metadata and propose changes as a diff. You approve, reject, or redirect before anything is written.

#### dbt platform next steps

- [dbt Wizard in Studio IDE](/docs/dbt-ai/wizard-ide) — in-depth guide including agent mode, resource generation, inline SQL, and interactive prompts
- [Use cases and examples](/docs/dbt-ai/wizard-use-cases) — realistic analytics engineering scenarios
- [Skills](/docs/dbt-ai/wizard-skills) — give Wizard reusable instructions for your project

</TabItem>
<TabItem value="terminal" label={<span className="tabs-lifecycle-label">Terminal <Lifecycle status="beta" size="90%" /></span>}>

_Available in public beta._

#### Terminal prerequisites

You'll need:
- An OpenAI subscription, or your own API key or cloud credentials for a supported provider using [BYOK](/docs/dbt-ai/wizard-byok): OpenAI, Anthropic, AWS Bedrock, Azure, or Snowflake Cortex (preview)
- A dbt project set up locally

<WizardCliDbtCliSupport />

<NewToTerminal />

#### Get started in your terminal

<WizardCliInstall />

#### Complete first-run onboarding

<WizardCliOnboarding />

Once you're set up, ask your first question in your terminal. Try some [prompts](/docs/dbt-ai/wizard-use-cases) to see how <Constant name="wizard" /> works:

    <WizardPrompts />

<Constant name="wizard" /> will read your project's lineage, tests, and metadata and propose changes as a diff. You approve, reject, or redirect before anything is written.


<div style={{maxWidth: '100%', margin: '20px 0'}}>
<video
  width="100%"
  controls
  autoPlay
  muted
  loop
  playsInline
  onLoadedMetadata={(event) => {
    event.currentTarget.defaultPlaybackRate = 2.0;
    event.currentTarget.playbackRate = 2.0;
  }}
  onPlay={(event) => {
    event.currentTarget.playbackRate = 2.0;
  }}
>
  <source src="/img/wizard.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
<span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', color: 'var(--ifm-color-emphasis-600)', marginTop: '8px'}}>dbt Wizard CLI in your terminal</span>
</div>

For refactor or change requests, <Constant name="wizard" /> automatically assesses downstream impact first by reporting affected models, metrics, and tests with a severity rating before proposing any changes.

When <Constant name="wizard" /> manages deferral, you point it at a target in your `profiles.yml` and it compiles and defers to that target automatically, so it can validate against already-built upstream models without rebuilding everything. Refer to [Deferral and state](/docs/dbt-ai/wizard-how-it-works#deferral-and-state) and [About dbt State](/docs/deploy/dbt-state-about) for details.

#### Useful terminal commands

Use the following commands to get started:

<SimpleTable>

| Command | Description | Example |
|---------|-------------|---------|
| `wizard "[prompt]"` | Start an interactive session seeded with a prompt. Once you activate the session, you don't need to pass your prompt in quotes. | `wizard "summarize what this project does"` |
| `wizard exec "[prompt]"` | Run a single prompt non-interactively and exit | `wizard exec "list all models with no tests"` |
| `wizard review --uncommitted` | Non-interactive code review of uncommitted changes | `wizard review --uncommitted` |
| `wizard review --base BRANCH` | Review diff against a base branch | `wizard review --base main` |
| `wizard resume` | Resume a previous session | `wizard resume --last` |
| `wizard apply` | Apply the latest Wizard diff to your working directory | `wizard apply TASK_ID` |
| `wizard login` / `logout` | Authenticate with your dbt platform account | `wizard login` |
| `wizard mcp` | Manage MCP server connections | `wizard mcp add dbt` |
| `wizard update` | Update Wizard to the latest version | `wizard update` |

</SimpleTable>

:::tip Need to re-run setup?
If you want to re-run onboarding — re-authenticate, reset project config, or retrigger the trusted folder prompt &mdash; refer to [Re-trigger onboarding flows](/docs/dbt-ai/wizard-config#re-trigger-onboarding-flows).
:::

## Terminal next steps

- [Use cases and examples](/docs/dbt-ai/wizard-use-cases) for realistic analytics engineering scenarios
- [Install and update reference](/docs/dbt-ai/wizard-cli) for full install, update, and uninstall details
- [Configure BYOK](/docs/dbt-ai/wizard-byok) for managing your API key and choosing an AI model
- [Configuration reference](/docs/dbt-ai/wizard-config) for setting persistent defaults in `config.toml` and per-project dbt settings in `wizard_config.toml`
- [Skills](/docs/dbt-ai/wizard-skills) for giving Wizard reusable instructions for your project
- [Migrate from Claude Code](/docs/dbt-ai/wizard-migrate) for bringing existing Claude Code project context into <Constant name="wizard" />

</TabItem>
<TabItem value="both" label="dbt platform and terminal">

<WizardPlatformPreviewDisclaimer />

#### Use dbt Wizard in both environments

<Constant name="wizard"/> supports both local and remote development. Use this path if you work in the <Constant name="dbt_platform" /> and also develop locally in a dbt project.

To get started:

1. Follow the **dbt platform** tab to confirm <Constant name="wizard" /> is enabled and available in your account.
2. Follow the **Terminal** tab to install the <Constant name="wizard" /> CLI and start a local session.
3. Try a prompt in either environment, depending on where you want to work. Some example prompts are:
    <WizardPrompts />

For example, you might use <Constant name="wizard" /> in the <Constant name="dbt_platform" /> when you want a managed, chat-first or Studio-based workflow, and use the <Constant name="wizard" /> CLI when you want to stay in your local terminal.

#### Next steps for both environments

- [Get started in the dbt platform](#get-started-in-the-dbt-platform)
- [Get started in your terminal](#get-started-in-your-terminal)
- [Configure BYOK](/docs/dbt-ai/wizard-byok)
- [CLI reference](/docs/dbt-ai/wizard-cli)
- [Use cases and examples](/docs/dbt-ai/wizard-use-cases)
- [Use MCP servers (CLI)](/docs/dbt-ai/wizard-mcp)
- [Use subagents](/docs/dbt-ai/wizard-subagents)

</TabItem>
</Tabs>

<WizardFeedbackCallout />

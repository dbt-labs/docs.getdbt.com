---
title: "Get started with the dbt Wizard local CLI"
id: "wizard-quickstart"
description: "Install the dbt Wizard local CLI, complete first-run onboarding, and send your first prompt from the terminal."
sidebar_label: "Get started with the local CLI"
tags: [AI, CLI, dbt Wizard]
---

import WizardPrompts from '/snippets/wizard-prompts.md';
import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardCliInstall from '/snippets/_wizard-cli-install-by-version.md';
import WizardCliOnboarding from '/snippets/_wizard-cli-onboarding.md';
import NewToTerminal from '/snippets/_new-to-terminal.md';
import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';
import WizardCliDbtCliSupport from '/snippets/_wizard-cli-dbt-cli-support.md';

# Get started with the <Constant name="wizard" /> local CLI

<IntroText>
Install <Constant name="wizard" /> locally and start an agentic dbt development session from your terminal.
</IntroText>

<WizardCliDbtCliSupport />

<WizardCliInstall />

By the end of this guide, you can install <Constant name="wizard" /> locally, authenticate with your <Constant name="dbt_platform" /> credentials if applicable, complete first-run onboarding, and send your first prompt from the terminal.

<Constant name="wizard" /> is data warehouse agnostic and works with both the [<Constant name="fusion_engine" />](/docs/fusion) and [<Constant name="core" />](/docs/local/install-dbt) &mdash; no specific engine is required.

Be warned, the wizard has been known to <WizardPopcorn>cast spells</WizardPopcorn>.

<WizardSupportedProviders />

<VersionBlock lastVersion="1.99">

:::tip Upgrade to the <Constant name="fusion_engine" />
On <Constant name="fusion_engine"/> (version 2.0 and later), start <Constant name="wizard"/> with `wizard` and use `wizard COMMAND_NAME` for CLI commands.
:::

</VersionBlock>

## Prerequisites

You'll need:

- An OpenAI subscription, or your own API key or provider credentials for a supported provider using [BYOK](/docs/dbt-ai/wizard-byok): OpenAI, Anthropic, AWS Bedrock, Azure, Snowflake Cortex (preview), or Databricks
- A dbt project with a built `target/` directory (run `dbt parse`, `dbt compile`, or `dbt build`)

<NewToTerminal />

## Complete first-run onboarding

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

## Useful terminal commands

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

## Next steps

- [Use cases and examples](/docs/dbt-ai/wizard-use-cases) for realistic analytics engineering scenarios
- [Install and update reference](/docs/dbt-ai/wizard-cli) for full install, update, and uninstall details
- [Configure BYOK](/docs/dbt-ai/wizard-byok) for managing your API key and choosing an AI model
- [Configuration reference](/docs/dbt-ai/wizard-config) for setting persistent defaults in `config.toml` and per-project dbt settings in `wizard_config.toml`
- [Use skills locally](/docs/dbt-ai/wizard-skills) for giving Wizard reusable instructions for your project
- [Use MCP servers](/docs/dbt-ai/wizard-mcp) to connect <Constant name="wizard" /> CLI to more tools and context
- [Migrate from Claude Code](/docs/dbt-ai/wizard-migrate) for bringing existing Claude Code project context into <Constant name="wizard" />

<WizardFeedbackCallout />

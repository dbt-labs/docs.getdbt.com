---
title: "Wizard Desktop settings"
id: "wizard-desktop-settings"
description: "Reference for every setting in Wizard Desktop: general layout, account, AI providers, connectors, appearance, shortcuts, and version control."
sidebar_label: "Desktop settings"
tags: [AI, Agents, dbt Wizard]
availability: local_all
---

import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';
import WizardDesktopPrivatePreview from '/snippets/_wizard-desktop-private-preview.md';

# Wizard Desktop settings <Lifecycle status="private_beta"/>

<IntroText>
Open **Settings** from the bottom left of the app to change how <Constant name="wizard" /> behaves. Settings are grouped into General, Account, AI providers, Connectors, Appearance, Shortcuts, and version control.
</IntroText>

Settings that also exist in the Wizard CLI are shared. Changing them here changes them for `wizard` in your terminal too. Refer to [the config reference](/docs/dbt-ai/wizard-config) for the underlying files.

<WizardDesktopPrivatePreview />

## General

Controls what appears alongside a chat while you work.

<SimpleTable>

| Setting | What it does |
|---|---|
| Replay onboarding | Walks you through first-run setup again. Your existing theme and project settings are kept unless you change them during setup. |
| Application updates | Shows the version you're on, checks for new versions, and installs them. |

</SimpleTable>

<Lightbox src="/img/wizard/desktop/wizard-desktop-settings-general.png" title="General settings in Wizard Desktop" />

## Account

Shows the dbt account <Constant name="wizard" /> uses for hosted models and platform access, and gives you the tools to clean up what the app has written to disk. 

- **Profile** lists the name and email you signed in with, and the <Constant name="dbt_platform" /> host the app is connected to, such as `vu491.us1.dbt.com`. Select **Sign out** to disconnect the account.
- **Maintenance** reclaims disk space or returns <Constant name="wizard" /> to a clean state. This will affect the Wizard CLI too:

    <SimpleTable>

    | Action | What it does |
    |---|---|
    | Clean up environments | Deletes archived environment directories from disk. The pane tells you whether any are there to remove |
    | Clean up app data | Drops orphaned records, and shows what the app is tracking, such as `4 environments, 1 project, 4 journal rows` |
    | Reset app | Permanently deletes your environments, projects, and chat history, plus cached files. It doesn't clear your configuration file at `$DBT_WIZARD_HOME`, which defaults to `~/.dbt/wizard/config.toml` |

    </SimpleTable>

:::caution Reset app can't be undone

When you select **Reset app**, it can't be undone which means chat history goes with it when you delete it. Make sure you export or open a pull request for any work you want to keep first before taking this action.

:::


## AI providers

Choose how <Constant name="wizard" /> reaches a model. Come here if you selected **Skip for now** during onboarding, or to switch approaches later. Select **Refresh** to re-check which providers and models are available.

<SimpleTable>

| Option | What it means |
|---|---|
| Managed by dbt Labs | No setup. dbt Labs [manages](/docs/dbt-ai/pricing-billing/overview#dbt-managed-providers) the keys and keeps you on the latest models, and usage is metered against your dbt usage credits. The `dbt` provider shows as **Active** when it's in use |
| Managed by you | Bring your own key for Amazon Bedrock, Anthropic, Azure OpenAI, Databricks, Google Gemini, OpenAI, or an OpenAI subscription, and more. That provider's API charges apply. Refer to [BYOK](/docs/dbt-ai/wizard-byok) |

</SimpleTable>

Each provider lists how many of its models are enabled, such as `6/6 models enabled`. Select **Manage** to add credentials and turn individual models on or off. You then pick the model and reasoning effort per chat from the chat composer, not here.


## Connectors
_Coming soon_

MCP connectors give <Constant name="wizard" /> context about your pipelines, BI tools, and orchestration. Browsing and enabling them from this pane is planned for future releases.

Until then, add [MCP servers](/docs/dbt-ai/wizard-mcp) from the terminal:

1. Start a project chat and send your first message, which starts the terminal.
2. Run `wizard` from the terminal.
3. Run `/mcp` to add a connector or manage the ones you've already added.

## Appearance

Sets how the app looks and how much detail inline widgets show.

<SimpleTable>

| Setting | What it does |
|---|---|
| Theme | Switches between **Light**, **Dark**, and **System**. Same choice you made during onboarding. Cycle it with <kbd>⌘</kbd> + <kbd>⌥</kbd> + <kbd>T</kbd> |
| Inspector rail labels | Shows the surface names beneath the pane rail icons, so you get **Explorer** and **Lineage** as text rather than icons alone |
| Terminal font family | The font the integrated terminals use. Enter the name exactly as it's installed, for example `FiraCode Nerd Font`. Your preferred family is used first, with `Geist Mono, monospace` as the fallback |
| Terminal font size | A whole number from 8 to 32 |

</SimpleTable>

## Shortcuts

Lists the app's keyboard shortcuts, grouped by what they act on.

<SimpleTable>

| Shortcut | What it does |
|---|---|
| <kbd>⌘</kbd> + <kbd>,</kbd> | Open **Settings** |
| <kbd>⌘</kbd> + <kbd>K</kbd> | Open the command palette |
| <kbd>⌘</kbd> + <kbd>/</kbd> | Show the keyboard shortcuts |
| <kbd>⌘</kbd> + <kbd>L</kbd> | Focus the chat |
| <kbd>Esc</kbd> | Close an overlay, or go back to the app |
| <kbd>⌘</kbd> + <kbd>T</kbd> | Open a new chat |
| <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>{'\\'}</kbd> | Toggle the right sidebar |
| <kbd>⌘</kbd> + <kbd>⌥</kbd> + <kbd>T</kbd> | Cycle the theme |

</SimpleTable>


## Version control

_Only GitHub is supported at this time. Support for more version control providers coming soon._

Set how <Constant name="wizard" /> authenticates with GitHub to read repos and open pull requests with **Create PR**. Refer to [Review and validate changes](/docs/dbt-ai/wizard-desktop-use#review-and-validate-changes).

<SimpleTable>

| Method | When to use it |
|---|---|
| GitHub CLI integration | The default. When the [GitHub CLI](https://cli.github.com/) is installed and authenticated, the pane shows a green status dot and the account you're signed in as |
| Personal access token | Optional, and used when the GitHub CLI isn't available. Select **Create one** to generate a token on GitHub, paste it in, then select **Save** |

</SimpleTable>


## Related docs

- [Get started with Wizard Desktop](/docs/dbt-ai/wizard-desktop)
- [Use Wizard Desktop](/docs/dbt-ai/wizard-desktop-use)
- [<Constant name="wizard" /> config reference](/docs/dbt-ai/wizard-config)
- [Configure BYOK](/docs/dbt-ai/wizard-byok)
- [Use MCP servers](/docs/dbt-ai/wizard-mcp)

<WizardFeedbackCallout />

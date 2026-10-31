---
title: "Get started with Wizard Desktop"
id: "wizard-desktop"
description: "Download Wizard Desktop and start your first session with rich data visualizations, data diffs, and lineage."
sidebar_label: "Get started with Desktop"
image: /img/wizard/desktop/wizard-desktop-ui.png
tags: [AI, Agents, dbt Wizard]
availability: local_all
---

import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';
import WizardTrialBilling from '/snippets/_wizard-trial-billing.md';

# Get started with Wizard Desktop <Lifecycle status="beta"/>

<IntroText>
Wizard Desktop is <Constant name="wizard" /> as a native app. View rich data visualizations, data diffs, lineage, and more to get to your results faster than ever before.
</IntroText>

This page walks you through installing the app, connecting it to the services it needs, and starting your first session. For everything the app can do, refer to [Use Wizard Desktop](/docs/dbt-ai/wizard-desktop-use). Be warned, the wizard has been known to <WizardPopcorn>cast spells</WizardPopcorn>.

<DownloadCard />

Wizard Desktop is powered by the same technology as the [<Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-cli), with a visual interface to help you follow the work, guide it, and manage several threads at once:

- **Parallel chats:** each chat gets its own <Constant name="git" /> <Term id="git-worktree" />, so several pieces of work run at once without conflicts.
- **Visible validation:** see structured results, including a `dbt-compare` view of what your changes did to the data.
- **Contextual comments:** hover almost anything to comment on that exact spot, then send several together.
- **Charts and tables:** ask a question about your data and see the answer inline.
- **Inline impact:** see which models <Constant name="wizard" />'s changes touch, with diffs you open inline.
- **Lineage, file, and metrics browsing:** browse your project right alongside the chat.



<DocCarousel slidesPerView={1}>

<Lightbox src="/img/wizard/desktop/wizard-desktop-intro.png" width="95%" title="The dbt Wizard home screen"/>
<Lightbox src="/img/wizard/desktop/wizard-desktop-validation.png" width="95%" title="A session in progress, with a chart in the chat and validation results in the side pane" />
</DocCarousel>


## Prerequisites

To use Wizard Desktop, you'll need:
- A computer using macOS, Linux, or Windows.
- A dbt account, if you want to use dbt-managed keys. You can create a free account when you sign in, or use an existing one. If you you use [BYOK](/docs/dbt-ai/wizard-byok), you can use Wizard Desktop without a dbt account.
- A local copy of your dbt project on your machine if you want <Constant name="wizard" /> to work on project files. The app scans for existing projects, and you can also select a project folder yourself.
- Warehouse credentials if you want <Constant name="wizard" /> to run your project or query data. You don't need to configure them before opening the app.


## Install Wizard Desktop

1. Download the installer for your operating system:
   - [macOS, Apple silicon (.dmg)](https://public.cdn.getdbt.com/dbt-wizard/latest/dbt-wizard-app-aarch64-apple-darwin.dmg) or [macOS, Intel (.dmg)](https://public.cdn.getdbt.com/dbt-wizard/latest/dbt-wizard-app-x86_64-apple-darwin.dmg)
   - [Windows, x64 (.exe)](https://public.cdn.getdbt.com/dbt-wizard/latest/dbt-wizard-app-x86_64-pc-windows-msvc.exe)
   - [Linux, x86_64 (.deb)](https://public.cdn.getdbt.com/dbt-wizard/latest/dbt-wizard-app-x86_64-unknown-linux-gnu.deb) or [Linux, ARM64 (.deb)](https://public.cdn.getdbt.com/dbt-wizard/latest/dbt-wizard-app-aarch64-unknown-linux-gnu.deb) — for Debian-based distributions, such as Ubuntu

   On other Linux distributions, install the app with the [<Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-cli) instead: run `wizard app`.
2. Open Wizard Desktop and select **Get started** on the welcome screen.
3. Follow the onboarding prompts. When prompted, create a free dbt account or sign in to an existing account. When you use your own AI provider credentials ([BYOK](/docs/dbt-ai/wizard-byok), you can skip signing in.

## Add your dbt projects

On the **Scan for your dbt projects** screen, choose how <Constant name="wizard" /> finds projects:

- **Scan for projects**: <Constant name="wizard" /> searches local <Constant name="git" /> repos and adds any dbt projects it finds. Allow macOS folder access when prompted so projects are discoverable.
- **Add from <Constant name="dbt_platform" />**: connect your <Constant name="dbt_platform" /> account. <Constant name="wizard" /> authenticates, then lists your platform projects with all of them selected by default. Choose which projects to include and, optionally, the folder to clone them into, then select **Clone**. <Constant name="wizard" /> clones the projects locally so you can work on the files.
- **Add a folder instead**: pick a project folder from your computer.
- **Start chatting without one**: skip project setup. A project-free chat doesn't use your project files or warehouse connection, so skip to [Start your first session](#start-your-first-session).
- Select **Continue** when you're done.

## Choose how to access an AI model

On the **Connect an AI model provider** screen, choose how <Constant name="wizard" /> accesses an AI model:

- **Start free trial with dbt-managed keys**: dbt Labs manages the keys and keeps you on current models from OpenAI, Anthropic, and open source. Usage is metered against your dbt usage credits.
- **Use my own API key**: bring your own provider credentials with [BYOK](/docs/dbt-ai/wizard-byok) for OpenAI, Anthropic, AWS Bedrock, Azure, Snowflake Cortex, Google Gemini, Databricks, and more. Your provider bills you directly, and this option works without a dbt platform plan.
- **Skip, I'll do this later**: continue without choosing a provider. To configure one later, go to **Settings** &rarr; **AI providers**.

<WizardTrialBilling />

## Set up your warehouse connection

To run a project or query its data, <Constant name="wizard" /> needs a warehouse connection. On the home screen, select **Set a connection**. By default <Constant name="wizard" /> connects through your `profiles.yml`, which may not be configured for the project yet. Choose one of:

- **Set warehouse credentials**: enter your credentials and <Constant name="wizard" /> writes them locally to your [`profiles.yml`](/docs/local/profiles.yml) and connects directly. Use the same developer credentials you'd use to develop in <Constant name="dbt_platform" />. Refer to [Get started with the Studio IDE](/docs/platform/studio-ide/develop-in-studio#get-started-with-the-studio-ide) and [dbt platform environments](/docs/dbt-platform-environments) for what to enter.
- **Use the dbt platform CLI**: <Constant name="wizard" /> runs through your <Constant name="dbt_platform" /> account, so your credentials stay there. Requires a separate [<Constant name="dbt_platform" /> CLI](/docs/platform/dbt-cli-installation) install.

If a connection already exists, either through a live <Constant name="dbt_platform" /> session or a local `profiles.yml`, <Constant name="wizard" /> will then use it and you can continue to the [Start your first session](#start-your-first-session) section.


## Start your first session

Before sending your first prompt, check the session settings in the prompt area:

1. Confirm the project you selected, or leave it empty for a project-free chat.
2. For a project session, select where <Constant name="wizard" /> should run the project, for example `default · dev`. If no options appear, [set up your warehouse connection](#set-up-your-warehouse-connection).
3. Choose the model and how much reasoning it should use. If no models are available, configure a provider in **Settings** &rarr; **AI providers**.
4. Choose how much <Constant name="wizard" /> can do before asking for your approval. Available permissions listed in the [next section](#review-and-accept-changes) are **Plan changes**, **Ask for approval**, or **Auto**.
5. Describe what you want <Constant name="wizard" /> to do, or choose a quick start such as **Audit for test coverage**, **Tell me about this project**, or **Help me refactor a model**.

Some things worth asking on a first run:

- `Tell me about this project`
- `Which models have no tests?`
- `Refactor stg_orders and show me what changes in the data`

A chat is one conversation about your project. Each project chat works in its own copy of your repo on its own branch, called a <Constant name="git" /> worktree, so you can keep a few pieces of work going at once without them stepping on each other.

Each chat gets a name like `docs-fox`, and its branch and schema are named after it. Refer to [Worktree and schema names](/docs/dbt-ai/wizard-desktop-use#worktree-and-schema-names) for what those names mean.

## Review and accept changes

<Constant name="wizard" /> reads your project's lineage, tests, and metadata, runs tools, and <WizardPopcorn>conjures</WizardPopcorn> changes as a diff. What happens next depends on your [permission mode](/docs/dbt-ai/wizard-desktop-use#permission-modes):

- **Plan changes**: <Constant name="wizard" /> proposes an approach without editing anything.
- **Ask for approval**: <Constant name="wizard" /> proposes each change and waits. Nothing is written until you accept.
- **Auto**: <Constant name="wizard" /> applies edits and shows a change indicator you can open to review them.

Every change lands as a reviewable diff, and you can comment on an exact line, table cell, or chart to send feedback back into the chat. Refer to [Review changes](/docs/dbt-ai/wizard-desktop-use#review-what-changed).

## Update the app

When a new version of Wizard Desktop is available, the app generally will tell you a few seconds after launching it. Select **Install** to update, or **Dismiss** to skip it until next launch. 

To update at any time:

1. Go to **Settings** &rarr; **General** &rarr; **Application updates**. This shows the version you're on.
2. Select **Check for updates**.
3. If there's a new version, select **Install version** and wait for the install progress to finish.
4. Select **Restart to finish update**. The app won't restart on its own.

You can also enable automatic updates by clicking on the **Automatic updates** toggle in the same section.

## Coming from the CLI?

It's the same <Constant name="wizard" /> you already know, running the same engine as the [<Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-cli). The app has a built-in terminal, so you can keep running dbt commands the way you always have, and you can select **Open in** at any time to jump to the same branch in iTerm, Terminal, VS Code, Cursor, or Finder.

[Download Wizard Desktop](#install-and-open-wizard-desktop) and install the app.

Refer to [the config reference](/docs/dbt-ai/wizard-config) for the configuration files used by the CLI.


<SimpleTable>

| | [Wizard Desktop](/docs/dbt-ai/wizard-desktop) | [CLI](/docs/dbt-ai/wizard-cli) | [dbt platform](/docs/platform/wizard-platform) |
|---|---|---|---|
| Where it runs | Native app on your machine | Your terminal | Browser |
| Best for | Seeing and steering the work, several threads at once | Scripting and terminal-native workflows | Full development and business-user analytics |
| Rendered tables, charts, and diffs | Yes | Plain text in your terminal | Yes |
| Parallel work | Yes, each chat gets its own worktree | One session per terminal | Yes |
| Chat history | Kept in the app | Resume a past session with `wizard resume` | Kept in your dbt account |
| Availability | Public beta, download the app | Public beta, install the CLI | Public preview, in your dbt account |

</SimpleTable>

## What's next

- [Use Wizard Desktop](/docs/dbt-ai/wizard-desktop-use): parallel chats, validation, commenting, diffs, and troubleshooting
- [Wizard Desktop settings](/docs/dbt-ai/wizard-desktop-settings): providers, connectors, appearance, shortcuts, and GitHub
- [Use cases and examples](/docs/dbt-ai/wizard-use-cases)
- [How to use <Constant name="wizard" /> in your dbt project](/best-practices/how-to-use-wizard/wizard-1-intro)
- [Configure BYOK](/docs/dbt-ai/wizard-byok)

<WizardFeedbackCallout />

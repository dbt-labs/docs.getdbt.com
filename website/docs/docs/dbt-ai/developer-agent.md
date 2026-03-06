---
title: "Developer agent"
id: "developer-agent"
description: "Use the Developer agent to write or refactor dbt models from natural language, validate with dbt Fusion Engine, and run against your warehouse with full context."
sidebar_label: "Developer agent"
tags: [AI, Agents, Studio]
---

import DevAgent from '/snippets/_developer-agent-studio-setup.md';

# Developer agent <Lifecycle status="private_beta"/>

<IntroText>
The <Constant name="dev_agent" /> is an AI assistant built into the <Constant name="cloud_ide" /> that can write, refactor, and validate dbt models using your project's structured context &mdash; including lineage, metadata, governance, and the Semantic Layer.
</IntroText>

Move faster by generating or refactoring models, tests, and documentation from natural language prompts, while keeping every change auditable and aligned with your dbt project.

The <Constant name="dev_agent" /> supports the following use cases:

- **Generate semantic models, tests, and docs** &mdash; Scaffold YAML definitions from existing models and save time on manual setup.
- **Build or modify models** &mdash; Create new or modify existing dbt models from natural language descriptions of the transformation or logic you need.
- **Light refactors** &mdash; Rename columns, change materializations, or adjust logic. The agent also keeps associated YAML files in sync with any changes it makes.
- **dbt agent skills** (coming soon) &mdash; Support for [dbt agent skills](https://github.com/dbt-labs/dbt-agent-skills), a curated collection of instructions and scripts for agents, is coming soon.

## Prerequisites

- An Enterprise-tier plan &mdash; Contact your account manager for access.
- A [<Constant name="cloud" /> account](https://www.getdbt.com/signup) and [Developer seat license](/docs/cloud/manage-access/seats-and-users).
- A [development environment](/docs/cloud/studio-ide/develop-in-studio#get-started-with-the-studio-ide) and credentials set up in the <Constant name="cloud_ide" />.
- [Enable account access to <Constant name="copilot" /> features](/docs/cloud/enable-dbt-copilot) if you haven't already.

#### Availability and considerations

- The <Constant name="dev_agent" /> is available in the [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) only. It's not available in VS Code or the <Constant name="cloud_cli" />.
- It works across all engines (<Constant name="fusion_engine" /> and <Constant name="core" />).
- It does not retain conversation context between sessions. If you close or leave the <Constant name="cloud_ide" />, the conversation resets. However, if you saved any file changes the agent already made, those changes will stay in your branch. Unsaved changes are lost.
- Currently, plan mode isn't supported. The <Constant name="dev_agent" /> applies changes directly without showing a plan first. Use **Ask** mode if you want to confirm each edit before it is applied.
- You cannot edit a prompt after submitting it. To refine your request, use **Start over** to reset the session and submit a new prompt.
- Custom skill support isn't yet available.

## Use the Developer agent

<DevAgent />

<div style={{maxWidth: '100%', margin: '20px 0'}}>
<video width="100%" controls autoPlay muted loop playsInline>
  <source src="/img/docs/dbt-cloud/dev-agent.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
<span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', color: 'var(--ifm-color-emphasis-600)', marginTop: '8px'}}>Example of using the Developer agent to refactor a model in the Studio IDE.</span>
</div>

For more details on the <Constant name="dev_agent" /> and how it works, see the following sections.

#### Panel controls

The <Constant name="copilot" /> panel contains:

- **Quick-action buttons** (top) &mdash; The buttons at the top of the panel (**Generate documentation**, **Semantic model**, **Generate generic tests**, **Metrics**) pre-fill prompts for common tasks. When selected, the text field is pre-filled with the prompt for the selected action.
- **Agent mode button** (bottom left) &mdash; Switch between **Ask** and **Code** mode. Click the button to change modes.
- **Text input field** (bottom right) &mdash; Type your prompt in the text field to describe what you want to build or change. Type `@` to select a model as context. This scopes the agent's changes to that resource.
- **Model context** (bottom left, next to mode) &mdash; Shows the currently open file. Use `@` in the text field to reference a different model. Click **x** to remove the model context.
- **Start over** (top right) &mdash; Resets the current session. A confirmation prompt will appear &mdash; click **Start over** to confirm, or **Cancel** to return to your current conversation. This action cannot be undone.
- **Stop** (bottom right) &mdash; Stops the current session and agent processing. This action cannot be undone.

<Lightbox src="/img/docs/dbt-cloud/dev-agent-copilot-panel.png" width="95%" title="The Copilot panel in the Studio IDE showing quick-action buttons, text input field, and agent mode controls." />

#### Agent modes

The <Constant name="dev_agent" /> operates in two modes:

<SimpleTable>

| Mode | Behavior | When to use |
|------|----------|-------------|
| **Ask** | The agent asks for your confirmation before making each edit to a file. This is the default mode. | Use **Ask** mode when working in shared projects, making structural changes, or exploring unfamiliar models. |
| **Code** | The agent edits files immediately without waiting for confirmation. | Use this for faster iteration when you're confident in the prompt. |

<Lightbox src="/img/docs/dbt-cloud/dev-agent-ask-mode.png" width="95%" title="The Developer agent in Ask mode, requesting confirmation before applying file edits." />

</SimpleTable>

You can switch between modes at any time.

#### Reviewing agent suggestions

When the <Constant name="dev_agent" /> proposes code changes, you can review them before they are committed to your project:

- **View the diff** &mdash; The agent displays a diff of the proposed changes. Click **Show all X lines** to expand and view the full suggestion.
- **Line indicators** &mdash; Added and removed lines are highlighted with line number indicators so you can see exactly what changed.
- **Copy or open in editor** &mdash; Use the options in the top-right corner of the diff view to copy the suggestion or open it directly in the editor.

<Lightbox src="/img/docs/dbt-cloud/dev-agent-code-suggestion.png" width="95%" title="The Developer agent displaying a diff of proposed YAML changes with line indicators and copy/open options." />

#### Granting command permissions

To validate or run models during a session, the agent executes dbt commands using `invoke_dbt`. You'll be prompted to approve each request. For example:

```
invoke_dbt(args: ["compile", "--select", "model_name"])
```

<Lightbox src="/img/docs/dbt-cloud/dev-agent-invoke-dbt.png" width="95%" title="The Developer agent requesting permission to run an invoke_dbt command." />

You can respond with one of the following options:

<SimpleTable>

| Option | Behavior |
|--------|----------|
| **Yes, run once** | Grants permission to run this specific command one time. |
| **Yes, and allow invoke_dbt for the session** | Grants permission to run `invoke_dbt` commands for the remainder of your session without prompting again. |
| **No** | Denies the request. The agent will not run the command. |

</SimpleTable>

## Writing effective prompts

Good prompts include the **scope** (which models or area of the project), the **intent** (the transformation or business logic you want), and any **constraints** (naming conventions, materialization, tests). Here are a few examples:

| Task | Example prompt |
|------|---------------|
| Build a new model | "Create a model called `fct_daily_revenue` that joins `stg_orders` and `stg_payments`, aggregates revenue by day, and materializes as a table." |
| Refactor an existing model | "Refactor `fct_orders` to use incremental materialization. Keep existing tests and follow our naming conventions." |
| Generate tests and docs | "Add not_null and unique tests to the primary key of `dim_customers`, and generate documentation for all columns." |

For detailed guidance, patterns, and more examples across SQL, documentation, tests, and semantic models, see the [Prompt cookbook](/guides/prompt-cookbook).

## Related docs

- [dbt Agents overview](/docs/dbt-ai/dbt-agents)
- [Develop with dbt Copilot](/docs/cloud/studio-ide/develop-copilot)
- [Prompt cookbook](/guides/prompt-cookbook)
- [Semantic models](/docs/build/semantic-models)
- [About dbt AI and intelligence](/docs/dbt-ai/about-dbt-ai)

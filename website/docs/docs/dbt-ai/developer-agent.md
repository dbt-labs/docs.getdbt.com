---
title: "Developer agent"
id: "developer-agent"
description: "Use the Developer agent to write or refactor dbt models from natural language, validate with dbt Fusion Engine, and run against your warehouse with full context."
sidebar_label: "Developer agent"
tags: [AI, Agents, Studio]
---

import DevAgent from '/snippets/_developer-agent-studio-setup.md';

# Developer agent <Lifecycle status="beta,managed,managed_plus"/>

<IntroText>
The <Constant name="dev_agent" /> is the next evolution of <Constant name="copilot" /> in the <Constant name="studio_ide" />, purpose-built to streamline the developer experience. As an agentic capability within <Constant name="copilot" />, it can write, refactor, and validate dbt models using your project's structured context &mdash; including lineage, metadata, governance, and the <Constant name="semantic_layer" />.
</IntroText>

While <Constant name="copilot" /> is the AI-powered product surface you interact with across the <Constant name="dbt_platform" />, the <Constant name="dev_agent" /> is the DevEx-focused workflow within it &mdash; designed to help you move faster by generating or refactoring models, tests, and documentation from natural language prompts, while keeping every change auditable and aligned with your dbt project.

The <Constant name="dev_agent" /> supports the following use cases:

- **Generate semantic models, tests, and docs**: Scaffold YAML definitions from existing models and save time on manual setup.
- **Build or modify models**: Create new or modify existing dbt models from natural language descriptions of the transformation or logic you need.
- **Light refactors**: Rename columns, change materializations, or adjust logic. The agent also keeps associated YAML files in sync with any changes it makes.

The <Constant name="dev_agent" /> always has access to the latest dbt-recommended guidance through [dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills) &mdash; a curated collection of instructions and scripts managed by dbt Labs covering analytics engineering, semantic layer, testing, platform operations, and more. These skills are available to the agent out of the box, so you don't need to configure or maintain them! 🎉

## Prerequisites

- An Enterprise-tier plan &mdash; Contact your account manager for access.
- A [<Constant name="dbt" /> account](https://www.getdbt.com/signup) and [Developer seat license](/docs/cloud/manage-access/seats-and-users).
- A [development environment](/docs/cloud/studio-ide/develop-in-studio#get-started-with-the-studio-ide) and credentials set up in the <Constant name="studio_ide" />.
- [Account access to <Constant name="copilot" /> features](/docs/cloud/enable-dbt-copilot).

#### Availability and considerations

- The <Constant name="dev_agent" /> is available in the [<Constant name="studio_ide" />](/docs/cloud/studio-ide/develop-in-studio) only. It's not available in VS Code or the <Constant name="platform_cli" />.
- It works across all engines (<Constant name="fusion_engine" /> and <Constant name="core" />).
- It does not retain conversation context between sessions. If you close the <Constant name="studio_ide" />, the conversation resets. If you saved any file changes the agent made, those changes will remain in your branch. Unsaved changes are lost.
- Currently, **Plan** mode isn't supported. The <Constant name="dev_agent" /> drafts changes directly without showing a plan first. Use **Ask** mode if you want to approve each file change before it is persisted.
- You cannot edit a prompt after submitting it. To refine your request, click the **Start over** button located at the top right corner of the Copilot panel. This resets the session and you can submit a new prompt.

## Using the Developer agent

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

1. **Quick actions** (center): The <Constant name="studio_ide" /> surfaces quick actions at the top of the panel to help you get started with common tasks, like generating documentation, semantic models, tests, and metrics. When selected, the text field is pre-filled with a prompt for the selected action. These quick actions may evolve over time as new capabilities are added.
2. **Agent mode button** (bottom left): Switch between **Ask** and **Code** mode. Click the button to change modes.
3. **Model context** (bottom left, next to mode): Shows the currently open file. Use `@` in the text field to reference a different model. Click **x** to remove the model context.
4. **Text input field** (bottom right): Type your prompt in the text field to describe what you want to build or change. Type `@` to select a model as context. This scopes the agent's changes to that resource.
5. **Start over** (top right): Resets the current session. When you click this button, a confirmation prompt appears. Click **Start over** to confirm, or **Cancel** to return to your current conversation. You cannot undo this action.
6. **Stop** or **Enter** (bottom right): Press **Enter** to submit your prompt. Press **Stop** to stop the current session and agent processing. You cannot undo this action. 

<Lightbox src="/img/docs/dbt-cloud/dev-agent-copilot-panel.png" width="95%" title="The Copilot panel in the Studio IDE showing quick-action buttons, text input field, and agent mode controls." />

#### Agent modes

The <Constant name="dev_agent" /> operates in two modes:

<SimpleTable>

| Mode | Behavior |
|------|----------|
| **Ask** (default) | The agent drafts edits to files. You must approve each file change before it is persisted. Best when you want tight control over what gets saved to your branch. |
| **Code** | The agent drafts and automatically edits files without per-file approval. Best for faster iteration when you're confident in the prompt. |

<Lightbox src="/img/docs/dbt-cloud/dev-agent-ask-mode.png" width="95%" title="The Developer agent in Ask mode, requesting approval before persisting file edits." />

</SimpleTable>

You can switch between modes at any time.

#### Reviewing agent suggestions

When the <Constant name="dev_agent" /> proposes code changes, you can review them before they are committed to your project:

- **View the diff**: The agent displays a diff of the proposed changes. Click **Show all X lines** to expand and view the full suggestion.
- **Line indicators**: Added and removed lines are highlighted with line number indicators so you can see exactly what changed.
- **Copy or open in editor**: Use the options in the top-right corner of the diff view to copy the suggestion or open it directly in the editor.

<Lightbox src="/img/docs/dbt-cloud/dev-agent-code-suggestion.png" width="95%" title="The Developer agent displaying a diff of proposed YAML changes with line indicators and copy/open options." />

#### Granting command permissions

To validate or run models during a session, the agent may request to run dbt commands such as `dbt compile` or `dbt build`. You'll be prompted to approve each request before it executes. For example, the agent might request to run:

```
dbt compile --select model_name
```

<Lightbox src="/img/docs/dbt-cloud/dev-agent-invoke-dbt.png" width="95%" title="The Developer agent requesting permission to run a dbt command." />

You can select one of the following options:

<SimpleTable>

| Option | Behavior |
|--------|----------|
| **Yes, run once** | Grants permission to run this specific command one time. |
| **Yes, and allow `dbt_command_name` for the session** | Grants permission to run dbt commands for the remainder of your session without prompting again. |
| **No** | Denies the request. The agent will not run the command. |

</SimpleTable>

## Writing effective prompts

Good prompts include the _scope_ (which models or area of the project), the _intent_ (the transformation or business logic you want), and any _constraints_ (naming conventions, materialization, tests). Here are a few examples:

| Task | Example prompt |
|------|---------------|
| Build a new model | "Create a model called `fct_daily_revenue` that joins `stg_orders` and `stg_payments`, aggregates revenue by day, and materializes as a table." |
| Refactor an existing model | "Refactor `fct_orders` to use incremental materialization. Keep existing tests and follow our naming conventions." |
| Generate tests and docs | "Add `not_null` and `unique` tests to the primary key of `dim_customers`, and generate documentation for all columns." |

For detailed guidance, patterns, and more examples across SQL, documentation, tests, and semantic models, see the [Prompt cookbook](/guides/prompt-cookbook).

## Related docs

- [dbt Agents overview](/docs/dbt-ai/dbt-agents)
- [Develop with dbt Copilot](/docs/cloud/studio-ide/develop-copilot)
- [Prompt cookbook](/guides/prompt-cookbook)
- [Semantic models](/docs/build/semantic-models)
- [About dbt AI and intelligence](/docs/dbt-ai/about-dbt-ai)

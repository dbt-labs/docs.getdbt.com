---
title: "Developer agent"
id: "developer-agent"
description: "Use the Developer agent to write or refactor dbt models from natural language, validate with dbt Fusion Engine, and run against your warehouse with full context."
sidebar_label: "Developer agent"
tags: [AI, Agents, Studio]
---

import DevAgent from '/snippets/_developer-agent-studio-setup.md';

# Developer agent <Lifecycle status="beta,self_service,managed,managed_plus"/>

<IntroText>
The <Constant name="dev_agent" /> is the next evolution of <Constant name="copilot" /> and provides agentic capabilities to streamline the developer experience in the <Constant name="studio_ide" />. Build, refactor, test, document, and explore your dbt project from natural language &mdash; grounded in your project's lineage, metadata, governance, and <Constant name="semantic_layer" /> &mdash; while keeping every change auditable.
</IntroText>
  
The <Constant name="dev_agent" /> is designed to support the full dbt development lifecycle &mdash; from initial model creation to testing, documentation, and semantic layer definition. Some examples of what you can do:

- Build or modify models from natural language descriptions of the transformation or logic you need.
- Automatically generate and validate YAML definitions for tests, documentation, and semantic models directly from your existing dbt models, eliminating manual setup.
- Make targeted changes to your project such as renaming columns, changing materializations, adjusting logic, or adding advanced data quality tests — while the agent keeps associated YAML files in sync.
- Explore your project with the agent by asking questions about your DAG, querying the <Constant name="catalog"/>, and surfacing lineage and metadata to guide your development.
- Investigate and troubleshoot dbt job and run failures by asking the agent about recent failures, root causes, and fixes — powered by the `troubleshooting-dbt-job-errors` skill in dbt Agent Skills. <Lifecycle status="beta"/>

The agent comes with the following out of the box — no configuration needed! 🎉

- [dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills): A curated collection of dbt-recommended guidance and instructions, managed by dbt Labs and always up to date.
- [dbt MCP server Product docs toolset](/docs/dbt-ai/mcp-available-tools#product-docs): Enables the agent to search and fetch content directly from dbt's official documentation at [docs.getdbt.com](https://docs.getdbt.com/).

## Prerequisites

- A Starter or Enterprise-tiered plan
- A [<Constant name="dbt" /> account](https://www.getdbt.com/signup) and [Developer seat license](/docs/platform/manage-access/seats-and-users).
- A [development environment](/docs/platform/studio-ide/develop-in-studio#get-started-with-the-studio-ide) and credentials set up in the <Constant name="studio_ide" />.
- [Account access](/docs/platform/enable-dbt-copilot) to <Constant name="copilot" /> features.

#### Availability and considerations

- The <Constant name="dev_agent" /> is available in the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) only and for all [deployment types](/docs/platform/about-platform/tenancy?version=2.0). It's not available in VS Code or the <Constant name="platform_cli" />.
- It works across all engines (<Constant name="fusion_engine" /> and <Constant name="core" />).
- Currently, **Plan** mode isn't supported. The <Constant name="dev_agent" /> drafts changes directly without showing a plan first. Use **Ask for approval** mode if you want to approve each file change before it is persisted.
- You cannot edit a prompt after submitting it. To refine your request, click the **Start over** button located at the top right corner of the Copilot panel. This resets the session and you can submit a new prompt.
- Retaining chat history isn't supported for single tenant deployments yet. We recommend you save important info manually between sessions.

## Using the Developer agent

<DevAgent />

<div style={{maxWidth: '100%', margin: '20px 0'}}>
<video width="100%" controls autoPlay muted loop playsInline>
  <source src="/img/docs/dbt-platform/dev-agent.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
<span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', color: 'var(--ifm-color-emphasis-600)', marginTop: '8px'}}>Example of using the Developer agent to refactor a model in the Studio IDE.</span>
</div>

For more details on the <Constant name="dev_agent" /> and how it works, see the following sections:

- [Panel controls](#panel-controls)
- [Agent modes](#agent-modes)
- [Reviewing agent suggestions](#reviewing-agent-suggestions)
- [Granting command permissions](#granting-command-permissions)

#### Panel controls

The <Constant name="copilot" /> panel contains:

1. **Quick actions** (center): The <Constant name="studio_ide" /> surfaces quick actions at the top of the panel to help you get started with common tasks, like generating documentation, semantic models, tests, and metrics. When selected, the text field is pre-filled with a prompt for the selected action. These quick actions may evolve over time as new capabilities are added.
2. **Agent mode button** (bottom left): Switch between **Ask for approval** and **Edit files automatically** mode. Click the button to change modes.
3. **Model context** (bottom left): Shows the currently open file. Use `@` in the text field to reference a different model. Click **x** to remove the model context.
4. **Text input field** (bottom left): Type your prompt in the text field to describe what you want to build or change. Type `@` to select a model as context. This scopes the agent's changes to that resource.
5. **Start over** (top right): Resets the current session. When you click this button, a confirmation prompt appears. Click **Start over** to confirm, or **Cancel** to return to your current conversation. You cannot undo this action.
6. **Stop** or **Enter** (bottom right): Press **Enter** to submit your prompt. Press **Stop** to stop the current session and agent processing. You cannot undo this action. 

<Lightbox src="/img/docs/dbt-platform/dev-agent-copilot-panel.png" width="95%" title="The Copilot panel in the Studio IDE showing quick-action buttons, text input field, and agent mode controls." />

#### Agent modes

The <Constant name="dev_agent" /> operates in two modes:

<SimpleTable>

| Mode | Behavior |
|------|----------|
| **Ask for approval** (default) | The agent drafts edits to files. You must approve each file change before it is persisted. Best when you want tight control over what gets saved to your branch. |
| **Edit files automatically** | The agent drafts and automatically edits files without per-file approval. Best for faster iteration when you're confident in the prompt. | 
</SimpleTable>

You can switch between modes at any time by clicking the **Agent mode** button in the <Constant name="copilot" /> panel.

<Lightbox src="/img/docs/dbt-platform/dev-agent-ask-mode.png" width="95%" title="The Developer agent in Ask for approval mode, requesting approval before making file edits." />


#### Reviewing agent suggestions

When the <Constant name="dev_agent" /> proposes code changes, you can review them before they are committed to your project:

- **View the diff**: The agent displays a diff of the proposed changes. Click **Show all X lines** to expand and view the full suggestion.
- **Line indicators**: Added and removed lines are highlighted with line number indicators so you can see exactly what changed.
- **Copy or open in editor**: Use the options in the top-right corner of the diff view to copy the suggestion or open it directly in the editor.

<Lightbox src="/img/docs/dbt-platform/dev-agent-code-suggestion.png" width="95%" title="The Developer agent displaying a diff of proposed YAML changes with line indicators and copy/open options." />

#### Granting command permissions

To validate or run models during a session, the agent may request to run dbt commands such as `dbt compile` or `dbt build`. You'll be prompted to approve each request before it executes. For example, the agent might request to run:

```
dbt compile --select model_name
```

You can select one of the following options:

<SimpleTable>

| Option | Behavior |
|--------|----------|
| **Yes, run once** | Grants permission to run this specific command one time. |
| **Yes, and allow `dbt_command_name` for the session** | Grants permission to run dbt commands for the remainder of your session without prompting again. |
| **No** | Denies the request. The agent will not run the command. |

</SimpleTable>

## Debug job failures <Lifecycle status="beta"/>

:::info
Debugging job failures with <Constant name="dev_agent"/> is currently in beta.
:::

The <Constant name="dev_agent" /> can investigate and troubleshoot dbt job and run failures directly from the <Constant name="studio_ide" />. This capability is powered by the `troubleshooting-dbt-job-errors` [dbt Agent Skill](https://github.com/dbt-labs/dbt-agent-skills), which comes pre-configured with the agent — no setup required.

You can ask the agent questions and issue commands like:

- "What jobs have failed recently?"
- "What is the root cause of the job failure?"
- "How can I fix the recent job failure?"
- "Fix the job failure."

The agent notes when your local project state may differ from the job — for example, if you're on a different branch or have uncommitted changes — so you have full context before acting on any suggested fixes.

## Fusion migration workflow {#fusion-migration-workflow}

import FusionMigrationWorkflow from '/snippets/_fusion-migration-workflow.md';

<FusionMigrationWorkflow />

For more on how to prepare your project for <Constant name="fusion" /> and what to do when you hit compatibility errors, see the [Fusion readiness checklist](/docs/fusion/fusion-readiness) and the [Upgrade to Fusion guides](/guides/prepare-fusion-upgrade).

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
- [Fusion readiness checklist](/docs/fusion/fusion-readiness)
- [Develop with dbt Copilot](/docs/platform/studio-ide/develop-copilot)
- [Prompt cookbook](/guides/prompt-cookbook)
- [Semantic models](/docs/build/semantic-models)
- [About dbt AI and intelligence](/docs/dbt-ai/about-dbt-ai)

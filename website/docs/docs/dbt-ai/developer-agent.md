---
title: "Developer agent"
id: "developer-agent"
description: "Use the Developer agent to write or refactor dbt models from natural language, validate with dbt Fusion Engine, and run against your warehouse with full context."
sidebar_label: "Developer agent"
tags: [AI, Agents, Studio]
---

# Developer agent <Lifecycle status="private_beta"/>

<IntroText>
The <Constant name="dev_agent" /> is an AI assistant built into the <Constant name="cloud_ide" /> that can write, refactor, and validate dbt models using your project's structured context &mdash; including lineage, metadata, governance, and the Semantic Layer.
</IntroText>

It helps you move faster by generating models, tests, and documentation from natural language prompts, while keeping every change auditable and aligned with your dbt project.

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
- It does not retain context between sessions. If you close or leave the <Constant name="cloud_ide" />, you start from scratch in your next session.
- Currently, plan mode isn't supported. The <Constant name="dev_agent" /> applies changes directly without showing a plan first. Use **Ask** mode if you want to confirm each edit before it is applied.
- Custom skill support isn't yet available.

## Use the Developer agent
To use the <Constant name="dev_agent" />, follow these steps:
1. Open your dbt project in the [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio), then click **<Constant name="copilot" />** in the command palette. 
2. Select the [**Agent mode** button](#agent-modes) to specify the mode for the <Constant name="dev_agent" />. Availble modes are **Ask** and **Code**.
3. Start a prompt in several ways:
   - **Quick-action buttons** &mdash; The buttons at the top of the panel (**Generate documentation**, **Semantic model**, **Generate generic tests**, **Metrics**) pre-fill prompts for common tasks.
   - **Plain text** &mdash; Type directly into the text field to describe what you want to build or change.
   - **Slash commands** &mdash; Type `/` to browse available commands.
   - **Model context** &mdash; Type `@` to select a model as context. This scopes the agent's changes to that resource.
4. [Review the agent's suggestions](#reviewing-agent-suggestions) and approve or reject the changes. You can also use the **Start over** button to reset the current session.
5. [Approve and run commands](#granting-command-permissions) using the `invoke_dbt` command prompted by the <Constant name="dev_agent" />.
6. Repeat the process to build or change more models.
7. Commit the changes to your dbt project and open a pull request.

For more details on the <Constant name="dev_agent" /> and how it works, see the following sections.

#### Panel controls

The toolbar below the text field contains:

- **Agent mode button** (bottom left) &mdash; Switch between **Ask** and **Code** mode. Click the button to change modes.
- **Active model** (bottom left, next to mode) &mdash; Shows the currently open file. Use `@` in the text field to reference a different model. Click **x** to remove the model context.
- **Start over** (top right) &mdash; Resets the current session. A confirmation prompt will appear &mdash; click **Start over** to confirm, or **Cancel** to return to your current conversation. This action cannot be undone.

#### Agent modes

The <Constant name="dev_agent" /> operates in two modes:

<SimpleTable>

| Mode | Behavior |
|------|----------|
| **Ask** | The agent asks for your confirmation before making each edit to a file. Use this when you want to review and approve changes before they are applied. |
| **Code** | The agent edits files immediately without waiting for confirmation. Use this for faster iteration when you're confident in the prompt. |

</SimpleTable>

You can switch between modes at any time. Use **Ask** mode when working in shared projects, making structural changes, or exploring unfamiliar models. Use **Code** mode when iterating quickly on a development branch.

#### Reviewing agent suggestions

When the <Constant name="dev_agent" /> proposes code changes, you can review them before they are committed to your project:

- **View the diff** &mdash; The agent displays a diff of the proposed changes. Click **Show all X lines** to expand and view the full suggestion.
- **Line indicators** &mdash; Added and removed lines are highlighted with line number indicators so you can see exactly what changed.
- **Copy or open in editor** &mdash; Use the options in the top-right corner of the diff view to copy the suggestion or open it directly in the editor.

#### Granting command permissions

To validate or run models during a session, the agent executes dbt commands using `invoke_dbt`. You'll be prompted to approve each request. For example:

```
invoke_dbt(args: ["compile", "--select", "model_name"])
```

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

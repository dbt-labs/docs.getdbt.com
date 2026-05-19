---
title: "Developer agent"
id: "developer-agent"
description: "Use the Developer agent to write or refactor dbt models from natural language, validate with dbt Fusion Engine, and run against your warehouse with full context."
sidebar_label: "Developer agent"
tags: [AI, Agents, Studio]
---

import DevAgent from '/snippets/_developer-agent-studio-setup.md';

# Developer agent <Lifecycle status="preview,self_service,managed,managed_plus"/>

<IntroText>
The <Constant name="dev_agent" /> is the next evolution of <Constant name="copilot" /> in the <Constant name="studio_ide" />. Describe what you need in natural language to build, refactor, test, and document your project &mdash; grounded in lineage, metadata, governance, and the <Constant name="semantic_layer" />, with every change auditable.
</IntroText>
:::info 
The <Constant name="dev_agent" /> is in preview as of May 6, 2026 for Starter and Enterprise plans. Enterprise plan customers can contact your account manager for changes. Starter plan customers can contact [dbt Labs Support](mailto:support@getdbt.com).
:::  
The <Constant name="dev_agent" /> is designed to support the full dbt development lifecycle &mdash; from initial model creation to testing, documentation, and semantic layer definition. Some examples of what you can do:

- Build or change models using natural-language prompts about the logic you want.
- Generate and validate YAML for tests, documentation, and semantic models from existing models, with less manual boilerplate.
- Make scoped edits (renames, materializations, logic, stricter tests, and so on) while keeping related YAML in sync.
- Explore the <Term id="dag" />, query the <Constant name="catalog"/>, and use lineage and metadata to guide your development. 
- Investigate job and run failures (errors, likely causes, fixes) using the `troubleshooting-dbt-job-errors` skill in dbt Agent Skills.

The agent comes with the following out of the box — no configuration needed! 🎉

- [dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills): A curated collection of dbt-recommended guidance and instructions, managed by dbt Labs and always up to date.
- [dbt MCP server Product docs toolset](/docs/dbt-ai/mcp-available-tools#product-docs): Enables the agent to search and fetch content directly from dbt's official documentation at [docs.getdbt.com](https://docs.getdbt.com/).

## Prerequisites

- A Starter or Enterprise-tiered plan
- A [<Constant name="dbt" /> account](https://www.getdbt.com/signup) and [Developer seat license](/docs/platform/manage-access/seats-and-users).
- A [development environment](/docs/platform/studio-ide/develop-in-studio#get-started-with-the-studio-ide) and credentials set up in the <Constant name="studio_ide" />.
- [Account access](/docs/platform/enable-dbt-copilot) to <Constant name="copilot" /> features.

#### Availability and considerations

- **Where it runs:** Supported in the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) only, all [deployment types](/docs/platform/about-platform/tenancy?version=2.0). Not supported in VS Code or the <Constant name="platform_cli" />.
- **Engines:** Works with <Constant name="fusion_engine" /> and <Constant name="core" />.
- **Conversations:** In the conversation list, open **More actions** menu (three dots) of the conversation you want to delete, then click **Delete** to remove one thread. Deleting the open thread clears the panel.
- **Sessions:** Refreshing the same browser tab keeps your active session. A new tab, or returning after closing the tab, starts empty. 
- **Chat history:** Retained for 90 days only. Chat history isn't supported yet on single-tenant deployments, so save anything important before closing.
- **Plan mode:** Not supported yet. The agent doesn't show a separate plan before applying changes, however you can use the **Ask for approval** mode to approve each file.
- **New chat:** Click **Start new Copilot chat** (top right of the Copilot panel) to begin a new session.

## Using the Developer agent

<DevAgent />

<div style={{maxWidth: '100%', margin: '20px 0'}}>
<video width="100%" controls autoPlay muted loop playsInline>
  <source src="/img/docs/dbt-platform/dev-agent.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
<span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', color: 'var(--ifm-color-emphasis-600)', marginTop: '8px'}}>Example of using the Developer agent to refactor a model in the Studio IDE.</span>
</div>

For more details on the <Constant name="dev_agent" /> and how it works, expand the following sections to open additional information.

<Expandable alt_header="Panel controls">

The <Constant name="copilot" /> panel contains:

1. **Quick actions** (center): The <Constant name="studio_ide" /> surfaces quick actions at the top of the panel to help you get started with common tasks, like generating documentation, semantic models, tests, and metrics. When selected, the text field is pre-filled with a prompt for the selected action. These quick actions may evolve over time as new capabilities are added.
2. **Agent mode button** (bottom left): Switch between **Ask for approval** and **Edit files automatically** mode. Click the button to change modes.
3. **Model context** (bottom left): Shows the currently open file. Use `@` in the text field to reference a different model. Click **x** to remove the model context.
4. **Text input field** (bottom left): Type your prompt in the text field to describe what you want to build or change. Type `@` to select a model as context. This scopes the agent's changes to that resource.
5. **Start new Copilot chat** (top right): Starts a new chat session.
6. **Stop** or **Enter** (bottom right): Press **Enter** to submit your prompt. Press **Stop** to stop the current session and agent processing. You cannot undo this action. 

<Lightbox src="/img/docs/dbt-platform/dev-agent-copilot-panel.png" width="95%" title="The Copilot panel in the Studio IDE showing quick-action buttons, text input field, and agent mode controls." />

</Expandable>

<Expandable alt_header="Agent modes">

The <Constant name="dev_agent" /> operates in two modes:

<SimpleTable>

| Mode | Behavior |
|------|----------|
| **Ask for approval** (default) | The agent drafts edits to files. You must approve each file change before it is persisted. Best when you want tight control over what gets saved to your branch. |
| **Edit files automatically** | The agent drafts and automatically edits files without per-file approval. Best for faster iteration when you're confident in the prompt. | 
</SimpleTable>

You can switch between modes at any time by clicking the **Agent mode** button in the <Constant name="copilot" /> panel.

<Lightbox src="/img/docs/dbt-platform/dev-agent-ask-mode.png" width="95%" title="The Developer agent in Ask for approval mode, requesting approval before making file edits." />

</Expandable>

<Expandable alt_header="Reviewing agent suggestions">

When the <Constant name="dev_agent" /> proposes code changes, you can review them before they are committed to your project:

- **View the diff**: The agent displays a diff of the proposed changes. Click **Show all X lines** to expand and view the full suggestion.
- **Line indicators**: Added and removed lines are highlighted with line number indicators so you can see exactly what changed.
- **Copy or open in editor**: Use the options in the top-right corner of the diff view to copy the suggestion or open it directly in the editor.

<Lightbox src="/img/docs/dbt-platform/dev-agent-code-suggestion.png" width="95%" title="The Developer agent displaying a diff of proposed YAML changes with line indicators and copy/open options." />

</Expandable>

<Expandable alt_header="Granting command permissions">

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

After you run a command, <Constant name="copilot" /> adds an icon and **Run by Copilot** tooltip to the <Constant name="studio_ide" /> [**Commands** tab](/docs/platform/studio-ide/ide-user-interface#console-section) results. This helps you distinguish agent-run commands from manually run commands in the run results and logs.

<Lightbox src="/img/docs/dbt-platform/dev-agent-cmd-icon.png" width="95%" title="Commands run by the Developer agent appear in the Studio IDE Commands tab with a Copilot icon and 'Run by Copilot' tooltip." />

</Expandable>

## Bringing your own skills

A skill is a reusable set of instructions that the agent can load to perform a specific workflow, such as applying your team's SQL patterns, modeling standards, or domain-specific logic. Skills help the <Constant name="dev_agent" /> produce more consistent results, reduce repeated prompt writing, and match the agent's generated changes with your team's conventions.

To add custom skills to your project:

1. In <Constant name="studio_ide" />, create a skill file at `skills/SKILL_NAME/SKILL.md` in your project.
2. Add clear instructions in `SKILL.md` for what the skill should do and when to use it.
  
    Custom skills use the same [Agent Skills](https://agentskills.io/specification) format as [dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills) on GitHub. A typical `SKILL.md` includes:

    - YAML frontmatter at minimum with `name` and `description` (optional fields allowed).
    - Markdown body with sections for when to use the skill, workflow steps, and conventions.
    - Optional `references/` files for extra detail the agent can load when needed.
3. Optionally add supporting sub-files under the same skill folder (for example, `skills/SKILL_NAME/references/example.md`) that the agent can read when needed.
4. Start a new agent session after adding or changing skills so the agent can pick up the updates.

If a custom skill and a built-in skill use the same name, the custom skill takes precedence.

For a full production-style example, check out dbt's [`adding-dbt-unit-test` skill](https://github.com/dbt-labs/dbt-agent-skills/blob/main/skills/dbt/skills/adding-dbt-unit-test/SKILL.md).

#### Example folder layout

The following example shows the recommended folder layout:

```text
skills/
  my-team-style/
    SKILL.md
    references/
      naming-conventions.md
```

#### Example skill file

If you're new to skills, start with a small `SKILL.md` like the following, then grow it over time. Let's pretend Santi Corp is a plasticine manufacturer and their data practitioners want to apply their modeling conventions to all models in the project.

```markdown
---
name: my-team-style
description: Apply Santi Corp's modeling conventions when editing or creating dbt models. Use when the user asks for refactors, new models, or YAML in this project.
---

# My team style

## When to use

Use this skill whenever you are changing SQL or YAML under `models/` and the user did not override these rules.

## Conventions

- Staging models use prefix `stg_` and live in `models/staging/`.
- Facts and dimensions use `fct_` and `dim_` prefixes respectively.
- Document new columns in the same PR as the model change.

## Optional detail

For edge cases, read `references/naming-conventions.md` in this skill folder before proposing renames.
```

#### Running a custom skill

To use a custom skill in the <Constant name="dev_agent" />:

1. Prompt the agent with the task and reference the skill by name (for example, "Use `my-team-style` to refactor this model and update related YAML").
2. If needed, use `@` mentions to point to the skill file or supporting `.md` files directly.
3. Review and approve the proposed changes as usual in the <Constant name="copilot" /> panel.

Some considerations to keep in mind:

- Cross-project or package-style skill distribution isn't natively supported yet. To reuse a skill in another repo, copy the skill files manually.
- Skills are discovered at session start. If a skill is added mid-session, start a new chat.
- If a custom skill and a built-in skill use the same name, the custom skill takes precedence.

## Debug job failures

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

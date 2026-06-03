---
title: "Use subagents with dbt Wizard"
id: "wizard-subagents"
description: "Delegate work to specialized subagents in dbt Wizard, in the dbt platform or the CLI."
sidebar_label: "Use subagents"
tags: [AI, Wizard]
---

import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';

# Use subagents with <Constant name="wizard"/> <Lifecycle status="beta"/>

<IntroText>
Subagents let <Constant name="wizard" /> spin up focused, parallel agents to handle parts of a larger task &mdash; one to explore your project, one to make changes, one to review them. <Constant name="wizard"/> orchestrates them and consolidates the results back into your session.
</IntroText>

Use subagents when your task can be split into independent pieces of work. It's good for things like reviewing a large pull request, debugging a failed job, adding tests across multiple models, or researching documentation while another agent inspects your project.

For smaller, direct tasks, you usually don't need subagents. For example, ask one question like “What does this model do?” or “Fix this failing test” without asking to split the work.

Subagents run more work in parallel, which uses more tokens than a single-agent session handling the same task. Use them when the task benefits from division of labor.

<WizardFeedbackCallout />

## Where you can use subagents

Subagents work in <Constant name="wizard" /> both in the [<Constant name="dbt_platform" />](/docs/platform/wizard-platform) (<Constant name="studio_ide" /> and the home app) and in the [<Constant name="wizard" /> CLI](/docs/dbt-ai/about-dbt-wizard-cli). 

<Constant name="wizard"/> surfaces subagent activity in both places so you can see what each agent is working on.

In the CLI, you can also define custom agent roles, set display nicknames, and configure global limits through the `config.toml` file. The following sections call out which steps are CLI-specific.

## How subagents work
An agent is a role that describes a type of work, like `explorer`, `worker`, or `test_writer`. 

A subagent is a running instance of one of those roles. For example, if starts two explorer agents to answer two different questions, those are two subagents using the same agent role.

<Constant name="wizard"/> handles orchestration for you. It starts subagents, routes work to them, waits for their results, and consolidates their output into your session.

Subagents are used in the following ways:

| How subagents start | Example |
| ------------------- | ------- |
| You ask to split up the work. | `Review PR #123. Use one agent to map what changed, one to check tests and downstream impact, and one to look up the relevant dbt docs.` |
| <Constant name="wizard"/> automatically uses a configured agent because your task matches that agent's description. | `Add tests for stg_customers and check whether similar staging models are missing tests.` |

<Constant name="wizard"/> then spawns the agents, lets them work in parallel, and brings their findings back into one response.

## Built-in agents

<Constant name="wizard"/> ships with built-in agents that it can spawn without any configuration. Several are purpose-built for dbt work:

<SimpleTable>

| Agent | What it's for | Example |
|-------|---------------| ------- | 
| `explorer` | Answers specific, well-scoped questions about your project. Fast and read-only &mdash; spawn several in parallel for independent questions. | `Use explorer to explain what depends on fct_orders.` |
| `worker` | Performs execution and production work, such as, implementing part of a feature, fixing tests or bugs, or splitting a large refactor into independent chunks. | `Use worker to update these staging models to follow our naming convention.` |
| `validation` | Provides dbt validation. After model edits, runs structured validation &mdash; SQL check, `dbt run` with `--defer`, prod vs. dev comparison, and impact analysis &mdash; to validate changes before you merge. | `Use validation to check whether my changes to int_payments are safe to merge.` |
| `test_writer` | Improves dbt test coverage. Analyzes project metadata and warehouse data to find coverage gaps, validates assumptions with queries, and writes `schema.yml` tests for models with low or no coverage. | `Use test_writer to add tests to stg_customers.` |

</SimpleTable>

You don't need to declare these &mdash; <Constant name="wizard"/> routes to them automatically when a task fits, or you can ask for one by name. For example, both of these prompts can use the `test_writer` agent:

| Prompt style	| Example |
| ------------- | ------- |
| Ask naturally	| Add useful tests for stg_customers. |
| Ask for the agent by name	| Use test_writer to add tests to stg_customers.|

To add your own roles, refer to [Custom agents](#custom-agents-cli).

## Manage subagents

Use slash commands inside an interactive session to inspect and steer agent threads:

<SimpleTable>

| Command | What it does | Example |
|---------|------------- | ------- |
| `/agent` | Switch the active agent thread to inspect or steer ongoing work. | Use `/agent` when you want to jump from the main session into a specific agent thread to give it more direction. |
| `/subagents` | View and switch between running subagent threads. | Use `/subagents` to see which helper agents are active during a delegated task, then select one to inspect its progress. |

</SimpleTable>

You can also tell <Constant name="wizard"/> in plain language to steer, stop, or close an agent thread. For example, `Stop the docs researcher agent and continue with the reviewer findings.`

For the full list of session commands, refer to the [slash command reference](/docs/dbt-ai/wizard-slash-commands).

## Approvals and sandbox

Subagents inherit the parent session's [approval and sandbox policy](/docs/dbt-ai/wizard-how-it-works#approval-and-sandboxing). Any runtime overrides you set for a turn (permissions, sandbox mode) apply to the agents it spawns. Approval requests from a subagent surface in your session labeled with their source, so you know which agent is asking.

A custom agent can override sandbox settings for itself &mdash; useful when, for example, an exploration agent should stay read-only while a build agent needs workspace write access.

## Custom agents (CLI) {#custom-agents}

You can define custom agent _roles_ in `~/.dbt/wizard/config.toml`. 

A custom agent role is a reusable role for a particular type of work you want <Constant name="wizard"/> to perform, like reviewing code, exploring a project, or debugging something. You can create any role name that fits your workflow, it doesn't't have to be one of the built-in roles. 

Each role has two parts:

| Part | Where it lives| What it does |
|------|---------------|--------------|
| Role declaration | `~/.dbt/wizard/config.toml` | Gives the role a name and tells when to use it.|
| Role config | A `.toml` file referenced by `config_file` | Defines how that role behaves, including its model, instructions, sandbox mode, and MCP servers.|

Declare a role by adding an `[agents.ROLE_NAME]` table to your main `config.toml`. Replace `ROLE_NAME` with the name you want to use for the role. For example, `[agents.reviewer]` creates a role named `reviewer`.

The `[agents.ROLE_NAME]` table supports these fields:

<SimpleTable>

| Field | Required | Description |
|-------|----------|-------------|
| `description` | Yes* | Explains when to use the role.  <Constant name="wizard"/>  reads this description to decide whether the role fits a task. *Required unless supplied by the file referenced in `config_file`. |
| `config_file` | No | Path to a role-specific .toml file. Not the same file as your main `~/.dbt/wizard/config.toml`, it's an additional config file for this role. Relative paths resolve from the main `config.toml` file that declares the role. This is where you set the role's model, instructions, sandbox, and MCP servers. |
| `nickname_candidates` | No | Display-only labels for instances of this role in the UI, such as `Scout` or `Ranger`. The nickname does not identify the role. |

</SimpleTable>

The file referenced by config_file is an ordinary [`config.toml`](/docs/dbt-ai/wizard-config#configtoml) layer. It accepts the same keys as your main config, including `model`, `developer_instructions`, sandbox settings, and `mcp_servers`. Any setting you do not define in the role-specific file inherits from the parent session.

### Display nicknames

When several instances of the same role run at once, `nickname_candidates` give each a readable label in the UI (for example, `Scout`, `Ranger`). Nicknames are display-only &mdash; <Constant name="wizard"/> identifies a role by its `[agents.ROLE_NAME]` key, not the nickname shown.

### Global settings

Tune how agents run under the `[agents]` section in `config.toml`:

<SimpleTable>

| Key | Description |
|-----|-------------|
| `max_depth` | Maximum nesting depth for spawned agent threads. Root sessions start at depth 0. |
| `job_max_runtime_seconds` | Default maximum runtime, in seconds, for agent job workers. |
| `interrupt_message` | Whether to record a model-visible message when an agent turn is interrupted. Defaults to `true`. |

</SimpleTable>
## Examples

### Pull request review

Define three roles that split a review into exploration, validation, and documentation lookup. Declare the roles in your main `config.toml` and point each at a role config file:

<File name='~/.dbt/wizard/config.toml'>

```toml
[agents]
max_depth = 2

[agents.pr_explorer]
description = "Maps what changed in a pull request and which models, tests, and exposures it touches."
config_file = "./agents/pr_explorer.toml"
nickname_candidates = ["Scout", "Ranger"]

[agents.reviewer]
description = "Reviews dbt model changes for test coverage, naming conventions, and contract compatibility."
config_file = "./agents/reviewer.toml"

[agents.docs_researcher]
description = "Looks up relevant dbt documentation for patterns referenced in the change."
config_file = "./agents/docs_researcher.toml"
```

</File>

Each role config file is a normal config layer. For example, the explorer stays read-only, while the researcher gets access to the dbt MCP server:

<File name='./agents/docs_researcher.toml'>

```toml
developer_instructions = "Find and cite the dbt docs pages relevant to the change so the reviewer can link to them. Do not edit files."

[mcp_servers.dbt]
command = "uvx"
args = ["dbt-mcp"]
```

</File>

Then prompt <Constant name="wizard"/>:

```
Review PR #482 using pr_explorer, reviewer, and docs_researcher.
```

### Debug a failed job run (home app)

In the <Constant name="dbt_platform" /> home app, ask <Constant name="wizard"/> to investigate a failed job by delegating to focused agents:

```
The nightly job failed. Use one agent to pull the run error and logs,
one to trace the failing model's lineage and find the root cause, and
one to propose a fix. Summarize what each found.
```

<Constant name="wizard"/> spawns the agents, each works its part against your connected project, and <Constant name="wizard"/> consolidates the diagnosis and proposed fix into one response.

## Related docs

- [Use MCP servers with the <Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-mcp) to give agents more tools and context
- [Use skills](/docs/dbt-ai/wizard-skills) for reusable, project-specific instructions
- [<Constant name="wizard" /> slash commands](/docs/dbt-ai/wizard-slash-commands) for `/agent` and `/subagents`
- [<Constant name="wizard" /> CLI config](/docs/dbt-ai/wizard-config) for `config.toml` keys and precedence
- [How <Constant name="wizard" /> works](/docs/dbt-ai/wizard-how-it-works) for approvals and sandboxing

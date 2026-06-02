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

Subagents run more work in parallel, which uses more tokens than a single-agent session handling the same task. Spawn them when a task genuinely benefits from division of labor.

<WizardFeedbackCallout />

## Where you can use subagents

Subagents work with <Constant name="wizard" /> both in the [<Constant name="dbt_platform" />](/docs/platform/wizard-platform) (<Constant name="studio_ide" /> and the home app) and in the [<Constant name="wizard" /> CLI](/docs/dbt-ai/about-dbt-wizard-cli). 

<Constant name="wizard"/> surfaces subagent activity in both places so you can see what each agent is working on.

<Constant name="wizard" /> enables you to define custom agents, set display nicknames, and define global limits through the `config.toml` file. The following sections call out which steps are CLI-specific.

## How subagents work

<Constant name="wizard"/> handles orchestration for you &mdash; spawning agents (starting up a new helper agent to work on a task), routing work to them, waiting for results, and consolidating their output. Subagents are spawned only when you explicitly ask for them or when a task you describe maps onto a configured agent.

For example, prompt <Constant name="wizard"/>:

```
Review PR #123. Use one agent to map what changed, one to check tests
and downstream impact, and one to look up the relevant dbt docs.
```

<Constant name="wizard"/> spawns the agents, lets them work in parallel, and brings their findings back into one response.

## Built-in agents

<Constant name="wizard"/> ships with built-in agents that it can spawn without any configuration. Several are purpose-built for dbt work:

<SimpleTable>

| Agent | What it's for |
|-------|--------------|
| `explorer` | Answers specific, well-scoped questions about your project. Fast and read-only — spawn several in parallel for independent questions. |
| `worker` | Execution and production work: implementing part of a feature, fixing tests or bugs, or splitting a large refactor into independent chunks. |
| `validation` | A dbt validation specialist. After model edits, runs structured validation — SQL check, `dbt run` with `--defer`, prod vs. dev comparison, and impact analysis — to validate changes before you merge. |
| `test_writer` | A dbt test coverage specialist. Analyzes project metadata and warehouse data to find coverage gaps, validates assumptions with queries, and writes `schema.yml` tests for models with low or no coverage. |

</SimpleTable>

You don't need to declare these &mdash; <Constant name="wizard"/> routes to them automatically when a task fits, or you can ask for one by name (for example, "use `test_writer` to add tests to `stg_customers`"). To add your own roles, refer to [Custom agents](#custom-agents-cli).

## Manage subagents

Use slash commands inside an interactive session to inspect and steer agent threads:

<SimpleTable>

| Command | What it does |
|---------|-------------|
| `/agent` | Switch the active agent thread to inspect or steer ongoing work. |
| `/subagents` | View and switch between running subagent threads. |

</SimpleTable>

You can also tell <Constant name="wizard"/> in plain language to steer, stop, or close an agent thread. For the full list of session commands, refer to the [slash command reference](/docs/dbt-ai/wizard-slash-commands).

## Approvals and sandbox

Subagents inherit the parent session's [approval and sandbox policy](/docs/dbt-ai/wizard-how-it-works#approval-and-sandboxing). Any runtime overrides you set for a turn (permissions, sandbox mode) apply to the agents it spawns. Approval requests from a subagent surface in your session labeled with their source, so you know which agent is asking.

A custom agent can override sandbox settings for itself &mdash; useful when, for example, an exploration agent should stay read-only while a build agent needs workspace write access.

## Custom agents (CLI) {#custom-agents}

Beyond the built-in behavior, you can define custom agent _roles_ in `~/.dbt/wizard/config.toml`. Each role is a reusable agent &mdash; a reviewer, an explorer, a debugger &mdash; that <Constant name="wizard"/> can spawn by name.

A role is declared as a `[agents.ROLE_NAME]` table. The role name is the key (for example, `[agents.reviewer]`), and the table supports these fields:

<SimpleTable>

| Field | Required | Description |
|-------|----------|-------------|
| `description` | Yes* | When to use the role. <Constant name="wizard"/> reads this to decide which role fits a task. *Required unless supplied by the referenced `config_file`. |
| `config_file` | No | Path to a role-specific config layer (a `.toml` file). Relative paths resolve against the `config.toml` that defines the role. This is where you set the role's model, instructions, sandbox, and MCP servers. |
| `nickname_candidates` | No | Readable display labels for spawned instances of this role. |

</SimpleTable>

The role's behavior — its AI model, `developer_instructions`, sandbox mode, and `mcp_servers` — lives in the file referenced by `config_file`. That file is an ordinary [`config.toml`](/docs/dbt-ai/wizard-config#configtoml) layer, so it accepts the same keys as your main config. Anything you don't set there inherits from the parent session.

### Display nicknames

When several instances of the same role run at once, `nickname_candidates` give each a readable label in the UI (for example, `Scout`, `Ranger`). Nicknames are cosmetic &mdash; <Constant name="wizard"/> identifies a role by its `[agents.ROLE_NAME]` key, not the nickname shown.

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

- [Use MCP servers with <Constant name="wizard" />](/docs/dbt-ai/wizard-mcp) to give agents more tools and context
- [Use skills](/docs/dbt-ai/wizard-skills) for reusable, project-specific instructions
- [<Constant name="wizard" /> slash commands](/docs/dbt-ai/wizard-slash-commands) for `/agent` and `/subagents`
- [<Constant name="wizard" /> CLI config](/docs/dbt-ai/wizard-config) for `config.toml` keys and precedence
- [How <Constant name="wizard" /> works](/docs/dbt-ai/wizard-how-it-works) for approvals and sandboxing

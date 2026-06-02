---
title: "How dbt Wizard works"
id: "wizard-how-it-works"
description: "Understand the dbt Wizard agent loop, tools, project context, and approval workflow."
sidebar_label: "How dbt Wizard works"
tags: [AI, Wizard]
---

<Constant name="wizard" /> helps teams develop, troubleshoot, harden, and ship trusted dbt projects faster and with less risk.

Built for governed data development in dbt, <Constant name="wizard" /> understands the full project, routes to the right dbt tools, and validates work with awareness of warehouse operations, including dev builds, compute costs, run time, and post-build inspection. Use <Constant name="wizard" /> to investigate failed runs, debug model issues, assess downstream impact, make changes, validate results, and ship trusted data work in one place.

Unlike general coding agents, <Constant name="wizard" /> is aware of warehouse operations. It understands that validation can mean compiling code, building to a dev schema, considering compute and run time, and proposing what to inspect after the build completes.

Most of how <Constant name="wizard" /> works is the same in the [<Constant name="dbt_platform" />](/docs/platform/wizard-platform) and in the [terminal CLI](/docs/dbt-ai/wizard-cli). The following sections explain shared behavior first, then call out what differs in each environment.

## Native metadata engine

<Constant name="wizard" /> ships with a metadata engine &mdash; a pre-built, structured index of your entire project that's ready before your first prompt.

Think of it like a map of your whole city: <Constant name="wizard" /> knows how everything connects before it starts, rather than walking every street to figure out the layout.

That index gives <Constant name="wizard" /> four capabilities that aren't possible from file-reading alone:

<SimpleTable>
| Capability | Description |
|---|---|
| Impact analysis | When you ask "what breaks if I change this column?", <Constant name="wizard" /> returns the exact set of downstream models, metrics, tests, and exposures affected — instantly, from the index. Column-level lineage is tracked, so <Constant name="wizard" /> knows not just which models reference a table, but which ones reference that specific column. |
| Health checks | <Constant name="wizard" /> knows which models have tests, which don't, which have stale data, which have failing contracts, and which had recent run failures — as a structured dataset. You can ask "what's unhealthy in this part of my DAG?" and get a precise answer without running anything. |
| Data profiling | <Constant name="wizard" /> can profile your data — row counts, column distributions, null rates — and use that context when deciding how to build or refactor a model. It can reason about your data without materializing models or running expensive queries. |
| Validation loop | <Constant name="wizard" /> validates its own work against the index as a built-in step inside every task — not something you have to prompt for. After generating a change, it checks: does the SQL compile? do downstream refs still resolve? did the new tests pass? If not, it adjusts and retries before showing you anything. |
</SimpleTable>

<Constant name="wizard" /> builds and updates this index from dbt artifacts. In the <Constant name="dbt_platform" />, project state comes from your connected development environment. In the terminal, run `dbt parse`, `dbt compile`, or `dbt build` before a session so <Constant name="wizard" /> has your latest local project state.

:::note dbt version shown in the status panel
The dbt version <Constant name="wizard" /> displays comes from your project's manifest (`target/manifest.json`), not the `dbt` executable on your `PATH`. If you generated the manifest with a different binary, <Constant name="wizard" /> reports that version until you recompile. Run `dbt compile` (or `dbt parse`/`dbt build`) with your intended dbt to refresh the manifest and the displayed version.
:::

{/* DIAGRAM: dbt artifacts/manifests → metadata engine → Wizard context */}

## Validation loop mechanics

The validation loop runs automatically inside every task. Before showing a diff, <Constant name="wizard" /> checks proposed changes against your live project state using the same index it uses for context.

{/* DIAGRAM: proposed change → validation → diff */}

<SimpleTable>
| Change type | What <Constant name="wizard" /> checks |
|---|---|
| SQL generation | Compile generated SQL |
| Test generation | Run new tests |
| Refactors | Verify downstream `ref()`s resolve |
| Contracts | Check schema compatibility |
| Semantic Layer changes | Compile semantic definitions |
| Job investigations | Analyze run results and lineage |
</SimpleTable>

If a check fails, <Constant name="wizard" /> explains the issue, adjusts the approach, and retries — you only see a diff once the change has passed. This loop runs without prompting; it's part of how <Constant name="wizard" /> works, not a feature you activate.

## Tools and capabilities

<Constant name="wizard" /> takes action through a defined set of tools — from reading files to running dbt commands — so you can see exactly what it's doing and why.

<SimpleTable>
| Tool | Purpose | Where available |
|---|---|---|
| File read/write | Read files and propose edits as diffs | Platform and CLI |
| Project queries | Query lineage, tests, metadata, metrics, and run results | Platform and CLI |
| dbt commands | Run commands like `dbt compile`, `dbt build`, and `dbt test` | Platform and CLI |
| Bash | Execute shell commands in your project directory | CLI only |
| Web search | Look up dbt docs and troubleshooting information | Platform and CLI |
| MCP | Access connected MCP servers | CLI (add servers); platform includes built-in docs and platform context |
</SimpleTable>

<Constant name="wizard" /> never runs destructive commands (such as `dbt build --full-refresh`, `dbt run --full-refresh`, or `git reset --hard`) without approval.

## Skills and memories

<Constant name="wizard" /> supports reusable skills and memories that help it apply your team's conventions across sessions.

<SimpleTable>
| Feature | Description |
|---|---|
| Skills | Standardize repeatable workflows and best practices. For example, a skill can tell <Constant name="wizard" /> how your team structures staging models, writes tests, or documents columns. |
| Memories | Store project-specific context that should carry between sessions. For example, <Constant name="wizard" /> can remember that your project uses `customer_id` as the standard customer key or that finance models require extra review. |
</SimpleTable>

<Constant name="wizard" /> automatically loads skills from your project and local directories in both the platform and the CLI. In the platform, start a new chat after adding or changing skills so they are picked up.

Refer to the [Skills](/docs/dbt-ai/wizard-skills) page for more details.

## In the dbt platform

Use <Constant name="wizard" /> in the [<Constant name="dbt_platform" />](/docs/platform/wizard-platform) from the home app or <Constant name="studio_ide" />. An admin must [enable <Constant name="wizard" />](/docs/platform/enable-dbt-ai) for your account first. 

### Approval and review

By default, <Constant name="wizard" /> keeps you in control before it changes your project or runs commands.

In the platform:

- <Constant name="wizard" /> shows file edits as diffs for you to accept or reject before anything is persisted
- dbt commands ask for confirmation before running
- In the home app and Studio IDE, toggle **Ask for approval** or **Edit files automatically** to choose how much freedom the agent has per session

There is no bash sandbox in the platform — shell access is not exposed the way it is in the CLI.

### Sessions and conversations

In the platform, a session is a saved conversation in the <Constant name="wizard" /> panel or home app:

- Ask follow-up questions without restating full context
- Continue an earlier investigation, refactor, or validation task
- Review prior prompts, responses, and proposed changes in the conversation list

Start a new session with **Start new dbt Wizard chat** in the panel. Chat history is retained for 90 days. Refreshing the same browser tab keeps your active session; opening a new tab starts empty.

For Studio-specific behavior and availability, refer to [<Constant name="wizard" /> in Studio IDE](/docs/dbt-ai/wizard-ide).

## In the terminal (CLI)

Use the [<Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-cli) for local development.

### Connections and authentication (MCP)

<Constant name="wizard" /> can connect to MCP servers from the CLI, including the [dbt MCP server](/docs/dbt-ai/about-mcp), for access to platform APIs, <Constant name="semantic_layer" /> metadata, and cross-project context.

To connect to an MCP server, run the following commands, replacing `MCP_NAME` with a name of your choice and `YOUR_MCP_URL` with the URL of the MCP server:

```bash
wizard mcp add MCP_NAME --url https://YOUR_MCP_URL
wizard mcp login MCP_NAME
```

You can see more options by running `wizard mcp --help`.

For example, to connect to the dbt MCP server, replace `DBT_MCP_ENDPOINT` with your endpoint and run:

```bash
wizard mcp add dbt --url DBT_MCP_ENDPOINT
```

You should see output similar to `Added global MCP server 'dbt'.` Then authenticate:

```bash
wizard mcp login dbt
```

The dbt MCP server reads its connection settings &mdash; such as `DBT_HOST`, `DBT_TOKEN`, `DBT_PROJECT_DIR`, `DBT_PATH`, `DBT_PROD_ENV_ID`, and `DBT_ACCOUNT_ID` &mdash; from environment variables, typically a `.env` file in your dbt project root. 

If <Constant name="wizard" /> can't reach the server, confirm these values are set, then restart `wizard` so it picks up the changes. 

For the full list of variables and an example `.env` file, refer to [Set up local MCP](/docs/dbt-ai/setup-local-mcp) and the [Environment variables reference](/docs/dbt-ai/mcp-environment-variables).

### Deferral and state

When you work on part of a project, <Constant name="wizard" /> uses [deferral](/reference/node-selection/defer) so it can reuse models that are already built elsewhere (for example, in production) instead of rebuilding everything. This saves time and warehouse cost. 

How deferral is handled depends on the mode set up in `wizard_config.toml` for your project:

<SimpleTable>
| `deferral.mode` value | Behavior |
|---|---|
| `"wizard"` | <Constant name="wizard" /> handles deferral for you. You tell <Constant name="wizard" /> which target from your `profiles.yml` to defer to (it tries to detect one automatically when you first set up the project). <Constant name="wizard" /> then compiles that target and reuses its models for any upstream models you haven't built yourself. |
| `"fusion_cloud"` | The <Constant name="dbt_platform" /> handles deferral against your connected environment, so <Constant name="wizard" /> doesn't manage local state. |
| `"dbt-state"` | dbt state handles deferral, so <Constant name="wizard" /> skips its own production compile. |
| `"manual"` | You maintain the deferral manifest path manually. |
| `"disabled"` | Deferral is disabled for the project. |
</SimpleTable>

For more about dbt State, refer to [About dbt State](/docs/deploy/dbt-state-about).

When <Constant name="wizard" /> manages deferral, it always keeps [favor-state](https://docs.getdbt.com/reference/node-selection/defer?version=2.0#favor-state) _off_. `favor-state` is a built-in dbt deferral option, not something you configure in <Constant name="wizard" />.

With favor-state off, <Constant name="wizard" /> uses your own dev version of a model when you’ve already built one. If you haven’t built that model yet, it uses the version from the deferred target instead.

If favor-state were _on_, dbt would do the opposite: it would always use the deferred environment’s version, even when you’ve already built the model locally.

<Constant name="wizard" /> stores the deferral mode for each project in `wizard_config.toml` under `deferral.mode`. To set or change it, refer to the [config reference](/docs/dbt-ai/wizard-config#deferral).


### Approval and sandboxing

By default, the CLI keeps you in control before it changes your project or runs commands.

In the terminal:

- <Constant name="wizard" /> shows file edits as diffs before it writes them
- dbt commands, such as `dbt build` or `dbt test`, ask for confirmation before running
- Bash commands run in a read-only sandbox, so they can inspect files but can't modify your workspace through the shell

You can relax these controls for trusted workflows:

```bash
# Never prompt for approval during this session.
# Useful for trusted tasks where you want Wizard to iterate without stopping.
wizard --ask-for-approval never

# Allow shell commands to write inside your workspace directory.
# Useful for commands that generate files, but less restrictive than the default read-only sandbox.
wizard --sandbox workspace-write
```

Use relaxed settings when you want <Constant name="wizard" /> to move faster on a scoped task you trust, such as a large refactor, generating documentation, or applying repetitive test updates. The tradeoff is that <Constant name="wizard" /> has more freedom to act before you review each step, so use these settings in a clean working tree or feature branch.

Approval settings apply to the current session. They are not scoped per action type in the command line flags shown above; for example, `--ask-for-approval never` relaxes prompts broadly for that session. To set defaults that persist across sessions or apply only to a specific project, use the [configuration file](/docs/dbt-ai/wizard-config).

You can view more options by running:

```bash
wizard --help
```

### Sessions

In the CLI, a session is a saved conversation and task history from a previous run on your machine. Sessions help you return to earlier work, continue a multi-step task, or review what the agent did in a past interaction.

Within a session, you can:

- Ask follow-up questions without restating the full context
- Continue work on an earlier investigation, refactor, or validation task
- Review prior prompts, responses, tool calls, and proposed changes

Resume a previous session with:

```bash
wizard resume        # choose from a list of saved sessions
wizard resume --last # resume the most recent session
```

Each CLI session is saved locally. This is separate from platform conversations, which are stored in your <Constant name="dbt_platform" /> account.

## Related docs

- [<Constant name="wizard" /> overview](/docs/platform/wizard-overview)
- [<Constant name="wizard" /> in the dbt platform](/docs/platform/wizard-platform)
- [<Constant name="wizard" /> quickstart](/docs/dbt-ai/wizard-quickstart)
- [Use cases and examples](/docs/dbt-ai/wizard-use-cases)
- [Skills](/docs/dbt-ai/wizard-skills)
- [<Constant name="wizard" /> command reference](/docs/dbt-ai/wizard-cli-reference)

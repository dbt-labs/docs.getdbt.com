---
title: "dbt Wizard CLI capabilities"
id: "wizard-cli-capabilities"
description: "Compare interactive and headless dbt Wizard CLI capabilities for local development, review, and automation."
sidebar_label: "CLI capabilities"
tags: [AI, Wizard]
---

# <Constant name="wizard" /> CLI capabilities

<IntroText>
Choose interactive or headless <Constant name="wizard" /> CLI based on whether the task needs a conversation and approvals or a preconfigured automation run.
</IntroText>

## Compare CLI modes

<SimpleTable>

| Capability | Interactive CLI | Headless CLI |
|---|---|---|
| Ask project-aware questions | Yes | Yes, with `wizard exec` |
| Use native dbt metadata and lineage | Yes | Yes |
| Propose file changes | Yes | Yes, with a write-enabled sandbox |
| Review proposed file diffs | In the terminal user interface (TUI) | In command output or generated files |
| Run dbt commands | Yes, with approvals and sandboxing | Yes, with preconfigured permissions |
| Run shell commands | Yes, in the configured sandbox | Yes, in the configured sandbox |
| Use built-in dbt Agent Skills | Yes | Yes |
| Add project and user-level skills | Yes | Yes |
| Add custom MCP servers | Yes | Yes |
| Install plugins and hooks | Yes | Yes |
| Run a dedicated git diff review | Yes, with `/review` | Yes, with `wizard review` |
| Run in CI or scripts | No | Yes |
| Generate machine-readable output | No | Yes, with `wizard exec --json` |
| Resume a conversational session | Yes, with `/resume` | Yes, with `wizard exec resume` |

</SimpleTable>

Some capabilities require additional context. For example, job failure investigation can retrieve run details when the dbt MCP server has Admin API access; otherwise, provide logs and `run_results.json`. Headless file edits require an explicit write-enabled sandbox.

## Choose the interactive CLI

Use the interactive CLI when you want a local, conversational workflow with access to your filesystem, shell, dbt commands, skills, subagents, and custom MCP servers. It is a good fit for investigation and implementation that needs repeated approvals and follow-up prompts.

Start with:

```bash
wizard
```

Refer to [Use <Constant name="wizard" /> locally](/docs/dbt-ai/wizard-quickstart) for setup and first-run onboarding.

## Choose the headless CLI

Use the headless CLI for one-shot analysis, resumable automation, code review, and CI. Configure every permission and dependency before the command starts because there is no interactive approval prompt.

```bash
wizard exec "summarize untested models in models/marts"
wizard review --base origin/main
wizard exec resume --last "continue the previous analysis"
```

Use deterministic commands for required CI gates, and treat AI review as additional evidence. Refer to [Automating dbt reviews in CI](/docs/dbt-ai/wizard-ci-review) for a complete workflow.

## Understand CLI boundaries

- The CLI doesn't provide a full code editor and file explorer. Use your preferred local editor alongside it.
- The CLI doesn't provide the structural DAG preview available in the <Constant name="wizard" /> home tab.
- `wizard exec` doesn't pause for interactive approvals. Preconfigure its sandbox, credentials, and other permissions.
- `wizard review` produces review evidence, not an implicit pass or fail gate.
- Filesystem, shell, dbt, and warehouse access remain limited by your local configuration and credentials.

For browser-based editing and agent-native previews, refer to [<Constant name="wizard" /> in <Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide) and the [<Constant name="wizard" /> home tab](/docs/platform/wizard-home).

## Related docs

- [Headless mode](/docs/dbt-ai/wizard-headless)
- [<Constant name="wizard" /> command reference](/docs/dbt-ai/wizard-cli-reference)
- [Use skills with <Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-skills)
- [Use MCP servers with <Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-mcp)
- [Extend <Constant name="wizard" /> with plugins and hooks](/docs/dbt-ai/wizard-plugins-hooks)

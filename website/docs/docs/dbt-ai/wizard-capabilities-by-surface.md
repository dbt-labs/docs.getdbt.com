---
title: "dbt Wizard capabilities by surface"
id: "wizard-capabilities-by-surface"
description: "Compare dbt Wizard capabilities in the interactive CLI, headless CLI, Studio IDE, and home tab."
sidebar_label: "Capabilities by surface"
tags: [AI, Wizard]
---

# <Constant name="wizard" /> capabilities by surface

<IntroText>
Choose the <Constant name="wizard" /> surface that fits the task. All surfaces understand dbt project context, but they differ in how you edit, automate, connect external tools, and review results.
</IntroText>

## Compare the surfaces

<SimpleTable>

| Capability | Interactive CLI | Headless CLI | <Constant name="studio_ide" /> | Home tab |
|---|---|---|---|---|
| Ask project-aware questions | Yes | Yes, with `wizard exec` | Yes | Yes |
| Use native dbt metadata and lineage | Yes | Yes | Yes | Yes |
| Propose file changes | Yes | Yes, with a write-enabled sandbox | Yes | Yes |
| Review proposed file diffs | In the TUI | In command output or generated files | In the <Constant name="wizard" /> panel | In inline preview |
| Edit files directly in a code editor | No | No | Yes | No |
| Run dbt commands | Yes, with approvals and sandboxing | Yes, with preconfigured permissions | Yes, with platform approvals | Yes, with platform approvals |
| Run shell commands | Yes, in the configured sandbox | Yes, in the configured sandbox | No | No |
| Use built-in dbt Agent Skills | Yes | Yes | Yes | Yes |
| Add project skills | Yes | Yes | Yes | Yes |
| Add user-level skills | Yes | Yes | No | No |
| Add custom MCP servers | Yes | Yes | No; built-in dbt tools are available | No; built-in dbt tools are available |
| Install plugins and hooks | Yes | Yes | No | No |
| Run a dedicated git diff review | No; ask in a prompt | Yes, with `wizard review` | No; ask in a prompt | No; ask in a prompt |
| Run in CI or scripts | No | Yes | No | No |
| Use a full file explorer and editor | No | No | Yes | No |
| Preview structural SQL changes as a DAG | No | No | No | Yes |
| Resume a conversational session | Yes | No; each command is one-shot | Yes | Yes |

</SimpleTable>

Some capabilities require additional context. For example, job failure investigation in the CLI can retrieve run details when the dbt MCP server has Admin API access; otherwise, provide logs and `run_results.json`. Headless file edits require an explicit write-enabled sandbox.

## Choose the interactive CLI

Use the interactive CLI when you want a local, conversational workflow with access to your filesystem, shell, dbt commands, skills, subagents, and custom MCP servers. It is a good fit for investigation and implementation that needs repeated approvals and follow-up prompts.

Start with:

```bash
wizard
```

Refer to [Use <Constant name="wizard" /> locally](/docs/dbt-ai/wizard-quickstart) for setup and first-run onboarding.

## Choose the headless CLI

Use the headless CLI for one-shot analysis, code review, and automation. Configure every permission and dependency before the command starts because there is no interactive approval prompt.

```bash
wizard exec "summarize untested models in models/marts"
wizard review --base origin/main
```

Use deterministic commands for required CI gates, and treat AI review as additional evidence. Refer to [Automating dbt reviews in CI](/docs/dbt-ai/wizard-ci-review) for a complete workflow.

## Choose Studio IDE

Use <Constant name="studio_ide" /> when you want <Constant name="wizard" /> beside a full browser-based editor, file explorer, and development console. You can move between direct code editing and agent-proposed diffs in the same workspace.

Refer to [<Constant name="wizard" /> in <Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide) for prerequisites and availability.

## Choose the home tab

Use the home tab for an agent-native workflow centered on natural-language iteration and review. Its inline preview can show SQL diffs, structural DAG visualizations, and validation feedback without opening the full editor.

Refer to the [<Constant name="wizard" /> home tab](/docs/platform/wizard-home) for its workflow and preview features.

## Capabilities that aren't interchangeable

- Platform surfaces don't expose a general shell or user-configured MCP servers.
- CLI surfaces don't provide the home tab's structural DAG preview or the <Constant name="studio_ide" /> editor.
- Plugins, hooks, and user-level skills are local CLI extensions.
- `wizard exec` and `wizard review` are automation interfaces, not interactive sessions.
- Approval controls differ between the CLI sandbox and the platform's approval or automatic edit modes.

## Related docs

- [<Constant name="wizard" /> overview](/docs/platform/wizard-overview)
- [How <Constant name="wizard" /> works](/docs/dbt-ai/wizard-how-it-works)
- [Headless mode](/docs/dbt-ai/wizard-headless)
- [Use skills with <Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-skills)
- [Use MCP servers with <Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-mcp)

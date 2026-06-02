---
title: "dbt Wizard CLI configuration"
id: "wizard-config"
description: "Full reference for both dbt Wizard configuration files — the agent runtime config and the per-project dbt Wizard settings."
sidebar_label: "CLI config"
tags: [AI, Wizard]
---

import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';

# <Constant name="wizard" /> config reference <Lifecycle status="beta"/>

<IntroText>

<Constant name="wizard"/> stores configuration in two TOML files under `~/.dbt/wizard/`, each controlling a different part of the product.

</IntroText>

## The two config files

<WizardFeedbackCallout />

TOML (Tom's Obvious, Minimal Language) is a config file format. If you've written YAML or JSON before, it'll feel familiar &mdash; keys and values are separated by ` = ` (with spaces before and after the equals sign), and nested sections use `[section.name]` headers instead of indentation or curly braces. For example:

<File name='~/.dbt/wizard/config.toml'>

```toml
model = "claude-sonnet-4-6"

[projects."/Users/you/jaffle-shop"]
trust_level = "trusted"
```
</File>

This config sets the default AI model for all new sessions and applies to all future invocations across all projects. You can override the default AI model for a specific project by setting the `model` key in the `wizard_config.toml` file for that project or using the `/model` picker in the text-based user interface (TUI).

<SimpleTable>

| File | Controls | When to use |
|------|----------|-------------|
| `~/.dbt/wizard/config.toml` | Agent runtime — AI model, MCP servers, approval rules, trusted projects | Change agent-level behavior across all sessions |
| `~/.dbt/wizard/wizard_config.toml` | Per-project settings — dbt executable path, deferral, saved model preference | Change how <Constant name="wizard"/> works with a specific dbt project |

</SimpleTable>

Note that `dbt_project.yml` is separate from both and controls how dbt builds your project.

## Common tasks

<SimpleTable>

| Goal | Edit | Restart needed? |
|------|------|----------------|
| Change the default AI model | `config.toml` → `model = "claude-sonnet-4-6"` | Yes |
| Point <Constant name="wizard"/> at a specific dbt binary | `wizard_config.toml` → `path` | Yes |
| Add the dbt MCP server | `config.toml` → `[mcp_servers.dbt]` | Yes |
| Mark a repo as trusted | `config.toml` → `trust_level = "trusted"` under `[projects."..."]` | Yes |
| Change approval or sandbox defaults | `config.toml` | Yes |

</SimpleTable>

## Config precedence
 
Settings resolve in this order (highest to lowest):
 
1. CLI flags (`-m`, `-c`) at invocation
2. In-session model picker (`/model`)
3. `~/.dbt/wizard/config.toml`
4. `~/.dbt/wizard/wizard_config.toml`
5. Built-in defaults

## config.toml

Global agent settings for models, approvals, sandboxing, web search, and MCP servers.

`~/.dbt/wizard/config.toml` controls how the agent session behaves. It's created automatically when <Constant name="wizard"/> is installed.

### Configuration keys
This is the list of configuration keys that can be set in `config.toml`.
- `model`
- `approval_policy`
- `sandbox_mode`
- `web_search`

You can view more by running `wizard config --help`.

#### AI model and API

<SimpleTable>

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `model` | string | — | Default AI model for new sessions. Refer to [AI model ID format](#ai-model-id-format) below. Change interactively with `/model` in the TUI. |

</SimpleTable>

#### Behavior

<SimpleTable>

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `approval_policy` | string | `on-request` | When Wizard asks before executing commands. Options: `untrusted` (ask for non-trusted commands), `on-request` (<Constant name="wizard"/> decides), `never` (run without asking). |
| `sandbox_mode` | string | `read-only` | Shell sandbox policy. Options: `read-only` (default), `workspace-write` (allow writes inside project dir), `danger-full-access` (no restrictions). |
| `web_search` | string | `cached` | Web search mode. Options: `disabled`, `cached`, or `live`. |

</SimpleTable>

#### Project trust

Set `trust_level` per-project to allow <Constant name="wizard"/> to use project-local config:

```toml
[projects."/absolute/path/to/your-repo"]
trust_level = "trusted"
```

#### MCP servers

```toml
[mcp_servers.dbt]
command = "DBT_MCP_ENDPOINT"
```

### AI model ID format

AI model IDs in `config.toml` use the public model ID, such as `claude-sonnet-4-6`.

To list all available AI model IDs:

```bash
wizard debug models
```

### Environment variables

Any key can be set as an environment variable using the `DBT_WIZARD_` prefix in `SCREAMING_SNAKE_CASE`:

```bash
export DBT_WIZARD_MODEL=claude-sonnet-4-6
export DBT_WIZARD_APPROVAL_POLICY=never
export OPENAI_API_KEY=sk-...        # OpenAI (no prefix needed)
export ANTHROPIC_API_KEY=sk-ant-... # Anthropic (no prefix needed)
```

`OPENAI_API_KEY` and `ANTHROPIC_API_KEY` are read directly without the `DBT_WIZARD_` prefix, following each provider's convention.

### When it's read

`config.toml` is read at session start when you run `wizard`. Changes take effect only after you exit and restart the CLI. Per-invocation `-c` flags and the in-session `/model` picker override this file for that session only.

### Example

```toml
model = "claude-sonnet-4-6"

[projects."/Users/you/jaffle-shop"]
trust_level = "trusted"

[mcp_servers.dbt]
command = "DBT_MCP_ENDPOINT"
```

## wizard_config.toml

Per-project settings Wizard writes during onboarding, including dbt path and deferral settings.

`~/.dbt/wizard/wizard_config.toml` stores what <Constant name="wizard"/> knows about each of your dbt projects. <Constant name="wizard"/> writes to this file automatically during onboarding and when you change project settings. You can also edit it manually.

### Configuration keys

<SimpleTable>

| Key | Description |
|-----|-------------|
| `version` | Schema version for this file (currently `1`). Don't change this manually. |
| `global.terms_of_use_accepted_at` | Timestamp of when you accepted the <Constant name="wizard"/> Terms of Use. Written once under the `[global]` section and applies across all projects. |
| `onboarded_at` | Timestamp of when you onboarded this project in <Constant name="wizard"/>. |
| `path` | Path to the dbt binary <Constant name="wizard"/> should use for this project. |
| `deferral.mode` | Who handles [deferral](/reference/node-selection/defer) for this project. `"wizard"` means <Constant name="wizard"/> handles it &mdash; you tell it which `profiles.yml` target to defer to, and it reuses that target's models instead of rebuilding everything. `"fusion_cloud"` means the <Constant name="dbt_platform" /> handles deferral against your connected environment. Refer to [Deferral](#deferral) below. |
| `deferral.target` | The [target](/docs/local/profiles.yml) from your `profiles.yml` that <Constant name="wizard"/> compiles and defers to when `deferral.mode` is `"wizard"` (for example, `"dev"`). |

</SimpleTable>

Settings are stored per-project under `[projects."/absolute/path/to/repo"]` blocks:

<File name='~/.dbt/wizard/wizard_config.toml'>
```toml
version = 1

[global]
terms_of_use_accepted_at = "2026-05-28T15:06:54Z"

[projects."/Users/you/jaffle-shop"]
onboarded_at = "2026-05-20T11:09:01.410346"
path = "/Users/you/jaffle-shop/.venv/bin/dbt"

[projects."/Users/you/jaffle-shop".deferral]
mode = "wizard"
target = "dev"
```
</File>

#### Deferral

[Deferral](/reference/node-selection/defer) lets <Constant name="wizard"/> reuse models that are already built elsewhere (for example, in production) instead of rebuilding everything when you're only working on part of a project, saving you time and warehouse cost.

The `deferral.mode` setting in `wizard_config.toml` controls who handles deferral. It accepts five values, and <Constant name="wizard"/> usually sets it for you during onboarding:

<SimpleTable>
| `deferral.mode` value | What it means |
|---|---|
| `"wizard"` | <Constant name="wizard"/> handles deferral for you. You tell <Constant name="wizard"/> which [target](/docs/local/profiles.yml) from your `profiles.yml` to defer to (it tries to detect one automatically when you first set up the project). <Constant name="wizard"/> then compiles that target and reuses its models for any upstream models you haven't built yourself. |
| `"fusion_cloud"` | The <Constant name="dbt_platform" /> handles deferral against your connected environment, so <Constant name="wizard"/> doesn't manage any local state. Set automatically when you're connected to the platform. |
| `"dbt-state"` | dbt state handles deferral, so <Constant name="wizard"/> skips its own production compile. |
| `"manual"` | You maintain the deferral manifest path manually. |
| `"disabled"` | Deferral is disabled for the project. |
</SimpleTable>

For more about dbt State, refer to [About dbt State](/docs/deploy/dbt-state-about).

**About [favor-state](/reference/node-selection/defer?version=2.0#favor-state):** favor-state is a built-in dbt deferral option, not something you need to configure here &mdash; <Constant name="wizard"/> handles it for you during deferral compiles. You don't need to add `favor_state` to `wizard_config.toml`. What matters instead is that <Constant name="wizard"/> uses a valid deferral mode and state path.

In practice, when <Constant name="wizard"/> handles deferral it uses your own dev version of a model when you've already built one, and only falls back to the version from the deferred target for models you haven't built yet.

For how this behaves during a session, refer to [Deferral and state](/docs/dbt-ai/wizard-how-it-works#deferral-and-state).

## Troubleshooting

Here are some common config mistakes and how to fix them:

<SimpleTable>

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Still on old AI model after editing `wizard_config.toml` | `wizard_config.toml` doesn't store the model | Set `model` in `config.toml` and restart `wizard` |
| AI model unchanged after editing `config.toml` | Old session still running | Press Ctrl+C, then run `wizard` again |
| "Invalid model" error | Wrong AI model ID | Run `wizard debug models` to see valid AI model IDs |

</SimpleTable>

### Re-trigger onboarding flows

If you need to re-run part of the setup — for example, after deleting config entries by mistake or switching to a new project — you can reset individual flows by deleting the relevant file. <Constant name="wizard" /> will re-prompt you the next time it runs.

To delete a file, run the command in your terminal (macOS/Linux). For example:

```bash
rm ~/.dbt/wizard/auth.json
```

If you get a `No such file or directory` error, the file doesn't exist — which means that part of the setup hasn't run yet, or has already been reset. You can ignore the error.

<SimpleTable>

| What you want to redo | File to delete |
|---|---|
| Re-run the trusted folder prompt | Remove your project's entry from `~/.dbt/wizard/config.toml` under `[projects."..."]` |
| Re-authenticate with <Constant name="dbt_platform" /> | `~/.dbt/wizard/auth.json` |
| Re-run dbt project setup | Remove your project's entry from `~/.dbt/wizard/wizard_config.toml` under `[projects."..."]`, or delete the file entirely to reset all projects |
| Re-trigger BYOK key configuration | `~/.dbt/wizard/provider*` (this matches all provider files) |

</SimpleTable>

:::caution
`config.toml` and `wizard_config.toml` are separate files that control different things. If you want to re-run project setup, edit `wizard_config.toml` — not `config.toml`. Editing the wrong file won't re-run the onboarding flow you expect. Refer to [The two config files](#the-two-config-files) at the top of this page for the difference.
:::

## Related docs

Links to BYOK setup, approval behavior, and CLI command reference.

- [Configure BYOK](/docs/dbt-ai/wizard-byok)
- [Approval and sandboxing](/docs/dbt-ai/wizard-how-it-works#approval-and-sandboxing)
- [<Constant name="wizard" /> command reference](/docs/dbt-ai/wizard-cli-reference)
- [How <Constant name="wizard" /> works](/docs/dbt-ai/wizard-how-it-works)

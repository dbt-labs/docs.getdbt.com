---
title: "Configure dbt Wizard"
id: "wizard-configure"
description: "Learn how to configure dbt Wizard CLI for local development."
sidebar_label: "Configure Wizard CLI"
tags: [AI, Wizard]
---

# Configure <Constant name="wizard" /> <Lifecycle status="beta"/>

<!-- duplicate of wizard-config.md, will remoev -->

<IntroText>
<Constant name="wizard" /> stores local configuration in TOML files under your home directory. Use these files to set defaults for models, approval behavior, sandboxing, trusted projects, and dbt project settings.
</IntroText>

Most users only need to edit configuration when they want to:

- Set a default AI model
- Use BYOK credentials
- Change approval or sandbox behavior
- Mark a project as trusted
- Point <Constant name="wizard" /> to a specific dbt executable
- Reset part of the setup flow

For the complete list of settings, refer to the [Wizard CLI command reference](/docs/dbt-ai/wizard-cli-reference).

## Config files

<Constant name="wizard" /> uses separate files for agent runtime settings and dbt project settings.

<SimpleTable>
| File | Purpose | Edit when you want to... |
|---|---|---|
| `~/.dbt/wizard/config.toml` | Agent runtime settings | Set the default model, provider keys, MCP servers, approval behavior, sandboxing, or trusted projects |
| `~/.dbt/wizard/wizard_config.toml` | dbt project settings | Change project-specific settings such as the dbt executable path, deferral behavior, or saved model preference |
| `~/.dbt/wizard/config.toml` | CLI override settings | Define approval and sandbox profiles used by CLI flags or CI workflows |
</SimpleTable>

`dbt_project.yml` is separate from these files. It configures how dbt builds your project. <Constant name="wizard" /> configuration controls how the agent runs and how it works with that project.

## TOML basics

<Constant name="wizard" /> configuration files use TOML. TOML uses `key = "value"` pairs and `[section]` headers.

```toml
model = "claude-sonnet-4-6"

[projects."/Users/you/jaffle-shop"]
trust_level = "trusted"
```

This example sets a default AI model and marks one project as trusted.

## Common settings

### Set a default model

Set the default model for new sessions in `~/.dbt/wizard/config.toml`:

```toml
model = "claude-sonnet-4-6"
```

Model IDs use the public <Constant name="wizard" /> catalog ID without an internal prefix.

To list available model slugs, run:

```bash
wizard debug models
```

You can also change the model during a session with `/model`.

### Configure provider keys

For BYOK, set provider credentials with environment variables or `wizard providers`. For OpenAI and Anthropic API keys, use:

```bash
export OPENAI_API_KEY=sk-...
export ANTHROPIC_API_KEY=sk-ant-...
```

For OpenAI subscription, AWS Bedrock, Azure, and Snowflake Cortex, use `wizard providers` or the `/providers` slash command instead of config file keys. Refer to [Configure BYOK](/docs/dbt-ai/wizard-byok).

### Change approval behavior

Control when <Constant name="wizard" /> asks before running commands:

```toml
approval_policy = "untrusted"
```

<SimpleTable>
| Value | Behavior |
|---|---|
| `untrusted` | Ask before running commands that are not trusted |
| `on-request` | Let <Constant name="wizard" /> decide when to ask |
| `never` | Run without approval prompts |
</SimpleTable>

### Change sandbox mode

Control how much filesystem access <Constant name="wizard" /> has:

```toml
sandbox_mode = "read-only"
```

<SimpleTable>
| Value | Behavior |
|---|---|
| `read-only` | Read files without writing changes |
| `workspace-write` | Allow writes inside the project directory |
| `danger-full-access` | Allow unrestricted access |
</SimpleTable>

Refer to [Approval and sandboxing](/docs/dbt-ai/wizard-how-it-works#approval-and-sandboxing) for more detail.

### Enable web search

Enable web search:

```toml
web_search = "live"
```

This can help <Constant name="wizard" /> look up docs and error messages.

### Mark a project as trusted

Mark a project as trusted to allow <Constant name="wizard" /> to use project-local configuration:

```toml
[projects."/absolute/path/to/your-repo"]
trust_level = "trusted"
```

Use the absolute path to the project root.

### Set the dbt executable path

Project settings live in `~/.dbt/wizard/wizard_config.toml`. To point <Constant name="wizard" /> to a specific dbt executable, set `path` under the project entry:

```toml
version = 1

[projects."/Users/you/jaffle-shop"]
path = "/Users/you/jaffle-shop/.venv/bin/dbt"
```

<Constant name="wizard" /> usually writes this file during onboarding, so you do not need to edit it unless the path changes.

## Configuration precedence

For a live <Constant name="wizard" /> session, settings are resolved in this order, from highest to lowest precedence:

1. CLI flags and per-invocation overrides
2. In-session model picker (`/model`)
3. `~/.dbt/wizard/config.toml`
4. Project settings in `~/.dbt/wizard/wizard_config.toml`
5. Built-in defaults

Changes to configuration files usually require restarting `wizard`.

## Example configuration

```toml
model = "claude-sonnet-4-6"
approval_policy = "untrusted"
sandbox_mode = "workspace-write"
web_search = "live"

[projects."/Users/you/jaffle-shop"]
trust_level = "trusted"

[mcp_servers.dbt]
command = "DBT_MCP_ENDPOINT"
```

## Troubleshooting

<SimpleTable>
| Symptom | Likely cause | Fix |
|---|---|---|
| Model did not change | The session was already running | Restart `wizard` |
| "Invalid model" error | Invalid model ID | Run `wizard debug models` and use one of the listed IDs |
| Project settings are not applied | Edited the wrong config file | Use `wizard_config.toml` for dbt project settings |
| Approval or sandbox settings are not applied | CLI override or profile is taking precedence | Check CLI flags and `~/.dbt/wizard/config.toml` |
</SimpleTable>

## Reset setup

If you need to re-run setup, delete the relevant file or remove the project entry from the relevant config file. <Constant name="wizard" /> will prompt you again the next time it runs.

<SimpleTable>
| To redo... | Remove... |
|---|---|
| Trusted folder prompt | The project entry in `~/.dbt/wizard/config.toml` |
| Platform authentication | `~/.dbt/wizard/auth.json` |
| dbt project setup | The project entry in `~/.dbt/wizard/wizard_config.toml` |
| BYOK configuration | `~/.dbt/wizard/provider*` |
</SimpleTable>

:::caution
`config.toml` and `wizard_config.toml` control different things. Use `config.toml` for agent runtime settings. Use `wizard_config.toml` for dbt project settings.
:::

## Related docs

- [Configure BYOK](/docs/dbt-ai/wizard-byok)
- [Approval and sandboxing](/docs/dbt-ai/wizard-how-it-works#approval-and-sandboxing)
- [<Constant name="wizard" /> command reference](/docs/dbt-ai/wizard-cli-reference)

---
title: "Wizard CLI command reference"
id: "wizard-cli-reference"
description: "Full reference for all wizard subcommands and global flags."
sidebar_label: "Command reference"
tags: [AI, Wizard, Reference]
image: /img/docs/wizard-cli-intro.png
---

import CliGenerated from './_wizard-cli-full-generated.md';


# <Constant name="wizard" /> command reference <Lifecycle status="beta"/>

<IntroText>
Full reference for all <code>wizard</code> subcommands and global flags.
</IntroText>


:::info Not the same as dbt commands

This page is auto-generated and covers `wizard` commands and flags. For standard dbt project commands (`dbt run`, `dbt build`, `dbt test`, and so on.) refer to the [dbt command reference](/reference/dbt-commands).

If you see any issues, please [file an issue](https://github.com/dbt-labs/docs.getdbt.com/issues) and we'll be happy to sort it out.
:::

## Common commands

Most people only need a handful of commands. Start here, then use the full reference below for everything else.

<SimpleTable>
| I want to... | Command |
| --- | --- |
| Start an interactive session | `wizard` |
| Run a one-off task without the TUI | `wizard exec "add tests to my staging models"` |
| Review my uncommitted changes | `wizard review --uncommitted` |
| Pick up where I left off | `wizard resume --last` |
| Check that my install is healthy | `wizard doctor` |
| Update to the latest version | `wizard update` |
</SimpleTable>

## Examples

A few common commands in context. Swap in your own prompts and flags.

### Run a task without the TUI

Use `wizard exec` for one-off tasks, scripts, and CI. It runs the agent, prints the result, and exits.

```shell
# Run a task and exit
wizard exec "explain what the orders model does"

# Pipe a prompt in from stdin
echo "summarize my schema.yml files" | wizard exec -

# Emit machine-readable output for scripting
wizard exec --json "list my models" > result.jsonl
```

### Review your changes

`wizard review` runs a code review without starting an interactive session.

```shell
# Review staged, unstaged, and untracked changes
wizard review --uncommitted

# Review your branch against main
wizard review --base main
```

### Resume a session

```shell
# Continue your most recent session
wizard resume --last

# Pick from a list of past sessions
wizard resume
```

### Override a config value

Use `-c` to override any value from `~/.dbt/wizard/config.toml` for a single run, without editing the file.

```shell
# Set the model for this run only
wizard exec -c model="dbt/gpt-5.5" "your prompt"
```

<CliGenerated />

## Related docs

- [Slash command reference](/docs/dbt-ai/wizard-slash-commands) for interactive TUI slash commands
- [Headless mode](/docs/dbt-ai/wizard-headless)
- [Configuration reference](/docs/dbt-ai/wizard-config)
- [dbt command reference](/reference/dbt-commands) for `dbt run`, `dbt build`, and other dbt Core commands

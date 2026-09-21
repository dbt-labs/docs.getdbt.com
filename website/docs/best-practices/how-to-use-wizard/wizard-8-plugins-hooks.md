---
title: "Extending dbt Wizard with plugins and hooks"
id: "wizard-8-plugins-hooks"
description: "Install dbt Wizard CLI plugins from marketplaces and review lifecycle hooks before allowing them to run."
sidebar_label: "Extend with plugins and hooks"
tags: [AI, Wizard]
---


<IntroText>
Use plugins to install a coordinated set of <Constant name="wizard" /> CLI extensions from a marketplace. A plugin can bundle skills, Model Context Protocol (MCP) servers, apps, and lifecycle hooks so a team can distribute a complete workflow together.
</IntroText>

Plugins and hooks are available in interactive <Constant name="wizard" /> CLI sessions. You can't install them in <Constant name="studio_ide" /> or the <Constant name="wizard" /> home tab.

## Understand plugins, marketplaces, and hooks

- A **marketplace** is a local or Git source that publishes one or more plugins.
- A **plugin** is a named bundle with a `.dbt-wizard-plugin/plugin.json` manifest.
- A **hook** runs a command at a <Constant name="wizard" /> lifecycle event, such as session start, prompt submission, before or after a tool call, a permission request, or session stop.

Hooks can inspect context, add guidance, or block an action depending on the event. Because a hook can execute a command on your machine, review its source and trust request with the same care you would use for any development tool.

## Add a marketplace

Add a marketplace from a GitHub repository:

```bash
wizard plugin marketplace add OWNER/REPOSITORY --ref main
```

You can also add a local marketplace while developing or evaluating it:

```bash
wizard plugin marketplace add ./path/to/marketplace
```

For a repository that contains a marketplace in a subdirectory, use a sparse checkout path:

```bash
wizard plugin marketplace add \
  https://github.com/OWNER/REPOSITORY \
  --sparse path/to/plugins
```

List the configured sources and their local snapshot locations:

```bash
wizard plugin marketplace list
```

Before installing a plugin, inspect the marketplace snapshot and the plugin's `.dbt-wizard-plugin/plugin.json`. Review any referenced skills, MCP server configuration, apps, hook files, and executable scripts.

Use ` wizard plugin --help` to view the rest of the plugin commands in the <Constant name="wizard"/> CLI.
## Install and inspect a plugin

List the available plugins and their installation state:

```bash
wizard plugin list
```

Install a plugin by its `PLUGIN@MARKETPLACE` identifier:

```bash
wizard plugin add PLUGIN_NAME@MARKETPLACE_NAME
```

The equivalent long form is:

```bash
wizard plugin add PLUGIN_NAME --marketplace MARKETPLACE_NAME
```

Start a new interactive session after installation. Use `/plugins` to browse loaded plugins. If the plugin declares hooks, use `/hooks` to inspect the handlers and their trust status before allowing them to run.

:::caution Review hooks before trusting them
Don't use `--dangerously-bypass-hook-trust` as a routine setup step. It allows enabled hooks to run without persisted review for that invocation. Review each hook and persist its trust decision instead.
:::

## Verify the extension

Test one capability at a time after installation:

1. Confirm the plugin is installed and enabled with `wizard plugin list`.
2. Start a new session so <Constant name="wizard" /> reloads plugins and skills.
3. Inspect `/plugins` and `/hooks` for load warnings or untrusted hook handlers.
4. Ask <Constant name="wizard" /> to list the skill or MCP capability you expect the plugin to provide.
5. Run a read-only prompt that exercises the capability before granting write access or broader tool approvals.

If a plugin bundles an MCP server, its tools still follow the [MCP approval settings](/docs/dbt-ai/wizard-mcp#approvals-and-tool-permissions). A plugin doesn't bypass the CLI sandbox or tool approval policy.

## Update or remove an extension

Refresh one configured Git marketplace:

```bash
wizard plugin marketplace upgrade MARKETPLACE_NAME
```

Omit the name to refresh all configured Git marketplaces:

```bash
wizard plugin marketplace upgrade
```

Review the updated source before starting a session that allows its hooks to run.

Remove a plugin when you no longer need it:

```bash
wizard plugin remove PLUGIN_NAME@MARKETPLACE_NAME
```

Remove the marketplace source separately:

```bash
wizard plugin marketplace remove MARKETPLACE_NAME
```

Removing a marketplace and removing an installed plugin are separate operations. List both after cleanup to confirm the intended state.

## Choose the smallest extension mechanism

Use a plugin when several capabilities need to be installed and versioned together. For a single concern, a smaller extension is easier to review:

<SimpleTable>

| Need | Use |
|---|---|
| Reusable team instructions | A project [skill](/docs/dbt-ai/wizard-skills) in `.agents/skills/`. |
| Tools from another service | A configured [MCP server](/docs/dbt-ai/wizard-mcp). |
| A command that runs at a lifecycle event | A hook, distributed only from a source your team trusts. |
| Skills, tools, apps, and hooks that must ship together | A plugin from a reviewed marketplace. |

</SimpleTable>

## Related docs

- [Use skills with <Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-skills)
- [Use MCP servers with <Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-mcp)
- [Approval and sandboxing](/docs/dbt-ai/wizard-how-it-works#approval-and-sandboxing)
- [<Constant name="wizard" /> command reference](/docs/dbt-ai/wizard-cli-reference)

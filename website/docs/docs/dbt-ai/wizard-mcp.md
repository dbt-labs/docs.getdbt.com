---
title: "Use MCP servers with dbt Wizard"
id: "wizard-mcp"
description: "Connect dbt Wizard to MCP servers to give it more tools and context — in the dbt platform or the CLI."
sidebar_label: "Use MCP servers"
tags: [AI, Wizard]
---

import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';

# Use MCP servers with <Constant name="wizard"/> <Lifecycle status="beta"/>

<IntroText>
The Model Context Protocol (MCP) connects <Constant name="wizard" /> to external tools and context. Add an MCP server and <Constant name="wizard"/> can call its tools mid-session — query the dbt MCP server for governed project metadata, open a pull request through the GitHub MCP server, or pull in any other MCP-compatible service.
</IntroText>

<WizardFeedbackCallout />

For background on MCP itself, refer to the [Model Context Protocol introduction](https://modelcontextprotocol.io/introduction). For the dbt-maintained server specifically, refer to the [dbt MCP server](/docs/dbt-ai/about-mcp).

## Where you can use MCP servers

Out of the box, <Constant name="wizard"/> understands your dbt project. An MCP server extends that reach to the other tools and systems your work depends on, so you can do more without leaving your session. Each server you add gives <Constant name="wizard"/> a new set of tools it can call on your behalf — for example:

- dbt MCP server for governed access to your models, metrics, and lineage.
- GitHub server to read and review pull requests.
- Data warehouse or other server to pull in context that lives outside dbt.

MCP works with <Constant name="wizard" /> both in the [<Constant name="dbt_platform" />](/docs/platform/wizard-platform) (<Constant name="studio_ide" /> and the home app) and in the [<Constant name="wizard" /> CLI](/docs/dbt-ai/about-dbt-wizard-cli). 

Once a server is connected, <Constant name="wizard"/> uses its tools the same way in either place.

The <Constant name="wizard"/> CLI enables you to add, remove, authenticate, and customize MCP servers (including managing them and setting per-tool approvals) through the `config.toml` file. The following sections below call out which steps are CLI-specific.

## Supported MCP server types

<Constant name="wizard" /> supports two transports and reads server-provided instructions:

<SimpleTable>

| Type | Description |
|------|-------------|
| STDIO server (standard input/output, a server that runs as a program on your own computer, instead of one you connect to over the internet) | Runs as a local process that <Constant name="wizard"/> starts with a command (for example, `npx` or `uvx`). Supports environment variables. |
| Streamable HTTP server | A server you reach at a URL. Supports bearer-token and OAuth authentication. |
| Server instructions | <Constant name="wizard"/> reads the `instructions` field a server returns during initialization and uses it as cross-tool guidance. |

</SimpleTable>

## Add an MCP server

The following instructions explain how to add an MCP server.

<Tabs>
<TabItem value="cli" label="CLI" default>

Use the `wizard mcp add` command, or edit `~/.dbt/wizard/config.toml` directly. Both write to the same `[mcp_servers.NAME]` configuration.

**Add a STDIO server:**

```bash
wizard mcp add SERVER_NAME --env VAR1=value1 -- COMMAND ARGS
```

For example, to add a filesystem MCP server that runs locally through `npx`:

```bash
wizard mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /path/to/project
```

To connect the [dbt MCP server](/docs/dbt-ai/about-mcp), use the streamable HTTP form below — refer to [dbt MCP server](#dbt-mcp-server) under Examples.

**Add a streamable HTTP server:**

```bash
wizard mcp add SERVER_NAME --url https://example.com/mcp --bearer-token-env-var MY_TOKEN
```

To see all MCP subcommands, run `wizard mcp --help`. For the full list of flags, refer to the [CLI command reference](/docs/dbt-ai/wizard-cli-reference).

**Or edit `config.toml` directly.** <Constant name="wizard"/> stores MCP configuration in `~/.dbt/wizard/config.toml` alongside its other settings:

<File name='~/.dbt/wizard/config.toml'>

```toml
# STDIO server (runs locally)
[mcp_servers.filesystem]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"]

# Streamable HTTP server
[mcp_servers.github]
url = "https://api.githubcopilot.com/mcp/"
bearer_token_env_var = "GITHUB_MCP_TOKEN"
http_headers = { "X-Region" = "us-east-1" }
```

</File>

Restart `wizard` after editing `config.toml` — MCP servers are loaded at session start. For how settings resolve, refer to [Config precedence](/docs/dbt-ai/wizard-config#config-precedence).

</TabItem>
<TabItem value="platform" label="dbt platform">

In the <Constant name="dbt_platform" />, the [dbt MCP server](/docs/dbt-ai/about-mcp) is available to <Constant name="wizard" /> through your connected environment. This means that you don't need a `config.toml` at all. 

<Constant name="wizard"/> uses governed project metadata (lineage, model health, tests, run results, and the <Constant name="semantic_layer" />) out of the box in both <Constant name="studio_ide" /> and the home app.

Adding and managing other MCP servers, setting nicknames, and configuring per-tool approvals is specific to the <Constant name="wizard" /> CLI. Switch to the **CLI** tab for those steps.

</TabItem>
</Tabs>

## Configuration keys

These keys can be set under an `[mcp_servers.NAME]` block in `config.toml`.

<SimpleTable>

| Key | Applies to | Description |
|-----|-----------|-------------|
| `command` | STDIO | The command that launches the server (for example, `uvx` or `npx`). |
| `args` | STDIO | Array of arguments passed to `command`. |
| `env` | STDIO | Table of environment variables set when launching the server. |
| `env_vars` | STDIO | Names of existing environment variables to pass through to the server. |
| `url` | HTTP | The server endpoint for a streamable HTTP server. |
| `bearer_token_env_var` | HTTP | Name of the environment variable to read a bearer token from. Sent as `Authorization: Bearer TOKEN`. |
| `http_headers` | HTTP | Table of static HTTP headers to send with each request. |
| `env_http_headers` | HTTP | HTTP headers whose values are read from environment variables. |
| `enabled` | Both | Whether the server is active. Defaults to `true`. |
| `required` | Both | When `true`, `wizard exec` errors if this server fails to initialize. |
| `enabled_tools` | Both | Allowlist of tool names to expose from the server. |
| `disabled_tools` | Both | Blocklist of tool names to hide from the server. |
| `default_tools_approval_mode` | Both | Default approval mode for this server's tools (`auto`, `prompt`, or `approve`). |
| `startup_timeout_sec` | Both | How long to wait for the server to start and list its tools. |
| `tool_timeout_sec` | Both | How long to wait for an individual tool call. |

</SimpleTable>

Set per-tool approvals with a `[mcp_servers.NAME.tools.TOOL_NAME]` block and an `approval_mode` of `auto`, `prompt`, or `approve`:

```toml
[mcp_servers.github.tools.create_pull_request]
approval_mode = "approve"
```

## Authenticate a server

For streamable HTTP servers that use OAuth, authenticate from the CLI:

```bash
wizard mcp login SERVER_NAME
wizard mcp logout SERVER_NAME
```

For servers that use a static token, set `bearer_token_env_var` to the name of an environment variable holding the token, and export that variable before starting `wizard`.

## Manage MCP servers (CLI)

Inspecting and removing servers is done through the <Constant name="wizard" /> CLI:

<SimpleTable>

| Command | What it does |
|---------|-------------|
| `wizard mcp list` | List configured MCP servers. Add `--json` for machine-readable output. |
| `wizard mcp get NAME` | Show the configuration for one server. |
| `wizard mcp add NAME ...` | Add a STDIO or streamable HTTP server. |
| `wizard mcp remove NAME` | Remove a server's configuration. |
| `wizard mcp login NAME` | Authenticate with an OAuth server. |
| `wizard mcp logout NAME` | Sign out of an OAuth server. |

</SimpleTable>

## Approvals and tool permissions

MCP tool calls follow the same [approval and sandboxing](/docs/dbt-ai/wizard-how-it-works#approval-and-sandboxing) rules as the rest of <Constant name="wizard" />. Use `enabled_tools` and `disabled_tools` to control which tools a server exposes, so <Constant name="wizard"/> can only call the ones you intend.

## Examples
Here are some explains explaining some possible common scenarios where you need to add an MCP server and how to do it.

### dbt MCP server

The [dbt MCP server](/docs/dbt-ai/about-mcp) gives <Constant name="wizard"/> governed access to your project's models, metrics, lineage, freshness, and platform APIs. In the <Constant name="dbt_platform" /> it's available automatically. In the CLI, you can connect it two ways:

<Tabs>
<TabItem value="local" label="Local (no account required)" default>

Runs on your machine through `uvx` and works with or without a <Constant name="dbt_platform" /> account — the best fit for development:

```bash
wizard mcp add dbt -- uvx dbt-mcp
```

The local server reads its connection settings (such as `DBT_HOST`, `DBT_TOKEN`, and `DBT_PROJECT_DIR`) from environment variables, typically a `.env` file in your dbt project root. You don't need a URL. For setup, refer to [Run dbt locally](/docs/dbt-ai/mcp-quickstart-cli) and [Set up local MCP](/docs/dbt-ai/setup-local-mcp).

</TabItem>
<TabItem value="remote" label="Remote (dbt platform account)">

Hosted on the platform with no local install. Form the URL from your platform host (`https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/`, for example `https://cloud.getdbt.com/api/ai/v1/mcp/`), then authenticate:

```bash
wizard mcp add dbt --url https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/
wizard mcp login dbt
```

For finding your host and token, refer to [Connect to the remote dbt MCP server](/docs/dbt-ai/mcp-quickstart-remote) and [Connections and authentication (MCP)](/docs/dbt-ai/wizard-how-it-works#connections-and-authentication-mcp).

</TabItem>
</Tabs>

Then prompt <Constant name="wizard"/>:

```
Use the dbt MCP server to find the most recent failed run for the
nightly job and summarize the error.
```

### GitHub MCP server for pull request review

Connect a GitHub MCP server so <Constant name="wizard"/> can read a pull request and post review comments:

<File name='~/.dbt/wizard/config.toml'>

```toml
[mcp_servers.github]
url = "https://api.githubcopilot.com/mcp/"
# This is the NAME of an environment variable, not the token itself.
# Keep your real token out of this file.
bearer_token_env_var = "GITHUB_MCP_TOKEN"
```

</File>

Then set that environment variable to your actual token before starting <Constant name="wizard"/>:

```bash
export GITHUB_MCP_TOKEN="your-real-token-here"
```

<Constant name="wizard"/> reads the token from the environment at runtime and sends it as `Authorization: Bearer <the token>`. Storing only the variable name in `config.toml` keeps the secret out of your committed config.

```
Review the dbt model changes in PR #482 — check for missing tests on
new columns and confirm downstream refs still resolve.
```

## Related docs

- [dbt MCP server](/docs/dbt-ai/about-mcp) — the dbt-maintained server and its available tools
- [Use subagents with <Constant name="wizard" />](/docs/dbt-ai/wizard-subagents) — delegate work to specialized agents
- [<Constant name="wizard" /> CLI config](/docs/dbt-ai/wizard-config) — `config.toml` keys and precedence
- [<Constant name="wizard" /> CLI command reference](/docs/dbt-ai/wizard-cli-reference) — `wizard mcp` flags and subcommands
- [How <Constant name="wizard" /> works](/docs/dbt-ai/wizard-how-it-works) — approvals and sandboxing

---
title: "Use MCP servers with the dbt Wizard CLI"
id: "wizard-mcp"
description: "Connect the dbt Wizard CLI to MCP servers to give it more tools and context."
sidebar_label: "Use MCP servers"
tags: [AI, Wizard]
---

import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';

# Use MCP servers with the <Constant name="wizard"/> CLI <Lifecycle status="beta"/>

<IntroText>
The Model Context Protocol (MCP) connects <Constant name="wizard" /> to external tools and context. Add an MCP server and <Constant name="wizard"/> can call its tools mid-session &mdash; query the dbt MCP server for governed project metadata, open a pull request through the GitHub MCP server, or pull in any other MCP-compatible service.
</IntroText>

<WizardFeedbackCallout />

For background on MCP itself, refer to the [Model Context Protocol introduction](https://modelcontextprotocol.io/introduction). For the dbt-maintained server specifically, refer to the [dbt MCP server](/docs/dbt-ai/about-mcp).

## Locations and precedence

MCP servers are configured under `[mcp_servers.NAME]` in `config.toml`. Use user-level config for servers you want in every local project, and project-level config for servers that should travel with a trusted repo.

The following table summarizes where <Constant name="wizard" /> looks for MCP server configuration. Use the intended locations for new MCP servers, and keep compatibility locations only when migrating existing setup. Project-level MCP config loads only for trusted projects. Within project-level locations, the current working directory wins over parent directories. Project-level servers win over user-level servers with the same name.

<SimpleTable>

| Location | Level | Use for new MCP servers? | Precedence |
| --- | --- | --- | --- |
| `.dbt/wizard/config.toml` | Project | Yes. Use `[mcp_servers.NAME]` here for repo-shared MCP servers. | Highest project MCP config location; closer to the current working directory wins over parent directories. |
| `~/.dbt/wizard/config.toml` | User | Yes. Use this for MCP servers you want across all local projects. The `wizard mcp add` command writes here. | Below project config, above compatibility imports. |
| `.mcp.json` | Project | No. Compatibility import for existing MCP setup. | Imported with the project config for the same directory. |
| `~/.dbt/wizard/.mcp.json` | User | No. Compatibility import for existing MCP setup. | Imported with user config; takes precedence over `~/.mcp.json` if both exist. |
| `~/.mcp.json` | User | No. Compatibility import for existing MCP setup. | User-level fallback. |

</SimpleTable>

Avoid defining the same MCP server name in more than one location unless you intentionally want the higher-precedence location to override it. If a compatibility `.mcp.json` file and `config.toml` in the same directory define the same server name, remove the duplicate and keep the intended `config.toml` entry.

## Why use an MCP server

<Constant name="wizard"/> natively understands your dbt project. An MCP server extends that reach to the other tools and systems your work depends on, so you can do more without leaving your [session](/docs/dbt-ai/wizard-how-it-works#sessions). Each server you add gives <Constant name="wizard"/> a new set of tools it can call on your behalf. For example:

- dbt MCP server for governed access to your models, metrics, and lineage.
- GitHub server to read and review pull requests.
- Data warehouse server, or another server, to pull in context that lives outside dbt.

The <Constant name="wizard"/> CLI lets you add, remove, authenticate, and customize MCP servers, including per-tool approvals, through the `config.toml` file.

:::info MCP servers are a CLI feature
You can configure MCP servers only in the <Constant name="wizard" /> CLI. You can't add your own MCP servers in the <Constant name="dbt_platform" /> (<Constant name="studio_ide" /> and the home app), but <Constant name="wizard" /> includes built-in dbt tools, such as [dbt Agent skills](https://github.com/dbt-labs/dbt-agent-skills) and product documentation fetching through the dbt MCP server.
:::

## Supported MCP server types

<Constant name="wizard" /> supports two transports:

<SimpleTable>

| Type | Description |
|------|-------------|
| STDIO server (standard input/output, a server that runs as a program on your own computer, instead of one you connect to over the internet) | Runs as a local process that <Constant name="wizard"/> starts with a command (for example, `npx` or `uvx`). Supports environment variables. |
| Streamable HTTP server | A server you reach at a URL. Supports bearer-token and OAuth authentication. |

</SimpleTable>

:::note Server instructions
For either transport, <Constant name="wizard"/> reads the `instructions` field the server returns during initialization and uses it as cross-tool guidance.
:::

## Add an MCP server

Use the `wizard mcp add` command, or edit `~/.dbt/wizard/config.toml` directly. Either one writes user-level `[mcp_servers.NAME]` configuration.

<Tabs>
<TabItem value="stdio" label="Add a STDIO server">

```bash
wizard mcp add SERVER_NAME --env VAR1=value1 -- COMMAND ARGS
```

Where:

- `SERVER_NAME` is a name you choose for the server (for example, `filesystem`).
- `--env VAR1=value1` is optional and repeatable, and applies only to STDIO servers.
- Everything after `--` is the command <Constant name="wizard"/> runs to launch the server, so the space after `--` is intentional.

For example, add a filesystem MCP server that runs locally through `npx`. This server needs no environment variables, so omit `--env`:

```bash
wizard mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /Users/you/my-project
```

To connect the [dbt MCP server](/docs/dbt-ai/about-mcp), use the streamable HTTP form below — refer to [dbt MCP server](#dbt-mcp-server) under Examples.

</TabItem>

<TabItem value="http" label="Add a streamable HTTP server">

```bash
wizard mcp add SERVER_NAME --url https://example.com/mcp --bearer-token-env-var MY_TOKEN
```

To see all MCP subcommands, run `wizard mcp --help`. For the full list of flags, refer to the [CLI command reference](/docs/dbt-ai/wizard-cli-reference).

</TabItem>

<TabItem value="config" label="Edit config.toml directly">

Instead of the `wizard mcp add` command, you can edit `config.toml` yourself. <Constant name="wizard"/> stores user-level MCP configuration in `~/.dbt/wizard/config.toml` alongside its other settings:

<File name='~/.dbt/wizard/config.toml'>

```toml
# STDIO server (runs locally)
[mcp_servers.filesystem]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/my-project"]

# Streamable HTTP server
[mcp_servers.github]
url = "https://api.githubcopilot.com/mcp/"
bearer_token_env_var = "GITHUB_MCP_TOKEN"
http_headers = { "X-Region" = "us-east-1" }
```

</File>

Restart `wizard` after editing `config.toml` — MCP servers are loaded at session start. For how settings resolve, refer to [Config precedence](/docs/dbt-ai/wizard-config#config-precedence).

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
| `scopes` | HTTP | Array of OAuth scopes to request during login. Overrides the scopes the server advertises. |
| `oauth.client_id` | HTTP | OAuth client identifier presented during authorization and token exchange. |
| `oauth_resource` | HTTP | OAuth resource parameter to include in login requests ([RFC 8707](https://datatracker.ietf.org/doc/html/rfc8707)). |
| `enabled` | Both | Whether the server is active. Defaults to `true`. |
| `required` | Both | When `true`, `wizard exec` errors if this server fails to initialize. |
| `enabled_tools` | Both | Allowlist of tool names to expose from the server. |
| `disabled_tools` | Both | Blocklist of tool names to hide from the server. |
| `default_tools_approval_mode` | Both | Default approval mode for this server's tools: `prompt` (ask before each call) or `auto`/`approve` (run without asking, which behave the same). |
| `startup_timeout_sec` | Both | How long to wait for the server to start and list its tools. |
| `tool_timeout_sec` | Both | How long to wait for an individual tool call. |

</SimpleTable>

Set per-tool approvals with a `[mcp_servers.NAME.tools.TOOL_NAME]` block and an `approval_mode` of `auto`, `prompt`, or `approve`:

```toml
[mcp_servers.github.tools.create_pull_request]
approval_mode = "approve"
```

## Authenticate a server

If a streamable HTTP server uses OAuth, you must authenticate from the CLI before <Constant name="wizard"/> can use it. Run:

```bash
wizard mcp login SERVER_NAME
wizard mcp logout SERVER_NAME
```

To request specific scopes at login, pass the `--scopes` CLI flag with a comma-separated list. This requests the same scopes as the `scopes` key in `config.toml`, but only for that login:

```bash
wizard mcp login SERVER_NAME --scopes read,write
```

For servers that use a static token, set `bearer_token_env_var` to the name of an environment variable holding the token, and export that variable before starting `wizard`.

## Manage MCP servers (CLI)

Manage your configured servers through the <Constant name="wizard" /> CLI, or by editing `config.toml` directly. The CLI provides these commands:

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

MCP tool calls follow the same [approval and sandboxing](/docs/dbt-ai/wizard-how-it-works#approval-and-sandboxing) rules as the rest of <Constant name="wizard" />. Set `enabled_tools` and `disabled_tools` in `config.toml` to control which tools a server exposes (there's no dedicated CLI flag). That way, <Constant name="wizard"/> calls only the tools you intend.

## Examples

The following examples show common scenarios for adding an MCP server and how to configure them.

### dbt MCP server

The [dbt MCP server](/docs/dbt-ai/about-mcp) gives <Constant name="wizard"/> governed access to your project's models, metrics, lineage, freshness, and platform APIs. You can connect it two ways:

<Tabs>
<TabItem value="local" label="Self-hosted (no account required)" default>

Runs on your machine through `uvx` and works with or without a <Constant name="dbt_platform" /> account — the best fit for development:

```bash
wizard mcp add dbt -- uvx dbt-mcp
```

The self-hosted server reads its connection settings (such as `DBT_HOST`, `DBT_TOKEN`, and `DBT_PROJECT_DIR`) from environment variables, typically a `.env` file in your dbt project root. You don't need a URL. For setup, refer to [Run self-hosted dbt](/docs/dbt-ai/mcp-quickstart-cli) and [Set up self-hosted MCP](/docs/dbt-ai/setup-local-mcp).

</TabItem>
<TabItem value="remote" label="Remote (dbt platform account)">

Hosted on the dbt platform. Build the URL from your platform host (`https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/`, for example `https://cloud.getdbt.com/api/ai/v1/mcp/`), then authenticate:

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

At runtime, <Constant name="wizard"/> reads the token from the environment and sends it as `Authorization: Bearer <the token>`. Store only the variable name in `config.toml` to keep the secret out of your committed config.

```
Review the dbt model changes in PR #482 — check for missing tests on
new columns and confirm downstream refs still resolve.
```

## Related docs

- [dbt MCP server](/docs/dbt-ai/about-mcp): The dbt-maintained server and its available tools
- [Use subagents with <Constant name="wizard" />](/docs/dbt-ai/wizard-subagents): Delegate work to specialized agents
- [<Constant name="wizard" /> CLI config](/docs/dbt-ai/wizard-config): `config.toml` keys and precedence
- [<Constant name="wizard" /> CLI command reference](/docs/dbt-ai/wizard-cli-reference): `wizard mcp` flags and subcommands
- [How <Constant name="wizard" /> works](/docs/dbt-ai/wizard-how-it-works): Approvals and sandboxing

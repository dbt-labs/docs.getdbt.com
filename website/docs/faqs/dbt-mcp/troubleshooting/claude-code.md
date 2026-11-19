---
title: "Claude Code can't connect to the dbt MCP server"
sidebar_label: "Claude Code can't connect to the dbt MCP server"
description: "Troubleshooting: Claude Code can't connect to the dbt MCP server"
id: mcp-troubleshoot-claude-code
---

If the dbt MCP server doesn't connect, confirm `.mcp.json` is at the _project root_ and that the `dbt` block matches one of the examples on the [Claude setup page](/docs/dbt-ai/integrate-mcp-claude#claude-code). For self-hosted installations, apply the same full-path fix for `uvx` (and for `--env-file` paths). For remote setups, verify the URL and headers, and try the equivalent `claude mcp add --transport http` command to compare.

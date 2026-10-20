---
title: "Claude Desktop errors"
sidebar_label: "Claude Desktop errors"
description: "Troubleshooting: Claude Desktop errors"
id: mcp-troubleshoot-claude-desktop-errors
---

Claude Desktop may return errors such as `Error: spawn uvx ENOENT`, `Error: spawn npx ENOENT`, `Could not connect to MCP server dbt-mcp`, or `Server disconnected`. For self-hosted installations, replace the `command` with the full path to `uvx`: run `which uvx` on Unix systems or `where uvx` on Windows and paste the full path into your JSON (for example, `"command": "/the/full/path/to/uvx"`). For token-based remote setups with `mcp-remote`, apply the same full-path fix for `npx`.

If Claude reports that entries in `claude_desktop_config.json` are not valid and were skipped, check that you are not using `"type": "http"` in that file. Use the [token-based `mcp-remote` config](/docs/dbt-ai/integrate-mcp-claude#desktop-remote) instead.

For remote setups, double-check that the MCP URL ends in `/api/ai/v1/mcp/` (including the trailing slash) and that your `Authorization` header value is `Token YOUR_DBT_ACCESS_TOKEN` or `Bearer YOUR_DBT_ACCESS_TOKEN`.

Logs are at `~/Library/Logs/Claude` (macOS) or `%APPDATA%\Claude\logs` (Windows).

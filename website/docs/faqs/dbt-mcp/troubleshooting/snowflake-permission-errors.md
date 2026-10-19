---
title: "Permission errors when creating the integration or MCP server"
sidebar_label: "Permission errors when creating the integration or MCP server"
description: "Troubleshooting: Permission errors when creating the integration or MCP server"
id: mcp-troubleshoot-snowflake-permission-errors
---

`CREATE API INTEGRATION` and `CREATE EXTERNAL MCP SERVER` require `ACCOUNTADMIN` (or a role with account-level `CREATE INTEGRATION`). Run Steps 1–2 as `ACCOUNTADMIN`, then grant `USAGE` on the MCP server and integration to the role that runs the agent (Step 3).

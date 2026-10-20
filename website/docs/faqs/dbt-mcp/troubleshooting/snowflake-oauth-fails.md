---
title: "The connector won't authorize or the OAuth flow fails"
sidebar_label: "The connector won't authorize or the OAuth flow fails"
description: "Troubleshooting: The connector won't authorize or the OAuth flow fails"
id: mcp-troubleshoot-snowflake-oauth-fails
---

- Confirm your account has a [static subdomain](/docs/platform/about-platform/access-regions-ip-addresses). OAuth with MCP requires one.
- Verify the host in `API_ALLOWED_PREFIXES`, `OAUTH_TOKEN_ENDPOINT`, `OAUTH_AUTHORIZATION_ENDPOINT`, and `OAUTH_RESOURCE_URL` all match your MCP URL host exactly, and that the integration `ENABLED = TRUE`.
- AI features are enabled by default and admins can [turn them off or back on anytime](/docs/platform/manage-dbt-ai).
- Make sure remote MCP OAuth is available for your account plan.

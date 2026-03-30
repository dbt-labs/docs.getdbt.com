## Remote MCP OAuth docs — confirmed decisions

- **MCP URL placeholder:** `https://YOUR_DBT_HOST_URL/api/ai/v1/mcp` (no trailing slash).
- **Example Access URL:** `abc123.us1.dbt.com` (used in snippets; hostname only in the placeholder).
- **Private beta:** `<Lifecycle status="private_beta" />` in an `:::info` callout ([`_mcp-remote-oauth-beta-callout.md`](../website/snippets/_mcp-remote-oauth-beta-callout.md)).
- **Third-party assistants:** Do not document specific tools (for example ChatGPT) until product confirms integrations.
- **Eligibility:** Remote MCP OAuth for Enterprise and Enterprise+ (`managed`, `managed_plus`).
- **Callout type:** `:::info` (not `:::caution`).

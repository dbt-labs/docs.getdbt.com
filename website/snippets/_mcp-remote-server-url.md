You can copy your full **MCP URL** from **Account settings** → **Integrations** → **App integrations** in <Constant name="dbt_platform"/>, and paste it directly into your AI tool.

To build it yourself, use your **Access URL** from **Account settings** in <Constant name="dbt_platform"/>. The remote MCP endpoint is:

`https://YOUR_DBT_HOST_URL/api/ai/v1/mcp`

Replace `YOUR_DBT_HOST_URL` with your hostname only (no `https://`). For example, if your Access URL is `abc123.us1.dbt.com`, prepend `https://` and append `/api/ai/v1/mcp` to build the full MCP URL.

For default hosts, multi-cell accounts, and regions, see [Access, Regions, & IP addresses](/docs/platform/about-platform/access-regions-ip-addresses).

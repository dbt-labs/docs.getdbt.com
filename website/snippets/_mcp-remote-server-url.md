You can copy your full **MCP URL** from **Account settings** → **Access URLs** → **MCP Endpoint URL** in <Constant name="dbt_platform"/>, and paste it directly into your AI tool.

<Expandable alt_header="Build your own MCP URL">

We recommend using the MCP URL from **Account settings** → **Access URLs** → **MCP Endpoint URL** in <Constant name="dbt_platform"/>. However, if you want to build your own MCP URL, use your **Access URL** from **Account settings** in <Constant name="dbt_platform"/>. The remote MCP endpoint is `https://YOUR_DBT_HOST_URL/api/ai/v1/mcp`. Replace `YOUR_DBT_HOST_URL` with your hostname only (no `https://`). 

For default hosts, multi-cell accounts, and regions, see [Access, Regions, & IP addresses](/docs/platform/about-platform/access-regions-ip-addresses).
</Expandable>

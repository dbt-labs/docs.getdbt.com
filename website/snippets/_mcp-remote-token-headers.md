For token-based remote MCP, set these headers in your client's MCP config:

- **`Authorization`** _(required)_ — `Token YOUR_DBT_ACCESS_TOKEN` or `Bearer YOUR_DBT_ACCESS_TOKEN`. Use a [personal access token (PAT)](/docs/dbt-apis/user-tokens) or a [service token](/docs/dbt-apis/service-tokens) with at least Semantic Layer, Metadata, and Developer permissions.
- **`x-dbt-prod-environment-id`** _(required)_ — your <Constant name="dbt_platform" /> production environment ID. Find it on the **Orchestration** page.
- **`x-dbt-dev-environment-id`** — required for `execute_sql` and <Constant name="fusion" /> tools.
- **`x-dbt-user-id`** — required for `execute_sql`. Refer to [Find your user ID](/faqs/Accounts/find-user-id).

:::warning Use numeric IDs, not full URLs
Headers like `x-dbt-prod-environment-id`, `x-dbt-dev-environment-id`, and `x-dbt-user-id` expect numeric IDs (for example, `54321`), not full URLs copied from your browser. The MCP host URL must include `https://`, whether you set it in a `url` field or pass it as an `mcp-remote` argument.
:::

`execute_sql` does **not** work with service tokens &mdash; you must use a PAT. For the complete list of headers (including tool-disable options) and the full table, refer to [Set up remote MCP](/docs/dbt-ai/setup-remote-mcp#token-based-authentication).

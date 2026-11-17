For token-based remote MCP, set these headers in your client's MCP config:

<SimpleTable>
| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Token YOUR_DBT_ACCESS_TOKEN` or `Bearer YOUR_DBT_ACCESS_TOKEN`. Use a [personal access token (PAT)](/docs/dbt-apis/user-tokens) or a [service token](/docs/dbt-apis/service-tokens). |
| Token permissions | Not a header | You don't need the `Developer` permission set to connect. The token needs access to the project that owns the environment in `x-dbt-prod-environment-id`, plus the permissions for the tools you want to use. PATs inherit their creator's permissions. For service tokens, refer to [Permissions for remote MCP](/docs/dbt-ai/setup-remote-mcp#permissions). |
| `x-dbt-prod-environment-id` | Yes | Your <Constant name="dbt_platform" /> production environment ID. Refer to [How to find your dbt MCP IDs](/docs/dbt-ai/mcp-find-ids#dbt-prod-env-id). |
| `x-dbt-dev-environment-id` | For `execute_sql` and <Constant name="fusion" /> tools | Your development environment ID. Refer to [How to find your dbt MCP IDs](/docs/dbt-ai/mcp-find-ids#dbt-dev-env-id). |
| `x-dbt-user-id` | For `execute_sql` | Your user ID. Refer to [Where can I find my user ID?](/faqs/Accounts/find-user-id). |
</SimpleTable>

:::warning Use numeric IDs, not full URLs
Headers like `x-dbt-prod-environment-id`, `x-dbt-dev-environment-id`, and `x-dbt-user-id` expect numeric IDs (for example, `54321`), not full URLs copied from your browser. The MCP host URL must include `https://`, whether you set it in a `url` field or pass it as an `mcp-remote` argument.
:::

If you use token-based auth, `execute_sql` requires a personal access token (PAT). Service tokens won't work. To run SQL without creating a PAT, connect with [OAuth (remote MCP)](/docs/dbt-ai/setup-remote-mcp#oauth-remote-mcp) instead. Refer to [Set up remote MCP](/docs/dbt-ai/setup-remote-mcp#token-based-authentication) for the full list of headers.

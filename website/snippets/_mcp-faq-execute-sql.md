<Expandable alt_header="execute_sql tool not working">

**Symptoms:** The `execute_sql` tool returns an authentication error or is unavailable.

**Cause:** How you fix this depends on how you connected:

- **Remote MCP with OAuth:** Sign in through your MCP client when prompted. You don't need a personal access token.
- **Remote MCP with token-based auth:** You need a [personal access token (PAT)](/docs/dbt-apis/user-tokens). Service tokens won't work. You also need `x-dbt-dev-environment-id` and `x-dbt-user-id` headers. The user ID must match the user who created the PAT.
- **Local MCP:** Set `DBT_TOKEN` to a personal access token (PAT). Service tokens won't work.

**Solution:**

1. If you use OAuth for remote MCP, confirm you completed sign-in and consent in your MCP client.
2. If you use token-based auth or local MCP, create a [personal access token (PAT)](/docs/dbt-apis/user-tokens) in **Account settings** → **API tokens** → **Personal tokens**.
3. For token-based remote MCP, add the PAT to the `Authorization` header as `Token YOUR_PAT`. For local MCP, set the PAT as your `DBT_TOKEN` value.
4. Also ensure `DBT_DEV_ENV_ID` and `DBT_USER_ID` are set (local MCP) or `x-dbt-dev-environment-id` and `x-dbt-user-id` headers are set (remote MCP). Refer to [Finding your IDs](/docs/dbt-ai/mcp-find-ids) for details.
</Expandable>

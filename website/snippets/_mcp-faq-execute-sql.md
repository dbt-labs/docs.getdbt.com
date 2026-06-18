<Expandable alt_header="execute_sql tool not working">

**Symptoms:** The `execute_sql` tool returns an authentication error or is unavailable.

**Cause:** `execute_sql` requires a Personal Access Token (PAT). Service tokens do not work for this tool.

**Solution:**

1. Generate a [Personal Access Token (PAT)](/docs/dbt-apis/user-tokens) in **Account settings** → **API tokens** → **Personal tokens**.
2. Use the PAT as your `DBT_TOKEN` value.
3. Also ensure `DBT_DEV_ENV_ID` and `DBT_USER_ID` are set — these are required for `execute_sql`.
</Expandable>

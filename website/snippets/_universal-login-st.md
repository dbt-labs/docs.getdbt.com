:::info
`login.dbt.com` is currently available for multi-tenant accounts with an account-specific domain (for example, `abc123.us1.dbt.com`). Support for single-tenant accounts is coming soon. In the meantime, single-tenant users can sign in directly using their account **Access URL** (like `MY_COMPANY.us1.dbt.com`).

OAuth clients such as [<Constant name="platform_cli"/>](/docs/platform/dbt-cli-installation), the [dbt VS Code extension](/docs/about-dbt-extension?version=2.0), and [dbt MCP](/docs/dbt-ai/about-mcp) have not yet been updated to use `login.dbt.com` and continue to authenticate through their account [**Access URL**](/docs/platform/about-platform/access-regions-ip-addresses).

:::

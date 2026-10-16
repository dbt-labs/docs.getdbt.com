**Before you connect**

- Your MCP client must support OAuth for HTTP-based MCP servers. If it doesn't, use [token-based authentication](/docs/dbt-ai/setup-remote-mcp#token-based-authentication) instead.
- On first connect, your client opens a browser for sign-in. dbt then shows a consent screen with the scopes (the specific permissions the client is allowed to use) it's requesting &mdash; see [Scopes and consent](/docs/platform/manage-access/connect-apps-oauth#scopes-and-consent) for what each scope means.
- Most modern MCP clients self-register on first connect via [dynamic registration (RFC 7591)](/docs/platform/manage-access/connect-apps-oauth#dynamic-registration). Clients that don't support it need an admin to register them in **Account settings → Integrations → App integrations**. See [Manual registration](/docs/platform/manage-access/connect-apps-oauth#manual-registration).

For the full flow, sessions, and limitations, refer to [OAuth (remote MCP)](/docs/dbt-ai/setup-remote-mcp#oauth-remote-mcp).

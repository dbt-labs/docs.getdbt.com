The following steps show how to connect dbt as a custom connector in Claude Desktop. The exact UI varies by tool, but the flow is the same: add a custom connector with your MCP URL, complete the OAuth consent flow, then connect.

1. In your AI tool, go to its connector settings and choose to add a custom connector (in Claude Desktop, go to **Chat &rarr; Customize &rarr; Connectors**, then click **Add custom connector**).
2. Enter a name (for example, `dbt`) and paste your <Constant name="dbt_platform" /> MCP URL (for example, `https://abc123.us1.dbt.com/api/ai/v1/mcp`), then click **Add**.
   <Lightbox src="/img/docs/dbt-cloud/oauth-add-custom-connector.png" title="Custom connector dialog showing the dbt MCP URL" />
3. Click **Connect**. The tool redirects you to dbt to complete the OAuth consent flow, where you can approve or deny individual [scopes](/docs/platform/manage-access/connect-apps-oauth#scopes-and-consent).
   <Lightbox src="/img/docs/dbt-cloud/oauth-consent-screen.png" width="60%" title="OAuth consent screen showing requested scopes and project access" />
4. After you approve, the connector is added to the **Custom connectors** table and shows as connected.
   <Lightbox src="/img/docs/dbt-cloud/oauth-connectors-page.png" title="Adding a custom dbt connector in an AI tool's connector settings" />
5. That's it 🎉! Ask your tool a data question like _"What is the total revenue for the last 30 days?"_ to confirm the connection.

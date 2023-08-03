The dbt Semantic Layer integrations are capable of querying dbt metrics, importing definitions, surfacing the underlying data in partner tools, and more.  These are the following tools that integrate with the dbt Semantic Layer:

- **Hex** &mdash; Public docs coming soon, however, you can refer to a detailed [Loom video](https://www.loom.com/share/752e85aabfbf4fa585008a5598f3517a), which explains how to connect in more detail. 

- **Mode** &mdash; To connect to Mode, refer to [Mode documentation](https://mode.com/help/articles/supported-databases/#dbt-semantic-layer).

- **Google Sheets** &mdash; Integration with Google Sheets coming soon

- **Tools that allows you to write SQL** &mdash; They must meet one of the two criteria: 
  * Supports a generic JDBC driver option (such as DataGrip) or 
  * Supports Dremio and uses ArrowFlightSQL driver version 12.0.0 or higher.

**Note**, before you connect to these tools, you'll need to first [set up the dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl) and [generate a service token](/docs/dbt-cloud-apis/service-tokens) to create a Semantic Layer Only and Metadata Only service token. 


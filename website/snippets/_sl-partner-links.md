<!-- turn this list into sections once more docs are provided -->
The dbt Semantic Layer integrations are capable of querying dbt metrics, importing definitions, surfacing the underlying data in partner tools, and more.  These are the following tools that integrate with the dbt Semantic Layer:

1. **Mode** &mdash; Refer to the [Mode docs](https://mode.com/help/articles/supported-databases/#dbt-semantic-layer) for info on how to integrate with Mode.
1. **Hex** &mdash; Hex’s Semantic Layer integration will be available in the coming weeks. Until then, refer to [this Loom video](https://www.loom.com/share/752e85aabfbf4fa585008a5598f3517a) for more info. 
1. **Google Sheets** &mdash; Google Sheets integration coming soon.
1. **Tools that allows you to write SQL** &mdash; They must meet one of the two criteria: 
    * Supports a generic JDBC driver option (such as DataGrip) or 
    * Supports Dremio and uses ArrowFlightSQL driver version 12.0.0 or higher.

Before you connect to these tools, you'll need to first [set up the dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl) and [generate a service token](/docs/dbt-cloud-apis/service-tokens) to create a Semantic Layer Only and Metadata Only service token. 

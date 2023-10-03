<!-- turn this list into cards or sections once more docs are provided -->
The dbt Semantic Layer integrations are capable of querying dbt metrics, importing definitions, surfacing the underlying data in partner tools, and more.  These are the following tools that integrate with the dbt Semantic Layer:

1. **Mode** &mdash; To learn more about integrating with Mode, check out their [documentation](https://mode.com/help/articles/supported-databases/#dbt-semantic-layer) for more info.
2. **Hex** &mdash; To learn more about integrating with Hex, check out their [documentation](https://learn.hex.tech/docs/connect-to-data/data-connections/dbt-integration#dbt-semantic-layer-integration) for more info. Additionally, refer to [dbt Semantic Layer cells](https://learn.hex.tech/docs/logic-cell-types/transform-cells/dbt-metrics-cells) to set up SQL cells in Hex.
3. **Google Sheets** &mdash; Google Sheets integration coming soon.
4. **Tools that allows you to write SQL** &mdash; They must meet one of the two criteria: 
    * Supports a generic JDBC driver option (such as DataGrip) or 
    * Supports Dremio and uses ArrowFlightSQL driver version 12.0.0 or higher.

Before you connect to these tools, you'll need to first [set up the dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl) and [generate a service token](/docs/dbt-cloud-apis/service-tokens) to create a Semantic Layer Only and Metadata Only service token. 

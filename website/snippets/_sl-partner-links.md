<!-- turn this list into cards or sections once more docs are provided -->
## Integrations

The dbt Semantic Layer integrations can do things like query dbt metrics, import definitions, surface the underlying data in partner tools, and more.

The tools that work with the dbt Semantic Layer include:

1. **Mode**<br />
To learn more about integrating with Mode, check out their [documentation](https://mode.com/help/articles/supported-databases/#dbt-semantic-layer) for more info.

1. **Hex**<br />
To learn more about integrating with Hex, check out their [documentation](https://learn.hex.tech/docs/connect-to-data/data-connections/dbt-integration#dbt-semantic-layer-integration) for more info. Additionally, refer to [dbt Semantic Layer cells](https://learn.hex.tech/docs/logic-cell-types/transform-cells/dbt-metrics-cells) to set up SQL cells in Hex.

1. **Google Sheets**<br />
Google Sheets integration coming soon.

1. **Tools that allows you to write SQL**<br />
To connect to tools that allow you to write SQL, they must meet one of the two criteria: 
   - Supports a generic JDBC driver option (such as DataGrip) or 
   - Uses Arrow Flight SQL JDBC driver version 12.0.0 or higher.

Before you connect to these tools, you'll need to first [set up the dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl) and [generate a service token](/docs/dbt-cloud-apis/service-tokens) to create a Semantic Layer Only and Metadata Only service token. 


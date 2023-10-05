You can query your metrics in a JDBC-enabled tool or use existing first-class integrations with the dbt Semantic Layer. 

You must have a dbt Cloud Team or Enterprise [multi-tenant](/docs/cloud/about-cloud/regions-ip-addresses) deployment (Single-Tenant coming soon)

- To learn how to use the JDBC or GraphQL API and what tools you can query it with, refer to [dbt Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview).

    * To authenticate, you need to [generate a service token](/docs/dbt-cloud-apis/service-tokens) with Semantic Layer Only and Metadata Only permissions.
    * Refer to the [SQL query syntax](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata) to query metrics using the API.  

- To learn more about the sophisticated integrations that connect to the dbt Semantic Layer, refer to [Available integrations](/docs/use-dbt-semantic-layer/avail-sl-integrations) for more info.

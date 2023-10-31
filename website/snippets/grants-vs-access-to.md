<VersionBlock firstVersion="1.2">

:::info Note
The `grants` config and the `grant_access_to` config are distinct.

- **`grant_access_to`:** Enables you to set up authorized views. When configured, dbt provides an authorized view access to show partial information from other datasets, without providing end users with full access to those underlying datasets. For more information, see ["BigQuery configurations: Authorized views"](/reference/resource-configs/bigquery-configs#authorized-views)
- **`grants`:** Provides specific permissions to users, groups, or service accounts for managing access to datasets you're producing with dbt. For more information, see ["Resource configs: grants"](/reference/resource-configs/grants)

You can use the two features together: "authorize" a view model with the `grants_access_to` configuration, and then add `grants` to that view model to share its query results (and _only_ its query results) with other users, groups, or service accounts.
:::

</VersionBlock>

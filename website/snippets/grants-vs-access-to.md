:::info Note
The `grants` config is unrelated to the `grant_access_to` config:
  - **`grants_access_to`:** Enables you to set up authorized views. When configured, dbt provides authorized view access to other datasets, without leaking additional data from those datasets. For more information, see [BigQuery configurations: Authorized views](/reference/resource-configs/bigquery-configs#authorized-views)
- **`grants`:** Provides specific permissions to users, groups, or service accounts for managing access to datasets you're producing with dbt.You could grant a user, group or service account access to an authorized view set up by the `grants_access_to` feature. For more information, see [grants](/reference/resource-configs/grants).
:::

When managing private connectivity, consider the following:

- Using [Environment variables](/docs/build/environment-variables) when configuring private connection endpoints isn't supported in <Constant name="dbt" />. Use [Extended attributes](/docs/dbt-platform-environments#extended-attributes) to set these values on the [connection profile](/docs/platform/about-profiles) for a deployment environment, or on the **General settings** page for a development environment.

- The [Administrative API v3](/dbt-cloud/api-v3) supports private endpoint operations &mdash; [`list`](https://docs.getdbt.com/dbt-cloud/api-v3#/operations/List%20Private%20Endpoints), [`create`](https://docs.getdbt.com/dbt-cloud/api-v3#/operations/Create%20Private%20Endpoints%20List%20Alias%20View), [`retrieve`](https://docs.getdbt.com/dbt-cloud/api-v3#/operations/Retrieve%20Private%20Endpoint), [`update`](https://docs.getdbt.com/dbt-cloud/api-v3#/operations/Update%20Private%20Endpoints%20Detail%20View), and [`delete`](https://docs.getdbt.com/dbt-cloud/api-v3#/operations/Delete%20Private%20Endpoints%20Detail%20View). You can use these endpoints to manage private connectivity programmatically.

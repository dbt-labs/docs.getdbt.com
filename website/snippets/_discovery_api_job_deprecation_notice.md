:::caution
dbt Labs is making changes to the Discovery API. These changes will take effect on September 7, 2023.

The data type `Int` for `id` is being deprecated and will be replaced with `BigInt`. Currently, both data types are supported.

[To perform job-based queries, you must do it within the `job` schema object, and move the `jobId` and `runId` arguments to `job(...)`. This is now supported so you can update your API calls accordingly.](/docs/dbt-cloud-apis/discovery-schema-job)
:::

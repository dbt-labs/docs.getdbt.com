This section will explain how you can locally test and query metrics. Before you begin, refer to [MetricFlow CLI](/docs/build/metricflow-cli) for instructions on installing it and a reference for the CLI commands.

:::important

- dbt Cloud Team or Enterprise &mdash; For public beta, querying metrics in the dbt Cloud IDE isn't yet supported (Coming soon). You'll still be able to run semantic validation on your metrics in the IDE to ensure they are defined correctly. You can also use the MetricFlow CLI to test and query metrics locally. Alternatively, you can test using SQL client tools like DataGrip, DBeaver, or RazorSQL.

- dbt Core or Developer plan &mdash; Users can only test and query metrics manually using the CLI, but won't be able to use the dbt Semantic Layer to dynamically query metrics.
:::

**Query and commit your metrics using the CLI:**

MetricFlow needs a `semantic_manifest.json` in order to build a semantic graph. To generate a semantic_manifest.json artifact run `dbt parse`. This will create the file in your `/target` directory. If you're working from the Jaffle shop example, run `dbt seed && dbt run` before preceding to ensure the data exists in your warehouse.

1. Make sure you have the MetricFlow CLI installed and up to date.
2. Run `mf --help` to confirm you have MetricFlow installed and view the available commands.
3. Run `mf query --metrics <metric_name> --group-by <dimension_name>` to query the metrics and dimensions. For example, `mf query --metrics order_total --group-by metric_time`
4. Verify that the metric values are what you expect. To further understand how the metric is being generated, you can view the generated SQL if you type `--explain` in the CLI.
5. Run `mf validate-configs` to run validation on your semantic models and metrics.
6. Commit and merge the code changes that contain the metric definitions.

To streamline your metric querying process, you can connect to the [dbt Semantic Layer API](/docs/dbt-cloud-apis/sl-api-overview) to access your metrics programmatically. For SQL syntax, refer to [Querying the API for metric metadata](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata) to query metrics using the API.

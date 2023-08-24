:::important Testing and querying metrics in the dbt Cloud IDE not yet supported

Support for testing or querying metrics in the dbt Cloud IDE is not available in the current beta but is coming soon. 

You can use the **Preview** or **Compile** buttons in the IDE to run semantic validations and make sure your metrics are defined. You can [dynamically query metrics](#connect-and-query-api) with integrated tools on a dbt Cloud [Team or Enterprise](https://www.getdbt.com/pricing/) plan using the [Semantic Layer API](/docs/dbt-cloud-apis/sl-api-overview).

Currently, you can test metrics locally using the MetricFlow CLI. dbt Cloud IDE support is coming soon. Alternatively, you can test using SQL client tools like DataGrip, DBeaver, or RazorSQL. 

:::

This section will explain how you can test and query metrics locally using the MetricFlow CLI (dbt Cloud IDE support coming soon).

Before you begin, you'll need to install the [MetricFlow CLI](/docs/build/metricflow-cli) package and make sure you run at least one model.
### Install MetricFlow

import InstallMetricFlow from '/snippets/_sl-install-metricflow.md';

<InstallMetricFlow />

### Query and commit your metrics using the CLI

MetricFlow needs a `semantic_manifest.json` in order to build a semantic graph. To generate a semantic_manifest.json artifact run `dbt parse`. This will create the file in your `/target` directory. If you're working from the Jaffle shop example, run `dbt seed && dbt run` before preceding to ensure the data exists in your warehouse.

1. Make sure you have the MetricFlow CLI installed and up to date.
2. Run `mf --help` to confirm you have MetricFlow installed and view the available commands.
3. Run `mf query --metrics <metric_name> --group-by <dimension_name>` to query the metrics and dimensions. For example, `mf query --metrics order_total --group-by metric_time`
4. Verify that the metric values are what you expect. To further understand how the metric is being generated, you can view the generated SQL if you type `--explain` in the CLI.
5. Run `mf validate-configs` to run validation on your semantic models and metrics.
6. Commit and merge the code changes that contain the metric definitions.

To streamline your metric querying process, you can connect to the [dbt Semantic Layer API](/docs/dbt-cloud-apis/sl-api-overview) to access your metrics programmatically. For SQL syntax, refer to [Querying the API for metric metadata](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata) to query metrics using the API.

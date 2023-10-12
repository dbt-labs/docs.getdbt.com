This step is for dbt Cloud CLI users only (dbt Cloud IDE support coming soon). 

dbt Cloud CLI users must install [MetricFlow](/docs/build/metricflow-commands) to run MetricFlow commands. It's compatible with Python versions 3.8, 3.9, 3.10 and 3.11:

1. Make sure you've installed the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation)
2. Create or activate your virtual environment. `python -m venv venv` or `source your-venv/bin/activate`
3. Run `pip install metricflow`
4. Run `dbt parse`. This allows MetricFlow to build a semantic graph and generate a `semantic_manifest.json` artifact.
   - This will create the file in your `/target` directory. If you're working from the Jaffle shop example, run `dbt seed && dbt run` before preceding to ensure the data exists in your warehouse.
5. Run `dbt sl --help` to confirm you have MetricFlow installed and view the available commands.
6. Run `dbt sl query --metrics <metric_name> --group-by <dimension_name>` to query the metrics and dimensions. For example, `dbt sl query --metrics order_total --group-by metric_time`
7.  Verify that the metric values are what you expect. To further understand how the metric is being generated, you can view the generated SQL if you type `--explain` in the command line.
8.  Run `dbt sl validate-configs` to run validation on your semantic models and metrics.
9.   Commit and merge the code changes that contain the metric definitions.

To streamline your metric querying process, you can connect to the [dbt Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview) to access your metrics programmatically. For SQL syntax, refer to [Querying the API for metric metadata](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata) to query metrics using the API.

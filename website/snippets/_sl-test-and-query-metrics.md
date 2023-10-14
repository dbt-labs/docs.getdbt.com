This section explains how you can test and run MetricFlow commands with dbt Cloud or dbt Core (dbt Cloud IDE support coming soon). dbt Cloud IDE users can skip to [Run a production job](#run-a-production-job) to run a model.

:::important Testing and querying metrics in the dbt Cloud IDE is currently not supported

Support for running [MetricFlow commands](/docs/build/metricflow-commands) in the dbt Cloud IDE is not available but is coming soon. 

You can use the **Preview** or **Compile** buttons in the IDE to run semantic validations and make sure your metrics are defined. Alternatively, you can run commands with the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) or with SQL client tools like DataGrip, DBeaver, or RazorSQL. 

:::

<Tabs>


<TabItem value="cloud" label="dbt Cloud">


This section is for people using the dbt Cloud CLI (support for dbt Cloud IDE is coming soon). With dbt Cloud:

- You can run MetricFlow commands after installing the dbt Cloud CLI. They're integrated with dbt Cloud so you can use them immediately.
- Your account will automatically manage version control for you.

To get started: 

1. Make sure you've installed the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation). 
2. Navigate to your dbt project directory.
3. Run a dbt command, such as `dbt parse`, `dbt run`, `dbt compile` or `dbt build`. If you don't, you'll receive an error message that begins with: `ensure that you've ran an artifacts....`
   - MetricFlow builds a semantic graph and generates a `semantic_manifest.json` file in dbt Cloud, which is stored in the `/target` directory. If using the Jaffle shop example, run `dbt seed && dbt run` to ensure the required data is in your data platform before proceeding.

4. Run `dbt sl --help` to confirm you have MetricFlow installed and view the available commands.
5. Run `dbt sl query --metrics <metric_name> --group-by <dimension_name>` to query the metrics and dimensions. For example, `dbt sl query --metrics order_total --group-by metric_time`
6.  Verify that the metric values are what you expect. To further understand how the metric is being generated, you can view the generated SQL if you type `--compile` in the command line.
7.   Commit and merge the code changes that contain the metric definitions.

To streamline your metric querying process, you can connect to the [dbt Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview) to access your metrics programmatically. For SQL syntax, refer to [Querying the API for metric metadata](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata) to query metrics using the API.


</TabItem>

<TabItem value="core" label="dbt Core">


This step is for dbt Core users only. MetricFlow is compatible with Python versions 3.8, 3.9, 3.10 and 3.11. You need to use `pip` to instal MetricFlow on Windows or Linux operating systems:

**Note** &mdash; The dbt Cloud CLI is highly recommended for the experience in defining and querying metrics in your dbt project on dbt Cloud or dbt Core with MetricFlow. If you're using dbt Core, you'll need to manage versioning between dbt Core, your adapter, and MetricFlow.


1. Install [MetricFlow](/docs/build/metricflow-commands) as an extension of a dbt adapter from PyPI.
2. Create or activate your virtual environment. `python -m venv venv` or `source your-venv/bin/activate`
3. Run `pip install dbt-metricflow`
   - You can install MetricFlow using PyPI as an extension of your dbt adapter in the command line. To install the adapter, run `pip install "dbt-metricflow[your_adapter_name]"` and add the adapter name at the end of the command. For example, for a Snowflake adapter run `pip install "dbt-metricflow[snowflake]"`
   - **Note**, you'll need to manage versioning between dbt Core, your adapter, and MetricFlow.
4. Run `dbt parse`. This allows MetricFlow to build a semantic graph and generate a `semantic_manifest.json`.
   - This will create the file in your `/target` directory. If you're working from the Jaffle shop example, run `dbt seed && dbt run` before preceding to ensure the data exists in your warehouse.
5. Run `mf --help` to confirm you have MetricFlow installed and view the available commands.
6. Run `mf query --metrics <metric_name> --group-by <dimension_name>` to query the metrics and dimensions. For example, `mf query --metrics order_total --group-by metric_time`
7. Verify that the metric values are what you expect. To further understand how the metric is being generated, you can view the generated SQL if you type `--explain` in the command line..
8. Run `mf validate-configs` to run validation on your semantic models and metrics.
9.  Commit and merge the code changes that contain the metric definitions.

To streamline your metric querying process, you can connect to the [dbt Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview) to access your metrics programmatically. For SQL syntax, refer to [Querying the API for metric metadata](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata) to query metrics using the API.


</TabItem>

</Tabs>


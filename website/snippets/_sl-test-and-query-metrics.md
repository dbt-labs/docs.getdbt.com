To work with metrics in dbt, you have several tools to validate or run commands. Here's how you can test and query metrics depending on your setup:

- [**dbt Cloud IDE users**](#dbt-cloud-ide-users) &mdash; Run [MetricFlow commands](/docs/build/metricflow-commands#metricflow-commands) directly in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) to query/preview metrics. View metrics visually in the **Lineage** tab.
- [**dbt Cloud CLI users**](#dbt-cloud-cli-users) &mdash; The [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) enables you to run [MetricFlow commands](/docs/build/metricflow-commands#metricflow-commands) to query and preview metrics directly in your command line interface.
- **dbt Core users** &mdash; Use the MetricFlow CLI for command execution. While this guide focuses on dbt Cloud users, dbt Core users can find detailed MetricFlow CLI setup instructions in the [MetricFlow commands](/docs/build/metricflow-commands#metricflow-commands) page. Note that to use the dbt Semantic Layer, you need to have a [Team or Enterprise account](https://www.getdbt.com/).

Alternatively, you can run commands with SQL client tools like DataGrip, DBeaver, or RazorSQL.

### dbt Cloud IDE users

You can use the `dbt sl` prefix before the command name to execute them in dbt Cloud. For example, to list all metrics, run `dbt sl list metrics`. For a complete list of the MetricFlow commands available in the dbt Cloud IDE, refer to the [MetricFlow commands](/docs/build/metricflow-commands#metricflow-commandss) page.

The dbt Cloud IDE **Status button** (located in the bottom right of the editor) displays an **Error** status if there's an error in your metric or semantic model definition. You can click the button to see the specific issue and resolve it.

Once viewed, make sure you commit and merge your changes in your project.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-ide-dag.jpg" title="Validate your metrics using the Lineage tab in the IDE." />

### dbt Cloud CLI users

This section is for dbt Cloud CLI users. MetricFlow commands are integrated with dbt Cloud, which means you can run MetricFlow commands as soon as you install the dbt Cloud CLI. Your account will automatically manage version control for you.

Refer to the following steps to get started:

1. Install the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) (if you haven't already). Then, navigate to your dbt project directory.
2. Run a dbt command, such as `dbt parse`, `dbt run`, `dbt compile`, or `dbt build`. If you don't, you'll receive an error message that begins with: "ensure that you've ran an artifacts....".
3. MetricFlow builds a semantic graph and generates a `semantic_manifest.json` file in dbt Cloud, which is stored in the `/target` directory. If using the Jaffle Shop example, run `dbt seed && dbt run` to ensure the required data is in your data platform before proceeding.

:::tip Run dbt parse to reflect metric changes
When you make changes to metrics, make sure to run `dbt parse` at a minimum to update the dbt Semantic Layer. This updates the `semantic_manifest.json` file, reflecting your changes when querying metrics. By running `dbt parse`, you won't need to rebuild all the models.
:::

4. Run `dbt sl --help` to confirm you have MetricFlow installed and that you can view the available commands.
5. Run `dbt sl query --metrics <metric_name> --group-by <dimension_name>` to query the metrics and dimensions. For example, to query the `order_total` and `order_count` (both metrics), and then group them by the `order_date` (dimension), you would run:

   ```sql
   dbt sl query --metrics order_total,order_count --group-by order_date
   ```
6. Verify that the metric values are what you expect. To further understand how the metric is being generated, you can view the generated SQL if you type `--compile` in the command line.
7. Commit and merge the code changes that contain the metric definitions.

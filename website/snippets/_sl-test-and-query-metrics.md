To work with metrics in dbt, you have several tools to validate or run commands. Here's how you can test and query metrics depending on your setup:

- [**<Constant name="studio_ide" /> users**](#studio-ide-users) &mdash; Run [MetricFlow commands](/docs/build/metricflow-commands#metricflow-commands) directly in the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) to query/preview metrics. View metrics visually in the **Lineage** tab.
- [**<Constant name="platform_cli" /> users**](#dbt-cli-users) &mdash; The [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation) enables you to run [MetricFlow commands](/docs/build/metricflow-commands#metricflow-commands) to query and preview metrics directly in your command line interface.
- **<Constant name="core" /> users** &mdash; Use the MetricFlow CLI for command execution. While this guide focuses on <Constant name="dbt" /> users, <Constant name="core" /> users can find detailed MetricFlow CLI setup instructions in the [MetricFlow commands](/docs/build/metricflow-commands#metricflow-commands) page. Note that to use the <Constant name="semantic_layer" />, you need to have a [Starter or Enterprise-tier account](https://www.getdbt.com/).

Alternatively, you can run commands with SQL client tools like DataGrip, DBeaver, or RazorSQL.

### Studio IDE users

You can use the `dbt sl` prefix before the command name to execute them in <Constant name="dbt" />. For example, to list all metrics, run `dbt sl list metrics`. For a complete list of the MetricFlow commands available in the <Constant name="studio_ide" />, refer to the [MetricFlow commands](/docs/build/metricflow-commands#metricflow-commandss) page.

The <Constant name="studio_ide" /> **Status button** (located in the bottom right of the editor) displays an **Error** status if there's an error in your metric or semantic model definition. You can click the button to see the specific issue and resolve it.

Once viewed, make sure you commit and merge your changes in your project.

### dbt platform CLI users

This section is for <Constant name="platform_cli" /> users. MetricFlow commands are integrated with <Constant name="dbt" />, which means you can run MetricFlow commands as soon as you install the <Constant name="platform_cli" />. Your account will automatically manage version control for you.

Refer to the following steps to get started:

1. Install the [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation) (if you haven't already). Then, navigate to your dbt project directory.
2. Run a dbt command, such as `dbt parse`, `dbt run`, `dbt compile`, or `dbt build`. If you don't, you'll receive an error message that begins with: "ensure that you've ran an artifacts....".
3. MetricFlow builds a semantic graph and generates a `semantic_manifest.json` file in <Constant name="dbt" />, which is stored in the `/target` directory. <VersionBlock firstVersion="1.12">Starting in <Constant name="core" /> v1.12, dbt also writes `osi_document.json` to your `target/` directory at parse time. For more information, refer to [Semantic manifest](/reference/artifacts/sl-manifest#apache-ossie-document).</VersionBlock> If using the Jaffle Shop example, run `dbt seed && dbt run` to ensure the required data is in your data platform before proceeding.

:::tip Run dbt parse to reflect metric changes
When you make changes to metrics, make sure to run `dbt parse` at a minimum to update the <Constant name="semantic_layer" />. This updates the `semantic_manifest.json` file<VersionBlock firstVersion="1.12"> and `osi_document.json`</VersionBlock>, reflecting your changes when querying metrics. By running `dbt parse`, you won't need to rebuild all the models.
:::

4. Run `dbt sl --help` to confirm you have MetricFlow installed and that you can view the available commands.
5. Run `dbt sl query --metrics <metric_name> --group-by <dimension_name>` to query the metrics and dimensions. For example, to query the `order_total` and `order_count` (both metrics), and then group them by the `order_date` (dimension), you would run:

   ```sql
   dbt sl query --metrics order_total,order_count --group-by order_id__order_date
   ```
6. Verify that the metric values are what you expect. To further understand how the metric is being generated, you can view the generated SQL if you type `--compile` in the command line.
7. Commit and merge the code changes that contain the metric definitions.

---
title: MetricFlow commands
id: metricflow-commands
description: "Query metrics and metadata in your dbt project with the MetricFlow commands."
sidebar_label: "MetricFlow commands"
tags: [Metrics, Semantic Layer]
---

Once you define metrics in your dbt project, you can query metrics, dimensions, and dimension values, and validate your configs using the MetricFlow commands. 

MetricFlow allows you to define and query metrics in your dbt project in the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation), [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud), or [dbt Core](/docs/core/installation-overview). To experience the power of the universal [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) and dynamically query those metrics in downstream tools, you'll need a dbt Cloud [Team or Enterprise](https://www.getdbt.com/pricing/) account. 

MetricFlow is compatible with Python versions 3.8, 3.9, 3.10, and 3.11.

## MetricFlow

MetricFlow is a dbt package that allows you to define and query metrics in your dbt project. You can use MetricFlow to query metrics in your dbt project in the dbt Cloud CLI, dbt Cloud IDE, or dbt Core.

Using MetricFlow with dbt Cloud means you won't need to manage versioning &mdash; your dbt Cloud account will automatically manage the versioning.

**dbt Cloud jobs** &mdash; MetricFlow commands aren't supported in dbt Cloud jobs yet. However, you can add MetricFlow validations with your git provider (such as GitHub Actions) by installing MetricFlow (`python -m pip install metricflow`). This allows you to run MetricFlow commands as part of your continuous integration checks on PRs.

<Tabs>

<TabItem value="cloudcli" label="dbt Cloud CLI">

- MetricFlow [commands](#metricflow-commands) are embedded in the dbt Cloud CLI. This means you can immediately run them once you install the dbt Cloud CLI and don't need to install MetricFlow separately.
- You don't need to manage versioning &mdash; your dbt Cloud account will automatically manage the versioning for you.

</TabItem>

<TabItem value="cloud ide" label="dbt Cloud IDE">

:::info
You can create metrics using MetricFlow in the dbt Cloud IDE. However, support for running MetricFlow commands in the IDE will be available soon.
:::

</TabItem>

<TabItem value="core" label="dbt Core">

:::tip Use dbt Cloud CLI for semantic layer development

You can use the dbt Cloud CLI for the experience in defining and querying metrics in your dbt project.

A benefit to using the dbt Cloud is that you won't need to manage versioning &mdash; your dbt Cloud account will automatically manage the versioning.
:::

You can install [MetricFlow](https://github.com/dbt-labs/metricflow#getting-started) from [PyPI](https://pypi.org/project/dbt-metricflow/). You need to use `pip` to install MetricFlow on Windows or Linux operating systems:

1. Create or activate your virtual environment `python -m venv venv`
2. Run `pip install dbt-metricflow`
  * You can install MetricFlow using PyPI as an extension of your dbt adapter in the command line. To install the adapter, run `python -m pip install "dbt-metricflow[your_adapter_name]"` and add the adapter name at the end of the command. For example, for a Snowflake adapter run `python -m pip install "dbt-metricflow[snowflake]"`

**Note**, you'll need to manage versioning between dbt Core, your adapter, and MetricFlow.

</TabItem>

</Tabs>

Something to note, MetricFlow `mf` commands return an error if you have a Metafont latex package installed. To run `mf` commands, uninstall the package.

## MetricFlow commands

MetricFlow provides the following commands to retrieve metadata and query metrics. 

<Tabs>
<TabItem value="cloud" label="Commands for dbt Cloud CLI">

You can use the `dbt sl` prefix before the command name to execute them in the dbt Cloud CLI. For example, to list all metrics, run `dbt sl list metrics`. For a complete list of the MetricFlow commands and flags, run the `dbt sl --help` command in your terminal.

- [`list`](#list) &mdash; Retrieves metadata values.
- [`list metrics`](#list-metrics) &mdash; Lists metrics with dimensions.
- [`list dimensions`](#list) &mdash; Lists unique dimensions for metrics.
- [`list dimension-values`](#list-dimension-values) &mdash; List dimensions with metrics.
- [`list entities`](#list-entities) &mdash; Lists all unique entities.
- [`list saved queries`](#list-saved-queries) &mdash; Lists available saved queries. Use the `--show-exports` flag to display each export listed under a saved query.
- [`query`](#query) &mdash; Query metrics, saved queries, and dimensions you want to see in the command line interface. Refer to [query examples](#query-examples) to help you get started.
- [`export`](#exports) &mdash;  Runs exports for a singular saved query for testing and generating exports in your development environment. You can also use the `--select` flag to specify particular exports from a saved query.
- [`export-all`](#export-all) &mdash; Runs exports for multiple saved queries at once, saving time and effort.


<!--below commands aren't supported in dbt cloud yet
- [`validate-configs`](#validate-configs) &mdash; Validates semantic model configurations.
- [`health-checks`](#health-checks) &mdash; Performs data platform health check.
- [`tutorial`](#tutorial) &mdash; Dedicated MetricFlow tutorial to help get you started.
-->

:::tip Run dbt parse to reflect metric changes
When you make changes to metrics, make sure to run `dbt parse` at a minimum to update the dbt Semantic Layer. This updates the `semantic_manifest.json` file, reflecting your changes when querying metrics. By running `dbt parse`, you won't need to rebuild all the models.
::: 

<Expandable alt_header="How can I query or preview metrics with the dbt Cloud CLI?">

Check out the following video for a short video demo of how to query or preview metrics with the dbt Cloud CLI:

<LoomVideo id='09e2b287f063497d888f4bed91469d79' />

</Expandable>

</TabItem>

<TabItem value="core" label="Commands for dbt Core">

Use the `mf` prefix before the command name to execute them in dbt Core. For example, to list all metrics, run `mf list metrics`.

- [`list`](#list) &mdash; Retrieves metadata values.
- [`list metrics`](#list-metrics) &mdash; Lists metrics with dimensions.
- [`list dimensions`](#list) &mdash; Lists unique dimensions for metrics.
- [`list dimension-values`](#list-dimension-values) &mdash; List dimensions with metrics.
- [`list entities`](#list-entities) &mdash; Lists all unique entities.
- [`validate-configs`](#validate-configs) &mdash; Validates semantic model configurations.
- [`health-checks`](#health-checks) &mdash; Performs data platform health check.
- [`tutorial`](#tutorial) &mdash; Dedicated MetricFlow tutorial to help get you started.
- [`query`](#query) &mdash; Query metrics and dimensions you want to see in the command line interface. Refer to [query examples](#query-examples) to help you get started.
  
</TabItem>
</Tabs>

### List

This command retrieves metadata values related to [Metrics](/docs/build/metrics-overview), [Dimensions](/docs/build/dimensions), and [Entities](/docs/build/entities) values. 


### List metrics

```bash
dbt sl list # In dbt Cloud
mf list # In dbt Core
```
This command lists the metrics with their available dimensions:

```bash
dbt sl list metrics <metric_name> # In dbt Cloud

mf list metrics <metric_name> # In dbt Core

Options:
  --search TEXT          Filter available metrics by this search term
  --show-all-dimensions  Show all dimensions associated with a metric.
  --help                 Show this message and exit.
```

### List dimensions

This command lists all unique dimensions for a metric or multiple metrics. It displays only common dimensions when querying multiple metrics:

```bash
dbt sl list dimensions --metrics <metric_name> # In dbt Cloud

mf list dimensions --metrics <metric_name> # In dbt Core

Options:
  --metrics SEQUENCE  List dimensions by given metrics (intersection). Ex. --metrics bookings,messages
  --help              Show this message and exit.
```

### List dimension-values

This command lists all dimension values with the corresponding metric:

```bash
dbt sl list dimension-values --metrics <metric_name> --dimension <dimension_name> # In dbt Cloud

mf list dimension-values --metrics <metric_name> --dimension <dimension_name> # In dbt Core

Options:
  --dimension TEXT    Dimension to query values from  [required]
  --metrics SEQUENCE  Metrics that are associated with the dimension
                      [required]
  --end-time TEXT     Optional iso8601 timestamp to constraint the end time of
                      the data (inclusive)
                      *Not available in dbt Cloud yet
  --start-time TEXT   Optional iso8601 timestamp to constraint the start time
                      of the data (inclusive)
                      *Not available in dbt Cloud yet
  --help              Show this message and exit.
```

### List entities

This command lists all unique entities:

```bash
dbt sl list entities --metrics <metric_name> # In dbt Cloud 

mf list entities --metrics <metric_name> # In dbt Core

Options:
  --metrics SEQUENCE  List entities by given metrics (intersection). Ex. --metrics bookings,messages
  --help              Show this message and exit.
```

### List saved queries

This command lists all available saved queries:

```bash
dbt sl list saved-queries
```

You can also add the `--show-exports` flag (or option) to show each export listed under a saved query:

```bash
dbt sl list saved-queries --show-exports
```

**Output**

```bash
dbt sl list saved-queries --show-exports

The list of available saved queries:
- new_customer_orders
  exports:
       - Export(new_customer_orders_table, exportAs=TABLE)
       - Export(new_customer_orders_view, exportAs=VIEW)
       - Export(new_customer_orders, alias=orders, schemas=customer_schema, exportAs=TABLE)
```

### Validate-configs

The following command performs validations against the defined semantic model configurations.

Note, in dbt Cloud you don't need to validate the Semantic Layer config separately. Running a dbt command (such as `dbt parse`, `dbt build`, `dbt compile`, `dbt run`) automatically checks it.

```bash

mf validate-configs # In dbt Core

Options:
  --dw-timeout INTEGER            Optional timeout for data warehouse
                                  validation steps. Default None.
  --skip-dw                       If specified, skips the data warehouse
                                  validations
  --show-all                      If specified, prints warnings and future-
                                  errors
  --verbose-issues                If specified, prints any extra details
                                  issues might have
  --semantic-validation-workers INTEGER
                                  Optional. Uses the number of workers
                                  specified to run the semantic validations.
                                  Should only be used for exceptionally large
                                  configs
  --help                          Show this message and exit.
```

### Health checks

The following command performs a health check against the data platform you provided in the configs. 

Note, in dbt Cloud the `health-checks` command isn't required since it uses dbt Cloud's credentials to perform the health check.

```bash
mf health-checks # In dbt Core
```

### Tutorial

Follow the dedicated MetricFlow tutorial to help you get started:
<!--dbt sl tutorial # In dbt Cloud-->

```bash
mf tutorial # In dbt Core
```

### Query

Create a new query with MetricFlow and execute it against your data platform. The query returns the following result:

```bash
dbt sl query --metrics <metric_name> --group-by <dimension_name> # In dbt Cloud 
dbt sl query --saved-query <name> # In dbt Cloud CLI

mf query --metrics <metric_name> --group-by <dimension_name> # In dbt Core

Options:

  --metrics SEQUENCE       Syntax to query single metrics: --metrics metric_name
                           For example, --metrics bookings
                           To query multiple metrics, use --metrics followed by the metric names, separated by commas without spaces.
                           For example,  --metrics bookings,messages

  --group-by SEQUENCE      Syntax to group by single dimension/entity: --group-by dimension_name
                           For example, --group-by ds
                           For multiple dimensions/entities, use --group-by followed by the dimension/entity names, separated by commas without spaces.
                           For example, --group-by ds,org
                           

  --end-time TEXT          Optional iso8601 timestamp to constraint the end
                           time of the data (inclusive).
                           *Not available in dbt Cloud yet 

  --start-time TEXT        Optional iso8601 timestamp to constraint the start
                           time of the data (inclusive)
                           *Not available in dbt Cloud yet

  --where TEXT             SQL-like where statement provided as a string and wrapped in quotes: --where "condition_statement"
                           For example, to query a single statement: --where "revenue > 100"
                           To query multiple statements: --where "revenue > 100 and user_count < 1000"
                           To add a dimension filter to a where filter, ensure the filter item is part of your model. 
                           Refer to the [FAQ](#faqs) for more info on how to do this using a template wrapper.

  --limit TEXT             Limit the number of rows out using an int or leave
                           blank for no limit. For example: --limit 100

  --order-by SEQUENCE     Specify metrics, dimension, or group bys to order by.
                          Add the `-` prefix to sort query in descending (DESC) order. 
                          Leave blank for ascending (ASC) order.
                          For example, to sort metric_time in DESC order: --order-by -metric_time 
                          To sort metric_time in ASC order and revenue in DESC order:  --order-by metric_time,-revenue

  --csv FILENAME           Provide filepath for data frame output to csv

 --compile (dbt Cloud)    In the query output, show the query that was
 --explain (dbt Core)     executed against the data warehouse         
                           

  --show-dataflow-plan     Display dataflow plan in explain output

  --display-plans          Display plans (such as metric dataflow) in the browser

  --decimals INTEGER       Choose the number of decimal places to round for
                           the numerical values

  --show-sql-descriptions  Shows inline descriptions of nodes in displayed SQL

  --help                   Show this message and exit.
  ```


### Query examples

The following tabs present various types of query examples that you can use to query metrics and dimensions. Select the tab that best suits your needs:

<Tabs>

<TabItem value="eg1" label="Metrics">

Use the example to query multiple metrics by dimension and return the `order_total` and `users_active` metrics by `metric_time.` 

**Query**
```bash
dbt sl query --metrics order_total,users_active --group-by metric_time # In dbt Cloud

mf query --metrics order_total,users_active --group-by metric_time # In dbt Core
```

**Result**
```bash
✔ Success 🦄 - query completed after 1.24 seconds
| METRIC_TIME   |   ORDER_TOTAL |
|:--------------|---------------:|
| 2017-06-16    |         792.17 |
| 2017-06-17    |         458.35 |
| 2017-06-18    |         490.69 |
| 2017-06-19    |         749.09 |
| 2017-06-20    |         712.51 |
| 2017-06-21    |         541.65 |
```
</TabItem>

<TabItem value="eg2" label="Dimensions">

You can include multiple dimensions in a query. For example, you can group by the `is_food_order` dimension to confirm if orders were for food or not. 

**Query**
```bash
dbt sl query --metrics order_total --group-by metric_time,is_food_order # In dbt Cloud

mf query --metrics order_total --group-by metric_time,is_food_order # In dbt Core
```

**Result**
```bash
 Success 🦄 - query completed after 1.70 seconds
| METRIC_TIME   | IS_FOOD_ORDER   |   ORDER_TOTAL |
|:--------------|:----------------|---------------:|
| 2017-06-16    | True            |         499.27 |
| 2017-06-16    | False           |         292.90 |
| 2017-06-17    | True            |         431.24 |
| 2017-06-17    | False           |          27.11 |
| 2017-06-18    | True            |         466.45 |
| 2017-06-18    | False           |          24.24 |
| 2017-06-19    | False           |         300.98 |
| 2017-06-19    | True            |         448.11 |
```

</TabItem>

<TabItem value="eg3" label="Order/limit">

You can add order and limit functions to filter and present the data in a readable format. The following query limits the data set to 10 records and orders them by `metric_time`, descending. Note that using the `-` prefix will sort the query in descending order. Without the `-` prefix sorts the query in ascending order.

**Query**
```bash
# In dbt Cloud 
dbt sl query --metrics order_total --group-by metric_time,is_food_order --limit 10 --order-by -metric_time 

# In dbt Core
mf query --metrics order_total --group-by metric_time,is_food_order --limit 10 --order-by -metric_time 
```

**Result**
```bash
✔ Success 🦄 - query completed after 1.41 seconds
| METRIC_TIME   | IS_FOOD_ORDER   |   ORDER_TOTAL |
|:--------------|:----------------|---------------:|
| 2017-08-31    | True            |         459.90 |
| 2017-08-31    | False           |         327.08 |
| 2017-08-30    | False           |         348.90 |
| 2017-08-30    | True            |         448.18 |
| 2017-08-29    | True            |         479.94 |
| 2017-08-29    | False           |         333.65 |
| 2017-08-28    | False           |         334.73 |
```
</TabItem>

<TabItem value="eg4" label="where clause">

You can further filter the data set by adding a `where` clause to your query. The following example shows you how to query the `order_total` metric, grouped by `metric_time` with multiple where statements (orders that are food orders and orders from the week starting on or after Feb 1st, 2024):

**Query**
```bash
# In dbt Cloud 
dbt sl query --metrics order_total --group-by metric_time --where "{{ Dimension('order_id__is_food_order') }} = True and metric_time__week >= '2024-02-01'"

# In dbt Core
mf query --metrics order_total --group-by metric_time --where "{{ Dimension('order_id__is_food_order') }} = True and metric_time__week >= '2024-02-01'" 
```

**Result**
```bash
 ✔ Success 🦄 - query completed after 1.06 seconds
| METRIC_TIME   | IS_FOOD_ORDER   |   ORDER_TOTAL |
|:--------------|:----------------|---------------:|
| 2017-08-31    | True            |         459.90 |
| 2017-08-30    | True            |         448.18 |
| 2017-08-29    | True            |         479.94 |
| 2017-08-28    | True            |         513.48 |
| 2017-08-27    | True            |         568.92 |
| 2017-08-26    | True            |         471.95 |
| 2017-08-25    | True            |         452.93 |
| 2017-08-24    | True            |         384.40 |
| 2017-08-23    | True            |         423.61 |
| 2017-08-22    | True            |         401.91 |
```

</TabItem>

<TabItem value="eg5" label=" Filter by time">

To filter by time, there are dedicated start and end time options. Using these options to filter by time allows MetricFlow to further optimize query performance by pushing down the where filter when appropriate. 


<!--
bash not support in cloud yet
# In dbt Cloud
dbt sl query --metrics order_total --group-by metric_time,is_food_order --limit 10 --order-by -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27' 
-->
**Query**
```bash
# In dbt Core
mf query --metrics order_total --group-by metric_time,is_food_order --limit 10 --order-by -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27' 
```

 **Result**
```bash
✔ Success 🦄 - query completed after 1.53 seconds
| METRIC_TIME   | IS_FOOD_ORDER   |   ORDER_TOTAL |
|:--------------|:----------------|---------------:|
| 2017-08-27    | True            |         568.92 |
| 2017-08-26    | True            |         471.95 |
| 2017-08-25    | True            |         452.93 |
| 2017-08-24    | True            |         384.40 |
| 2017-08-23    | True            |         423.61 |
| 2017-08-22    | True            |         401.91 |
```

</TabItem>

<TabItem value="eg6" label=" Saved queries">

You can use this for frequently used queries. Replace `<name>` with the name of your [saved query](/docs/build/saved-queries). 

**Query**
```bash
dbt sl query --saved-query <name> # In dbt Cloud

mf query --saved-query <name> # In dbt Core
```

For example, if you use dbt Cloud and have a saved query named `new_customer_orders`, you would run `dbt sl query --saved-query new_customer_orders`.

:::info A note on querying saved queries
When querying [saved queries](/docs/build/saved-queries), you can use parameters such as `where`, `limit`, `order`, `compile`, and so on. However, keep in mind that you can't access `metric` or `group_by` parameters in this context. This is because they are predetermined and fixed parameters for saved queries, and you can't change them at query time. If you would like to query more metrics or dimensions, you can build the query using the standard format.
:::

</TabItem>
</Tabs>

### Additional query examples

The following tabs present additional query examples, like exporting to a CSV. Select the tab that best suits your needs:

<Tabs>



<TabItem value="eg6" label="--compile/--explain flag">

Add `--compile` (or `--explain` for dbt Core users) to your query to view the SQL generated by MetricFlow. 

**Query**

```bash
# In dbt Cloud
dbt sl query --metrics order_total --group-by metric_time,is_food_order --limit 10 --order-by -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27' --compile

# In dbt Core
mf query --metrics order_total --group-by metric_time,is_food_order --limit 10 --order-by -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27' --explain
```

 **Result**
 ```bash
 ✔ Success 🦄 - query completed after 0.28 seconds
🔎 SQL (remove --compile to see data or add --show-dataflow-plan to see the generated dataflow plan):
SELECT
  metric_time
  , is_food_order
  , SUM(order_cost) AS order_total
FROM (
  SELECT
    cast(ordered_at as date) AS metric_time
    , is_food_order
    , order_cost
  FROM ANALYTICS.js_dbt_sl_demo.orders orders_src_1
  WHERE cast(ordered_at as date) BETWEEN CAST('2017-08-22' AS TIMESTAMP) AND CAST('2017-08-27' AS TIMESTAMP)
) subq_3
WHERE is_food_order = True
GROUP BY
  metric_time
  , is_food_order
ORDER BY metric_time DESC
LIMIT 10
```

</TabItem>

<TabItem value="eg7" label=" Export to CSV">

Add the `--csv file_name.csv` flag to export the results of your query to a csv.

**Query**

```bash
# In dbt Cloud
dbt sl query --metrics order_total --group-by metric_time,is_food_order --limit 10 --order-by -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27' --csv query_example.csv

# In dbt Core
mf query --metrics order_total --group-by metric_time,is_food_order --limit 10 --order-by -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27' --csv query_example.csv
```

**Result**
```bash
✔ Success 🦄 - query completed after 0.83 seconds
🖨 Successfully written query output to query_example.csv
```

</TabItem>
</Tabs>

### Time granularity

Optionally, you can specify the time granularity you want your data to be aggregated at by appending two underscores and the unit of granularity you want to `metric_time`, the global time dimension. You can group the granularity by: `day`, `week`, `month`, `quarter`, and `year`. 

Below is an example for querying metric data at a monthly grain:

```bash
dbt sl query --metrics revenue --group-by metric_time__month # In dbt Cloud

mf query --metrics revenue --group-by metric_time__month # In dbt Core
```

### Exports

Run [exports for a specific saved query](/docs/use-dbt-semantic-layer/exports#exports-for-single-saved-query). Use this command to test and generate exports in your development environment. You can also use the `--select` flag to specify particular exports from a saved query. Refer to [exports in development](/docs/use-dbt-semantic-layer/exports#exports-in-development) for more info. 

Exports is available in dbt Cloud.

```bash
dbt sl export 
```

### Export-all

Run [exports for multiple saved queries](/docs/use-dbt-semantic-layer/exports#exports-for-multiple-saved-queries) at once. This command provides a convenient way to manage and execute exports for several queries simultaneously, saving time and effort. Refer to [exports in development](/docs/use-dbt-semantic-layer/exports#exports-in-development) for more info. 

Exports is available in dbt Cloud.

```bash
dbt sl export-all 
```


## FAQs

<detailsToggle alt_header="How can I add a dimension filter to a where filter?">

To add a dimension filter to a where filter, you have to indicate that the filter item is part of your model and use a template wrapper: `{{Dimension('primary_entity__dimension_name')}}`.

Here's an example query: `dbt sl query --metrics order_total --group-by metric_time --where "{{Dimension('order_id__is_food_order')}} = True"`.

Before using the template wrapper, however, set up your terminal to escape curly braces for the filter template to work. 

<details> 
<summary>How to set up your terminal to escape curly braces? </summary>
 To configure your <code>.zshrc</code>profile to escape curly braces, you can use the <code>setopt</code> command to enable the <code>BRACECCL</code> option. This option will cause the shell to treat curly braces as literals and prevent brace expansion. Refer to the following steps to set it up: <br />

1. Open your terminal.
2. Open your <code>.zshrc</code> file using a text editor like <code>nano</code>, <code>vim</code>, or any other text editor you prefer. You can use the following command to open it with <code>nano</code>:

```bash
nano ~/.zshrc
```
3. Add the following line to the file:

```bash
setopt BRACECCL
```
4. Save and exit the text editor (in `nano`, press Ctrl + O to save, and Ctrl + X to exit).

5. Source your <code>.zshrc</code> file to apply the changes:

```bash
source ~/.zshrc
```

6. After making these changes, your Zsh shell will treat curly braces as literal characters and will not perform brace expansion. This means that you can use curly braces without worrying about unintended expansions.

Keep in mind that modifying your shell configuration files can have an impact on how your shell behaves. If you're not familiar with shell configuration, it's a good idea to make a backup of your <code>.zshrc</code> file before making any changes. If you encounter any issues or unexpected behavior, you can revert to the backup.

</details>

</detailsToggle>

<detailsToggle alt_header="Why is my query limited to 100 rows in the dbt Cloud CLI?">

The default `limit` for query issues from the dbt Cloud CLI is 100 rows. We set this default to prevent returning unnecessarily large data sets as the dbt Cloud CLI is typically used to query the dbt Semantic Layer during the development process, not for production reporting or to access large data sets. For most workflows, you only need to return a subset of the data.

However, you can change this limit if needed by setting the `--limit` option in your query. For example, to return 1000 rows, you can run `dbt sl list metrics --limit 1000`.

</detailsToggle>

<detailsToggle alt_header="How can I query multiple metrics, group bys, or where statements?">

To query multiple metrics, group bys, or where statements in your command, follow this guidance:

- To query multiple metrics and group bys, use the `--metrics` or `--group-by` syntax followed by the metric or dimension/entity names, separated by commas without spaces:
  - Multiple metrics example: `dbt sl query --metrics accounts_active,users_active`
  - Multiple dimension/entity example: `dbt sl query --metrics accounts_active,users_active --group-by metric_time__week,accounts__plan_tier`
 
- To query multiple where statements, use the `--where` syntax and wrap the statement in quotes:
  - Multiple where statement example: `dbt sl query --metrics accounts_active,users_active --group-by metric_time__week,accounts__plan_tier --where "metric_time__week >= '2024-02-01' and accounts__plan_tier = 'coco'"`

</detailsToggle>

<detailsToggle alt_header="How can I sort my query in ascending or descending order?">

When you query metrics, use `--order-by` to specify metrics or groupings to order by. The `order_by` option applies to metrics, dimensions, and group bys. 

Add the `-` prefix to sort your query in descending (DESC) order. Leave blank for ascending (ASC) order:

- For example, to query a metric and sort `metric_time` in descending order, run `dbt sl query --metrics order_total --group-by metric_time --order-by -metric_time`. Note that the `-` prefix in `-metric_time` sorts the query in descending order.
- To query a metric and sort `metric_time` in ascending order and `revenue` in descending order, run `dbt sl query --metrics order_total --order-by metric_time,-revenue`. Note that `metric_time` without a prefix is sorted in ascending order and `-revenue` with a `-` prefix sorts the query in descending order.

</detailsToggle>

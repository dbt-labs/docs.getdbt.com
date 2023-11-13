---
title: MetricFlow commands
id: metricflow-commands
description: "Query metrics and metadata in your dbt project with the MetricFlow commands."
sidebar_label: "MetricFlow commands"
tags: [Metrics, Semantic Layer]
---

Once you define metrics in your dbt project, you can query metrics, dimensions, and dimension values, and validate your configs using the MetricFlow commands. 

MetricFlow allows you to define and query metrics in your dbt project in the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation), [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud), or [dbt Core](/docs/core/installation). To experience the power of the universal [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) and dynamically query those metrics in downstream tools, you'll need a dbt Cloud [Team or Enterprise](https://www.getdbt.com/pricing/) account. 

MetricFlow is compatible with Python versions 3.8, 3.9, 3.10, and 3.11.


## MetricFlow

MetricFlow is a dbt package that allows you to define and query metrics in your dbt project. You can use MetricFlow to query metrics in your dbt project in the dbt Cloud CLI, dbt Cloud IDE, or dbt Core.

**Note** &mdash; MetricFlow commands aren't supported in dbt Cloud jobs yet. However, you can add MetricFlow validations with your git provider (such as GitHub Actions) by installing MetricFlow (`pip install metricflow`). This allows you to run MetricFlow commands as part of your continuous integration checks on PRs.

<Tabs>

<TabItem value="cloudcli" label="dbt Cloud CLI">

MetricFlow commands are embedded in the dbt Cloud CLI, which means you can immediately run them once you install the dbt Cloud CLI. 

A benefit to using the dbt Cloud is that you won't need to manage versioning &mdash; your dbt Cloud account will automatically manage the versioning.

</TabItem>

<TabItem value="cloud ide" label="dbt Cloud IDE">

:::info
You can create metrics using MetricFlow in the dbt Cloud IDE. However, support for running MetricFlow commands in the IDE will be available soon.
:::

A benefit to using the dbt Cloud is that you won't need to manage versioning &mdash; your dbt Cloud account will automatically manage the versioning.

</TabItem>

<TabItem value="core" label="dbt Core">


:::info Use dbt Cloud CLI for semantic layer development

Use the dbt Cloud CLI for the experience in defining and querying metrics in your dbt project on dbt Cloud or dbt Core with MetricFlow. 

A benefit to using the dbt Cloud is that you won't need to manage versioning &mdash; your dbt Cloud account will automatically manage the versioning.
:::


You can install [MetricFlow](https://github.com/dbt-labs/metricflow#getting-started) from [PyPI](https://pypi.org/project/dbt-metricflow/). You need to use `pip` to install MetricFlow on Windows or Linux operating systems:

1. Create or activate your virtual environment `python -m venv venv`
2. Run `pip install dbt-metricflow`
  * You can install MetricFlow using PyPI as an extension of your dbt adapter in the command line. To install the adapter, run `pip install "dbt-metricflow[your_adapter_name]"` and add the adapter name at the end of the command. For example, for a Snowflake adapter run `pip install "dbt-metricflow[snowflake]"`

**Note**, you'll need to manage versioning between dbt Core, your adapter, and MetricFlow.

</TabItem>

</Tabs>

Something to note, MetricFlow `mf` commands return an error if you have a Metafont latex package installed. To run `mf` commands, uninstall the package.

## MetricFlow commands

MetricFlow provides the following commands to retrieve metadata and query metrics. 

<Tabs>
<TabItem value="cloud" label="Commands for dbt Cloud">

Use the `dbt sl` prefix before the command name to execute them in dbt Cloud. For example, to list all metrics, run `dbt sl list metrics`. 

- [`list`](#list) &mdash; Retrieves metadata values.
- [`list metrics`](#list-metrics) &mdash; Lists metrics with dimensions.
- [`list dimensions`](#list) &mdash; Lists unique dimensions for metrics.
- [`list dimension-values`](#list-dimension-values) &mdash; List dimensions with metrics.
- [`list entities`](#list-entities) &mdash; Lists all unique entities.
- [`query`](#query) &mdash; Query metrics and dimensions you want to see in the command line interface. Refer to [query examples](#query-examples) to help you get started.

<!--below commands aren't supported in dbt cloud yet
- [`validate-configs`](#validate-configs) &mdash; Validates semantic model configurations.
- [`health-checks`](#health-checks) &mdash; Performs data platform health check.
- [`tutorial`](#tutorial) &mdash; Dedicated MetricFlow tutorial to help get you started.
-->

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

## List dimension-values

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
  --start-time TEXT   Optional iso8601 timestamp to constraint the start time
                      of the data (inclusive)
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

Create a new query with MetricFlow, execute that query against the user's data platform, and return the result:

```bash
dbt sl query --metrics <metric_name> --group-by <dimension_name> # In dbt Cloud 

mf query --metrics <metric_name> --group-by <dimension_name> # In dbt Core

Options:

  --metrics SEQUENCE       Metrics to query for: syntax is --metrics bookings
                           or for multiple metrics --metrics bookings, messages.

  --group-by SEQUENCE      Dimensions and/or entities to group by: syntax is
                           --group-by ds or for multiple group bys --group-by
                           ds, org.

  --end-time TEXT          Optional iso8601 timestamp to constraint the end
                           time of the data (inclusive)

  --start-time TEXT        Optional iso8601 timestamp to constraint the start
                           time of the data (inclusive)

  --where TEXT             SQL-like where statement provided as a string. For
                           example: --where "revenue > 100". To add a dimension filter to 
                           a where filter, you have to indicate that the filter item is part of your model. 
                           Refer to the [FAQ](#faqs) for more info on how to do this using a template wrapper.

  --limit TEXT             Limit the number of rows out using an int or leave
                           blank for no limit. For example: --limit 100

  --order SEQUENCE         Metrics or group bys to order by ("-" prefix for
                           DESC). For example: --order -ds or --order
                           ds,-revenue

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

The following tabs present various different types of query examples that you can use to query metrics and dimensions. Select the tab that best suits your needs:

<Tabs>

<TabItem value="eg1" label="Metrics">

Use the example to query metrics by dimension and return the `order_total` metric by `metric_time.` 

**Query**
```bash
dbt sl query --metrics order_total --group-by metric_time # In dbt Cloud

mf query --metrics order_total --group-by metric_time # In dbt Core
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
dbt sl query --metrics order_total --group-by metric_time, is_food_order # In dbt Cloud

mf query --metrics order_total --group-by metric_time, is_food_order # In dbt Core
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

You can add order and limit functions to filter and present the data in a readable format. The following query limits the data set to 10 records and orders them by `metric_time`, descending.

**Query**
```bash
# In dbt Cloud 
dbt sl query --metrics order_total --group-by metric_time,is_food_order --limit 10 --order -metric_time 

# In dbt Core
mf query --metrics order_total --group-by metric_time,is_food_order --limit 10 --order -metric_time 
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

You can further filter the data set by adding a `where` clause to your query.

**Query**

```bash
# In dbt Cloud 
dbt sl query --metrics order_total --group-by metric_time --where "{{ Dimension('order_id__is_food_order') }} = True" 

# In dbt Core
mf query --metrics order_total --group-by metric_time --where "{{ Dimension('order_id__is_food_order') }} = True" 
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

**Query**
```bash

# In dbt Cloud
dbt sl query --metrics order_total --group-by metric_time,is_food_order --limit 10 --order -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27' 

# In dbt Core
mf query --metrics order_total --group-by metric_time,is_food_order --limit 10 --order -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27' 
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


</Tabs>


### Additional query examples

The following tabs present additional query examples, like exporting to a CSV. Select the tab that best suits your needs:

<Tabs>



<TabItem value="eg6" label="--compile/--explain flag">

Add `--compile` (or `--explain` for dbt Core users) to your query to view the SQL generated by MetricFlow. 

**Query**

```bash
# In dbt Cloud
dbt sl query --metrics order_total --group-by metric_time,is_food_order --limit 10 --order -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27' --compile

# In dbt Core
mf query --metrics order_total --group-by metric_time,is_food_order --limit 10 --order -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27' --explain
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
dbt sl query --metrics order_total --group-by metric_time,is_food_order --limit 10 --order -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27' --csv query_example.csv

# In dbt Core
mf query --metrics order_total --group-by metric_time,is_food_order --limit 10 --order -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27' --csv query_example.csv
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

## FAQs

<details>
<summary>How can I add a dimension filter to a where filter?</summary> 

To add a dimension filter to a where filter, you have to indicate that the filter item is part of your model and use a template wrapper: <code>{{Dimension('primary_entity__dimension_name')}}</code>. 

Here's an example query: <code>dbt sl query --metrics order_total --group-by metric_time --where "{{Dimension('order_id__is_food_order')}} = True"</code>.<br /><br /> Before using the template wrapper, however, set up your terminal to escape curly braces for the filter template to work. 

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

</details>


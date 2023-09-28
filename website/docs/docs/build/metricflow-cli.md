---
title: MetricFlow CLI
id: metricflow-cli
description: "Query metrics and metadata in your dbt project with the metricflow cli"
sidebar_label: "MetricFlow CLI commands"
tags: [Metrics, Semantic Layer]
---

Once you define metrics in your dbt project, you can query metrics, dimensions, dimension values, and validate your configs using the MetricFlow command line (CLI).

# Installation

You can install the [MetricFlow CLI](https://github.com/dbt-labs/metricflow#getting-started) from [PyPI](https://pypi.org/project/dbt-metricflow/). You need to use `pip` to install the MetricFlow CLI on Windows or Linux operating systems:

1. Create or activate your virtual environment.`python -m venv venv`
2. Run `pip install dbt-metricflow`

  * You can install MetricFlow using PyPI as an extension of your dbt adapter in the CLI. To install the adapter, run `pip install "dbt-metricflow[your_adapter_name]"` and add the adapter name at the end of the command. For example, for a Snowflake adapter run `pip install "dbt-metricflow[snowflake]"`

The MetricFlow CLI is compatible with Python versions 3.8, 3.9, 3.10 and 3.11

# CLI commands

The MetricFlow CLI provides the following commands to retrieve metadata and query metrics. 

To execute the commands, use the `mf` prefix before the command name. For example, to list all metrics, run `mf list metrics`:

- [`list`](#list) &mdash; Retrieves metadata values.
- [`list metrics`](#list-metrics) &mdash; Lists metrics with dimensions.
- [`list dimensions`](#list) &mdash; Lists unique dimensions for metrics.
- [`list dimension-values`](#list-dimension-values) &mdash; List dimensions with metrics.
- [`list entities`](#list-entities) &mdash; Lists all unique entities.
- [`validate-configs`](#validate-configs) &mdash; Validates semantic model configurations.
- [`health-checks`](#health-checks) &mdash; Performs data platform health check.
- [`tutorial`](#tutorial) &mdash; Dedicated MetricFlow tutorial to help get you started.
- [`query`](#query) &mdash; Query metrics and dimensions you want to see in the CLI. Refer to [query examples](#query-examples) to help you get started.

## List

This command retrieves metadata values related to [Metrics](/docs/build/metrics-overview), [Dimensions](/docs/build/dimensions), and [Entities](/docs/build/entities) values. 


## List metrics

```bash
mf list 

This command lists the metrics with their available dimensions:

```bash
mf list metrics <metric_name>
Options:
  --search TEXT          Filter available metrics by this search term
  --show-all-dimensions  Show all dimensions associated with a metric.
  --help                 Show this message and exit.
```

## List dimensions

This command lists all unique dimensions for a metric or multiple metrics. It displays only common dimensions when querying multiple metrics:

```bash
mf list dimensions --metrics <metric_name>
Options:
  --metrics SEQUENCE  List dimensions by given metrics (intersection). Ex.
                      --metrics bookings,messages
  --help              Show this message and exit.
```

## List dimension-values

This command lists all dimension values with the corresponding metric:

```bash
mf list dimension-values --metrics <metric_name> --dimension <dimension_name>
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
## List entities

This command lists all unique entities:

```bash
mf list entities --metrics <metric_name>
Options:
  --metrics SEQUENCE  List entities by given metrics (intersection). Ex.
                      --metrics bookings,messages
  --help              Show this message and exit.
```

## Validate-configs

This command performs validations against the defined semantic model configurations:

```bash
mf validate-configs
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

## Health checks

This command performs a health check against the data platform you provided in the configs:

```bash
mf health-checks
```

## Tutorial

Follow the dedicated MetricFlow tutorial to help you get started:

```bash
mf tutorial
```

## Query

Create a new query with MetricFlow, execute that query against the user's data platform, and return the result:

```bash
mf query --metrics <metric_name> --group-by <dimension_name>

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

  --explain                In the query output, show the query that was
                           executed against the data warehouse

  --show-dataflow-plan     Display dataflow plan in explain output

  --display-plans          Display plans (such as metric dataflow) in the browser

  --decimals INTEGER       Choose the number of decimal places to round for
                           the numerical values

  --show-sql-descriptions  Shows inline descriptions of nodes in displayed SQL

  --help                   Show this message and exit.
  ```


## Query examples

The following tabs present various different types of query examples that you can use to query metrics and dimensions. Select the tab that best suits your needs:

<Tabs>

<TabItem value="eg1" label="Metrics">

Use the example to query metrics by dimension and return the `order_total` metric by `metric_time.` 

**Query**
```bash
mf query --metrics order_total --group-by metric_time
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
mf query --metrics order_total --group-by metric_time, is_food_order
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
mf query --metrics order_total --group-by metric_time --where "{{Dimension('order_id__is_food_order')}} = True"
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



<TabItem value="eg6" label="--explain flag">

Add `--explain` to your query to view the SQL generated by MetricFlow. 

**Query**

```bash
 mf query --metrics order_total --group-by metric_time,is_food_order --limit 10 --order -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27' --explain
```

 **Result**
 ```bash
 ✔ Success 🦄 - query completed after 0.28 seconds
🔎 SQL (remove --explain to see data or add --show-dataflow-plan to see the generated dataflow plan):
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
mf query --metrics order_total --group-by metric_time,is_food_order --limit 10 --order -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27' --csv query_example.csv
```

**Result**
```bash
✔ Success 🦄 - query completed after 0.83 seconds
🖨 Successfully written query output to query_example.csv
```

</TabItem>
</Tabs>

## Time granularity

Optionally, you can specify the time granularity you want your data to be aggregated at by appending two underscores and the unit of granularity you want to `metric_time`, the global time dimension. You can group the granularity by: `day`, `week`, `month`, `quarter`, and `year`. 

Below is an example for querying metric data at a monthly grain:

```bash
mf query --metrics revenue --group-by metric_time__month
```

## FAQs

<details>
<summary>How can I add a dimension filter to a where filter?</summary> 

To add a dimension filter to a where filter, you have to indicate that the filter item is part of your model and use a template wrapper: <code>{{Dimension('primary_entity__dimension_name')}}</code>. 

Here's an example query: <code>mf query --metrics order_total --group-by metric_time --where "{{Dimension('order_id__is_food_order')}} = True"</code>.<br /><br /> Before using the template wrapper, however, you will need to set up your terminal to escape curly braces for the filter template to work. 

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

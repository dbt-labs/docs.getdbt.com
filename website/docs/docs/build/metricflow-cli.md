---
title: MetricFlow CLI
id: metricflow-cli
description: "Query metrics and metadata in your dbt project with the metricflow cli"
sidebar_label: "CLI"
tags: [Metrics, Semantic Layer]
---

After you have defined metrics in your dbt project, you can easily query metrics, dimensions, dimension values, and validate your configs using the MetricFlow CLI.

## Installation
1. Create or activate your virtual environment.`python -m venv venv`
2. Run `pip install dbt-metricflow`

## CLI commands

## List
Retrieve metadata values about metrics/dimensions/entities/dimension values

# List metrics
List the metrics with their available dimensions
```
mf list metrics <metric_name>
Options:
  --search TEXT          Filter available metrics by this search term
  --show-all-dimensions  Show all dimensions associated with a metric.
  --help                 Show this message and exit.
```

# List dimensions
List all unique dimensions for a metric or multiple metrics. Only common dimensions are shown if querying multiple metrics
```
mf list dimensions --metrics <metric_name>
Options:
  --metrics SEQUENCE  List dimensions by given metrics (intersection). Ex.
                      --metrics bookings,messages
  --help              Show this message and exit.
```

# List dimension-values
List all dimension values with the corresponding metric
```
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
# List entities
List all unique entities.
```
mf list entities --metrics <metric_name>
Options:
  --metrics SEQUENCE  List entities by given metrics (intersection). Ex.
                      --metrics bookings,messages
  --help              Show this message and exit.
```

## Validate configs
 Perform validations against the defined semantic model configurations.
```
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
Performs a health check against the DW provided in the configs.
```
mf health-checks
```

## Tutorial
Runs through a getting started tutorial. 

```
mf tutorial
```

## Query
Create a new query with MetricFlow, execute that query agaisnt the users data platform and return the result. 
```
mf query --metrics <metric_name> --group-by <dimension_name>
Options:
  --metrics SEQUENCE       Metrics to query for: syntax is --metrics bookings
                           or for multiple metrics --metrics bookings,messages
  --group-by SEQUENCE      Dimensions and/or entities to group by: syntax is
                           --group-by ds or for multiple group bys --group-by
                           ds,org
  --end-time TEXT          Optional iso8601 timestamp to constraint the end
                           time of the data (inclusive)
  --start-time TEXT        Optional iso8601 timestamp to constraint the start
                           time of the data (inclusive)
  --where TEXT             SQL-like where statement provided as a string. For
                           example: --where "revenue > 100"
  --limit TEXT             Limit the number of rows out using an int or leave
                           blank for no limit. For example: --limit 100
  --order SEQUENCE         Metrics or group bys to order by ("-" prefix for
                           DESC). For example: --order -ds or --order
                           ds,-revenue
  --csv FILENAME           Provide filepath for dataframe output to csv
  --explain                In the query output, show the query that was
                           executed against the data warehouse
  --show-dataflow-plan     Display dataflow plan in explain output
  --display-plans          Display plans (e.g. metric dataflow) in the browser
  --decimals INTEGER       Choose the number of decimal places to round for
                           the numerical values
  --show-sql-descriptions  Shows inline descriptions of nodes in displayed SQL
  --help                   Show this message and exit.
  ```


## Query Examples

Query metrics by dimensions.

The following query will retrun the order_amount metric by metric time. 
```
mf query --metrics order_amount --group-by metric_time
✔ Success 🦄 - query completed after 1.24 seconds
| METRIC_TIME   |   ORDER_AMOUNT |
|:--------------|---------------:|
| 2017-06-16    |         792.17 |
| 2017-06-17    |         458.35 |
| 2017-06-18    |         490.69 |
| 2017-06-19    |         749.09 |
| 2017-06-20    |         712.51 |
| 2017-06-21    |         541.65 |
```

You can include multiple dimensions in a query. For example, we can also group by the `is_food_order` dimension to see if orders we're for food or not. 

```
mf query --metrics order_amount --group-by metric_time, is_food_order
 Success 🦄 - query completed after 1.70 seconds
| METRIC_TIME   | IS_FOOD_ORDER   |   ORDER_AMOUNT |
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

You can add order and limit functions to filter and present the data in a readable format. The following query limits the data set to 10 records, and orders by metric time descending. 

```
mf query --metrics order_amount --group-by metric_time,is_food_order --limit 10 --order -metric_time
✔ Success 🦄 - query completed after 1.41 seconds
| METRIC_TIME   | IS_FOOD_ORDER   |   ORDER_AMOUNT |
|:--------------|:----------------|---------------:|
| 2017-08-31    | True            |         459.90 |
| 2017-08-31    | False           |         327.08 |
| 2017-08-30    | False           |         348.90 |
| 2017-08-30    | True            |         448.18 |
| 2017-08-29    | True            |         479.94 |
| 2017-08-29    | False           |         333.65 |
| 2017-08-28    | False           |         334.73 |
```

You can futher filter the data set by adding a where clause to your query.

```
 mf query --metrics order_amount --group-by metric_time,is_food_order --limit 10 --order -metric_time --where "is_food_order = True"
 ✔ Success 🦄 - query completed after 1.06 seconds
| METRIC_TIME   | IS_FOOD_ORDER   |   ORDER_AMOUNT |
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

To filter by time, there are dedicated start and end time options. Using these options to filter by time allows MetricFlow to further optimize query performance by pushing down the where filter when appropriate. 

```
 mf query --metrics order_amount --group-by metric_time,is_food_order --limit 10 --order -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27'
✔ Success 🦄 - query completed after 1.53 seconds
| METRIC_TIME   | IS_FOOD_ORDER   |   ORDER_AMOUNT |
|:--------------|:----------------|---------------:|
| 2017-08-27    | True            |         568.92 |
| 2017-08-26    | True            |         471.95 |
| 2017-08-25    | True            |         452.93 |
| 2017-08-24    | True            |         384.40 |
| 2017-08-23    | True            |         423.61 |
| 2017-08-22    | True            |         401.91 |
```

You can see the SQL metricflow is generating by adding --explain to your query. 

```
 mf query --metrics order_amount --group-by metric_time,is_food_order --limit 10 --order -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27' --explain
 ✔ Success 🦄 - query completed after 0.28 seconds
🔎 SQL (remove --explain to see data or add --show-dataflow-plan to see the generated dataflow plan):
SELECT
  metric_time
  , is_food_order
  , SUM(order_cost) AS order_amount
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
To export the results of your query to a csv, simply add the `--csv file_name.csv` flag.

```
mf query --metrics order_amount --group-by metric_time,is_food_order --limit 10 --order -metric_time --where "is_food_order = True" --start-time '2017-08-22' --end-time '2017-08-27' --csv query_example.csv
✔ Success 🦄 - query completed after 0.83 seconds
🖨 Successfully written query output to query_example.csv
```
---
title: dbt Semantic Layer cookbook recipes
id: "sl-cookbook"
description: "These cookbook recipes are a collection of scenario-based, real-world examples for building with the dbt Semantic Layer."
displayText: Cookbook recipes offer practical, scenario-based examples for semantic models and metrics with the dbt Semantic Layer.
hoverSnippet: Read a collection of scenario-based, real-world examples for building metrics and semantic models with the dbt Semantic Layer.
# time_to_complete: '30 minutes' commenting out until we test
hide_table_of_contents: true
icon: 'guides'
tags: ['Semantic Layer','dbt Cloud', 'Cookbook recipe']
level: 'Intermediate'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Introduction
These cookbook recipes are a collection of scenario-based, real-world examples for building with the dbt Semantic Layer. They provide practical guidance on how to define semantic models and metrics in dbt to track and report on key business metrics.

The recipes cover a range of use cases, including calculating active users, annual recurring revenue (ARR), and customer acquisition cost (CAC). Each recipe includes step-by-step instructions on how to define semantic models and metrics in dbt, as well as how to validate and query your metrics.

These recipes are designed to help you get started with the dbt Semantic Layer and cover the following:

- [How to calculate active users and active users WoW growth](#how-to-calculate-active-users-and-active-users-wow-growth)
- [How to calculate ARR using metrics](#how-to-calculate-arr-using-metrics)
- [How to calculate CAC using metrics](#how-to-calculate-cac-using-metrics)
- [How to join multiple fact metrics](#how-tojoin-multiple-fact-metrics)
- [How to test your metrics](#how-to-test-your-metrics)

<!-- Cookbook 1 -->

## How to calculate active users and active users WoW growth

Use this cookbook recipe to understand how to calculate “Active users” and “Active users (Week-over-Week growth (WoW) growth), as well as other time-related attributes in a database with dbt using YAML configurations.

- [Objectives](#objectives)
- [Use case](#use-case)
- [Step 1: Define semantic models](#step-1-define-semantic-models)
- [Step 2: Create metrics](#step-2-create-metrics)
- [Step 3: Test your metrics](#step-3-test-your-metrics)

### Objectives

- Understand how to configure and use semantic models in dbt to track and report daily user activity.
- Learn how to define and calculate metrics for active users and their WoW growth. As well as utility models for fiscal periods and other date-related flags.

### Use case

Track and analyze user activity on a daily basis, including page views, time-on-site, and other key metrics. This helps in monitoring user engagement and understanding trends over time.

:::tip
💡 Note that we’re using the [parallel subfolder approach](/best-practices/how-we-build-our-metrics/semantic-layer-7-semantic-structure#files-and-folders) for better organization in large projects, which means you’re creating a semantic model folder containing all your semantic layer code. 

Alternatively, you can use the [one-YAML-per-marts-model approach](/best-practices/how-we-build-our-metrics/semantic-layer-7-semantic-structure#files-and-folders) which puts documentation, data tests, unit tests, semantic models, and metrics into a unified file corresponding to a dbt-modeled mart.
:::

### Step 1: **Define semantic models**
1. Create a YAML file under the `semantic_models` folder: (`models/semantic_models/sem_user_activity_daily.yml`) to create a [semantic model](/docs/build/semantic-models) that tracks daily user activity. 
   This semantic model refs the `fct_user_activity_daily` model.

   Note that if you’re using the one-YAML-file-per-mart, then save this as `user_activity_daily.yml` under the models folder.

    <File name="models/semantic_models/sem_user_activity_daily.yml">

    ```yaml
    semantic_models:
      - name: sem_user_activity_daily
        description: |
          This model reports on daily user activity. Activity is broken down into
          pageview + time-on-site metrics for each use case that is addressed in
          dbt Cloud (ie. Deployment and Development)
        model: ref('fct_user_activity_daily')
        defaults:
          agg_time_dimension: date_day
    ```
    </File>

2. Add the following YAML configurations in that same semantic model file:
   - [`entities`](/docs/build/entities) to define user-related entities (such as `user` or `user_daily`)
   - [`dimensions`](/docs/build/dimensions) to specify time dimensions (such as `date_day`)
   - [`measures`](/docs/build/measures) for a distinct count of active users (`count_activity_users`) aggregated by day. 
  <br />
    <File name="models/semantic_models/sem_user_activity_daily.yml">

    ```yaml
    semantic_models:
  - name: sem_user_activity_daily
    description: >
      This model reports on daily user activity. Activity is broken down into
      pageview + time-on-site metrics for each use case that is addressed in
      dbt Cloud (ie. Deployment and Development)
    model: ref('fct_user_activity_daily')
    defaults:
      agg_time_dimension: date_day
      
    # Newly added blocks below 

    entities:
    #--- user entities
      - name: user_daily
        type: primary
        expr: user_activity_daily_id
      - name: user
        type: foreign
        expr: user_id
      #--- util entities
      - name: date
        type: foreign
        expr: date_day

    dimensions:
      - name: date_day
        type: time
        type_params:
          time_granularity: day
      - name: t7d_usage
        type: categorical

    measures:
      - name: count_activity_users
        description: >
          Distinct count of users via `fct_user_activity_daily`.
          To be used in metrics related to User-level activities
          (e.g. Active Users)
        agg: count_distinct
        expr: user_id
        agg_time_dimension: date_day

    ```
    </File>

3. Create another semantic model YAML file (`models/semantic_models/sem_all_days.yml`). This semantic model captures company-specific fiscal periods and date flags (like `fiscal_quarter`).
   It helps in managing fiscal dates and other time-related dimensions.

    <File name="models/semantic_models/sem_all_days.yml">

    ```yaml
    - name: sem_all_days
        description: |
          Utility semantic model to bring in company-specific fiscal quarter and fiscal year, or date flags such as `is_end_of_week` or `is_end_of_fiscal_quarter`.
        model: ref('all_days')
        defaults:
          agg_time_dimension: date_day

        entities:
          - name: date
            type: primary
            expr: date_day
          - name: date_month
            type: foreign
            expr: month_start_date

        dimensions:
          - name: date_day
            type: time
            type_params:
              time_granularity: day
          - name: date_month
            type: time
            type_params:
              time_granularity: month
          - name: fiscal_quarter
            type: categorical
          - name: fiscal_year
            type: categorical
          - name: is_end_of_week
            type: categorical
          - name: is_yesterday
            type: categorical
    ```
    </File>

### Step 2: Create metrics

1. Create a YAML file under the `metrics` folder: (`models/metrics/sem_user_activity_daily.yml`) to create a [metric](/docs/build/build-metrics-intro) that tracks active users. 
   Note that if you’re using the one-YAML-file-per-mart, then save this as `active_users.yml` under the models folder.

    <File name="models/metrics/sem_user_activity_daily.yml">

    ```yaml
    metrics:
      - name: users_active
        label: 'Users: active'
        description: >
          Users are considered active when they reach:
          - at least 3+ actions in the week
          - in a given reporting period (weekly or monthly)
          
          **Use-case:**
          **Time Aggregations:** Weekly, Monthly
          - This is helpful for reporting counts for the current/unfinished week because we base this metric on the trailing 7 _complete_ days.
          - For example: if you query this metric on Friday, it'll look at the count based on Wed (last week) to Thurs (this week). Numbers can shift once the week is fully complete.
        type: simple
        type_params:
          measure: count_users
        filter: |
          {{ Dimension('user_daily__t7d_usage') }} >= 3 and
          (
            {{ Dimension('date__is_end_of_week') }} = True or
            {{ Dimension('date__is_yesterday') }} = True
          )
        
      - name: users_active_wow_growth
        label: 'Users: active (% WoW growth)'
        type: derived
        type_params:
          expr: div0(users_active,users_active_lw) - 1
          metrics: 
            - name: users_active
              offset_window: 7 days
              alias: users_active_lw
            - name: users_active
    ```
    </File>

### Step 3: Test your metrics

After saving your new or updated metric, try the following process in your development tool to test your metrics:

1. Rebuild your `semantic_manifest.json` file to ensure that your new metrics are included in the manifest. Run the following command:

    ```bash
    dbt parse
    ```
    
    If you see an error where the metric doesn't exist, it could be because you were developing on a separate branch and then switched back to this one so the manifest is different. If so, then use the `--no-defer` flag
    
      ```bash
      dbt parse --no-defer
      ```

2. Query your metrics to confirm the results are as expected. Run the following command:

    ```bash
    dbt sl query --metrics users_active,users_active_wow_growth --group-by metric_time__week --where "metric_time__week >= '2023-01-01'" --order-by metric_time__week
    ```

3. If the results looks different than your "source of truth", then look at the compiled code. Run the following command:
 
    ```bash
    dbt sl query --metrics users_active,users_active_wow_growth --group-by metric_time__week --where "metric_time__week >= '2023-01-01'" --order-by metric_time__week --compile
    ```

<!-- Cookbook 2 -->

## How to calculate ARR using metrics

Use this cookbook recipe to understand how to calculate [annual recurring revenue (ARR)](https://en.wikipedia.org/wiki/Revenue_stream) using derived metrics in dbt, specifically leveraging the monthly recurring revenue (MRR) metric.

- [Objectives](#objectives-1)
- [Use cases](#use-case-1)
- [Step 1: Define semantic models](#step-1-define-semantic-models-1)
- [Step 2: Define ARR metrics](#step-2-define-the-arr-metric)
- [Step 3: Validate and query your metrics](#step-3-validate-and-query-metric)

### Objectives

- Understand how to configure derived metrics in dbt.
- Learn how to calculate ARR based on MRR.

### Use case
Calculate and analyze ARR to monitor the financial health and growth of subscription-based businesses.

:::tip
💡 Note that we’re using the [parallel subfolder approach](/best-practices/how-we-build-our-metrics/semantic-layer-7-semantic-structure#files-and-folders) for better organization in large projects, which means you’re creating a semantic model folder containing all your semantic layer code. 

Alternatively, you can use the [one-YAML-per-marts-model approach](/best-practices/how-we-build-our-metrics/semantic-layer-7-semantic-structure#files-and-folders) which puts documentation, data tests, unit tests, semantic models, and metrics into a unified file corresponding to a dbt-modeled mart.
:::

### Step 1: Define semantic models
Create a YAML file under the `semantic_models` folder: (`models/semantic_models/sem_revenue_models.yml`) to define a semantic model for revenue data.

<File name="models/semantic_models/sem_revenue_models.yml">

```yaml
semantic_models:
  - name: sem_revenue
    description: |
      This model aggregates revenue data, providing metrics for business to analyze the financial 
      health of the fictional Santiago's snacks org.
    model: ref('fct_revenue')
    defaults:
      agg_time_dimension: date_month
    entities:
      - name: date
        type: primary
        expr: date_month
    measures:
      - name: mrr
        agg: sum
        expr: monthly_recurring_revenue
        agg_time_dimension: date_month
    dimensions:
      - name: date_day
        type: time
        type_params:
          time_granularity: day
      - name: date_month
        type: time
        type_params:
          time_granularity: month
      - name: is_last_day_of_month
        type: categorical

```
</File>

### Step 2: Define the ARR metric
Create another YAML file under the metrics folder: (`models/metrics/sem_revenue_metrics.yml`) to define the ARR metric.

<File name="models/metrics/sem_revenue_metrics.yml">

```yaml
metrics:
  - name: arr
    label: 'ARR'
    description: |
      Annual recurring revenue calculated based on MRR.
    type: derived
    type_params:
      expr: mrr * 12
      metrics:
        - name: mrr

```
</File>

This model calculates ARR by multiplying the MRR (defined in the `sem_revenue_models.yml` file) by 12 to get the annual recurring revenue.

### Step 3: Validate and query metric

1. Confirm and validate the new metric definition in your development by running the following command:
   
   ```bash
   dbt parse
   ```  

2. Query your metrics to confirm the results are as expected. Run the following command:
   
   ```bash
   dbt sl query --metrics arr --group-by metric_time__year --where "metric_time__year >= '2023'" --order-by metric_time__year
   ```

<!-- Cookbook 3 -->

## How to calculate CAC using metrics

Use this cookbook recipe to understand how to [calculate customer acquisition cost (CAC)](https://en.wikipedia.org/wiki/Customer_acquisition_cost) using ratio metrics in dbt.

- [Objectives](#objectives-2)
- [Use cases](#use-case-2)
- [Step 1: Define semantic models](#step-1-define-semantic-models-2)
- [Step 2: Define the CAC metric](#step-2-define-the-cac-metric)
- [Step 3: Validate and query your metrics](#step-3-validate-and-query-metric-1)

### Objectives

- Understand how to configure and use semantic models in dbt to track and report customer acquisition costs.
- Learn how to define and calculate CAC by dividing the total acquisition cost by the number of new customers.

### Use case
Track and analyze the cost of acquiring new customers to optimize marketing and sales strategies.

:::tip
💡 Note that we’re using the [parallel subfolder approach](/best-practices/how-we-build-our-metrics/semantic-layer-7-semantic-structure#files-and-folders) for better organization in large projects, which means you’re creating a semantic model folder containing all your semantic layer code. 

Alternatively, you can use the [one-YAML-per-marts-model approach](/best-practices/how-we-build-our-metrics/semantic-layer-7-semantic-structure#files-and-folders) which puts documentation, data tests, unit tests, semantic models, and metrics into a unified file corresponding to a dbt-modeled mart.
:::

### Step 1: Define semantic models
Create a YAML file under the `semantic_models` folder: (`models/semantic_models/sem_customer_acquisition.yml`) to define a semantic model for customer acquisition data.

<File name="models/semantic_models/sem_customer_acquisition.yml">

```yaml
semantic_models:
  - name: sem_customer_acquisition
    description: |
      This model aggregates customer acquisition data, providing metrics for business to analyze the cost of acquiring new customers.
    model: ref('fct_customer_acquisition')
    defaults:
      agg_time_dimension: date_month
    entities:
      - name: date
        type: primary
        expr: date_month
    measures:
      - name: total_acquisition_cost
        agg: sum
        expr: acquisition_cost
        agg_time_dimension: date_month
      - name: new_customers
        agg: sum
        expr: customer_count
        agg_time_dimension: date_month
    dimensions:
      - name: date_month
        type: time
        type_params:
          time_granularity: month
      - name: acquisition_channel
        type: categorical
```

</File>

### Step 2: Define the CAC metric
Create another YAML file under the metrics folder: (`models/metrics/sem_customer_acquisition_metrics.yml`) to define the CAC metric.

<File name="models/metrics/sem_customer_acquisition_metrics.yml">

```yaml
metrics:
  - name: cac
    description: "Customer acquisition cost"
    label: 'CAC'        
    type: ratio
    type_params:
      numerator: total_acquisition_cost
      denominator: new_customers
```

</File>

### Step 3: Validate and query metric

1. Confirm and validate the new metric definition in your development by running the following command:
   
   ```bash
   dbt parse
   ```  

2. Query your metrics to confirm the results are as expected. Run the following command:
   
   ```bash
   dbt sl query --metrics cac --group-by metric_time__year --where "metric_time__year >= '2023'" --order-by metric_time__year
   ```
<!-- Cookbook 4 -->

## How to join multiple fact metrics

Use this cookbook recipe to understand how to join multiple fact metrics using the dbt Cloud Semantic Layer. This guide will walk you through a practical example of comparing sales and inventory metrics without creating additional views or dbt models.

- [Objectives](#objectives)
- [Use case](#use-case)
- [Step 1: Define semantic models](#step-1-define-semantic-models-3)
- [Step 2: Create metrics](#step-2-create-metrics)
- [Step 3: Join metrics](#step-3-join-metrics)
- [Step 4: Test your metrics](#step-4-test-your-metrics)

### Objectives

Learn how to utilize the dbt Semantic Layer to join multiple fact metrics from different semantic models.

### Use case
 This is useful if you want to compare fact metrics to each other in downstream tools, without needing to create anything new or configure anything new.

:::tip
Note that we’re using the [parallel subfolder approach](/best-practices/how-we-build-our-metrics/semantic-layer-7-semantic-structure#files-and-folders) for better organization in large projects, which means you’re creating a semantic model folder containing all your semantic layer code. 

Alternatively, you can use the [one-YAML-per-marts-model approach](/best-practices/how-we-build-our-metrics/semantic-layer-7-semantic-structure#files-and-folders) which puts documentation, data tests, unit tests, semantic models, and metrics into a unified file corresponding to a dbt-modeled mart.
:::

### Step 1: Define semantic models

1. Create a YAML file under the `semantic_models` folder (`models/semantic_models/sem_sales.yml`) to define a semantic model for tracking sales. This model should reference the `fct_sales` model and include relevant entities, dimensions, and measures. Note that if you’re using the one-YAML-file-per-mart, then save this as `sales.yml` under the models folder.

<File name="models/semantic_models/sem_sales.yml">

```yaml
semantic_models:
  - name: sem_sales
    description: >
      This model reports on sales activities, focusing on store-level and date-level metrics.
    model: ref('fct_sales')
    defaults:
      agg_time_dimension: date_day
    
    entities:
      - name: store_id
        type: primary
        expr: store_id
      - name: date
        type: foreign
        expr: date_day
    
    dimensions:
      - name: date_day
        type: time
        type_params:
          time_granularity: day
      - name: store_region
        type: categorical
    
    measures:
      - name: total_sales
        description: Sum of sales amount.
        agg: sum
        expr: sales_amount
        agg_time_dimension: date_day
```

</File>

2. Similarly, create another YAML file (`models/semantic_models/sem_inventory.yml`) to define a semantic model for tracking inventory. This model should reference the `fct_inventory` model.

<File name="models/semantic_models/sem_inventory.yml">

```yaml
semantic_models:
  - name: sem_inventory
    description: >
      This model reports on inventory levels, focusing on store-level and date-level metrics.
    model: ref('fct_inventory')
    defaults:
      agg_time_dimension: date_day
    
    entities:
      - name: store
        type: primary
        expr: store_id
      - name: date
        type: foreign
        expr: date_day
    
    dimensions:
      - name: date_day
        type: time
        type_params:
          time_granularity: day
      - name: store_region
        type: categorical
    
    measures:
      - name: stock_available
        description: Sum of available stock.
        agg: sum
        expr: stock_amount
        agg_time_dimension: date_day
```

</File>

### Step 2: Create metrics
1. Create a YAML file under the `metrics` folder (`models/metrics/sales_metrics.yml`) to define metrics for sales, such as total sales. Note that if you’re using the one-YAML-file-per-mart, then save this as `sales_metrics.yml` under the corresponding models folder.

<File name="models/metrics/sales_metrics.yml">

```yaml
metrics:
  - name: total_sales
    label: 'Total Sales'
    description: >
      The sum of sales amount across all stores and dates.
    type: simple
    type_params:
      measure: total_sales
```

</File>

2. Similarly, create a metrics YAML file (`models/metrics/inventory_metrics.yml`) for inventory, such as stock on hand.

<File name="models/metrics/inventory_metrics.yml">

```yaml
metrics:
  - name: stock_available
    label: 'Available stock'
    description: >
      The sum of stock available across all stores and dates.
    type: simple
    type_params:
      measure: stock_available
```

</File>

### Step 3: Join metrics

When you add a metric from both semantic models (like `total_sales` and `stock_available`) in a downstream tool, the dbt Semantic Layer automatically handles the join between these metrics based on the shared dimensions, such as `date` and `store`. 

Note that:

- The join operation leverages a full outer join, grabbing the necessary fields in subqueries.
- Both metrics *must* share common dimensions (in this case, `date` and `store`) for the join to work seamlessly.

### Step 4: Test your metrics

After defining your metrics, test them by querying in development to ensure the joins between metrics work as expected.

- In your development tool, run a [command query](/docs/build/metricflow-commands) that includes both `total_sales` and `stock_available`.
- Verify that the results reflect a correct comparison of the sales and inventory metrics across the selected dimensions.

```shell
## Rebuild your semantic_manifest.json file
dbt parse

## If you see an error where the metric doesn't exist it could be because you were developing on a separate branch and then switched back to this one so the manifest is different. If so, then use the `--no-defer` flag
dbt parse --no-defer

## Query your metric:
dbt sl query --metrics total_sales,stock_available --group-by date_day
```


<!--Cookbook 5 -->

## How to test your metrics

After defining your metrics in your dbt project, test them in your development tool by running the following commands to ensure they work as expected. For a full list of available commands, refer to[MetricFlow commands](/docs/build/metricflow-commands).

### Rebuild your semantic_manifest.json file

If you've made edits to your semantic models or metrics, you need to rebuild your `semantic_manifest.json` file to ensure that your new metrics are included in the manifest. 

Run the following command:

```bash
dbt parse
```

If you see an error where the metric doesn't exist, it could be because you were developing on a separate branch and then switched back to the working one so the manifest is different. If that's the case, use the `--no-defer` flag:

```bash
dbt parse --no-defer
```

### Query your metric

To query the `users_active` and `users_active_wow_growth` metrics, run the following command:

```bash
dbt sl query --metrics users_active,users_active_wow_growth --group-by metric_time__week --where "metric_time__week >= '2023-01-01'" --order-by metric_time__week
```

This command will return the results for the `users_active` and `users_active_wow_growth` metrics, grouped by `metric_time__week` and ordered by `metric_time__week`.


### Different output

If the output looks different than your "source of truth", review the compiled code using the following command (notice the `--compile` flag at the end of the command):

```bash
dbt sl query --metrics users_active,users_active_wow_growth --group-by metric_time__week --where "metric_time__week >= '2023-01-01'" --order-by metric_time__week --compile
```

</div>

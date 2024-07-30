---
title: dbt Semantic Layer cookbook recipes
id: sl-cookbook
description: "The dbt dbt Semantic Layer cookbook recipes are a collection of scenario-based, real-world examples for building with the dbt Semantic Layer."
displayText: Cookbook recipes offer practical, scenario-based examples for semantic models and metrics with the dbt Semantic Layer.
hoverSnippet: Read a collection of scenario-based, real-world examples for building metrics and semantic models with the dbt Semantic Layer.
# time_to_complete: '30 minutes' commenting out until we test
hide_table_of_contents: true
tags: ['Semantic Layer','dbt Cloud']
level: 'Intermediate'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

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

1. Create a YAML file under the `semantic_models` folder: (`models/semantic_models/sem_user_activity_daily.yml`) to create a semantic model that tracks daily user activity. 

  This semantic model refs the `fct_user_activity_daily` model.

  Note that if you’re using the one-YAML-file-per-mart, then save this as `user_activity_daily.yml` under the models folder.

<File name="models/semantic_models/sem_user_activity_daily.yml">

```yaml
semantic_models:
  - name: sem_user_activity_daily
    description: >
      This model reports on daily user activity. Activity is broken down into
      pageview + time-on-site metrics for each use-case that is addressed in
      dbt Cloud (ie. Deployment and Development)
    model: ref('fct_user_activity_daily')
    defaults:
      agg_time_dimension: date_day
```
</File>

2. Add the following YAML configurations in that same semantic model file:
   - entities to define user-related entities (such as user or `user_daily`)
   - dimensions to specify time dimensions (such as `date_day`)
   - measures for a distinct count of active users (`count_activity_users`) aggregated by day.

<File name="models/semantic_models/sem_user_activity_daily.yml">

```yaml
semantic_models:
  - name: sem_user_activity_daily
    description: >
      This model reports on daily user activity. Activity is broken down into
      pageview + time-on-site metrics for each use-case that is addressed in
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
    description: >
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

1. Create a YAML file under the `metrics` folder: (`models/metrics/sem_user_activity_daily.yml`) to create a metric that tracks active users. 
   
  Note that if you’re using the one-YAML-file-per-mart, then save this as `active_users.yml` under the models folder.

<File name="models/metrics/sem_user_activity_daily.yml">

```yaml
metrics:
  - name: users_active
    label: 'Users: active'
    description: |
      Users are considered active when they reach:
		* at least 3+ actions in the week
		* in a given reporting period (weekly or monthly)
      
      **Use-case:**
	  **Time Aggregations:** Weekly, Monthly
	  * This is helpful for reporting counts for the current/unfinished week because we base this metric on the trailing 7 _complete_ days.
	  * For example: if you query this metric on Friday, it'll look at the count based on Wed (last week) to  Thurs (this week). However, numbers can shift once we reach the end of the week as the week is then fully complete.
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
  
     - If you see an error where the metric doesn't exist, it could be because you were developing on a separate branch and then switched back to this one so the manifest is different. If so, then use the `--no-defer` flag
    ```bash
     dbt parse --no-defer
    ```

1. Query your metrics to confirm the results are as expected. Run the following command:
  ```bash
  dbt sl query --metrics users_active,users_active_wow_growth --group-by metric_time__week --where "metric_time__week >= '2023-01-01'" --order-by metric_time__week
  ```

1. If the results looks different than your "source of truth", then look at the compiled code. Run the following command:
  ```bash
  dbt sl query --metrics users_active,users_active_wow_growth --group-by metric_time__week --where "metric_time__week >= '2023-01-01'" --order-by metric_time__week --compile
  ```

## How to calculate ARR using metrics in dbt

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
    description: >
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
    description: >
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

## How to calculate CAC using metrics in dbt

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
    description: >
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

</div>

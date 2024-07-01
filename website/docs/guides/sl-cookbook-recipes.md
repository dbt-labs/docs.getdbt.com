---
title: dbt Semantic Layer cookbook recipes
id: sl-cookbook-recipes
description: "The dbt dbt Semantic Layer cookbook recipes are a collection of scenario-based, real-world examples for building with the dbt Semantic Layer."
displayText: Cookbook recipes offer practical, scenario-based examples for semantic models and metrics with the dbt Semantic Layer.
hoverSnippet: Read a collection of scenario-based, real-world examples for building metrics and semantic models with the dbt Semantic Layer.
# time_to_complete: '30 minutes' commenting out until we test
hide_table_of_contents: true
tags: ['Semantic Layer','dbt Cloud']
level: 'Intermediate'
recently_updated: true
---

### Intro

Use this cookbook recipe to understand how to calculate “Active users” and “Active users (Week-over-Week growth (WoW) growth), as well as other time-related attributes in a database with dbt using YAML configurations. 

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

1. Create a YAML file under the `semantic_models` folder: (`models/semantic_models/sem_user_activity_daily.yml`) to create a semantic model that tracks daily user activity. This semantic model ref’s model `fct_user_activity_daily`. Note that if you’re using the one-YAML-file-per-mart, then save this as `user_activity_daily.yml` under the models folder.

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

2. In that same semantic model file, add entities to define user-related entities (such as user or `user_daily`), dimensions to specify time dimensions (such as `date_day`), and measures for a distinct count of active users (`count_activity_users`) aggregated by day.

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

3. Create another semantic model YAML file (`models/semantic_models/sem_all_days.yml`). This semantic model captures company-specific fiscal periods and date flags (like `fiscal_quarter`). It helps in managing fiscal dates and other time-related dimensions.

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

1. Create a YAML file under the `metrics` folder: (`models/metrics/sem_user_activity_daily.yml`) to create a metric that tracks active users. Note that if you’re using the one-YAML-file-per-mart, then save this as `active_users.yml` under the models folder.

<File name="models/metrics/sem_user_activity_daily.yml">

```yaml
metrics:
  - name: users_active
    label: 'Users: active'
    description: |
	    **Definition:**
		* Users are considered active when they reach:
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

After saving your new or updated metric, let’s follow the following process in your development tool:

- Rebuild your semantic_manifest.json file
```bash
dbt parse
```

- If you see an error where the metric doesn't exist it could be because you were developing on a separate branch and then switched back to this one so the manifest is different. If so, then use the `--no-defer` flag
```bash
dbt parse --no-defer
```

- Query your metrics to see if they are working as expected
```bash
dbt sl query --metrics users_active,users_active_wow_growth --group-by metric_time__week --where "metric_time__week >= '2023-01-01'" --order-by metric_time__week
```

- If the output looks different than your "source of truth", then look at the compiled code:
```bash
dbt sl query --metrics users_active,users_active_wow_growth --group-by metric_time__week --where "metric_time__week >= '2023-01-01'" --order-by metric_time__week --compile
```

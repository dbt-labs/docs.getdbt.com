---
title: "Explore cost data"
sidebar_label: "Explore cost data"
description: "View warehouse costs, optimization impact, and model performance data across your project dashboard, model pages, and job details." 
id: "explore-cost-data"
tags: ['scheduler','SAO', 'cost savings', 'models built', 'cost insights']
---

# Explore cost data <Lifecycle status="beta,managed,managed_plus" />

You can access Cost Insights in these different <Constant name="dbt_platform" /> areas:

- [Project dashboard](#project-dashboard)
- [Catalog on Model page](#model-performance-in-catalog)
- [Job details page](#job-details) 

Each view provides different levels of detail to help you understand your warehouse spending and optimization impact. Cost and cost reduction estimates are based on historical runs and reflect actual usage, _not_ forecasts of future costs.

## Prerequisites

import ViewCostData from '/snippets/_cost-insights-view.md';

<ViewCostData />

For more information, see [Set up Cost Insights](/docs/explore/set-up-cost-insights).

import CostInsights from '/snippets/_cost-insights-sao.md';

<CostInsights />

## Project dashboard

The Cost Insights section in your project dashboard gives you a high-level view of warehouse costs and the impact of optimization through state-aware orchestration.

<Lightbox src="/img/docs/dbt-platform/cost-insights/cost-insights-project.png" title="Cost Insights in the project dashboard"/>

### Access

To go to your project dashboard, select your project in the main menu and click **Dashboard**.

### Key metrics

The project dashboard displays the following metrics that summarize the overall cost and optimization impact for your project:

- **Total cost reduction**
- **Total % reduction**
- **Total query run time reduction**
- **Reused assets**

### Filters

You can customize the cost data you want to view by:
    
- **Deployment type**: Production or Staging
- **Last**: 30 days, 60 days, 90 days, 6 months, or 1 year
- **View**: Daily, Weekly, or Monthly
- **Assets**: All, Models, Tests

### Visualization tabs

The project dashboard includes the following tabs that help you analyze cost and optimization trends over time.

- **Cost**: Shows the estimated build cost reduction when using state-aware orchestration.
- **Usage**: Shows the estimated warehouse usage consumed and the reduction in usage from state-aware orchestration over the selected timeframe. The **Usage** tab represents generic usage for your warehouse. The specific unit depends on your data warehouse:
    - Snowflake: Credits
    - BigQuery: Slot hours or bytes scanned (currently combined into one generic usage number)
    - Databricks: Databricks Units (DBUs)
- **Query run time**: Shows the estimated reduction in build time when using state-aware orchestration.
- **Builds**: Shows total builds split into number of assets rebuilt and assets reused by state-aware orchestration.

### Table view

Access the table view by clicking **Show table**, which provides detailed optimization data such as models reused, usage reduction, and cost reduction.

import TableView from '/snippets/_table-view.md';

<TableView />

## Model performance in Catalog

import ModelPerfIntro from '/snippets/_model-perf-intro.md';

<ModelPerfIntro />

### Access

To access model performance data:

1. From the main menu, go to **Catalog**.
2. Click your project from the file tree.
3. Navigate to the model whose cost data you want to view. You can search for it or click **Models** under **Project assets** in the sidebar to view all available models in the project.
4. Go to the the **Performance** tab on the model's details page.

import ModelPerformance from '/snippets/_model-performance.md';

<ModelPerformance />

## Job details

The **Insights** section on the Job details page provides cost and performance data for individual jobs.

<Lightbox src="/img/docs/dbt-platform/cost-insights/cost-insights-job.png" title="Cost Insights in job details"/>

### Access

To access job details, select your project in the main menu and go to **Orchestration** > **Jobs**. Select the job whose cost data you want to view.

### Filters

For the **Runs** tab, you can use the **Last** filter to view data from the past week, 14 days, or 30 days.

For **Cost**, **Usage**, **Query run time**, and **Builds** tabs, you can customize the cost data you want to view by:

- **Last**: 30 days, 60 days, 90 days, 6 months, or 1 year
- **View**: Daily, Weekly, Monthly
- **Assets**: All, Models, Tests

### Visualization tabs

- **Runs**: Displays the success rate and run duration in minutes for recent runs. You can select a time period with options for **Last week**, **Last 14 days**, and **Last 30 days**.
- **Cost**: Shows the estimated build cost reduction when using state-aware orchestration.
- **Usage**: Shows the estimated warehouse usage consumed and the reduction in usage from state-aware orchestration over the selected timeframe. The **Usage** tab represents generic usage for your warehouse. The specific unit depends on your data warehouse:
    - Snowflake: Credits
    - BigQuery: Slot hours or bytes scanned (currently combined into one generic usage number)
    - Databricks: Databricks Units (DBUs)
- **Query run time**: Shows the estimated query execution time and the reduction in run duration from state-aware orchestration.
- **Builds**: Shows the number of assets built versus reused by state-aware orchestration.

### Table view 

For **Cost**, **Usage**, **Query run time**, and **Builds** tabs, you can access the table view by clicking **Show table**, which provides detailed optimization data such as models reused, usage reduction, and cost reduction.

import TableView2 from '/snippets/_table-view.md';

<TableView2 />

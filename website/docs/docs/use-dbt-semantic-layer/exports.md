---
title: "Write queries with exports"
description: "Use exports to write tables to the data platform on a schedule."
sidebar_label: "Write queries with exports"
keywords: [DBT_INCLUDE_SAVED_QUERY, exports, DBT_EXPORTS_SAVED_QUERY, dbt Cloud, Semantic Layer]
---

Exports enhance [saved queries](/docs/build/saved-queries) by running your saved queries and writing the output to a table or view within your data platform. Saved queries are a way to save and reuse commonly used queries in MetricFlow, exports take this functionality a step further by:

- Enabling you to write these queries within your data platform using the dbt Cloud job scheduler.
- Proving an integration path for tools that don't natively support the dbt Semantic Layer by exposing tables of metrics and dimensions.

Essentially, exports are like any other table in your data platform &mdash; they enable you to query metric definitions through any SQL interface or connect to downstream tools without a first-class [Semantic Layer integration](/docs/cloud-integrations/avail-sl-integrations). Running an export counts towards [queried metrics](/docs/cloud/billing#what-counts-as-a-queried-metric) usage. Querying the resulting table or view from the export does not count toward queried metric usage.

## Prerequisites

- You have a dbt Cloud account on a [Team or Enterprise](https://www.getdbt.com/pricing/) plan. 
- You use one of the following data platforms: Snowflake, BigQuery, Databricks, or Redshift.
- You are on [dbt version](/docs/dbt-versions/upgrade-dbt-version-in-cloud) 1.7 or newer.
- You have the dbt Semantic Layer [configured](/docs/use-dbt-semantic-layer/setup-sl) in your dbt project.
- You have a dbt Cloud environment with the [job scheduler](/docs/deploy/job-scheduler) enabled.
- You have a [saved query](/docs/build/saved-queries) and [export configured](/docs/build/saved-queries#configure-exports) in your dbt project. In your configuration, leverage [caching](/docs/use-dbt-semantic-layer/sl-cache) to cache common queries, speed up performance, and reduce compute costs.
- You have the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) installed. Note, that exports aren't supported in dbt Cloud IDE yet.

## Benefits of exports

The following section explains the main benefits of using exports, including:
- [DRY representation](#dry-representation)
- [Easier changes](#easier-changes)
- [Caching](#caching)

#### DRY representation

Currently, creating tables often involves generating tens, hundreds, or even thousands of tables that denormalize data into summary or metric mart tables. The main benefit of exports is creating a "Don't Repeat Yourself (DRY)" representation of the logic to construct each metric, dimension, join, filter, and so on. This allows you to reuse those components for long-term scalability, even if you're replacing manually written SQL models with references to the metrics or dimensions in saved queries.

#### Easier changes

Exports ensure that changes to metrics and dimensions are made in one place and then cascade to those various destinations seamlessly. This prevents the problem of needing to update a metric across every model that references that same concept.

#### Caching 
Use exports to pre-populate the cache, so that you're pre-computing what you need to serve users through the dynamic Semantic Layer APIs.

#### Considerations

Exports offer many benefits and it's important to note some use cases that fall outside the advantages:
- Business users may still struggle to consume from tens, hundreds, or thousands of tables, and choosing the right one can be a challenge.
- Business users may also make mistakes when aggregating and filtering from the pre-built tables.

For these use cases, use the dynamic [dbt Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview) instead of exports.

## Run exports

Before you're able to run exports in development or production, you'll need to make sure you've [configured saved queries and exports](/docs/build/saved-queries) in your dbt project. In your saved query config, you can also leverage [caching](/docs/use-dbt-semantic-layer/sl-cache) with the dbt Cloud job scheduler to cache common queries, speed up performance, and reduce compute costs.

There are two ways to run an export:
  
- [Run exports in development](#exports-in-development) using the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) to test the output before production (You can configure exports in the dbt Cloud IDE, however running them directly in the IDE isn't supported yet). If you're using the dbt Cloud IDE, use `dbt build` to run exports. Make sure you have the [environment variable](#set-environment-variable) enabled. 
- [Run exports in production](#exports-in-production) using the [dbt Cloud job scheduler](/docs/deploy/job-scheduler) to write these queries within your data platform.

## Exports in development

You can run an export in your development environment using your development credentials if you want to test the output of the export before production. 

This section explains the different commands and options available to run exports in development.

- Use the [`dbt sl export` command](#exports-for-single-saved-query) to test and generate exports in your development environment for a singular saved query. You can also use the `--select` flag to specify particular exports from a saved query.

- Use the [`dbt sl export-all` command](#exports-for-multiple-saved-queries) to run exports for multiple saved queries at once. This command provides a convenient way to manage and execute exports for several queries simultaneously, saving time and effort. 

### Exports for single saved query

Use the following command to run exports in the dbt Cloud CLI:

```bash
dbt sl export
```

The following table lists the options for `dbt sl export` command, using the `--` flag prefix to specify the parameters:  

| Parameters | Type    | Required | Description    |
| ------- | --------- | ---------- | ---------------- |
| `name` | String    | Required     | Name of the `export` object.    |
| `saved-query` | String    | Required     | Name of a saved query that could be used.    |
| `select` | List or String   | Optional    | Specify the names of exports to select from the saved query. |
| `exclude` | String  | Optional    | Specify the names of exports to exclude from the saved query. |
| `export_as` | String  | Optional    | Type of export to create from the `export_as` types available in the config. Options available are `table` or `view`. |
| `schema` | String  | Optional    | Schema to use for creating the table or view. |
| `alias` | String  | Optional    | Table alias to use to write the table or view. |

You can also run any export defined for the saved query and write the table or view in your development environment. Refer to the following command example and output:

```bash
dbt sl export --saved-query sq_name
```

The output would look something like this: 

```bash
Polling for export status - query_id: 2c1W6M6qGklo1LR4QqzsH7ASGFs..
Export completed.
```

### Use the select flag

You can have multiple exports for a saved query and by default, all exports are run for a saved query. You can use the `select` flag in [development](#exports-in-development) to select specific or multiple exports. Note, you can’t sub-select metrics or dimensions from the saved query, it’s just to change the export configuration i.e table format or schema

For example, the following command runs `export_1` and `export_2` and doesn't work with the `--alias` or `--export_as` flags:

```bash
dbt sl export --saved-query sq_name --select export_1,export2
```

<details>
<summary>Overriding export configurations</summary>

The `--select` flag is mainly used to include or exclude specific exports. If you need to change these settings, you can use the following flags to override export configurations:

- `--export-as` &mdash; Defines the materialization type (table or view) for the export. This creates a new export with its own settings and is useful for testing in development.
- `--schema` &mdash;  Specifies the schema to use for the written table or view.
- `--alias` &mdash; Assigns a custom alias to the written table or view. This overrides the default export name.

Be careful. The `--select` flag _can't_ be used with `alias` or `schema`.

For example, you can use the following command to create a new export named `new_export` as a table:

```bash
dbt sl export --saved-query sq_number1 --export-as table --alias new_export
```
</details>

### Exports for multiple saved queries

Use the command, `dbt sl export-all`, to run exports for multiple saved queries at once. This is different from the `dbt sl export` command, which only runs exports for a singular saved query.  For example, to run exports for multiple saved queries, you can use:

```bash
dbt sl export-all
```

The output would look something like this: 

```bash
Exports completed:
- Created TABLE at `DBT_SL_TEST.new_customer_orders`
- Created VIEW at `DBT_SL_TEST.new_customer_orders_export_alias`
- Created TABLE at `DBT_SL_TEST.order_data_key_metrics`
- Created TABLE at `DBT_SL_TEST.weekly_revenue`

Polling completed
```

The command `dbt sl export-all` provides the flexibility to manage multiple exports in a single command.


## Exports in production

Enabling and executing exports in dbt Cloud optimizes data workflows and ensures real-time data access. It enhances efficiency and governance for smarter decisions.  

Exports use the default credentials of the production environment. To enable exports to run saved queries and write them within your data platform, perform the following steps:

1. [Set an environment variable](#set-environment-variable) in dbt Cloud.
2. [Create and execute export](#create-and-execute-exports) job run.

### Set environment variable
<!-- for version 1.7 -->
<VersionBlock firstVersion lastVersion="1.7">

1. Click **Deploy** in the top navigation bar and choose **Environments**.
2. Select **Environment variables**.
3. [Set the environment variable](/docs/build/environment-variables#setting-and-overriding-environment-variables) key to `DBT_INCLUDE_SAVED_QUERY` and the environment variable's value to `TRUE` (`DBT_INCLUDE_SAVED_QUERY=TRUE`).

This ensures saved queries and exports are included in your dbt build job. For example, running `dbt build --select sq_name` runs the equivalent of `dbt sl export --saved-query sq_name` in the dbt Cloud Job scheduler. 

If exports aren't needed, you can set the value(s) to `FALSE` (`DBT_INCLUDE_SAVED_QUERY=FALSE`).

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/deploy_exports.jpg" width="90%" title="Add an environment variable to run exports in your production run." />

</VersionBlock>

<!-- for Versionless -->
<VersionBlock firstVersion="1.8">

1. Click **Deploy** in the top navigation bar and choose **Environments**.
2. Select **Environment variables**.
3. [Set the environment variable](/docs/build/environment-variables#setting-and-overriding-environment-variables) key to `DBT_EXPORT_SAVED_QUERIES` and the environment variable's value to `TRUE` (`DBT_EXPORT_SAVED_QUERIES=TRUE`).
*Note, if you're on dbt v1.7, set the environment variable key to `DBT_INCLUDE_SAVED_QUERY`. Use the documentation toggle to select version "1.7" to view more details.

Doing this ensures saved queries and exports are included in your dbt build job. For example, running `dbt build -s sq_name` runs the equivalent of `dbt sl export --saved-query sq_name` in the dbt Cloud Job scheduler.

If exports aren't needed, you can set the value(s) to `FALSE` (`DBT_EXPORT_SAVED_QUERIES=FALSE`).

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/env-var-dbt-exports.jpg" width="90%" title="Add an environment variable to run exports in your production run." />

</VersionBlock>

When you run a build job, any saved queries downstream of the dbt models in that job will also run. To make sure your export data is up-to-date, run the export as a downstream step (after the model).

### Create and execute exports
<VersionBlock firstVersion lastVersion="1.7">

1. Create a [deploy job](/docs/deploy/deploy-jobs) and ensure the `DBT_INCLUDE_SAVED_QUERY=TRUE` environment variable is set, as described in [Set environment variable](#set-environment-variable).
   - This enables you to run any export that needs to be refreshed after a model is built.
   - Use the [selector syntax](/reference/node-selection/syntax) `--select` or `-s` option in your build command to specify a particular dbt model or saved query to run. For example, to run all saved queries downstream of the `orders` semantic model, use the following command:
    ```bash
      dbt build --select orders+
      ```

</VersionBlock>

<VersionBlock firstVersion="1.8">

1. Create a [deploy job](/docs/deploy/deploy-jobs) and ensure the `DBT_EXPORT_SAVED_QUERIES=TRUE` environment variable is set, as described in [Set environment variable](#set-environment-variable).
   - This enables you to run any export that needs to be refreshed after a model is built.
   - Use the [selector syntax](/reference/node-selection/syntax) `--select` or `-s` option in your build command to specify a particular dbt model or saved query to run. For example, to run all saved queries downstream of the `orders` semantic model, use the following command:
    ```bash
      dbt build --select orders+
      ```

</VersionBlock>

2. After dbt finishes building the models, the MetricFlow Server processes the exports, compiles the necessary SQL, and executes this SQL against your data platform. It directly executes a "create table" statement so the data stays within your data platform.
3. Review the exports' execution details in the jobs logs and confirm the export was run successfully. This helps troubleshoot and to ensure accuracy. Since saved queries are integrated into the dbt DAG, all outputs related to exports are available in the job logs.
4. Your data is now available in the data platform for querying! 🎉

## FAQs

<DetailsToggle alt_header="Can I have multiple exports in a single saved query?">

Yes, this is possible. However, the difference would be the name, schema, and materialization strategy of the export.
</DetailsToggle>

<DetailsToggle alt_header="How do I run all exports for a saved query?">

- In production runs, you can build the saved query by calling it directly in the build command, or you build a model and any exports downstream of that model.
- In development, you can run all exports by running `dbt sl export --saved-query sq_name`.

</DetailsToggle>

<DetailsToggle alt_header="Will I run duplicate exports if multiple models are downstream of my saved query?">

dbt will only run each export once even if it builds multiple models that are downstream of the saved query. For example, you could have a saved query called `order_metrics`, which has metrics from both the `orders` and `order_items` semantic models.

You can run a job that includes both models using `dbt build`. This runs both the `orders` and `order_items` models, however, it will only run the `order_metrics` export once.
</DetailsToggle>

<DetailsToggle alt_header="Can I reference an export as a dbt model using ref()">

No, you won't be able to reference an export using `ref`. Exports are treated as leaf nodes in your DAG. Modifying an export could lead to inconsistencies with the original metrics from the Semantic Layer.
</DetailsToggle>

<DetailsToggle alt_header="How do exports help me use the dbt Semantic Layer in tools that don't support it, such as PowerBI?">

Exports provide an integration path for tools that don't natively connect with the dbt Semantic Layer by exposing tables of metrics and dimensions in the data platform.

You can use exports to create a custom integration with tools such as PowerBI, and more.

</DetailsToggle>

<DetailsToggle alt_header="How can I select saved_queries by their resource type?">

To include all saved queries in the dbt build run, use the [`--resource-type` flag](/reference/global-configs/resource-type) and run the command `dbt build --resource-type saved_query`.

</DetailsToggle>

## Related docs
- [Validate semantic nodes in a CI job](/docs/deploy/ci-jobs#semantic-validations-in-ci)
- Configure [caching](/docs/use-dbt-semantic-layer/sl-cache)
- [dbt Semantic Layer FAQs](/docs/use-dbt-semantic-layer/sl-faqs)

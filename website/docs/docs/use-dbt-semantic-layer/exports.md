---
title: "Write queries with exports"
description: "Use exports to write tables to the data platform on a schedule."
sidebar_label: "Write queries with exports"
---

The exports feature in the dbt Semantic Layer enhances the [saved queries](/docs/build/saved-queries) by allowing you to write commonly used queries directly within your data platform.

While saved queries are a way to save and reuse commonly used queries in MetricFlow, exports take this functionality a step further by:

- Enabling you to write these queries within your data platform using dbt Cloud.
- Proving an integration path for tools that don't natively support the dbt Semantic Layer by exposing tables of metrics and dimensions.

Essentially, exports are like any other table in your data platform. They enable you to query metric definitions through any SQL interface or connect to downstream tools without a first-class Semantic Layer integration. Refer to [Available integrations](/docs/use-dbt-semantic-layer/avail-sl-integrations) for more information.

## Prerequisites

- You have a [multi-tenant](/docs/cloud/about-cloud/tenancy) dbt Cloud account on a [Team or Enterprise](https://www.getdbt.com/pricing/) plan. Single-tenant is not supported at this time.
- You use one of the following data platforms: Snowflake, BigQuery, Databricks, or Redshift.
- You are on [dbt version](/docs/dbt-versions/upgrade-dbt-version-in-cloud) 1.7 or newer.
- You have the dbt Semantic Layer [configured](/docs/use-dbt-semantic-layer/setup-sl) in your dbt project.
- You have a dbt Cloud environment with a [Job scheduler](/docs/deploy/job-scheduler) enabled.

### Comparison between exports and saved queries


| Feature |  Exports | <div style={{width:'250px, text-align: center'}}>Saved queries</div>  |
| ----------- | ----------- | ---------------- |
| **Availability**    | Available on dbt Cloud [Team or Enterprise](https://www.getdbt.com/pricing/) plans with dbt versions 1.7 or newer. <br /> Note, Exports are not supported in dbt Cloud IDE yet. | Available in both dbt Core and dbt Cloud.     |
| **Purpose**         | To write saved queries in your data platform and expose metrics and dimensions as a view or table. | To define and manage common Semantic Layer queries in YAML, including metrics and dimensions.   |
| **Usage**           | Automatically runs saved queries and writes them within your data platform. Exports count towards [queried metrics](/docs/cloud/billing#what-counts-as-a-queried-metric) usage. <br /><br />Example: Create a weekly aggregated table for active user metrics, automatically updated and stored in the data platform.  | Used for organizing and reusing common MetricFlow queries within dbt projects.<br /><br /><br />Example: Group related metrics together for better organization, and include commonly used dimensions and filters. | For materializing query results in the data platform. |
| **Integration**     | Must have the dbt Semantic Layer configured in your dbt project.<br /><br />Tightly integrated with the [MetricFlow Server](/docs/use-dbt-semantic-layer/sl-architecture#components) and dbt Cloud's job scheduler. | Integrated into the dbt <Term id="dag" /> and managed alongside other dbt nodes. |
| **Configuration**   | Defined within the `saved_queries` configuration. Set up within the dbt Cloud environment and job scheduler settings. | Defined in YAML format within dbt project files.    |

## Define exports

Exports are an additional configuration added to a saved query. They define how to write a saved query, along with the schema and table name.

You can define `exports` in YAML format as a key within the `saved_queries` configuration and in the same file as your metric definitions.

An example of a saved query with an export:

<File name='semantic_model.yml'>

```yaml
saved_queries:
  - name: order_metrics
    description: Relevant order metrics
    query_params:
      metrics:
        - orders
        - large_order
        - food_orders
        - order_total
      group_by:
        - Entity('order_id')
        - TimeDimension('metric_time', 'day')
        - Dimension('customer__customer_name')
        - ... # Additional group_by
      where:
        - "{{TimeDimension('metric_time')}} > current_timestamp - interval '1 week'"
         - ... # Additional where clauses
    exports:
      - name: order_metrics
        config:
          export_as: table # Options available: table, view
          schema: YOUR_SCHEMA # Optional - defaults to deployment schema
          alias: SOME_TABLE_NAME # Optional - defaults to Export name
```
</File>

You can use the following parameters to define an `export`:

| Parameters | Type    | Required | Description    |
| ------- | --------- | ---------- | ---------------- |
| `name` | String    | Required     | Name of the `export` object.    |
| `saved-query` | String    | Required     | Name of a saved query that could be used.    |
| `select` | List or String   | Optional    | Specify the names of exports to select from the saved query. |
| `exclude` | String  | Optional    | Specify the names of exports to exclude from the saved query. |
| `export_as` | String  | Optional    | Type of export to create from the `export_as` types available in the config. Options available are `table` or `view`. |
| `schema` | String  | Optional    | Schema to use for creating the table or view. |
| `alias` | String  | Optional    | Table alias to use to write the table or view. |

## Run exports

Once you define exports in your dbt project, then you can run them. There are two ways to run an export:
  
- [Run exports in development](#exports-in-development) using the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation). Note, the dbt Cloud IDE doesn't support Exports yet.
- [Run exports in production](#exports-in-production) using the [dbt Cloud job scheduler](/docs/deploy/job-scheduler).

### Exports in development

You can run an export in your development environment using your development credentials if you want to test the output of the export before production. You can use the following command in the dbt Cloud CLI:

```bash
dbt sl export
```

You can also run any export defined for the saved query and write the table or view in your development environment. Refer to the following command example and output:

**Example**
```bash
dbt sl export --saved-query sq_name
```

**Output**
```bash
Polling for export status - query_id: 2c1W6M6qGklo1LR4QqzsH7ASGFs..
Export completed.
```

### Use the select flag

By default, all exports are run for a saved query. You can use the `select` flag in [development](#exports-in-development).

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

### Exports in production

To enable exports in production using the dbt Cloud job scheduler:

1. [Set environment variable](#set-environment-variable)
1. [Create and execute exports](#create-and-execute-exports)

#### Set environment variable
<!-- for version 1.7 -->
<VersionBlock firstVersion lastVersion="1.7">

1. Click **Deploy** in the top navigation bar and choose **Environments**.
2. Select **Environment variables**.
3. [Set the environment variable](/docs/build/environment-variables#setting-and-overriding-environment-variables) key to `DBT_INCLUDE_SAVED_QUERY` and the environment variable's value to `TRUE` (`DBT_INCLUDE_SAVED_QUERY=TRUE`).

This ensures saved queries and exports are included in your dbt build job. For example, running `dbt build --select sq_name` runs the equivalent of `dbt sl export --saved-query sq_name` in the dbt Cloud Job scheduler. 

If exports aren't needed, you can set the value(s) to `FALSE` (`DBT_INCLUDE_SAVED_QUERY=FALSE`).

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/deploy_exports.jpg" width="90%" title="Add an environment variable to run exports in your production run." />

</VersionBlock>

<!-- for keep on latest version -->
<VersionBlock firstVersion="1.8">

1. Click **Deploy** in the top navigation bar and choose **Environments**.
2. Select **Environment variables**.
3. [Set the environment variable](/docs/build/environment-variables#setting-and-overriding-environment-variables) key to `DBT_EXPORT_SAVED_QUERIES` and the environment variable's value to `TRUE` (`DBT_EXPORT_SAVED_QUERIES=TRUE`).

Doing this ensures saved queries and exports are included in your dbt build job. For example, running `dbt build sq_name` runs the equivalent of `dbt sl export --saved-query sq_name` in the dbt Cloud Job scheduler.

If exports aren't needed, you can set the value(s) to `FALSE` (`DBT_EXPORT_SAVED_QUERIES=FALSE`).

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/env-var-dbt-exports.jpg" width="90%" title="Add an environment variable to run exports in your production run." />

</VersionBlock>

When you run a build job, any saved queries downstream of the dbt models in that job will also run. To make sure your export data is up-to-date, run the export as a downstream step (after the model).

#### Create and execute exports
<VersionBlock firstVersion lastVersion="1.7">

1. Create a [deploy job](/docs/deploy/deploy-jobs) and ensure the `DBT_INCLUDE_SAVED_QUERY=TRUE` environment variable is set, as described in [Set environment variable](#set-environment-variable).
   - This enables you to run any export that needs to be refreshed after a model is built.

</VersionBlock>

<VersionBlock firstVersion="1.8">

1. Create a [deploy job](/docs/deploy/deploy-jobs) and ensure the `DBT_EXPORT_SAVED_QUERIES=TRUE` environment variable is set, as described in [Set environment variable](#set-environment-variable).
   - This enables you to run any export that needs to be refreshed after a model is built.

</VersionBlock>

2. After dbt finishes building the models, the MetricFlow Server processes the exports, compiles the necessary SQL, and executes this SQL against your data platform. It directly executes a "create table" statement, so the data stays within your data platform.
3. Review the exports' execution details in the jobs logs and confirm the export was run successfully. This helps troubleshoot and to ensure accuracy. Since saved queries are integrated into the dbt DAG, all outputs related to exports are available in the job logs.
4. Your data is now available in the data platform for querying.

Enabling and executing exports in dbt Cloud optimizes data workflows and ensures real-time data access. It enhances efficiency and governance for smarter decisions.

You can use the [selector syntax](/reference/node-selection/syntax) `--select` or `-s` to specify a particular dbt model to run in your build command to only run the exports downstream of that model, or to select a saved query to run. As an example, the following command will run any saved queries that are downstream of the `orders` semantic model:

```bash
dbt build --select orders+
```

## FAQs

<detailsToggle alt_header="Can I have multiple exports in a single saved query?">

Yes, this is possible. However, the difference would be the name, schema, and materialization strategy of the export.
</detailsToggle>

<detailsToggle alt_header="How do I run all exports for a saved query?">

- In production runs, you can build the saved query by calling it directly in the build command, or you build a model and any exports downstream of that model.
- In development, you can run all exports by running `dbt sl export --saved-query sq_name`.

</detailsToggle>

<detailsToggle alt_header="Will I run duplicate exports if multiple models are downstream of my saved query?">

dbt will only run each export once even if it builds multiple models that are downstream of the saved query. For example, you could have a saved query called `order_metrics`, which has metrics from both the `orders` and `order_items` semantic models.

You can run a job that includes both models using `dbt build`. This runs both the `orders` and `order_items` models, however, it will only run the `order_metrics` export once.
</detailsToggle>

<detailsToggle alt_header="Can I reference an export as a dbt model using ref()">

No, you won't be able to reference an export using `ref`. Exports are treated as leaf nodes in your DAG. Modifying an export could lead to inconsistencies with the original metrics from the Semantic Layer.
</detailsToggle>

<detailsToggle alt_header="How do exports help me use the dbt Semantic Layer in tools that don't support it, such as PowerBI?">

Exports provide an integration path for tools that don't natively connect with the dbt Semantic Layer by exposing tables of metrics and dimensions in the data platform.

You can use exports to create a custom integration with tools such as PowerBI, and more.

</detailsToggle>

<detailsToggle alt_header="How can I select saved_queries by their resource type?">

To select `saved_queries` by resource type, run `dbt build --resource-type saved_queries`.

</detailsToggle>

## Related docs
- [dbt Semantic Layer FAQs](/docs/use-dbt-semantic-layer/sl-faqs)

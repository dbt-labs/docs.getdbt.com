---
title: "Materialize queries with Exports"
description: "Use Exports to materialize tables to the data platform on a schedule."
sidebar_label: "Materialize with Exports"
---

Exports with the dbt Semantic Layer enhance the [Saved Queries](/docs/build/saved-queries) feature, allowing you to materialize commonly used queries directly within your data platform.

While Saved Queries are a way to save and reuse commonly used queries in MetricFlow, Exports take this functionality a step further by:

- Enabling you to materialize these queries within your data platform using dbt Cloud.
- Proving an integration path for tools that don't natively support the dbt Semantic Layer by exposing tables of metrics and dimensions.

Essentially, Exports are like any other table in your data platform. They allow you to query metric definition through any SQL interface or connect to downstream tools without needing a first class Semantic Layer integration. Refer to [Available integrations](/docs/use-dbt-semantic-layer/avail-sl-integrations) for more information.

## Prerequisites

- You have a dbt Cloud account on a [Team or Enterprise](https://www.getdbt.com/pricing/) plan.
- You are on [dbt version](/docs/dbt-versions/upgrade-core-in-cloud) 1.7 or higher.
- You have the dbt Semantic Layer [configured](/docs/use-dbt-semantic-layer/setup-sl) in your dbt project.
- You have a dbt Cloud environment with a [Job scheduler](/docs/deploy/job-scheduler) enabled.

### Exports and Saved Queries

The following table compares the features and usage between Exports and Saved Queries: 

| Feature |  Exports | <div style={{width:'250px, text-align: center'}}>Saved Queries</div>  |
| ----------- | ----------- | ---------------- |
| **Availability**    | Available on dbt Cloud [Team or Enterprise](https://www.getdbt.com/pricing/) plans (dbt versions 1.7 or higher).| Available in both dbt Core and dbt Cloud.     |
| **Purpose**         | To materialize Saved Queries in your data platform and expose metrics and dimensions as a view or table. | To define and manage common Semantic Layer queries in YAML, which includes metrics and dimensions.   |
| **Usage**           | Automatically runs Saved Queries and materializes them within your data platform. Exports count towards [queried metrics](/docs/cloud/billing#what-counts-as-a-queried-metric) usage. <br /><br />**Example**: Creating a weekly aggregated table for active user metrics, automatically updated and stored in the data platform.  | Used for organizing and reusing common MetricFlow queries within dbt projects.<br /><br /><br />**Example**: Group related metrics together for better organization, and include commonly uses dimensions and filters. | For materializing query results in the data platform. |
| **Integration**     | Must have the dbt Semantic Layer configured in your dbt project.<br /><br />Tightly integrated with the [MetricFlow Server](/docs/use-dbt-semantic-layer/sl-architecture#components) and dbt Cloud's Job scheduler. | Integrated into the dbt <Term id="dag" /> and managed alongside other dbt nodes. |
| **Configuration**   | Configured within dbt Cloud environment and Job scheduler settings. | Defined in YAML format within dbt project files.   |

## Define Exports

Exports are an additional configuration added to a Saved Query. They define how to materialize a Saved Query, along with the schema and table name.

You can define Exports in a YAML format as a key within the `saved_queries` configuration and in the same file as your metric definitions.  Here's an example of a Saved Query with an Export:

<File name='semantic_model.yml'>

```yaml
saved_queries:
  - name: your_query
    description: your_description
    query_params:
      metrics:
        - your_metric_name
      group_bys:
        - TimeDimension()
        - ... # Additional group_bys
      where:
        - ... # Additional where clauses
    export:
      - name: your_export
        config:
          export_as: table # Options available: table, view
          schema: your_schema # Optional - defaults to deployment schema
          alias: some_table_name # Optional - defaults to Export name
```
</File>

You can use the following parameters to define an Export:

| Parameters | Type    | Required | Description    |
| ------- | --------- | ---------- | ---------------- |
| `name` | String    | Required     | Name of the Export object.    |
| `saved-query` | String    | Required     | A name of a Saved Query that could be used.    |
| `select` | List or String   | Optional    | Names of Exports to be selected from the Saved Query. |
| `exclude` | String  | Optional    | The names of Exports to be excluded from the from the Saved Query. |
| `export_as` | String  | Optional    | Type of Export to create from the `export_as` types available in the config. Options available are `table` or `view`. |
| `schema` | String  | Optional    | Schema to use for creating the table or view. |
| `alias` | String  | Optional    | Table alias to use to write the table or view. |

## Run Exports

Once you've defined Export in your dbt project, the next step is to run them. There are two ways to run an Export:
  
1. [Run Exports in development](#exports-in-development) using the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation).
2. [Run Exports in production](#exports-in-production) using the [dbt Cloud Job scheduler](/docs/deploy/job-scheduler).

### Exports in Development

You can run an Export in your development environment using your development credentials if you want to test the output of the Export before production. You can use the following command in the dbt Cloud CLI:

```bash
dbt sl export
```

You can also use the following command to run any Export defined for the Saved Query and materialize the table or view in your development environment:

```bash
dbt sl export --saved-query sq_name
```

---- ADD OUTPUT OF THE COMMAND HERE ----

### Use the `select` flag

By default, all Exports are run for a Saved Query. You can use the `select` flag in [development](#exports-in-development) or [production](#exports-in-production) to select or exclude a specific Export.

For example, the following command will run the `export_1` and `export_2` and doesn't work with the `--alias` or `--export_as` flags:

```bash
dbt sl export --select export_1,export2
```

<details>
<summary>Overriding Export configurations</summary>

The `--select` flag is mainly used to include or exclude specific Exports. If you need to change these settings, you can use the following flags to override Export configurations:

- `--export-as` &mdash; Defines the materialization type (table or view) for the Export. This creates a new export with its own settings, useful for testing in development.
- `--schema` &mdash;  Specifies the schema to be used for the  materialized table or view.
- `--alias` &mdash; Assigns a custom alias to the materialized table or view, overriding the default Export name.

Note that `--select` flag can't be used with `alias` or `schema`.

For example, you can use the following command to create a new Export named `new_export` as a table:

```bash
dbt sl export --saved-query sq_number1 --export-as table --alias new_export
```
</details>

### Exports in Production

You can run an Export against your production data by adding the `--include-saved-query` flag to the `dbt build` **Commands** box, in your deployment **Execution Settings**. Running `dbt build --include-saved-query` runs the equivalent of `dbt sl export --saved-query sq_name` in the dbt Cloud Job scheduler.

When you run a build job, any Saved Queries downstream of the dbt models in that job will run as well. To make sure your Export data is up-to-date, run the Export as a downstream step (after the model). The steps to create an Export are:

1. Create a [deploy job](/docs/deploy/deploy-jobs) in dbt Cloud.
2. Add the `--include-saved-query` to the `dbt build` command in your **Execution Settings** to re-run any Export that needs to be refreshed after a model is build. 
   - You can use the [selector syntax](/reference/node-selection/syntax) `--select` to only run the Exports downstream of a particular model.
3. After dbt finishes building the models, the MetricFlow Server processes the Exports, compiles the necessary SQL, and executes this SQL against your data platform.
4. Review the Exports execution details in the jobs logs and confirm the Export was run successfully. Since Saved Queries are integrated into the dbt DAG, all outputs related to Exports are available in the job logs.
5. Your data is now available in the data platform for querying.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/deploy_exports.jpg" width="90%" title="Adding --include-saved-query to the dbt build command in your job execution settings." />

You can use the selector syntax `--select` or `-s` to specify a particular dbt model to run in your build command in order to only run the Exports downstream of that model. As an example, the following command will run any Saved Queries that are downstream of the `orders` semantic model:

```bash
dbt build --include-saved-query --select orders+
```

## FAQs

<detailsToggle alt_header="Can I have multiple Exports in a single saved-query?">

Yes, this is possible. However, the only difference would be the name, schema, and materialization strategy of the Export.
</detailsToggle>

<detailsToggle alt_header="How do I run all Exports for a Saved Query?">

- In production runs, you build a model and any Exports downstream of that model. There is currently no way to call the Export directly from the Job scheduler.
- In development, you can run all Exports by running `dbt sl Export --saved-query sq_name`.

</detailsToggle>

<detailsToggle alt_header="Will I run duplicate Exports if multiple models are downstream of my Saved Query?">

We will only run each Export once even if we build multiple models that are downstream of the Saved Query. For example, you may have a Saved Query called `order_metrics`, which has metrics from both the `orders` and `order_items` semantic models. 

You can run a job that includes both models: `dbt build --include-saved-query`. This runs both the `orders` and `order_items` models, however it will only run the `order_metrics` Export once.
</detailsToggle>

<detailsToggle alt_header="Can I reference an Export as a dbt model using ref()">

No, you won't be able to reference an Export using `ref`. Exports are treated as leaf nodes in your DAG. Modifying an Export cold lead to inconsistencies with the the original metrics from the Semantic Layer.
</detailsToggle>

<detailsToggle alt_header="How do Exports help me use the dbt Semantic Layer in tools that don't support it, such as PowerBI?">

Exports provide an integration path for tools that don't natively connect with the dbt Semantic Layer by exposing tables of metrics and dimensions in the data platform.

You can use Exports to create a custom integration with tools such as PowerBI, and more.
</detailsToggle>

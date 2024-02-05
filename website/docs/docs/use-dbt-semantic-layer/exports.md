---
title: "Exports"
description: "Use Exports to materialize tables to the data platform on a schedule."
sidebar_label: "Materialize with Exports"
---

Exports in the dbt Semantic Layer extends the [Saved Queries](/docs/build/saved-queries) functionality:

- Exports enable you to materialize these queries within your data platform using dbt Cloud.
- Exports provide an integration path for tools that don't nativley support the dbt Semantic Layer by exposing tables of metrics and dimensions.

While Saved Queries are a way to save and reuse commonly used queries in MetricFlow, Exports takes this a step further by materialize these queries in your data platfrom. Exports are like any other table in your data platform, and allow you to query metric defintions in any SQL interface, or connect to downstream tools without needing a first class Sematnic Layer integration. 

## Exports vs. Saved Queries

| Feature    | Exports  | Saved Queries  |
|-----------|-----------|----------------|
| **Availability**    | Available to dbt Cloud users on [Team or Enterprise](https://www.getdbt.com/pricing/) plans, on dbt versions 1.7 or higher.| Available in both dbt Core and dbt Cloud.     |
| **Purpose**         | To materialize Saved Queries in your data platform, and expose metrics and dimensions as a view or table. | To define and manage common Semantic Layer queries in YAML, which includes metrics and dimensions.   |
| **Usage**           | Automatically runs Saved Queries and materializes them within your data platform. Query metric defintions using SQL or integrate with a BI tool that doesn't have a native integration. Exports count towards [queried metrics](/docs/cloud/billing#what-counts-as-a-queried-metric) usage. <br /><br />**Example**: Creating a weekly aggregated table for active user metrics, automatically updated and stored in the data platform.  | Used for organizing and reusing common MetricFlow queries within dbt projects.<br /><br />**Example**: Group related metrics together for better organizations, and include commonly uses dimensions and filters. | For materializing query results in the data platform. |
| **Integration**     | Must have the dbt Semantic Layer configured in your dbt project.<br /><br />Tightly integrated with the [MetricFlow Server](/docs/use-dbt-semantic-layer/sl-architecture#components) and dbt Cloud's job scheduler. | Integrated into dbt DAG and managed alongside other dbt nodes. |
| **Configuration**   | Configured within dbt Cloud environment and job scheduler settings. | Defined in YAML format within dbt project files.   |

## Prerequisites

- Have a dbt Cloud account on a [Team or Enterprise](https://www.getdbt.com/pricing/) plan.
- Be on dbt version 1.7 or higher.
- Have a dbt Semantic Layer configured in your dbt project.
- Have a dbt Cloud environment with a [job scheduler](/docs/deploy/job-scheduler) enabled.


# Define Exports

Exports are an additonal configuration added to a Saved Query. They define how this Saved Query should be materialized along with the schema and table name.
You can define Exports in a YAML format in the as a key in the `saved_queries` configuration.

```yaml
saved_queries:
  - name: my_query
    description: null
    query_params:
      metrics:
        - null
      group_bys:
        - TimeDimension()
        - ...
      where:
        - null
    export:
      - name: my_export
        config:
          export_as: table # options: table, view
          schema: my_schema # [optional - DEFAULT to deployment schema]
          alias: some_table_name # [optional - DEFAULT to Export name]
```
## Running Exports

Once you've defined Exports the next step is to run them. There are two ways to run an Export:
1. Run an Export in your production environment using the dbt Cloud job scheduler.
2. Run an Export in your development environment using the cloud CLI

### Running Exports in Production
You can run an Export against your production data by adding the `--include-saved-query flag` in `dbt build`. For example: `dbt build --include-saved-query`. Any Saved Queries that are downstream of the dbt models included in the build job will execute. Running the Export as a downstream step of a model ensures the data in your Export is up to date. The steps to create an Export are:

1. Create a [deploy job](/docs/deploy/deploy-jobs) in dbt Cloud.
2. Add the `--include-saved-query` to the `dbt build` command to re-run any Export that needs to be refreshed after a model is build. You can use the selector syntax i.e `--select` to only run the Exports downstream of a particular model.
3. After dbt completes building the models, MetricFlow Server processes the Exports, compiles the necessary SQL, and executes this SQL against your data platform.
4. Review the Exports execution details in the jobs logs and confirm the Export was run succesfully. Since Saved Queries are integrated into the dbt DAG, all outputs related to Exports are available in the job logs.
5. Your data is now available in the data platform for querying.

You can use the selector syntax i.e `--select`, `-s` to specify a praticular dbt model to run in your build command in order to only run the Exports downstream of that model. For example: `dbt build --include-saved-query --select orders+`. This will run any Saved Queries that are downstream of the orders semantic model.

### Running Exports in Development
Running an Export in development is useful if you want to test the output of the Export. You can run an Export in development using the cloud CLI command `dbt sl wxport` i.e `dbt sl wxport --saved-query sq_name`. This will run any Export defined for the Saved Query and materialize the table or view in your development environment.

By default all Exports are run for a Saved Query. You can select a specific Export with the `select` flag or you can specify a new Export using the `export-as` flag. The Job scheduler runs the equivalent of` dbt sl export --saved-query sq_name`.

| Parameters | Type    | Required | Description    |
| ------- | --------- | ---------- | ---------------- |
| `saved-query` | String    | Required     | A name of a Saved Query that could be used.    |
| `select` | List or String   | Optional    | Names of Exports to be selected from the Saved Query. |
| `exclude` | String  | Optional    | Not the names of Exports to be selected from the Saved Query. |
| `export-as` | String  | Optional    | Type of Export to create from the Export_as types available in the config. |
| `schema` | String  | Optional    | Schema to use for creating the table or view. |
| `alias` | String  | Optional    | Table alias to use to write the table or view. |

Since `--select` is used to select an existing Export, it can't be used with alias or schema to override  the Export configurations. If you want to override the Export configurations, you can use the `--export-as` flag along with the `--schema` and `--alias` flags. For example:
* `dbt sl export` will run all Exports in your project using your development credentials
* `dbt sl export --saved_query sq1 --export-as table --alias new_export` will create a new Export with the name `new_export` as a table in your development environment.
* `dbt sl export --select export_1,export2` Will run export_1 and export_2 and doesn't work with `--alias` or `--export_as`


## FAQs
Can I have multiple Exports in a single saved_query?
Yes this is possible, but the only diffrence would be the name, schema and materialization strategy of the Export.
How do I run all Exports for a Saved Query?
In production runs you build a model and any Exports downstream of that model. There is currently no way to call the Export directly from the job scheduler. In development you can run all Exports by running `dbt sl Export --saved-query sq_name`.
Will I run duplicate Exports if multiple models are downstream of my Saved Query? 
We will only run each Export once even if we build multiple models that are downstream of the Saved Query. For example, say I have a Saved Query called `order_metrics`, which has metrics from both the `orders` and `order_items` semantic models. I run a job that includes both models i.e `dbt build --include-saved-query`. This run both the `order`s and `order_items` models, but will only run the order_metrics Export once.
Can I refrence and Export as a dbt model using the `ref()`
No. Additonal transformation on top of an Export means we wouldn't be able to verify the logic hasn't been changed from the metric definiton in the Semantic Layer. For this reason we think of Exports as a leaf node in your DAG.

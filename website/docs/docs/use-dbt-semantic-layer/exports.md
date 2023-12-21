---
title: "Exports"
description: "Use Exports to materialize tables to the data platform on a schedule."
sidebar_label: "Materialize queries with Exports"
---

Exports in the dbt Semantic Layer extends the [saved queries](/docs/build/saved-queries) functionality:

- Exports enable you to materialize and automate these queries within your data platform.
- Exports uses the dbt Cloud job scheduler to execute saved queries for reliable and fast data reporting.

While saved queries are a way to save and reuse commonly used queries in MetricFlow, Exports takes this a step further by using the MetricFlow server to materialize these queries as data tables of views using the dbt Cloud job scheduler.

| Feature    | Exports  | Saved queries  |
|-----------|-----------|----------------|
| **Availability**    | Available to dbt Cloud users on [Team or Enterprise](https://www.getdbt.com/pricing/) plan on  on dbt versions 1.7 or higher.| Available in both dbt Core and dbt Cloud.     |
| **Purpose**         | To schedule and run saved queries as part of [dbt's job scheduler](/docs/deploy/job-scheduler). | To define and manage common Semantic Layer queries in YAML, which includes metrics and dimensions.   |
| **Usage**           | Automatically runs saved queries and materializes them within your data platform. <br /><br />**Example**: Creating a weekly aggregated table for active user metrics, automatically updated and stored in the data platform.  | Used for organizing and reusing common MetricFlow queries within dbt projects.<br /><br />**Example**: Standardizing a frequently used revenue calculation across multiple reports. | For materializing query results in the data platform. |
| **Integration**     | Must have the dbt Semantic Layer configured in your dbt project.<br /><br />Tightly integrated with the [MetricFlow Server](/docs/use-dbt-semantic-layer/sl-architecture#components) and dbt Cloud's job scheduler. | Integrated into dbt DAG and managed alongside other dbt nodes. |
| **Configuration**   | Configured within dbt Cloud environment and job scheduler settings. | Defined in YAML format within dbt project files.   |

## Define exports

Exports are essentially saved queries that you can schedule and execute using [dbt's job scheduler](/docs/deploy/job-scheduler) capabilities. Exports include the following materialization types: 

- `table` (available now) 
- and `window_table`, `incremental_table`, and `file` (coming soon)

You can define Exports in a YAML format in the same file as saved queries:

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
    exports:
      - name: my_query
        config:
          export_as: table # options: table, view
          schema: my_schema # [optional - DEFAULT to deployment schema]
          alias: some_table_name # [optional - DEFAULT to export name]
```

## Parameters

By default all exports are run for a saved query. You can select a specific export with the `select` flag or you can specify a new export using the `export-as` flag. The Job scheduler runs the equivalent of` dbt sl export --saved-query sq_name`.

| Parameters | Type    | Required | Description    |
| ------- | --------- | ---------- | ---------------- |
| `saved-query` | String    | Required     | A name of a saved query that could be used.    |
| `select` | List or String   | Optional    | Names of exports to be selected from the saved query. |
| `exclude` | String  | Optional    | Not the names of exports to be selected from the saved query. |
| `export-as` | String  | Optional    | Type of export to create from the export_as types available in the config. |
| `schema` | String  | Optional    | Schema to use for creating the table or view. |
| `alias` | String  | Optional    | Table alias to use to write the table or view. |

## Schedule Exports

Exports in dbt are effectively integrated with your data models and metrics, allowing you to automate and materialize saved queries using the dbt Cloud job scheduler. These exports, along with saved queries, are treated as standard dbt models and are executed as part of the dbt <Term id="dag" />, following model builds where dependencies exist.

To execute exports using the job scheduler:

- Create a [deploy job](/docs/deploy/deploy-jobs) in dbt Cloud. 
- Use the built-in `dbt build` command to execute exports and saved queries. Note that although you can selectively run specific saved queries, this level of selection isn't available for individual exports. However, you can always create a different saved query if you want to separate exports. WHAT'S A SAMPLE QUERY? IS IT `export-as export_name` OR `dbt sl export --saved-query sq_name`
- After dbt completes building the models, the MetricFlow Server processes the exports, compiles the necessary datasets, and executes data operations.
- You can review the exports execution details in the jobs logs. Since saved queries are integrated into the dbt DAG, all outputs related to exports are available in the `dbt build` logs.
- Your data is now available in the data platform for querying.

   <Lightbox src="/img/docs/dbt-cloud/semantic-layer/saved_queries_run.jpg" width="90%" title="TeThe st"/>


## Caching

Caching reduces load times and costs by pre-computing and storing frequently queried datasets. This feature is critical for companies with large datasets or requiring fast query compute times.

There are two types of caching:
- Result cache &mdash; Cache all queries in the data platform and configured at the project or environment-level. This cache is used to store the results of a query save costs, and speed up subsequent queries.
- Declarative cache &mdash; Saved queries specified by the user and defaults to all saved queries being cached or not. This cache enables more control over what is cached.

To configure caching, you can add the `config` property to your `saved_queries` configuration:

```yaml
saved_queries:
  - name: my_query
    description:
    query_params:
      ...
    exports:
      ...
    config:
      cache:
        enabled: true|false
```

### Cache

| GraphQL	| dbt Cloud CLI |	ADBC| Description	|
| --- | --- | --- | --- |
| `create-query` | `dbt sl query` |	`{{ semantic_layer.query() }}` | Allows you to build the SQL for a query that does not hit the cache, utilizes a saved-query to specify parameters or specifies whether the cache should be utilized or overwritten.
| `drop-cache` |	`dbt sl cache drop` |	`{{ semantic_layer.drop_cache() }}` |	Drops datasets from the cache using parameters which target specific object |
| `inspect-cache` |	`dbt sl cache inspect` |	`{{ semantic_layer.inspect_cache() }}` |	Inspect and provides a list of objects that are in the cache. | 

## Job commands?

Additional parameters and commands are introduced in MetricFlow CLI and Cloud Interfaces to support Saved Queries and Exports functionalities.

| GraphQL	| dbt Cloud CLI |	ADBC	| Description	| 	
| --- | --- | --- | --- |
| `create-query` |	`dbt sl query` |	`{{ semantic_layer.query() }}` |	Allows you to build the SQL for a query that does not hit the cache, utilizes a saved-query to specify parameters or specifies whether the cache should be utilized or overwritten	|
| `export`	| `dbt sl export`	| None, Not possible	| Builds an export using the GraphQL API. Use the export [parameters](#parameters). specified above in  |

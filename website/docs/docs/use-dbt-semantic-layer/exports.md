---
title: "Exports"
description: "Use Exports to materialize tables to the data platform on a schedule."
sidebar_label: "Exports"
---

Exports in the dbt Semantic Layer extends the [saved queries](/docs/build/saved-queries) functionality:

- Exports enable you to materialize and automate these queries within your data platform.
- Exports uses the dbt Cloud job scheduler to execute saved queries for reliable and fast data reporting.
- While saved queries are a way to save and reuse commonly used queries in MetricFlow, Exports takes this a step further by allowing you to materialize these queries as data tables of views using the dbt Cloud job scheduler.

The following table outlines the key differences between them:

| Feature    | Exports  | Saved queries  |
|-----------|-----------|----------------|
| **Availability**    | Available to dbt Cloud users on Team and Enterprise plans. | Available in both dbt Core and dbt Cloud.     |
| **Purpose**         | To schedule and run saved queries as part of [dbt's job scheduler](/docs/deploy/job-scheduler). | To define and manage common Semantic Layer queries.    |
| **Usage**           | Used for materializing query results in the data platform. Materialization types include table; window_table, incremental_table, and file coming soon. | Used for organizing and reusing queries within dbt projects. |
| **Integration**     | Tightly integrated with dbt Cloud's orchestration and job scheduling. | Integrated into dbt DAG and managed alongside other dbt nodes. |
| **Configuration**   | Configured within dbt Cloud environment and job scheduler settings. | Defined in YAML format within dbt project files.   |

## Exports

Exports are essentially saved queries scheduled and executed using dbt’s orchestration capabilities. They include types like table (available now), and also window_table, incremental_table, and file (coming soon).

Saved queries are defined in YAML format, mirroring the query interfaces used in other APIs. The structure includes:

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

Interface
The API for Exports takes parameters such as saved-query, select, exclude, and export-as, each with its own set of requirements and phases of implementation.

## Managing exports

Exports are seamlessly integrated into dbt DAGs, linked to metrics and semantic models by dependencies. This integration allows exports to be part of dbt jobs, selectable through the dbt build command.

Jobs page
The Jobs page in dbt Cloud doesn't require changes for Saved queries and Exports. These functionalities will appear in the console output and logs, similar to models.

## Orchestration
Exports are orchestrated as part of the dbt DAG, following model execution. The MetricFlow Server builds the specified dataset, performing necessary operations.

## Caching
Caching reduces load times and costs by pre-computing and storing frequently queried datasets. This feature is critical for companies with large datasets or requiring fast query compute times.

Approaches
Various caching strategies like Result Cache, Declarative Result Cache, and Automated Result Cache will be implemented, each with its pros and cons.

Management
Caching can be managed through configurations and interfaces provided in the dbt Semantic Layer. Users can specify caching preferences in the saved_queries config, and interact with the cache through commands like dbt sl drop-cache.

## Job commands?

Additional parameters and commands are introduced in MetricFlow CLI and Cloud Interfaces to support Saved Queries and Exports functionalities.

Caching commands
Commands for managing cache, such as create-query, drop-cache, and inspect-cache, are available, providing control and visibility over the caching process.

Work Plan and implementation
The timeline for implementing Exports, Saved Queries, and Caching features includes various stages of design, development, and integration with existing dbt Cloud functionalities.

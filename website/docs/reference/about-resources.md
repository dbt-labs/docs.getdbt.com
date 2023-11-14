---
title: "About resource types"
id: "about-resources"
description: "Learn about the different resource types in dbt, their supported properties and configurations, and how to use them." 
sidebar_label: "About resource types"
---

dbt supports different types of resource types. Each one has a set of supported [properties and configurations](/reference/configs-and-properties) within a dbt project, which are key to how they function and integrate within your data project. 

## Resource types table

The following tables describes each resource type, its identifier, and a brief description of its purpose. 

WHERE DO WE LINK TO FOR EACH RESOURCE TYPE? CONTENT UNDER DOCS? OR UNDER RESOURCE CONFIGS?

| Resource type     | Identifier         | Description |
|-------------------|--------------------|-------------|
| Analysis          | `analysis`         | Similar to models, but usually used for exploratory data analysis and not directly integrated into the dbt DAG (Directed Acyclic Graph). |
| Documentation     | `doc`              | Used for documenting the project, including descriptions of models, columns, and more. |
| Exposure          | `exposure`         | Document downstream use of dbt models in dashboards, reports, or analysis. |
| Group             | `group`            | Used for grouping and organizing other dbt resources, potentially for managing permissions or categorization. |
| Macro             | `macro`            | Reusable code snippets in Jinja, allowing for custom logic and SQL reuse. |
| Metric            | `metric`           | Define business metrics using a standardized syntax, which can be used across models and analyses. |
| Model             | `model`            | Central to dbt projects, models are SQL files that define transformations and datasets. These are typically the primary analytical outputs. |
| Operation         | `operation`        | Custom operations that can be run from the dbt command line, often for administrative or maintenance tasks. |
| RPC Call   | `rpc`    | Deprecated in dbt v1.6. Run a`rpc` to execute dbt commands over a network. Deprecated in dbt v1.6. |
| Saved Query       | `saved_query`      | Represent saved SQL queries, potentially for reuse or tracking purposes. |
| Seed              | `seed`             | CSV files that are loaded into the database as static tables, useful for small reference data. |
| Semantic model    | `semantic_model`   | A higher-level abstraction of data models, focusing on the semantic layer or business logic representation. |
| Snapshot          | `snapshot`         | Capture data at a specific point in time to track changes, useful for historical reporting and auditing. |
| Source            | `source`           | Represents raw data sources, helping to define and document the initial state of data that dbt interacts with. |
| SQL operation     | `sql_operation`    | Custom SQL operations that can be executed within dbt workflows. |
| Test              | `test`             | Define tests to ensure data quality and integrity, such as uniqueness, not-null constraints, and custom data validation. |

## Supported properties and configs table

Resources, such as models, snapshots, seeds, tests, and so on, are the backbone of your data project. Each resource can have defined properties and configurations, which are key to how they function and integrate within your project and pipeline. 

- Properties &mdash; Descriptive attributes that provide context and validation rules for your data resources.
  - There are special properties, like `descriptions` or `tests`, that are solely defined in `YAML` files alongside resources. They cannot be set in config blocks or the `dbt_project.yml` file since they offer static, context-specific details rather than hierarchical configurations.
- Configurations &mdash; Instruct dbt on how to build and maintain them efficiently in your data warehouse environment.

Refer to [About configs and properties](/reference/configs-and-properties) for more details.

Properties or configurations support different resource types and are applied in different ways. The following table describes each resource type, its supported properties and configurations, and how they are applied.

| Resource type | Supported properties | Supported configurations | Config inheritance |
| --------------| -------------------- | -----------------------  | ------------------ |
| Exposures    | description, columns, tests, docs, macros | tags, materialized, and so on. | `properties.yml` → `.yml file` → `dbt_project.yml`  |
| Group   |         |
| Macro   |    |
| Models   |  columns, tests, docs, macros  | tags, materialized, persist_docs, tags, and so on. | `properties.yml` → `.yml file` → `dbt_project.yml`   |
| Saved Query   |        |
| Semantic Model   |  |
| Seeds  |  tests, macros | tags, persist_docs, and so on.  | In-file `config()` block → `.yml file` → `dbt_project.yml` |
| Snapshots    |  tests, macros | tags, materialized, and so on.| In-file `config()` block → `.yml file` → `dbt_project.yml` |
| Sources   | description, columns, tests, docs, macros | tags, persist_docs, and so on.  | `properties.yml` → `.yml file` → `dbt_project.yml` |
| Tests  | description, tags, macros  |     | In-file `config()` block → `.yml file` → `dbt_project.yml` |
|    |     |           |     |            |
| Configurations   |  In-file `config()` block → `.yml file` → `dbt_project.yml` |
|    |     |           |     |            |
| Special Properties  | description, tests, docs, columns, quote, source properties, exposure properties, macro properties |  | `properties.yml`                                           |



## Related docs
- [About resource paths](/reference/resource-configs/resource-path)
- [About configs and properties](/reference/configs-and-properties)

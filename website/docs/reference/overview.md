---
title: Reference section overview
---

This section of the docs is built for users who are familiar with the basic concepts of dbt, and want to know the exact syntax for using a feature.


## Cheatsheet

| Guide    | Configs     | Properties (`schema.yml` files) | Commands | Other documentation |
|:---------|:------------|:-----------|:---------|:--------------------|
| **[Projects](projects)** | [Project configs](dbt_project.yml.md)     |            | [`init`](init)         | |
| **[Models](building-models)**      | [Model configs](model-configs)         | [Model properties](model-properties)           | [`run`](run)         | |
| **[Schema tests & Data tests](building-a-dbt-project/tests)** | | [Schema test properties](resource-properties/tests)| [`test`](commands/test) |
| **[Documentation](documentation)** | | [`description` property](description)  | [`docs generate` & `docs serve`](cmd-docs) |  |
| **[Seeds](seeds)** | [Seeds configs](seed-configs) | [Seed properties](seed-properties) | [`seed`](seed) | |
| **[Sources](using-sources)** | [Source configs](source-configs) | [Source properties](source-properties) | [`source snapshot-freshness`](commands/source) | |
| **[Snapshots](snapshots)** | [Snapshot configs](snapshot-configs) | [Snapshot properties](snapshot-properties) | [`snapshot`](snapshot) | |
| **[Jinja & Macros](jinja-macros)** | | [Macro properties](macro-properties) | | [dbt Jinja Functions](dbt-jinja-functions) |
| **[Analyses](analyses)** |  | [Analysis properties](analysis-properties) | [`compile`](compile) | |
| **[Packages](package-management)** |  | | [`deps`](deps), [`clean`](clean) | |
| **[Hooks & Operations](hooks-operations)** | | | [`run-operation`](run-operation) |

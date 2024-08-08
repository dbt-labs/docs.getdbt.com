---
title: Validations
id: validation
description: "The Semantic Layer, powered by MetricFlow, has three types of built-in validations, including Parsing Validation, Semantic Validation, and Data Warehouse validation, which are performed in a sequential and blocking manner."
sidebar_label: "Validations"
tags: [Metrics, Semantic Layer]
---

Validations refer to the process of checking whether a system or configuration meets the expected requirements or constraints. In the case of the Semantic Layer, powered by MetricFlow, there are three built-in validations &mdash; [parsing](#parsing), [semantic](#semantic), and [data platform](#data-platform).

These validations ensure that configuration files follow the expected schema, the semantic graph doesn't violate any constraints, and semantic definitions in the graph exist in the physical table - providing effective data governance support. These three validation steps occur sequentially and must succeed before proceeding to the next step.

The code that handles validation [can be found here](https://github.com/dbt-labs/dbt-semantic-interfaces/tree/main/dbt_semantic_interfaces/validations) for those who want to dive deeper into this topic. 

## Validations command

You can run validations against the defined semantic model configurations from the command line with the following [MetricFlow commands](/docs/build/metricflow-commands):

Note, in dbt Cloud you don't need to validate the Semantic Layer config separately. Running a dbt command (such as `dbt parse`, `dbt build`, `dbt compile`, or `dbt run`) automatically checks it.

```bash
mf validate-configs # dbt Core users
```

## Parsing

In this validation step, we ensure your config files follow the defined schema for each semantic graph object and can be parsed successfully. It validates the schema for the following core objects:

* Semantic models
* Identifiers
* Measures
* Dimensions
* Metrics

## Semantic syntax

This syntactic validation step occurs after we've built your semantic graph. The Semantic Layer, powered by MetricFlow, runs a suite of tests to ensure that your semantic graph doesn't violate any constraints. For example, we check to see if measure names are unique, or if metrics referenced in materialization exist. The current semantic rules we check for are:

1. Check those semantic models with measures have a valid time dimension
2. Check that there is only one primary identifier defined in each semantic model
3. Dimension consistency
4. Unique measures in semantic models
5. Measures in metrics are valid
7. Cumulative metrics are configured properly

## Data platform

This type of validation checks to see if the semantic definitions in your semantic graph exist in the underlying physical table. To test this, we run queries against your data platform to ensure the generated SQL for semantic models, dimensions, and metrics will execute. We run the following checks:

* Measures and dimensions exist
* Underlying tables for data sources exist
* Generated SQL for metrics will execute

You can run semantic validations (against your semantic layer) in a CI job to guarantee any code changes made to dbt models don't break these metrics. For more information, refer to [semantic validation in CI](/docs/deploy/ci-jobs#semantic-validations-in-ci).

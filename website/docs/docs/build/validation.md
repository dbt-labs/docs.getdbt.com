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

You can run validations from dbt Cloud or the command line with the following [MetricFlow commands](/docs/build/metricflow-commands):

```bash
dbt sl validate-configs # dbt Cloud users
mf validate-configs # dbt Core users
```

## Parsing

In this validation step, we ensure your config files follow the defined schema for each semantic graph object and can be parsed successfully. It validates the schema for the following core objects:

* Semantic models
* Identifiers
* Measures
* Dimensions
* Metrics

## Semantic 

This validation step occurs after we've built your semantic graph. The Semantic Layer, powered by MetricFlow, runs a suite of tests to ensure that your semantic graph doesn't violate any constraints. For example, we check to see if measure names are unique, or if metrics referenced in materialization exist. The current semantic rules we check for are:

1. Check those semantic models with measures have a valid time dimension
2. Check that there is only one primary identifier defined in each semantic model
3. Dimension consistency
4. Unique measures in semantic models
5. Measures in metrics are valid
7. Cumulative metrics are configured properly

## Data platform

This type of validation Checks to see if the semantic definitions in your semantic graph exist in the underlying physical table. To test this, we run queries against your data platform to ensure the generated SQL for semantic models, dimensions, and metrics will execute. We run the following checks

* Check that measures and dimensions exist
* Check that underlying tables for data sources exist
* Check that the generated SQL for metrics will execute


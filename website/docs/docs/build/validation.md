---
title: Validations
id: validation
description: "The Semantic Layer, powered by MetricFlow, has three types of built-in validations, including Parsing Validation, Semantic Validation, and Data Warehouse validation, which are performed in a sequential and blocking manner."
sidebar_label: "Validations"
tags: [Metrics, Semantic Layer]
---

Validations refer to the process of checking whether a system or configuration meets the expected requirements or constraints. In the case of the <Constant name="semantic_layer" />, powered by MetricFlow, there are three built-in validations &mdash; [parsing](#parsing), [semantic](#semantic), and [data platform](#data-platform).

These validations ensure that configuration files follow the expected schema, the semantic graph doesn't violate any constraints, and semantic definitions in the graph exist in the physical table - providing effective data governance support. These three validation steps occur sequentially and must succeed before proceeding to the next step.

The code that handles validation [can be found here](https://github.com/dbt-labs/dbt-semantic-interfaces/tree/main/dbt_semantic_interfaces/validations) for those who want to dive deeper into this topic. 

## Validations command

<VersionBlock lastVersion="1.99">
You can run validations from <Constant name="cloud" /> or the command line with the following [MetricFlow commands](/docs/build/metricflow-commands). In <Constant name="cloud" />, you need developer credentials to run `dbt sl validate-configs` in the IDE or CLI, and deployment credentials to run it in CI.

```bash
dbt sl validate # dbt platform users
mf validate-configs # dbt platform users
```
</VersionBlock>

<VersionBlock firstVersion="2.0">

You can run validations from <Constant name="cloud" /> or the command line with the following [MetricFlow command](/docs/build/metricflow-commands):

```bash
mf validate-configs # dbt platform users
```
</VersionBlock>


## Parsing

In this validation step, we ensure your config files follow the defined schema for each semantic graph object and can be parsed successfully. It validates the schema for the following core objects:
<VersionBlock lastVersion="1.99">

* Semantic models
* Identifiers
* Measures
* Dimensions
* Metrics
</VersionBlock>
<VersionBlock firstVersion="2.0">
* Semantic models
* Identifiers
* Simple metrics
* Dimensions
* Metrics
</VersionBlock>

## Semantic syntax

:::info
In the initial <Constant name="fusion" /> release, semantic syntax validation is only available in these environments:
- **<Constant name="cloud_ide" />**
- **Orchestration** in the <Constant name="dbt_platform" />
- Local development with a valid `dbt_cloud.yaml` config
:::

This syntactic validation step occurs after we've built your semantic graph. The <Constant name="semantic_layer" />, powered by MetricFlow, runs a suite of tests to ensure that your semantic graph doesn't violate any constraints. For example, we check to see if <VersionBlock lastVersion="1.99">measure</VersionBlock><VersionBlock firstVersion="2.0">simple metric</VersionBlock> names are unique, or if metrics referenced in materialization exist. The current semantic rules we check for are:

<VersionBlock lastVersion="1.99">
1. Check those semantic models with measures have a valid time dimension
2. Check that there is only one primary identifier defined in each semantic model
3. Dimension consistency
4. Unique measures in semantic models
5. Measures in metrics are valid
7. Cumulative metrics are configured properly
</VersionBlock>

<VersionBlock firstVersion="2.0">
1. Check those semantic models with simple metrics have a valid time dimension
2. Check that there is only one primary identifier defined in each semantic model
3. Dimension consistency
4. Unique simple metrics in semantic models
5. Simple metrics are valid
7. Cumulative metrics are configured properly
</VersionBlock>

## Data platform

This type of validation checks to see if the semantic definitions in your semantic graph exist in the underlying physical table. To test this, we run queries against your data platform to ensure the generated SQL for semantic models, dimensions, and metrics will execute. <VersionBlock firstVersion="2.0">In <Constant name="fusion" />, data platform validations are available only when using the `mf validate-configs` command.</VersionBlock>

We run the following checks:

<VersionBlock lastVersion="1.99">
* Measures and dimensions exist
* Underlying tables for data sources exist
* Generated SQL for metrics will execute
</VersionBlock>

<VersionBlock firstVersion="2.0">
* Simple metrics and dimensions exist
* Underlying tables for data sources exist
* Generated SQL for metrics will execute
</VersionBlock>

You can run semantic validations (against your semantic layer) in a CI job to guarantee any code changes made to dbt models don't break these metrics. For more information, refer to [semantic validation in CI](/docs/deploy/ci-jobs#semantic-validations-in-ci).

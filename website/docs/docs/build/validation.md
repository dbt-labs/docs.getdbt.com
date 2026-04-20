---
title: Validations
id: validation
description: "The Semantic Layer, powered by MetricFlow, has three types of built-in validations, including Parsing Validation, Semantic Validation, and Data Warehouse validation, which are performed in a sequential and blocking manner."
sidebar_label: "Validations"
tags: [Metrics, Semantic Layer]
---

Validations refer to the process of checking whether a system or configuration meets the expected requirements or constraints. In the case of the <Constant name="semantic_layer" />, powered by MetricFlow, there are three built-in validations &mdash; [parsing](#parsing), [semantic](#semantic), and [data platform](#data-platform).

These validations ensure that configuration files follow the expected schema, the semantic graph doesn't violate any constraints, and semantic definitions in the graph exist in the physical table &mdash; providing effective data governance support. These three validation steps occur sequentially and must succeed before proceeding to the next step.

The code that handles validation [can be found here](https://github.com/dbt-labs/dbt-semantic-interfaces/tree/main/dbt_semantic_interfaces/validations) for those who want to dive deeper into this topic. 

## Validations command

You can run validations from the <Constant name="dbt_platform" /> or the command line with the following [MetricFlow commands](/docs/build/metricflow-commands). In <Constant name="dbt" />, you need developer credentials to run `dbt sl validate` in the IDE or CLI, and deployment credentials to run it in CI.

- For Fusion and dbt users in the dbt platform CLI or locally with a valid `dbt_cloud.yml`:

  ```bash
  dbt sl validate
  ```

  This runs parsing, semantic, and (where supported) data platform validations.

  When using `dbt sl validate` locally, the command validates your local semantic manifest, and not the platform's manifest. This means your uncommitted local changes are included in the validation.

- For dbt Core (open source) users or Fusion CLI users not connected to dbt platform and using local MetricFlow:

  ```bash
  mf validate-configs
  ```
  
  This runs parsing and semantic validations.

## Availability by environment

Validation behavior and availability differ depending on your environment and setup:

| Environment | Who can use | Parsing | Semantic syntax | Data platform | How to run |
| --- | --- | --- | --- | --- | --- |
| <Constant name="fusion_engine"/>  | <Constant name="dbt_platform"/> users for full Semantic Layer features | ✅ | ✅ * | ✅ | - Parsing validations run automatically while generating the semantic manifest. <br></br> - When running in development, semantic syntax validations run automatically on <Constant name="dbt_platform"/> if `dbt_cloud.yml` is configured. If not, run manually using `mf-validate-configs`. <br></br> - Data platform validations don't run automatically for Fusion. You must run `dbt sl validate` to run data platform validations.|
| <Constant name="platform_cli"/>  | <Constant name="dbt_platform"/>  users | ✅ | ✅ | ✅ | Run any <Constant name="platform_cli"/>  command; validations execute automatically except data platform validations. You must run `dbt sl validate` to run data platform validations.|
| <Constant name="core"/>  | Open source users | ✅ | ✅ | ❌ | Use <Constant name="core"/>  for parsing/builds. Run additional validation manually with the MetricFlow CLI. |
| MetricFlow CLI | Open source users | ✅ | ✅ | ✅ | Run `mf validate-configs` locally to validate and test metrics. |

*Jobs run in **Orchestration** or **Studio IDE** run this validation automatically.

## Parsing

In this validation step, we ensure your config files follow the defined schema for each semantic graph object and can be parsed successfully. It validates the schema for the following core objects:
<VersionBlock lastVersion="1.11">

* Semantic models
* Identifiers
* Measures
* Dimensions
* Metrics
</VersionBlock>
<VersionBlock firstVersion="1.12">
* Semantic models
* Identifiers
* Simple metrics
* Dimensions
* Metrics
</VersionBlock>

## Semantic syntax

This syntactic validation step occurs after we've built your semantic graph. The <Constant name="semantic_layer" />, powered by MetricFlow, runs a suite of tests to ensure that your semantic graph doesn't violate any constraints. For example, we check to see if <VersionBlock lastVersion="1.11">measure</VersionBlock><VersionBlock firstVersion="1.12">simple metric</VersionBlock> names are unique, or if metrics referenced in materialization exist. The current semantic rules we check for are:

<VersionBlock lastVersion="1.11">
1. Check those semantic models with measures have a valid time dimension
2. Check that there is only one primary identifier defined in each semantic model
3. Dimension consistency
4. Unique measures in semantic models
5. Measures in metrics are valid
7. Cumulative metrics are configured properly
</VersionBlock>

<VersionBlock firstVersion="1.12">
1. Check those semantic models with simple metrics have a valid time dimension
2. Check that there is only one primary identifier defined in each semantic model
3. Dimension consistency
4. Unique simple metrics in semantic models
5. Simple metrics are valid
7. Cumulative metrics are configured properly
</VersionBlock>

## Data platform

This type of validation checks to see if the semantic definitions in your semantic graph exist in the underlying physical table. To test this, we run queries against your data platform to ensure the generated SQL for semantic models, dimensions, and metrics will execute.

We run the following checks:

<VersionBlock lastVersion="1.11">
* Measures and dimensions exist
* Underlying tables for data sources exist
* Generated SQL for metrics will execute
</VersionBlock>

<VersionBlock firstVersion="1.12">
* Simple metrics and dimensions exist
* Underlying tables for data sources exist
* Generated SQL for metrics will execute
</VersionBlock>

You can run semantic validations (against your semantic layer) in a CI job to guarantee any code changes made to dbt models don't break these metrics. For more information, refer to [semantic validation in CI](/docs/deploy/ci-jobs#semantic-validations-in-ci).

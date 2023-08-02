---
title: "Legacy dbt Semantic Layer migration guide"
sidebar_label: "Legacy dbt Semantic Layer migration"
description: "Learn how to migrate from the legacy dbt Semantic Layer to the latest one."
tags: [Semantic Layer]
---

The legacy Semantic Layer will be deprecated in H2 2023. Additionally, the `dbt_metrics` package will not be supported in dbt v1.6 and later. If you are using `dbt_metrics`, you'll need to upgrade your configurations before upgrading to v1.6. This guide is for people who have the legacy dbt Semantic Layer setup and would like to migrate to the new dbt Semantic Layer. The estimated migration time is two weeks. 


## Step 1: Migrate metric configs to the new spec

The metrics specification in dbt core is changed in v1.6 to support the integration of MetricFlow. It's strongly recommended that you refer to [Build your metrics](/docs/build/build-metrics-intro) and before getting started so you understand the core concepts of the Semantic Layer. 

dbt Labs recommends completing these steps in a local dev environment instead of the IDE: 

1. Create new Semantic Model configs as YAML files in your dbt project. *
1. Upgrade the metrics configs in your project to the new spec. * 
1. Delete your old metrics file or remove the `.yml` file extension so they're ignored at parse time. Remove the `dbt-metrics` package from your project. Remove any macros that reference `dbt-metrics`, like `metrics.calculate()`. Make sure that any packages you’re using don't have references to the old metrics spec. 
1. Install the CLI with `pip install "dbt-metricflow[your_adapter_name]`. For example: 

    ```bash
    pip install "dbt-metricflow[snowflake]
    ```
    The MetricFlow CLI is not available in the IDE at this time. Support for it is coming soon. 

1. Run `dbt parse`. This parses your project and creates a `semantic_manifest.json` file in your target directory. MetricFlow needs this file to query metrics. If you make changes to your configs, you will need to parse your project again. 
1. Run `mf list metrics` to view the metrics in your project.
1. Test querying a metric by running `mf query --metrics <metric_name> --group-by <dimensions_name>`. For example:
    ```bash
    mf query --metrics revenue --group-by metric_time
    ```
1. Run `mf validate-configs` to run semantic and warehouse validations. This ensures your configs are valid and the underlying objects exist in your warehouse. 
1. Push these changes to a new branch in your repo. 

**To make this process easier, dbt Labs provides a [custom migration tool](https://github.com/dbt-labs/dbt-converter) that automates these steps for you. You can find installation instructions in the [README](https://github.com/dbt-labs/dbt-converter/blob/master/README.md). Derived metrics aren’t supported in the migration tool, and will have to be migrated manually.*

## Step 2: Audit metric values after the migration

You might need to audit metric values during the migration to ensure that the historical values of key business metrics are the same.

1. In the CLI, query the metric(s) and dimensions you want to test and include the `--explain` option. For example:
    ```bash 
    mf query --metrics orders,revenue --group-by metric_time__month,customer_type --explain
    ``` 
1. Use SQL MetricFlow to create a temporary model in your project, like `tmp_orders_revenue audit.sql`. You will use this temporary model to compare against your legacy metrics.
1. If you haven’t already done so, create a model using `metrics.calculate()` for the metrics you want to compare against. For example: 

    ```bash
    select * 
    from {{ metrics.calculate(  
    [metric('orders)',
    metric('revenue)'],
        grain='week',
        dimensions=['metric_time', 'customer_type'],
    ) }}
    ```

1. Run the [dbt-audit](https://github.com/dbt-labs/dbt-audit-helper) helper on both models to compare the metric values.


## Related docs 

- [MetricFlow quickstart guide](/docs/build/sl-getting-started)
- [Example dbt project](https://github.com/dbt-labs/jaffle-sl-template)
- [dbt metrics converter](https://github.com/dbt-labs/dbt-converter)
- [Why we're deprecating the dbt_metrics package](/blog/deprecating-dbt-metrics) blog post
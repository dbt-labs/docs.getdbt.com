---
title: "Semantic Layer Migration"
description: Migration guide for ugpgrading the semantic layer in v1.6
---
**Technical resources:**

- MetricFlow [quickstart guide](https://docs.getdbt.com/docs/build/sl-getting-started)
- [Example dbt project](https://github.com/dbt-labs/jaffle-sl-template)
- [dbt metrics converter](https://github.com/dbt-labs/dbt-converter)
- [dbt_metrics deprecation post](https://docs.getdbt.com/blog/deprecating-dbt-metrics)

## Intro

The legacy Semantic Layer will be deprecated in H2 2023. Additionally, the `dbt_metrics` package will not be support in dbt 1.6 and above. If you are using `dbt_metrics` you will need to upgrade your configurations before upgrading to 1.6. This guide walks through the migration process for users of the legacy semantic layer who want to use to the new Semantic Layer. The estimated migration time is 2 weeks. 

### Step 1: **Migrate Metric configs to the new spec.**

The metrics specification in dbt core has changed in v1.6 in order to support the integration of MetricFlow. It is highly recommended that you read the [MetricFlow docs](https://docs.getdbt.com/docs/build/build-metrics-intro) and before getting started so you understand the core concepts of the Semantic Layer.  We recommend completing these steps in a local dev environment instead of the IDE. To migrate your metrics configs: 
**

1. Creating new Semantic Model configs as YAML files in your dbt project. *
2. Upgrading the Metrics configs in your project to the new spec.* 
3. Delete your old metrics file or remove .yml extension so they are ignored at parse time. Remove the `dbt-metrics` package form your project. Remove any macros that reference `dbt-metrics` i.e like `metrics.calculate()`. Make sure that any packages you’re using do not have references to the old metrics spec. 
4. Install the CLI via `pip install "dbt-metricflow[your_adapter_name]`  i.e `pip install "dbt-metricflow[snowflake]` . The MetricFlow CLI is not available in the IDE. We’re working hard to support it soon 🙂.
5. Run `dbt parse`. This will parse your project and create a `semantic_manifest.json` file in your target directory.  MetricFlow needs this file to query metrics. You will need to re-parse your project when you make changes to your configs. 
6. Run `mf list metrics` to view the metrics in your project
7. Test querying a metric by running `mf query --metrics <metric_name> --group-by <dimensions_name>` i.e `mf query --metrics revenue --group-by metric_time`
8. Run `mf validate-configs` to run semantic and warehouse validations. This ensures are configs are valid, and the underlying objects exist in your warehouse. 
9. Push these changes to a new branch in your repo. 

**To make this process easier, we have [developed a custom migration tool](https://github.com/dbt-labs/dbt-converter) that automates these steps for you.  You can find installation instructions in the [README](https://github.com/dbt-labs/dbt-converter/blob/master/README.md).  Derived metrics aren’t supported in the migration tool, and will have to be migrated manualy*

## Step 2: **Audit metric values after the migration**

You may need to audit metric values during the migration to ensure that the historical values of key business metrics are the same. To audit you metric values follow these steps:

1. In the CLI, query the metric(s) and dimensions you want to test and add the `--explain` option. For examples `mf query --metrics orders,revenue --group-by metric_time__month,customer_type --explain`
2. Use the SQL MetricFlow generates to create a temporary model in your project i.e `tmp_orders_revenue audit.sql`. You will use the model to compare to your legacy metrics.
3. If you haven’t already done so, create a model using metrics.calculate() for the metrics you want to compare i.e 

```bash
select * 
from {{ metrics.calculate(  
[metric('orders)',
metric('revenue)'],
    grain='week',
    dimensions=['metric_time', 'customer_type'],
) }}

```

1. Run [dbt-audit](https://github.com/dbt-labs/dbt-audit-helper) helper on both models to compare the metric values.


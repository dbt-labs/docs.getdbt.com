---
title: "About the sample flag"
description: "Use the sample flag to lower development time and reduce warehouse spend."
sidebar_label: "The sample flag"
pagination_next: null
pagination_prev: "docs/build/empty-flag"
---

# About the `--sample` flag

:::note

The `--sample` flag is not currently available for Python models. If the flag is used with a Python model, it will be ignored.

Seeds will be created normally, but are sampled when referenced by downstream nodes. 

:::

Large data sets can drastically increase build times and reduce how quickly dbt developers can build and test new code. The dbt `--sample` flag can help to reduce build times and warehouse spend by running dbt in sample mode. Sample mode enables you to address cases where you don't need to build the entire model during the development or CI cycle but include enough data to validate the outputs. 

Sample mode takes the [`--empty` flag's](/docs/build/empty-flag) validation of semantic results a step further by including a sampling of data from the model(s) in your development schema. It won't solve every scenario; for example, there are cases where not all joins will be populated. However, it presents a viable solution for faster building, testing, and validating many strategies. 

The `--sample` flag will become more robust over time, but it only supports time-based sampling for now.

## Using the `--sample` flag

The `--sample` flag is available for the [`run`](/reference/commands/run) and [`build`](/reference/commands/build) commands. When used, sample mode generates filtered refs and sources. Since it's using time-based sampling, if you have refs like `{{ ref('some_model') }}` being sampled, you need to set [`event_time`](/reference/resource-configs/event-time) for `some_model` to the field that will be used as the timestamp. 

There are two time-based sample specifications supported for sample mode:
- **Relative time specs:** Filters sampled data from the time the command is run back to a specified integer and granularity. Supported granularities are:
    - Hours
    - Days
    - Months
    - Years
- **Static time specs:** Filters your data between a defined start and end period using date and/or timestamp.


### Examples

Let's say you want to run your `stg_customers` model and build the table in your development schema with a relative time spec sample size of three days. Your command in the IDE would look something like this:

```
dbt run --select path/to/stg_customers --sample="3 days"
```

If you have an even larger model, for example, `stg_orders` you can set sample mode to hours:

```
dbt run --select path/to/stg_customers --sample="6 hours"
```

Next, let's say you want to validate data for your entire business from a sample size further in the past - your busiest week in July, from the first until closing time on the eighth. You can run the following: 

```
dbt run --sample="{'start': '2024-07-01', 'end': '2024-07-08 18:00:00'}"
```

To prevent a `ref` from being sampled, append `.render()` to it:

```sql

with

source as (

    select * from {{ ref('stg_customers').render() }}

),

...

```

dbt will then execute the model SQL against the target data warehouse and build the tables with data from the sample sizes.
 
---
title: MetricFlow time spine
id: metricflow-time-spine
description: "MetricFlow expects a default time spine table called metricflow_time_spine"
sidebar_label: "MetricFlow time spine"
tags: [Metrics, Semantic Layer]
---
<VersionBlock firstVersion="1.9">

<!-- this whole section is for 1.9 and higher + Versionless -->

It's common in analytics engineering to have a date dimension or "time spine" table as a base table for different types of time-based joins and aggregations. The structure of this table is typically a base column of daily or hourly dates, with additional columns for other time grains, like fiscal quarters, defined based on the base column. You can join other tables to the time spine on the base column to calculate metrics like revenue at a point in time, or to aggregate to a specific time grain.

MetricFlow requires you to define at least one dbt model which provides a time-spine, and then specify (in YAML) the columns to be used for time-based joins. MetricFlow will join against the time-spine model for the following types of metrics and dimensions:

- [Cumulative metrics](/docs/build/cumulative)
- [Metric offsets](/docs/build/derived#derived-metric-offset)
- [Conversion metrics](/docs/build/conversion)
- [Slowly Changing Dimensions](/docs/build/dimensions#scd-type-ii)
- [Metrics](/docs/build/metrics-overview) with the `join_to_timespine` configuration set to true

To see the generated SQL for the metric and dimension types that use time spine joins, refer to the respective documentation or add the `compile=True` flag when querying the Semantic Layer to return the compiled SQL.

## Configuring time spine in YAML

 Time spine models are normal dbt models with extra configurations that tell dbt and MetricFlow how to use specific columns by defining their properties. Add the [`models` key](/reference/model-properties) for the time spine in your `models/` directory. If your project already includes a calendar table or date dimension, you can configure that table as a time spine. Otherwise, review the [example time-spine tables](#example-time-spine-tables) to create one.
 
 Some things to note when configuring time spine models:

- Add the configurations under the `time_spine` key for that [model's properties](/reference/model-properties), just as you would add a description or tests.
- You only need to configure time-spine models that the Semantic Layer should recognize.
- At a minimum, define a time-spine table for a daily grain.
- You can optionally define additional time-spine tables for different granularities, like hourly. Review the [granularity considerations](#granularity-considerations) when deciding which tables to create.
- If you're looking to specify the grain of a time dimension so that MetricFlow can transform the underlying column to the required granularity, refer to the [Time granularity documentation](/docs/build/dimensions?dimension=time_gran)

:::tip
If you previously used a model called `metricflow_time_spine`, you no longer need to create this specific model. You can now configure MetricFlow to use any date dimension or time spine table already in your project by updating the `model` setting in the Semantic Layer.

If you don’t have a date dimension table, you can still create one by using the code snippet in the [next section](#creating-a-time-spine-table) to build your time spine model.
:::

### Creating a time spine table  

MetricFlow supports granularities ranging from milliseconds to years. Refer to the [Dimensions page](/docs/build/dimensions?dimension=time_gran#time) (time_granularity tab) to find the full list of supported granularities.

To create a time spine table from scratch, you can do so by adding the following code to your dbt project. 
This example creates a time spine at an hourly grain and a daily grain: `time_spine_hourly` and `time_spine_daily`.

<VersionBlock firstVersion="1.9">
<File name="models/_models.yml">
  
```yaml
[models:](/reference/model-properties) 
# Hourly time spine
  - name: time_spine_hourly 
    description: my favorite time spine
    time_spine:
      standard_granularity_column: date_hour # column for the standard grain of your table, must be date time type.
      custom_granularities:
        - name: fiscal_year
          column_name: fiscal_year_column
    columns:
      - name: date_hour
        granularity: hour # set granularity at column-level for standard_granularity_column

# Daily time spine
  - name: time_spine_daily
    time_spine:
      standard_granularity_column: date_day # column for the standard grain of your table
    columns:
      - name: date_day
        granularity: day # set granularity at column-level for standard_granularity_column
```
</File>
</VersionBlock>

<Lightbox src="/img/time_spines.png" width="50%" title="Time spine directory structure" />

<!--
<VersionBlock lastVersion="1.8">
<File name="models/_models.yml">
  
```yaml
models:
  - name: time_spine_hourly
    description: A date spine with one row per hour, ranging from 2020-01-01 to 2039-12-31.
    time_spine:
      standard_granularity_column: date_hour # column for the standard grain of your table
    columns:
      - name: date_hour
        granularity: hour # set granularity at column-level for standard_granularity_column
  
  - name: time_spine_daily
    description: A date spine with one row per day, ranging from 2020-01-01 to 2039-12-31.
    time_spine:
      standard_granularity_column: date_day # column for the standard grain of your table
    columns:
      - name: date_day
        granularity: day # set granularity at column-level for standard_granularity_column
```

</File>
</VersionBlock>
-->

- This example configuration shows a time spine model called  `time_spine_hourly` and `time_spine_daily`. It sets the time spine configurations under the `time_spine` key. 
- The `standard_granularity_column` is the column that maps to one of our [standard granularities](/docs/build/dimensions?dimension=time_gran). This column must be set under the `columns` key and should have a grain that is finer or equal to any custom granularity columns defined in the same model.
  - It needs to reference a column defined under the `columns` key, in this case, `date_hour` and `date_day`, respectively.
  - It sets the granularity at the column-level using the `granularity` key, in this case, `hour` and `day`, respectively. 
- MetricFlow will use the `standard_granularity_column` as the join key when joining the time spine table to another source table.
- [The `custom_granularities` field](#custom-calendar), (available in Versionless and dbt v1.9 and higher) lets you specify non-standard time periods like `fiscal_year` or `retail_month` that your organization may use.

For an example project, refer to our [Jaffle shop](https://github.com/dbt-labs/jaffle-sl-template/blob/main/models/marts/_models.yml) example.

### Considerations when choosing which granularities to create{#granularity-considerations}

- MetricFlow will use the time spine with the largest compatible granularity for a given query to ensure the most efficient query possible. For example, if you have a time spine at a monthly grain, and query a dimension at a monthly grain, MetricFlow will use the monthly time spine. If you only have a daily time spine, MetricFlow will use the daily time spine and date_trunc to month.
- You can add a time spine for each granularity you intend to use if query efficiency is more important to you than configuration time, or storage constraints. For most engines, the query performance difference should be minimal and transforming your time spine to a coarser grain at query time shouldn't add significant overhead to your queries.
- We recommend having a time spine at the finest grain used in any of your dimensions to avoid unexpected errors. For example, if you have dimensions at an hourly grain, you should have a time spine at an hourly grain.

## Example time spine tables

### Daily

<File name="metricflow_time_spine.sql">

```sql
{{
    config(
        materialized = 'table',
    )
}}

with days as (

    {{
        dbt.date_spine(
            'day',
            "to_date('01/01/2000','mm/dd/yyyy')",
            "to_date('01/01/2025','mm/dd/yyyy')"
        )
    }}

),

final as (
    select cast(date_day as date) as date_day
    from days
)

select * from final
where date_day > dateadd(year, -4, current_timestamp()) 
and date_day < dateadd(day, 30, current_timestamp())
```

### Daily (BigQuery)

Use this model if you're using BigQuery. BigQuery supports `DATE()` instead of `TO_DATE()`:

<File name="metricflow_time_spine.sql">

```sql

{{config(materialized='table')}}
with days as (
    {{dbt.date_spine(
        'day',
        "DATE(2000,01,01)",
        "DATE(2025,01,01)"
    )
    }}
),

final as (
    select cast(date_day as date) as date_day
    from days
)

select *
from final
-- filter the time spine to a specific range
where date_day > dateadd(year, -4, current_timestamp()) 
and date_day < dateadd(day, 30, current_timestamp())
```

</File>

</File>

### Hourly

<File name='time_spine_hourly.sql'>

```sql
{{
    config(
        materialized = 'table',
    )
}}

with hours as (

    {{
        dbt.date_spine(
            'hour',
            "to_date('01/01/2000','mm/dd/yyyy')",
            "to_date('01/01/2025','mm/dd/yyyy')"
        )
    }}

),

final as (
    select cast(date_hour as timestamp) as date_hour
    from hours
)

select * from final
-- filter the time spine to a specific range
where date_day > dateadd(year, -4, current_timestamp()) 
and date_hour < dateadd(day, 30, current_timestamp())
```

</File>


</VersionBlock>

<VersionBlock lastVersion="1.8">

<!-- this whole section is for 1.8 and and lower -->

MetricFlow uses a time spine table to construct cumulative metrics. By default, MetricFlow expects the time spine table to be named `metricflow_time_spine` and doesn't support using a different name. For supported granularities, refer to the [dimensions](/docs/build/dimensions?dimension=time_gran#time) page.

To create this table, you need to create a model in your dbt project called `metricflow_time_spine` and add the following code:

### Daily

<File name='metricflow_time_spine.sql'>


```sql
{{
    config(
        materialized = 'table',
    )
}}

with days as (

    {{
        dbt.date_spine(
            'day',
            "to_date('01/01/2000','mm/dd/yyyy')",
            "to_date('01/01/2025','mm/dd/yyyy')"
        )
    }}

),

final as (
    select cast(date_day as date) as date_day
    from days
)

select * from final
where date_day > dateadd(year, -4, current_timestamp()) 
and date_day  < dateadd(day, 30, current_timestamp())
```

</File>

### Daily (BigQuery)

Use this model if you're using BigQuery. BigQuery supports `DATE()` instead of `TO_DATE()`:

<File name="metricflow_time_spine.sql">

```sql
{{config(materialized='table')}}
with days as (
    {{dbt.date_spine(
        'day',
        "DATE(2000,01,01)",
        "DATE(2025,01,01)"
    )
    }}
),

final as (
    select cast(date_day as date) as date_day
    from days
)

select *
from final
-- filter the time spine to a specific range
where date_day > dateadd(year, -4, current_timestamp()) 
and date_day < dateadd(day, 30, current_timestamp())
```

</File>

You only need to include the `date_day` column in the table. MetricFlow can handle broader levels of detail, but finer grains are only supported in versions 1.9 and higher.

</VersionBlock>


## Custom calendar <Lifecycle status="Preview"/>

<VersionBlock lastVersion="1.8">

The ability to configure custom calendars, such as a fiscal calendar, is available in [dbt Cloud Versionless](/docs/dbt-versions/versionless-cloud) or dbt Core [v1.9 and higher](/docs/dbt-versions/core). 

To access this feature, [upgrade to Versionless](/docs/dbt-versions/upgrade-dbt-version-in-cloud#versionless) or your dbt Core version to v1.9 or higher.

</VersionBlock>

<VersionBlock firstVersion="1.9">

Custom date transformations can be complex, and organizations often have unique needs that can’t be easily generalized. Creating a custom calendar model allows you to define these transformations in SQL, offering more flexibility than native transformations in MetricFlow. This approach lets you map custom columns back to MetricFlow granularities, ensuring consistency while giving you control over the transformations.

For example, if you use a custom calendar in your organization, such as a fiscal calendar, you can configure it in MetricFlow using its date and time operations. 

- This is useful for calculating metrics based on a custom calendar, such as fiscal quarters or weeks. 
- Use the `custom_granularities` key to define a non-standard time period for querying data, such as a `retail_month` or `fiscal_week`, instead of standard options like `day`, `month`, or `year`.
- This feature provides more control over how time-based metrics are calculated.

<Expandable alt_header="Data types and time zone considerations">
 
When working with custom calendars in MetricFlow, it's important to ensure:

- Consistent data types &mdash; Both your dimension column and the time spine column should use the same data type to allow accurate comparisons. Functions like `DATE_TRUNC` don't change the data type of the input in some databases (like Snowflake). Using different data types can lead to mismatches and inaccurate results.

  We recommend using `DATETIME` or `TIMESTAMP` data types for your time dimensions and time spine, as they support all granularities. The `DATE` data type may not support smaller granularities like hours or minutes.

- Time zones &mdash; MetricFlow currently doesn't perform any timezone manipulation. When working with timezone-aware data, inconsistent time zones may lead to unexpected results during aggregations and comparisons.

For example, if your time spine column is `TIMESTAMP` type and your dimension column is `DATE` type, comparisons between these columns might not work as intended. To fix this, convert your `DATE` column to `TIMESTAMP`, or make sure both columns are the same data type.

</Expandable>

### Add custom granularities

To add custom granularities, the Semantic Layer supports custom calendar configurations that allow users to query data using non-standard time periods like `fiscal_year` or `retail_month`. You can define these custom granularities (all lowercased) by modifying your model's YAML configuration like this:

<File name="models/_models.yml">

```yaml
models:
 - name: my_time_spine
   description: my favorite time spine
   time_spine:
      standard_granularity_column: date_day
      custom_granularities:
        - name: fiscal_year
          column_name: fiscal_year_column
```
</File>

#### Coming soon
Note that features like calculating offsets and period-over-period will be supported soon!

</VersionBlock>

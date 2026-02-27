---
title: MetricFlow time spine
id: metricflow-time-spine
description: "MetricFlow expects a default time spine table called metricflow_time_spine"
sidebar_label: "MetricFlow time spine"
tags: [Metrics, Semantic Layer]
---
<VersionBlock firstVersion="1.9">


It's common in analytics engineering to have a date dimension or "time spine" table as a base table for different types of time-based joins and aggregations. The structure of this table is typically a base column of daily or hourly dates, with additional columns for other time grains, like fiscal quarters, defined based on the base column. You can join other tables to the time spine on the base column to calculate metrics like revenue at a point in time, or to aggregate to a specific time grain.

To use MetricFlow with time-based metrics and dimensions, you _must_ provide a time spine. This table serves as the foundation for time-based joins and aggregations. You can either:

- Create a time spine from scratch (check out the [example time spine](#example-time-spine-tables) section for examples), or
- Use an existing table in your project, like a `dim_date` table

And once you have a time spine, you need to configure it in YAML to tell MetricFlow how to use it.

## Prerequisites
MetricFlow requires you to define at least one dbt model which provides a time-spine, and then specify (in YAML) the columns to be used for time-based joins. This means you need to:

- Define at least one [time spine](#example-time-spine-tables) at whichever granularity needed for your metrics (like daily or hourly). You can optionally define additional tables for coarser grains (like monthly or yearly).
- [Configure each time spine in a properties YAML file](#configuring-time-spine-in-yaml) to define how MetricFlow recognizes and uses its columns.

Note that you can't have overlapping time spines.

MetricFlow will then join against the time spine model for the following types of metrics and dimensions:

- [Cumulative metrics](/docs/build/cumulative)
- [Metric offsets](/docs/build/derived#derived-metric-offset)
- [Conversion metrics](/docs/build/conversion)
- [Slowly Changing Dimensions](/docs/build/dimensions#scd-type-ii)
- [Metrics](/docs/build/metrics-overview) with the `join_to_timespine` configuration set to true

To see the generated SQL for the metric and dimension types that use time spine joins, refer to the respective documentation or add the `compile=true` flag when querying the <Constant name="semantic_layer" /> to return the compiled SQL.

## Configuring time spine in YAML

:::tip Use our mini guide to create a time spine table
For a quick start guide on how to create a time spine table, check out our [MetricFlow time spine mini guide](/guides/mf-time-spine)!
:::

 Time spine models are normal dbt models with extra configurations that tell dbt and MetricFlow how to use specific columns by defining their properties. Add the [`models` key](/reference/model-properties) for the time spine in your `models/` directory. If your project already includes a calendar table or date dimension, you can configure that table as a time spine. Otherwise, review the [example time-spine tables](#example-time-spine-tables) to create one. If the relevant model file doesn't exist, create it and add the configuration mentioned in the [next section](#creating-a-time-spine-table).
 
 Some things to note when configuring time spine models:

- Make sure you already have a time spine SQL table defined in your project.
- Add the configurations under the `time_spine` key for that [model's properties](/reference/model-properties), just as you would add a description or tests.
- You only need to configure time-spine models that the <Constant name="semantic_layer" /> should recognize.
- At a minimum, define a time-spine table for a daily grain.
- You can optionally define additional time-spine tables for different granularities, like hourly. Review the [granularity considerations](#granularity-considerations) when deciding which tables to create.
- If you're looking to specify the grain of a time dimension so that MetricFlow can transform the underlying column to the required granularity, refer to the [Time granularity documentation](/docs/build/dimensions?dimension=time_gran)

:::tip
- If you previously used a `metricflow_time_spine.sql` model, you can delete it after configuring the `time_spine` property in YAML. The <Constant name="semantic_layer" /> automatically recognizes the new configuration. No additional `.yml` files are needed. 
- You can also configure MetricFlow to use any date dimension or time spine table already in your project by updating the `model` setting in the <Constant name="semantic_layer" />.
- If you don’t have a date dimension table, you can still create one by using the code snippet in the [next section](#creating-a-time-spine-table) to build your time spine model.
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
          column_name: fiscal_year_column # must refer to a column defined in the model
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

- This example configuration shows a time spine model called  `time_spine_hourly` and `time_spine_daily`. It sets the time spine configurations under the `time_spine` key. 
- The `standard_granularity_column` is the column that maps to one of our [standard granularities](/docs/build/dimensions?dimension=time_gran). This column must be set under the `columns` key and should have a grain that is finer or equal to any custom granularity columns defined in the same model.
  - It needs to reference a column defined under the `columns` key, in this case, `date_hour` and `date_day`, respectively.
  - It sets the granularity at the column-level using the `granularity` key, in this case, `hour` and `day`, respectively. 
- MetricFlow will use the `standard_granularity_column` as the join key when joining the time spine table to another source table.
- [The `custom_granularities` field](#custom-calendar), (available in <Constant name="cloud" /> Latest and dbt Core v1.9 and higher) lets you specify non-standard time periods like `fiscal_year` or `retail_month` that your organization may use.
  - The `column_name` field must reference a column that exists in the same model.

For an example project, refer to our [Jaffle shop](https://github.com/dbt-labs/jaffle-sl-template/blob/main/models/marts/_models.yml) example.

### Migrating from SQL to YAML

If you already have a SQL model that defines your time spine, you can reference that model directly in the YAML file. If you don't have a SQL model that defines your time spine, add one before proceeding to the following steps. 

1. Add the following configuration to a new or existing properties YAML file using the [`models` key](/reference/model-properties) for the time spine in your `models/` directory. Name the properties YAML file whatever you want (for example, `util/_models.yml`):

  <File name="models/_models.yml">

  ```yaml
  models:
    - name: all_days
      description: A time spine with one row per day, ranging from 2020-01-01 to 2039-12-31.
      time_spine:
        standard_granularity_column: date_day  # Column for the standard grain of your table
      columns:
        - name: date_day
          granularity: day  # Set the granularity of the column
  ```
  </File>

2. After adding the YAML configuration and ensuring you have a SQL model that defines the time spine, you can delete the existing `metricflow_time_spine.sql` file from your project to avoid any deprecation warnings or errors.

3. Test the configuration to ensure compatibility with your production jobs.

Note that if you're migrating from a `metricflow_time_spine.sql` file:

- Replace its functionality by adding the `time_spine` property to YAML as shown in the previous example.
- Once configured, MetricFlow will recognize the YAML settings, and then the SQL model file can be safely removed.

### Considerations when choosing which granularities to create{#granularity-considerations}

- MetricFlow will use the time spine with the largest compatible granularity for a given query to ensure the most efficient query possible. For example, if you have a time spine at a monthly grain, and query a dimension at a monthly grain, MetricFlow will use the monthly time spine. If you only have a daily time spine, MetricFlow will use the daily time spine and `date_trunc` to month.
- You can add a time spine for each granularity you intend to use if query efficiency is more important to you than configuration time, or storage constraints. For most engines, the query performance difference should be minimal and transforming your time spine to a coarser grain at query time shouldn't add significant overhead to your queries.
- We recommend having a time spine at the finest grain used in any of your dimensions to avoid unexpected errors. For example, if you have dimensions at an hourly grain, you should have a time spine at an hourly grain.

## Example time spine tables

The following examples show how to create time spine tables at different granularities:

<!-- no toc -->
- [Seconds](#seconds)
- [Minutes](#minutes)
- [Daily](#daily)
- [Daily (BigQuery)](#daily-bigquery)
- [Hourly](#hourly)

### Seconds

<File name="metricflow_time_spine.sql">

```sql
{{ config(materialized='table') }}

with seconds as (

    {{
        dbt.date_spine(
            'second',
            "date_trunc('second', dateadd(second, -10, current_timestamp()))",
            "date_trunc('second', current_timestamp())"
        )
    }}

),

final as (
    select cast(date_second as timestamp) as second_timestamp
    from seconds
)

select * from final

```
</File>

### Minutes

<File name="metricflow_time_spine.sql">

```sql
{{ config(materialized='table') }}

with minutes as (

    {{
        dbt.date_spine(
            'minute',
            "date_trunc('minute', dateadd(minute, -5, current_timestamp()))",
            "date_trunc('minute', current_timestamp())"
        )
    }}

),

final as (
    select cast(date_minute as timestamp) as minute_timestamp
    from minutes
)

select * from final
```

</File>

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
where date_day > date_add(DATE(current_timestamp()), INTERVAL -4 YEAR)
and date_day < date_add(DATE(current_timestamp()), INTERVAL 30 DAY)
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


## Custom calendar <Lifecycle status="Preview"/>

:::tip
Check out our mini guide on [how to create a time spine table](/guides/mf-time-spine) to get started!
:::


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

To add custom granularities, the <Constant name="semantic_layer" /> supports custom calendar configurations that allow users to query data using non-standard time periods like `fiscal_year` or `retail_month`. You can define these custom granularities (all lowercased) by modifying your model's YAML configuration like this:

<File name="models/_models.yml">

```yaml
models:
 - name: my_time_spine
   description: my favorite time spine
   time_spine:
      standard_granularity_column: date_day
      custom_granularities:
        - name: fiscal_year
          column_name: fiscal_year_column # must refer to a column defined in the model
```
</File>

#### Coming soon
Note that features like calculating offsets and period-over-period will be supported soon!

</VersionBlock>


## Related docs

- [MetricFlow time granularity](/docs/build/dimensions?dimension=time_gran#time)
- [MetricFlow time spine mini guide](/guides/mf-time-spine)

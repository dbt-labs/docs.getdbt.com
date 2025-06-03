---
title: "Quickstart with MetricFlow time spine"
id: "mf-time-spine"
level: 'Intermediate'
icon: 'guides'
tags: ['Quickstart', 'Semantic Layer']
hide_table_of_contents: true
---

<div style={{maxWidth: '900px'}}>

## Introduction

This guide explains how to configure a time spine using the [<Constant name="semantic_layer" /> Jaffle shop example project](https://github.com/dbt-labs/jaffle-sl-template) as a reference. 

### What is a time spine model?

A [time spine](/docs/build/metricflow-time-spine) is essential for time-based joins and aggregations in MetricFlow, the engine that powers the <Constant name="semantic_layer" />.

To use MetricFlow with time-based metrics and dimensions, you must provide a time spine. This serves as the foundation for time-based joins and aggregations. You can either:

- Create a time spine SQL model from scratch, or
- Use an existing model in your project, like `dim_date`.

And once you have a time spine, you need to configure it in YAML to tell MetricFlow how to use it. This guide will show you how to do both!

### Prerequisites
Before you start, make sure you have:

- A dbt project set up. If you don't have one, follow the [<Constant name="semantic_layer" /> quickstart guide](/guides/sl-snowflake-qs?step=1) or the [<Constant name="cloud" /> quickstart guides](/guides?tags=Quickstart) guide to help you get started.

## Add a time spine SQL model

Let's get started by assuming you're creating a time spine from scratch. If you have a dbt project set up already and have your own time spine (like a `dim_date` type model), you can skip this step and go to [Use an existing dim_date model](https://docs.getdbt.com//guides/mf-time-spine#using-an-existing-dim-date-model).

The time spine is a dbt model that generates a series of dates (or timestamps) at a specific granularity. In this example, let's create a daily time spine &mdash; `time_spine_daily.sql`. 

1. Navigate to the `models/marts` directory in your dbt project.
2. Add a new SQL file named `time_spine_daily.sql` with the following content:

    <File name='models/marts/time_spine_daily.sql'>

    ```sql
    {{
        config(
            materialized = 'table',
        )
    }}

    with

    base_dates as (
        {{
            dbt.date_spine(
                'day',
                "DATE('2000-01-01')",
                "DATE('2030-01-01')"
            )
        }}
    ),

    final as (
        select
            cast(date_day as date) as date_day
        from base_dates
    )

    select *
    from final
    where date_day > dateadd(year, -5, current_date())  -- Keep recent dates only
      and date_day < dateadd(day, 30, current_date())
    ```
    </File>
      
      This generates a model of daily dates ranging from 5 years in the past to 30 days into the future.

3. Run and preview the model to create the model:
    ```bash
    dbt run --select time_spine_daily 
    dbt show --select time_spine_daily # Use this command to preview the model if developing locally
    ```

4. If developing in the <Constant name="cloud_ide" />, you can preview the model by clicking the **Preview** button:
   <Lightbox src="/img/mf-guide-preview-time-spine-table.jpg" title="Preview the time spine model in the Studio IDE" />

## Add YAML configuration for the time spine

Now that you've created the SQL file, configure it in YAML so MetricFlow can recognize and use it.

1. Navigate to the `models/marts` directory.
2. Add a new YAML file named `_models.yml` with the following content:

    <File name='models/marts/_models.yml'>

    ```yaml
    models:
      - name: time_spine_daily
        description: A time spine with one row per day, ranging from 5 years in the past to 30 days into the future.
        time_spine:
          standard_granularity_column: date_day  # The base column used for time joins
        columns:
          - name: date_day
            description: The base date column for daily granularity
            granularity: day
    ```
    </File>

This time spine YAML file:
- Defines `date_day` as the base column for daily granularity.
- Configures `time_spine` properties so MetricFlow can use the model.

### Using an existing dim_date model

This optional approach reuses an existing model, saving you the effort of creating a new one. However if you created a time spine from scratch, you can skip this section. 

If your project already includes a `dim_date` or similar model, you can configure it as a time spine:

1. Locate the existing model (`dim_date`).
2. Update `_models.yml` file to configure it as a time spine:

    <File name='_models.yml'>

    ```yaml
    models:
      - name: dim_date
        description: An existing date dimension model used as a time spine.
        time_spine:
          standard_granularity_column: date_day
        columns:
          - name: date_day
            granularity: day
          - name: day_of_week
            granularity: day
          - name: full_date
            granularity: day
    ```
    </File>

    This time spine YAML file configures the `time_spine` property so MetricFlow can use the model.

## Run and preview the time spine

For the time spine you created, let's run it and preview the output if you haven't already done this. If you have already run the model, you can skip this step.

1. Run the following command:
   ```bash
   dbt run --select time_spine_daily
   dbt show --select time_spine_daily # Use this command to preview the model if developing locally
   ```

2. If developing in the <Constant name="cloud_ide" />, you can preview the model by clicking the **Preview** button:
    <Lightbox src="/img/mf-guide-preview-time-spine-table.jpg" title="Preview the time spine model in the Studio IDE" />

3. Check that the model:
   - Contains one row per day.
   - Covers the date range you want (5 years back to 30 days forward).

4. (Optional) If you have [metrics](/docs/build/metrics-overview) already defined in your project, you can query the model/metrics using [<Constant name="semantic_layer" /> commands](/docs/build/metricflow-commands) to validate the time spine. 
   
   Let's say you have a `revenue` metric defined. You can query the model/metrics using the following command:

    ```bash
    dbt sl query --metrics revenue --group-by metric_time
    ```

    This will output results similar to the following in the <Constant name="cloud_ide" />:
    <Lightbox src="/img/quickstarts/dbt-cloud/validate-mf-timespine-output.jpg" title="Validate the metrics and time spine output in the Studio IDE" />

5. Double check that the results are correct and returning the expected data.

## Add additional granularities

This section is optional and will show you how to add additional granularities to your time spine:

- [Yearly](#yearly-time-spine)
- [Custom calendars](#custom-calendars)

### Yearly time spine

To support multiple granularities (like hourly, yearly, monthly), create additional time spine models and configure them in YAML.

1. Add a new SQL file named `time_spine_yearly.sql` with the following content:
    <File name='models/marts/time_spine_yearly.sql'>

    ```sql
    {{
        config(
            materialized = 'table',
        )
    }}

    with years as (

        {{
            dbt.date_spine(
                'year',
                "to_date('01/01/2000','mm/dd/yyyy')",
                "to_date('01/01/2025','mm/dd/yyyy')"
            )
        }}

    ),

    final as (
        select cast(date_year as date) as date_year
        from years
    )

    select * from final
    -- filter the time spine to a specific range
    where date_year >= date_trunc('year', dateadd(year, -4, current_timestamp())) 
      and date_year < date_trunc('year', dateadd(year, 1, current_timestamp()))


    ```
    </File>

2. Then update the `_models.yml` file and add the yearly time spine (below the daily time spine config):
      
    <File name='_models.yml'>

    ```yaml
    models:
      - name: time_spine_daily
        ... rest of the daily time spine config ...

      - name: time_spine_yearly
        description: time spine one row per house
        time_spine:
          standard_granularity_column: date_year
        columns:
          - name: date_year
            granularity: year
    ```
    </File>

3. Run or preview the model to create the model:
   ```bash
   dbt run --select time_spine_yearly
   dbt show --select time_spine_yearly # Use this command to preview the model if developing locally
   ```

4. Validate the output by querying the generated model:
   ```bash
   dbt sl query --metrics orders --group-by metric_time__year
   ```

If you're developing in the <Constant name="cloud_ide" />, you can preview the model by clicking the **Preview** button.
   <Lightbox src="/img/mf-guide-query.jpg" title="Validate the metrics and time spine output in the Studio IDE" />

:::tip Extra credit!
For some extra practice, try one of the following exercises:

- Order the `dbt sl query --metrics orders --group-by metric_time__year` command output by ascending order of `metric_time__year`. Check out the [dbt Semantic Layer commands](/docs/build/metricflow-commands#query) docs for more information on how to do this.
- Filter to this year and last year only to limit data returned.
- Try creating a monthly time spine &mdash; duplicate your daily time spine model, adjust it to generate one row per month, and update the YAML file to include `granularity: month`. Give it a try!
:::

### Custom calendars

To support custom calendars (like fiscal years, fiscal quarters, and so on), create an additional time spine and configure it in YAML. This feature is available in the <Constant name="cloud" />'s [Latest release track](/docs/dbt-versions/cloud-release-tracks) or [<Constant name="core" /> 1.9 and later](/docs/dbt-versions/core-upgrade/upgrading-to-v1.9).

1. Add a new SQL file named `fiscal_calendar.sql` with the following content (or use your own custom calendar and configure it in YAML):
    <File name='models/marts/fiscal_calendar.sql'>

    ```sql
        with date_spine as (

        select 
            date_day,
            extract(year from date_day) as calendar_year,
            extract(week from date_day) as calendar_week

        from {{ ref('time_spine_daily') }}

    ),

    fiscal_calendar as (

        select
            date_day,
            -- Define custom fiscal year starting in October
            case 
                when extract(month from date_day) >= 10 
                    then extract(year from date_day) + 1
                else extract(year from date_day) 
            end as fiscal_year,

            -- Define fiscal weeks (e.g., shift by 1 week)
            extract(week from date_day) + 1 as fiscal_week

        from date_spine

    )

    select * from fiscal_calendar
    ```

    </File>

2. Then update `_models.yml` file and add the fiscal calendar time spine (below the yearly time spine config):
    <File name='_models.yml'>

    ```yaml
    models:
      - name: time_spine_yearly
        ... rest of the yearly time spine config ...  
        
      - name: fiscal_calendar
        description: A custom fiscal calendar with fiscal year and fiscal week granularities.
        time_spine:
          standard_granularity_column: date_day
          custom_granularities:
            - name: fiscal_year
              column_name: fiscal_year
            - name: fiscal_week
              column_name: fiscal_week
        columns:
          - name: date_day
            granularity: day
          - name: fiscal_year
            description: "Custom fiscal year starting in October"
          - name: fiscal_week
            description: "Fiscal week, shifted by 1 week from standard calendar"
    ```
    </File>

3. Run or preview the model to create the model:
   ```bash
   dbt run --select fiscal_calendar
   dbt show --select fiscal_calendar # Use this command to preview the model if developing locally
   ```

   If you're developing in the <Constant name="cloud_ide" />, you can preview the model by clicking the **Preview** button.

4. Validate the output by querying the generated model along with your metrics:
   ```bash
   dbt sl query --metrics orders --group-by metric_time__fiscal_year
   ```

   <Lightbox src="/img/mf-guide-fiscal-preview.jpg" title="Validate the custom calendar metrics and time spine output in the Studio IDE" />


## What's next

<ConfettiTrigger>

Congratulations 🎉! You've set up a time spine and are ready to bring the benefits of MetricFlow and the <Constant name="semantic_layer" /> to your organization. You've learned:

- How to create a time spine or use an existing model.
- How to configure a time spine in YAML.
- How to add additional granularities to your time spine.

Here are some additional resources to help you continue your journey:

- [MetricFlow time spine](/docs/build/metricflow-time-spine)
- [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl)
- [Build metrics](/docs/build/metrics-overview)
- [Quickstart with <Constant name="semantic_layer" />](/guides/sl-snowflake-qs?step=1)

</ConfettiTrigger>

</div>

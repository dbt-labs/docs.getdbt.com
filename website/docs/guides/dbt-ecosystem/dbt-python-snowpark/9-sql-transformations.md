---
title: "SQL transformations" 
id: "9-sql-transformations"
description: "SQL transformations"
---

Now that we have all our sources and staging models done, it's time to move into where dbt shines &mdash; transformation!

We need to:

- Create some intermediate tables to join tables that aren’t hierarchical
- Create core tables for business intelligence (BI) tool ingestion
- Answer the two questions about:
    - fastest pit stops
    - lap time trends about our Formula 1 data by creating aggregate models using python!

## Intermediate models

We need to join lots of reference tables to our results table to create a human readable dataframe. What does this mean? For example, we don’t only want to have the numeric `status_id` in our table, we want to be able to read in a row of data that a driver could not finish a race due to engine failure (`status_id=5`).

By now, we are pretty good at creating new files in the correct directories so we won’t cover this in detail. All intermediate models should be created in the path `models/intermediate`.

1. Create a new file called `int_lap_times_years.sql`. In this model, we are joining our lap time and race information so we can look at lap times over years. In earlier Formula 1 eras, lap times were not recorded (only final results), so we filter out records where lap times are null.

    ```sql
    with lap_times as (

        select * from {{ ref('stg_f1_lap_times') }}

    ),

    races as (

        select * from {{ ref('stg_f1_races') }}

    ),

    expanded_lap_times_by_year as (
        select
            lap_times.race_id,
            driver_id,
            race_year,
            lap,
            lap_time_milliseconds
        from lap_times
        left join races
            on lap_times.race_id = races.race_id
        where lap_time_milliseconds is not null
    )

    select * from expanded_lap_times_by_year
    ```

2. Create a file called `in_pit_stops.sql`. Pit stops are a many-to-one (M:1) relationship with our races. We are creating a feature called `total_pit_stops_per_race` by partitioning over our `race_id` and `driver_id`, while preserving individual level pit stops for rolling average in our next section.

    ```sql
    with stg_f1__pit_stops as
    (
        select * from {{ ref('stg_f1_pit_stops') }}
    ),

    pit_stops_per_race as (
        select
            race_id,
            driver_id,
            stop_number,
            lap,
            lap_time_formatted,
            pit_stop_duration_seconds,
            pit_stop_milliseconds,
            max(stop_number) over (partition by race_id,driver_id) as total_pit_stops_per_race
        from stg_f1__pit_stops
    )

    select * from pit_stops_per_race
    ```

3. Create a file called `int_results.sql`. Here we are using 4 of our tables &mdash; `races`, `drivers`, `constructors`, and `status` &mdash; to give context to our `results` table. We are now able to calculate a new feature `drivers_age_years` by bringing the `date_of_birth` and `race_year` into the same table. We are also creating a column to indicate if the driver did not finish (dnf) the race, based upon if their `position` was null called, `dnf_flag`.

    ```sql
    with results as (

        select * from {{ ref('stg_f1_results') }}

    ),

    races as (

        select * from {{ ref('stg_f1_races') }}

    ),

    drivers as (

        select * from {{ ref('stg_f1_drivers') }}

    ),

    constructors as (

        select * from {{ ref('stg_f1_constructors') }}
    ),

    status as (

        select * from {{ ref('stg_f1_status') }}
    ),

    int_results as (
        select
            result_id,
            results.race_id,
            race_year,
            race_round,
            circuit_id,
            circuit_name,
            race_date,
            race_time,
            results.driver_id,
            results.driver_number,
            forename ||' '|| surname as driver,
            cast(datediff('year', date_of_birth, race_date) as int) as drivers_age_years,
            driver_nationality,
            results.constructor_id,
            constructor_name,
            constructor_nationality,
            grid,
            position,
            position_text,
            position_order,
            points,
            laps,
            results_time_formatted,
            results_milliseconds,
            fastest_lap,
            results_rank,
            fastest_lap_time_formatted,
            fastest_lap_speed,
            results.status_id,
            status,
            case when position is null then 1 else 0 end as dnf_flag
        from results
        left join races
            on results.race_id=races.race_id
        left join drivers
            on results.driver_id = drivers.driver_id
        left join constructors
            on results.constructor_id = constructors.constructor_id
        left join status
            on results.status_id = status.status_id
    )

    select * from int_results
    ```
1. Create a *Markdown* file `intermediate.md` that we will go over in depth during the [Testing](/guides/dbt-ecosystem/dbt-python-snowpark/13-testing) and [Documentation](/guides/dbt-ecosystem/dbt-python-snowpark/14-documentation) sections.

    ```markdown
    # the intent of this .md is to allow for multi-line long form explanations for our intermediate transformations

    # below are descriptions 
    {% docs int_results %} In this query we want to join out other important information about the race results to have a human readable table about results, races, drivers, constructors, and status. 
    We will have 4 left joins onto our results table. {% enddocs %}

    {% docs int_pit_stops %} There are many pit stops within one race, aka a M:1 relationship. 
    We want to aggregate this so we can properly join pit stop information without creating a fanout.  {% enddocs %}

    {% docs int_lap_times_years %} Lap times are done per lap. We need to join them out to the race year to understand yearly lap time trends. {% enddocs %}
    ```
1. Create a *YAML* file `intermediate.yml` that we will go over in depth during the [Testing](/guides/dbt-ecosystem/dbt-python-snowpark/13-testing) and [Documentation](/guides/dbt-ecosystem/dbt-python-snowpark/14-documentation) sections.

    ```yaml
    version: 2

    models:
     - name: int_results
       description: '{{ doc("int_results") }}'
     - name: int_pit_stops
       description: '{{ doc("int_pit_stops") }}'
     - name: int_lap_times_years
       description: '{{ doc("int_lap_times_years") }}'
    ```
    That wraps up the intermediate models we need to create our core models!

## Core models

1. Create a file `fct_results.sql`. This is what I like to refer to as the “mega table” &mdash; a really large denormalized table with all our context added in at row level for human readability. Importantly, we have a table `circuits` that is linked through the table `races`. When we joined `races` to `results` in `int_results.sql` we allowed our tables to make the connection from `circuits` to `results` in `fct_results.sql`. We are only taking information about pit stops at the result level so our join would not cause a [fanout](https://community.looker.com/technical-tips-tricks-1021/what-is-a-fanout-23327).

    ```sql
    with int_results as (

        select * from {{ ref('int_results') }}

    ),

    int_pit_stops as (
        select
            race_id,
            driver_id,
            max(total_pit_stops_per_race) as total_pit_stops_per_race
        from {{ ref('int_pit_stops') }}
        group by 1,2
    ),

    circuits as (

        select * from {{ ref('stg_f1_circuits') }}
    ),
    base_results as (
        select
            result_id,
            int_results.race_id,
            race_year,
            race_round,
            int_results.circuit_id,
            int_results.circuit_name,
            circuit_ref,
            location,
            country,
            latitude,
            longitude,
            altitude,
            total_pit_stops_per_race,
            race_date,
            race_time,
            int_results.driver_id,
            driver,
            driver_number,
            drivers_age_years,
            driver_nationality,
            constructor_id,
            constructor_name,
            constructor_nationality,
            grid,
            position,
            position_text,
            position_order,
            points,
            laps,
            results_time_formatted,
            results_milliseconds,
            fastest_lap,
            results_rank,
            fastest_lap_time_formatted,
            fastest_lap_speed,
            status_id,
            status,
            dnf_flag
        from int_results
        left join circuits
            on int_results.circuit_id=circuits.circuit_id
        left join int_pit_stops
            on int_results.driver_id=int_pit_stops.driver_id and int_results.race_id=int_pit_stops.race_id
    )

    select * from base_results
    ```

1. Create the file `pit_stops_joined.sql`. Our results and pit stops are at different levels of dimensionality (also called grain). Simply put, we have multiple pit stops per a result. Since we are interested in understanding information at the pit stop level with information about race year and constructor, we will create a new table `pit_stops_joined.sql` where each row is per pit stop. Our new table tees up our aggregation in Python.

    ```sql
    with base_results as (

        select * from {{ ref('fct_results') }}
    
    ), 

    pit_stops as (

        select * from {{ ref('int_pit_stops') }}
    
    ),

    pit_stops_joined as (

        select 
            base_results.race_id,
            race_year,
            base_results.driver_id,
            constructor_id,
            constructor_name,
            stop_number,
            lap, 
            lap_time_formatted,
            pit_stop_duration_seconds, 
            pit_stop_milliseconds
        from base_results
        left join pit_stops
            on base_results.race_id=pit_stops.race_id and base_results.driver_id=pit_stops.driver_id
    )
    select * from pit_stops_joined
    ```

1. Enter in the command line and execute `dbt build` to build out our entire pipeline to up to this point. Don’t worry about “overriding” your previous models – dbt workflows are designed to be <Term id="idempotent">idempotent</Term> so we can run them again and expect the same results.

1. Let’s talk about our lineage so far. It’s looking good 😎. We’ve shown how SQL can be used to make data type, column name changes, and handle hierarchical joins really well; all while building out our automated lineage!

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/9-sql-transformations/1-dag.png" title="The DAG"/>

1. Time to **Commit and push** our changes and give your commit a message like `intermediate and fact models` before moving on.

---
title: "Sources and staging" 
id: "8-sources-and-staging"
description: "Sources and staging"
---

In this section, we are going to create our source and staging models.

Sources allow us to create a dependency between our source database object and our staging models which will help us when we look at <Term id="data-lineage" /> later. Also, if your source changes database or schema, you only have to update it in your `f1_sources.yml` file rather than updating all of the models it might be used in.

Staging models are the base of our project, where we bring all the individual components we're going to use to build our more complex and useful models into the project.

Since we want to focus on dbt and Python in this workshop, check out our [sources](/docs/build/sources) and [staging](/best-practices/how-we-structure/2-staging) docs if you want to learn more (or take our [dbt Fundamentals](https://courses.getdbt.com/collections) course which covers all of our core functionality).

## Create sources

We're going to be using each of our 8 Formula 1 tables from our `formula1` database under the `raw`  schema for our transformations and we want to create those tables as sources in our project.

1. Create a new file called `f1_sources.yml` with the following file path: `models/staging/formula1/f1_sources.yml`.
2. Then, paste the following code into the file before saving it:

```yaml
version: 2

sources:
  - name: formula1
    description: formula 1 datasets with normalized tables 
    database: formula1 
    schema: raw
    tables:
      - name: circuits
        description: One record per circuit, which is the specific race course. 
        columns:
          - name: circuitid
            tests:
            - unique
            - not_null
      - name: constructors 
        description: One record per constructor. Constructors are the teams that build their formula 1 cars. 
        columns:
          - name: constructorid
            tests:
            - unique
            - not_null
      - name: drivers
        description: One record per driver. This table gives details about the driver. 
        columns:
          - name: driverid
            tests:
            - unique
            - not_null
      - name: lap_times
        description: One row per lap in each race. Lap times started being recorded in this dataset in 1984 and joined through driver_id.
      - name: pit_stops 
        description: One row per pit stop. Pit stops do not have their own id column, the combination of the race_id and driver_id identify the pit stop.
        columns:
          - name: stop
            tests:
              - accepted_values:
                  values: [1,2,3,4,5,6,7,8]
                  quote: false            
      - name: races 
        description: One race per row. Importantly this table contains the race year to understand trends. 
        columns:
          - name: raceid
            tests:
            - unique
            - not_null        
      - name: results
        columns:
          - name: resultid
            tests:
            - unique
            - not_null   
        description: One row per result. The main table that we join out for grid and position variables.
      - name: status
        description: One status per row. The status contextualizes whether the race was finished or what issues arose e.g. collisions, engine, etc. 
        columns:
          - name: statusid
            tests:
            - unique
            - not_null
```

## Create staging models

The next step is to set up the staging models for each of the 8 source tables. Given the one-to-one relationship between staging models and their corresponding source tables, we'll build 8 staging models here. We know it’s a lot and in the future, we will seek to update the workshop to make this step less repetitive and more efficient. This step is also a good representation of the real world of data, where you have multiple hierarchical tables that you will need to join together!

1. Let's go in alphabetical order to easily keep track of all our staging models! Create a new file called `stg_f1_circuits.sql` with this file path `models/staging/formula1/stg_f1_circuits.sql`. Then, paste the following code into the file before saving it:

    ```sql
    with

    source  as (

        select * from {{ source('formula1','circuits') }}

    ),

    renamed as (
        select
            circuitid as circuit_id,
            circuitref as circuit_ref,
            name as circuit_name,
            location,
            country,
            lat as latitude,
            lng as longitude,
            alt as altitude
            -- omit the url
        from source
    )
    select * from renamed
    ```

    All we're doing here is pulling the source data into the model using the `source` function, renaming some columns, and omitting the column `url` with a commented note since we don’t need it for our analysis.

1. Create `stg_f1_constructors.sql` with this file path `models/staging/formula1/stg_f1_constructors.sql`. Paste the following code into it before saving the file:

    ```sql
    with

    source  as (

        select * from {{ source('formula1','constructors') }}

    ),

    renamed as (
        select
            constructorid as constructor_id,
            constructorref as constructor_ref,
            name as constructor_name,
            nationality as constructor_nationality
            -- omit the url
        from source
    )

    select * from renamed
    ```

    We have 6 other stages models to create. We can do this by creating new files, then copy and paste the code into our `staging` folder.

1. Create `stg_f1_drivers.sql` with this file path `models/staging/formula1/stg_f1_drivers.sql`:

    ```sql
    with

    source  as (

        select * from {{ source('formula1','drivers') }}

    ),

    renamed as (
        select
            driverid as driver_id,
            driverref as driver_ref,
            number as driver_number,
            code as driver_code,
            forename,
            surname,
            dob as date_of_birth,
            nationality as driver_nationality
            -- omit the url
        from source
    )

    select * from renamed
    ```
1. Create `stg_f1_lap_times.sql` with this file path `models/staging/formula1/stg_f1_lap_times.sql`:

    ```sql
    with

    source  as (

        select * from {{ source('formula1','lap_times') }}

    ),

    renamed as (
        select
            raceid as race_id,
            driverid as driver_id,
            lap,
            position,
            time as lap_time_formatted,
            milliseconds as lap_time_milliseconds
        from source
    )

    select * from renamed
    ```
1. Create `stg_f1_pit_stops.sql` with this file path `models/staging/formula1/stg_f1_pit_stops.sql`:

    ```sql
    with

    source  as (

        select * from {{ source('formula1','pit_stops') }}

    ),

    renamed as (
        select
            raceid as race_id,
            driverid as driver_id,
            stop as stop_number,
            lap,
            time as lap_time_formatted,
            duration as pit_stop_duration_seconds,
            milliseconds as pit_stop_milliseconds
        from source
    )

    select * from renamed
    order by pit_stop_duration_seconds desc
    ```

1. Create ` stg_f1_races.sql` with this file path `models/staging/formula1/stg_f1_races.sql`:

    ```sql
    with

    source  as (

        select * from {{ source('formula1','races') }}

    ),

    renamed as (
        select
            raceid as race_id,
            year as race_year,
            round as race_round,
            circuitid as circuit_id,
            name as circuit_name,
            date as race_date,
            to_time(time) as race_time,
            -- omit the url
            fp1_date as free_practice_1_date,
            fp1_time as free_practice_1_time,
            fp2_date as free_practice_2_date,
            fp2_time as free_practice_2_time,
            fp3_date as free_practice_3_date,
            fp3_time as free_practice_3_time,
            quali_date as qualifying_date,
            quali_time as qualifying_time,
            sprint_date,
            sprint_time
        from source
    )

    select * from renamed
    ```
1. Create `stg_f1_results.sql` with this file path `models/staging/formula1/stg_f1_results.sql`:

    ```sql
    with

    source  as (

        select * from {{ source('formula1','results') }}

    ),

    renamed as (
        select
            resultid as result_id,
            raceid as race_id,
            driverid as driver_id,
            constructorid as constructor_id,
            number as driver_number,
            grid,
            position::int as position,
            positiontext as position_text,
            positionorder as position_order,
            points,
            laps,
            time as results_time_formatted,
            milliseconds as results_milliseconds,
            fastestlap as fastest_lap,
            rank as results_rank,
            fastestlaptime as fastest_lap_time_formatted,
            fastestlapspeed::decimal(6,3) as fastest_lap_speed,
            statusid as status_id
        from source
    )

    select * from renamed
    ```
1. Last one! Create `stg_f1_status.sql` with this file path: `models/staging/formula1/stg_f1_status.sql`:

    ```sql
    with

    source  as (

        select * from {{ source('formula1','status') }}

    ),

    renamed as (
        select
            statusid as status_id,
            status
        from source
    )

    select * from renamed
    ```
    After the source and all the staging models are complete for each of the 8 tables, your staging folder should look like this: 

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/8-sources-and-staging/1-staging-folder.png" title="Staging folder"/>

1. It’s a good time to delete our example folder since these two models are extraneous to our formula1 pipeline and `my_first_model` fails a `not_null` test that we won’t spend time investigating. dbt Cloud will warn us that this folder will be permanently deleted, and we are okay with that so select **Delete**.

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/8-sources-and-staging/2-delete-example.png" title="Delete example folder"/>

1. Now that the staging models are built and saved, it's time to create the models in our development schema in Snowflake. To do this we're going to enter into the command line `dbt build` to run all of the models in our project, which includes the 8 new staging models and the existing example models.

    Your run should complete successfully and you should see green checkmarks next to all of your models in the run results. We built our 8 staging models as views and ran 13 source tests that we configured in the `f1_sources.yml` file with not that much code, pretty cool!

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/8-sources-and-staging/3-successful-run-in-snowflake.png" title="Successful dbt build in Snowflake"/>

    Let's take a quick look in Snowflake, refresh database objects, open our development schema, and confirm that the new models are there. If you can see them, then we're good to go!

    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/8-sources-and-staging/4-confirm-models.png" title="Confirm models"/>

    Before we move onto the next section, be sure to commit your new models to your Git branch. Click **Commit and push** and give your commit a message like `profile, sources, and staging setup` before moving on.

    
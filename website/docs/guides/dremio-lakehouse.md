---
title: Build a data lakehouse with dbt Core and Dremio Cloud
id: build-dremio-lakehouse
description:  Learn how to build a data lakehouse with dbt Core and Dremio Cloud.
displayText: Build a data lakehouse with dbt Core and Dremio Cloud
hoverSnippet: Learn how to build a data lakehouse with dbt Core and Dremio Cloud
# time_to_complete: '30 minutes' commenting out until we test
platform: 'dbt-core'
icon: 'guides'
hide_table_of_contents: true
tags: ['Dremio', 'dbt Core']
level: 'Intermediate'
recently_updated: true
---
## Introduction

This guide will demonstrate how to build a data lakehouse with dbt Core 1.5 or new and Dremio Cloud. You can simplify and optimize your data infrastructure with dbt's robust transformation framework and Dremio’s open and easy data lakehouse. The integrated solution empowers companies to establish a strong data and analytics foundation, fostering self-service analytics and enhancing business insights while simplifying operations by eliminating the necessity to write complex Extract, Transform, and Load (ETL) pipelines. 

## Prerequisites

* You must have a [Dremio Cloud](https://docs.dremio.com/cloud/) account.
* You must have Python 3 installed.
* You must have dbt Core v1.5 or newer [installed](/docs/core/installation). 
* You must have the Dremio adapter 1.5.0 or newer [installed and configured](/docs/core/connect-data-platform/dremio-setup) for Dremio Cloud.
* You must have basic working knowledge of Git and the command line interface (CLI).

## Validate your environment 

Validate your environment by running the following commands in your CLI and verifying the results are correct:

```shell

$ python3 --version
Python 3.11.4 # Must be Python 3

```

```shell

$ dbt --version
Core:
  - installed: 1.5.0 # Must be 1.5 or newer
  - latest:    1.6.3 - Update available!

  Your version of dbt-core is out of date!
  You can find instructions for upgrading here:
  https://docs.getdbt.com/docs/installation

Plugins:
  - dremio: 1.5.0 - Up to date! # Must be 1.5 or newer

```

## Getting started

1. Clone the Dremio dbt Core sample project from the [github repo](https://github.com/dremio-brock/DremioDBTSample/tree/master/dremioSamples).

2. Open the relation.py file in the Dremio adapter directory `$HOME/Library/Python/3.9/lib/python/site-packages/dbt/adapters/dremio/relation.py` in your integrated development environment (IDE) and locate lines 51 and 52.

Update lines 51 and 52 if they don't have the following syntax:

```python

PATTERN = re.compile(r"""((?:[^."']|"[^"]*"|'[^']*')+)""")
return ".".join(PATTERN.split(identifier)[1::2])

```

The complete selection should look like this:

```python
def quoted_by_component(self, identifier, componentName):
        if componentName == ComponentName.Schema:
            PATTERN = re.compile(r"""((?:[^."']|"[^"]*"|'[^']*')+)""")
            return ".".join(PATTERN.split(identifier)[1::2])
        else:
            return self.quoted(identifier)

```

This is required because the plugin doesn’t support schema names in Dremio containing dots and spaces.

## Build your pipeline

1. Create a `profiles.yml` file in the `$HOME/.dbt/profiles.yml` path and add the following configs:

```yaml

dremioSamples:
  outputs:
    cloud_dev:
      dremio_space: dev
      dremio_space_folder: no_schema
      object_storage_path: dev
      object_storage_source: $scratch
      pat: <this_is_the_personal_access_token>
      cloud_host: api.dremio.cloud
      cloud_project_id: <id_of_project_you_belong_to>
      threads: 1
      type: dremio
      use_ssl: true
      user: <your_username>
  target: dev

  ```

  2. Execute the transformation pipeline: 

  ```shell

  $ dbt run -t cloud_dev

  ```

  If the above configurations have been implemented, the output will look something like this:

```shell

17:24:16  Running with dbt=1.5.0
17:24:17  Found 5 models, 0 tests, 0 snapshots, 0 analyses, 348 macros, 0 operations, 0 seed files, 2 sources, 0 exposures, 0 metrics, 0 groups
17:24:17
17:24:29  Concurrency: 1 threads (target='cloud_dev')
17:24:29
17:24:29  1 of 5 START sql view model Preparation.trips .................................. [RUN]
17:24:31  1 of 5 OK created sql view model Preparation. trips ............................. [OK in 2.61s]
17:24:31  2 of 5 START sql view model Preparation.weather ................................ [RUN]
17:24:34  2 of 5 OK created sql view model Preparation.weather ........................... [OK in 2.15s]
17:24:34  3 of 5 START sql view model Business.Transportation.nyc_trips .................. [RUN]
17:24:36  3 of 5 OK created sql view model Business.Transportation.nyc_trips ............. [OK in 2.18s]
17:24:36  4 of 5 START sql view model Business.Weather.nyc_weather ....................... [RUN]
17:24:38  4 of 5 OK created sql view model Business.Weather.nyc_weather .................. [OK in 2.09s]
17:24:38  5 of 5 START sql view model Application.nyc_trips_with_weather ................. [RUN]
17:24:41  5 of 5 OK created sql view model Application.nyc_trips_with_weather ............ [OK in 2.74s]
17:24:41
17:24:41  Finished running 5 view models in 0 hours 0 minutes and 24.03 seconds (24.03s).
17:24:41
17:24:41  Completed successfully
17:24:41
17:24:41  Done. PASS=5 WARN=0 ERROR=0 SKIP=0 TOTAL=5

```

Now that you have a running environment and a completed job, you can view the data in Dremio and expand your code. This is a snapshot of the project structure in an IDE:

<Lightbox src="/img/guides/dremio/dremio-cloned-repo.png" title="Cloned repo in an IDE"/>

## About the schema.yml

The `schema.yml` file defines Dremio sources and models to be used and what data models are in scope. In this guides sample project, there are two data sources: 

1. The `NYC-weather.csv` stored in the **Samples** database and 
2. The `sample_data` from the **Samples database**.** 

The models correspond to both weather & trip data respectively and will be joined for analysis. 

The sources can be found by navigating to the **Object Storage** section of the Dremio Cloud UI.

<Lightbox src="/img/guides/dremio/dremio-nyc-weather.png" title="NYC-weather.csv location in Dremio Cloud"/>

## About the models

**Preparation** &mdash; `preparation_trips.sql` and `preparation_weather.sql` are building views on top of the trips and weather data.

**Business** &mdash; `business_transportation_nyc_trips.sql` applies some level of transformation on `preparation_trips.sql` view. `Business_weather_nyc.sql` has no transformation on the `preparation_weather.sql` view. 

**Application** &mdash; `application_nyc_trips_with_weather.sql` joins the output from the Business model. This is what your business users will consume.

## The Job output

When you run the dbt job, it will create a **dev** space folder that has all the data assets created. This is what you will see in Dremio Cloud UI. Spaces in Dremio is a way to organize data assets which map to business units or data products.

<Lightbox src="/img/guides/dremio/dremio-dev-space.png" title="Dremio Cloud dev space"/>

Open the **Application folder** and you will see the output of the simple transformation we did using dbt.

<Lightbox src="/img/guides/dremio/dremio-dev-application.png" title="Application folder transformation output"/>

## Query the data

Now that you have run the job and completed the transformation, it's time to query your data. Click on the `nyc_trips_with_weather` view. That will take you to the SQL Runner page. Click **Show SQL Pane** on the upper right corner of the page. Run the following query:

```sql

SELECT vendor_id,
       AVG(tip_amount)
FROM dev.application."nyc_treips_with_weather"
GROUP BY vendor_id

```

<Lightbox src="/img/guides/dremio/dremio-test-results.png" title="Sample output from SQL query"/>

This completes the integration setup and data is ready for business consumption.
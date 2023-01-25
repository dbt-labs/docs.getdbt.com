---
title: "How we cut our tests by 80% while increasing data quality: the power of aggregating test failures in dbt"
description: "A singular data quality test just failed...whew things are still ok — when *many* dbt tests fail, how do you make those failures actionable? Noah explores how aggregating test failures in dbt led to more informative, actionable, and self-service testing initiatives for end data users."
slug: aggregating-test-failures-with-dbt

authors: [noah_kennedy]

tags: [analytics craft]
hide_table_of_contents: false

date: 2023-01-24
is_featured: true
---

Testing the quality of data in your warehouse is an important aspect in any mature data pipeline. One of the biggest blockers for developing a successful data quality pipeline is aggregating test failures and successes in an informational and actionable way. However, ensuring actionability can be challenging. If ignored, test failures can clog up a pipeline and create unactionable noise, rendering your testing infrastructure ineffective.

<!--truncate-->

At [Tempus](https://www.tempus.com/), a precision medicine company specializing in oncology, high quality data is a necessary component for high quality clinical models. With roughly 1,000 dbt models, nearly a hundred data sources, and a dozen different data quality stakeholders, producing a framework that allows stakeholders to take action on test failures is challenging. Without an actionable framework, data quality tests can backfire — in early 2022, we had nearly a thousand tests, hundreds of which failed on a daily basis yet were wholly ignored. 

Recently, we overhauled our testing framework. We cut the number of tests down to 200, creating a more mature framework that includes metadata and emphasizes actionability. Our system for managing data quality is a three step process, described below:

1. Leveraging the contextual knowledge of stakeholders, writing specific, high quality data tests, perpetuating test failure results into aliased models for easy access. 
1. Aggregating test failure results using Jinja macros and pre-configured metadata to pull together high level summary tables. 
1. Building views on top of the base table to split tests by owner or severity, and creating visualizations using our tool of choice.

_It should be noted that this framework is for dbt v1.0+ on BigQuery. Small adaptations are likely necessary to make this framework run on a different setup._

## Specific, high quality data tests

When we talk about high quality data tests, we aren’t just referencing high quality code, but rather the informational quality of our testing framework and their corresponding error messages. Originally, we theorized that any test that cannot be acted upon is a test that should not be implemented. Later, we realized there is a time and place for tests that should receive attention at a critical mass of failures. All we needed was a higher specificity system: tests should have an explicit severity ranking associated with them, equipped to filter out the noise of common, but low concern, failures. Each test should also mesh into established [RACI](https://project-management.com/understanding-responsibility-assignment-matrix-raci-matrix/) guidelines that state which groups tackle what failures, and what constitutes a critical mass.

To ensure that tests are always acted upon, we implement tests differently depending on the user groups that must act when a test fails. This led us to have two main classes of tests — Data Integrity Tests (called [Generic Tests](https://docs.getdbt.com/docs/build/tests) in dbt docs) and Context Driven Tests (called [Singular Tests](https://docs.getdbt.com/docs/build/tests#singular-tests) in dbt docs), with varying levels of severity across both test classes.

Data Integrity tests (Generic Tests)  are simple — they’re tests akin to a uniqueness check or not null constraint. These tests are usually actionable by the data platform team rather than subject matter experts. We define Data Integrity tests in our YAML files, similar to how they are [outlined by dbt’s documentation on generic tests](https://docs.getdbt.com/docs/build/tests). They look something like this —

```yaml
version: 2
models:
  - name: patient
    columns:
      - name: id
        description: Unique ID associated with the record
        tests:
          - unique:
              alias: patient__id__unique
          - not_null:
              alias: patient__id__not_null
```
<center><i>Example Data Integrity Tests in a YAML file — the alias argument is an important piece that will be touched on later.</i></center><br />

Context Driven Tests are more complex and look a lot more like models. Essentially, they’re data models that select bad data or records we don’t want, defined as SQL files that live in the `dbt/tests` directory. An example is shown below —

```sql
{{ config(
        tags=['check_birth_date_in_range', 'patient'],
        alias='ad_hoc__check_birth-date_in_range'
    )
}}

SELECT
    id,
    birth_date
FROM
    {{ ref('patient') }}
WHERE birth_date < '1900-01-01'
```
<center><i>The above test selects all patients with a birth date before 1900, due to data rules we have about maximum patient age.</i></center><br />

Importantly, we leverage [Test Aliasing](https://docs.getdbt.com/reference/resource-configs/alias) to ensure that our tests all follow a standard and predictable naming convention; our naming convention for Data Integrity tests is *table_name_ _column_name__test_name*, and our naming convention for Context Driven Tests is *ad_hoc__test_name*. Finally, to ensure all of our tests can then be aggregated, we modify the `dbt_project.yml` file  and [set the `store_failures` tag to ‘TRUE’](https://docs.getdbt.com/reference/resource-configs/store_failures), thus persisting test failures into SQL tables.

At this point in development, we have Data Integrity Tests defined in the YAML and Context Driven Tests defined as SQL files. Tests are specific, actionable, and realistic, and each comes with an idea of severity, and a group of users who care when it fails. All of our tests are aliased according to a specific naming convention so that we know the table names they will put data into, and we have modified our dbt project config to set `store_failures` true for all tests.

## Test aggregation using metadata

Our next step is to define test metadata for each of our tests. The reason for this is twofold. First, we want to ensure that in later visualization steps, we can attach a description and a more human-readable name to the test. Second, having a metadata file allows us to attach all sorts of extra information to tests: who owns the test, how severe it is, and if the test is active or inactive, just to name a few.

Our metadata is stored in a [seed file](https://docs.getdbt.com/docs/build/seeds). The only required field here is the `test_alias`, which acts as a <Term id="primary-key"/> to link the metadata to the name of the test failures table. We also include the test severity, the test owner, a test description, and several other fields that act as filters for future aggregation tables.

After defining our metadata Seed file, we begin the process of aggregating our data. We aggregate our data by defining a base model that joins our test failure results (now stored in a separate schema) with the metadata we defined. Below is an example of what that code looks like —

```sql
{{ config(
       materialized = 'incremental',
       partition_by = {'field': 'load_date', 'data_type': 'date'},
       incremental_strategy = 'merge',
       unique_key='row_key',
       full_refresh=false,
       tags=['dq_test_warning_failures','clinical_mart', 'data_health']
   )
}}

WITH failures as (
   SELECT
       count(*) as test_failures,
       _TABLE_SUFFIX as table_suffix,
   FROM {{ var('clinical_mart_schema') }}_dbt_test__audit.`*`
   GROUP BY _TABLE_SUFFIX
),

metadata as (
   SELECT
       test_owner,
       test_alias,
       test_description,
       split(test_alias, '__')[SAFE_ORDINAL(2)] as test_name,
       test_severity
   FROM {{ref('test_warning_metadata')}}
),

SELECT
   m.*,
   f.*
FROM metadata m
LEFT JOIN failures f on m.test_alias = f.table_suffix
WHERE m.is_active is TRUE
```
<center><i>Example Metadata + Test Failure Aggregation Base Model.</i></center><br />

Some key components:

- We materialize our base model as incremental, set `full_refresh` to *false* within the `dbt_project.yml`, and partition our table by date to ensure that we keep historical data.
- We use BigQuery, which allows [wild card selectors](https://cloud.google.com/bigquery/docs/querying-wildcard-tables) and makes our life much easier. If you’re using a different framework, you most likely need to write a loop using Jinja.
- Since we have an expected naming convention, we can split the `test_alias` to get components like table name or column name if we desire.

Now that our base model is developed, we have a central point of truth that aggregates all of our data tests into one location, complete with metadata that gives more insight into the test, as well as who owns it. Our final step is leveraging our base table to gain added insights from our tests.

## Finishing touches and conclusions

With our finalized data quality base table, there are many other options for cleaning up our framework or creating visualizations. Our team uses the base table in a few main ways.

First, we create views on top of the base table that filter down by test owner. We strongly believe that test noise is the biggest risk towards the success of a quality framework. Creating specific views is like giving each team a magnifying glass that lets them zoom into only the tests they care about. We also have a dashboard, currently in Google Looker Studio, that shows historical test failures with a suite of filters to let users magnify high severity tests and constructs machine-composed example queries for users to select failing records. When a test fails, a business analyst can copy and paste a query from the dashboard and get all the relevant information.

As with any framework, it’s always a work in progress — we still encounter issues with noise in our tests, and still struggle to wrangle our users to care when a test fails. However, we’ve found that this data framework works exceptionally well at enabling data users to create and deploy their own tests. All they need to do is submit a pull request with SQL code that flags bad data, and write one line of metadata.
---
title: "Testing" 
id: "13-testing"
description: "Testing"
---
We have now completed building all the models for today’s lab, but how do we know if they meet our assertions? Put another way, how do we know the quality of our data models are any good? This brings us to testing!

We test data models for mainly two reasons:

- Ensure that our source data is clean on ingestion before we start data modeling/transformation (aka avoid garbage in, garbage out problem).
- Make sure we don’t introduce bugs in the transformation code we wrote (stop ourselves from creating bad joins/fanouts).

Testing in dbt comes in two flavors: [generic](/docs/build/tests#generic-tests) and [singular](/docs/build/tests#singular-tests).

You define them in a test block (similar to a macro) and once defined, you can reference them by name in your `.yml` files (applying them to models, columns, sources, snapshots, and seeds).

You might be wondering: *what about testing Python models?*

Since the output of our Python models are tables, we can test SQL and Python models the same way! We don’t have to worry about any syntax differences when testing SQL versus Python data models. This means we use `.yml` and `.sql` files to test our entities (tables, views, etc.). Under the hood, dbt is running an SQL query on our tables to see if they meet assertions. If no rows are returned, dbt will surface a passed test. Conversely, if a test results in returned rows, it will fail or warn depending on the configuration (more on that later).

## Generic tests

1. To implement generic out-of-the-box tests dbt comes with, we can use YAML files to specify information about our models. To add generic tests to our aggregates model, create a file called `aggregates.yml`, copy the code block below into the file, and save.
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/13-testing/1-generic-testing-file-tree.png" title="The aggregates.yml file in our file tree"/>

    ```yaml 
    version: 2

    models:
    - name: fastest_pit_stops_by_constructor
        description: Use the python .describe() method to retrieve summary statistics table about pit stops by constructor. Sort by average stop time ascending so the first row returns the fastest constructor.
        columns:
        - name: constructor_name
            description: team that makes the car
            tests:
            - unique

    - name: lap_times_moving_avg
        description: Use the python .rolling() method to calculate the 5 year rolling average of pit stop times alongside the average for each year. 
        columns:
        - name: race_year
            description: year of the race
            tests:
            - relationships:
                to: ref('int_lap_times_years')
                field: race_year
    ```

2. Let’s unpack the code we have here. We have both our aggregates models with the model name to know the object we are referencing and the description of the model that we’ll populate in our documentation. At the column level (a level below our model), we are providing the column name followed by our tests. We want to ensure our `constructor_name` is unique since we used a pandas `groupby` on `constructor_name` in the model `fastest_pit_stops_by_constructor`. Next, we want to ensure our `race_year` has referential integrity from the model we selected from `int_lap_times_years` into our subsequent `lap_times_moving_avg` model.
3. Finally, if we want to see how tests were deployed on sources and SQL models, we can look at other files in our project such as the `f1_sources.yml` we created in our Sources and staging section.

## Using macros for testing

1. Under your `macros` folder, create a new file and name it `test_all_values_gte_zero.sql`. Copy the code block below and save the file. For clarity, “gte” is an abbreviation for greater than or equal to.
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/13-testing/2-macro-testing.png" title="macro file for reusable testing code"/>

    ```sql
    {% macro test_all_values_gte_zero(table, column) %}

    select * from {{ ref(table) }} where {{ column }} < 0

    {% endmacro %}
    ```

2. Macros in Jinja are pieces of code that can be reused multiple times in our SQL models &mdash; they are analogous to "functions" in other programming languages, and are extremely useful if you find yourself repeating code across multiple models.
3. We use the `{% macro %}` to indicate the start of the macro and `{% endmacro %}` for the end. The text after the beginning of the macro block is the name we are giving the macro to later call it. In this case, our macro is called `test_all_values_gte_zero`. Macros take in *arguments* to pass through, in this case the `table` and the `column`. In the body of the macro, we see an SQL statement that is using the `ref` function to dynamically select the table and then the column. You can always view macros without having to run them by using `dbt run-operation`. You can learn more [here](https://docs.getdbt.com/reference/commands/run-operation).
4. Great, now we want to reference this macro as a test! Let’s create a new test file called `macro_pit_stops_mean_is_positive.sql` in our `tests` folder.

  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/13-testing/3-gte-macro-applied-to-pit-stops.png" title="creating a test on our pit stops model referencing the macro"/>

5. Copy the following code into the file and save:

    ```sql
    {{
        config(
            enabled=true,
            severity='warn',
            tags = ['bi']
        )
    }}

    {{ test_all_values_gte_zero('fastest_pit_stops_by_constructor', 'mean') }}
    ```
    
6. In our testing file, we are applying some configurations to the test including `enabled`, which is an optional configuration for disabling models, seeds, snapshots, and tests. Our severity is set to `warn` instead of `error`, which means our pipeline will still continue to run. We have tagged our test with `bi` since we are applying this test to one of our bi models.

Then, in our final line, we are calling the `test_all_values_gte_zero` macro that takes in our table and column arguments and inputting our table `'fastest_pit_stops_by_constructor'` and the column `'mean'`.

## Custom singular tests to validate Python models

The simplest way to define a test is by writing the exact SQL that will return failing records. We call these "singular" tests, because they're one-off assertions usable for a single purpose.

These tests are defined in `.sql` files, typically in your `tests` directory (as defined by your test-paths config). You can use Jinja in SQL models (including ref and source) in the test definition, just like you can when creating models. Each `.sql` file contains one select statement, and it defines one test.

Let’s add a custom test that asserts that the moving average of the lap time over the last 5 years is greater than zero (it’s impossible to have time less than 0!). It is easy to assume if this is not the case the data has been corrupted.

1. Create a file `lap_times_moving_avg_assert_positive_or_null.sql` under the `tests` folder.
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/13-testing/4-custom-singular-test.png" title="custom singular test for testing lap times are positive values"/>

2. Copy the following code and save the file:

    ```sql
    {{
        config(
            enabled=true,
            severity='error',
            tags = ['bi']
        )
    }}

    with lap_times_moving_avg as ( select * from {{ ref('lap_times_moving_avg') }} )

    select *
    from lap_times_moving_avg 
    where lap_moving_avg_5_years < 0 and lap_moving_avg_5_years is not null
    ```

## Putting all our tests together

1. Time to run our tests! Altogether, we have created 4 tests for our 2 Python models:
    - `fastest_pit_stops_by_constructor`
        - Unique `constructor_name`
        - Lap times are greater than 0 or null (to allow for the first leading values in a rolling calculation)
    - `lap_times_moving_avg`
        - Referential test on `race_year`
        - Mean pit stop times are greater than or equal to 0 (no negative time values)
2. To run the tests on both our models, we can use this syntax in the command line to run them both at once, similar to how we did our data splits earlier.
    Execute the following in the command bar:
    ```bash
    dbt test --select fastest_pit_stops_by_constructor lap_times_moving_avg
    ```
    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/13-testing/5-running-tests-on-python-models.png" title="running tests on our python models"/>

3. All 4 of our tests passed (yay for clean data)! To understand the SQL being run against each of our tables, we can click into the details of the test.
4. Navigating into the **Details** of the `unique_fastest_pit_stops_by_constructor_name`, we can see that each line `constructor_name` should only have one row.
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/13-testing/6-testing-output-details.png" title="view details of testing our python model that used SQL to test data assertions"/>
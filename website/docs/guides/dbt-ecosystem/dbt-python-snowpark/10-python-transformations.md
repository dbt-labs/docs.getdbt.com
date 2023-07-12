---
title: "Python transformations!" 
id: "10-python-transformations"
description: "Python transformations"
---

Up until now, SQL has been driving the project (car pun intended) for data cleaning and hierarchical joining. Now it’s time for Python to take the wheel (car pun still intended) for the rest of our lab! For more information about running Python models on dbt, check out our [docs](/docs/build/python-models). To learn more about dbt python works under the hood, check out [Snowpark for Python](https://docs.snowflake.com/en/developer-guide/snowpark/python/index.html), which makes running dbt Python models possible.

There are quite a few differences between SQL and Python in terms of the dbt syntax and DDL, so we’ll be breaking our code and model runs down further for our python models.

## Pit stop analysis

First, we want to find out: which constructor had the fastest pit stops in 2021? (constructor is a Formula 1 team that builds or “constructs” the car).

1. Create a new file called `fastest_pit_stops_by_constructor.py` in our `aggregates` (this is the first time we are using the `.py` extension!).
2. Copy the following code into the file:
    ```python 
    import numpy as np
    import pandas as pd

    def model(dbt, session):
        # dbt configuration
        dbt.config(packages=["pandas","numpy"])

        # get upstream data
        pit_stops_joined = dbt.ref("pit_stops_joined").to_pandas()

        # provide year so we do not hardcode dates 
        year=2021

        # describe the data
        pit_stops_joined["PIT_STOP_SECONDS"] = pit_stops_joined["PIT_STOP_MILLISECONDS"]/1000
        fastest_pit_stops = pit_stops_joined[(pit_stops_joined["RACE_YEAR"]==year)].groupby(by="CONSTRUCTOR_NAME")["PIT_STOP_SECONDS"].describe().sort_values(by='mean')
        fastest_pit_stops.reset_index(inplace=True)
        fastest_pit_stops.columns = fastest_pit_stops.columns.str.upper()
        
        return fastest_pit_stops.round(2)
    ```

3. Let’s break down what this code is doing step by step:
    - First, we are importing the Python libraries that we are using. A *library* is a reusable chunk of code that someone else wrote that you may want to include in your programs/projects. We are using `numpy` and `pandas`in this Python model. This is similar to a dbt *package*, but our Python libraries do *not* persist across the entire project.
    - Defining a function called `model` with the parameter `dbt` and `session`. The parameter `dbt` is a class compiled by dbt, which enables you to run your Python code in the context of your dbt project and DAG. The parameter `session` is a class representing your Snowflake’s connection to the Python backend. The `model` function *must return a single DataFrame*. You can see that all the data transformation happening is within the body of the `model` function that the `return` statement is tied to.
    - Then, within the context of our dbt model library, we are passing in a configuration of which packages we need using `dbt.config(packages=["pandas","numpy"])`.
    - Use the `.ref()` function to retrieve the data frame `pit_stops_joined` that we created in our last step using SQL. We cast this to a pandas dataframe (by default it's a Snowpark Dataframe).
    - Create a variable named `year` so we aren’t passing a hardcoded value.
    - Generate a new column called `PIT_STOP_SECONDS` by dividing the value of `PIT_STOP_MILLISECONDS` by 1000.
    - Create our final data frame `fastest_pit_stops` that holds the records where year is equal to our year variable (2021 in this case), then group the data frame by `CONSTRUCTOR_NAME` and use the `describe()` and `sort_values()` and in descending order. This will make our first row in the new aggregated data frame the team with the fastest pit stops over an entire competition year.
    - Finally, it resets the index of the `fastest_pit_stops` data frame. The `reset_index()` method allows you to reset the index back to the default 0, 1, 2, etc indexes. By default, this method will keep the "old" indexes in a column named "index"; to avoid this, use the drop parameter. Think of this as keeping your data “flat and square” as opposed to “tiered”. If you are new to Python, now might be a good time to [learn about indexes for 5 minutes](https://towardsdatascience.com/the-basics-of-indexing-and-slicing-python-lists-2d12c90a94cf) since it's the foundation of how Python retrieves, slices, and dices data. The `inplace` argument means we override the existing data frame permanently. Not to fear! This is what we want to do to avoid dealing with multi-indexed dataframes!
    - Convert our Python column names to all uppercase using `.upper()`, so Snowflake recognizes them.
    - Finally we are returning our dataframe with 2 decimal places for all the columns using the `round()` method.
4. Zooming out a bit, what are we doing differently here in Python from our typical SQL code:
    - Method chaining is a technique in which multiple methods are called on an object in a single statement, with each method call modifying the result of the previous one. The methods are called in a chain, with the output of one method being used as the input for the next one. The technique is used to simplify the code and make it more readable by eliminating the need for intermediate variables to store the intermediate results.
        - The way you see method chaining in Python is the syntax `.().()`. For example, `.describe().sort_values(by='mean')` where the `.describe()` method is chained to `.sort_values()`.
    - The `.describe()` method is used to generate various summary statistics of the dataset. It's used on pandas dataframe. It gives a quick and easy way to get the summary statistics of your dataset without writing multiple lines of code.
    - The `.sort_values()` method is used to sort a pandas dataframe or a series by one or multiple columns. The method sorts the data by the specified column(s) in ascending or descending order. It is the pandas equivalent to `order by` in SQL.

    We won’t go as in depth for our subsequent scripts, but will continue to explain at a high level what new libraries, functions, and methods are doing.

5. Build the model using the UI which will **execute**:
    ```bash
    dbt run --select fastest_pit_stops_by_constructor
    ```
    in the command bar.

    Let’s look at some details of our first Python model to see what our model executed. There two major differences we can see while running a Python model compared to an SQL model:

    - Our Python model was executed as a stored procedure. Snowflake needs a way to know that it's meant to execute this code in a Python runtime, instead of interpreting in a SQL runtime. We do this by creating a Python stored proc, called by a SQL command.
    - The `snowflake-snowpark-python` library has been picked up to execute our Python code. Even though this wasn’t explicitly stated this is picked up by the dbt class object because we need our Snowpark package to run Python!

    Python models take a bit longer to run than SQL models, however we could always speed this up by using [Snowpark-optimized Warehouses](https://docs.snowflake.com/en/user-guide/warehouses-snowpark-optimized.html) if we wanted to. Our data is sufficiently small, so we won’t worry about creating a separate warehouse for Python versus SQL files today.
    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/10-python-transformations/1-python-model-details-output.png" title="We can see our python model is run a stored procedure in our personal development schema"/>

    The rest of our **Details** output gives us information about how dbt and Snowpark for Python are working together to define class objects and apply a specific set of methods to run our models.

    So which constructor had the fastest pit stops in 2021? Let’s look at our data to find out!

6. We can't preview Python models directly, so let’s create a new file using the **+** button or the Control-n shortcut to create a new scratchpad.
7. Reference our Python model:
    ```sql
    select * from {{ ref('fastest_pit_stops_by_constructor') }}
    ```
    and preview the output:
    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/10-python-transformations/2-fastest-pit-stops-preview.png" title="Looking at our new python data model we can see that Red Bull had the fastest pit stops!"/>

    Not only did Red Bull have the fastest average pit stops by nearly 40 seconds, they also had the smallest standard deviation, meaning they are both fastest and most consistent teams in pit stops. By using the `.describe()` method we were able to avoid verbose SQL requiring us to create a line of code per column and repetitively use the `PERCENTILE_COUNT()` function.

    Now we want to find the lap time average and rolling average through the years (is it generally trending up or down)?

8. Create a new file called `lap_times_moving_avg.py` in our `aggregates` folder.
9. Copy the following code into the file:
    ```python 
    import pandas as pd

    def model(dbt, session):
        # dbt configuration
        dbt.config(packages=["pandas"])

        # get upstream data
        lap_times = dbt.ref("int_lap_times_years").to_pandas()

        # describe the data
        lap_times["LAP_TIME_SECONDS"] = lap_times["LAP_TIME_MILLISECONDS"]/1000
        lap_time_trends = lap_times.groupby(by="RACE_YEAR")["LAP_TIME_SECONDS"].mean().to_frame()
        lap_time_trends.reset_index(inplace=True)
        lap_time_trends["LAP_MOVING_AVG_5_YEARS"] = lap_time_trends["LAP_TIME_SECONDS"].rolling(5).mean()
        lap_time_trends.columns = lap_time_trends.columns.str.upper()
        
        return lap_time_trends.round(1)
    ```

10. Breaking down our code a bit:
    - We’re only using the `pandas` library for this model and casting it to a pandas data frame `.to_pandas()`.
    - Generate a new column called `LAP_TIMES_SECONDS` by dividing the value of `LAP_TIME_MILLISECONDS` by 1000.
    - Create the final dataframe. Get the lap time per year. Calculate the mean series and convert to a data frame.
    - Reset the index.
    - Calculate the rolling 5 year mean.
    - Round our numeric columns to one decimal place.
11. Now, run this model by using the UI **Run model** or 
    ```bash
    dbt run --select lap_times_moving_avg
    ```
 in the command bar.

12. Once again previewing the output of our data using the same steps for our `fastest_pit_stops_by_constructor` model.
    <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/10-python-transformations/3-lap-times-trends-preview.png" title="Viewing our lap trends and 5 year rolling trends"/>

    We can see that it looks like lap times are getting consistently faster over time. Then in 2010 we see an increase occur! Using outside subject matter context, we know that significant rule changes were introduced to Formula 1 in 2010 and 2011 causing slower lap times.

13. Now is a good time to checkpoint and commit our work to Git. Click **Commit and push** and give your commit a message like `aggregate python models` before moving on.

## The dbt model, .source(), .ref() and .config() functions

Let’s take a step back before starting machine learning to both review and go more in-depth at the methods that make running dbt python models possible. If you want to know more outside of this lab’s explanation read the documentation [here](/docs/build/python-models?version=1.3).

- dbt model(dbt, session). For starters, each Python model lives in a .py file in your models/ folder. It defines a function named `model()`, which takes two parameters:
    - dbt &mdash; A class compiled by dbt Core, unique to each model, enables you to run your Python code in the context of your dbt project and DAG.
    - session &mdash; A class representing your data platform’s connection to the Python backend. The session is needed to read in tables as DataFrames and to write DataFrames back to tables. In PySpark, by convention, the SparkSession is named spark, and available globally. For consistency across platforms, we always pass it into the model function as an explicit argument called session.
- The `model()` function must return a single DataFrame. On Snowpark (Snowflake), this can be a Snowpark or pandas DataFrame.
- `.source()` and `.ref()` functions. Python models participate fully in dbt's directed acyclic graph (DAG) of transformations. If you want to read directly from a raw source table, use `dbt.source()`. We saw this in our earlier section using SQL with the source function. These functions have the same execution, but with different syntax. Use the `dbt.ref()` method within a Python model to read data from other models (SQL or Python). These methods return DataFrames pointing to the upstream source, model, seed, or snapshot.
- `.config()`. Just like SQL models, there are three ways to configure Python models:
    - In a dedicated `.yml` file, within the `models/` directory
    - Within the model's `.py` file, using the `dbt.config()` method
    - Calling the `dbt.config()` method will set configurations for your model within your `.py` file, similar to the `{{ config() }} macro` in `.sql` model files:
        ```python 
        def model(dbt, session):

            # setting configuration
            dbt.config(materialized="table")
        ```
    - There's a limit to how complex you can get with the `dbt.config()` method. It accepts only literal values (strings, booleans, and numeric types). Passing another function or a more complex data structure is not possible. The reason is that dbt statically analyzes the arguments to `.config()` while parsing your model without executing your Python code. If you need to set a more complex configuration, we recommend you define it using the config property in a [YAML file](/reference/resource-properties/config). Learn more about configurations [here](/reference/model-configs).

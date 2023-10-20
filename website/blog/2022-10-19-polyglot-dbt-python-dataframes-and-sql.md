---
title: "Stronger together: Python, dataframes, and SQL"
description: "Going polyglot is a major next step in the journey of dbt Core. It expands possibilities and also the potential for confusion right along with it. SQL, dataframes, and Python are stronger together and polyglot dbt allows informed practitioners to choose when to use each."
slug: polyglot-dbt-python-dataframes-sql

authors: [doug_beatty]
tags: [dbt tutorials]
hide_table_of_contents: false

date: 2022-10-18
is_featured: true
---

# Stronger together: Python, dataframes, and SQL

For years working in data and analytics engineering roles, I treasured the daily camaraderie sharing a small office space with talented folks using a range of tools - from analysts using SQL and Excel to data scientists working in Python. I always sensed that there was so much we could work on in collaboration with each other - but siloed data and tooling made this much more difficult. The diversity of our tools and languages made the potential for collaboration all the more interesting, since we could have folks with different areas of expertise each bringing their unique spin to the project. But logistically, it just couldn’t be done in a scalable way.

So I couldn’t be more excited about dbt’s polyglot capabilities arriving in dbt Core 1.3. This release brings Python dataframe libraries that are crucial to data scientists and enables general-purpose Python but still uses a shared database for reading and writing data sets. Analytics engineers and data scientists are stronger together, and I can’t wait to work side-by-side in the same repo with all my data scientist friends.

Going polyglot is a major next step in the journey of dbt Core. While it expands possibilities, we  also recognize the potential for confusion. When combined in an intentional manner, SQL, dataframes, and Python are also stronger together. Polyglot dbt allows informed practitioners to choose the language that best fits your use case.

In this post, we’ll give you your hands-on experience and seed your imagination with potential applications. We’ll walk you through a [demo](https://github.com/dbt-labs/demo-python-blog) that showcases string parsing - one simple way that Python can be folded into a dbt project.

We’ll also give you the intellectual resources to compare/contrast:
- different dataframe implementations within different data platforms
- dataframes vs. SQL

Finally, we’ll share “gotchas” and best practices we’ve learned so far and invite you to participate in discovering the answers to outstanding questions we are still curious about ourselves.

Based on our early experiences, we recommend that you:

✅ **Do**: Use Python when it is better suited for the job – model training, using predictive models, matrix operations, exploratory data analysis (EDA), Python packages that can assist with complex transformations, and select other cases where Python is a more natural fit for the problem you are trying to solve.

❌ **Don’t**: Use Python where the solution in SQL is just as direct. Although a pure Python dbt project is possible, we’d expect the most impactful projects to be a mixture of SQL and Python.

<!--truncate-->

## Polyglot dbt: An alloy of Python, dataframes, and SQL

dbt Core 1.3 [gives you the ability](https://www.getdbt.com/blog/introducing-support-for-python/) to use Python models to materialize dataframes as tables within your dbt DAG. In combination, Python and SQL models form an alloy within a dbt project, yielding net new properties not found in isolation.

This is a simultaneous two-part unlock. One, we get a general purpose programming language in Python. Two, we get access to special-purpose dataframe libraries for reading from / writing to the database.

Some pretty cool functionality follows:
1. **Vast ecosystem of Python packages**: The rich Python ecosystem of packages is the heart of varied use cases like machine learning, exploratory data analysis (EDA), data set generation, and many, many more.
1. **Dataframe syntax for data set manipulation**: There’s a vibrant community of Python-first developers that can more easily contribute to dbt projects when they can use dataframe syntax. This is especially useful in conjunction with data science use-cases.
1. **Python workflows where your data lives**: Most Python work being done today is done outside of the data platform that stores the source data, meaning developers have to transfer the data into the Python environment first, which adds significant friction to the development workflow. In the case of Snowpark DataFrames, data movement is reduced by pushing the computation down to the data platform.

## Trade-offs between SQL and dataframe syntax

Once you’re set up - the next question is: what _should_ you use Python for? How should you think about tradeoffs between SQL vs. dataframes? I haven’t personally pondered this deeply… but the folks at [Ponder](https://ponder.io/) have 😉 They published a series of posts comparing the two in terms of:

- [convenience](https://ponder.io/pandas-vs-sql-part-4-pandas-is-more-convenient/) - dataframes go well with data science libraries like [Scikit-learn](https://scikit-learn.org/stable/)
- [conciseness](https://ponder.io/pandas-vs-sql-part-2-pandas-is-more-concise/) - dataframes have concise syntax for normalization, one-hot encoding, rolling averages, and other uses
- [flexibility](https://ponder.io/pandas-vs-sql-part-3-pandas-is-more-flexible/) - rows and columns in dataframes can be transposed and functions can be applied along columns or rows

Gaining **your own** sense of these differences will empower you to create your own alloy mix of polyglot dbt models.

## Comparing dataframe libraries

Before we get into our hands-on example, let’s take a look at the nuts and bolts of getting your project working with different dataframe types. Multiple data platforms and dataframe libraries are supported in dbt Core as of version 1.3, but not uniformly (see compatibility table below). See [here](/docs/build/python-models) for platform-specific setup instructions.

| **Type of data frame**     | **Snowflake**                      | **Databricks**                    | **BigQuery**  |
|----------------------------|------------------------------------|-----------------------------------|---------------|
| Snowpark DataFrames        | ✅                                  | ❌                                 | ❌             |
| pandas DataFrames          | ✅                                  | ✅                                 | ✅             |
| Spark DataFrames           | ❌                                  | ✅                                 | ✅             |
| pandas-on-Spark DataFrames | ❌                                  | ✅                                 | ✅             |
| Koalas DataFrames          | ❌                                  | ✅                                 | ✅             |

<details>
  <summary>More detailed comparisons and trade-offs</summary>

Snowpark DataFrames are only supported in Snowflake, while Spark DataFrames are only available on Databricks and BigQuery. It’s also worth keeping in mind that different types of dataframes use [different syntax](/docs/build/python-models#dataframe-api-and-syntax).

We’ve intentionally not included Jinja within Python models: a primary use of Jinja is for control flow and accessing dynamic-esque variables both of which you can just do within Python! The other main use for Jinja within dbt is for creating abstractions across differing database syntaxes. At this time, there’s no unified syntax abstraction across the different types of dataframes. (But someone will probably [make one](https://xkcd.com/927/)!)

Although pandas DataFrames may seem like the ideal solution due to their support across data platforms, they come with their own tradeoffs. For instance, they can’t take advantage of the efficiency of native types like Spark and Snowpark DataFrames. They’re also limited by memory – large data sets will quickly exhaust available memory. In addition to that, they are constrained by being single-threaded, so they can not take advantage of multiple cores. Although pandas can be parallelized via solutions like Dask, Modin, etc., both Snowpark and Spark DataFrames will handle these scaling challenges natively. So use Snowpark, pandas-on-Spark DataFrames, and Spark DataFrames whenever you can! (Note: pandas-on-Spark DataFrames were formerly known as Koalas DataFrames and now commonly called pandas API DataFrames.)

In Snowflake, any Snowpark DataFrame transformations specified in Python are actually compiled to SQL before execution.

</details>

## First hands-on experience using a Python package

Now that we have sufficient background covered, let’s dive into a real-world use-case.

The full source code for this demo is available at:
- https://github.com/dbt-labs/python-string-parsing

This example is using [DuckDB](https://duckdb.org/) as the database backend. You can use this same code by copying it in your project that is using your database adapter of choice.

Our example will give you hands-on experience with three things:
1. read data from a table into a dataframe
1. parse uniform datetimes out of a variety of string formats using the `dateutil` library
1. writes the result back into a table

Date/time parsing is a common use-case because dates and times are ubiquitous in transactional source data. Often, the source format is unknown, and it may even be a mixture of multiple formats. The `dateutil` package has a method that will do a best-effort attempt at parsing a string into a Python datetime object, and it will raise an exception when it is unable to parse the input. (Users of pandas may already be familiar with the `pandas.to_datetime` method, which uses `dateutil`). The following demo uses `dateutil` to parse source data with unknown date/time formats.

In this example we’ll:
1. Install the requirements in a virtual environment
1. Build the dbt project
1. Examine the output

### Components of the dbt project

This dbt project has only two main pieces (besides our seed data to mimic source data):
1. Transformation logic within the dbt Python model
1. Configuration of data testing for quality assurance

#### The dbt Python model

```python
import dateutil


def try_dateutil_parse(x):
    try:
        return dateutil.parser.parse(x)
    except:
        return


def model(dbt, session):
    df = dbt.ref("source_data")

    df['parsed_transaction_time'] = df['transaction_time'].apply(try_dateutil_parse)

    return df
```

This model tries to parse the raw string value into a Python datetime. When not successful, it yields a `None` value rather than raising an error. The `dateutil` can handle a wider range of formats than most data platforms’ native functionality.

#### Testing the result

During the build process, dbt will check if any of the values are null. This is using the built-in [`not_null`](https://docs.getdbt.com/docs/building-a-dbt-project/tests#generic-tests) test, which will generate and execute SQL in the data platform.

Our initial recommendation for testing Python models is to use [generic](https://docs.getdbt.com/docs/building-a-dbt-project/tests#generic-tests) and [singular](https://docs.getdbt.com/docs/building-a-dbt-project/tests#singular-tests) tests.

```yaml
version: 2

models:
  - name: transactions
    columns:
      - name: parsed_transaction_time
        tests:
          - not_null
```

### Download the repository and install requirements

The full source code for this demo is available at:
- https://github.com/dbt-labs/python-string-parsing

The only prerequisites for this demo are `python3` and `git`. You can verify both are installed and you’re on the right version via these commands in your terminal:
```shell
python3 --version
git --version
```

Assuming both are availble in your system, then you can clone the example repository using your method of choice:

<details open>
<summary>HTTPS</summary>

```shell
git clone https://github.com/dbt-labs/demo-python-blog.git
cd demo-python-blog
```

</details>

<details>
<summary>SSH</summary>

```shell
git clone git@github.com:dbt-labs/demo-python-blog.git
cd demo-python-blog
```

</details>

<details>
<summary>GitHub CLI</summary>

```shell
gh repo clone dbt-labs/demo-python-blog
cd demo-python-blog
```

</details>

Then you'll create a virtual environment and install all the dependencies. Choose your shell / operating system from the list below and run the commands (defaulting to `zsh`/`bash`):

<details open>
<summary>POSIX bash/zsh</summary>

```shell
python3 -m venv env
source env/bin/activate
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt
source env/bin/activate
```

</details>

<details>
<summary>POSIX fish</summary>

```shell
python3 -m venv env
source env/bin/activate.fish
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt
source env/bin/activate.fish
```
</details>

<details>
<summary>POSIX csh/tcsh</summary>

```shell
python3 -m venv env
source env/bin/activate.csh
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt
source env/bin/activate.csh
```
</details>

<details>
<summary>POSIX PowerShell Core</summary>

```shell
python3 -m venv env
env/bin/Activate.ps1
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt
env/bin/Activate.ps1
```
</details>

<details>
<summary>Windows cmd.exe</summary>

```shell
python -m venv env
env\Scripts\activate.bat
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
env\Scripts\activate.bat
```
</details>

<details>
<summary>Windows PowerShell</summary>

```shell
python -m venv env
env\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
env\Scripts\Activate.ps1
```
</details>


### Build it
Once the dependencies are all installed, we can build the project:

```shell
dbt build
```

### Query the result of the dbt transformation

Congrats on successfully running your first dbt Python model! Let’s confirm the output visually by running the following query:

```shell
duckcli demo.duckdb --table --execute "select id, transaction_time, parsed_transaction_time from parse_datetimes order by id"
```

As you can see, each of the various input formats were successfully parsed into a uniform and standardized format.

| id | transaction_time                 | parsed_transaction_time |
|----|----------------------------------|-------------------------|
| 1  | Fri, 16 Dec 2022 02:59:36 +0000  | 2022-12-16 02:59:36     |
| 2  | Sun, 25 Dec 22 02:59:36 +0000    | 2022-12-25 02:59:36     |
| 3  | Thursday, 31-Mar-22 02:59:36 UTC | 2022-03-31 02:59:36     |
| 4  | Thu, 02 Jun 22 02:59:36 +0000    | 2022-06-02 02:59:36     |
| 5  | Thu, 17 Feb 2022 02:59:36 +0000  | 2022-02-17 02:59:36     |
| 6  | 2022-03-28 02:59:36+00:00        | 2022-03-28 02:59:36     |
| 7  | 2022-10-22 02:59:36+00:00        | 2022-10-22 02:59:36     |
| 8  | 2022-10-02 02:59:36+00:00        | 2022-10-02 02:59:36     |
| 9  | Monday, 03-Jan-2022 02:59:36 UTC | 2022-01-03 02:59:36     |
| 10 | Thu, 25 Aug 2022 02:59:36 +0000  | 2022-08-25 02:59:36     |
| 11 | 2022-05-29T02:59:36+00:00        | 2022-05-29 02:59:36     |
| 12 | 2022-08-02 02:59:36+00:00        | 2022-08-02 02:59:36     |
| 13 | 2022-10-18 02:59:36+00:00        | 2022-10-18 02:59:36     |

⚠️ Remember to deactivate the environment as a final step:
```
deactivate
```

And there you go! A real live python example for a common analytics use case! Now let’s think about what we learned.

## Best practice recommendations

Based on our early experiences using dbt Python models and our ongoing conversations with members of the dbt Community, here are some recommended “do’s and don'ts” we think will help set you up for success.

### ✅ **Do**:

- Use Python when it is better suited for the job – model training, using predictive models, matrix operations, exploratory data analysis (EDA), and Python packages that can assist with complex transformations.
- Use the native the dataframe type and syntax for your data platform. Use a notebook environment (and a small sample of your data set) for initial development before copying it into dbt.

### ❌ **Don’t**:

- Use Python where the solution in SQL is just as direct. Although a pure Python dbt project is possible, we’d expect the most impactful projects to be a mixture of SQL and Python.
- Perform web scraping or download data from the web.
- Use pandas unless absolutely necessary. Although pandas can be useful in the prototyping stage, scaling to larger data sets often requires a platform-native type like Snowpark, Spark, or pandas-on-Spark.
- Translate your entire project to be Python-only. Although possible, if models are already written in SQL and there’s not a specific benefit to it being in Python, just leave it as SQL.

### 🤷 We don’t know yet!
There are several outstanding questions where you are invited to contribute to the discussion:
- [Reusable Python logic](https://github.com/dbt-labs/dbt-core/discussions/5741)
- [Debugging output](https://github.com/dbt-labs/dbt-core/discussions/5799)
- [Testing Python models](https://github.com/dbt-labs/docs.getdbt.com/discussions/1811)
- [Abstractions over different dataframe APIs](https://github.com/dbt-labs/dbt-core/discussions/5738)

## Conclusion

Python is particularly well suited for many use-cases within a dbt project, including:
- **Data science** model training or in-line deployment
- **Utilizing packages** within the Python ecosystem like [ftfy](https://ftfy.readthedocs.io/en/latest/), [dateutil](https://dateutil.readthedocs.io/en/stable/index.html), etc.
- **Exploratory data analysis** (EDA) using functions and packages such as [`pandas.describe`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.describe.html), [Pandas profiling](https://pandas-profiling.ydata.ai/docs/master/index.html), [Great Expectations](https://github.com/great-expectations/great_expectations), etc.
- Generating **synthetic data sets** using [Faker](https://faker.readthedocs.io/en/master/)
- **Linear programming** libraries like [CVXOPT](https://cvxopt.org/), [PULP](https://github.com/coin-or/pulp), [CVXPY](https://www.cvxpy.org/), [ECOS](https://github.com/embotech/ecos-python), [Google OR-Tools](https://github.com/google/or-tools), [SciPy](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.linprog.html), etc.
- **Simulation** using [SimPy](https://simpy.readthedocs.io/en/latest/examples/index.html), [Monte Carlo simulation](https://github.com/matsonj/nba-monte-carlo), what-if analysis
- More yet to come!

There is no one programming language to rule them all, so there’s no programming language hill that we are going to die on! We’ll make sure that dbt supports a wide variety of languages and let you make well-reasoned decisions for each individual use case.

We are excited to hear what you discover and build! Please share with us in the [#dbt-core-python-models](https://getdbt.slack.com/archives/C03QUA7DWCW) or [#i-made-this](https://getdbt.slack.com/archives/C01NH3F2E05) channels in Slack.

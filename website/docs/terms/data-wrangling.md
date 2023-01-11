---
id: data-wrangling
title: Data wrangling
description: Data wrangling describes the different processes used to transform raw data into a consistent and easily usable format. The ultimate goal of data wrangling is to work in a way that allows you to dive right into analysis on a dataset or build upon that data.
displayText: data wrangling
hoverSnippet: Data wrangling describes the different processes used to transform raw data into a consistent and easily usable format. The ultimate goal of data wrangling is to work in a way that allows you to dive right into analysis on a dataset or build upon that data.
---

<head>
    <title>Data wrangling: the workflow that bred analytics engineers</title>
</head>

Data wrangling describes the different processes used to transform raw data into a consistent and easily usable format. For analytics engineers, you may know this better by the name of data cleaning. In data science or machine learning, "wrangling" often refers to prepping the data for model creation.

The ultimate goal of data wrangling is to work in a way that allows you to dive right into analysis on a dataset or build upon that data in a downstream model without worrying about basic cleaning like renaming, datatype casting, etc. Data wrangling acts as preparation for the development of [intermediate, fct/dim, or mart data models](/guides/best-practices/how-we-structure/1-guide-overview) that form the base layer that other data work can be built off of. Analytics engineers tend to do data wrangling work in the staging layer as a first transformation step after loading the data. This eliminates a foundational step done by an analytics engineer or analyst when building a downstream data model or dashboard. 

## Data wrangling steps

The data wrangling *structured* process includes data discovery, structuring, cleaning, enriching, validating, and publishing. While this is the general workflow, there isn't one definitive workflow. This will vary depending on the transformation tool you’re using and specific use case.

### Data discovery

Data discovery involves getting to know the data that you are working with. This involves looking at key statistical measures of your dataset. Some of these include:

- Row count
- Number of columns
- Column data types
- Distribution of column values
- Number of duplicate rows
- Number of nulls

Oftentimes, data warehouses have a preview capability so data team members can easily see a table’s makeup (column name, type, row count, etc.), but functions such as `SUM()` and `COUNT()` will come in handy for finding these values. You can use the `GROUP BY` statement with these functions to find the counts of certain rows for different categories of data. In addition, you’ll want to identify <Term id = "primary-key">primary keys</Term>, check for duplicates of primary keys, and ensure every row of data has a column that can act as a primary key!

### Structuring

Structuring your data is a type of transformation that involves reformatting and reorganizing your data so that it is stored in a way that makes the values usable. This could mean rearranging how the data is displayed in columns and rows. Chances are you are using an <Term id="etl" /> tool to ingest your data, so the data is likely in a tabular format and you won’t need to do that much restructuring. If your data is structured, you really only need to worry about nested data types such as <Term id="json" /> data. When structuring your data, you want to ask yourself these questions:

- Is your data in the format you need to perform analysis on it? Does your data need to be potentially unnested? *Should you nest or objectize columns together?*
- Do the column names and values look correct for your use case?
Do the column names and values look correct for your use case?

If your data is not in a format that is usable, you can look into different solutions such as pivoting or using different functions to unpack lists and JSON files so that they are in a tabular format. Pivoting is helpful because it allows you to change the way your dataset is structured by rearranging the way columns, rows, and their values are displayed. dbt has a [pre-built macro](https://github.com/dbt-labs/dbt-utils/blob/main/macros/sql/pivot.sql) that makes pivoting less of a headache and more of a breeze.

### Cleaning

The cleaning stage involves using different functions so that the values in your data <Term id="table">tables</Term> are usable in your models and reports. The majority of the work done in staging models is this type of cleaning that includes:

- Datatype casting
- Lower/upper casing string values
- Converting timestamps
- Aliasing/column renaming
- Removing appropriate duplicates or nulls you found in the discovery process
- Eliminating unnecessary characters or spaces from values

Certain cleaning steps, like removing rows with null values, are helpful to do at the beginning of the process because removing nulls and duplicates from the start can increase the performance of your downstream models.  In the cleaning step, it’s important to follow a standard for your transformations here. This means you should be following a consistent naming convention for your columns (especially for your <Term id="primary-key">primary keys</Term>) and casting to the same timezone and datatypes throughout your models. Examples include making sure all dates are in UTC time rather than source timezone-specific, all string in either lower or upper case, etc. 

:::tip dbt to the rescue!
If you're struggling to do all the cleaning on your own, remember that dbt packages ([dbt expectations](https://github.com/calogica/dbt-expectations), [dbt_utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/), and [re_data](https://www.getre.io/)) and their macros are also available to help you clean up your data.
:::

### Enriching

Enriching your data means enhancing it by supplementing incomplete or missing data. This could involve basic case or coalesce statements that use an already existing column in order to produce a new column. It could also look like joining an already existing date column with a date table that contains more extensive information about a certain date. Keep in mind that you don’t want to go overboard with enriching or joining here—you only want to add what will be repeatedly used in modeling and analysis.

:::tip Python for enrichment?
With the new capability of [Python in dbt](/docs/build/python-models), will folks start using Python to help enrich their data? Only time will tell, but we’re eager to hear how you want to be using Python in dbt. Please join the [#dbt-core-python-models channel](https://www.getdbt.com/community/join-the-community/) to join in on the discussions happening around them.
:::

### Validating

Validating data is the process of ensuring that the changes you just made to a dataset during your transformation are accurate. At this stage, you may be asking yourself:
- Are the primary keys still unique? Are there the same number of primary keys in this transformed table than in my upstream sources?
- Has the relationship with the upstream table(s) changed at all, or is it still 1-1? If not, is that expected behavior?
- Has the distribution of column values changed at all? Are column values even correct?
- Did I select the correct columns I want present at this stage?

To answer these questions, you'll likely find yourself looking for and counting nulls, rows, duplicates, and primary keys. You'll likely reference upstream models regularly in this phase to ensure your transformation code is accurate and performing what you intended it to do. 

Validation is always a little manual, but [dbt tests, macros, and packages](#validating-1) can help make your data validation a little easier 😉 .

### Publishing

The last step of the data wrangling process is publishing. In analytics engineering, we typically refer to this as “pushing to production”. This essentially means that you are making the data models available to use in downstream data models, dashboards, and reports. This additionally means pushing the code changes for these staging models to the main branch in your git repository. For non-ephemeral models, the process of publishing could be as simple as running a query as a <Term id="view" />, creating a table in your production <Term id="data-warehouse" />, or running dbt Cloud in production for table recreation.

CI/CD jobs are often used as part of the publishing process to test and linter code before it is pushed to production. This helps to ensure changes made are actually reliable and safe to merge. CI/CD is a best practice because it allows data models to be updated quickly and efficiently, ensuring no downstream models are impacted. 

When pushing to production, you want to make sure these data models are accessible by those building the models and reports. This may mean you have to play around with users, roles, and permissions in your data warehouse. Your transformation tool should have read access from these tables. Additionally, you could use dbt grants to apply these permissions directly at build time. 

## Data wrangling benefits

Why should you spend all of that time doing relatively tedious and repetitive work? Well, there are a number of benefits that can make the slog worth it. Those benefits include:

- Increased data quality
- Increase data usability/modularity
- More standardization
- Deeper understanding of data
- Potential performance improvements on downstream models

### Increased data quality

Data wrangling increases the overall quality of your code and the data it produces. Because the cleaning is already done and validated, you don’t have to worry about someone forgetting to clean or standardize a dataset downstream and using messy or inconsistent data. 

### Increased data usability/modularity

Because data is wrangled once when it is ingested into the data warehouse, analytics engineers don’t need to constantly be recleaning and transforming source data from its origin and follow <Term id="dry" /> practices. Wrangled data allows them to use clean and modular models repeatedly throughout their work.

### Standardization

When data is wrangled, it is matched with a standard set that your data team establishes that is then applied to all datasets. It ultimately creates consistent staging layers for analytics engineers to build their intermediate, fct/dim, and mart models. Data team members don’t need to worry about upholding standards in downstream models because this is already done when the data is first ingested.

### Deeper understanding of data

By first wrangling or cleaning data, you get to learn about the data’s intricacies in the process. Though manual, this process allows you to find issues in the data and understand them deeply before using them in downstream processes. This minimzes potential problems that can go unnoticed because you’ve already explored and validated the datasets. It also helps you understand how tables can be joined together downstream.

Additionally, this initial data exploration and transformation helps you collaborate better with [backend application developers](https://docs.getdbt.com/blog/when-backend-devs-spark-joy) or data engineers to work on formatting the raw data in a format that is most appropriate for analytics work.

### Potential performance improvements on downstream models

Lastly, data wrangling allows for potential improvements in performance in downstream models. Because you’ve cleaned the data and potentially removed duplicates and null values, models will be quicker to run.
## Data wrangling in SQL

SQL is the most common language for data wrangling. While you can wrangle data using other languages, such as Python, SQL is the most common (and straightforward) language used for data wrangling and transformation in relational databases. Let’s look at some of the most common SQL functions for each of the data wrangling steps. 

### SQL cleaning

- `CAST` is commonly used to cast values in a column to a specified data type.

- `CONVERT_TZ` can be used to convert values in a column to a specific timezone.

- `LOWER`/`UPPER` is used to capitalize or lowercase string values.

- `TRIM` can remove leading or trailing characters in strings, making string functions easier to use downstream or more consistent across tables.

- `REPLACE` replaces a specified character in column values.

You can also use custom built macros, such as those from a dbt package called [re_data](https://hub.getdbt.com/re-data/re_data/latest/), to clean columns using SQL. 

### Enriching

Enriching data using SQL can often involve the use of functions, such as:

- CASE statements allow you to replace values using  “when-then” statements. They end with an “else” statement to catch the values that don’t fall in any of the “when-then” statements. 
- `IFNULL` replaces any null values in a column with whatever value you specify.
- `COALESCE` returns the first non-null value from a list or column that you give it. This function is useful for replacing null values with one that you specify or coalescing multiple column values together.

### Structuring

Pivot tables come in handy when restructuring your data. You can use them to make your column names your values and vice versa. Dbt has a [macro](https://github.com/dbt-labs/dbt-utils/blob/main/macros/sql/pivot.sql) built out that allows you to completely customize and pivot your tables without having to write crazy complicated code.

For nested data types such as JSON, you’ll want to check out the JSON parsing and extraction function of your data warehouse to help work with this data.

### Validating

dbt offers [generic tests](/docs/build/tests#more-generic-tests) in every dbt project that allows you to validate accepted, unique, and null values. They also allow you to validate the relationships between tables and that the primary key is unique.

If you can’t find what you need with the generic tests, you can download an additional dbt testing package called [dbt_expectations](https://hub.getdbt.com/calogica/dbt_expectations/0.1.2/) that dives even deeper into how you can test the values in your columns. This package has useful tests like `expect_column_values_to_be_in_type_list`, `expect_column_values_to_be_between`, and `expect_column_value_lengths_to_equal`. 

## Conclusion

You could argue that data wrangling is one of the most important parts of an analytics engineer's job. It increases data quality, makes your data usable, standardizes it, increases your understanding, and improves performance. None of this would be possible without data discovery, structuring, cleaning, enriching, validating, and publishing steps that make up the wrangling process. 

## Futher reading

- [Our favorite SQL functions](https://www.getdbt.com/sql-foundations/top-sql-functions/)
- [Glossary: Data warehouse](/terms/data-warehouse)
- [Glossary: Primary key](/terms/primary-key)
- [Glossary: JSON](/terms/json)
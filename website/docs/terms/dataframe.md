---
id: dataframe
title: DataFrame
description: A DataFrame is a way of storing and manipulating tabular data in Python. They gained popularity first as a part of R and then as a part of pandas.
displayText: dataframe  
hoverSnippet: A DataFrame is a two-dimensional data structure (rows and columns). It's the most common way of representing and interacting with large datasets in Python.
---
<head>
  <title>What is a DataFrame in Python? - dbt Labs</title>
</head>

A DataFrame is a way of storing and manipulating tabular data in Python. DataFrames are often likened to tables with columns and rows that you could find in any <Term id="data-warehouse" />, Google Sheet, or Excel workbook.

A DataFrame entry in an analytics engineering glossary…what is happening? You’re reading this right. While SQL is the go-to programming language for most analytics engineering work, there are likely inevitable situations where you've found yourself writing some Python and using DataFrames.

While DataFrames are also used in other languages for data processing, such as R and Scala, the focus of this glossary page will be on Python DataFrames, their use cases, and their relation to analytics engineering work.

## How DataFrames work

DataFrames have a long history ([going back to 1990](https://towardsdatascience.com/preventing-the-death-of-the-dataframe-8bca1c0f83c8#:~:text=The%20earliest%20%E2%80%9Cdataframe%E2%80%9D%2C%20originally,Hastie%20in%201992%20%5B1%5D)!), but gained popularity first as a part of R and then as a part of [pandas](https://pandas.pydata.org/), an open source Python library of useful data analysis and manipulation tools. To work with DataFrames in Python, folks typically need to import the pandas library in the beginning of their script, `.py` file, or Python notebook with the conventional `import pandas as pd`.

One of the strengths of DataFrames lies in its ability to take data in its original form (ex. array, list, <Term id="json" />, parquet, dictionary) and form a tabular (rows and columns) format out of it. Once this data is in a tabular format, you can apply functions and packages to that data to clean, transform, and enrich it.

Below is an example creation of a Python DataFrame from a list and some light enrichment on it:

```python
import pandas as pd

def is_credit_card_purchase(x):
    if x == 'credit_card':
        return True
    else:
        return False

jaffle_shop_orders = [[1, 1, 'credit_card', 1000], [2, 2, 'credit_card', 2000], [3,3, 'coupon', 100]]
orders_df = pd.DataFrame(jaffle_shop_orders, columns=['unique_id', 'order_id', 'payment_method', 'amount'])
orders_df.set_index(['unique_id'], inplace=True)
orders_df['is_credit_card'] = orders_df['payment_method'].apply(is_credit_card_purchase)

print(orders_df)
```

This script will return an `orders_df` DataFrame that looks like this:

| unique_id | order_id | payment_method | amount | is_credit_card |
|---|---|---|---|---|
| 1 | 1 | credit_card | 1000 | True
| 2 | 2 | credit_card | 2000 | True
| 3 | 3 | coupon | 100 | False

:::info A note on Python flavors
If you’re running Python in Snowflake via Snowpark, you would typically be working with [Snowpark](https://docs.snowflake.com/en/developer-guide/snowpark/python/working-with-dataframes.html) or pandas DataFrames. For folks running Python from Google BigQuery or Databricks users, they can use both pandas or [PySpark DataFrames](https://docs.databricks.com/spark/latest/dataframes-datasets/introduction-to-dataframes-python.html). There might be slight syntax differences between the different Python flavors of Snowpark, PySpark, and pandas, but much of the functionality remains the same.
:::

It's also possible and common practice to string together a number of DataFrame transformations. For example, if `df` represents a DataFrame containing one row per person living in the Eastern United States over the last decade, you can calculate the number of people living in Philadelphia each year:

```python
df.filter("city == 'Philadelphia'")
  .withColumn("population", count("name"))
  .group_by("year")
```

In most distributed frameworks, these transformations are evaluated "lazily." Rather than performing each transformation, calculating its results, and storing those results, the framework develops a *plan* for how it *will* perform those calculations. When you want to *act* on the transformed DataFrame—see the top 10 results, or write it back to a table in the database—then the framework's optimizer calculates the most efficient way to deliver those results, based on all the steps you have defined.

If you're familiar with SQL, you can think of a DataFrame like a `select` statement, and each new DataFrame operation as a separate <Term id="cte" />.

You can write a long SQL query containing many complex CTEs. When you run the query with `limit 10` to see a sample of its results, or create that query as a table in the database (what dbt does when it runs your model), the data warehouse optimizes your query and produces the results in the most efficient way possible.

## DataFrame use cases

You could probably write hundreds of pages on DataFrame use cases and examples, but at their core, DataFrames, *in the context of analytics engineering*, are often used to manipulate data outside of SQL capabilities, work with data during API extraction, and leverage data science and machine learning.

### Enrichment and manipulation of data outside of SQL capabilities

Let’s just say it: there’s a lot of things you can do in Python that could do in SQL and vice versa, but Python packages typically win out when it comes to data enrichment. A typical use case for Python DataFrames is the ability to apply Python libraries or functions to data in the DataFrame.

In practice, this could look like applying an [IP parser](https://pypi.org/project/ipparser/) to an IP address column, using a package to determine whether a [date falls on a holiday](/docs/build/python-models#using-pypi-packages), or leveraging [numpy](https://numpy.org/) for performant and complex mathematical computations.

:::tip dbt x Python DataFrames
With v1.3, dbt now supports the use of beta [Python models in dbt](/docs/build/python-models). What does this mean exactly? This means that Python-defined data transformations can be created and used in a dbt project in the same vein as a classic dbt SQL model. These Python models are incredibly new and the team is eagerly looking for feedback in how folks want to use and ritualize them.
:::

### Manipulation of data during extraction and loading scripts

It’s not the most pleasant of experiences, but as an analytics engineer, you’re going to find yourself writing a hacky Python script at one point to extract data from a system or API that doesn’t have an innate connector in an [ETL tool](https://docs.getdbt.com/terms/elt#elt-tools).

As you unpack and unnest the JSON received from these API endpoints, you’ll likely use DataFrames to make your data (and life) a little easier to work with. We won’t go into great depth here since this probably won’t happen too often in your career as an analytics engineer, but it’s beneficial to understand the basics of DataFrames and working with [requests, JSON, and DataFrames](https://stackoverflow.com/questions/42518864/convert-json-data-from-request-into-pandas-dataframe).

### Data science and machine learning

If SQL is an analytics engineer’s oven, Python is a data scientist's stovetop. Data scientists and machine learning engineers often use Python and DataFrames to perform exploratory analysis, feature engineering and data preparation, and the application of models and algorithms on datasets. Understanding and using DataFrames is step 1 (of many steps) to becoming a data person that can create meaningful data science and machine learning models.

All this data science and machine learning talk…“But, I’m an analytics engineer,” you say adamantly. One of the great, beautiful, and sometimes frustrating qualities about analytics engineers is their jack-of-all-trades-ness. You can transform data in your sleep, talk ROI and CPAs all day with your VP of marketing, and use git like you studied computer science in college—what can’t you do?? You’ve probably experimented with a predictive analytics model, some light forecasting, or sentiment analysis at one point in your data journey. You may not be interested in making the conversion to full-fledged data scientists or machine learning engineer, but enjoy a challenge from time to time.

There’s a reason data warehouses and platforms like Snowflake, BigQuery, and Databricks are providing support for Python: because folks are asking for it. There are endless use cases for Python and DataFrames that fall outside of data science and machine learning work, but as you start working and feeling more comfortable in Python, you may be tempted to start experimenting with these different forms of data work. And the world’s your oyster, right?

## Conclusion

A DataFrame is a tabular data storage format in Python that is widely used across different roles in the data world. Since a DataFrame stores data in rows and columns, similar to how analytics engineers manipulate tables stored in data warehouses, data folks can transform, engineer, and enrich data in DataFrames using Python and Python packages. Analytics engineers may find themselves using DataFrames when they’re extracting data via APIs, enriching data with third-party packages, or experimenting with data science and machine learning models.

## Further reading

Are you ready to dip your toes in DataFrames, Python, and dbt? Check out some of the resources below to learn more about how dbt is embracing Python:

- [Python models in dbt](/docs/build/python-models)
- #beta-feedback-python-models Slack channel in the [dbt Community Slack](https://www.getdbt.com/community/join-the-community/)
- [Best practices for developing Python models in dbt discussion](https://github.com/dbt-labs/docs.getdbt.com/discussions/1811)
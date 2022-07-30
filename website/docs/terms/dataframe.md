---
id: dataframe
title: DataFrame
displayText: dataframe  
hoverSnippet: A DataFrame is a two-dimensional data structure (rows and columns). It's the most common way of representing and interacting with large datasets in Python.
---
:::important This page could use some love
This term would benefit from additional depth and examples. Have knowledge to contribute? [Create a discussion in the docs.getdbt.com GitHub repository](https://github.com/dbt-labs/docs.getdbt.com/discussions) to begin the process of becoming a glossary contributor!
:::

<!--- Useful reference: https://databricks.com/glossary/what-are-dataframes --->

A DataFrame is a way of storing and manipulating tabular data in Python. (It's also used in other languages popular for data processing, such as R and Scala.)

It's possible to string together a number of DataFrame transformations. For example, if `df` represents a DataFrame containing one row per person living in the Eastern United States over the last decade, we can calculate the number of people living in Philadelphia each year:
```python
df.filter("city == 'Philadelphia'")
  .withColumn("population", count("name"))
  .group_by("year")
```

In most modern frameworks, these transformations are evaluated "lazily." Rather than performing each transformation, calculating its results, and storing those results, the framework develops a _plan_ for how it _will_ perform those calculations. When you want to _act_ on the transformed DataFrame—see the top 10 results, or write it back to a table in the database—then the framework's optimizer calculates the most efficient way to deliver those results, based on all the steps you have defined.

If you're familiar with SQL, you can think of a DataFrame like a `select` statement, and each new DataFrame operation as a separate <Term id="cte">CTE</Term>. You can write a long SQL query containing many complex CTEs. When you run the query with `limit 10` to see a sample of its results, or create that query as a table in the database (what dbt does when it runs your model), the data warehouse optimizes your query and produces the results in the most efficient way possible.

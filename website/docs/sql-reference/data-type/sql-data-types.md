---
id: data-types
title: SQL Data Types
description: The different data types in SQL are numeric, string, date, booleans, and semi-structured. This content covers the differences between them and their subcategories.
slug: /sql-reference/data-types
---

<head>
    <title>What are the SQL data types?</title>
</head>

Below, we’ll unpack the different umbrellas of data types and the unique data types that fall under each category.

## Numeric data types

There are many different numeric types in SQL and that makes sense because…we’re data people and numbers are important, bit length is important, decimal places are even more important, and numbers are ultimately what allow stakeholders to make certain decisions.

There’s slight differentiation in which numeric data types are supported across each data warehouse, but fundamentally, it’s most important to understand the differences between integers, decimals, and floats.

| **Type** | **Definition** | **Use cases** |
|:---:|:---:|:---:|
| Integer | Integers are numbers without fractions. Think 1, 2, 72384191203—nice, clean numbers. | Though many column values may look like integers (and in theory, they are), they’re often reflected or cast as decimal/numeric types to offer future precision and scale if required.  |
| Decimal | Decimal, also known as the NUMERIC type, is a numeric data type that has a default precision of 38 and a scale of 0. | Typical numeric columns in datasets, such as lifetime value or user ids. Most likely the most common form of numeric data in your tables. |
| Float | Floats are used to provide approximate numeric values of fractions, with a precision of up to 64 bits. Floats offer a larger range of values compared to decimals.  | Columns that are percentages; longitude/latitude.  |

## String data types

Strings are everywhere in data—they allow folks to have descriptive text field columns, use regex in their data work, and honestly, they just make the data world go ‘round. To formalize it, a string type is a word, or the combination of characters that you’ll typically see encased in single quotes (ex. 'Jaffle Shop', '1234 Shire Lane', 'Plan A').

Snowflake, Databricks, Google BigQuery, and Amazon Redshift all support the string data type. They may have slightly varying sub-types for strings; some data warehouses such as Snowflake and Redshift support `text`, `char`, and `character` string types which typically differ in byte length in comparison to the generic string type.

Again, since most string type columns are inherent in your data, you’ll likely be ok using generic varchar or strings for casting, but it never hurts to read up on the docs specific to your data warehouse string support!

## Date data types

Dates, timestamps, timezones—all the fun (slightly painful) data things that make analytics engineers real data practitioners (people who occasionally want to yank their hair out).

Below, we’ll unpack dates, datetimes, times, and timestamps, to help you better understand the core date data types.

Working our way from simplest to most complex, dates, typically represented with the DATE type are what you typically associate with a calendar date (ex. 2022-12-16), and are limited to the range of 0001-01-01 to 9999-12-31.

DATETIME values contain both calendar date and time (ex. 2022-12-16 02:33:24) and may additionally include the sub-seconds. TIME types are typically represented as the HH:MM:SS of a time and don’t contain a specified timezone.

TIMESTAMP data types allow for the greatest specification and precision of a point in time and can be specified with or without a timezone. Most event-driven data fields (ex. Order completed time, account created time, user churned time) will be represented as timestamps in your data sources. Some data warehouses, such as [Amazon Redshift](https://docs.amazonaws.cn/en_us/redshift/latest/dg/r_Datetime_types.html) and [Snowflake](https://docs.snowflake.com/en/sql-reference/data-types-datetime.html#date-time-data-types), support different timestamp options that allow for explicit specification of a timezone (or lack thereof).

In general, the two best practices when it comes to dates and times are:
1. Keep (or convert) timestamps to the same timezone.
2. Keep date types in the most specific date-type as possible: you can always zoom out of a timestamp to get a date, but can’t get a timestamp from a date. 

You’ll ultimately leverage handy date functions to zoom in and out of dates, convert dates, or add times to dates.

## Booleans

A boolean is a column value that is either true, false, or null. In your datasets, you’ll use booleans to create `is_` or `has_` fields to create clear segments in your data; for example, you may use booleans to indicate whether a customer has churned (`has_churned`) or denote employee records (`is_employee`), or filter out records that have been removed from your source data (`is_deleted`). 

Typically, you’ll see `True` or `False` as the actual boolean values in a column, but may also choose to use numeric values, such as 1 and 0, to represent true and false values. The strings of `True` and `False`, however, tend to be a bit easier to read and interpret for end business users.

## Semi-structured data types

Semi-structured data types are a great way to combine or aggregate data across multiple fields; you may also find yourself in the inverse situation where you need to unpack semi-structured data, such as a <Term id="json">JSON</Term> object, and unnest it into its individual key-value pair. The two primary semi-structured data types you’ll see across data warehouses are JSON and arrays. 

Below, we’ll unpack what the difference is between the two and provide an example of each one.

| **Type** | **Definition** | **Example** | **Use case** |
|:---:|:---:|:---:|:---:|
| JSON | When looking at data formatted in JSON, we say that the data is stored in JSON objects. These are composed of key-value pairs. JSON objects are enclosed in curly brackets ({ }) and each key-value pair is separated by a comma. Read more about using JSON here. | {"customer_id":2947, "order_id":4923, "order_items":"cheesecake"} | One of the great things about JSON data is that it doesn't require schema definition—until you unnest it. Extract exactly what you need from your JSON object, and you can forget about the rest! JSON values will often come inherent in your data sources, so learn how to unnest them and your life will become easier. |
| Array | Similar to arrays in other programming languages, an array contains multiple elements that are accessible via its position in that array. | ["cheesecake", "cupcake", "brownie"] | Arrays are a clear way to aggregate multiple values together to create a singular value. Many use cases here, but be cautious: using aggregate functions, such as `array_agg` , can become inefficient on large datasets. |
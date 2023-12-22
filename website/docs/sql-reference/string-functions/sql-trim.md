---
id: trim
title: SQL TRIM
description: The SQL TRIM function removes the leading and trailing characters of a string. By default, it removes the blank space character from the beginning and end of a string.
slug: /sql-reference/trim
---

<head>
    <title>Working with the SQL TRIM function</title>
</head>

We’ve been there: pesky blank spaces, weird, inconsistent formats, or unaccountable asterisks hiding at the end of your column value—[strings](/sql-reference/strings) are one of the most variable data types in your datasets. They likely lack a uniform casing, vary in length, and will inevitably have characters you need to trim from them.

Introducing: the SQL TRIM function, which removes the leading and trailing characters of a string. By default, it removes the blank space character from the beginning and end of a string.

## How to use the SQL TRIM function

The syntax for using TRIM function looks like the following:

```sql
trim(<field_name> [, <characters_to_remove>])
```

Like we said earlier, the default `<characters_to_remove>` is a blank space, such that if you were to `trim(' string with extra leading space')` it would return `'string with extra leading space'`. You can explicitly specify single characters or a pattern to trim from your strings.

### SQL TRIM function example

```sql
select
    first_name,
    concat('*', first_name, '**') as test_string,
    trim(test_string, '*') as back_to_first_name
from {{ ref('customers') }}
limit 3
```

After running this query, the resulting `orders` table will look like this:

| first_name | test_string | back_to_first_name |
|---|---|---|
| Julia | *Julia** | Julia |
| Max | *Max** | Max |
| Laura | *Laura** | Laura |

In this query, you’re adding superfluous asterisks to a string using the [CONCAT function](/sql-reference/concat) and recleaning it using the TRIM function. Even though I specified one asterisk in the TRIM function itself, it recognizes that as a pattern to remove from the beginning and end of a string, which is why the double asterisks (**) were removed from the end of the `test_string` column.

## SQL TRIM function syntax in Snowflake, Databricks, BigQuery, and Redshift

[Google BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/string_functions#trim), [Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_TRIM.html), [Snowflake](https://docs.snowflake.com/en/sql-reference/functions/trim.html), and [Databricks](https://docs.databricks.com/sql/language-manual/functions/trim.html) all support the ability to use the TRIM function. In addition, the syntax to trim strings is the same across all of them using the TRIM function. These data warehouses also support the RTRIM and LTRIM functions, which allow you to only trim characters from the right side and left side of a string, respectively.

## TRIM function use cases

If string values in your raw data have extra white spaces or miscellaneous characters, you’ll leverage the TRIM (and subset RTRIM AND LTRIM) functions to help you quickly remove them. You’ll likely do this cleanup in [staging models](https://docs.getdbt.com/best-practices/how-we-structure/2-staging), where you’re probably standardizing casing and doing other minor formatting changes to string values, so you can use a clean and consistent format across your downstream models.

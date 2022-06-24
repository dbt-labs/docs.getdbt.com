---
title: "cross-database macros"
id: "cross-database-macros"
---

# Overview

These macros make it easier for package authors (especially those writing modeling packages) to implement cross-database
compatibility. In general, you should not need these macros in your own dbt project (unless it is a package or you otherwise desire cross-database compatibility).

## All functions (alphabetical)
- [dbt.any_value](#any_value)
- [dbt.bool_or](#bool_or)
- [dbt.cast_bool_to_text](#cast_bool_to_text)
- [dbt.concat](#concat)
- [dbt.current_timestamp](#current_timestamp)
- [dbt.current_timestamp_in_utc](#current_timestamp_in_utc)
- [dbt.dateadd](#dateadd)
- [dbt.datediff](#datediff)
- [dbt.date_trunc](#date_trunc)
- [dbt.escape_single_quotes](#escape_single_quotes)
- [dbt.except](#except)
- [dbt.hash](#hash)
- [dbt.intersect](#intersect)
- [dbt.last_day](#last_day)
- [dbt.length](#length)
- [dbt.listagg](#listagg)
- [dbt.position](#position)
- [dbt.replace](#replace)
- [dbt.right](#right)
- [dbt.safe_cast](#safe_cast)
- [dbt.split_part](#split_part)
- [dbt.string_literal](#string_literal)

## Set functions
- [dbt.except](#except)
- [dbt.intersect](#intersect)

## String functions
- [dbt.concat](#concat)
- [dbt.hash](#hash)
- [dbt.length](#length)
- [dbt.position](#position)
- [dbt.replace](#replace)
- [dbt.right](#right)
- [dbt.split_part](#split_part)

## Aggregate and window functions
- [dbt.any_value](#any_value)
- [dbt.bool_or](#bool_or)
- [dbt.listagg](#listagg)

## Cast functions
- [dbt.cast_bool_to_text](#cast_bool_to_text)
- [dbt.safe_cast](#safe_cast)

## Non-SQL Jinja functions
- [dbt.escape_single_quotes](#escape_single_quotes)
- [dbt.string_literal](#string_literal)

## Timestamp functions
- [dbt.current_timestamp](#current_timestamp)
- [dbt.current_timestamp_in_utc](#current_timestamp_in_utc)

## Date and time functions
- [dbt.dateadd](#dateadd)
- [dbt.datediff](#datediff)
- [dbt.date_trunc](#date_trunc)
- [dbt.last_day](#last_day)

# Set functions

## except
__Args__:

 * None

`except` is one of the set operators specified ANSI SQL-92 (along with `union` and `intersect`) and is akin to [set difference](https://en.wikipedia.org/wiki/Complement_(set_theory)#Relative_complement).

**Usage**:

<File name='models/example.sql'>

```sql
{{ dbt.except() }}
```

</File>

## intersect
__Args__:

 * None

`intersect` is one of the set operators specified ANSI SQL-92 (along with `union` and `except`) and is akin to [set intersection](https://en.wikipedia.org/wiki/Intersection_(set_theory)).

**Usage**:

<File name='models/example.sql'>

```sql
{{ dbt.intersect() }}
```

</File>

# String functions

## concat
__Args__:

 * `fields`: Jinja array of [attribute names or expressions](#sql-expressions).

This macro combines a list of strings together.

**Usage**:

<File name='models/example.sql'>

```sql
{{ dbt.concat(["column_1", "column_2"]) }}
{{ dbt.concat(["year_column", "'-'" , "month_column", "'-'" , "day_column"]) }}
{{ dbt.concat(["first_part_column", "'.'" , "second_part_column"]) }}
{{ dbt.concat(["first_part_column", "','" , "second_part_column"]) }}
```

</File>

## hash
__Args__:

 * `field`: [attribute name or expression](#sql-expressions).

This macro provides a hash (such as [MD5](https://en.wikipedia.org/wiki/MD5)) of an [expression](#sql-expressions) cast as a string.

**Usage**:

<File name='models/example.sql'>

```sql
{{ dbt.hash("column") }}
{{ dbt.hash("'Pennsylvania'") }}
```

</File>

## length
__Args__:

 * `expression`: string [expression](#sql-expressions).


This macro calculates the number of characters in a string.

**Usage**:

<File name='models/example.sql'>

```sql
{{ dbt.length("column") }}
```

</File>

## position
__Args__:

 * `substring_text`: [attribute name or expression](#sql-expressions).
 * `string_text`: [attribute name or expression](#sql-expressions).

This macro searches for the first occurrence of `substring_text` within `string_text` and returns the 1-based position if found.

**Usage**:

<File name='models/example.sql'>

```sql
{{ dbt.position("substring_column", "text_column") }}
{{ dbt.position("'-'", "text_column") }}
```

</File>

## replace
__Args__:

 * `field`: [attribute name or expression](#sql-expressions).
 * `old_chars`: [attribute name or expression](#sql-expressions).
 * `new_chars`: [attribute name or expression](#sql-expressions).

This macro updates a string and replaces all occurrences of one substring with another. The precise behavior may vary slightly from one adapter to another.

**Usage**:

<File name='models/example.sql'>

```sql
{{ dbt.replace("string_text_column", "old_chars_column", "new_chars_column") }}
{{ dbt.replace("string_text_column", "'-'", "'_'") }}
```

</File>

## right
__Args__:

 * `string_text`: [attribute name or expression](#sql-expressions).
 * `length_expression`: numeric [expression](#sql-expressions).

This macro returns the N rightmost characters from a string.

**Usage**:

<File name='models/example.sql'>

```sql
{{ dbt.right("string_text_column", "length_column") }}
{{ dbt.right("string_text_column", "3") }}
```

</File>

# Aggregate and window functions

## any_value
__Args__:

 * `expression`: an [expression](#sql-expressions).

This macro returns some value of the expression from the group. The selected value is non-deterministic (rather than random).

**Usage**:

<File name='models/example.sql'>

```sql
{{ dbt.any_value("column_name") }}
```

</File>

## bool_or
__Args__:

 * `expression`: [attribute name or expression](#sql-expressions).

This macro returns the logical `OR` of all non-`NULL` expressions -- `true` if at least one record in the group evaluates to `true`.

**Usage**:

<File name='models/example.sql'>

```sql
{{ dbt.bool_or("boolean_column") }}
{{ dbt.bool_or("integer_column = 3") }}
{{ dbt.bool_or("string_column = 'Pennsylvania'") }}
{{ dbt.bool_or("column1 = column2") }}
```

</File>

## listagg
__Args__:

 * `measure` (required): The [attribute name or expression](#sql-expressions) that determines the values to be concatenated. To only include distinct values add keyword `DISTINCT` to beginning of expression (example: 'DISTINCT column_to_agg').
 * `delimiter_text` (required): Text representing the delimiter to separate concatenated values by.
 * `order_by_clause` (optional): An expression (typically one or more column names separated by commas) that determines the order of the concatenated values.
 * `limit_num` (optional): Specifies the maximum number of values to be concatenated.

This macro returns the concatenated input values from a group of rows separated by a specified delimiter.

**Usage**:

Note: If there are instances of `delimiter_text` within your `measure`, you cannot include a `limit_num`.

<File name='models/example.sql'>

```sql
{{ dbt.listagg(measure="column_to_agg", delimiter_text="','", order_by_clause="order by order_by_column", limit_num=10) }}
```

</File>

# Cast functions

## cast_bool_to_text
__Args__:

 * `field`: boolean [attribute name or expression](#sql-expressions).

This macro casts a boolean value to a string.

**Usage**:

<File name='models/example.sql'>

```sql
{{ dbt.cast_bool_to_text("boolean_column_name") }}
{{ dbt.cast_bool_to_text("false") }}
{{ dbt.cast_bool_to_text("true") }}
{{ dbt.cast_bool_to_text("0 = 1") }}
{{ dbt.cast_bool_to_text("1 = 1") }}
{{ dbt.cast_bool_to_text("null") }}
```

</File>

## safe_cast
__Args__:

 * `field`: [attribute name or expression](#sql-expressions).
 * `type`: data type to convert to

For databases that support it, this macro will return `NULL` when the cast fails (instead of raising an error).

**Usage**:

<File name='models/example.sql'>

```sql
{{ dbt.safe_cast("column_1", api.Column.translate_type("string")) }}
{{ dbt.safe_cast("column_2", api.Column.translate_type("integer")) }}
{{ dbt.safe_cast("'2016-03-09'", api.Column.translate_type("date")) }}
```

</File>

# Non-SQL Jinja functions

## escape_single_quotes
__Args__:

 * `value`: Jinja string literal value

This macro adds escape characters for any single quotes within the provided string literal. Note: if given a column, it will only operate on the column _name_, not the values within the column.

To escape quotes for column values, consider a macro like [replace](#replace) or a regular expression replace.

**Usage**:

<File name='models/example.sql'>

```sql
{{ dbt.escape_single_quotes("they're") }}
{{ dbt.escape_single_quotes("ain't ain't a word") }}
```

</File>

## string_literal
__Args__:

 * `value`: Jinja string value

This macro converts a Jinja string into a SQL string literal.

To cast column values to a string, consider a macro like [safe_cast](#safe_cast) or an ordinary cast.

**Usage**:

<File name='models/example.sql'>

```sql
select {{ dbt.string_literal("Pennsylvania") }}
```

</File>

# Timestamp functions

## current_timestamp
__Args__:

 * None

This macro returns the current timestamp.

**Usage**:

<File name='models/example.sql'>

```sql
{{ dbt.current_timestamp() }}
```

</File>

## current_timestamp_in_utc
__Args__:

 * None

This macro returns the current timestamp expressed in [Coordinated Universal Time (UTC)](https://en.wikipedia.org/wiki/Coordinated_Universal_Time).

**Usage**:

<File name='models/example.sql'>

```sql
{{ dbt.current_timestamp_in_utc() }}
```

</File>

# Date and time functions

## dateadd
__Args__:

 * `datepart`: [date or time part](#date-and-time-parts).
 * `interval`: integer count of the `datepart` to add (can be positive or negative)
 * `from_date_or_timestamp`: date/time [expression](#sql-expressions).

This macro adds a time/day interval to the supplied date/timestamp. Note: The `datepart` argument is database-specific.

**Usage**:

<File name='models/example.sql'>

```sql
{{ dbt.dateadd(datepart="day", interval=1, from_date_or_timestamp="'2016-03-09'") }}
{{ dbt.dateadd(datepart="month", interval=-2, from_date_or_timestamp="'2016-03-09'") }}
```

</File>

## datediff
__Args__:

 * `first_date`: date/time [expression](#sql-expressions).
 * `second_date`: date/time [expression](#sql-expressions).
 * `datepart`: [date or time part](#date-and-time-parts).

This macro calculates the difference between two dates.

**Usage**:

<File name='models/example.sql'>

```sql
{{ dbt.datediff("column_1", "column_2", "day") }}
{{ dbt.datediff("column", "'2016-03-09'", "month") }}
{{ dbt.datediff("'2016-03-09'", "column", "year") }}
```

</File>

## date_trunc
__Args__:

 * `datepart`: [date or time part](#date-and-time-parts).
 * `date`: date/time [expression](#sql-expressions).

This macro truncates / rounds a timestamp to the first instant for the given [date or time part](#date-and-time-parts).

**Usage**:

<File name='models/example.sql'>

```sql
{{ dbt.date_trunc("day", "updated_at") }}
{{ dbt.date_trunc("month", "updated_at") }}
{{ dbt.date_trunc("year", "'2016-03-09'") }}
```

</File>

## last_day
__Args__:

 * `date`: date/time [expression](#sql-expressions).
 * `datepart`: [date or time part](#date-and-time-parts).

This macro gets the last day for a given date and datepart.

**Usage**:
- The `datepart` argument is database-specific.
- This macro currently only supports dateparts of `month` and `quarter`.

<File name='models/example.sql'>

```sql
{{ dbt.last_day("created_at", "month") }}
{{ dbt.last_day("'2016-03-09'", "year") }}
```

</File>

## Date and time parts

Often supported date and time parts (case insensitive):
* `year`
* `quarter`
* `month`
* `week`
* `day`
* `hour`
* `minute`
* `second`
* `millisecond`
* `microsecond`
* `nanosecond`

This listing is not meant to be exhaustive, and some of these date and time parts may not be supported for particular adapters.
Some macros may not support all date and time parts. Some adapters may support more or less precision.

## SQL expressions

A SQL expression may take forms like the following:
- function
- column name
- date literal
- string literal
- &lt;other data type&gt; literal (number, etc)
- `NULL`

Example:
Suppose there is an `orders` table with a column named `order_date`. The following shows 3 different types of expressions:
```sql
select
    date_trunc(month, order_date) as expression_function,
    order_date as expression_column_name,
    '2016-03-09' as expression_date_literal,
    'Pennsylvania' as expression_string_literal,
    3 as expression_number_literal,
    NULL as expression_null,
from orders
```

Note that the string literal example includes single quotes. (Note: the string literal character may vary per database. For this example, we suppose a single quote.) To refer to a SQL string literal in Jinja, surrounding double quotes are required.

So within Jinja, the string values would be:
- `"date_trunc(month, order_date)"`
- `"order_date"`
- `"'2016-03-09'"`
- `"'Pennsylvania'"`
- `"NULL"`

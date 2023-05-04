---
title: "About cross-database macros"
sidebar_label: "cross-database macros"
id: "cross-database-macros"
description: "Read this guide to understand cross-database macros in dbt."
---

# Cross-database macros

These macros benefit three different user groups:
- If you maintain a package, your package is more likely to work on other adapters by using these macros (rather than a specific database's SQL syntax)
- If you maintain an adapter, your adapter is more likely to support more packages by implementing (and testing) these macros.
- If you're an end user, more packages and adapters are likely to "just work" for you (without you having to do anything).

:::note Note
Please make sure to take a look at the [SQL expressions section](#sql-expressions) to understand quoting syntax for string values and date literals.
:::

## All functions (alphabetical)

<VersionBlock firstVersion="1.2" lastVersion="1.2">

- [Cross-database macros](#cross-database-macros)
  - [All functions (alphabetical)](#all-functions-alphabetical)
  - [Data type functions](#data-type-functions)
    - [type\_bigint](#type_bigint)
    - [type\_boolean](#type_boolean)
    - [type\_float](#type_float)
    - [type\_int](#type_int)
    - [type\_numeric](#type_numeric)
    - [type\_string](#type_string)
    - [type\_timestamp](#type_timestamp)
  - [Set functions](#set-functions)
    - [except](#except)
    - [intersect](#intersect)
  - [Array functions](#array-functions)
    - [array\_append](#array_append)
    - [array\_concat](#array_concat)
    - [array\_construct](#array_construct)
  - [String functions](#string-functions)
    - [concat](#concat)
    - [hash](#hash)
    - [length](#length)
    - [position](#position)
    - [replace](#replace)
    - [right](#right)
    - [split\_part](#split_part)
  - [String literal functions](#string-literal-functions)
    - [escape\_single\_quotes](#escape_single_quotes)
    - [string\_literal](#string_literal)
  - [Aggregate and window functions](#aggregate-and-window-functions)
    - [any\_value](#any_value)
    - [bool\_or](#bool_or)
    - [listagg](#listagg)
  - [Cast functions](#cast-functions)
    - [cast\_bool\_to\_text](#cast_bool_to_text)
    - [safe\_cast](#safe_cast)
  - [Date and time functions](#date-and-time-functions)
    - [dateadd](#dateadd)
    - [datediff](#datediff)
    - [date\_trunc](#date_trunc)
    - [last\_day](#last_day)
  - [Date and time parts](#date-and-time-parts)
  - [SQL expressions](#sql-expressions)

</VersionBlock>
<VersionBlock firstVersion="1.3">

- [Cross-database macros](#cross-database-macros)
  - [All functions (alphabetical)](#all-functions-alphabetical)
  - [Data type functions](#data-type-functions)
    - [type\_bigint](#type_bigint)
    - [type\_boolean](#type_boolean)
    - [type\_float](#type_float)
    - [type\_int](#type_int)
    - [type\_numeric](#type_numeric)
    - [type\_string](#type_string)
    - [type\_timestamp](#type_timestamp)
  - [Set functions](#set-functions)
    - [except](#except)
    - [intersect](#intersect)
  - [Array functions](#array-functions)
    - [array\_append](#array_append)
    - [array\_concat](#array_concat)
    - [array\_construct](#array_construct)
  - [String functions](#string-functions)
    - [concat](#concat)
    - [hash](#hash)
    - [length](#length)
    - [position](#position)
    - [replace](#replace)
    - [right](#right)
    - [split\_part](#split_part)
  - [String literal functions](#string-literal-functions)
    - [escape\_single\_quotes](#escape_single_quotes)
    - [string\_literal](#string_literal)
  - [Aggregate and window functions](#aggregate-and-window-functions)
    - [any\_value](#any_value)
    - [bool\_or](#bool_or)
    - [listagg](#listagg)
  - [Cast functions](#cast-functions)
    - [cast\_bool\_to\_text](#cast_bool_to_text)
    - [safe\_cast](#safe_cast)
  - [Date and time functions](#date-and-time-functions)
    - [dateadd](#dateadd)
    - [datediff](#datediff)
    - [date\_trunc](#date_trunc)
    - [last\_day](#last_day)
  - [Date and time parts](#date-and-time-parts)
  - [SQL expressions](#sql-expressions)

</VersionBlock>

<VersionBlock firstVersion="1.2" lastVersion="1.2">

[**Data type functions**](#data-type-functions)
- [type_bigint](#type_bigint)
- [type_float](#type_float)
- [type_int](#type_int)
- [type_numeric](#type_numeric)
- [type_string](#type_string)
- [type_timestamp](#type_timestamp)

</VersionBlock>
<VersionBlock firstVersion="1.3">

[**Data type functions**](#data-type-functions)
- [type_bigint](#type_bigint)
- [type_boolean](#type_boolean)
- [type_float](#type_float)
- [type_int](#type_int)
- [type_numeric](#type_numeric)
- [type_string](#type_string)
- [type_timestamp](#type_timestamp)

</VersionBlock>

[**Set functions**](#set-functions)
- [except](#except)
- [intersect](#intersect)

<VersionBlock firstVersion="1.3">

[**Array functions**](#array-functions)
- [array_append](#array_append)
- [array_concat](#array_concat)
- [array_construct](#array_construct)

</VersionBlock>

[**String functions**](#string-functions)
- [concat](#concat)
- [hash](#hash)
- [length](#length)
- [position](#position)
- [replace](#replace)
- [right](#right)
- [split_part](#split_part)

[**String literal functions**](#string-literal-functions)
- [escape_single_quotes](#escape_single_quotes)
- [string_literal](#string_literal)

[**Aggregate and window functions**](#aggregate-and-window-functions)
- [any_value](#any_value)
- [bool_or](#bool_or)
- [listagg](#listagg)

[**Cast functions**](#cast-functions)
- [cast_bool_to_text](#cast_bool_to_text)
- [safe_cast](#safe_cast)

[**Date and time functions**](#date-and-time-functions)
- [dateadd](#dateadd)
- [datediff](#datediff)
- [date_trunc](#date_trunc)
- [last_day](#last_day)

## Data type functions

### type_bigint
__Args__:

 * None

This macro yields the database-specific data type for a `BIGINT`.

**Usage**:

```sql
{{ dbt.type_bigint() }}
```

**Sample Output (PostgreSQL)**:

```sql
bigint
```

<VersionBlock firstVersion="1.3">

### type_boolean
__Args__:

 * None

This macro yields the database-specific data type for a `BOOLEAN`.

**Usage**:

```sql
{{ dbt.type_boolean() }}
```

**Sample Output (PostgreSQL)**:

```sql
BOOLEAN
```

</VersionBlock>

### type_float
__Args__:

 * None

This macro yields the database-specific data type for a `FLOAT`.

**Usage**:

```sql
{{ dbt.type_float() }}
```

**Sample Output (PostgreSQL)**:

```sql
FLOAT
```

### type_int
__Args__:

 * None

This macro yields the database-specific data type for an `INT`.

**Usage**:

```sql
{{ dbt.type_int() }}
```

**Sample Output (PostgreSQL)**:

```sql
INT
```

### type_numeric

__Args__:

 * None

This macro yields the database-specific data type for a `NUMERIC`.

**Usage**:

```sql
{{ dbt.type_numeric() }}
```

**Sample Output (PostgreSQL)**:

```sql
numeric(28,6)
```

### type_string
__Args__:

 * None

This macro yields the database-specific data type for `TEXT`.

**Usage**:

```sql
{{ dbt.type_string() }}
```

**Sample Output (PostgreSQL)**:

```sql
TEXT
```

### type_timestamp
__Args__:

 * None

This macro yields the database-specific data type for a `TIMESTAMP` (which may or may not match the behavior of `TIMESTAMP WITHOUT TIMEZONE` from ANSI SQL-92).

**Usage**:

```sql
{{ dbt.type_timestamp() }}
```

**Sample Output (PostgreSQL)**:

```sql
TIMESTAMP
```

## Set functions

### except
__Args__:

 * None

`except` is one of the set operators specified ANSI SQL-92 (along with `union` and `intersect`) and is akin to [set difference](https://en.wikipedia.org/wiki/Complement_(set_theory)#Relative_complement).

**Usage**:

```sql
{{ dbt.except() }}
```

**Sample Output (PostgreSQL)**:

```sql
except
```

### intersect
__Args__:

 * None

`intersect` is one of the set operators specified ANSI SQL-92 (along with `union` and `except`) and is akin to [set intersection](https://en.wikipedia.org/wiki/Intersection_(set_theory)).

**Usage**:

```sql
{{ dbt.intersect() }}
```

**Sample Output (PostgreSQL)**:

```sql
intersect
```

<VersionBlock firstVersion="1.3">

## Array functions

### array_append
__Args__:

 * `array` (required): The array to append to.
 * `new_element` (required): The element to be appended. This element must *match the data type of the existing elements* in the array in order to match PostgreSQL functionality and *not null* to match BigQuery functionality.

This macro appends an element to the end of an array and returns the appended array.

**Usage**:

```sql
{{ dbt.array_append("array_column", "element_column") }}
{{ dbt.array_append("array_column", "5") }}
{{ dbt.array_append("array_column", "'blue'") }}
```

**Sample Output (PostgreSQL)**:

```sql
array_append(array_column, element_column)
array_append(array_column, 5)
array_append(array_column, 'blue')
```

### array_concat
__Args__:

 * `array_1` (required): The array to append to.
 * `array_2` (required): The array to be appended to `array_1`. This array must match the data type of `array_1` in order to match PostgreSQL functionality.

This macro returns the concatenation of two arrays.

**Usage**:

```sql
{{ dbt.array_concat("array_column_1", "array_column_2") }}
```

**Sample Output (PostgreSQL)**:

```sql
array_cat(array_column_1, array_column_2)
```

### array_construct
__Args__:

 * `inputs` (optional): The list of array contents. If not provided, this macro will create an empty array. All inputs must be the *same data type* in order to match PostgreSQL functionality and *not null* to match BigQuery functionality.
 * `data_type` (optional): Specifies the data type of the constructed array. This is only relevant when creating an empty array (will otherwise use the data type of the inputs). If `inputs` are `data_type` are both not provided, this macro will create an empty array of type integer.

This macro returns an array constructed from a set of inputs.

**Usage**:

```sql
{{ dbt.array_construct(["column_1", "column_2", "column_3"]) }}
{{ dbt.array_construct([], "integer") }}
{{ dbt.array_construct([1, 2, 3, 4]) }}
{{ dbt.array_construct(["'blue'", "'green'"]) }}
```

**Sample Output (PostgreSQL)**:

```sql
array[ column_1 , column_2 , column_3 ]
array[]::integer[]
array[ 1 , 2 , 3 , 4 ]
array[ 'blue' , 'green' ]
```

</VersionBlock>

## String functions

### concat
__Args__:

 * `fields`: Jinja array of [attribute names or expressions](#sql-expressions).

This macro combines a list of strings together.

**Usage**:

```sql
{{ dbt.concat(["column_1", "column_2"]) }}
{{ dbt.concat(["year_column", "'-'" , "month_column", "'-'" , "day_column"]) }}
{{ dbt.concat(["first_part_column", "'.'" , "second_part_column"]) }}
{{ dbt.concat(["first_part_column", "','" , "second_part_column"]) }}
```

**Sample Output (PostgreSQL)**:

```sql
column_1 || column_2
year_column || '-' || month_column || '-' || day_column
first_part_column || '.' || second_part_column
first_part_column || ',' || second_part_column
```

### hash
__Args__:

 * `field`: [attribute name or expression](#sql-expressions).

This macro provides a hash (such as [MD5](https://en.wikipedia.org/wiki/MD5)) of an [expression](#sql-expressions) cast as a string.

**Usage**:

```sql
{{ dbt.hash("column") }}
{{ dbt.hash("'Pennsylvania'") }}
```

**Sample Output (PostgreSQL)**:

```sql
md5(cast(column as 
    varchar
))
md5(cast('Pennsylvania' as 
    varchar
))
```

### length
__Args__:

 * `expression`: string [expression](#sql-expressions).


This macro calculates the number of characters in a string.

**Usage**:

```sql
{{ dbt.length("column") }}
```

**Sample Output (PostgreSQL)**:

```sql
    length(
        column
    )
```

### position
__Args__:

 * `substring_text`: [attribute name or expression](#sql-expressions).
 * `string_text`: [attribute name or expression](#sql-expressions).

This macro searches for the first occurrence of `substring_text` within `string_text` and returns the 1-based position if found.

**Usage**:

```sql
{{ dbt.position("substring_column", "text_column") }}
{{ dbt.position("'-'", "text_column") }}
```

**Sample Output (PostgreSQL)**:

```sql
    position(
        substring_column in text_column
    )

    position(
        '-' in text_column
    )
```

### replace
__Args__:

 * `field`: [attribute name or expression](#sql-expressions).
 * `old_chars`: [attribute name or expression](#sql-expressions).
 * `new_chars`: [attribute name or expression](#sql-expressions).

This macro updates a string and replaces all occurrences of one substring with another. The precise behavior may vary slightly from one adapter to another.

**Usage**:

```sql
{{ dbt.replace("string_text_column", "old_chars_column", "new_chars_column") }}
{{ dbt.replace("string_text_column", "'-'", "'_'") }}
```

**Sample Output (PostgreSQL)**:

```sql
    replace(
        string_text_column,
        old_chars_column,
        new_chars_column
    )

    replace(
        string_text_column,
        '-',
        '_'
    )
```

### right
__Args__:

 * `string_text`: [attribute name or expression](#sql-expressions).
 * `length_expression`: numeric [expression](#sql-expressions).

This macro returns the N rightmost characters from a string.

**Usage**:

```sql
{{ dbt.right("string_text_column", "length_column") }}
{{ dbt.right("string_text_column", "3") }}
```

**Sample Output (PostgreSQL)**:

```sql
    right(
        string_text_column,
        length_column
    )

    right(
        string_text_column,
        3
    )
```

### split_part
__Args__:

* `string_text` (required): Text to be split into parts.
* `delimiter_text` (required): Text representing the delimiter to split by.
* `part_number` (required): Requested part of the split (1-based). If the value is negative, the parts are counted backward from the end of the string.

This macro splits a string of text using the supplied delimiter and returns the supplied part number (1-indexed).

**Usage**:

When referencing a column, use one pair of quotes. When referencing a string, use single quotes enclosed in double quotes.

```sql
{{ dbt.split_part(string_text='column_to_split', delimiter_text='delimiter_column', part_number=1) }}
{{ dbt.split_part(string_text="'1|2|3'", delimiter_text="'|'", part_number=1) }}
```

**Sample Output (PostgreSQL)**:

```sql
    split_part(
        column_to_split,
        delimiter_column,
        1
        )

    split_part(
        '1|2|3',
        '|',
        1
        )
```

## String literal functions

### escape_single_quotes
__Args__:

 * `value`: Jinja string literal value

This macro adds escape characters for any single quotes within the provided string literal. Note: if given a column, it will only operate on the column _name_, not the values within the column.

To escape quotes for column values, consider a macro like [replace](#replace) or a regular expression replace.

**Usage**:

```sql
{{ dbt.escape_single_quotes("they're") }}
{{ dbt.escape_single_quotes("ain't ain't a word") }}
```

**Sample Output (PostgreSQL)**:

```sql
they''re
ain''t ain''t a word
```

### string_literal
__Args__:

 * `value`: Jinja string value

This macro converts a Jinja string into a SQL string literal.

To cast column values to a string, consider a macro like [safe_cast](#safe_cast) or an ordinary cast.

**Usage**:

```sql
select {{ dbt.string_literal("Pennsylvania") }}
```

**Sample Output (PostgreSQL)**:

```sql
select 'Pennsylvania'
```

## Aggregate and window functions

### any_value
__Args__:

 * `expression`: an [expression](#sql-expressions).

This macro returns some value of the expression from the group. The selected value is non-deterministic (rather than random).

**Usage**:

```sql
{{ dbt.any_value("column_name") }}
```

**Sample Output (PostgreSQL)**:

```sql
any(column_name)
```

### bool_or
__Args__:

 * `expression`: [attribute name or expression](#sql-expressions).

This macro returns the logical `OR` of all non-`NULL` expressions -- `true` if at least one record in the group evaluates to `true`.

**Usage**:

```sql
{{ dbt.bool_or("boolean_column") }}
{{ dbt.bool_or("integer_column = 3") }}
{{ dbt.bool_or("string_column = 'Pennsylvania'") }}
{{ dbt.bool_or("column1 = column2") }}
```

**Sample Output (PostgreSQL)**:

```sql
bool_or(boolean_column)
bool_or(integer_column = 3)
bool_or(string_column = 'Pennsylvania')
bool_or(column1 = column2)
```

### listagg
__Args__:

 * `measure` (required): The [attribute name or expression](#sql-expressions) that determines the values to be concatenated. To only include distinct values add keyword `DISTINCT` to beginning of expression (example: 'DISTINCT column_to_agg').
 * `delimiter_text` (required): Text representing the delimiter to separate concatenated values by.
 * `order_by_clause` (optional): An expression (typically one or more column names separated by commas) that determines the order of the concatenated values.
 * `limit_num` (optional): Specifies the maximum number of values to be concatenated.

This macro returns the concatenated input values from a group of rows separated by a specified delimiter.

**Usage**:

Note: If there are instances of `delimiter_text` within your `measure`, you cannot include a `limit_num`.

```sql
{{ dbt.listagg(measure="column_to_agg", delimiter_text="','", order_by_clause="order by order_by_column", limit_num=10) }}
```

**Sample Output (PostgreSQL)**:

```sql
array_to_string(
        (array_agg(
            column_to_agg
            order by order_by_column
        ))[1:10],
        ','
        )
```

## Cast functions

### cast_bool_to_text
__Args__:

 * `field`: boolean [attribute name or expression](#sql-expressions).

This macro casts a boolean value to a string.

**Usage**:

```sql
{{ dbt.cast_bool_to_text("boolean_column_name") }}
{{ dbt.cast_bool_to_text("false") }}
{{ dbt.cast_bool_to_text("true") }}
{{ dbt.cast_bool_to_text("0 = 1") }}
{{ dbt.cast_bool_to_text("1 = 1") }}
{{ dbt.cast_bool_to_text("null") }}
```

**Sample Output (PostgreSQL)**:

```sql
    cast(boolean_column_name as 
    varchar
)

    cast(false as 
    varchar
)

    cast(true as 
    varchar
)

    cast(0 = 1 as 
    varchar
)

    cast(1 = 1 as 
    varchar
)

    cast(null as 
    varchar
)
```

### safe_cast
__Args__:

 * `field`: [attribute name or expression](#sql-expressions).
 * `type`: data type to convert to

For databases that support it, this macro will return `NULL` when the cast fails (instead of raising an error).

**Usage**:

```sql
{{ dbt.safe_cast("column_1", api.Column.translate_type("string")) }}
{{ dbt.safe_cast("column_2", api.Column.translate_type("integer")) }}
{{ dbt.safe_cast("'2016-03-09'", api.Column.translate_type("date")) }}
```

**Sample Output (PostgreSQL)**:

```sql
    cast(column_1 as TEXT)
    cast(column_2 as INT)
    cast('2016-03-09' as date)
```

## Date and time functions

### dateadd
__Args__:

 * `datepart`: [date or time part](#date-and-time-parts).
 * `interval`: integer count of the `datepart` to add (can be positive or negative)
 * `from_date_or_timestamp`: date/time [expression](#sql-expressions).

This macro adds a time/day interval to the supplied date/timestamp. Note: The `datepart` argument is database-specific.

**Usage**:

```sql
{{ dbt.dateadd(datepart="day", interval=1, from_date_or_timestamp="'2016-03-09'") }}
{{ dbt.dateadd(datepart="month", interval=-2, from_date_or_timestamp="'2016-03-09'") }}
```

**Sample Output (PostgreSQL)**:

```sql
    '2016-03-09' + ((interval '10 day') * (1))
    '2016-03-09' + ((interval '10 month') * (-2))
```

### datediff
__Args__:

 * `first_date`: date/time [expression](#sql-expressions).
 * `second_date`: date/time [expression](#sql-expressions).
 * `datepart`: [date or time part](#date-and-time-parts).

This macro calculates the difference between two dates.

**Usage**:

```sql
{{ dbt.datediff("column_1", "column_2", "day") }}
{{ dbt.datediff("column", "'2016-03-09'", "month") }}
{{ dbt.datediff("'2016-03-09'", "column", "year") }}
```

**Sample Output (PostgreSQL)**:

```sql
        ((column_2)::date - (column_1)::date)

        ((date_part('year', ('2016-03-09')::date) - date_part('year', (column)::date))
     * 12 + date_part('month', ('2016-03-09')::date) - date_part('month', (column)::date))

        (date_part('year', (column)::date) - date_part('year', ('2016-03-09')::date))
```

### date_trunc
__Args__:

 * `datepart`: [date or time part](#date-and-time-parts).
 * `date`: date/time [expression](#sql-expressions).

This macro truncates / rounds a timestamp to the first instant for the given [date or time part](#date-and-time-parts).

**Usage**:

```sql
{{ dbt.date_trunc("day", "updated_at") }}
{{ dbt.date_trunc("month", "updated_at") }}
{{ dbt.date_trunc("year", "'2016-03-09'") }}
```

**Sample Output (PostgreSQL)**:

```sql
date_trunc('day', updated_at)
date_trunc('month', updated_at)
date_trunc('year', '2016-03-09')
```

### last_day
__Args__:

 * `date`: date/time [expression](#sql-expressions).
 * `datepart`: [date or time part](#date-and-time-parts).

This macro gets the last day for a given date and datepart.

**Usage**:
- The `datepart` argument is database-specific.
- This macro currently only supports dateparts of `month` and `quarter`.

```sql
{{ dbt.last_day("created_at", "month") }}
{{ dbt.last_day("'2016-03-09'", "year") }}
```

**Sample Output (PostgreSQL)**:

```sql
cast(
    date_trunc('month', created_at) + ((interval '10 month') * (1))
 + ((interval '10 day') * (-1))
        as date)

cast(
    date_trunc('year', '2016-03-09') + ((interval '10 year') * (1))
 + ((interval '10 day') * (-1))
        as date)
```

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

---
title: "dbt"
id: "dbt"
---

## Overview

`dbt` TODO rest of paragraph here.

These macros make it easier for package authors (especially those writing modeling packages) to implement cross-database
compatibility. In general, you should not use these macros in your own dbt project (unless it is a package).


The following functions are available:
- [dbt.any_value](#any_value)
- [dbt.bool_or](#bool_or)
- [dbt.cast_bool_to_text](#cast_bool_to_text)
- [dbt.concat](#concat)
- [dbt.current_timestamp](#current_timestamp)
- [dbt.current_timestamp_in_utc](#current_timestamp_in_utc)
- [dbt.date_trunc](#date_trunc)
- [dbt.dateadd](#dateadd)
- [dbt.datediff](#datediff)
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

## any_value
__Args__:

 * `TODO`: TODO
 * `TODO`: TODO

Paragraph_description.

**Usage**:

<File name='models/example.sql'>

```sql
-- TODO
```

</File>

## bool_or
__Args__:

 * `TODO`: TODO
 * `TODO`: TODO

Paragraph_description.

**Usage**:

<File name='models/example.sql'>

```sql
-- TODO
```

</File>

## cast_bool_to_text
__Args__:

 * `TODO`: TODO
 * `TODO`: TODO

Paragraph_description.

**Usage**:

<File name='models/example.sql'>

```sql
-- TODO
```

</File>

## concat
__Args__:

 * `TODO`: TODO
 * `TODO`: TODO

Paragraph_description.

**Usage**:

<File name='models/example.sql'>

```sql
-- TODO
```

</File>

## current_timestamp
__Args__:

 * None

This macro returns the current timestamp.

**Usage**:

<File name='models/example.sql'>

```sql
{{ dbt_utils.current_timestamp() }}
```

</File>

## current_timestamp_in_utc
__Args__:

 * `TODO`: TODO
 * `TODO`: TODO

Paragraph_description.

**Usage**:

<File name='models/example.sql'>

```sql
-- TODO
```

</File>

## date_trunc
__Args__:

 * `TODO`: TODO
 * `TODO`: TODO

Paragraph_description.

**Usage**:

<File name='models/example.sql'>

```sql
-- TODO
```

</File>

## dateadd
__Args__:

 * `datepart`: TODO
 * `interval`: TODO
 * `from_date_or_timestamp`: TODO

This macro adds a time/day interval to the supplied date/timestamp. Note: The `datepart` argument is database-specific.

**Usage**:

<File name='models/example.sql'>

```sql
{{ dbt_utils.dateadd(datepart='day', interval=1, from_date_or_timestamp="'2017-01-01'") }}
```

</File>

## datediff
__Args__:

 * `TODO`: TODO
 * `TODO`: TODO
 * `datepart`: TODO

This macro calculates the difference between two dates.

**Usage**:

<File name='models/example.sql'>

```sql
{{ dbt_utils.datediff("'2018-01-01'", "'2018-01-20'", 'day') }}
```

</File>

## escape_single_quotes
__Args__:

 * `TODO`: TODO
 * `TODO`: TODO

Paragraph_description.

**Usage**:

<File name='models/example.sql'>

```sql
-- TODO
```

</File>

## except
__Args__:

 * `TODO`: TODO
 * `TODO`: TODO

Paragraph_description.

**Usage**:

<File name='models/example.sql'>

```sql
-- TODO
```

</File>

## hash
__Args__:

 * `TODO`: TODO
 * `TODO`: TODO

Paragraph_description.

**Usage**:

<File name='models/example.sql'>

```sql
-- TODO
```

</File>

## intersect
__Args__:

 * `TODO`: TODO
 * `TODO`: TODO

Paragraph_description.

**Usage**:

<File name='models/example.sql'>

```sql
-- TODO
```

</File>

## last_day
__Args__:

 * `date`: TODO
 * `datepart`: TODO

Gets the last day for a given date and datepart.

**Usage**:
- The `datepart` argument is database-specific.
- This macro currently only supports dateparts of `month` and `quarter`.

<File name='models/example.sql'>

```sql
{{ dbt_utils.last_day(date, datepart) }}
```

</File>

## length
__Args__:

 * `TODO`: TODO
 * `TODO`: TODO

Paragraph_description.

**Usage**:

<File name='models/example.sql'>

```sql
-- TODO
```

</File>

## listagg
__Args__:

 * `measure` (required): The expression (typically a column name) that determines the values to be concatenated. To only include distinct values add keyword `DISTINCT` to beginning of expression (example: 'DISTINCT column_to_agg').
 * `delimiter_text` (required): Text representing the delimiter to separate concatenated values by.
 * `order_by_clause` (optional): An expression (typically a column name) that determines the order of the concatenated values.
 * `limit_num` (optional): Specifies the maximum number of values to be concatenated.

This macro returns the concatenated input values from a group of rows separated by a specified delimiter.

**Usage**:

Note: If there are instances of `delimiter_text` within your `measure`, you cannot include a `limit_num`.

<File name='models/example.sql'>

```sql
{{ dbt_utils.listagg(measure='column_to_agg', delimiter_text="','", order_by_clause="order by order_by_column", limit_num=10) }}
```

</File>

## position
__Args__:

 * `TODO`: TODO
 * `TODO`: TODO

Paragraph_description.

**Usage**:

<File name='models/example.sql'>

```sql
-- TODO
```

</File>

## replace
__Args__:

 * `TODO`: TODO
 * `TODO`: TODO

Paragraph_description.

**Usage**:

<File name='models/example.sql'>

```sql
-- TODO
```

</File>

## right
__Args__:

 * `TODO`: TODO
 * `TODO`: TODO

Paragraph_description.

**Usage**:

<File name='models/example.sql'>

```sql
-- TODO
```

</File>

## safe_cast
__Args__:

 * `TODO`: TODO
 * `TODO`: TODO

Paragraph_description.

**Usage**:

<File name='models/example.sql'>

```sql
-- TODO
```

</File>

## split_part
__Args__:

 * `string_text` (required): Text to be split into parts.
 * `delimiter_text` (required): Text representing the delimiter to split by.
 * `part_number` (required): Requested part of the split (1-based). If the value is negative, the parts are counted backward from the end of the string.

This macro splits a string of text using the supplied delimiter and returns the supplied part number (1-indexed).

**Usage**:
When referencing a column, use one pair of quotes. When referencing a string, use single quotes enclosed in double quotes.

<File name='models/example.sql'>

```sql
{{ dbt_utils.split_part(string_text='column_to_split', delimiter_text='delimiter_column', part_number=1) }}
{{ dbt_utils.split_part(string_text="'1|2|3'", delimiter_text="'|'", part_number=1) }}
```

</File>

## string_literal
__Args__:

 * `TODO`: TODO
 * `TODO`: TODO

Paragraph_description.

**Usage**:

<File name='models/example.sql'>

```sql
-- TODO
```

</File>

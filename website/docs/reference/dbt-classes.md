---
title: "dbt Classes"
---

dbt has a number of classes it uses to represent objects in a data warehouse, parts of a dbt project, and the results of a command.

These classes are often useful when building advanced dbt models and macros.

## Relation

The `Relation` object is used to interpolate schema and table names into SQL code with appropriate quoting. This object should _always_ be used instead of interpolating values with `{{ schema }}.{{ table }}` directly. Quoting of the Relation object can be configured using the [`quoting` config][quoting].

### Creating Relations

A `Relation` can be created by calling the `create` class method on the `Relation` class.

<File name='Relation.create'>

```python
class Relation:
  def create(database=None, schema=None, identifier=None,
             type=None):
  """
    database (optional): The name of the database for this relation
    schema (optional): The name of the schema (or dataset, if on BigQuery) for this relation
    identifier (optional): The name of the identifier for this relation
    type (optional): Metadata about this relation, eg: "table", "view", "cte"
  """
```

</File>

### Using Relations

<File name='Relation Usage.sql'>

```jinja2
{% set relation = api.Relation.create(schema='snowplow', identifier='events') %}

-- Return the `database` for this relation
{{ relation.database }}

-- Return the `schema` (or dataset) for this relation
{{ relation.schema }}

-- Return the `identifier` for this relation
{{ relation.identifier }}

-- Return true if the relation is a table
{{ relation.is_table }}

-- Return true if the relation is a view
{{ relation.is_view }}

-- Return true if the relation is a cte
{{ relation.is_cte }}

```

</File>


## Column
The `Column` object is used to encode information about a column in a relation.

<File name='column.py'>

```python
class Column(object):
  def __init__(self, column, dtype, char_size=None, numeric_size=None):
    """
      column: The name of the column represented by this object
      dtype: The data type of the column (database-specific)
      char_size: If dtype is a variable width character type, the size of the column, or else None
      numeric_size: If dtype is a fixed precision numeric type, the size of the column, or else None
   """


# Example Usage:
col = Column('name', 'varchar', 255)
col.is_string() # True
col.is_numeric() # False
col.is_number() # False
col.is_float() # False
col.string_type() # character varying (255)
```

</File>

### Column API

### Properties

- **name**: Returns the name of the column
- **quoted**: Returns the name of the column wrapped in quotes
- **data_type**: Returns the data type of the column

### Instance methods

<Changelog>

 The `is_number` and `is_float` instance methods were added dbt v0.16.0

</Changelog>

- **is_string()**: Returns True if the column is a String type (eg. text, varchar), else False
- **is_numeric()**: Returns True if the column is a fixed-precision Numeric type (eg. `numeric`), else False
- **is_number()**: Returns True if the column is a number-y type (eg. `numeric`, `int`, `float`, or similar), else False
- **is_float()**: Returns True if the column is a float type (eg. `float`, `float64`, or similar), else False
- **string_size()**: Returns the width of the column if it is a string type, else, an exception is raised

### Static methods
- **string_type(size)**:  Returns a database-useable representation of the string type (eg. `character varying(255)`)
- **numeric_type(dtype, size)**: Returns a database-useable representation of the numeric type (eg. `numeric(12, 4)`)

## BigQuery Columns
The `Column` type is overridden as a `BigQueryColumn` in BigQuery dbt projects. This object works the same as the `Column` type described above, with the exception of extra properties and methods:

### Properties
**fields**: Returns the list of subfields contained within a field (if the column is a STRUCT)
**mode**: Returns the "mode" of the column, eg. `REPEATED`

### Instance methods
**flatten()**: Return a flattened list of `BigQueryColumns` in which subfields are expanded into their own columns. For example, this nested field:

```
[{"hits": {"pageviews": 1, "bounces": 0}}]
```

will be expanded to:
```
[{"hits.pageviews": 1, "hits.bounces": 0}]
```

## Result objects
The execution of a resource in dbt generates a Result object. This object contains information about the node that was executed, as well as its resulting status. The JSON Schema for a Result object can be found [here](https://github.com/fishtown-analytics/dbt/blob/6563b0329936dbd75b6a4cdf8a98e90fb717cd84/core/dbt/contracts/results.py#L9). Note that this contract may be subject to change in the future until dbt's API has reached a "stable" state.


```python
{
    'type': 'object',
    'additionalProperties': False,
    'description': 'The result of a single node being run',
    'properties': {
        'error': {
            'type': ['string', 'null'],
            'description': 'The error string, or None if there was no error',
        },
        'skip': {
            'type': 'boolean',
            'description': 'True if this node was skipped',
        },
        'fail': {
            'type': ['boolean', 'null'],
            'description': 'On tests, true if the test failed',
        },
        'status': {
            'type': ['string', 'null', 'number', 'boolean'],
            'description': 'The status result of the node execution',
        },
        'execution_time': {
            'type': 'number',
            'description': 'The execution time, in seconds',
        },
        'node': <Node Contract>;,
    },
    'required': ['node'],
}
```


## SQL Results
:::warning These docs are a work in progress
:::

Note for the discerning reader: this is not a true python Class — it's a dictionary.

The [`load_result` macro](load_result) macro returns a SQL Results object. The schema of a SQL Results Object is as follows ([source code](https://github.com/fishtown-analytics/dbt/blob/dev/marian-anderson/core/dbt/context/providers.py#L667)):

```python
{
    'status': 'SUCCESS 1',
    'data': [(Decimal('1'),)],
    'table': <agate.table.Table object at 0x11466ad90>
}
```

Note that this contract may be subject to change in the future until dbt's API has reached a "stable" state.

Keys:
- `status`: The status code returned by the database. Note: this varies across databases and query types.
- `data`: An array of tuples represent the results. The first item represents the first row. For example, for a table with results:

| my_col_1 | my_col_2 |
|----------|----------|
| 1        | 2        |
| 3        | 4        |

```python
> results['data']

[
    (Decimal('1'), Decimal('2')),
    (Decimal('3'), Decimal('4'))
]

```

- `table`: An [Agate Table](https://agate.readthedocs.io/en/1.6.1/api/table.html) containing results. This is a powerful API for interacting with query results, but you may need to use the Agate docs to navigate it.

### Examples

All examples use this setup SQL:

```sql
{%- call statement('test_query', fetch_result=True) -%}

    select 1 as my_col_1, 2 as my_col_2
    union all
    select 3 as my_col_1, 4 as my_col_2

{%- endcall -%}

{%- set test_query = load_result(name='test_query') -%}
```

We've included examples of how to use the [`log` macro](log) to print results to the command line in order to "see" what the object is.

#### Returning the first row

You can use both the `data` and the `table` properties to return this.

Using the `data` property, both of these are equivalent:

```sql

{% set first_row=test_query['data'][0] %}

{{ log(first_row, info=True) }}

{% set first_row=test_query.data[0] %}

{{ log(first_row, info=True) }}
```

```txt
(Decimal('1'), Decimal('2'))

(Decimal('1'), Decimal('2'))
```

You can also use the `table` property to return an `Agate Row`. This also has the benefit of retaining column name mappings.

```sql

{% set first_row=test_query.table[0] %}

{# This is an Agate Row #}
{{ log(first_row, info=True) }}

{# This is a tuple #}
{{ log(first_row.values(), info=True) }}

{# Return a row value by column name #}
{# Note: on Snowflake you will have to use ['MY_COL_2'] #}
{{ log(first_row['my_col_2'], info=True) }}

```


```txt
<agate.Row: (Decimal('1'), Decimal('2'))>

(Decimal('1'), Decimal('2')

1
```

#### Returning the first column from a query

Using the `data` property — this requires some tricky Jinja.
```sql
{% set first_column=test_query.data | map(attribute=0) | list %}

{# This is a list #}
{{ log(first_column, info=True) }}
```

```txt
[Decimal('1'), Decimal('3')]
```

Using the `table` property:
```sql
{% set first_column=test_query.table.columns[0] %}

{# This is an Agate Column #}
{{ log(first_column, info=True) }}

{# This is a tuple #}
{{ log(first_column.values(), info=True) }}

{# This is the first value of the column #}
{{ log(first_column[0], info=True) }}

```

```txt
<agate.Column: (Decimal('1'), Decimal('3'))>

(Decimal('1'), Decimal('3'))

1
```

#### Returning a named column from a query

```sql
{# On snowflake you will need to use 'MY_COL_2' #}
{% set named_column=test_query.table.columns['my_col_2'] %}

{# This is an Agate Column #}
{{ log(named_column, info=True) }}

{# This is a tuple #}
{{ log(named_column.values, info=True) }}

{# This is a the first value of the column #}
{{ log(named_column[0], info=True) }}
```

```txt
<agate.Column: (Decimal('2'), Decimal('4'))>

(Decimal('2'), Decimal('4'))

2
```


#### Returning the column names of a query result
Included for illustrative purposes only.

Consider using the built-in [`get_columns_in_query` macro](https://github.com/fishtown-analytics/dbt/blob/dev/marian-anderson/core/dbt/include/global_project/macros/adapters/common.sql#L1) instead.

```
{% set column_names=test_query.table.columns | map(attribute='name') | list }

{# This is a list #}
{{ log(column_names, info=True) }}
```

```txt
['my_col_1', 'my_col_2']
```

#### Print a table to stdout
```sql
{{ test_query.table.print_table() }}
```

```txt
| my_col_1 | my_col_2 |
| -------- | -------- |
|        1 |        2 |
|        3 |        4 |
```

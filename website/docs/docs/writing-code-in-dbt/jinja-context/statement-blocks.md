---
title: "statement blocks"
id: "statement-blocks"
---

`statement`s are sql queries that hit the database and return results to your Jinja context. Here’s an example of a `statement` which gets all of the states from a users table.

<File name='get_states_statement.sql'>

```sql
{%- call statement('states', fetch_result=True) -%}

    select distinct state from {{ ref('users') }}

{%- endcall -%}
```

</File>

The signature of the `statement` block looks like this:

```
statement(name=None, fetch_result=False, auto_begin=True)
```

__Args__:
  - name (string): The name for the result set returned by this statement
 - fetch_result (bool): If True, load the results of the statement into the Jinja context
 - auto_begin (bool): If True, open a transaction if one does not exist. If false, do not open a transaction.

Once the statement block has executed, the result set is accessible via the `load_result` function. For the above statement, that would look like:

<File name='load_states.sql'>

```sql
{%- set states = load_result('states') -%}
{%- set states_data = states['data'] -%}
{%- set states_status = states['status'] -%}
```

</File>

The contents of the returned `data` field is a matrix. It contains a list rows, with each row being a list of values returned by the database. For the above example, this data structure might look like:

<File name='states.sql'>

```python
>>> log(states_data)

[
  ['PA'],
  ['NY'],
  ['CA'],
	...
]
```

</File>



<Callout type="danger" title="Volatile API">

While the `statement` and `load_result` setup works for now, we intend to improve this interface in the future. If you have questions or suggestions, please let us know in GitHub or on Slack.

</Callout>

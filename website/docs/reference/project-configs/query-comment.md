---
datatype: "string | {comment: string, append: true | false }"
default: >
  /* {"app": "dbt", "dbt_version": "0.15.0rc2", "profile_name": "debug", "target_name": "dev", "node_id": "model.dbt2.my_model"} */
---

<File name='dbt_project.yml'>

```yml
query-comment: string
```

</File>

The `query-comment` configuration also accepts a dictionary input, like so:

<File name='dbt_project.yml'>

```yml
query-comment:
  comment: string
  append: true | false
  job-label: true | false  # BigQuery only
```

</File>

## Definition
A string to inject as a comment in each query that dbt runs against your database. This comment can be used to attribute SQL statements to specific dbt resources like models and tests.

The `query-comment` configuration can also call a macro that returns a string.

## Default
By default, dbt will insert a <Term id="json" /> comment at the top of your query containing the information including the dbt version, profile and target names, and node ids for the resources it runs. For example:

```sql
/* {"app": "dbt", "dbt_version": "0.15.0rc2", "profile_name": "debug",
    "target_name": "dev", "node_id": "model.dbt2.my_model"} */

create view analytics.analytics.orders as (
    select ...
  );
```




## Using the dictionary syntax
The dictionary syntax includes two keys:
  * `comment` (optional, see above for default): The string to be injected to a query as a comment.
  * `append` (optional, default=`false`): Whether a comment should be appended (added to the bottom of a query) or not (i.e. added to the top of a query). By default, comments are added to the top of queries (i.e. `append: false`).

This syntax is useful on databases like Snowflake which [remove leading SQL comments](https://docs.snowflake.com/en/release-notes/2017-04.html#queries-leading-comments-removed-during-execution).

## Examples

### Prepend a static comment
The following example injects a comment that reads `/* executed by dbt */` into the header of the SQL queries that dbt runs.

<File name='dbt_project.yml'>

```yml
query-comment: "executed by dbt"

```

</File>

**Example output:**

```sql
/* executed by dbt */

select ...
```

### Disable query comments

<File name='dbt_project.yml'>

```yml
query-comment:

```

</File>

Or:

<File name='dbt_project.yml'>

```yml
query-comment: null

```

</File>

### Prepend a dynamic comment
The following example injects a comment that varies based on the configured `user` specified in the active dbt target.

<File name='dbt_project.yml'>

```yml
query-comment: "run by {{ target.user }} in dbt"

```

</File>

**Example output:**

```sql
/* run by drew in dbt */

select ...
```

### Append the default comment
The following example uses the dictionary syntax to append (rather than prepend) the default comment.

Note that the `comment:` field is omitted to allow the default to be appended.

<File name='dbt_project.yml'>

```yaml

query-comment:
  append: True
```

</File>

**Example output:**

```sql
select ...
/* {"app": "dbt", "dbt_version": "0.16.`0rc2`", "profile_name": "debug", "target_name": "dev", "node_id": "model.dbt2.my_model"} */
;
```

### BigQuery: include query comment items as job labels

If `query-comment.job-label` is set to true, dbt will include the query comment items, if a dictionary, or the comment string, as job labels on the query it executes. These will be included in addition to labels specified in the [BigQuery-specific config](/reference/project-configs/query-comment#bigquery-include-query-comment-items-as-job-labels).

<File name='dbt_project.yml'>

```yaml

query-comment:
  job-label: True
```

</File>

### Append a custom comment
The following example uses the dictionary syntax to append (rather than prepend) a comment that varies based on the configured `user` specified in the active dbt target.

<File name='dbt_project.yml'>

```yaml

query-comment:
  comment: "run by {{ target.user }} in dbt"
  append: True
```

</File>

**Example output:**

```sql
select ...
/* run by drew in dbt */
;
```



### Intermediate: Use a macro to generate a comment

The `query-comment` config can reference macros in your dbt project. Simply create a macro with any name (`query_comment` is a good start!) in your `macros` directory, like so:

<File name='macros/query_comment.sql'>

```jinja2

{% macro query_comment() %}

  dbt {{ dbt_version }}: running {{ node.unique_id }} for target {{ target.name }}

{% endmacro %}
```

</File>

Then call the macro in your `dbt_project.yml` file. Make sure you quote the macro to avoid the YAML parser from trying to interpret the `{` as the start of a dictionary.

<File name='dbt_project.yml'>

```yaml
query-comment: "{{ query_comment() }}"

```

</File>

### Advanced: Use a macro to generate a comment

The following example shows a JSON query comment which can be parsed to understand the performance characteristics of your dbt project.

<File name='macros/query_comment.sql'>

```jinja2
{% macro query_comment(node) %}
    {%- set comment_dict = {} -%}
    {%- do comment_dict.update(
        app='dbt',
        dbt_version=dbt_version,
        profile_name=target.get('profile_name'),
        target_name=target.get('target_name'),
    ) -%}
    {%- if node is not none -%}
      {%- do comment_dict.update(
        file=node.original_file_path,
        node_id=node.unique_id,
        node_name=node.name,
        resource_type=node.resource_type,
        package_name=node.package_name,
        relation={
            "database": node.database,
            "schema": node.schema,
            "identifier": node.identifier
        }
      ) -%}
    {% else %}
      {%- do comment_dict.update(node_id='internal') -%}
    {%- endif -%}
    {% do return(tojson(comment_dict)) %}
{% endmacro %}
```

</File>

As above, call this macro as follows:


<File name='dbt_project.yml'>

```yaml
query-comment: "{{ query_comment(node) }}"

```

</File>

## Compilation context

The following context variables are available when generating a query comment:

| Context Variable | Description |
| ---------------- | ----------- |
| dbt_version      | The version of dbt being used |
| env_var          | See [env_var](/reference/dbt-jinja-functions/env_var) |
| modules          | See [modules](/reference/dbt-jinja-functions/modules) |
| run_started_at   | When the dbt invocation began |
| invocation_id    | A unique ID for the dbt invocation |
| fromjson         | See [fromjson](/reference/dbt-jinja-functions/fromjson) |
| tojson           | See [tojson](/reference/dbt-jinja-functions/tojson) |
| log              | See [log](/reference/dbt-jinja-functions/log) |
| var              | See [var](/reference/dbt-jinja-functions/var) |
| target           | See [target](/reference/dbt-jinja-functions/target) |
| connection_name  | A string representing the internal name for the connection. This string is generated by dbt. |
| node             | A dictionary representation of the parsed node object. Use `node.unique_id`, `node.database`, `node.schema`, etc |

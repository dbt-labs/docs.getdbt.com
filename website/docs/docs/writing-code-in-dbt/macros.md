---
title: "Macros"
id: "macros"
---

Macros are snippets of SQL that can be invoked like functions from models. Macros make it possible to re-use SQL between models in keeping with the engineering principle of DRY (Don't Repeat Yourself). Additionally, shared packages can expose macros that you can use in your own dbt project.

To use macros, add a `macro-paths` config entry to your `dbt_project.yml` file. Macro files must use the `.sql` file extension.

<File name='dbt_project.yml'>

```yaml
macro-paths: ['macros']    # look for macros in ./macros directory
```

</File>

Macro files can contain one or more macros. An example macro file looks like:

<File name='macros/example.sql'>

```sql
{% macro group_by(n) %}

  GROUP BY
   {% for i in range(1, n + 1) %}
     {{ i }}
     {% if not loop.last %} , {% endif %}
   {% endfor %}

{% endmacro %}
```

</File>

## Calling macros

Above, we define a macro called `group_by` which takes a single argument, n. A model which uses this macro might look like:

<File name='models/example.sql'>

```sql
select
  field_1,
  field_2,
  field_3,
  field_4,
  field_5,
  count(*)
from my_table
{{ group_by(5) }}
```

</File>

which would be _compiled_ to:

<File name='target/build/models/example.sql'>

```sql
select
  field_1,
  field_2,
  field_3,
  field_4,
  field_5,
  count(*)
from my_table
GROUP BY 1,2,3,4,5
```

</File>

## Qualifying Macros

In the above example, you can reference the macro directly because it lives in your own project. You can also fully qualify the macro by prefixing it with the project name where it is defined, for example:

<File name='models/example.sql'>

```sql
select
  field_1,
  field_2,
  field_3,
  field_4,
  field_5,
  count(*)
from my_table
{{ this_project.group_by(5) }}
```

</File>

If a different macro is imported from the `snowplow` package via:

<File name='packages.yml'>

```yaml
packages:
  - git: "https://github.com/fishtown-analytics/snowplow.git"
```

</File>

Then you would __need__ to fully qualify the macro's package name to use it in your project:

<File name='models/example.sql'>

```sql
select
	{{ snowplow.get_utm_parameter('url_parameters', 'utm_medium') }}
from snowplow.event
```

</File>

## Examples

One (out of many!) ways to use macros is to rename strings. For example, the macro below scrubs messy names such as "product_osx_2.0", stored in `product`, to return a cleaner "osx" in `renamed_product`:  

<File name='macros/example2.sql'>

```sql
{% macro rename_category(column_name) %}

case
  when {{ column_name }} ilike  '%osx%' then 'osx'
  when {{ column_name }} ilike  '%android%' then 'android'
  when {{ column_name }} ilike  '%ios%' then 'ios'
  else 'other'
end as renamed_product

{% endmacro %}
```

</File>

The `column_name` is a Jinja variable and needs to be surrounded by `{{ ... }}` inside the macro. The model can then set the variable using `{% set ... %}` at the top. A model which uses this macro may look like:

<File name='models/example2.sql'>

```sql
{% set column_name = 'product' %}

select
  product,
  {{ rename_category(column_name) }}
from my_table
```

</File>

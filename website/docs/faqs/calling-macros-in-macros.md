---
title: Can I call a macro inside a macro?
---

Yes. Macros can call other macros. Jinja will automatically seek out all macros defined in the project before attempting to deference a call to a macro. In other words, a macro that invokes another macro does not need to be defined in the same file or directory.

```sql
{% macro empty_fields_to_zero(column_name) %}
    case
        when {{ column_name }} is NULL then 0
        when {{ column_name }} = ' '   then 0
        when {{ column_name }} = ''    then 0
        when {{ column_name }} = 'n/a' then 0
        else {{ column_name }}
    end
{% endmacro %}

{% macro uptick_values(column_name) %}
    {{ empty_fields_to_zero('column_name') }} + 1
{% endmacro %}

```

One warning, do not introduce an infinite cycle (i.e. two macros are defined in terms of each other).

```sql

-- this will cause a runtime exception
{% macro macro_a(column_name) %}
    macro_b('{{ column_name }}')
{% endmacro %}

{% macro macro_b(column_name) %}
    macro_a('{{ column_name }}')
{% endmacro %}

```

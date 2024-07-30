---
title: "Don't nest your curlies"
id: "dont-nest-your-curlies"
---

### Poetry

**Don't Nest Your Curlies**

> If dbt errors out early
>
> and your Jinja is making you surly
>
> don't post to the slack
>
> just take a step back
>
> and check if you're nesting your curlies.

### Jinja

When writing jinja code in a dbt project, it may be tempting to nest expressions inside of each other. Take this example:

```
  {{ dbt_utils.date_spine(
      datepart="day",
      start_date=[ USE JINJA HERE ]
      )
  }}
```

To nest a jinja expression inside of another jinja expression, simply place the desired code (without curly brackets) directly into the expression.

**Correct example**
Here, the return value of the `var()` context method is supplied as the `start_date` argument to the `date_spine` macro. Great!

```
  {{ dbt_utils.date_spine(
      datepart="day",
      start_date=var('start_date')
      )
  }}
```

**Incorrect example**
*This code does not work in dbt &gt;= v0.15.0*. Once we've denoted that we're inside a jinja expression (using the `{{` syntax), no further curly brackets are required inside of the jinja expression. This code will supply a literal string value, `"{{ var('start_date') }}"`, as the `start_date` argument to the `date_spine` macro. This is probably not what you actually want to do!

```
-- Do not do this! It will not work!

  {{ dbt_utils.date_spine(
      datepart="day",
      start_date="{{ var('start_date') }}"
      )
  }}
```

Here's another example:

```sql
{# Either of these work #}

{% set query_sql = 'select * from ' ~ ref('my_model') %}

{% set query_sql %}
select * from {{ ref('my_model') }}
{% endset %}

{# This does not #}
{% set query_sql = "select * from {{ ref('my_model')}}" %}

```

### An exception

There is one exception to this rule: curlies inside of curlies are acceptable in hooks (ie. `on-run-start`, `on-run-end`, `pre-hook`, and `post-hook`).

Code like this is both valid, and encouraged:
```
{{ config(post_hook="grant select on {{ this }} to role bi_role") }}
```

So why are curlies inside of curlies allowed in this case? Here, we actually _want_ the string literal `"grant select on {{ this }} ..."` to be saved as the configuration value for the post-hook in this model. This string will be re-rendered when the model runs, resulting in a sensible SQL expression like `grant select on "schema"."table"....` being executed against the database. These hooks are a special exception to the rule stated above.

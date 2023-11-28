---
title: "Jinja and macros"
description: "Read this tutorial to learn how to use jinja and macros when building in dbt."
id: "jinja-macros"
---

## Related reference docs
* [Jinja Template Designer Documentation](https://jinja.palletsprojects.com/page/templates/) (external link)
* [dbt Jinja context](/reference/dbt-jinja-functions)
* [Macro properties](/reference/macro-properties)

## Overview
In dbt, you can combine SQL with [Jinja](https://jinja.palletsprojects.com), a templating language.

Using Jinja turns your dbt project into a programming environment for SQL, giving you the ability to do things that aren't normally possible in SQL. For example, with Jinja you can:
* Use control structures (e.g. `if` statements and `for` loops) in SQL
* Use [environment variables](/reference/dbt-jinja-functions/env_var) in your dbt project for production deployments
* Change the way your project builds based on the current target.
* Operate on the results of one query to generate another query, for example:
  * Return a list of payment methods, in order to create a subtotal column per payment method (pivot)
  * Return a list of columns in two relations, and select them in the same order to make it easier to union them together
* Abstract snippets of SQL into reusable [**macros**](#macros) — these are analogous to functions in most programming languages.

In fact, if you've used the [`{{ ref() }}` function](/reference/dbt-jinja-functions/ref), you're already using Jinja!

Jinja can be used in any SQL in a dbt project, including [models](/docs/build/sql-models), [analyses](/docs/build/analyses), [tests](/docs/build/tests), and even [hooks](/docs/build/hooks-operations).

:::info Ready to get started with Jinja and macros?

Check out the [tutorial on using Jinja](/guides/using-jinja) for a step-by-step example of using Jinja in a model, and turning it into a macro!

:::

## Getting started
### Jinja
Here's an example of a dbt model that leverages Jinja:

<File name='/models/order_payment_method_amounts.sql'>

```sql
{% set payment_methods = ["bank_transfer", "credit_card", "gift_card"] %}

select
    order_id,
    {% for payment_method in payment_methods %}
    sum(case when payment_method = '{{payment_method}}' then amount end) as {{payment_method}}_amount,
    {% endfor %}
    sum(amount) as total_amount
from app_data.payments
group by 1
```

</File>

This query will get compiled to:

<File name='/models/order_payment_method_amounts.sql'>

```sql
select
    order_id,
    sum(case when payment_method = 'bank_transfer' then amount end) as bank_transfer_amount,
    sum(case when payment_method = 'credit_card' then amount end) as credit_card_amount,
    sum(case when payment_method = 'gift_card' then amount end) as gift_card_amount,
    sum(amount) as total_amount
from app_data.payments
group by 1
```

</File>

You can recognize Jinja based on the delimiters the language uses, which we refer to as "curlies":
- **Expressions `{{ ... }}`**: Expressions are used when you want to output a string. You can use expressions to reference [variables](/reference/dbt-jinja-functions/var) and call [macros](/docs/build/jinja-macros#macros).
- **Statements `{% ... %}`**: Statements don't output a string. They are used for control flow, for example, to set up `for` loops and `if` statements, to [set](https://jinja.palletsprojects.com/en/3.1.x/templates/#assignments) or [modify](https://jinja.palletsprojects.com/en/3.1.x/templates/#expression-statement) variables, or to define macros.
-  **Comments `{# ... #}`**: Jinja comments are used to prevent the text within the comment from compiling.

When used in a dbt model, your Jinja needs to compile to a valid query. To check what SQL your Jinja compiles to:
* **Using dbt Cloud:** Click the compile button to see the compiled SQL in the Compiled SQL pane
* **Using dbt Core:** Run `dbt compile` from the command line. Then open the compiled SQL file in the `target/compiled/{project name}/` directory. Use a split screen in your code editor to keep both files open at once.

### Macros
[Macros](/docs/build/jinja-macros) in Jinja are pieces of code that can be reused multiple times – they are analogous to "functions" in other programming languages, and are extremely useful if you find yourself repeating code across multiple models. Macros are defined in `.sql` files, typically in your `macros` directory ([docs](/reference/project-configs/macro-paths)).

Macro files can contain one or more macros — here's an example:

<File name='macros/cents_to_dollars.sql'>

```sql

{% macro cents_to_dollars(column_name, scale=2) %}
    ({{ column_name }} / 100)::numeric(16, {{ scale }})
{% endmacro %}

```

</File>

A model which uses this macro might look like:

<File name='models/stg_payments.sql'>

```sql
select
  id as payment_id,
  {{ cents_to_dollars('amount') }} as amount_usd,
  ...
from app_data.payments

```

</File>

This would be _compiled_ to:

<File name='target/compiled/models/stg_payments.sql'>

```sql
select
  id as payment_id,
  (amount / 100)::numeric(16, 2) as amount_usd,
  ...
from app_data.payments
```

</File>


### Using a macro from a package
A number of useful macros have also been grouped together into [packages](/docs/build/packages) — our most popular package is [dbt-utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/).

After installing a package into your project, you can use any of the macros in your own project — make sure you qualify the macro by prefixing it with the [package name](/reference/dbt-jinja-functions/project_name):

```sql

select
  field_1,
  field_2,
  field_3,
  field_4,
  field_5,
  count(*)
from my_table
{{ dbt_utils.dimensions(5) }}

```

You can also qualify a macro in your own project by prefixing it with your [package name](/reference/dbt-jinja-functions/project_name) (this is mainly useful for package authors).

## FAQs

<FAQ path="Accounts/dbt-specific-jinja" />
<FAQ path="Jinja/which-jinja-docs" />
<FAQ path="Jinja/quoting-column-names" />
<FAQ path="Jinja/jinja-whitespace" />
<FAQ path="Project/debugging-jinja" />
<FAQ path="Docs/documenting-macros" />
<FAQ path="Project/why-so-many-macros" />

## dbtonic Jinja

Just like well-written python is pythonic, well-written dbt code is dbtonic.

### Favor readability over <Term id="dry" />-ness
Once you learn the power of Jinja, it's common to want to abstract every repeated line into a macro! Remember that using Jinja can make your models harder for other users to interpret — we recommend favoring readability when mixing Jinja with SQL, even if it means repeating some lines of SQL in a few places. If all your models are macros, it might be worth re-assessing.

### Leverage package macros
Writing a macro for the first time? Check whether we've open sourced one in [dbt-utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/) that you can use, and save yourself some time!

### Set variables at the top of a model
`{% set ... %}` can be used to create a new variable, or update an existing one. We recommend setting variables at the top of a model, rather than hardcoding it inline. This is a practice borrowed from many other coding languages, since it helps with readability, and comes in handy if you need to reference the variable in two places:


```sql
-- 🙅 This works, but can be hard to maintain as your code grows
{% for payment_method in ["bank_transfer", "credit_card", "gift_card"] %}
...
{% endfor %}


-- ✅ This is our preferred method of setting variables
{% set payment_methods = ["bank_transfer", "credit_card", "gift_card"] %}

{% for payment_method in payment_methods %}
...
{% endfor %}
```

<Snippet path="discourse-help-feed-header" />
<DiscourseHelpFeed tags="wee"/>

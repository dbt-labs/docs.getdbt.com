---
title: "Getting started with Jinja"
id: "getting-started-with-jinja"
---

## What is Jinja?
One of dbt's most powerful features is the ability to combine SQL with [Jinja](https://jinja.palletsprojects.com/en/2.10.x/), a templating language.

Using Jinja allows you to turn your dbt project into a programming environment for SQL, giving you the ability to do things that aren't normally possible in SQL. For example, with Jinja you can:
* Use control structures (e.g. `if` statements and `for` loops) in SQL
* Use [environment variables](env_var) in your dbt project for production deployments
* Change the way your project builds based on the current target.
* Abstract snippets of SQL into reusable macros (analogous to functions in most programming languages).
* Operate on the results of one query to generate another query, for example:
  * Return a list of payment methods, in order to create a subtotal column per payment method (pivot)
  * Return a list of columns in two relations, and select them in the same order to make it easier to union them together

Jinja can be used in any SQL code in a dbt project, including [models](building-models), [macros](macros), [analyses](analyses), [tests](custom-schema-tests), and even [hooks](hooks).

## What are the basics of Jinja?
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

You can recognize Jinja based on the delimiters the language uses:
- **Expressions `{{ ... }}`**: Expressions are used when you want to output a string. You can use expressions to reference [variable](var)  and call [macros](macros).
- **Statements `{% ... %}`**: Statements are used for control flow, for example, to set up `for` loops and `if` statements, or to define macros.
-  **Comments `{# ... #}`**: Jinja comments are used to prevent the text within the comment from compiling. 

When used in a dbt model, your Jinja needs to compile to a valid query. To check what SQL your Jinja compiles to:
* **Using dbt Cloud:** Click the compile button to see the compiled SQL in the Compiled SQL pane
* **Using the dbt CLI:** Run `dbt compile` from the command line. Then open the compiled SQL file in the `target/compiled/{project name}/` directory. Use a split screen in your code editor to keep both files open at once.

## What are macros?
[Macros](macros) in Jinja are pieces of code that reused multiple times – they are analogous to "functions" in other programming languages, and are extremely useful if you find yourself repeating code across multiple models. Macros are written in a SQL files in the `macros` directory of a dbt project.

A number of useful macros have also been grouped together into the [dbt-utils package](https://hub.getdbt.com/fishtown-analytics/dbt_utils/latest/). `dbt-utils` can be [installed as a package](package-management) in your project, along with any other packages you write. The macros written in `dbt-utils` handle the complex logic for you, and most of the macros can be used on all databases supported by dbt.


## What parts of Jinja are dbt-specific?
There are certain expressions that are specific to dbt -- these are documented in the [Jinja function reference](adapter). Further, docs blocks, snapshots, and materializations are custom Jinja extensions that exist only in dbt.

<Callout type="info" title="Ready to get started with Jinja?">

Check out the [tutorial on using Jinja](using-jinja) for step-by-step example of using Jinja in a model, and turning it into a macro!

</Callout>

## Useful Jinja tips & tricks
### Quoting in Jinja
Quoting in Jinja can take a while to get used to! If you're within a Jinja expression or statement (i.e. within `{% ... %}` or `{{ ... }}`), you'll need to use quotes for any arguments that aren't other Jinja expressions.

Single and double quotes are equivalent in Jinja -- just make sure you match them appropriately.

### Quoting in Jinja + SQL
Quoting in Jinja can feel unnatural at first, especially when you need to pass a macro the name of a column. A common use case is when using the [surrogate_key](https://github.com/fishtown-analytics/dbt-utils#surrogate_key-source) macro to construct a unique ID based on a number of columns.

In SQL, you don't need to quote the column name when selecting a column. However, because we're using the column name _within_ a Jinja expression, we need to quote it.


```sql
-- ✅ This will work
{{ dbt_utils.surrogate_key('id', 'valid_from') }}

-- 🙅 This will NOT work
-- Here, Jinja will try to look for variables called {{ id }} and {{ version }}.
-- Since they don't exist, the macro won't work as expected.
{{ dbt_utils.surrogate_key(id, version) }}

-- ✅ Similarly, this will work (but is unlikely to be a good idea)
{% set natural_key = 'id' %}
{{ dbt_utils.surrogate_key(natural_key, 'valid_from') }}

-- ✅ If you need to pass a quoted string, use two (different) sets of quotes
-- e.g. to pass a string
{{ dbt_utils.surrogate_key('id', "'2000-01-01'") }}
-- e.g. to pass a reserved column name that you need to quote
{{ dbt_utils.surrogate_key('"name"', 'valid_from') }}
```

Chances are, you're already using this pattern without realizing it! The `ref` function is also a Jinja expression, and is normally passed a string.

```sql
select * from {{ ref('users') }}
```

### Quoting in Jinja + YAML
dbt's yaml parser interprets curly braces as the start of dictionaries. To tell the yaml parser that your curly braces instead belong to a Jinja expression, you'll need to quote your expression.

This is important when using [environment variables](env_var) in your `dbt_project.yml` or `profiles.yml` files.


<File name='dbt_project.yml'>

```yaml

models:
  jaffle_shop:
    # 🙅 The yaml parser will interpret the { as the start of a dictionary
    # and get confused by the next {, resulting in a compliation error
    schema: {{ env_var('DBT_SCHEMA') }}
    
    # ✅ This works
    schema: "{{ env_var('DBT_SCHEMA') }}"
```

</File>

It's also important when using [docs blocks](documentation#docs-blocks) 

<File name='models/schema.yml'>

```yaml
version: 2

models:
  - name: users
    # 🙅 This is not the correct way to reference a docs block
    description: {{ docs('users') }}
    
    # ✅ This is the correct way to reference a docs block
		description: "{{ docs('users') }}"

```

</File>

### Referencing expressions in Jinja
As we saw above, once you're within an expression or statement (i.e. within `{% ... %}` or `{{ ... }}`), Jinja expects any arguments to be references to other expressions. As a result, if you _do_ want to use another Jinja expression as an argument, there's no need for another set of curly braces.


```sql
{% set payment_methods = ["bank_transfer", "credit_card", "gift_card"] %}

-- 🙅Jinja expects to close the open set of braces ({%`) before opening a new
-- one ({{), so you'll get back an error here
{% for payment_methods in {{ payment_methods }} %}
...

-- ✅ This is the correct way to reference {{ payment_methods }}
{% for payment_methods in payment_methods %}
...

-- 🙅 You'll get back an error here
{{ get_payment_method_amounts({{ payment_methods }}) }}
...

-- ✅ This is the correct way to reference {{ payment_methods }}
{{ get_payment_method_amounts(payment_methods) }}
...
```

It may sound silly, but we tend to explain this rule of thumb as "once you're in Jinja-land, there's no need to re-enter it".

### Set variables at the top of a model
`{% set ... %}` can be used to create a new variable, or update an existing one. We recommend setting variables at the top of a model, rather than hardcoding it inline. This is a practice borrowed from many other coding languages, since it helps with readability, and comes in handy if you need to reference the variable in two places:


```sql
-- 🙅 This works, but can be hard to maintain as your code grows
{% for payment_methods in ["bank_transfer", "credit_card", "gift_card"] %}
...
{% endfor %}


-- ✅ This is our preferred method of setting variables
{% set payment_methods = ["bank_transfer", "credit_card", "gift_card"] %}

{% for payment_methods in payment_methods %}
...
{% endfor %}
```

### Reducing whitespace
As you write Jinja, it's common to format your code to improve the readability of your models This may involve padding various expressions and statements with additional whitespace. When you go to check your compiled code, you then might notice a lot of whitespace!

Use a minus sign (`-`, e.g. `{{- ... -}}`, `{%- ... %}`, `{#- ... -#}`) at the start or end of a block to strip whitespace before or after (more docs [here](https://jinja.palletsprojects.com/en/2.10.x/templates/#whitespace-control)). Check out the [tutorial on using Jinja](using-jinja#use-whitespace-control-to-tidy-up-compiled-code) for an example.


### Debug Jinja using the log function
Using the [log](log) function helps debug Jinja by printing objects to the command line. It's also useful to check compiled SQL in `target/compiled/<your_project>/` and the logs in `logs/dbt.log` to see what dbt is running behind the scenes.

### Use `loop.last` to remove extraneous commas
 `loop.last` evaluates to `True` on the last iteration of a loop. This is useful for ensuring you do not have a final trailing comma in your SQL. Alternatively, if your SQL style favors leading commas, you can use `loop.first` to the same effect.

### Favor readability over DRY-ness
Once you learn the power of Jinja, it's common to want to abstract every repeated line into a macro! Remember that using Jinja can make your models harder for other users to interpret -- we recommend favoring readability when mixing Jinja with SQL, even if it means repeating some lines of SQL in a few places.

### Use the right docs
If you are stuck with a Jinja issue, it can get confusing where to check for more information. We recommend you check (in order):

1. [Jinja's Template Designer Docs](https://jinja.palletsprojects.com/en/2.10.x/templates/): This is the best reference for most of the Jinja you'll use
2. [Our Jinja function reference](adapter): This documents any additional functionality we've added to Jinja in dbt.
3. [Agate's table docs](https://agate.readthedocs.io/en/1.1.0/api/table.html): If you're operating on the result of a query, dbt will pass it back to you as an agate table. This means that the methods you call on the table belong to the Agate library rather than Jinja or dbt.

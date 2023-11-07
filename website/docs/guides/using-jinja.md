---
title: "Using Jinja"
id: "using-jinja"
# time_to_complete: '30 minutes' commenting out until we test
icon: 'guides'
hide_table_of_contents: true
tags: ['Jinja', 'dbt Core']
level: 'Advanced'
recently_updated: true
---

## Introduction

In this guide, we're going to take a common pattern used in SQL, and then use Jinja to improve our code.

If you'd like to work through this query, add [this CSV](https://github.com/dbt-labs/jaffle_shop/blob/core-v1.0.0/seeds/raw_payments.csv) to the `seeds/` folder of your dbt project, and then execute `dbt seed`.

While working through the steps of this model, we recommend that you have your compiled SQL open as well, to check what your Jinja compiles to. To do this:
* **Using dbt Cloud:** Click the compile button to see the compiled SQL in the right hand pane
* **Using dbt Core:** Run `dbt compile` from the command line. Then open the compiled SQL file in the `target/compiled/{project name}/` directory. Use a split screen in your code editor to keep both files open at once.

## Write the SQL without Jinja
Consider a data model in which an `order` can have many `payments`. Each `payment` may have a `payment_method` of `bank_transfer`, `credit_card` or `gift_card`, and therefore each `order` can have multiple `payment_methods`

From an analytics perspective, it's important to know how much of each `order` was paid for with each `payment_method`. In your dbt project, you can create a model, named `order_payment_method_amounts`, with the following SQL:

<File name='models/order_payment_method_amounts.sql'>

```sql
select
order_id,
sum(case when payment_method = 'bank_transfer' then amount end) as bank_transfer_amount,
sum(case when payment_method = 'credit_card' then amount end) as credit_card_amount,
sum(case when payment_method = 'gift_card' then amount end) as gift_card_amount,
sum(amount) as total_amount
from {{ ref('raw_payments') }}
group by 1
```

</File>

The SQL for each payment method amount is repetitive, which can be difficult to maintain for a number of reasons:
* If the logic or field name were to change, the code would need to be updated in three places.
* Often this code is created by copying and pasting, which may lead to mistakes.
* Other analysts that review the code are less likely to notice errors as it's common to only scan through repeated code.

So we're going to use Jinja to help us clean it up, or to make our code more "DRY" ("Don't Repeat Yourself").

## Use a for loop in models for repeated SQL
Here, the repeated code can be replaced with a `for` loop. The following will be compiled to the same query, but is significantly easier to maintain.

<File name='/models/order_payment_method_amounts.sql'>

```sql
select
order_id,
{% for payment_method in ["bank_transfer", "credit_card", "gift_card"] %}
sum(case when payment_method = '{{payment_method}}' then amount end) as {{payment_method}}_amount,
{% endfor %}
sum(amount) as total_amount
from {{ ref('raw_payments') }}
group by 1
```

</File>

## Set variables at the top of a model
We recommend setting variables at the top of a model, as it helps with readability, and enables you to reference the list in multiple places if required. This is a practice we've borrowed from many other programming languages.

<File name='/models/order_payment_method_amounts.sql'>

```sql
{% set payment_methods = ["bank_transfer", "credit_card", "gift_card"] %}

select
order_id,
{% for payment_method in payment_methods %}
sum(case when payment_method = '{{payment_method}}' then amount end) as {{payment_method}}_amount,
{% endfor %}
sum(amount) as total_amount
from {{ ref('raw_payments') }}
group by 1
```

</File>

## Use loop.last to avoid trailing commas
In the above query, our last column is outside of the `for` loop. However, this may not always be the case. If the last iteration of a loop is our final column, we need to ensure there isn't a trailing comma at the end.

We often use an `if` statement, along with the Jinja variable `loop.last`, to ensure we don't add an extraneous comma:

<File name='/models/order_payment_method_amounts.sql'>

```sql
{% set payment_methods = ["bank_transfer", "credit_card", "gift_card"] %}

select
order_id,
{% for payment_method in payment_methods %}
sum(case when payment_method = '{{payment_method}}' then amount end) as {{payment_method}}_amount
{% if not loop.last %},{% endif %}
{% endfor %}
from {{ ref('raw_payments') }}
group by 1
```

</File>

An alternative way to write this is `{{ "," if not loop.last }}`.

## Use whitespace control to tidy up compiled code
If you've been checking your code in the `target/compiled` folder, you might have noticed that this code results in a lot of white space:


<File name='target/compiled/jaffle_shop/order_payment_method_amounts.sql'>

```sql


select
order_id,

sum(case when payment_method = 'bank_transfer' then amount end) as bank_transfer_amount
,

sum(case when payment_method = 'credit_card' then amount end) as credit_card_amount
,

sum(case when payment_method = 'gift_card' then amount end) as gift_card_amount


from raw_jaffle_shop.payments
group by 1
```

</File>

We can use [whitespace control](https://jinja.palletsprojects.com/page/templates/#whitespace-control) to tidy up our code:

<File name='models/order_payment_method_amounts.sql'>

```sql
{%- set payment_methods = ["bank_transfer", "credit_card", "gift_card"] -%}

select
order_id,
{%- for payment_method in payment_methods %}
sum(case when payment_method = '{{payment_method}}' then amount end) as {{payment_method}}_amount
{%- if not loop.last %},{% endif -%}
{% endfor %}
from {{ ref('raw_payments') }}
group by 1

```

</File>

Getting whitespace control right is often a lot of trial and error! We recommend that you prioritize the readability of your model code over the readability of the compiled code, and only do this as an extra polish.

## Use a macro to return payment methods
Here, we've hardcoded the list of payment methods in our model. We may need to access this list from another model. A good solution here is to use a [variable](/docs/build/project-variables), but for the purpose of this tutorial, we're going to instead use a macro!

[Macros](/docs/build/jinja-macros#macros) in Jinja are pieces of code that can be called multiple times – they are analogous to a function in Python, and are extremely useful if you find yourself repeating code across multiple models.

Our macro is simply going to return the list of payment methods:

<File name='/macros/get_payment_methods.sql'>

```sql
{% macro get_payment_methods() %}
{{ return(["bank_transfer", "credit_card", "gift_card"]) }}
{% endmacro %}
```

</File>

There's a few things worth noting here:
* Normally, macros take arguments -- we'll see this later on, but for now, we still need to setup our macro with empty parentheses where the arguments would normally go (i.e. `get_payment_methods()`)
* We've used the [return](/reference/dbt-jinja-functions/return) function to return a list – without this function, the macro would return a string.

Now that we have a macro for our payment methods, we can update our model as follows:

<File name='models/order_payment_method_amounts.sql'>

```sql
{%- set payment_methods = get_payment_methods() -%}

select
order_id,
{%- for payment_method in payment_methods %}
sum(case when payment_method = '{{payment_method}}' then amount end) as {{payment_method}}_amount
{%- if not loop.last %},{% endif -%}
{% endfor %}
from {{ ref('raw_payments') }}
group by 1

```

</File>

Note that we didn't use curly braces when calling the macro – we're already within a Jinja statement, so there's no need to use the brackets again.

## Dynamically retrieve the list of payment methods
So far, we've been hardcoding the list of possible payment methods. If a new `payment_method` was introduced, or one of the existing methods was renamed, the list would need to be updated.

However, at any given time you could know what `payment_methods` are used to make a payment by running the following query:
```sql
select distinct
payment_method
from {{ ref('raw_payments') }}
order by 1
```
[Statements](/reference/dbt-jinja-functions/statement-blocks) provide a way to run this query and return the results to your Jinja context. This means that the list of `payment_methods` can be set based on the data in your database rather than a hardcoded value.

The easiest way to use a statement is through the [run_query](/reference/dbt-jinja-functions/run_query) macro. For the first version, let's check what we get back from the database, by logging the results to the command line using the [log](/reference/dbt-jinja-functions/log) function.

<File name='macros/get_payment_methods.sql'>

```sql
{% macro get_payment_methods() %}

{% set payment_methods_query %}
select distinct
payment_method
from {{ ref('raw_payments') }}
order by 1
{% endset %}

{% set results = run_query(payment_methods_query) %}

{{ log(results, info=True) }}

{{ return([]) }}

{% endmacro %}
```

</File>

The command line gives us back the following:
```bash
| column         | data_type |
| -------------- | --------- |
| payment_method | Text      |
```
This is actually an [Agate table](https://agate.readthedocs.io/page/api/table.html). To get the payment methods back as a list, we need to do some further transformation.

```sql
{% macro get_payment_methods() %}

{% set payment_methods_query %}
select distinct
payment_method
from {{ ref('raw_payments') }}
order by 1
{% endset %}

{% set results = run_query(payment_methods_query) %}

{% if execute %}
{# Return the first column #}
{% set results_list = results.columns[0].values() %}
{% else %}
{% set results_list = [] %}
{% endif %}

{{ return(results_list) }}

{% endmacro %}
```

There's a few tricky pieces in here:
* We used the [execute](/reference/dbt-jinja-functions/execute) variable to ensure that the code runs during the `parse` stage of dbt (otherwise an error would be thrown).
* We used Agate methods to get the column back as a list

Fortunately, our model code doesn't need to be updated, since we're already calling the macro to get the list of payment methods. And now, any new `payment_methods` added to the underlying data model will automatically be handled by the dbt model.

## Write modular macros
You may wish to use a similar pattern elsewhere in your dbt project. As a result, you decide to break up your logic into two separate macros -- one to generically return a column from a relation, and the other that calls this macro with the correct arguments to get back the list of payment methods.

<File name='macros/get_payment_methods.sql'>

```sql
{% macro get_column_values(column_name, relation) %}

{% set relation_query %}
select distinct
{{ column_name }}
from {{ relation }}
order by 1
{% endset %}

{% set results = run_query(relation_query) %}

{% if execute %}
{# Return the first column #}
{% set results_list = results.columns[0].values() %}
{% else %}
{% set results_list = [] %}
{% endif %}

{{ return(results_list) }}

{% endmacro %}


{% macro get_payment_methods() %}

{{ return(get_column_values('payment_method', ref('raw_payments'))) }}

{% endmacro %}

```

</File>

## Use a macro from a package
Macros let analysts bring software engineering principles to the SQL they write. One of the features of macros that makes them even more powerful is their ability to be shared across projects.

A number of useful dbt macros have already been written in the [dbt-utils package](https://github.com/dbt-labs/dbt-utils). For example, the [get_column_values](https://github.com/dbt-labs/dbt-utils#get_column_values-source) macro from dbt-utils could be used instead of the `get_column_values` macro we wrote ourselves (saving us a lot of time, but at least we learnt something along the way!).

Install the [dbt-utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/) package in your project (docs [here](/docs/build/packages)), and then update your model to use the macro from the package instead:

<File name='models/order_payment_method_amounts.sql'>

```sql
{%- set payment_methods = dbt_utils.get_column_values(
    table=ref('raw_payments'),
    column='payment_method'
) -%}

select
order_id,
{%- for payment_method in payment_methods %}
sum(case when payment_method = '{{payment_method}}' then amount end) as {{payment_method}}_amount
{%- if not loop.last %},{% endif -%}
{% endfor %}
from {{ ref('raw_payments') }}
group by 1

```

</File>

You can then remove the macros that we built in previous steps. Whenever you're trying to solve a problem that you think others may have solved previously, it's worth checking the [dbt-utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/) package to see if someone has shared their code!

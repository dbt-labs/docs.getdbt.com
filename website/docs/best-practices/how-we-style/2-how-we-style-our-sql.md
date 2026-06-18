---
title: How we style our SQL
id: 2-how-we-style-our-sql
---

## Basics

- ☁️ Use [SQLFluff](https://sqlfluff.com/) to maintain these style rules automatically.
  - Customize `.sqlfluff` configuration files to your needs.
  - Refer to our [SQLFluff config file](https://github.com/dbt-labs/jaffle-shop-template/blob/main/.sqlfluff) for the rules we use in our own projects. 
  - Exclude files and directories by using a standard `.sqlfluffignore` file. Learn more about the syntax in the [.sqlfluffignore syntax docs](https://docs.sqlfluff.com/en/stable/configuration/index.html).
    - Excluding unnecessary folders and files (such as `target/`, `dbt_packages/`, and `macros/`) can speed up linting, improve run times, and help you avoid irrelevant logs.
- 👻 Use Jinja comments (`{# #}`) for comments that should not be included in the compiled SQL.
- ⏭️ Use trailing commas.
- 4️⃣ Indents should be four spaces.
- 📏 Lines of SQL should be no longer than 80 characters.
- ⬇️ Field names, keywords, and function names should all be lowercase.
- 🫧 The `as` keyword should be used explicitly when aliasing a field or table.

:::info
☁️ <Constant name="dbt" /> users can use the built-in [SQLFluff <Constant name="studio_ide" /> integration](/docs/platform/studio-ide/lint-format) to automatically lint and format their SQL. The default style sheet is based on dbt Labs style as outlined in this guide, but you can customize this to fit your needs. No need to setup any external tools, just hit `Lint`! Also, the more opinionated [sqlfmt](http://sqlfmt.com/) formatter is also available if you prefer that style.
:::

## Fields, aggregations, and grouping

- 🔙 Fields should be stated before aggregates and window functions.
- 🤏🏻 Aggregations should be executed as early as possible (on the smallest data set possible) before joining to another table to improve performance.
- 🔢 Ordering and grouping by a number (eg. group by 1, 2) is preferred over listing the column names (see [this classic rant](https://www.getdbt.com/blog/write-better-sql-a-defense-of-group-by-1) for why). Note that if you are grouping by more than a few columns, it may be worth revisiting your model design.

## Joins

- 👭🏻 Prefer `union all` to `union` unless you explicitly want to remove duplicates.
- 👭🏻 If joining two or more tables, _always_ prefix your column names with the table name. If only selecting from one table, prefixes are not needed.
- 👭🏻 Be explicit about your join type (i.e. write `inner join` instead of `join`).
- 🥸 Avoid table aliases in join conditions (especially initialisms) — it's harder to understand what the table called "c" is as compared to "customers".
- ➡️ Always move left to right to make joins easy to reason about - `right joins` often indicate that you should change which table you select `from` and which one you `join` to.

## 'Import' CTEs

- 🔝 All `{{ ref('...') }}` statements should be placed in CTEs at the top of the file.
- 📦 'Import' CTEs should be named after the table they are referencing.
- 🤏🏻 Limit the data scanned by CTEs as much as possible. Where possible, only select the columns you're actually using and use `where` clauses to filter out unneeded data.
- For example:

```sql
with

orders as (

    select
        order_id,
        customer_id,
        order_total,
        order_date

    from {{ ref('orders') }}

    where order_date >= '2020-01-01'

)
```

## 'Functional' CTEs

- ☝🏻 Where performance permits, CTEs should perform a single, logical unit of work.
- 📖 CTE names should be as verbose as needed to convey what they do e.g. `events_joined_to_users` instead of `user_events` (this could be a good model name, but does not describe a specific function or transformation).
- 🌉 CTEs that are duplicated across models should be pulled out into their own intermediate models. Look out for chunks of repeated logic that should be refactored into their own model.
- 🔚 The last line of a model should be a `select *` from your final output CTE. This makes it easy to materialize and audit the output from different steps in the model as you're developing it. You just change the CTE referenced in the `select` statement to see the output from that step.

## Model configuration

- 📝 Model-specific attributes (like sort/dist keys) should be specified in the model.
- 📂 If a particular configuration applies to all models in a directory, it should be specified in the `dbt_project.yml` file.
- 👓 In-model configurations should be specified like this for maximum readability:

```sql
{{
    config(
      materialized = 'table',
      sort = 'id',
      dist = 'id'
    )
}}
```

## Example SQL

```sql
with

events as (

    ...

),

{# CTE comments go here #}
filtered_events as (

    ...

)

select * from filtered_events
```

### Example SQL

```sql
with

my_data as (

    select
        field_1,
        field_2,
        field_3,
        cancellation_date,
        expiration_date,
        start_date

    from {{ ref('my_data') }}

),

some_cte as (

    select
        id,
        field_4,
        field_5

    from {{ ref('some_cte') }}

),

some_cte_agg as (

    select
        id,
        sum(field_4) as total_field_4,
        max(field_5) as max_field_5

    from some_cte

    group by 1

),

joined as (

    select
        my_data.field_1,
        my_data.field_2,
        my_data.field_3,

        -- use line breaks to visually separate calculations into blocks
        case
            when my_data.cancellation_date is null
                and my_data.expiration_date is not null
                then expiration_date
            when my_data.cancellation_date is null
                then my_data.start_date + 7
            else my_data.cancellation_date
        end as cancellation_date,

        some_cte_agg.total_field_4,
        some_cte_agg.max_field_5

    from my_data

    left join some_cte_agg
        on my_data.id = some_cte_agg.id

    where my_data.field_1 = 'abc' and
        (
            my_data.field_2 = 'def' or
            my_data.field_2 = 'ghi'
        )

    having count(*) > 1

)

select * from joined
```

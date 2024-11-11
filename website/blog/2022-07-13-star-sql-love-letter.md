---
title: "A star (generator) is born"
description: "One of the macros dbt utils offers is the `star` generator. This dbt macro is one of our favorites because it lets you select all the fields you want without writing the columns you don't."
slug: star-sql-love-letter

authors: [kira_furuichi]

tags: [sql magic]
hide_table_of_contents: false

date: 2022-05-23
is_featured: true
---


We’ve likely been here: Table A has 56 columns and we want to select all but one of them (`column_56`). So here we go, let’s get started…

```sql
select
	column_1,
	column_2,
	column_3,
	please_save_me…
from {{ ref('table_a') }}
```

At this point, you realize your will to continue typing out the next 52 columns has essentially dwindled down to nothing and you’re probably questioning the life choices that led you here.

But what if there was a way to make these 56+ lines of code come down to a handful? Well, that’s where a handy [dbt macro](/docs/build/jinja-macros) comes into play.

<!--truncate-->

## The `star` dbt macro

dbt supports [dbt_utils](https://github.com/dbt-labs/dbt-utils), a [package of macros and tests](https://docs.getdbt.com/docs/build/packages) that data folks can use to help them write more <Term id="dry" /> code in their dbt project. One of the macros dbt utils offers is the `star` generator.

This macro:

* Generates a comma-separated list of all fields that exist in the `from` [relation](https://docs.getdbt.com/reference/dbt-classes#relation) and excludes any fields listed in an `except` argument,
* Can optionally add a prefix to all generated fields using the `relation_alias`  argument,
* And also concatenate prefixes and/or suffixes to all generated fields using the  `prefix` and `suffix` arguments

So what does this mean for the example from above? Instead of writing out all 55 columns, you can use the `star` macro to select all fields except the column you don’t want:

```sql
select
	{{ dbt_utils.star(from=ref('table_a'), except=['column_56']) }}
from {{ ref('table_a') }}
```

This dbt model compiles to:

```sql
select
	column_1,
	column_2,
	…, --imagine we weren’t lazy and wrote out all other columns
	column_55
from table_a
```

With the `star` macro, all of the columns except `column_56` are generated in a comma-separated list within the `select` statement. What was once 56+ lines of tedious, mind-numbing SQL becomes 3 lines using the `star` macro. You can also exclude multiple columns by passing in the column names to the `except` argument.

If you want to alias all fields in a model with the same alias without having to explicitly rename them all, you can also use the `star` macro with the `relation_alias` argument passed in:

```sql
select
	{{ dbt_utils.star(from=ref('table_a'), relation_alias='my_new_alias') }}
from {{ ref('table_a') }}
```

Now, this will return all fields from `table_a` with the `my_new_alias.field_name` naming format.

[Under the hood](https://github.com/dbt-labs/dbt-utils/blob/main/macros/sql/star.sql), the `star` macro is actually using another dbt utils macro ([get_filtered_columns_in_relation](https://github.com/dbt-labs/dbt-utils#get_filtered_columns_in_relation-source)) to loop through fields to either select, alias, and/or append some string values to them.

## Why we love the `star` macro

It’s no hidden fact: the Data Team at dbt Labs loves to use dbt util’s macros and tests when appropriate. We like dbt utils so much we created a March Madness Utils Bracket for them (not taking questions at this time) and we used the `star` macro alone over 30 times in our internal dbt repository.

![](/img/blog/2022-07-13-star-sql-love-letter/utils-madness-1.png)


Overall, the `star` macro is a great way to dip your toes into the dbt utils package, write DRY code, and reduce your carpal tunnel.
---
title: "How we remove partial duplicates: Complex deduplication to refine your models' grain"
description: "dbt Labs Analytics Engineer Lauren Benezra walks you through an example of how to refine your data's grain, using less-than-ideal data loading issues as an opportunity to improve the clarity of the entities you're modeling and how you express them."
authors: [lauren_benezra]
hide_table_of_contents: false
tags: [analytics craft]
is_featured: true
slug: how-we-remove-partial-duplicates
date: 2022-05-12
---

Hey data champion — so glad you’re here! Sometimes datasets need a **team** of engineers to tackle their deduplification (totz a real word), and that’s why we wrote this down. *For you*, friend, *we wrote it down for you*. You’re welcome!

Let’s get rid of these dupes and send you on your way to do the rest of the *super-fun-analytics-engineering* that you want to be doing, on top of *super-sparkly-clean* data. But first, let’s make sure we’re all on the same page.

<!--truncate-->

You’re here because your duplicates are *special* duplicates. These special dupes are not the basic ones that have same exact values in every column and duplicate <Term id="primary-key">primary keys</Term> that can be easily fixed by haphazardly throwing in a `distinct` (yeah that’s right, I called using `distinct` haphazard!). These are *partial* duplicates, meaning your entity of concern's primary key is not unique *on purpose* (or perhaps you're just dealing with some less than ideal data syncing). You may be capturing historical, type-two slowly changing <Term id="dimensional-modeling">dimensional</Term> data, or incrementally building a table with an append-only strategy, because you actually want to capture some change over time for the entity your recording. (Or, as mentioned, your loader may just be appending data indiscriminately on a schedule without much care for your time and sanity.) Whatever has brought you here, you now have a table where the <Term id="grain" /> is not your entity’s primary key, but instead the entity’s primary key + the column values that you’re tracking. Confused? Let’s look at an example.

Here’s your raw table:

| entity_id | unimportant_value | important_status | updated_date |
|-----------|-------------------|------------------|--------------|
| 1         | cool              | pending          | 2022-02-24   |
| 1         | lame              | submitted        | 2022-03-01   |
| 1         | cool              | submitted        | 2022-03-03   |
| 2         | cool              | pending          | 2022-02-27   |

You have this historical record that captures all the changes made to the entities. Fine so far, but here's the rub: you don’t actually care about the changes that happen in the `unimportant_value` column, and a thus a fresh `updated_date` column value and a new row doesn’t always indicate a *real change* (real here is defined in terms of what matters to you modeling the data for our stakeholders). As discussed, the grain of the dataset you want to capture is the combination of the columns we deem important that make each row unique. So in this case, the grain is `entity_id` + `important_status`, not just `entity_id`. As a result, rows 2 and 3 are what we’ll call *partial duplicates*. If you were to ignore the two columns whose values you don’t want to track, you’d find the dupes that need to be banished!

## Identifying key columns

First, let’s look a little closer at identifying the desired grain of the model you are building before you go removing these partial duplicates from your dataset. These questions can help you figure out the core entity that you are tracking, and the real grain at which changes should be captured in your new model.

- **What is the primary key of the entity which you are tacking historical data for?** You should be able to group by this id in order to identify the duplicates for each id.
- **What other column(s) are capturing the changes in the data you want to track in your new model?** These columns will become part of your new unique primary key.
- **What timestamp provides the most reliable update time for these records?** You’ll need this to ensure you’re picking the most recent row among the partial duplicates.
- **What column value(s) are changing, but you don’t care about tracking in your new model?** These are the columns that you’ll ignore when building your `grain_id`.

The combination of `entity_id` + [changing column(s)] you want to capture becomes the grain of your model. In our example, we are looking to  capture data at the grain of `entity_important_status` which we'll call our `entity_grain` for now.

| entity_grain | entity_id | unimportant_value | important_status | updated_date |
|--------------|-----------|-------------------|------------------|--------------|
| 1_pending    | 1         | cool              | pending          | 2022-02-24   |
| 1_submitted  | 1         | lame              | submitted        | 2022-03-01   |
| 1_submitted  | 1         | cool              | submitted        | 2022-03-03   |
| 2_pending    | 2         | cool              | pending          | 2022-02-27   |

Now the `entity_grain` clearly shows us which rows are duplicates! We only need to keep the most recent one, so row 2 above can be removed from the cleaned dataset, giving us the output below. In our full process below, we’ll make this concatenated key into a proper id, but this is funamentally what's happening under the hood.  

| entity_grain | entity_id | unimportant_value | important_status | updated_date |
|--------------|-----------|-------------------|------------------|--------------|
| 1_pending    | 1         | cool              | pending          | 2022-02-24   |
| 1_submitted  | 1         | cool              | submitted        | 2022-03-03   |
| 2_pending    | 2         | cool              | pending          | 2022-02-27   |

Hopefully this is making a bit more sense. The TL;DR is that you need to think about the grain of your data, and the entity you want to capture as you are tracking changes. Only then can you find the more complex partial duplicates you want to eliminate.

## Overview

Here’s a brief overview of the steps we’ll take:

1. Create a unique, hashed `grain_id` for each row of your table from every significant column value.
2. Mark the real differences within the data based on the key you created, and filter duplicates.
3. Add tests to ensure your deduplication has worked and your dataset stays clean!

## Step 1: Build a unique key for each row of your table

> Step 1 walks you through how to build a hashed entity id from column values using a macro. You’ll use this key in Step 2 to find the true duplicates and clean them out.

The idea in this step is to enable checking for duplicates in the data by attaching a unique key to the hashed values of the columns that make up the entity grain you want to track. It’s important to note here that the *[dbt_utils.generate_surrogate_key](https://github.com/dbt-labs/dbt-utils/blob/main/macros/sql/generate_surrogate_key.sql)* will not create a unique key yet! Instead, it will create a key that will be the same as the key of another row, as long as the column values we’ve selected for our entity grain are the same. *This is intentional and critical!*  The specific non-uniqueness is how we’ll catch our sneaky duplicates.

In our example, you can see that the <Term id="surrogate-key">`surrogate_key`</Term> function builds the same `grain_id` or the two rows we know are duplicates, rows 2 and 3, with row 3 being the most recent row.

| grain_id                         | entity_grain | entity_id | unimportant_value | important_status | updated_at_date |
|----------------------------------|--------------|-----------|-------------------|------------------|-----------------|
| 8e0bd4a0e4a6e3a4ad3f28f13a3d5e51 | 1_pending    | 1         | cool              | pending          | 2022-02-24      |
| c8b91b84808caaf5870d707866b59c   | 1_submitted  | 1         | boring              | submitted        | 2022-03-01      |
| c8b91b84808caaf5870d707866b59c   | 1_submitted  | 1         | cool              | submitted        | 2022-03-03      |
| 283ff22afb622dcc6a7da373ae1a0fb  | 2_pending    | 2         | cool              | pending          | 2022-02-27      |

Remember, it’s important to only look for duplicate rows for the values that indicate a *true* difference between the rows of data the data; e.g., in type-two data, `updated_at_date` doesn’t mean that the other columns that we’ve decided we’re concerned with have changed since the previous time it was loaded, so that column doesn’t necessarily indicate a true difference between rows (though it usually indicates that something has changed, but that change may be outside our scope of concern in this case). But a change in `important_status`, for our purposes, would indicate a change in the data that you’d probably want to track. If you aren’t applying this technique to type-two data, but instead wanting to remove everything except the most recent data, you may have just a few columns that indicate a true difference between rows (an id at the right grain, and/or an id at a larger grain + timestamp).

To build our `grain_id` key, we use the pure gold of the *[dbt_utils package](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/)*. If you’re unsure of what this package is, stop reading right now and make sure this is installed in your dbt project. It will bring joy to your life and ease to your struggling!

`dbt_utils.get_filtered_columns_in_relation` is the star of the show here, which allows you to grab all the columns from a [relation](/reference/dbt-classes#relation) (reference/source), *except* the ones you specify, and put them into a list. If you only have a couple columns, it may be easier just to list them for the `cols` variable instead of using the this function.

```sql
{%- macro build_key_from_columns(dbt_relation, exclude=[]) -%}

{% set cols = dbt_utils.get_filtered_columns_in_relation(dbt_relation, exclude)  %}

{{ return(dbt_utils.surrogate_key(cols)) }}

{%- endmacro -%} 
```

For each row of data, this macro grabs each value from all the columns, except the columns we specify in the exclude list. Then it creates a hash-key using `dbt_utils.surrogate_key` that will reflect the uniqueness of the column values (i.e. if the combination of values is *not* unique, the `surrogate_key` will be the same, which is what we want to capture). The columns in the exclude list are values that we want to ignore when looking for a change in the data table (like `unimportant_value,`a column whose fluctuations we don’t want to indicate a real difference between rows). Call the macro above to create a column in your base or staging layer, and call it `grain_id`, so we can filter out the changes where `count(grain_id) > 1`:

```sql
{{ build_key_from_columns(source('name', 'table_name')) }} as grain_id,
```

## Step 2: Mark truly unique rows, and filter

> Step 2 walks you through how to filter out duplicates based on your new `grain_id` from Step 1.

To get rid of dupes, find the previous `grain_id` (remember this is a hash-key of all the values in a row), compare it to the most recent `grain_id` as ordered by a reliable timestamp. If they are not equal, then mark it as a real difference in the data, meaning you’ll keep it! Notice that we `coalesce` our window function with a string `‘first_record’`, so that an entity’s first record, which naturally has no `previous_grain_id`, won’t have a `null` in that column and throw off all our downstream comparisons.

```sql
mark_real_diffs as (

  select
      *,
      coalesce(
          lag(grain_id) over (partition by entity_id order by updated_at_date),
          'first_record'
      ) as previous_grain_id,
      case
          when grain_id != previous_grain_id then true 
          else false
      end as is_real_diff

  from base_product

),
```

Filter out everything that isn’t marked as a real difference, and now you’re dupe-free!

```sql
filter_real_diffs as (

    select *
  
    from mark_real_diffs
  
    where is_real_diff = true

)

select * from filter_real_diffs
```

## Step 3: Test your data

> *What happens in this step? You check your data because you are thorough!*

Good thing dbt has already built this for you. Add a [unique test](/docs/build/data-tests#generic-data-tests) to your YAML model block for your `grain_id` in this de-duped staging model, and give it a dbt test!

```yaml
models:
  - name: my_model
    columns:
      - name: grain_id
        tests:
          - unique
          - not_null
```

## Conclusion

> This filtering logic is ideally done as upstream as possible at a base or staging layer to avoid terrible fan out when you start joining your tables.

You star! I’m so glad you worked your way to the end, and now your data is squeaky clean.

To recap, we took the following steps to identify and eliminate partial duplicates:

1. Decided which columns we care about, which include:
    1. The column(s) that form the unique entity we're concerned with
    2. The column(s) that constitute attributes of that entity whose changes we want to track
    3. The column(s) that constitute our most reliable updating time dimension
2. Created a `surrogate_key` of all the above columns (except the timestamp, which we use for ordering), which captures the combination of values from those columns into a single column
3. Used this key to mark and remove duplicates within the partial set of columns we’re tracking

These kinds of transformations not only help clean up your data, but they play a bigger part in crafting  your data sets into what you need to capture in order to generate real value *and* contribute to real understanding of datasets among your data consumers. Remember that these datasets work for **you** — you are skilled enough to mold these datasets into your vision, to reflect the questions you and your customers want to answer. Nobody puts Baby in a corner! Not even data.

![Dirty dancing - nobody puts baby in a corner!](/img/blog/2022-04-19-complex-deduplication/dancing-baby.gif)

You don’t have to be pigeon-holed by the grain of the source data or the massive number of value changes captured by history tables. You decide what a clean dataset looks like, which columns are of value, and use those sweet, sweet analytics-engineering skills to build a model how you see fit. We’re all so proud of you! Carry on, friend.

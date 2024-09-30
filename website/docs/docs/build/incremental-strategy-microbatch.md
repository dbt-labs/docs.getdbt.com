---
title: "Microbatching"
description: "Learn about using microbatch within incremental models"
id: "incremental-strategy-microbatch"
pagination_next: "docs/build/enhance-your-code"
---


Incremental models in dbt use a [materialization](/docs/build/materializations) strategy that optimizes the process of updating tables in your data warehouse. Instead of reprocessing the entire dataset with each run, this approach focuses on transforming and loading only the new or modified data. By appending or updating only the latest rows, incremental models help minimize the time and resources needed for data transformations.

Previously, we relied on YOU to explicitly tell dbt what “new” means in the context of your model by writing a filter in an `is_incremental()` block. The responsibilities lay with you for crafting this SQL in a way that queries `this` to check when the most recent record was last loaded, with an optional look-back window for late-arriving records. 

Next, you would define the strategy that determined how dbt will load the data into your existing table, choosing between `append`, `delete+insert`, or a `merge` statement on the desired outcome. If you opt for `delete+insert` or `merge`, you can control which batch gets replaced by specifying a `unique_key`. This key, while not truly unique, serves as the "upsert/merge key" to manage updates.

```sql

{{
    config(
        materialized='incremental',
        incremental_strategy='delete+insert',
        unique_key='date_day'
    )
}}

select * from {{ ref('stg_events') }}

    {% if is_incremental() %}
        -- this filter will only be applied on an incremental run
        -- add a lookback window of 3 days to account for late-arriving records
        where date_day >= (select {{ dbt.dateadd("day", -3, "max(date_day)") }} from {{ this }})  
    {% endif %}

```
In this incremental model:

- "New" records are those with a `date_day` greater than the maximum `date_day` that was previously loaded.
- There is a lookback window of 3 days.
- When new records are found for a specific `date_day`, the existing data for that `date_day` is deleted, and the new data is inserted in its place.

## Limitations of this approach

- The burden is on YOU to calculate what’s “new” &mdash; what has already been loaded, what needs to be loaded and so on.
- This can be time consuming if you have many batches to process (for example when running in `full-refresh` mode), as it’s done in “one big” SQL statement. In theory, the data platform can optimize processing of distributed datasets; in practice, that query can time out, and when you retry that query you end up reprocessing the same batches.
- If you want to specify batches for your incremental model to process (”rebuild for `2024-09-01`”), you need to add your own home-rolled logic, likely using `vars` .

## Advanced incremental strategy

As a result of the limitations and problems outlines, we’re planning to implement a brand-new incremental strategy to handle this type of batched incremental processing out-of-the-box. Introducing: `incremental_strategy=’microbatch’`.

Using our previous example, we'll use the new `microbatch` incremental strategy. 

Note: This is the proposed specification and is liable to change slightly as we implement:

```jina

-- proposed spec
{{
    config(
        materialized='incremental',
        incremental_strategy='microbatch',
        event_time='date_day',
				batch_size='day',
		    lookback=3,
		    begin='2020-01-01',
		    full_refresh=false
    )
}}

select * from {{ ref('stg_events') }} # this ref will be auto-filtered

```

In this case, you've also defined an `event_time` for the model's direct parent, which is `stg_events`:

```yml

models:
  - name: stg_events
     config:
       event_time: my_time_field

```
And that's all there is to it!

- You only need to write your model query for a single day of data. There's no need to worry about adding `is_incremental` filters or handling DML operations like upserting, merging, or replacing—dbt handles that for you.
    - dbt will automatically generate the necessary `where` clause(s) based on the `event_time` and batch_size configurations in both the incremental model and any upstream models.
- During regular incremental runs, dbt will process new data batches and apply the configured `lookback`, with one query per batch.
- If you've set an `event_time` for upstream models, dbt will automatically apply a filter. If there's an upstream model with an `event_time` configuration and you don't want filtering for that reference, you can opt out by using `ref('upstream_model').render()` to bypass the auto-filter.
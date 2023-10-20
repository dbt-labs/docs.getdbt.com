---
title: "Tackling the complexity of joining snapshots"
description: "Tracking changes in your dataset over time by joining snapshots can be a complex proces. Learn how to tackle that complexity with Lauren Benezra"
slug: joining-snapshot-complexity

authors: [lauren_benezra]

tags: [analytics craft]
hide_table_of_contents: false

date: 2022-05-26
is_featured: true
---

Let’s set the scene. You are an [analytics engineer](https://www.getdbt.com/what-is-analytics-engineering/) at your company. You have several relational datasets flowing through your warehouse, and, of course, you can easily access and transform these <Term id="table">tables</Term> through dbt. You’ve joined together the tables appropriately and have near-real time reporting on the relationships for each `entity_id` as it currently exists. 

But, at some point, your stakeholder wants to know how each entity is changing over time. Perhaps, it is important to understand the trend of a product throughout its lifetime. You need the history of each `entity_id` across all of your datasets, because each related table is updated on its own timeline. 

What is your first thought? Well, you’re a seasoned analytics engineer and you *know* the good people of dbt Labs have a solution for you. And then it hits you — the answer is [snapshots](https://docs.getdbt.com/docs/building-a-dbt-project/snapshots)!

<!--truncate-->

### What are snapshots and where do they get complex?

Snapshots provide a picture of changes throughout history — a snapshot-in-time, if you will. When a value in a row of a raw table is updated, a new row is added to your snapshot-table, building a historical record of your data. 

Here’s an example of a dataset. 

| entity_id | important_status | updated_at |
| --- | --- | --- |
| 1 | available | 2021-11-15 16:00:0000 |
| 2 | not_available | 2021-11-15 15:30:0000 |

When you apply a snapshot to this data, you’ll see the history of the data, and the `valid_from` and `valid_to` timestamps to capture when the row values were valid, and the values during those timespans.  

| entity_id | important_status | dbt_valid_from | dbt_valid_to |
| --- | --- | --- | --- |
| 1 | available | 2021-11-15 16:00:0000 | NULL |
| 1 | pending | 2021-11-10 08:00:000 | 2021-11-15 16:00:0000 |
| 1 | not_available | 2021-10-01 10:00:000 | 2021-11-10 08:00:000 |
| 2 | not_available | 2021-11-15 15:30:0000 | NULL  |

Snapshots are incredibly useful, but they do add a bit of complexity for joining tables downstream because you’ve added multiple rows of history per id. What happens when you have 10 snapshots that you want to join together, and you want to capture the history of all the datasets? 

Consider the complexity of the problem: you’ve successfully captured the history of all your tables using snapshots. You have `history_table_1` and `history_table_2`, and you want to join on a common key, `product_id`. However, we cannot just join on the primary key because each table has several rows of history for the same id, all valid across different timespans. 

`history_table_1`: 

| product_id | important_status | dbt_valid_from | dbt_valid_to |
| --- | --- | --- | --- |
| 1 | available | 2021-11-15 16:00:0000 | NULL |
| 1 | pending | 2021-11-10 08:00:000 | 2021-11-15 16:00:0000 |
| 1 | not_available | 2021-10-01 10:00:000 | 2021-11-10 08:00:000 |
| 2 | not_available | 2021-11-15 15:30:0000 | NULL  |

`history_table_2`:

| product_id | order_id | product_order_id | order_status | dbt_valid_from | dbt_valid_to |
| --- | --- | --- | --- | --- | --- |
| 1 | A | 1A | available | 2021-11-15 16:00:0000 | NULL |
| 1 | A | 1A | pending | 2021-10-31 12:00:000 | 2021-11-15 16:00:0000 |
| 1 | B | 1B | available | 2021-11-15 15:30:0000 | NULL |
| 1 | B | 1B | pending | 2021-11-10 10:00:000 | 2021-11-15 15:30:0000 |
| 2 | C | 2C | available | 2021-11-10 15:00:0000 | NULL  |

This doesn’t look so bad. How complex can this get? Let’s take a look at the math. Say `historical_table_1` has _x_ historical rows per `product_id`, and _y_ ids total. That’s _x*y = n_ rows of data. `historical_table_2` has _z_  historical rows per `product_id`, and _w_ ids (_z*w = m_ rows). The subsequent join on `product_id` then [changes the complexity](https://www.freecodecamp.org/news/big-o-notation-why-it-matters-and-why-it-doesnt-1674cfa8a23c/) from _O(n)_ to _O(n\*m)_ very quickly (_x\*y\*z\*w_ possibilities!). The complexity continues to increase as we join together more and more historical tables. 

I know what you’re thinking — what a mess! Can’t we just join everything together, and snapshot the resulting table? This is not a bad thought. It would save you the trouble of thinking through a problem with _O(n\*m\*a\*b\*c\*d\*...\*q)_ complexity. And in some cases, this may capture all the history you need! 

However, it does not provide a solution to the problem initially posed. The historical records track when each table is valid, rather than when the joined table is valid, and this history for each dataset will only be reflected when you snapshot each table, and then join them, rather than joining and subsequently snapshotting the table. The `valid_from` and `valid_to` built into the joined-then-snapshotted table will only be built from `updated_at` timestamps where the joined table is updated, and thus changes in the underlying data may not be captured. We want to understand when the records are truly valid across all tables, meaning we need to take into account the valid timestamps from each individual dataset. 

Okay so we’ve ruled out the easy way to solve this question. So let’s tackle that _O(n\*m\*a\*b\*c\*d\*...\*q)_ problem! We can do it. 

### The action plan for our solution

Ultimately, our goal is to capture the history for the `product_id` and join the rows that are valid at the same time. As a result, we can get a view of our data at a given point in time that accurately represents the valid state of any given date. 

For `historical_table_1` and `historical_table_2`, we will join on `product_id` where `historical_table_1.valid_from` to `historical_table_1.valid_to` has overlapping time with `historical_table_2.valid_from` to `historical_table_2.valid_to`. 

This boils down to the following steps: 

1. Get rid of dupes if needed
2. Snapshot your data tables 
3. Future-proof your `valid_to` dates
4. Join your non-matching grain tables to build a fanned out spine containing the grain ids onto which we will join the rest of the data
5. Join the snapshots to the data spine on the appropriate id in overlapping timespans, narrowing the valid timespans per row as more tables are joined
6. Clean up your columns in final <Term id="cte" />
7. Optional addition of global variable to filter to current values only 

So let’s dive in! Head first! Step 1 is outlined in this blog post: [How to deduplicate partial duplicates](https://docs.getdbt.com/blog/how-we-remove-partial-duplicates). It only needs to be implemented if you are dealing with dupes in your data. If you don’t have duplicates in your data (wow! send me the number of your Data Engineer *ASAP*), you can skip this step. 

![backtothefuture.gif](/img/blog/2022-05-24-joining-snapshot-complexity/backtothefuture.gif)

## Step 1: Ensure your data tables are duplicate free

:::important What happens in this step? 
Step 1 walks you through how to build a surrogate key from column values using a macro, and then removing said duplicates from your data. No duplicates? Skip to Step 2.
:::

Why is this step important? Because you’ll be joining so many rows on the same id, and the valid timestamps for each row will determine the exact place to join one table to another. We cannot do this accurately with duplicates! (But also, you should be checking for dupes anyway because we are analytics engineers, right?)

![clean-data-meme.png](/img/blog/2022-05-24-joining-snapshot-complexity/clean-data-meme.png)

See [this blog post for deduping partial duplicates](https://docs.getdbt.com/blog/how-we-remove-partial-duplicates)!

## Step 2: Snapshot your data

:::important What happens in this step? 
Step 2 walks you through how to snapshot your data. The example provided assumes you went through Step 1, but if you skipped that step, just snapshot your data based on the links provided below.
:::

Do you know how to snapshot data? It is a simple Jinja block with some configs specified. There are so many explanations of how to implement these, so I’m not going to bore you. But you know I’ll throw you some links. [Boom.](https://blog.getdbt.com/track-data-changes-with-dbt-snapshots/) [And foobar!](https://docs.getdbt.com/docs/building-a-dbt-project/snapshots)

You can snapshot by checking your `change_id` if you’ve implemented the removing-dupes logic from Step 1, or using the timestamp strategy, if you have a reliable timestamp.

```sql
{% snapshot snp_product %}
{{
   config(
     target_schema=generate_schema_name('snapshots'),
     unique_key='assetid',
     strategy='check',
     check_cols=['change_id']
   )
}}
select * from {{ ref('base_product') }}
{% endsnapshot %}
```

## Step 3: Future-proof your timestamps

:::important What happens in this step?
Step 3 walks you through how to replace your snapshot `valid_to = NULL` value with a future-proof date to ensure smooth sailing through the snapshot joins.
:::

Now that you’ve deduped and you’ve snapped, you need to future-proof! This is a step you cannot skip, because the joins we will do in the next steps will rely on `valid_to` to contain a date, rather than a `NULL`. 

:::note Note 
This is a great place to set a global variable! You can define your future-proof variable in the dbt_project.yml file. 
:::

```jsx
vars:
 future_proof_date: '9999-12-31'
```

And coalesce!

```sql
coalesce(dbt_valid_to, cast('{{ var("future_proof_date") }}' as timestamp)) as valid_to
```

You will thank yourself later for building in a global variable. Adding important global variables will set your future-self up for success. Now, you can filter all your data to the current state by just filtering on `where valid_to = future_proof_date`*.* You can also ensure that all the data-bears with their data-paws in the data-honey jar are referencing the **same** `future_proof_date`, rather than `9998-12-31`, or `9999-12-31`, or `10000-01-01`, which will inevitably break something eventually. You know it will; don’t argue with me! Global vars for the win!

## Step 4: Join your tables together to build a fanned out id spine

:::important What happens in this step?
Step 4 walks you through how to do your first join, in which you need to fan out the data spine to the finest grain possible and to include the id onto which we will join the rest of the data. This step is crucial to joining the snapshots in subsequent steps.
:::

Let’s look at how we’d do this with an example. You may have many events associated with a single `product_id`. Each `product_id` may have several `order_ids`, and each `order_id` may have another id associated with it. Which means that the grain of each table needs to be identified. The point here is that we need to build in an id at the finest grain. To do so, we’ll add in a [dbt_utils.generate_surrogate_key](https://github.com/dbt-labs/dbt-utils/blob/main/macros/sql/generate_surrogate_key.sql) in the staging models that live on top of the snapshot tables. 

Then, in your joining model, let’s add a CTE to build out our spine with our ids of these different grains. 

```sql
build_spine as (
	historical_table_1.*,
	historical_table_2.product_order_id,
	historical_table_3.other_entity_grain_id, 
	...
from historical_table_1
left join
	historical_table_2 
	on historical_table_1.product_id = historical_table_2.product_id
left join 
	historical_table_3
	on historical_table_1.product_id = historical_table_3.product_id
... )
```

The result will be all the columns from your first table, fanned out as much as possible by the added `id` columns. We will use these `id` columns to join the historical data from our tables. It is extremely important to note that if you have tables as part of this pattern that are captured at the same grain as the original table, you **do not** want to join in that table and id as part of the spine. It will fan-out _too much_ and cause duplicates in your data. Instead, simply join the tables with the same grain as the original table (in this case, `historical_table_1` on `product_id`) in the next step, using the macro. 

| product_id | important_status | dbt_valid_from | dbt_valid_to | product_order_id |
| --- | --- | --- | --- | --- |
| 1 | available | 2021-11-15 16:00:0000 | NULL | 1A |
| 1 | pending | 2021-11-10 08:00:000 | 2021-11-15 16:00:0000 | 1A |
| 1 | not_available | 2021-10-01 10:00:000 | 2021-11-10 08:00:000 | 1A |
| 1 | available | 2021-11-15 16:00:0000 | NULL | 1B |
| 1 | pending | 2021-11-10 08:00:000 | 2021-11-15 16:00:0000 | 1B |
| 1 | not_available | 2021-10-01 10:00:000 | 2021-11-10 08:00:000 | 1B |
| 2 | not_available | 2021-11-15 15:30:0000 | NULL  | 2C |

## Step 5: Join your snapshots onto id spine

:::important What happens in this step? 
Step 5 walks you through the logic of the snapshot join, and the macro that will make the joins simpler.
:::

Now, I’m going to recommend you build individual CTEs with one join at a time. Why do we build a CTE with a single join, rather than all the joins in one? So many reasons, but there are two big ones.

- **First**, this is complicated. You will need to troubleshoot, and the easiest way to enable troubleshooting is to separate your join logic in individual CTEs. By building your code this way, you can easily throw a `select * from last_cte` to check that your logic is doing what you think it should be doing before adding more complex joins.
- **Second**, you are using the `valid_from` and `valid_to` values of each newly joined table to determine the new `valid_from` and `valid_to` timestamps for the resulting table – where both rows are valid within the same timespans. While you could accomplish this in one big massive join, it will become very complex and difficult to troubleshoot when you run into funky results.

### <Term id="dry">DRY</Term> — it’s macro time!

This macro finishes your join CTE, which allows you to add columns from the new table you’re joining before calling the macro. It also assumes you’ve replaced your `valid_to = NULL` with an actual date type with an actual date that indicates a row is currently valid.

Your parameters are `cte_join`, the table that is creating the spine of your final model, `cte_join_on`, which is the new table you’re joining onto the spine. The `valid_to` and `valid_from` values for both of these tables, and the ids onto which you are joining (named twice in case they have different column names, but in most instances these two parameters will be the same name).

```sql
-- requires any extra columns from table_join_on to be listed prior to using this macro.
-- assumes we have replaced instances of valid_to = null with a future_proof_date = '9999-12-31'.
 
{% macro join_snapshots(cte_join, cte_join_on, cte_join_valid_to,
   cte_join_valid_from, cte_join_on_valid_to, cte_join_on_valid_from,
   cte_join_id, cte_join_on_id) %}
 
 
       {{cte_join}}.*,
       greatest({{cte_join}}.{{cte_join_valid_from}},
               coalesce( {{cte_join_on}}.{{cte_join_on_valid_from}}, {{cte_join}}.{{cte_join_valid_from}}))
           as add_{{cte_join_on}}_valid_from,
       least({{cte_join}}.{{cte_join_valid_to}},
           coalesce({{cte_join_on}}.{{cte_join_on_valid_to}}, {{cte_join}}.{{cte_join_valid_to}})) as add_{{cte_join_on}}_valid_to
  
   from {{cte_join}}
   left join {{cte_join_on}} on {{cte_join}}.{{cte_join_id}} = {{cte_join_on}}.{{cte_join_on_id}}
      and ({{cte_join_on}}.{{cte_join_on_valid_from}} <= {{cte_join}}.{{cte_join_valid_to}}
      and {{cte_join_on}}.{{cte_join_on_valid_to}} >= {{cte_join}}.{{cte_join_valid_from}})
      
  
{% endmacro %}
```

The joining logic finds where the ids match and where the timestamps overlap between the two tables. We use the **greatest** `valid_from` and the **least** `valid_to` between the two tables to ensure that the new, narrowed timespan for the row is when the rows from both tables are valid. _**Update: Special thank you to Allyn Opitz for simplifying this join logic! It's so much prettier now.**_

You should see something like this as your end result:

| product_id | product_order_id | order_id | important_status | order_status | greatest_valid_from | least_valid_to |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 1A | A | available | available | 2021-11-15 16:00:0000 | 9999-12-31 |
| 1 | 1A | A | pending | pending | 2021-11-10 08:00:000 | 2021-11-15 16:00:0000 |
| 1 | 1A | A | not_available | pending | 2021-10-31 10:00:000 | 2021-11-10 08:00:000 |
| 1 | 1B | B | available | available | 2021-11-15 16:00:0000 | 9999-12-31 |
| 1 | 1B | B | pending | pending | 2021-11-10 08:00:000 | 2021-11-15 16:00:0000 |
| 1 | 1B | B | not_available | pending | 2021-10-01 10:00:000 | 2021-11-10 08:00:000 |
| 2 | 2C | C | not_available | available | 2021-11-15 15:30:0000 | 9999-12-31 |

### Continue joining on your tables, and narrowing your valid timespans.

Using the produced valid timestamps from the previous join as your new spine timestamps, continue joining the rest of your snapshots in this manner.

## Step 6: Clean up your final table with a CTE (duh!)

:::important What happens in this step? 
Step 6 is to finish your code with a final, cleaned up CTE.
:::

Your final CTE of your table should list only the columns that you want to keep. Clean up all the timestamp columns, and rename the narrowed `valid_from` and `valid_to` from your final join to the appropriate name.

## Step 7: Optional -- add global variable for building historical vs current

:::important What happens in this step?
Step 7 walks you through the option of building in a global variable to run only the most current data.
:::

It could be useful to add a current records only variable to run your project. This is a fast way to skip the historical data, without having to build out new models, or filter on your historical table. You can have a separate job set up to target a new schema, and build tables with current data only, that are ready for the present-day reports. You’ll know this is right for your project if you a BI tool that doesn’t love to filter on big, history-filled tables (like Tableau), but would prefer to have easily accessible, ready to run tables. To build in this feature, add a global variable in the *dbt_project.yml,* so your `future_proof_date` has a friend:

```jsx
future_proof_date: '9999-12-31'
current_records_only: true
```

And add a Jinja-if to your staging models, so that you’re asking your project to only build the data that is current, without having to override your snapshots:

```sql
{% if var("current_records_only") %}

where valid_to = cast('{{ var("future_proof_date") }}' as timestamp)

{% endif %}
```

## Parting thoughts

Friend, you're an absolute star. You’ve determined that you need to join several snapshots when each entity is in a valid state, which comes with a fair amount of complexity! With this logic we’ve broken down the problem into a few steps: getting rid of duplicates, snapshotting your data, replacing your currently-valid rows with a future-proof date, building your first join to complete the fanned out data spine, joining onto your data spine across valid timestamps, and then repeating this logic using a macro. After you join your first historical data to your data spine, be sure to check the results. One weird line of code can cause a mess of problems with all this complexity, so always check results along the way. Well done, be well, you’re doing a great job!

---
title: "What's a Primary Key and Why Do We Test Them?"
description: "Let’s dive deep into: what primary keys are, which cloud analytics warehouses support them, and how you can test them in your warehouse to enforce uniqueness"
slug: primary-key-testing
authors: [sanjana_sen,jason_ganz,david_krevitt] 

tags: [sql magic]
hide_table_of_contents: false

date: 2021-11-29
is_featured: true

---

We’ve all done it: fanned out data during a join to produce duplicate records (sometimes duplicated in multiple).  

That time when historical revenue numbers doubled on Monday? Classic fanout. 

Could it have been avoided? Yes, very simply: by defining the uniqueness <Term id="grain" /> for a <Term id="table" /> with a primary key and enforcing it with a dbt test.

So let’s dive deep into: what primary keys are, which cloud analytics warehouses support them, and how you can test them in your warehouse to enforce uniqueness.

<!--truncate-->

<WistiaVideo id="hnkw6j7m2t" />

## What’s a primary key?

A <Term id="primary-key" /> is a column in your database that exists to uniquely identify a single row.

Primary keys are _critical_ to data modeling. Without a primary key, you’ll find yourself constantly struggling to identify duplicate rows and define the expected grain of your tables. 

There is just about no more ironclad law in the land of analytics than `you must have a primary key on every table`. 


## Why do we test primary keys?

But what happens when blank or duplicate data finds its way into your primary keys? As I mentioned up top, it can create quite a firedrill.

Invalid data getting into your primary keys is one of _the_ biggest data problems - it can lead to rows getting dropped or miscounted and for all kinds of weird results to pop into your data. It’s one of the most common causes of time-sensitive headaches in analytic-land.

This is, of course, what makes your primary keys so powerful. See, most of the time that primary keys get messed up, they do so because:

* There are rows where the primary key is null
* There are rows where the primary key is not unique (duplicate values)

As you’ll see below in the “warehouse support for PKs” section, while some warehouses allow you to define primary keys, but will not enforce either not-nullness or uniqueness on values. So, we test.

In the days before testing your data was commonplace, you often found out that you had issues in your primary keys by you (or worse, your boss) noticing that a report was off. This has lead to a lot of unnecessary angst and loss of trust in data.


## How to test primary keys with dbt

Today, you can add two simple [dbt tests](/docs/build/data-tests) onto your primary keys and feel secure that you are going to catch the vast majority of problems in your data.

Not surprisingly, these two tests correspond to the two most common errors found on your primary keys, and are usually the first tests that teams testing data with dbt implement:



* [Not_null](https://docs.getdbt.com/reference/resource-properties/tests#not_null)
* [Unique](https://docs.getdbt.com/reference/resource-properties/tests#unique)

These tests are specified inline in your models’ .yml configuration files, so you can define a batch of tests across models from one file.  Put together, a `not_null` + `unique` test would look like so:

```

models:

  - name: orders

    columns:

      - name: order_id

        tests:

          - unique

          - not_null

```

It really is as simple as adding those two tests to the primary keys of all of your tables, and then you have a built-in safeguard against bad data in your primary keys.

Having tests configured and running in production using the [`dbt test`](https://docs.getdbt.com/reference/commands/test) command unlocks your ability to do things like [send Slack alerts](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-slack-notifications) on test failures, so you’ll be the first to know when PK issues arise. 


## Does your warehouse support primary keys?

Does your warehouse even _support_ primary keys at all? If it does, how can you actually find out if a table has a primary key set, and what that primary key is?

Let’s walk through primary key support + access across the major cloud <Term id="data-warehouse" /> platforms.


### TL;DR on primary key support across warehouses

BigQuery + Databricks don’t support primary keys, Redshift + Snowflake support primary keys but don’t enforce them fully, and Postgres fully supports + enforces primary keys. 

This means that across major analytics warehouses, _data testing_ (using a tool like dbt) to enforce your primary keys is super important for ensuring analytics data quality.

Redshift, Snowflake and Postgres allow you to query primary key column lists from your database’s information schema tables. Read on for the gritty details + links to appropriate docs.


### BigQuery primary keys

BigQuery does not have a concept of primary key constraints for tables, so instead you’ll want to use [surrogate keys](/blog/sql-surrogate-keys) in dbt to define your primary key for a table.


### Databricks primary keys

Databricks Delta SQL does not support primary keys in a classic SQL sense, and instead offers what they call [constraints](https://docs.databricks.com/delta/delta-constraints.html) for fields (`not null` being one of them).  

Similarly to BigQuery, <Term id="surrogate-key">surrogate keys</Term> can be used to get around this limitation.


### Redshift primary keys

Amazon Redshift allows you to set primary keys as a [table constraint](https://docs.aws.amazon.com/redshift/latest/dg/t_Defining_constraints.html) (which helps with query optimization), however these constraints are not actually enforced by the warehouse itself.

You can then query these constraints out of the `information_schema.table_constraints` + `information_schema.key_column_usage` tables.

It’s ultimately up to you to check for uniqueness + not null-ness in your data, to ensure that your table constraints are actually enforced (see testing section at the bottom of this post).


### Snowflake primary keys

Snowflake supports a command of [SHOW PRIMARY KEYS](https://docs.snowflake.com/en/sql-reference/sql/show-primary-keys.html), which allows you to query out primary keys for your tables.

Note that Snowflake primary keys are purely declarative--neither uniqueness nor non-nullness constraints are enforced. However, Snowflake supports a separate `not null` constraint that can be applied to column that is enforced. Regardless, you'll still want to ensure your primary key column values are actually unique (see testing section at the bottom.)


### Postgres primary keys

Postgres does fully support primary keys, meaning it enforces uniqueness and not null constraints on tables with primary keys. 

This makes a ton of sense given Postgres’ primary use as an application database, where primary keys *really* need behave like primary keys, as opposed to the data warehouses above that aren’t generally being used to power applications.

You can query out primary key columns from the `pg_index` and `pg_attribute` admin tables.


## Have you started testing primary keys yet?

If you’re looking for a deeper dive on testing primary keys, definitely check out the [dbt Fundamentals course](https://courses.getdbt.com/courses/fundamentals), which includes a full section with examples + practice on data testing in dbt.

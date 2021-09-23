---
title: Refactoring legacy SQL to dbt SQL
id: refactoring-legacy-sql
---

You may have already learned how to build dbt models from scratch. 

But in reality, you probably already have some queries or stored procedures that power analyses and dashboards, and now you’re wondering how to port those into dbt. 

There are two parts to accomplish this: migration and refactoring. In this lesson we’re going to learn a process to help us turn legacy SQL code into modular dbt models.

When migrating and refactoring code, it’s of course important to stay organized. We'll do this is by following several steps:

1. [Migrate your code 1:1 into dbt](#migrate-your-existing-sql-code)
2. Implement dbt sources rather than referencing raw database tables
3. Choose a refactoring strategy
4. Implement CTE groupings and cosmetic cleanup
5. Separate data transformations into standardized layers
6. Audit the output of dbt models vs legacy SQL

Let's get into it!

> Note: this tutorial is excerpted from the new dbt Learn On-demand Course, "Refactoring and Its Joys" - if you're curious, pick up the [free SQL refactoring course here](https://courses.getdbt.com), which includes example and practice refactoring projects.

## Migrate your existing SQL code

<WistiaVideo id="5u67ik9t66" />

Your goal in this initial step is simply to use dbt to run your existing SQL transformation, with as few modifications as possible. This will give you a solid base to work from.

More changes = more auditing work, and we'll want to save the bulk of our auditing for the end, when we're auditing our final dbt model structure after refactoring.

To get going, you'll copy your legacy SQL query into your dbt project, by saving it in a `.sql` file under the `/models` directory of your project. 

<Lightbox src="/img/tutorial/refactoring/legacy-query-model.png" title="Your dbt project's folder structure" />

Once you've copied it over, you'll want to `dbt run` to execute the query and populate the table in your warehouse.

> If this is your first time running dbt, you may want to start with the [Introduction to dbt](/docs/introduction) and the [Getting Started tutorial](/tutorial/setting-up) before diving into refactoring.

This step may sound simple, but if you're porting over an existing set of SQL transformations to a new SQL dialect, you will need to consider how your legacy SQL dialect differs from your new SQL flavor, and you may need to modify your legacy code to get it to run at all.  

This will commonly happen if you're migrating from a [stored procedure workflow on a legacy database](https://getdbt.com/analytics-engineering/case-for-elt-workflow/) into dbt + a cloud data warehouse.

Functions that you were using previously may not exist, or their syntax may shift slightly between SQL dialects. 

If you're not migrating data warehouses at the moment, then you have access to exact same SQL dialect inside of dbt that you have working directly in a SQL browser - dbt SQL compiles to your warehouse's SQL dialect at runtime.

## Creating sources from table references

<WistiaVideo id="m1a5p32rny" />

To query from your data warehouse, we recommend creating [sources in dbt](/docs/building-a-dbt-project/using-sources) rather than querying the database table directly.

This allows you to call the same table in multiple places with the simpler `{{ src('source_name') }}` rather than `my_database.my_schema.my_table`, and unlocks the ability to run [source freshness reporting](/docs/building-a-dbt-project/using-sources#snapshotting-source-data-freshness) to make sure your raw data isn't stale.

We start here for several reasons:

### Sources allow for easy dependency tracing
If you're migrating multiple stored procedures into dbt, with sources you can see which queries depend on the same raw tables. 

This allows you to consolidate modeling work on those base tables, rather than calling them separately in multiple places. 

<Lightbox src="/img/docs/building-a-dbt-project/sources-dag.png" title="Sources appear in green in your DAG in dbt docs" />

### Sources build the habit of analytics-as-code
Sources are an easy way to get your feet wet using config files to define aspects of your transformation pipeline.

With a few lines of code in a `.yml` file in your dbt project's `/models` subfolder, you can now version control how you your data sources (Snowplow, Shopify, etc) map to actual database tables.

For example, say you migrate from one [ETL tool](getdbt.com/analytics-engineering/etl-tools-a-love-letter/) to another, and the schema name on your tables changes from - source config files allow you to make that migration from a single file, and flip the change on with one pull request to your repo. 






















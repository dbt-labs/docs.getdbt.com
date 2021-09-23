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

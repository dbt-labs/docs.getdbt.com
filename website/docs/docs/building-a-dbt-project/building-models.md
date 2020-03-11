---
title: "dbt Models"
id: "building-models"
---

## Everything is a select

The core concept of dbt data models is that everything is a `SELECT` statement. Using this approach, the SQL code within a given model defines the dataset, while dbt configuration defines what to do with it. This allows users to focus on writing analysis, not writing plumbing code. dbt is responsible for the plumbing: creating tables, inserting records, dropping tables, etc.

Here are some things that can be done when separating the analytic logic from the model configuration:

- With a single config change, one data model or an entire hierarchy of models can be flipped from views to materialized tables. dbt takes care of wrapping a model's `SELECT` statement in the appropriate `CREATE TABLE` or `CREATE VIEW` syntax.
- With two configuration changes, a model can be flipped from a materialized table that is rebuilt with every `dbt run` to a table that is built incrementally, inserting the most recent rows since the most recent `dbt run`. dbt will wrap the select into an `INSERT` statement and automatically generate the appropriate `WHERE` clause.
- With one config change, a model can be made ephemeral. Instead of being deployed into the database, ephemeral models are pulled into dependent models as common table expressions.

Because every model is a `SELECT`, these behaviors can all be configured very simply, allowing for flexibility in development workflow and production deployment.

## Example models

Check out the [Jaffle Shop](https://github.com/fishtown-analytics/jaffle_shop) project to see some example dbt models.
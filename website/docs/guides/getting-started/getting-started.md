---
title: Getting started with dbt Cloud
id: getting-started
description: "Create your first dbt project using a SQL query."
---

dbt centralizes your analytics code and enables software engineering-style guardrails for data teams. dbt enables you to collaborate on SQL, version it through Git, and test and document your queries before safely deploying them to production and monitoring them.

dbt takes your analytics code and helps you modularize it before you compile and run against your database. This enables you and your team to collaborate on a single source of truth for metrics and insights. A single source of truth, combined with the ability to define tests for your data, reduces errors when your analytics code is updated due to changes in your business and alerts you when a job fails

This guide will show you how to set up dbt Cloud and perform some key tasks. These tasks will illustrate how dbt establishes standard practices for your work.

In this guide, you will:

* Set up a warehouse with sample data
* Connect the warehouse to dbt Cloud
* Add a Git repository to dbt Cloud
* Execute a dbt transformation using `dbt run`
* Schedule a job or transformation

If you want a more in-depth learning experience, we recommend taking the dbt Fundamentals on our [dbt Learn online courses site](https://courses.getdbt.com/).

## Before you begin

Before you begin, you will need:

* Warehouse with sample data. If you don't have this, you can use the [Big Query project](guides/getting-started/getting-set-up/setting-up-bigquery), which leverages public data sets.
* Basic understanding of Git.
* Basic understanding of SQL.

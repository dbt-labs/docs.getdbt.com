---
title: Getting started with dbt Cloud
id: getting-started
description: "Create your first dbt project using a SQL query."
---

At the heart of dbt is a dbt project where all of your SQL queries live. By centralizing projects, dbt is able to build software engineering-style guardrails for data analyst work. dbt enables you to collaborate on SQL queries using Git, then let's you run, test, and document those queries.

This guide will show you how to set up dbt Cloud and perform some key tasks. These tasks will illustrate how dbt establishes standard practices for your work.

In this guide, you will:

* Set up a warehouse with sample data
* Connect the warehouse to dbt Cloud
* Add a Git repository to dbt Cloud
* Execute a dbt transformation using dbt run
* Schedule a transformation

If you want a more in-depth learning experience, we recommend taking the dbt Fundamentals on our [dbt Learn online courses site](https://courses.getdbt.com/).

## Before you begin

Before you begin, you will need:

* Warehouse with sample data. If you don't have this, you can use the [Big Query project](tutorial/getting-set-up/setting-up-bigquery), which leverages public data sets.
* Basic understanding of Git.
* Basic understanding of SQL.

---
title: If models can only be `select` statements, how do I insert records?
description: "Incremental models to insert records"
sidebar_label: 'How to insert records'
id: insert-records

---

For those coming from an <Term id="etl" /> (Extract Transform Load) paradigm, there's often a desire to write transformations as `insert` and `update` statements. In comparison, dbt will wrap your `select` query in a `create table as` statement, which can feel counter-productive.

* If you wish to use `insert` statements for performance reasons (i.e. to reduce data that is processed), consider [incremental models](/docs/build/incremental-models)
* If you wish to use `insert` statements since your source data is constantly changing (e.g. to create "Type 2 Slowly Changing Dimensions"), consider [snapshotting your source data](/docs/build/sources#snapshotting-source-data-freshness), and building models on top of your snaphots.

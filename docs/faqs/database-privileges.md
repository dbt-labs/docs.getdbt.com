---
title: What privileges does my database user need to use dbt?
---

The process to create database credentials varies on each warehouse.

Your user will need to be able to:
* `select` from raw data in your warehouse (i.e. data to be transformed)
* `create` schemas (and therefore create tables/views within that
schema), OR the ability to `create` within an existing schema.
* read system views to generate documentation (i.e. views in
`information_schema`)

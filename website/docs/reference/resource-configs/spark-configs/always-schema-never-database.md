---
title: "Always schema, never database"
sidebar_label: "Schema, never database"
description: "Why you should use schema rather than database when configuring models with the dbt-spark adapter."
---

Apache Spark uses the terms "schema" and "database" interchangeably. dbt understands
`database` to exist at a higher level than `schema`. As such, you should _never_
use or set `database` as a node config or in the target profile when running dbt-spark.

If you want to control the schema/database in which dbt will materialize models,
use the `schema` config and `generate_schema_name` macro _only_.

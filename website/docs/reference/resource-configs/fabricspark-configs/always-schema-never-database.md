---
title: "Always schema, never database"
sidebar_label: "Always schema, never database"
description: "Fabric Spark treats schema and database interchangeably, so never set database as a node config or in your target profile."
---

Fabric Spark uses the terms "schema" and "database" interchangeably. dbt understands
`database` to exist at a higher level than `schema`. As such, you should _never_
use or set `database` as a node config or in the target profile when running dbt-fabricspark. 
Move over, the adapter does not support schemas within Lakehouse.

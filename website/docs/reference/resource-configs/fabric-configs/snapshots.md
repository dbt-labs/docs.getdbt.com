---
title: "Snapshots"
sidebar_label: "Snapshots"
description: "Columns in source tables used for snapshots in dbt-fabric cannot have any constraints, such as NOT NULL."
---

Columns in source tables can not have any constraints.
If, for example, any column has a `NOT NULL` constraint, an error will be thrown.

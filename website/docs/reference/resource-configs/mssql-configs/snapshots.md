---
title: "Snapshots"
sidebar_label: "Snapshots"
description: "Learn why columns in source tables used for snapshots cannot have constraints in Microsoft SQL Server."
---

Columns in source tables can not have any constraints.
If, for example, any column has a `NOT NULL` constraint, an error will be thrown.

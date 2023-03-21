---
title: Why is there only one `target_schema` for snapshots?
description: "Snapshots build into the same `target_schema`"
sidebar_label: 'Build snapshots into one `target_schema`'
id: snapshot-target-schema

---

Snapshots build into the same `target_schema`, no matter who is running them.

In comparison, models build into a separate schema for each user — this helps maintain separate development and production environments.

So, why the difference?

Let's assume you are running your snapshot regularly. If the model had a different target in `dev` (e.g. `dbt_claire`) compared to `prod` (e.g. `analytics`), when you `ref` the model in `dev`, dbt would select from a snapshot that has not been run regularly. This can make it hard to build models since the data differs from prod.

Instead, in the models that `ref` your snapshots, it makes more sense to `select` from the production version of your snapshot, even when developing models. In this way, snapshot tables are more similar to source data than they are to proper dbt models.

For this reason, there is only _one_ `target_schema`, which is _not_ environment-aware by default.

However, this can create problems if you need to run a `snapshot` command when developing your models, or during a CI run. Fortunately, there's a few workarounds — check out [this forum article](https://discourse.getdbt.com/t/using-dynamic-schemas-for-snapshots/1070).

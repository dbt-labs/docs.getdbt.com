---
title: "Persisting model descriptions"
sidebar_label: "Persisting model descriptions"
description: "Persist relation-level model descriptions so they appear in the Comment field when you describe or show tables."
---

Relation-level docs persistence is supported in dbt. For more
information on configuring docs persistence, see [the docs](/reference/resource-configs/persist_docs).

When the `persist_docs` option is configured appropriately, you'll be able to
see model descriptions in the `Comment` field of `describe [table] extended`
or `show table extended in [database] like '*'`.

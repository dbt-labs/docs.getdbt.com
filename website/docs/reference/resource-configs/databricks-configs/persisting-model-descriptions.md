---
title: "Persisting model descriptions"
sidebar_label: "Persisting model descriptions"
description: "Persist model descriptions as table comments in Databricks using the persist_docs config."
---

Relation-level docs persistence is supported. For more
information on configuring docs persistence, see [the docs](/reference/resource-configs/persist_docs).

When the `persist_docs` option is configured appropriately, you'll be able to
see model descriptions in the `Comment` field of `describe [table] extended`
or `show table extended in [database] like '*'`.

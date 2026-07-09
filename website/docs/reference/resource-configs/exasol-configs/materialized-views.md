---
title: "Materialized views"
sidebar_label: "Materialized views"
description: "Exasol does not support materialized views, so use table or incremental materializations as workarounds instead."
---

Exasol does not support materialized views. If you attempt to use `materialized='materialized_view'`, the operation will fail with an error.

### Workarounds

- Use `materialized='table'` with appropriate refresh logic
- Use `materialized='incremental'` with suitable [incremental strategies](/docs/build/incremental-strategy)

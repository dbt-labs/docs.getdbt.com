---
title: How we style our dbt models
id: 1-files-and-folders
---

## Fields and model names

- Each model should have a primary key.
- The primary key of a model should be named `<object>_id`, e.g. `account_id` – this makes it easier to know what `id` is being referenced in downstream joined models.
- Booleans should be prefixed with `is_` or `has_`.
- Timestamp columns should be named `<event>_at`, e.g. `created_at`, and should be in UTC. If a different timezone is being used, this should be indicated with a suffix, e.g `created_at_pt`.
- Price/revenue fields should be in decimal currency (e.g. `19.99` for $19.99; many app databases store prices as integers in cents). If non-decimal currency is used, indicate this with suffix, e.g. `price_in_cents`.
- Avoid reserved words as column names
- Consistency is key! Use the same field names across models where possible, e.g. a key to the `customers` table should be named `customer_id` rather than `user_id`.
- Schema, table and column names should be in `snake_case`.
- Use names based on the _business_ terminology, rather than the source terminology.
- For staging models, fields should be ordered in categories, where identifiers are first and timestamps are at the end.

---
title: "Session properties"
sidebar_label: "Session properties"
description: "Set Starburst and Trino session properties in your profile or per model to modify the configuration for your session."
---

With a Starburst Enterprise, Starburst Galaxy, or Trino cluster, you can [set session properties](https://trino.io/docs/current/sql/set-session.html) to modify the current configuration for your user session.

The standard way to define session properties is with the `session_properties` field of your `profiles.yml`. This ensures that all dbt connections use these settings by default.

However, to temporaily adjust these session properties for a specific dbt model or group of models, you can use a [dbt hook](/reference/resource-configs/pre-hook-post-hook) to set session properties on a specific dbt model. For example:

```sql
{{
  config(
    pre_hook="set session query_max_run_time='10m'"
  )
}}
```

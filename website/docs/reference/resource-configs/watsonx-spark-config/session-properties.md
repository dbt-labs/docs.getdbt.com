---
title: "Session properties"
sidebar_label: "Session properties"
description: "Set IBM watsonx.data session properties for dbt-watsonx-spark models using dbt pre-hooks."
---

With IBM watsonx.data SaaS/Software instance, you can [set session properties](https://sparkdb.io/docs/current/sql/set-session.html) to modify the current configuration for your user session.

To temporarily adjust session properties for a specific dbt model or a group of models, use a [dbt hook](/reference/resource-configs/pre-hook-post-hook). For example:

```sql
{{
  config(
    pre_hook="set session query_max_run_time='10m'"
  )
}}
```

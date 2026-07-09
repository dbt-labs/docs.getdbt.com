---
title: "Application macro"
sidebar_label: "Application macro"
description: "Use the application macro to run multiple DeltaStream SQL statements as a single all-or-nothing unit of work."
---

### Execute multiple statements as a unit

The `application` macro allows you to execute multiple DeltaStream SQL statements as a single unit of work with all-or-nothing semantics:

```bash
dbt run-operation application --args '{
  application_name: "my_data_pipeline",
  statements: [
    "USE DATABASE my_db",
    "CREATE STREAM user_events WITH (topic='"'"'events'"'"', value.format='"'"'json'"'"')",
    "CREATE MATERIALIZED VIEW user_counts AS SELECT user_id, COUNT(*) FROM user_events GROUP BY user_id"
  ]
}'
```

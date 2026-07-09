---
title: "Timestamp format"
sidebar_label: "Timestamp format"
description: "Set the default timestamp format for Exasol in your profile and handle timestamps correctly with the microbatch strategy."
---

Starting from dbt-exasol 1.2.2, the default timestamp format is `YYYY-MM-DDTHH:MI:SS.FF6`.

You can customize the timestamp format in your [profile configuration](/docs/local/connect-data-platform/exasol-setup):

<File name='profiles.yml'>

```yaml
outputs:
  dev:
    type: exasol
    timestamp_format: 'YYYY-MM-DD HH24:MI:SS.FF3'
    # ... other settings
```

</File>

### Microbatch strategy considerations

When using the [`microbatch`](/docs/build/incremental-microbatch) incremental strategy, Exasol requires timestamps without timezone suffix in model definitions:

```sql
-- ✅ Correct (Exasol compatible)
TIMESTAMP '2024-01-01 10:00:00'

-- ❌ Incorrect (will cause parse errors)
TIMESTAMP '2024-01-01 10:00:00-0'
```

The dbt-exasol adapter automatically handles timestamp formatting for microbatch boundaries.

For more information about the microbatch strategy, refer to the [microbatch documentation](/docs/build/incremental-microbatch).

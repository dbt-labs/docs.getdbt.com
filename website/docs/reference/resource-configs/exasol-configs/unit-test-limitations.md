---
title: "Unit test limitations"
sidebar_label: "Unit test limitations"
description: "Understand Exasol's unit test limitations around empty strings, cross-database testing, and aggregate functions in CTEs."
---

Exasol has specific limitations with [unit tests](/docs/build/unit-tests):

### Empty string handling

In Exasol, empty strings are treated as `NULL`. This affects test fixtures that use empty string literals to simulate empty values. When writing unit tests with seed data, be aware that:

```yaml
# This seed data
id,name,value
1,test,""  # Empty string

# Will be interpreted as
id,name,value
1,test,NULL  # NULL value in Exasol
```

### Cross-database testing

Unit tests that rely on sources in a database different from the models are not supported. All test fixtures and models must exist in the same database.

### Aggregate functions in CTEs

Exasol does not support certain aggregate functions (`LISTAGG`, `MEDIAN`, `PERCENTILE_CONT`) when used within common table expressions (CTEs) created from dbt's unit test fixtures. These functions require user-created tables.

**Workaround:** Create actual tables for test fixtures rather than using inline CTEs when testing models with these functions.

If you are interested in supporting materialized test fixtures, we encourage you to participate in this issue in GitHub: [dbt-labs/dbt-core#8499](https://github.com/dbt-labs/dbt-core/issues/8499)

---
title: "Arbitrary ATTACH options"
sidebar_label: "Arbitrary ATTACH options"
description: "Pass additional key-value pairs to DuckDB's ATTACH statement using the options dictionary in your profile."
---

For the basic `attach` profile syntax, refer to [Connecting to DuckDB](/docs/local/connect-data-platform/duckdb-setup#attaching-additional-databases). Use the `options` dictionary when you need to pass additional key-value pairs to DuckDB's `ATTACH` statement:

```yml
attach:
  - path: /tmp/db1.sqlite
    type: sqlite
    read_only: true
  - path: /tmp/special.duckdb
    options:
      cache_size: 1GB
      threads: 4
      enable_fsst: true
```

If you specify the same option in both a direct field (`type`, `secret`, `read_only`) and in the `options` dict, `dbt-duckdb` raises an error to prevent conflicts.

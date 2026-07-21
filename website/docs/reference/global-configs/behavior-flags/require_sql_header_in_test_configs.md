---
title: "sql_header in data tests"
id: "require_sql_header_in_test_configs"
sidebar_label: "require sql header in test configs"
---

| require_sql_header_in_test_configs | <Constant name="dbt" /> **Latest** | <Constant name="core" /> |
|---|---|---|
| Introduced | 2026.3 | 1.12.0 |
| Matured (default → `true`) | — | — |
| Removed | — | — |

Set the `require_sql_header_in_test_configs` flag to `true` to enable support for the [`sql_header`](/reference/resource-configs/sql_header) config for generic data tests. When enabled, you can set `sql_header` in the `config` of a generic data test at the model or column level in your `properties.yml` file. You can use `sql_header` to define SQL that should run before the test executes (for example, to create temporary functions, to set session parameters, or to declare variables required by the test query). dbt runs this SQL before executing the test.

For example:

<File name="models/properties.yml">

```yaml
models:
  - name: orders
    columns:
      - name: order_id
        data_tests:
          - not_null:
              name: not_null_orders_order_id
              config:
                sql_header: "-- SQL_HEADER_TEST_MARKER"
```

</File>

For more information, refer to [Data test configurations](/reference/data-test-configs).

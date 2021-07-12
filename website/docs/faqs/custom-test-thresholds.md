---
title: Can I set test failure thresholds?
---

This is not currently supported in dbt natively.

Instead, consider:
* Setting the [severity](resource-properties/tests#severity) to `warn`, or:
* Writing a [custom generic test](custom-generic-tests) that accepts a threshold argument ([example](https://discourse.getdbt.com/t/creating-an-error-threshold-for-schema-tests/966))

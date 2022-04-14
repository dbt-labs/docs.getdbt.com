---
title: Can I set test failure thresholds?
---

As of `v0.20.0`, you can use the `error_if` and `warn_if` configs to set custom failure thresholds in your tests. For more details, see [reference](reference/resource-configs/severity) for more information.

For dbt `v0.19.0` and earlier, you could try these possible solutions:
* Setting the [severity](resource-properties/tests#severity) to `warn`, or:
* Writing a [custom generic test](custom-generic-tests) that accepts a threshold argument ([example](https://discourse.getdbt.com/t/creating-an-error-threshold-for-schema-tests/966))

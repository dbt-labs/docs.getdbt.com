---
title: Can I set test failure thresholds?
---

Yes, as of `v0.20.0`, you can use the `error_if` + `warn_if` configs to set custom failure thresholds in your tests. See [reference](reference/resource-configs/severity) for more information.

If you are on an earlier version of dbt consider:
* Setting the [severity](resource-properties/tests#severity) to `warn`, or:
* Writing a [custom generic test](custom-generic-tests) that accepts a threshold argument ([example](https://discourse.getdbt.com/t/creating-an-error-threshold-for-schema-tests/966))

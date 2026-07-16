---
title: Can I set test failure thresholds?
description: "Use configs to set custom failure thresholds in tests"
sidebar_label: 'How to set failure thresholds in test'
id: custom-test-thresholds

---

You can use the `error_if` and `warn_if` configs to set custom failure thresholds in your tests. For more details, see [reference](/reference/resource-configs/severity) for more information.

You can also try the following solutions:

* Setting the [severity](/reference/resource-configs/severity) to `warn` or `error`
* Writing a [custom generic test](/best-practices/writing-custom-generic-tests) that accepts a threshold argument ([example](https://discourse.getdbt.com/t/creating-an-error-threshold-for-schema-tests/966))

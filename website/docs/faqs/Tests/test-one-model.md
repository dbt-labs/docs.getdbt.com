---
title: How do I test one model at a time?
description: "Use select flag to test one model at a time"
sidebar_label: 'Testing one model at a time'
id: test-one-model

---

Running tests on one model looks very similar to running a model: use the `--select` flag (or `-s` flag), followed by the name of the model:

```shell
dbt test --select customers
```

Check out the [model selection syntax documentation](/reference/node-selection/syntax) for full syntax, and [test selection examples](/reference/node-selection/test-selection-examples) in particular.

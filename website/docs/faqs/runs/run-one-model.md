---
title: How do I run one model at a time?
Description: “Use select flags to run one model at a time”
sidebar_label: ‘run one model at a time’
id: run-one-model

---

To run one model, use the `--select` flag (or `-s` flag), followed by the name of the model:


```
$ dbt run --select customers
```

Check out the [model selection syntax documentation](node-selection/syntax) for more operators and examples.

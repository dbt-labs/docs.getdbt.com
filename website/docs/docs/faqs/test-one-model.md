---
title: How do I test one model at a time?
---

Running tests on one model looks very similar to running a model: use the `--select` flag (or `-s` flag), followed by the name of the model:
```
dbt test --select customers
```

Check out the [model selection syntax documentation](node-selection/syntax) for full syntax, and [test selection examples](test-selection-examples) in particular.

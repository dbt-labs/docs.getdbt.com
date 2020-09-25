---
title: How do I test one model at a time?
---

Running tests on one model looks very similar to running a model: use the `--models` flag (or `-m` flag), followed by the name of the model:
```
dbt test --models customers
```

Check out the [model selection syntax documentation](node-selection/syntax) for more operators and examples.

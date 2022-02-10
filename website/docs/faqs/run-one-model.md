---
title: How do I run one model at a time?
---

To run one model, use the `--select` flag (or `-s` flag), followed by the name of the model:


```
$ dbt run --select customers 
```

For earlier dbt versions(before 0.21.0), use the `--models` flag, followed by the name of the model:


```
$ dbt run --models customers 
```


Check out the [model selection syntax documentation](node-selection/syntax) for more operators and examples.

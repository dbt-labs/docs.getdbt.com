---
title: How do I run one snapshot at a time?
---

To run one snapshot, use the `--select` flag, followed by the name of the snapshot:


```
$ dbt snapshot --select order_snapshot
```

Check out the [model selection syntax documentation](node-selection/syntax) for more operators and examples.

---
title: How do I run one snapshot at a time?
description: "Use select flags to run one snapshot at a time"
sidebar_label: 'run one snapshot at a time'
id: run-one-snapshot

---

To run one snapshot, use the `--select` flag, followed by the name of the snapshot:

```shell
$ dbt snapshot --select order_snapshot
```

Check out the [model selection syntax documentation](node-selection/syntax) for more operators and examples.

---
title: How do I run tests on sources only?
Description: “Use source select method to test sources”
sidebar_label: 'Run tests on sources'
id: test-sources

---

It is possible! You need to use the `source:` selection method:

```
$ dbt test --select source:*
```

Check out the [model selection syntax documentation](node-selection/test-selection-examples) for more operators and examples.

---
title: How do I run tests on sources only?
---

Because the test selection syntax grew out of the model selection syntax (and pre-dates sources), the syntax here is a little unintuitive, but it is possible!

```
$ dbt test --models source:*
```

Check out the [model selection syntax documentation](model-selection-syntax#test-selection-examples) for more operators and examples.

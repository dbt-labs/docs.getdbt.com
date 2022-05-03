---
title: How do I run models downstream of a seed?
---

You can run models downstream of a seed using the [model selection syntax](node-selection/syntax), and treating the seed like a model.

For example, the following would run all models downstream of a seed named `country_codes`:

```
$ dbt run --select country_codes+
```
